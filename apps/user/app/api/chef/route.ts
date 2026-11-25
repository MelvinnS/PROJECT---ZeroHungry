import { NextResponse } from "next/server";
import { z } from "zod";
import { SYSTEM_PROMPT_CHEF, buildUserMessageChef } from "@/server/ai/prompts-chef";
import { panggilGeminiRantai } from "@/server/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

// ─── Schema validasi body POST ───────────────────────────────────────────────
const ChefBodySchema = z.object({
  pesan: z.string().trim().min(1).max(500),
  riwayat: z
    .array(
      z.object({
        role: z.enum(["user", "chef"]),
        teks: z.string().max(800),
      })
    )
    .max(6)
    .default([]),
  konteks: z.object({
    bahan: z
      .array(
        z.object({
          nama: z.string().max(80),
          keamanan: z.enum(["aman", "waspada", "tidak_aman"]),
          sisa: z.string().max(40),
        })
      )
      .max(5),
    resep: z
      .object({
        nama: z.string(),
        bahan_tambahan: z
          .array(
            z.object({
              nama: z.string(),
              jumlah: z.string(),
            })
          )
          .max(12),
        langkah: z.array(z.string().max(300)).max(8),
      })
      .optional(),
  }),
});

// ─── Schema validasi respons Gemini ──────────────────────────────────────────
const ChefResponseSchema = z.object({
  jawaban: z.string().min(1).max(1200),
});

// ─── Rate limiter in-memory sederhana ────────────────────────────────────────
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Bersihkan entri kadaluarsa
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // Rate limit tercapai
  }

  entry.count += 1;
  return true;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  // Ambil IP dari header x-forwarded-for atau fallback ke "anon"
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";

  // Rate limit check
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak pertanyaan. Coba lagi beberapa menit lagi." },
      { status: 429 }
    );
  }

  // Parse body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format JSON tidak valid." },
      { status: 400 }
    );
  }

  // Validasi input
  const parseResult = ChefBodySchema.safeParse(rawBody);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Input tidak valid.",
        detail: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { pesan, riwayat, konteks } = parseResult.data;

  // Periksa mode live
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isForceFallback = process.env.FORCE_FALLBACK === "true";
  const hasValidApiKey =
    Boolean(apiKey) &&
    apiKey !== "ISI_API_KEY_DI_SINI" &&
    apiKey !== "";

  if (isForceFallback || !hasValidApiKey) {
    return NextResponse.json(
      {
        offline: true,
        jawaban: "Chef sedang offline. Coba lagi nanti.",
      },
      { status: 200 }
    );
  }

  // Log ringkas tanpa isi pesan
  console.log(
    `[Chef] ip=${ip.substring(0, 8)}*** jumlahRiwayat=${riwayat.length} jumlahBahan=${konteks.bahan.length}`
  );

  // Panggil Gemini
  const userMessage = buildUserMessageChef({ konteks, riwayat, pesan });
  const hasil = await panggilGeminiRantai<{ jawaban: string }>({
    systemPrompt: SYSTEM_PROMPT_CHEF,
    userMessage,
    validasi: (json) => ChefResponseSchema.safeParse(json),
  });

  if (hasil && hasil.jawaban) {
    return NextResponse.json({ jawaban: hasil.jawaban }, { status: 200 });
  }

  // Fallback jika Gemini gagal
  return NextResponse.json(
    {
      offline: true,
      jawaban: "Chef sedang sibuk. Coba tanya lagi sebentar lagi.",
    },
    { status: 200 }
  );
}
