import { HasilAnalisis, HasilAnalisisSchema, InputAnalisis } from "./schemas";
import {
  FALLBACK_DATA,
  FallbackKey,
  buatBukanPangan,
  buatGenerik,
  buatTidakAman,
} from "./fallback-data";

/**
 * Mendapatkan hasil analisis cadangan (fallback cerdas) secara offline
 * berdasarkan data input pengguna.
 */
export function getFallbackResult(input: InputAnalisis): HasilAnalisis {
  const namaNormalized = input.nama.toLowerCase().trim();
  const kondisiNormalized = input.kondisi.toLowerCase().trim();

  // 1. Cek BUKAN PANGAN: batu, plastik, sabun, kertas, deterjen, kaca, besi, kayu, bensin, racun, pasir
  const kataBukanPangan = [
    "batu",
    "plastik",
    "sabun",
    "kertas",
    "deterjen",
    "kaca",
    "besi",
    "kayu",
    "bensin",
    "racun",
    "pasir",
  ];
  const isBukanPangan = kataBukanPangan.some((kata) =>
    namaNormalized.includes(kata)
  );
  if (isBukanPangan) {
    const hasilBukanPangan = buatBukanPangan(input);
    return HasilAnalisisSchema.parse(hasilBukanPangan);
  }

  // 2. Cek BAHAN KERAS dan kata kunci TIDAK AMAN
  const bahanKeras = ["wortel", "kubis", "kol", "keju keras", "bawang", "kentang"];
  const isBahanKeras = bahanKeras.some((bk) => namaNormalized.includes(bk));

  const kataKunciTidakAman = [
    "jamur",
    "berjamur",
    "busuk",
    "berlendir",
    "lendir",
    "bau menyengat",
    "bau tajam asam",
    "apek",
    "belatung",
    "ulat",
    "basi berbau",
    "bau amis tajam",
  ];

  // Bersihkan frasa negasi seperti "belum berjamur", "belum berbau busuk" agar tidak false positive
  const kondisiTanpaNegasi = kondisiNormalized.replace(
    /\b(belum|tidak|bukan)\s+(ada\s+)?(tanda\s+)?(jamur|berjamur|busuk|berlendir|lendir|bau|berbau)\b[^,]*/gi,
    ""
  );

  // Cari apakah ada kata kunci tidak aman yang cocok
  const matchedKeywords = kataKunciTidakAman.filter((k) =>
    kondisiTanpaNegasi.includes(k)
  );

  let hasilPilihan: HasilAnalisis | null = null;

  if (matchedKeywords.length > 0) {
    // Cek pengecualian: jika bahan keras dan kata kuncinya HANYA "jamur" / "berjamur"
    const hanyaJamur = matchedKeywords.every(
      (k) => k === "jamur" || k === "berjamur"
    );

    if (isBahanKeras && hanyaJamur) {
      // Pengecualian: kembalikan versi "waspada" dari entri terdekat atau generik
      // dengan catatan khusus
      const entryKey = cariKunciBahan(namaNormalized);
      if (entryKey) {
        hasilPilihan = structuredClone(FALLBACK_DATA[entryKey].data);
      } else {
        hasilPilihan = buatGenerik(input);
      }

      hasilPilihan.keamanan.aman_dikonsumsi = "waspada";
      hasilPilihan.keamanan.alasan = `Terdapat jamur pada permukaan bahan keras (${input.nama}). Struktur bahan keras menghambat penetrasi hifa jamur ke bagian dalam lebih dalam dibanding bahan lunak.`;
      hasilPilihan.keamanan.catatan =
        "Potong bagian berjamur dengan margin sekitar 2-3 cm dari titik jamur; jika ragu, buang.";
    } else {
      // Tidak aman murni
      const hasilTidakAman = buatTidakAman(input);
      return HasilAnalisisSchema.parse(hasilTidakAman);
    }
  }

  // 3. Jika belum terpilih, cocokkan nama dengan kata kunci di FALLBACK_DATA
  if (!hasilPilihan) {
    const entryKey = cariKunciBahan(namaNormalized);
    if (entryKey) {
      hasilPilihan = structuredClone(FALLBACK_DATA[entryKey].data);
    } else {
      // 4. Selain itu, gunakan template generik
      hasilPilihan = buatGenerik(input);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Penyesuaian setelah hasil dipilih (khusus bahan spesifik & generik)
  // ─────────────────────────────────────────────────────────────

  // A. Sesuaikan nama standar & kondisi input
  hasilPilihan.bahan.kondisi_input = input.kondisi;
  if (
    hasilPilihan.bahan.kategori === "lainnya" ||
    !cariKunciBahan(namaNormalized)
  ) {
    const kapitalisasiNama =
      input.nama.trim().charAt(0).toUpperCase() + input.nama.trim().slice(1);
    hasilPilihan.bahan.nama_standar = kapitalisasiNama;
  }

  // B. Filter ide_olahan berdasarkan ALAT yang tersedia
  // Aturan:
  // - Anggap "kompor" selalu tersedia jika input.alat kosong
  // - Jika input.alat berisi "tanpa_alat" (atau hanya manual), hanya mengizinkan olahan tanpa alat / manual
  const userAlat = input.alat || [];
  const alatSet = new Set<string>();

  if (userAlat.length === 0) {
    alatSet.add("kompor");
    alatSet.add("tanpa_alat");
  } else if (userAlat.includes("tanpa_alat")) {
    // Jika ada tanpa_alat, masukkan juga alat lain jika pengguna memilih kombinasi
    for (const a of userAlat) {
      alatSet.add(a);
    }
  } else {
    for (const a of userAlat) {
      alatSet.add(a);
    }
  }

  const filteredOlahan = hasilPilihan.ide_olahan.filter((ide) => {
    // Jika alat_dibutuhkan kosong atau berisi "tanpa_alat", selalu lolos
    if (
      ide.alat_dibutuhkan.length === 0 ||
      ide.alat_dibutuhkan.every((alat) => alat === "tanpa_alat")
    ) {
      return true;
    }
    // Jika userAlat secara eksplisit hanya ["tanpa_alat"], tolak yang butuh alat
    if (userAlat.length === 1 && userAlat[0] === "tanpa_alat") {
      return false;
    }
    // Cek apakah setidaknya ada alat utama yang dimiliki pengguna di alatSet
    return ide.alat_dibutuhkan.some((alat) => alatSet.has(alat));
  });

  if (filteredOlahan.length > 0) {
    hasilPilihan.ide_olahan = filteredOlahan;
  } else {
    // Jika hasil filter kosong, ambil 1 ide paling sederhana (durasi_menit terkecil atau pertama)
    // dan tambahkan catatan di tips bahwa membutuhkan alat tambahan
    const idePalingSederhana = structuredClone(hasilPilihan.ide_olahan[0]);
    if (idePalingSederhana) {
      const tipsLama = idePalingSederhana.tips ? `${idePalingSederhana.tips}. ` : "";
      idePalingSederhana.tips = `${tipsLama}Catatan: Resep ini membutuhkan alat tambahan (${idePalingSederhana.alat_dibutuhkan.join(", ")}).`;
      hasilPilihan.ide_olahan = [idePalingSederhana];
    }
  }

  // C. Filter ALERGI
  if (input.alergi && input.alergi.trim().length > 0) {
    const listAlergi = input.alergi
      .toLowerCase()
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);

    if (listAlergi.length > 0) {
      const amanDariAlergi = hasilPilihan.ide_olahan.filter((ide) => {
        const namaIdeLower = ide.nama.toLowerCase();
        const adaDiNama = listAlergi.some((alergi) =>
          namaIdeLower.includes(alergi)
        );
        if (adaDiNama) return false;

        const adaDiBahanTambahan = ide.bahan_tambahan.some((bt) => {
          const btLower = bt.nama.toLowerCase();
          return listAlergi.some((alergi) => btLower.includes(alergi));
        });

        return !adaDiBahanTambahan;
      });

      if (amanDariAlergi.length > 0) {
        hasilPilihan.ide_olahan = amanDariAlergi;
      }

      // Tambahkan catatan peringatan pada keamanan.catatan
      const catatanPeringatan = "Periksa kembali bahan tambahan sesuai alergi Anda.";
      if (hasilPilihan.keamanan.catatan) {
        if (!hasilPilihan.keamanan.catatan.includes(catatanPeringatan)) {
          hasilPilihan.keamanan.catatan = `${hasilPilihan.keamanan.catatan} ${catatanPeringatan}`;
        }
      } else {
        hasilPilihan.keamanan.catatan = catatanPeringatan;
      }
    }
  }

  // D. Penyesuaian TIPE PENGGUNA "usaha"
  if (input.tipe === "usaha") {
    // Pastikan setiap ide punya potensi_harga_jual_rp (isi estimasi wajar bila null)
    for (const ide of hasilPilihan.ide_olahan) {
      if (ide.potensi_harga_jual_rp === null || ide.potensi_harga_jual_rp <= 0) {
        ide.potensi_harga_jual_rp = Math.round(ide.estimasi_biaya_rp * 1.8);
      }
    }

    // Urutkan ide_olahan agar potensi_harga_jual_rp terbesar ada di atas
    hasilPilihan.ide_olahan.sort((a, b) => {
      const hargaA = a.potensi_harga_jual_rp ?? 0;
      const hargaB = b.potensi_harga_jual_rp ?? 0;
      return hargaB - hargaA;
    });
  }

  // E. Validasi akhir sebelum dikembalikan
  return HasilAnalisisSchema.parse(hasilPilihan);
}

/**
 * Mencari kunci bahan di FALLBACK_DATA berdasarkan kecocokan kata kunci nama
 */
function cariKunciBahan(namaNormalized: string): FallbackKey | null {
  const keys = Object.keys(FALLBACK_DATA) as FallbackKey[];
  for (const key of keys) {
    const entry = FALLBACK_DATA[key];
    const match = entry.keywords.some((keyword) =>
      namaNormalized.includes(keyword)
    );
    if (match) {
      return key;
    }
  }
  return null;
}
