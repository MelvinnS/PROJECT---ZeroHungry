import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  RiwayatItem,
  TitikGrafik,
  RingkasanRiwayat,
} from "@/lib/riwayat-types";

export type { RiwayatItem, TitikGrafik, RingkasanRiwayat };

export interface GetRiwayatOptions {
  limit?: number;
  q?: string;
  keamanan?: string;
}

/**
 * Mengambil daftar riwayat pengguna yang sedang login.
 * Urut terbaru (created_at desc).
 * Aman: tidak melempar error, kembalikan [] jika gagal atau belum konfigurasi.
 */
export async function getRiwayat(
  options: GetRiwayatOptions = {}
): Promise<RiwayatItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    let query = supabase
      .from("riwayat_analisis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (options.limit && options.limit > 0) {
      query = query.limit(options.limit);
    }

    if (options.keamanan && options.keamanan !== "semua") {
      query = query.eq("keamanan", options.keamanan);
    }

    if (options.q && options.q.trim()) {
      query = query.ilike("nama_bahan", `%${options.q.trim()}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    return data as RiwayatItem[];
  } catch {
    return [];
  }
}

/**
 * Mengambil 1 baris riwayat berdasarkan ID.
 * Aman: kembalikan null jika tidak ditemukan atau error.
 */
export async function getRiwayatById(id: string): Promise<RiwayatItem | null> {
  if (!isSupabaseConfigured() || !id) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from("riwayat_analisis")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as RiwayatItem;
  } catch {
    return null;
  }
}

/**
 * Menghitung ringkasan riwayat:
 * - totalKg, totalRupiah, totalPorsi
 * - jumlahBahan (hanya yang keamanan != 'tidak_aman')
 * - mingguan: 4 titik {label, kg} untuk 4 minggu terakhir (label tanggal awal minggu, mis. "10 Nov")
 * - bulanan: 6 titik {label, kg} (label bulan singkat id-ID, mis. "Nov")
 * Aman: kembalikan nilai default/nol jika Supabase error atau kosong.
 */
export async function getRingkasan(): Promise<RingkasanRiwayat> {
  // Label default generator jika kosong atau offline
  const now = new Date();

  // Generator 4 minggu terakhir (minggu 0 = minggu ini, mundur 3 minggu)
  const defaultMingguan: TitikGrafik[] = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now);
    // mundur i * 7 hari ke tanggal awal rentang
    d.setDate(d.getDate() - i * 7);
    const day = d.getDate();
    const monthStr = d.toLocaleDateString("id-ID", { month: "short" });
    defaultMingguan.push({
      label: `${day} ${monthStr}`,
      kg: 0,
    });
  }

  // Generator 6 bulan terakhir (bulan 0 = bulan ini, mundur 5 bulan)
  const defaultBulanan: TitikGrafik[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString("id-ID", { month: "short" });
    defaultBulanan.push({
      label: monthStr,
      kg: 0,
    });
  }

  const defaultRingkasan: RingkasanRiwayat = {
    totalKg: 0,
    totalRupiah: 0,
    totalPorsi: 0,
    jumlahBahan: 0,
    mingguan: defaultMingguan,
    bulanan: defaultBulanan,
  };

  if (!isSupabaseConfigured()) {
    return defaultRingkasan;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return defaultRingkasan;
    }

    const { data, error } = await supabase
      .from("riwayat_analisis")
      .select("keamanan, kg_diselamatkan, rupiah_dihemat, porsi, created_at")
      .eq("user_id", user.id);

    if (error || !data || data.length === 0) {
      return defaultRingkasan;
    }

    let totalKg = 0;
    let totalRupiah = 0;
    let totalPorsi = 0;
    let jumlahBahan = 0;

    // Persiapan slot waktu
    // Mingguan: 4 bucket 7-harian (0: hari 0..6 lalu, 1: hari 7..13 lalu, 2: hari 14..20 lalu, 3: hari 21..27 lalu)
    const mingguanKg = [0, 0, 0, 0];
    // Bulanan: 6 bucket (0: bulan ini, 1: 1 bln lalu, ..., 5: 5 bln lalu)
    const bulananKg = [0, 0, 0, 0, 0, 0];

    const currentTimestamp = now.getTime();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    for (const row of data) {
      const kg = Number(row.kg_diselamatkan) || 0;
      const rupiah = Number(row.rupiah_dihemat) || 0;
      const porsi = Number(row.porsi) || 0;

      totalKg += kg;
      totalRupiah += rupiah;
      totalPorsi += porsi;

      if (row.keamanan !== "tidak_aman") {
        jumlahBahan += 1;
      }

      const rowDate = new Date(row.created_at);
      const rowTimestamp = rowDate.getTime();
      const diffDays = Math.floor((currentTimestamp - rowTimestamp) / ONE_DAY_MS);

      // Mingguan (4 minggu terakhir)
      if (diffDays >= 0 && diffDays < 28) {
        const weekIdx = Math.floor(diffDays / 7); // 0 (terbaru) s/d 3
        if (weekIdx >= 0 && weekIdx < 4) {
          // indeks array mingguan di defaultMingguan: 3 adalah minggu ini, 0 adalah 3 minggu lalu
          const arrayPos = 3 - weekIdx;
          mingguanKg[arrayPos] += kg;
        }
      }

      // Bulanan (6 bulan terakhir)
      const diffMonths =
        (now.getFullYear() - rowDate.getFullYear()) * 12 +
        (now.getMonth() - rowDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        // defaultBulanan: 5 adalah bulan ini, 0 adalah 5 bulan lalu
        const arrayPos = 5 - diffMonths;
        bulananKg[arrayPos] += kg;
      }
    }

    return {
      totalKg: Math.round(totalKg * 100) / 100,
      totalRupiah: Math.round(totalRupiah),
      totalPorsi: Math.round(totalPorsi),
      jumlahBahan,
      mingguan: defaultMingguan.map((item, idx) => ({
        label: item.label,
        kg: Math.round(mingguanKg[idx] * 100) / 100,
      })),
      bulanan: defaultBulanan.map((item, idx) => ({
        label: item.label,
        kg: Math.round(bulananKg[idx] * 100) / 100,
      })),
    };
  } catch {
    return defaultRingkasan;
  }
}
