import { NextResponse } from "next/server";
import {
  InputAnalisisSchema,
  HasilAnalisisSchema,
  type HasilAnalisis,
} from "@/lib/schemas";
import { SYSTEM_PROMPT, buildUserMessage } from "@/server/ai/prompts";
import { getFallbackResult } from "@/server/ai/fallback";
import { panggilGeminiRantai } from "@/server/ai/gemini";

// Konfigurasi runtime Node.js dan durasi maksimum eksekusi (60 detik)
export const runtime = "nodejs";
export const maxDuration = 60;

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
    // Langkah 4: Mode Live diizinkan -> Jalankan Google Gemini via helper rantai model
    // ─────────────────────────────────────────────────────────────
    const userMessageContent = buildUserMessage(inputData);
    const parsedHasil = await panggilGeminiRantai<HasilAnalisis>({
      systemPrompt: SYSTEM_PROMPT,
      userMessage: userMessageContent,
      validasi: (json) => HasilAnalisisSchema.safeParse(json),
    });

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
