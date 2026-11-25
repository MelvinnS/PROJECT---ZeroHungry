import { NextResponse } from "next/server";
import {
  InputMultiSchema,
  HasilMultiSchema,
  type InputMulti,
  type HasilMulti,
} from "@/lib/schemas-multi";
import type { InputAnalisis } from "@/lib/schemas";
import { SYSTEM_PROMPT_MULTI, buildUserMessageMulti } from "@/server/ai/prompts-multi";
import { getFallbackResult } from "@/server/ai/fallback";
import { panggilGeminiRantai } from "@/server/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Delay buatan acak (700 - 1200 ms) untuk simulasi loading fallback yang natural
 */
function createRandomDelay(minMs = 700, maxMs = 1200): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Menyusun data fallback multi-bahan dengan menilai masing-masing bahan
 * lewat getFallbackResult tanpa menggabungkan resep secara acak.
 */
function buatFallbackMulti(inputData: InputMulti): HasilMulti {
  const listBahan = inputData.bahan.map((b) => {
    const inputTunggal: InputAnalisis = {
      nama: b.nama,
      jumlah: b.jumlah,
      satuan: b.satuan,
      kondisi: b.kondisi,
      tipe: inputData.tipe,
      alat: inputData.alat,
    };
    const fb = getFallbackResult(inputTunggal);
    return {
      nama_standar: fb.bahan.nama_standar,
      kategori: fb.bahan.kategori,
      kondisi_input: fb.bahan.kondisi_input,
      keamanan: fb.keamanan,
      umur_simpan: fb.umur_simpan,
      persen_terselamatkan: fb.estimasi_dampak.persen_bahan_terselamatkan,
    };
  });

  return {
    bahan: listBahan,
    ide_olahan: [],
    pengawetan: [],
  };
}

export async function POST(request: Request) {
  try {
    // 1. Parsing body
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

    // 2. Validasi input
    const parseInputResult = InputMultiSchema.safeParse(rawBody);
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

    // 3. Tentukan apakah mode live diizinkan
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isForceFallback = process.env.FORCE_FALLBACK === "true";
    const hasValidApiKey =
      Boolean(apiKey) &&
      apiKey !== "ISI_API_KEY_DI_SINI" &&
      apiKey !== "";

    if (isForceFallback || !hasValidApiKey) {
      const fallbackReason = isForceFallback ? "forced" : "no_api_key";
      await createRandomDelay();
      const fallbackData = buatFallbackMulti(inputData);
      return NextResponse.json(
        {
          data: fallbackData,
          source: "fallback",
          fallbackReason,
        },
        { status: 200 }
      );
    }

    // 4. Mode Live via Gemini Rantai
    const userMessageContent = buildUserMessageMulti(inputData);
    const parsedHasil = await panggilGeminiRantai<HasilMulti>({
      systemPrompt: SYSTEM_PROMPT_MULTI,
      userMessage: userMessageContent,
      validasi: (json) => HasilMultiSchema.safeParse(json),
    });

    if (parsedHasil) {
      return NextResponse.json(
        {
          data: parsedHasil,
          source: "live",
        },
        { status: 200 }
      );
    }

    // 5. Jika mode live gagal (timeout/api error), fallback cerdas
    await createRandomDelay();
    const fallbackData = buatFallbackMulti(inputData);
    return NextResponse.json(
      {
        data: fallbackData,
        source: "fallback",
        fallbackReason: "api_error",
      },
      { status: 200 }
    );
  } catch (unexpectedError) {
    console.error("Terjadi error tak terduga pada route analisis-multi:", unexpectedError);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal tak terduga." },
      { status: 500 }
    );
  }
}
