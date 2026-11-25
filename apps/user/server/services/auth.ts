import { createClient } from "@/server/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profil, RolePengguna, TipeUsaha } from "@/lib/auth-client";

export * from "@/lib/auth-client";

/**
 * Mengambil data profil pengguna yang sedang login di sisi server.
 * Jika Supabase belum dikonfigurasi, pengguna belum login, atau terjadi kesalahan,
 * fungsi akan mengembalikan null tanpa melempar exception (fail-safe).
 */
export async function getCurrentUserProfile(): Promise<Profil | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Coba ambil dari tabel public.profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, nama, role, tipe_usaha, nama_usaha")
      .eq("id", user.id)
      .single();

    if (!profileError && profileData) {
      return {
        id: profileData.id,
        nama: profileData.nama || "Pengguna",
        role: (["rumah_tangga", "usaha", "admin"].includes(profileData.role)
          ? profileData.role
          : "rumah_tangga") as RolePengguna,
        tipe_usaha: (profileData.tipe_usaha as TipeUsaha) || null,
        nama_usaha: profileData.nama_usaha || null,
      };
    }

    // Fallback dari user_metadata jika baris di profiles belum terbuat
    const meta = user.user_metadata || {};
    const fallbackRole: RolePengguna =
      meta.role === "usaha" ? "usaha" : "rumah_tangga";

    return {
      id: user.id,
      nama:
        (typeof meta.nama === "string" && meta.nama.trim()) ||
        user.email?.split("@")[0] ||
        "Pengguna",
      role: fallbackRole,
      tipe_usaha:
        fallbackRole === "usaha" && (meta.tipe_usaha === "UMKM" || meta.tipe_usaha === "Petani")
          ? meta.tipe_usaha
          : null,
      nama_usaha:
        fallbackRole === "usaha" && typeof meta.nama_usaha === "string"
          ? meta.nama_usaha.trim()
          : null,
    };
  } catch {
    // Tangani semua kemungkinan error secara aman
    return null;
  }
}
