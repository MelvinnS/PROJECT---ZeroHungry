import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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

// Konstanta model Google Gemini yang digunakan
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
    // Langkah 4: Mode Live diizinkan -> Jalankan Google Gemini API
    // ─────────────────────────────────────────────────────────────
    const ai = new GoogleGenAI({ apiKey: apiKey! });
    const userMessageContent = buildUserMessage(inputData);

    const MAX_ATTEMPTS = 2;
    let parsedHasil: HasilAnalisis | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await ai.models.generateContent({
          model: MODEL,
          contents: userMessageContent,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            temperature: 0.4,
            maxOutputTokens: 8192,
            thinkingConfig: { thinkingBudget: 0 },
            abortSignal: controller.signal,
          },
        });

        clearTimeout(timeoutId);

        const textContent = response.text || "";

        // Bersihkan pagar kode markdown jika ada dan ekstrak objek JSON
        const cleaned = textContent
          .replace(/```(?:json)?/gi, "")
          .replace(/```/g, "")
          .trim();

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          throw new Error("Objek JSON tidak ditemukan dalam respons Gemini API");
        }

        const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
        const parsedJson = JSON.parse(jsonString);

        // Validasi ketat hasil dengan HasilAnalisisSchema
        const parseHasilResult = HasilAnalisisSchema.safeParse(parsedJson);
        if (!parseHasilResult.success) {
          throw new Error(
            `Validasi skema hasil gagal: ${JSON.stringify(
              parseHasilResult.error.flatten()
            )}`
          );
        }

        // Berhasil mendapatkan respons live yang valid
        parsedHasil = parseHasilResult.data;
        break;
      } catch (error: unknown) {
        clearTimeout(timeoutId);

        const errMsg = error instanceof Error ? error.message : String(error);
        const errStatus =
          typeof error === "object" && error !== null && "status" in error
            ? (error as { status: number }).status
            : undefined;

        console.error(
          `[Live Gemini Percobaan ${attempt}/${MAX_ATTEMPTS}] Error: ${errMsg}`
        );

        // JANGAN mengulang pada error 429 (rate limit) atau 401/403
        const isNonRetryable =
          errStatus === 429 ||
          errStatus === 401 ||
          errStatus === 403 ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("quota") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("401") ||
          errMsg.includes("403") ||
          errMsg.includes("API_KEY_INVALID");

        if (isNonRetryable) {
          break;
        }
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
    console.error(
      "Live Gemini API gagal. Beralih ke fallback cadangan cerdas."
    );
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
