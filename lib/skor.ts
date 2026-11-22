/**
 * lib/skor.ts
 * Fungsi murni perhitungan dampak penyelamatan pangan:
 * kg diselamatkan, rupiah dihemat, dan porsi makanan.
 */

export type SatuanBahan = "kg" | "gram" | "liter" | "porsi" | "buah" | "ikat";

export type KategoriBahan =
  | "sayur"
  | "buah"
  | "protein_hewani"
  | "protein_nabati"
  | "karbohidrat"
  | "bumbu"
  | "lainnya";

export type KeamananPangan = "aman" | "waspada" | "tidak_aman";

export interface InputSkor {
  jumlah: number;
  satuan: string;
  kategori: string;
  keamanan: string;
  persenTerselamatkan: number;
}

export interface HasilSkor {
  kg: number;
  rupiah: number;
  porsi: number;
}

/**
 * Konversi satuan bahan ke kilogram (kg per satuan).
 */
export const FAKTOR_SATUAN_KG: Record<string, number> = {
  kg: 1,
  gram: 0.001,
  liter: 1,
  porsi: 0.25,
  buah: 0.2,
  ikat: 0.3,
};

/**
 * Faktor pengali keamanan pangan:
 * aman = 1, waspada = 0.5, tidak_aman = 0.
 */
export const FAKTOR_KEAMANAN: Record<string, number> = {
  aman: 1,
  waspada: 0.5,
  tidak_aman: 0,
};

/**
 * Estimasi harga rupiah per kg bahan berdasarkan kategori pangan.
 */
export const HARGA_PER_KG: Record<string, number> = {
  sayur: 15000,
  buah: 20000,
  protein_hewani: 60000,
  protein_nabati: 20000,
  karbohidrat: 12000,
  bumbu: 40000,
  lainnya: 15000,
};

/**
 * Menghitung skor dampak penyelamatan pangan:
 * - kgInput: kg=1, gram=/1000, liter=1, porsi=0.25, buah=0.2, ikat=0.3 (per satuan)
 * - faktorKeamanan: aman=1, waspada=0.5, tidak_aman=0
 * - kg = kgInput × (persenTerselamatkan/100, dibatasi 0-100) × faktorKeamanan
 * - rupiah = kg × harga; porsi = kg × 4
 * - Bulatkan kg ke 2 desimal, rupiah dan porsi ke bilangan bulat.
 */
export function hitungSkor({
  jumlah,
  satuan,
  kategori,
  keamanan,
  persenTerselamatkan,
}: InputSkor): HasilSkor {
  const safeJumlah = Math.max(0, Number(jumlah) || 0);

  const faktorSatuan = FAKTOR_SATUAN_KG[satuan.toLowerCase()] ?? 1;
  const beratMentahKg = safeJumlah * faktorSatuan;

  const faktorKeamanan = FAKTOR_KEAMANAN[keamanan.toLowerCase()] ?? 0;

  // Batasi persenTerselamatkan antara 0 dan 100
  const clampedPersen = Math.min(100, Math.max(0, Number(persenTerselamatkan) || 0));

  const rawKg = beratMentahKg * (clampedPersen / 100) * faktorKeamanan;
  const kg = Math.round(rawKg * 100) / 100;

  const hargaPerKg = HARGA_PER_KG[kategori.toLowerCase()] ?? HARGA_PER_KG.lainnya;
  const rupiah = Math.round(rawKg * hargaPerKg);
  const porsi = Math.round(rawKg * 4);

  return {
    kg,
    rupiah,
    porsi,
  };
}
