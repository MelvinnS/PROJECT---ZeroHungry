/**
 * Logika bisnis Kalkulator Mentah vs Olahan
 * Fungsi murni tanpa ketergantungan pada React.
 */

export type InputKalkulator = {
  jumlahKg: number;
  hargaMentahPerKg: number;
  susutPersen: number; // 0-100, bahan terbuang bila dijual mentah
  biayaOlahPerKg: number; // per kg bahan mentah
  rendemenPersen: number; // 1-100, persen berat hasil olahan dari bahan mentah
  hargaOlahanPerKg: number; // per kg hasil olahan
  biayaTetap: number; // alat/kemasan/dll per batch
};

export type RekomendasiKalkulator = "olah" | "jual_mentah" | "setara";

export type HasilKalkulator = {
  kgTerjualMentah: number;
  pendapatanMentah: number;
  untungMentah: number;
  hasilOlahanKg: number;
  pendapatanOlahan: number;
  biayaOlahTotal: number;
  untungOlahan: number;
  selisih: number;
  rekomendasi: RekomendasiKalkulator;
  marginPerKgOlah: number;
  marginPerKgMentah: number;
  selisihMarginPerKg: number;
  bepKg: number | null;
  hargaOlahanImpas: number | null;
  limbahDicegahKg: number;
};

export type ErrorValidasiKalkulator = Partial<
  Record<keyof InputKalkulator, string>
>;

/**
 * Melakukan perhitungan perbandingan mentah vs olahan.
 */
export function hitungKalkulator(input: InputKalkulator): HasilKalkulator {
  const {
    jumlahKg,
    hargaMentahPerKg,
    susutPersen,
    biayaOlahPerKg,
    rendemenPersen,
    hargaOlahanPerKg,
    biayaTetap,
  } = input;

  // Skenario Jual Mentah
  const kgTerjualMentah = (jumlahKg * (100 - susutPersen)) / 100;
  const pendapatanMentah = kgTerjualMentah * hargaMentahPerKg;
  const untungMentah = pendapatanMentah; // Biaya bahan mentah dianggap sama di kedua skenario

  // Skenario Olah Dulu
  const hasilOlahanKg = (jumlahKg * rendemenPersen) / 100;
  const pendapatanOlahan = hasilOlahanKg * hargaOlahanPerKg;
  const biayaOlahTotal = jumlahKg * biayaOlahPerKg + biayaTetap;
  const untungOlahan = pendapatanOlahan - biayaOlahTotal;

  // Perbandingan & Rekomendasi
  const selisih = untungOlahan - untungMentah;
  let rekomendasi: RekomendasiKalkulator = "setara";
  if (selisih > 0) {
    rekomendasi = "olah";
  } else if (selisih < 0) {
    rekomendasi = "jual_mentah";
  }

  // Margin per kg bahan
  const marginPerKgOlah =
    (hargaOlahanPerKg * rendemenPersen) / 100 - biayaOlahPerKg;
  const marginPerKgMentah = (hargaMentahPerKg * (100 - susutPersen)) / 100;
  const selisihMarginPerKg = marginPerKgOlah - marginPerKgMentah;

  // BEP (Break-Even Point) Bahan dalam Kg
  let bepKg: number | null = null;
  if (selisihMarginPerKg > 0) {
    if (biayaTetap > 0) {
      bepKg = Math.ceil(biayaTetap / selisihMarginPerKg);
    } else {
      bepKg = 0;
    }
  } else {
    bepKg = null; // Tidak pernah tercapai jika margin olah tidak lebih besar dari mentah
  }

  // Harga Olahan Impas per kg hasil
  let hargaOlahanImpas: number | null = null;
  if (hasilOlahanKg > 0) {
    hargaOlahanImpas = Math.ceil((untungMentah + biayaOlahTotal) / hasilOlahanKg);
  }

  // Limbah dicegah (hanya bermakna jika rekomendasi "olah")
  const limbahDicegahKg = (jumlahKg * susutPersen) / 100;

  return {
    kgTerjualMentah,
    pendapatanMentah,
    untungMentah,
    hasilOlahanKg,
    pendapatanOlahan,
    biayaOlahTotal,
    untungOlahan,
    selisih,
    rekomendasi,
    marginPerKgOlah,
    marginPerKgMentah,
    selisihMarginPerKg,
    bepKg,
    hargaOlahanImpas,
    limbahDicegahKg,
  };
}

/**
 * Validasi input kalkulator.
 * Mengembalikan objek pesan error berbahasa Indonesia per field jika tidak valid.
 */
export function validasiInput(
  input: Partial<InputKalkulator>
): ErrorValidasiKalkulator {
  const errors: ErrorValidasiKalkulator = {};

  if (
    input.jumlahKg === undefined ||
    input.jumlahKg === null ||
    Number.isNaN(input.jumlahKg)
  ) {
    errors.jumlahKg = "Jumlah bahan wajib diisi";
  } else if (input.jumlahKg <= 0) {
    errors.jumlahKg = "Jumlah bahan harus lebih dari 0 kg";
  }

  if (
    input.hargaMentahPerKg === undefined ||
    input.hargaMentahPerKg === null ||
    Number.isNaN(input.hargaMentahPerKg)
  ) {
    errors.hargaMentahPerKg = "Harga jual mentah wajib diisi";
  } else if (input.hargaMentahPerKg < 0) {
    errors.hargaMentahPerKg = "Harga jual mentah tidak boleh negatif";
  }

  if (
    input.susutPersen === undefined ||
    input.susutPersen === null ||
    Number.isNaN(input.susutPersen)
  ) {
    errors.susutPersen = "Perkiraan susut wajib diisi";
  } else if (input.susutPersen < 0 || input.susutPersen > 100) {
    errors.susutPersen = "Persen susut harus antara 0% dan 100%";
  }

  if (
    input.biayaOlahPerKg === undefined ||
    input.biayaOlahPerKg === null ||
    Number.isNaN(input.biayaOlahPerKg)
  ) {
    errors.biayaOlahPerKg = "Biaya olah wajib diisi";
  } else if (input.biayaOlahPerKg < 0) {
    errors.biayaOlahPerKg = "Biaya olah tidak boleh negatif";
  }

  if (
    input.rendemenPersen === undefined ||
    input.rendemenPersen === null ||
    Number.isNaN(input.rendemenPersen)
  ) {
    errors.rendemenPersen = "Rendemen olahan wajib diisi";
  } else if (input.rendemenPersen < 1 || input.rendemenPersen > 100) {
    errors.rendemenPersen = "Rendemen harus antara 1% dan 100%";
  }

  if (
    input.hargaOlahanPerKg === undefined ||
    input.hargaOlahanPerKg === null ||
    Number.isNaN(input.hargaOlahanPerKg)
  ) {
    errors.hargaOlahanPerKg = "Harga jual olahan wajib diisi";
  } else if (input.hargaOlahanPerKg < 0) {
    errors.hargaOlahanPerKg = "Harga jual olahan tidak boleh negatif";
  }

  if (
    input.biayaTetap === undefined ||
    input.biayaTetap === null ||
    Number.isNaN(input.biayaTetap)
  ) {
    errors.biayaTetap = "Biaya tetap wajib diisi";
  } else if (input.biayaTetap < 0) {
    errors.biayaTetap = "Biaya tetap tidak boleh negatif";
  }

  return errors;
}

/**
 * Format angka ke format mata uang Rupiah Indonesia (tanpa desimal).
 * Contoh: 1250000 -> "Rp1.250.000", -100000 -> "-Rp100.000"
 */
export function formatRupiah(n: number): string {
  const isNegative = n < 0;
  const absVal = Math.abs(Math.round(n));
  const formatted = absVal.toLocaleString("id-ID");
  return isNegative ? `-Rp${formatted}` : `Rp${formatted}`;
}

/**
 * Format berat bahan dalam kilogram (maksimal 1 desimal).
 * Contoh: 20 -> "20", 20.5 -> "20,5"
 */
export function formatKg(n: number): string {
  return Number(n.toFixed(1)).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  });
}
