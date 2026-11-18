import { z } from "zod";

// ─────────────────────────────────────────────
// A) Schema input dari pengguna
// ─────────────────────────────────────────────
export const InputAnalisisSchema = z.object({
  /** Nama bahan pangan yang akan dianalisis */
  nama: z.string().trim().min(2).max(80),

  /** Jumlah bahan (angka positif) */
  jumlah: z.number().positive(),

  /** Satuan jumlah bahan */
  satuan: z.enum(["kg", "gram", "buah", "porsi", "liter", "ikat"]),

  /** Deskripsi kondisi bahan saat ini */
  kondisi: z.string().trim().min(3).max(300),

  /** Tipe pengguna: rumah tangga atau pelaku usaha */
  tipe: z.enum(["rumah_tangga", "usaha"]),

  /** Alat memasak yang tersedia */
  alat: z
    .array(
      z.enum([
        "kompor",
        "oven",
        "air_fryer",
        "blender",
        "kukusan",
        "freezer",
        "tanpa_alat",
      ])
    )
    .default([]),

  /** Alergi atau pantangan makanan (opsional) */
  alergi: z.string().max(200).optional(),

  /** Daerah/kota pengguna (opsional, untuk menyesuaikan resep lokal) */
  daerah: z.string().max(60).optional(),
});

export type InputAnalisis = z.infer<typeof InputAnalisisSchema>;

// ─────────────────────────────────────────────
// B) Schema hasil analisis dari Claude (strict)
// ─────────────────────────────────────────────
export const HasilAnalisisSchema = z.object({
  /** Informasi bahan yang dianalisis */
  bahan: z.object({
    nama_standar: z.string(),
    kategori: z.enum([
      "sayur",
      "buah",
      "protein_hewani",
      "protein_nabati",
      "karbohidrat",
      "bumbu",
      "lainnya",
    ]),
    kondisi_input: z.string(),
  }),

  /** Penilaian keamanan pangan */
  keamanan: z.object({
    aman_dikonsumsi: z.enum(["aman", "waspada", "tidak_aman"]),
    alasan: z.string(),
    catatan: z.string().nullable(),
  }),

  /** Estimasi umur simpan bahan */
  umur_simpan: z.object({
    hari_min: z.number(),
    hari_maks: z.number(),
    urgensi: z.enum(["segar", "segera_olah", "kritis"]),
    tips_penyimpanan: z.string(),
  }),

  /** Metode pengawetan yang disarankan */
  pengawetan: z.array(
    z.object({
      metode: z.string(),
      cocok_karena: z.string(),
      langkah_singkat: z.array(z.string()),
      tambahan_umur_hari: z.number(),
      alat: z.array(z.string()),
    })
  ),

  /** Ide olahan dari bahan sisa */
  ide_olahan: z.array(
    z.object({
      nama: z.string(),
      deskripsi: z.string(),
      asal_daerah: z.string().nullable(),
      tingkat_kesulitan: z.enum(["mudah", "sedang", "sulit"]),
      durasi_menit: z.number(),
      alat_dibutuhkan: z.array(z.string()),
      bahan_tambahan: z.array(
        z.object({
          nama: z.string(),
          jumlah: z.string(),
        })
      ),
      langkah: z.array(z.string()),
      estimasi_biaya_rp: z.number(),
      estimasi_porsi: z.number(),
      umur_simpan_hasil_hari: z.number(),
      potensi_harga_jual_rp: z.number().nullable(),
      tips: z.string().nullable(),
    })
  ),

  /** Estimasi dampak positif dari pengolahan bahan */
  estimasi_dampak: z.object({
    persen_bahan_terselamatkan: z.number(),
  }),
});

export type HasilAnalisis = z.infer<typeof HasilAnalisisSchema>;
