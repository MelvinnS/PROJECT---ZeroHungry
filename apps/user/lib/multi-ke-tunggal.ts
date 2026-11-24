import {
  type InputAnalisis,
  type HasilAnalisis,
  HasilAnalisisSchema,
} from "./schemas";
import type { InputMulti, HasilMulti } from "./schemas-multi";

/**
 * Mengonversi satu item bahan dari InputMulti menjadi InputAnalisis tunggal.
 */
export function toInputTunggal(
  inputMulti: InputMulti,
  i: number
): InputAnalisis {
  const item = inputMulti.bahan[i];
  if (!item) {
    throw new Error(`Indeks bahan ${i} tidak ditemukan pada input.`);
  }

  return {
    nama: item.nama,
    jumlah: item.jumlah,
    satuan: item.satuan,
    kondisi: item.kondisi,
    tipe: inputMulti.tipe,
    alat: inputMulti.alat,
  };
}

/**
 * Mengonversi hasil analisis multi untuk satu bahan ke format HasilAnalisis tunggal.
 * Menghapus properti khusus multi seperti bahan_dipakai agar sepenuhnya mematuhi HasilAnalisisSchema.
 */
export function toHasilTunggal(
  hasilMulti: HasilMulti,
  i: number
): HasilAnalisis {
  const b = hasilMulti.bahan[i];
  if (!b) {
    throw new Error(`Indeks bahan ${i} tidak ditemukan pada hasil.`);
  }

  const isTidakAman = b.keamanan.aman_dikonsumsi === "tidak_aman";

  // Jika bahan tidak aman, ide_olahan dan pengawetan dikosongkan
  const ideOlahanCleaned = isTidakAman
    ? []
    : (hasilMulti.ide_olahan || []).map((ide) => {
        // Hapus properti bahan_dipakai agar lolos HasilAnalisisSchema
        const rest = { ...ide };
        delete (rest as { bahan_dipakai?: string[] }).bahan_dipakai;
        return rest;
      });

  const pengawetanCleaned = isTidakAman ? [] : (hasilMulti.pengawetan || []);

  const hasilTunggal: HasilAnalisis = {
    bahan: {
      nama_standar: b.nama_standar,
      kategori: b.kategori,
      kondisi_input: b.kondisi_input,
    },
    keamanan: {
      aman_dikonsumsi: b.keamanan.aman_dikonsumsi,
      alasan: b.keamanan.alasan,
      catatan: b.keamanan.catatan,
    },
    umur_simpan: {
      hari_min: b.umur_simpan.hari_min,
      hari_maks: b.umur_simpan.hari_maks,
      urgensi: b.umur_simpan.urgensi,
      tips_penyimpanan: b.umur_simpan.tips_penyimpanan,
    },
    pengawetan: pengawetanCleaned,
    ide_olahan: ideOlahanCleaned,
    estimasi_dampak: {
      persen_bahan_terselamatkan: b.persen_terselamatkan,
    },
  };

  // Validasi ketat bahwa hasil sesuai dengan HasilAnalisisSchema
  return HasilAnalisisSchema.parse(hasilTunggal);
}
