import { HasilAnalisisSchema } from "../apps/user/lib/schemas";
import { InputMultiSchema, type HasilMulti, type InputMulti } from "../apps/user/lib/schemas-multi";
import { toInputTunggal, toHasilTunggal } from "../apps/user/lib/multi-ke-tunggal";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ GAGAL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ LULUS: ${msg}`);
  }
}

async function runVerification() {
  console.log("=== MEMULAI VERIFIKASI MULTI-BAHAN ===");

  // Data contoh hasil multi
  const mockHasilMulti: HasilMulti = {
    bahan: [
      {
        nama_standar: "Pisang Kepok",
        kategori: "buah",
        kondisi_input: "Mulai layu",
        keamanan: {
          aman_dikonsumsi: "aman",
          alasan: "Hanya kematangan berlebih tanpa jamur atau bau busuk.",
          catatan: null,
        },
        umur_simpan: {
          hari_min: 2,
          hari_maks: 4,
          urgensi: "segera_olah",
          tips_penyimpanan: "Simpan di suhu ruang terhindar dari panas.",
        },
        persen_terselamatkan: 90,
      },
      {
        nama_standar: "Tempe Kedelai",
        kategori: "protein_nabati",
        kondisi_input: "Sudah berlendir dan bau busuk menyengat",
        keamanan: {
          aman_dikonsumsi: "tidak_aman",
          alasan: "Lendir berlebih dan bau busuk menandakan kontaminasi bakteri pembusuk berbahaya.",
          catatan: "Segera buang dan bersihkan wadah.",
        },
        umur_simpan: {
          hari_min: 0,
          hari_maks: 0,
          urgensi: "kritis",
          tips_penyimpanan: "Tidak layak disimpan.",
        },
        persen_terselamatkan: 0,
      },
    ],
    ide_olahan: [
      {
        nama: "Bolu Pisang Kukus",
        deskripsi: "Kudapan manis lembut khas Nusantara.",
        asal_daerah: "Jawa Barat",
        tingkat_kesulitan: "mudah",
        durasi_menit: 35,
        alat_dibutuhkan: ["kukusan", "kompor"],
        bahan_tambahan: [{ nama: "Tepung terigu", jumlah: "150 gram" }],
        langkah: [
          "Lumatkan pisang matang.",
          "Campur tepung dan gula.",
          "Kukus selama 25 menit.",
        ],
        estimasi_biaya_rp: 12000,
        estimasi_porsi: 4,
        umur_simpan_hasil_hari: 3,
        potensi_harga_jual_rp: 25000,
        tips: "Gunakan api sedang saat mengukus.",
        bahan_dipakai: ["Pisang Kepok"],
      },
    ],
    pengawetan: [
      {
        metode: "Pembekuan Puree",
        cocok_karena: "Mencegah oksidasi lebih lanjut.",
        langkah_singkat: ["Lumatkan pisang", "Bekukan dalam wadah kedap"],
        tambahan_umur_hari: 30,
        alat: ["freezer"],
      },
    ],
  };

  // 1. Uji toHasilTunggal untuk bahan aman (indeks 0)
  const hasilTunggalAman = toHasilTunggal(mockHasilMulti, 0);
  const parseAman = HasilAnalisisSchema.safeParse(hasilTunggalAman);
  assert(parseAman.success, "toHasilTunggal lolos HasilAnalisisSchema untuk bahan aman");
  assert(hasilTunggalAman.ide_olahan.length === 1, "Bahan aman mempertahankan ide_olahan");
  assert(!("bahan_dipakai" in hasilTunggalAman.ide_olahan[0]), "Field bahan_dipakai berhasil dibuang pada ide_olahan");
  assert(hasilTunggalAman.pengawetan.length === 1, "Bahan aman mempertahankan pengawetan");

  // 2. Uji toHasilTunggal untuk bahan tidak_aman (indeks 1)
  const hasilTunggalTidakAman = toHasilTunggal(mockHasilMulti, 1);
  const parseTidakAman = HasilAnalisisSchema.safeParse(hasilTunggalTidakAman);
  assert(parseTidakAman.success, "toHasilTunggal lolos HasilAnalisisSchema untuk bahan tidak_aman");
  assert(hasilTunggalTidakAman.ide_olahan.length === 0, "Bahan tidak aman mengosongkan ide_olahan ([])");
  assert(hasilTunggalTidakAman.pengawetan.length === 0, "Bahan tidak aman mengosongkan pengawetan ([])");

  // 3. Uji toInputTunggal
  const mockInputMulti: InputMulti = {
    bahan: [
      { nama: "Pisang", jumlah: 1, satuan: "kg", kondisi: "Layu" },
      { nama: "Tempe", jumlah: 2, satuan: "buah", kondisi: "Agak cokelat" },
    ],
    tipe: "rumah_tangga",
    alat: ["kompor"],
  };
  const inputTunggal0 = toInputTunggal(mockInputMulti, 0);
  assert(inputTunggal0.nama === "Pisang" && inputTunggal0.jumlah === 1, "toInputTunggal menghasilkan input tunggal yang valid");

  // 4. Uji InputMultiSchema menolak nama kembar (case-insensitive)
  const inputKembar = {
    bahan: [
      { nama: "Pisang Kepok", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "pisang kepok", jumlah: 2, satuan: "kg", kondisi: "Layu" },
    ],
    tipe: "rumah_tangga",
    alat: ["kompor"],
  };
  const parseKembar = InputMultiSchema.safeParse(inputKembar);
  assert(!parseKembar.success, "InputMultiSchema menolak nama kembar secara case-insensitive");

  // 5. Uji InputMultiSchema menolak 6 bahan
  const input6Bahan = {
    bahan: [
      { nama: "Bahan 1", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "Bahan 2", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "Bahan 3", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "Bahan 4", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "Bahan 5", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "Bahan 6", jumlah: 1, satuan: "kg", kondisi: "Segar" },
    ],
    tipe: "rumah_tangga",
    alat: ["kompor"],
  };
  const parse6Bahan = InputMultiSchema.safeParse(input6Bahan);
  assert(!parse6Bahan.success, "InputMultiSchema menolak 6 bahan (> 5 bahan)");

  // 6. Uji InputMultiSchema menerima 1 sampai 5 bahan valid
  const inputValid = {
    bahan: [
      { nama: "Bahan A", jumlah: 1, satuan: "kg", kondisi: "Segar" },
      { nama: "Bahan B", jumlah: 2, satuan: "buah", kondisi: "Layu" },
      { nama: "Bahan C", jumlah: 0.5, satuan: "liter", kondisi: "Segar" },
    ],
    tipe: "rumah_tangga",
    alat: ["kompor", "blender"],
  };
  const parseValid = InputMultiSchema.safeParse(inputValid);
  assert(parseValid.success, "InputMultiSchema menerima input valid multi-bahan");

  console.log("=== SEMUA PENGUJIAN SKRIP BERHASIL ===");
}

runVerification();
