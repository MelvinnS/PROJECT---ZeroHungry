import { NextResponse } from "next/server";
import {
  InputAnalisisSchema,
  HasilAnalisisSchema,
  type HasilAnalisis,
} from "@/lib/schemas";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";
import { getFallbackResult } from "@/lib/fallback";

// Konfigurasi runtime Node.js dan durasi maksimum eksekusi (60 detik)
export const runtime = "nodejs";
export const maxDuration = 60;

// Konstanta model Google Gemini dan timeout panggilan REST (45 detik)
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const API_TIMEOUT_MS = 45000;

/**
 * Fungsi pembantu untuk membuat delay buatan acak (700 - 1200 ms)
 * agar transisi loading di UI terlihat natural saat menggunakan mode cadangan statis.
 */
function createRandomDelay(minMs = 700, maxMs = 1200): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function POST(request: Request) {
  try {
    // ─────────────────────────────────────────────────────────────
    // Langkah 1: Parsing dan validasi request body JSON
    // ─────────────────────────────────────────────────────────────
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Input tidak valid",
          detail: { formErrors: ["Format JSON tidak valid"], fieldErrors: {} },
        },
        { status: 400 }
      );
    }

    // Validasi input data dengan InputAnalisisSchema (tetap 400 jika tidak valid)
    const parseInputResult = InputAnalisisSchema.safeParse(rawBody);
    if (!parseInputResult.success) {
      return NextResponse.json(
        {
          error: "Input tidak valid",
          detail: parseInputResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const inputData = parseInputResult.data;

    // ─────────────────────────────────────────────────────────────
    // Langkah 2: Tentukan apakah mode Live Gemini diizinkan
    // ─────────────────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isForceFallback = process.env.FORCE_FALLBACK === "true";
    const hasValidApiKey =
      Boolean(apiKey) &&
      apiKey !== "ISI_API_KEY_DI_SINI" &&
      apiKey !== "";

    // ─────────────────────────────────────────────────────────────
    // Langkah 3: Jika mode live TIDAK diizinkan, kembalikan Fallback
    // ─────────────────────────────────────────────────────────────
    if (isForceFallback || !hasValidApiKey) {
      const fallbackReason = isForceFallback ? "forced" : "no_api_key";
      await createRandomDelay();
      const fallbackData = getFallbackResult(inputData);
      return NextResponse.json(
        {
          data: fallbackData,
          source: "fallback",
          fallbackReason,
        },
        { status: 200 }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // Langkah 4: Mode Live diizinkan -> Jalankan Google Gemini via REST Fetch
    // ─────────────────────────────────────────────────────────────
    const userMessageContent = buildUserMessage(inputData);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessageContent }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 6000,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    };

    const MAX_ATTEMPTS = 2;
    let parsedHasil: HasilAnalisis | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const startTime = Date.now();

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey!,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        const durationMs = Date.now() - startTime;

        if (!res.ok) {
          console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=http_${res.status}`);
          // Jangan ulangi untuk error HTTP (401, 403, 404, 429, 500), langsung fallback
          break;
        }

        const data = (await res.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
            finishReason?: string;
          }>;
        };

        const candidate = data.candidates?.[0];
        const finishReason = candidate?.finishReason;

        // Jika MAX_TOKENS atau respons kosong/terblokir, anggap gagal
        if (finishReason === "MAX_TOKENS") {
          console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=max_tokens`);
          break;
        }

        const textContent =
          candidate?.content?.parts?.map((p) => p.text || "").join("") || "";

        if (!textContent.trim()) {
          console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=empty`);
          break;
        }

        // Bersihkan pagar kode markdown jika ada dan ekstrak objek JSON
        const cleaned = textContent
          .replace(/```(?:json)?/gi, "")
          .replace(/```/g, "")
          .trim();

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=parse`);
          // Hanya satu kali ulang untuk kegagalan parse
          if (attempt < MAX_ATTEMPTS) continue;
          break;
        }

        let parsedJson: unknown;
        try {
          const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
          parsedJson = JSON.parse(jsonString);
        } catch {
          console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=parse`);
          // Hanya satu kali ulang untuk kegagalan parse
          if (attempt < MAX_ATTEMPTS) continue;
          break;
        }

        // Validasi ketat hasil dengan HasilAnalisisSchema
        const parseHasilResult = HasilAnalisisSchema.safeParse(parsedJson);
        if (!parseHasilResult.success) {
          console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=zod`);
          // Hanya satu kali ulang untuk kegagalan zod
          if (attempt < MAX_ATTEMPTS) continue;
          break;
        }

        // Sukses
        console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=ok`);
        parsedHasil = parseHasilResult.data;
        break;
      } catch (error: unknown) {
        const durationMs = Date.now() - startTime;
        const errMsg = error instanceof Error ? error.message : String(error);
        const isTimeout =
          (error instanceof Error && error.name === "TimeoutError") ||
          errMsg.toLowerCase().includes("timeout") ||
          errMsg.toLowerCase().includes("aborted");

        const hasilLabel = isTimeout ? "timeout" : "error";
        console.log(`[Gemini] model=${MODEL} durasi=${durationMs}ms hasil=${hasilLabel}`);

        // Jangan ulangi untuk timeout / network error, langsung fallback
        break;
      }
    }

    // Jika pemanggilan live berhasil
    if (parsedHasil) {
      return NextResponse.json(
        {
          data: parsedHasil,
          source: "live",
        },
        { status: 200 }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // Langkah 5: Jika live gagal total (error API / timeout / JSON parse / Zod),
    // beralih ke fallback cerdas (status 200) dengan fallbackReason "api_error"
    // ─────────────────────────────────────────────────────────────
    await createRandomDelay();
    const fallbackData = getFallbackResult(inputData);
    return NextResponse.json(
      {
        data: fallbackData,
        source: "fallback",
        fallbackReason: "api_error",
      },
      { status: 200 }
    );
  } catch (unexpectedError) {
    // ─────────────────────────────────────────────────────────────
    // Langkah 6: Penanganan error tak terduga paling luar
    // ─────────────────────────────────────────────────────────────
    console.error("Terjadi error tak terduga pada route analisis:", unexpectedError);

    return NextResponse.json(
      { error: "Terjadi kesalahan tak terduga" },
      { status: 500 }
    );
  }
}
