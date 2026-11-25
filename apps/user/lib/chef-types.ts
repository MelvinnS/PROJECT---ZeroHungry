// Tipe data riwayat percakapan Chef
export interface PesanRiwayat {
  role: "user" | "chef";
  teks: string;
}

// Tipe data konteks untuk Chef
export interface KonteksChef {
  bahan: Array<{
    nama: string;
    keamanan: "aman" | "waspada" | "tidak_aman";
    sisa: string;
  }>;
  resep?: {
    nama: string;
    bahan_tambahan: Array<{ nama: string; jumlah: string }>;
    langkah: string[];
  };
}
