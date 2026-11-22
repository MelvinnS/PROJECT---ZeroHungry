import { z } from "zod";
import { POST } from "../app/api/chef/route";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ GAGAL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ LULUS: ${msg}`);
  }
}

// Schema yang sama dengan route.ts untuk pengujian mandiri
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
          .array(z.object({ nama: z.string(), jumlah: z.string() }))
          .max(12),
        langkah: z.array(z.string().max(300)).max(8),
      })
      .optional(),
  }),
});

async function runTests() {
  console.log("=== MEMULAI VERIFIKASI CHEF ===\n");

  // 1. Menolak pesan kosong
  const kosong = ChefBodySchema.safeParse({
    pesan: "",
    riwayat: [],
    konteks: { bahan: [{ nama: "Pisang", keamanan: "aman", sisa: "2-3 hari" }] },
  });
  assert(!kosong.success, "Schema menolak pesan kosong");

  // 2. Menolak pesan >500 karakter
  const terlampauPanjang = ChefBodySchema.safeParse({
    pesan: "a".repeat(501),
    riwayat: [],
    konteks: { bahan: [{ nama: "Pisang", keamanan: "aman", sisa: "2-3 hari" }] },
  });
  assert(!terlampauPanjang.success, "Schema menolak pesan >500 karakter");

  // 3. Menolak riwayat >6 entri
  const riwayatTerlalu = ChefBodySchema.safeParse({
    pesan: "Bagaimana langkah pertama?",
    riwayat: Array.from({ length: 7 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "chef",
      teks: `Pesan ${i}`,
    })),
    konteks: { bahan: [{ nama: "Pisang", keamanan: "aman", sisa: "2-3 hari" }] },
  });
  assert(!riwayatTerlalu.success, "Schema menolak riwayat >6 entri");

  // 4. Menerima input valid
  const valid = ChefBodySchema.safeParse({
    pesan: "Apa pengganti mentega?",
    riwayat: [{ role: "user", teks: "Halo chef" }, { role: "chef", teks: "Halo!" }],
    konteks: { bahan: [{ nama: "Pisang", keamanan: "aman", sisa: "2-3 hari" }] },
  });
  assert(valid.success, "Schema menerima input valid");

  // 5. API: GEMINI_API_KEY kosong → 200 dengan offline=true
  const origKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const req1 = new Request("http://localhost:3000/api/chef", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pesan: "Langkah pertama gimana?",
      riwayat: [],
      konteks: {
        bahan: [{ nama: "Pisang", keamanan: "aman", sisa: "2-3 hari" }],
      },
    }),
  });

  const res1 = await POST(req1);
  const json1 = await res1.json();
  assert(res1.status === 200, "API key kosong → status 200");
  assert(json1.offline === true, "API key kosong → offline: true");
  assert(typeof json1.jawaban === "string", "API key kosong → ada field jawaban");

  if (origKey !== undefined) {
    process.env.GEMINI_API_KEY = origKey;
  }

  // 6. API: Body ngawur → 400
  const req2 = new Request("http://localhost:3000/api/chef", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pesan: 12345, riwayat: "bukan_array", konteks: null }),
  });

  const res2 = await POST(req2);
  assert(res2.status === 400, "Body ngawur → status 400");

  console.log("\n=== SEMUA PENGUJIAN CHEF BERHASIL ===");
}

runTests();
