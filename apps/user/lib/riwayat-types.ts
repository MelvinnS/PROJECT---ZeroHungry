import type { HasilAnalisis } from "@/lib/schemas";

export interface RiwayatItem {
  id: string;
  user_id: string;
  nama_bahan: string;
  jumlah: number;
  satuan: string;
  kondisi: string;
  kategori: string;
  keamanan: "aman" | "waspada" | "tidak_aman";
  hasil: HasilAnalisis;
  kg_diselamatkan: number;
  rupiah_dihemat: number;
  porsi: number;
  source: string;
  created_at: string;
}

export interface TitikGrafik {
  label: string;
  kg: number;
}

export interface RingkasanRiwayat {
  totalKg: number;
  totalRupiah: number;
  totalPorsi: number;
  jumlahBahan: number;
  mingguan: TitikGrafik[];
  bulanan: TitikGrafik[];
}
