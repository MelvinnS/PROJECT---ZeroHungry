import { getFallbackResult } from "../apps/user/lib/fallback";
import { HasilAnalisisSchema, InputAnalisis } from "../apps/user/lib/schemas";

// Daftar 12 kasus uji untuk memverifikasi fallback cerdas
const testCases: { name: string; input: InputAnalisis }[] = [
  {
    name: "pisang overripe",
    input: {
      nama: "pisang kepok",
      jumlah: 1,
      satuan: "kg",
      kondisi: "kulit sangat berbintik cokelat kehitaman dan lembek manis",
      tipe: "rumah_tangga",
      alat: ["kompor", "kukusan", "blender"],
    },
  },
  {
    name: "nasi sisa",
    input: {
      nama: "nasi putih",
      jumlah: 2,
      satuan: "porsi",
      kondisi: "nasi sisa semalam dingin agak keras tapi masih segar dan harum",
      tipe: "rumah_tangga",
      alat: ["kompor"],
    },
  },
  {
    name: "tempe bintik hitam",
    input: {
      nama: "tempe kedelai",
      jumlah: 1,
      satuan: "buah",
      kondisi: "mulai semangit bau agak tajam dan ada bintik hitam miselium belum berlendir",
      tipe: "rumah_tangga",
      alat: ["kompor"],
    },
  },
  {
    name: "bayam layu",
    input: {
      nama: "bayam hijau",
      jumlah: 2,
      satuan: "ikat",
      kondisi: "daun layu lunglai kekurangan air belum menguning",
      tipe: "rumah_tangga",
      alat: ["kompor"],
    },
  },
  {
    name: "singkong 5 kg usaha",
    input: {
      nama: "singkong segar",
      jumlah: 5,
      satuan: "kg",
      kondisi: "panen berlebih kulit agak kotor belum dikupas",
      tipe: "usaha",
      alat: ["kompor", "kukusan"],
    },
  },
  {
    name: "ikan berbau busuk",
    input: {
      nama: "ikan tongkol",
      jumlah: 1,
      satuan: "kg",
      kondisi: "bau busuk tajam menyengat dan berlendir banyak",
      tipe: "rumah_tangga",
      alat: ["kompor"],
    },
  },
  {
    name: "roti berjamur",
    input: {
      nama: "roti tawar",
      jumlah: 4,
      satuan: "porsi",
      kondisi: "muncul jamur hijau kebiruan pada permukaan roti",
      tipe: "rumah_tangga",
      alat: ["oven"],
    },
  },
  {
    name: "wortel berjamur",
    input: {
      nama: "wortel lokal",
      jumlah: 500,
      satuan: "gram",
      kondisi: "ada sedikit jamur putih di ujung kulit wortel keras",
      tipe: "rumah_tangga",
      alat: ["kompor"],
    },
  },
  {
    name: "input batu",
    input: {
      nama: "batu kerikil",
      jumlah: 1,
      satuan: "buah",
      kondisi: "keras padat tidak bisa dimakan",
      tipe: "rumah_tangga",
      alat: ["tanpa_alat"],
    },
  },
  {
    name: "bahan tak dikenal daun kelor",
    input: {
      nama: "daun kelor",
      jumlah: 1,
      satuan: "ikat",
      kondisi: "segar baru dipetik agak layu sedikit",
      tipe: "rumah_tangga",
      alat: ["kompor"],
    },
  },
  {
    name: "alergi kacang",
    input: {
      nama: "pisang raja",
      jumlah: 1,
      satuan: "kg",
      kondisi: "matang ranum harum",
      tipe: "rumah_tangga",
      alat: ["kompor", "blender"],
      alergi: "kacang, telur",
    },
  },
  {
    name: "alat tanpa_alat",
    input: {
      nama: "nasi dingin",
      jumlah: 1,
      satuan: "porsi",
      kondisi: "agak kering di piring",
      tipe: "rumah_tangga",
      alat: ["tanpa_alat"],
    },
  },
];

console.log("==========================================================================================");
console.log("                       VERIFIKASI FALLBACK HASIL ANALISIS                                  ");
console.log("==========================================================================================");
console.log(
  [
    "No".padEnd(4),
    "Kasus Uji".padEnd(30),
    "Keamanan".padEnd(14),
    "Jml Ide".padEnd(10),
    "Status Validasi Zod",
  ].join(" | ")
);
console.log("-".repeat(90));

let allPassed = true;

testCases.forEach((tc, idx) => {
  try {
    const hasil = getFallbackResult(tc.input);
    const parsed = HasilAnalisisSchema.safeParse(hasil);

    const no = String(idx + 1).padEnd(4);
    const name = tc.name.padEnd(30);
    const keamanan = hasil.keamanan.aman_dikonsumsi.padEnd(14);
    const jmlIde = String(hasil.ide_olahan.length).padEnd(10);
    const status = parsed.success ? "✅ LOLOS" : `❌ GAGAL (${parsed.error.message})`;

    if (!parsed.success) {
      allPassed = false;
    }

    console.log([no, name, keamanan, jmlIde, status].join(" | "));
  } catch (err) {
    allPassed = false;
    console.log(
      [
        String(idx + 1).padEnd(4),
        tc.name.padEnd(30),
        "ERROR".padEnd(14),
        "0".padEnd(10),
        `❌ EXCEPTION: ${err}`,
      ].join(" | ")
    );
  }
});

console.log("-".repeat(90));
if (allPassed) {
  console.log("🎉 SEMUA KASUS UJI FALLBACK BERHASIL DAN LOLOS SCHEMA SECARA LENGKAP!");
  process.exit(0);
} else {
  console.error("⚠️ ADA KASUS UJI YANG GAGAL. SILAKAN CEK ERROR DI ATAS.");
  process.exit(1);
}
