import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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

// Konstanta model Anthropic Claude yang digunakan
const MODEL_NAME = "claude-sonnet-5-5";

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
    } catch (err) {
      console.error("Gagal melakukan parse body JSON request:", err);
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
    // Langkah 2: Tentukan apakah mode Live Claude diizinkan
    // ─────────────────────────────────────────────────────────────
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isForceFallback = process.env.FORCE_FALLBACK === "true";
    const hasValidApiKey =
      Boolean(apiKey) &&
      apiKey !== "ISI_API_KEY_DI_SINI" &&
      apiKey!.trim() !== "";

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
    // Langkah 4: Mode Live diizinkan -> Jalankan Claude API
    // ─────────────────────────────────────────────────────────────
    const client = new Anthropic({ apiKey: apiKey! });
    const userMessageContent = buildUserMessage(inputData);

    const MAX_ATTEMPTS = 2;
    let parsedHasil: HasilAnalisis | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        // Panggil Claude API dengan batas timeout 20000ms
        const response = await client.messages.create(
          {
            model: MODEL_NAME,
            max_tokens: 4000,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: userMessageContent,
              },
            ],
          },
          { timeout: 20000 }
        );

        // Ambil teks dari blok konten bertipe 'text'
        let textContent = "";
        for (const block of response.content) {
          if (block.type === "text") {
            textContent += block.text;
          }
        }

        // Bersihkan pagar kode markdown dan ekstrak objek JSON
        const cleaned = textContent
          .replace(/```(?:json)?/gi, "")
          .replace(/```/g, "")
          .trim();

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          throw new Error("Objek JSON tidak ditemukan dalam respons Claude API");
        }

        const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
        const parsedJson = JSON.parse(jsonString);

        // Validasi hasil dengan HasilAnalisisSchema
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
      } catch (error) {
        console.error(
          `[Live Attempt ${attempt}/${MAX_ATTEMPTS}] Error saat memanggil Claude API:`,
          error
        );
        // Lanjut ke percobaan berikutnya jika masih ada sisa
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
    // jatuh ke fallback cerdas (status 200) dengan fallbackReason "api_error"
    // ─────────────────────────────────────────────────────────────
    console.error(
      "Live Claude API gagal setelah retry. Beralih ke fallback cadangan cerdas."
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
    // Langkah 8: Penanganan error tak terduga paling luar
    // ─────────────────────────────────────────────────────────────
    console.error("Terjadi error tak terduga pada route analisis:", unexpectedError);

    return NextResponse.json(
      { error: "Terjadi kesalahan tak terduga" },
      { status: 500 }
    );
  }
}
