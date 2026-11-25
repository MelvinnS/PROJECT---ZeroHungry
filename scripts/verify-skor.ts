import { hitungSkor, FAKTOR_SATUAN_KG, FAKTOR_KEAMANAN, HARGA_PER_KG } from "../apps/user/server/services/skor";

let hasError = false;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    hasError = true;
  } else {
    console.log(`✅ [PASS] ${message}`);
  }
}

console.log("=== Verifikasi lib/skor.ts ===");

// Kasus 1: pisang 1 kg aman 95% → kg 0.95, rupiah 19000, porsi 4
const k1 = hitungSkor({
  jumlah: 1,
  satuan: "kg",
  kategori: "buah",
  keamanan: "aman",
  persenTerselamatkan: 95,
});
assert(k1.kg === 0.95, `Kasus 1 kg: didapat ${k1.kg}, diharapkan 0.95`);
assert(k1.rupiah === 19000, `Kasus 1 rupiah: didapat ${k1.rupiah}, diharapkan 19000`);
assert(k1.porsi === 4, `Kasus 1 porsi: didapat ${k1.porsi}, diharapkan 4`);

// Kasus 2: 500 gram sayur waspada 80% → kg 0.2
// berat: 0.5 kg * 0.8 * 0.5 = 0.2 kg; harga: 0.2 * 15000 = 3000; porsi: 0.2 * 4 = 1 (0.8 bulat ke 1)
const k2 = hitungSkor({
  jumlah: 500,
  satuan: "gram",
  kategori: "sayur",
  keamanan: "waspada",
  persenTerselamatkan: 80,
});
assert(k2.kg === 0.2, `Kasus 2 kg: didapat ${k2.kg}, diharapkan 0.2`);
assert(k2.rupiah === 3000, `Kasus 2 rupiah: didapat ${k2.rupiah}, diharapkan 3000`);
assert(k2.porsi === 1, `Kasus 2 porsi: didapat ${k2.porsi}, diharapkan 1`);

// Kasus 3: tidak_aman → 0
const k3 = hitungSkor({
  jumlah: 2,
  satuan: "kg",
  kategori: "protein_hewani",
  keamanan: "tidak_aman",
  persenTerselamatkan: 100,
});
assert(k3.kg === 0, `Kasus 3 kg tidak_aman: didapat ${k3.kg}, diharapkan 0`);
assert(k3.rupiah === 0, `Kasus 3 rupiah tidak_aman: didapat ${k3.rupiah}, diharapkan 0`);
assert(k3.porsi === 0, `Kasus 3 porsi tidak_aman: didapat ${k3.porsi}, diharapkan 0`);

// Kasus 4: satuan buah (misal 5 buah buah aman 100% → 5 * 0.2 = 1.0 kg)
const k4 = hitungSkor({
  jumlah: 5,
  satuan: "buah",
  kategori: "buah",
  keamanan: "aman",
  persenTerselamatkan: 100,
});
assert(k4.kg === 1, `Kasus 4 kg satuan buah: didapat ${k4.kg}, diharapkan 1`);
assert(k4.rupiah === 20000, `Kasus 4 rupiah: didapat ${k4.rupiah}, diharapkan 20000`);
assert(k4.porsi === 4, `Kasus 4 porsi: didapat ${k4.porsi}, diharapkan 4`);

// Kasus 5: persen > 100 dibatasi (misal 150% dibatasi ke 100%)
const k5 = hitungSkor({
  jumlah: 1,
  satuan: "kg",
  kategori: "karbohidrat",
  keamanan: "aman",
  persenTerselamatkan: 150,
});
assert(k5.kg === 1, `Kasus 5 kg clamped >100%: didapat ${k5.kg}, diharapkan 1`);
assert(k5.rupiah === 12000, `Kasus 5 rupiah clamped: didapat ${k5.rupiah}, diharapkan 12000`);

// Kasus 6: satuan ikat & porsi & liter
const k6 = hitungSkor({
  jumlah: 2,
  satuan: "ikat",
  kategori: "sayur",
  keamanan: "aman",
  persenTerselamatkan: 100,
});
assert(k6.kg === 0.6, `Kasus 6 kg satuan ikat (2 * 0.3): didapat ${k6.kg}, diharapkan 0.6`);

// Cek exports konstanta
assert(FAKTOR_SATUAN_KG.kg === 1, "FAKTOR_SATUAN_KG export valid");
assert(FAKTOR_KEAMANAN.aman === 1, "FAKTOR_KEAMANAN export valid");
assert(HARGA_PER_KG.protein_hewani === 60000, "HARGA_PER_KG export valid");

if (hasError) {
  console.error("❌ Verifikasi skor GAGAL!");
  process.exit(1);
} else {
  console.log("🎉 Semua pengujian lib/skor.ts LULUS!");
  process.exit(0);
}
