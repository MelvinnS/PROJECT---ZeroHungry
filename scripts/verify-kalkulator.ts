import {
  hitungKalkulator,
  validasiInput,
  formatRupiah,
  formatKg,
  type InputKalkulator,
} from "../lib/kalkulator";

let hasError = false;

function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) {
    console.error(`❌ [GAGAL] ${label}: didapat ${actual}, diharapkan ${expected}`);
    hasError = true;
  } else {
    console.log(`✅ [LULUS] ${label}: ${actual}`);
  }
}

console.log("=== UJI KASUS A ===");
const inputA: InputKalkulator = {
  jumlahKg: 100,
  hargaMentahPerKg: 3000,
  susutPersen: 20,
  biayaOlahPerKg: 2000,
  rendemenPersen: 30,
  hargaOlahanPerKg: 25000,
  biayaTetap: 200000,
};

const resA = hitungKalkulator(inputA);
assertEqual(resA.pendapatanMentah, 240000, "Kasus A - pendapatanMentah");
assertEqual(resA.hasilOlahanKg, 30, "Kasus A - hasilOlahanKg");
assertEqual(resA.pendapatanOlahan, 750000, "Kasus A - pendapatanOlahan");
assertEqual(resA.biayaOlahTotal, 400000, "Kasus A - biayaOlahTotal");
assertEqual(resA.untungOlahan, 350000, "Kasus A - untungOlahan");
assertEqual(resA.selisih, 110000, "Kasus A - selisih");
assertEqual(resA.rekomendasi, "olah", "Kasus A - rekomendasi");
assertEqual(resA.selisihMarginPerKg, 3100, "Kasus A - selisihMarginPerKg");
assertEqual(resA.bepKg, 65, "Kasus A - bepKg");
assertEqual(resA.hargaOlahanImpas, 21334, "Kasus A - hargaOlahanImpas");
assertEqual(resA.limbahDicegahKg, 20, "Kasus A - limbahDicegahKg");

// Cek helpers
assertEqual(formatRupiah(resA.selisih), "Rp110.000", "Kasus A - formatRupiah");
assertEqual(formatKg(resA.limbahDicegahKg), "20", "Kasus A - formatKg");

console.log("\n=== UJI KASUS B ===");
const inputB: InputKalkulator = {
  ...inputA,
  hargaOlahanPerKg: 10000,
};

const resB = hitungKalkulator(inputB);
assertEqual(resB.untungOlahan, -100000, "Kasus B - untungOlahan");
assertEqual(resB.rekomendasi, "jual_mentah", "Kasus B - rekomendasi");
assertEqual(formatRupiah(resB.untungOlahan), "-Rp100.000", "Kasus B - formatRupiah negatif");

console.log("\n=== UJI KASUS C ===");
// (1) jumlah 0
const errJumlah = validasiInput({ ...inputA, jumlahKg: 0 });
if (!errJumlah.jumlahKg) {
  console.error("❌ [GAGAL] Kasus C - jumlah 0 tidak menghasilkan error");
  hasError = true;
} else {
  console.log(`✅ [LULUS] Kasus C - jumlah 0: "${errJumlah.jumlahKg}"`);
}

// (2) rendemen 0
const errRendemen0 = validasiInput({ ...inputA, rendemenPersen: 0 });
if (!errRendemen0.rendemenPersen) {
  console.error("❌ [GAGAL] Kasus C - rendemen 0 tidak menghasilkan error");
  hasError = true;
} else {
  console.log(`✅ [LULUS] Kasus C - rendemen 0: "${errRendemen0.rendemenPersen}"`);
}

// (3) rendemen 101
const errRendemen101 = validasiInput({ ...inputA, rendemenPersen: 101 });
if (!errRendemen101.rendemenPersen) {
  console.error("❌ [GAGAL] Kasus C - rendemen 101 tidak menghasilkan error");
  hasError = true;
} else {
  console.log(`✅ [LULUS] Kasus C - rendemen 101: "${errRendemen101.rendemenPersen}"`);
}

// (4) nilai negatif (hargaMentah, susut, biayaOlah, hargaOlahan, biayaTetap)
const errNegatif = validasiInput({
  jumlahKg: -10,
  hargaMentahPerKg: -500,
  susutPersen: -5,
  biayaOlahPerKg: -100,
  rendemenPersen: -20,
  hargaOlahanPerKg: -1000,
  biayaTetap: -50000,
});

if (
  errNegatif.jumlahKg &&
  errNegatif.hargaMentahPerKg &&
  errNegatif.susutPersen &&
  errNegatif.biayaOlahPerKg &&
  errNegatif.rendemenPersen &&
  errNegatif.hargaOlahanPerKg &&
  errNegatif.biayaTetap
) {
  console.log("✅ [LULUS] Kasus C - semua nilai negatif tertangkap validasi");
} else {
  console.error("❌ [GAGAL] Kasus C - ada nilai negatif yang lolos validasi:", errNegatif);
  hasError = true;
}

if (hasError) {
  console.error("\n❌ Verifikasi kalkulator gagal!");
  process.exit(1);
} else {
  console.log("\n🎉 Semua uji verifikasi kalkulator berhasil!");
  process.exit(0);
}
