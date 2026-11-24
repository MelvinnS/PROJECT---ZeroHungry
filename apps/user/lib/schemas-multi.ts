import { z } from "zod";
import {
  HasilAnalisisSchema,
} from "./schemas";

export const ItemBahanInputSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, "Nama bahan minimal 2 karakter.")
    .max(80, "Nama bahan maksimal 80 karakter."),
  jumlah: z.number().positive("Jumlah harus lebih besar dari 0."),
  satuan: z.enum(["kg", "gram", "buah", "porsi", "liter", "ikat"]),
  kondisi: z
    .string()
    .trim()
    .min(3, "Kondisi minimal 3 karakter.")
    .max(300, "Kondisi maksimal 300 karakter."),
});

export const InputMultiSchema = z
  .object({
    bahan: z
      .array(ItemBahanInputSchema)
      .min(1, "Minimal 1 bahan pangan.")
      .max(5, "Maksimal 5 bahan pangan."),
    tipe: z.enum(["rumah_tangga", "usaha"]),
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
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();
    data.bahan.forEach((item, index) => {
      const normalized = item.nama.trim().toLowerCase();
      if (!normalized) return;
      if (seen.has(normalized)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Nama bahan "${item.nama}" tidak boleh kembar.`,
          path: ["bahan", index, "nama"],
        });
      } else {
        seen.add(normalized);
      }
    });
  });

export type InputMulti = z.infer<typeof InputMultiSchema>;

export const ItemBahanHasilMultiSchema = z.object({
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
  keamanan: z.object({
    aman_dikonsumsi: z.enum(["aman", "waspada", "tidak_aman"]),
    alasan: z.string(),
    catatan: z.string().nullable(),
  }),
  umur_simpan: z.object({
    hari_min: z.number(),
    hari_maks: z.number(),
    urgensi: z.enum(["segar", "segera_olah", "kritis"]),
    tips_penyimpanan: z.string(),
  }),
  persen_terselamatkan: z.number().min(0).max(100),
});

export const IdeOlahanMultiSchema =
  HasilAnalisisSchema.shape.ide_olahan.element.extend({
    bahan_dipakai: z.array(z.string()),
  });

export const HasilMultiSchema = z.object({
  bahan: z.array(ItemBahanHasilMultiSchema).min(1).max(5),
  ide_olahan: z.array(IdeOlahanMultiSchema),
  pengawetan: HasilAnalisisSchema.shape.pengawetan,
});

export type HasilMulti = z.infer<typeof HasilMultiSchema>;
