export type RolePengguna = "rumah_tangga" | "usaha" | "admin";
export type TipeUsaha = "UMKM" | "Petani";

export interface Profil {
  id: string;
  nama: string;
  role: RolePengguna;
  tipe_usaha: TipeUsaha | null;
  nama_usaha: string | null;
}

/**
 * Sanitasi parameter redirect 'next' untuk mencegah kerentanan Open Redirect.
 * Hanya menerima path internal yang diawali '/' dan bukan '//'.
 */
export function sanitizeNext(next: string | null | undefined): string {
  if (
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
  ) {
    return next;
  }
  return "/dashboard";
}

/**
 * Menerjemahkan pesan error dari Supabase Auth menjadi pesan Bahasa Indonesia yang ramah pengguna.
 */
export function terjemahAuthError(error: unknown): string {
  if (!error) return "Terjadi kesalahan. Coba lagi.";

  let rawMsg = "";
  if (typeof error === "string") {
    rawMsg = error.toLowerCase();
  } else if (typeof error === "object" && error !== null) {
    const errObj = error as { message?: string; error_description?: string };
    rawMsg = (errObj.message || errObj.error_description || "").toLowerCase();
  }

  if (
    rawMsg.includes("invalid login credentials") ||
    rawMsg.includes("invalid credentials") ||
    rawMsg.includes("invalid_grant")
  ) {
    return "Email atau kata sandi salah.";
  }

  if (
    rawMsg.includes("already registered") ||
    rawMsg.includes("user already exists") ||
    rawMsg.includes("already in use")
  ) {
    return "Email ini sudah terdaftar. Silakan masuk.";
  }

  if (
    rawMsg.includes("password should be at least") ||
    rawMsg.includes("weak password") ||
    rawMsg.includes("password is too short")
  ) {
    return "Kata sandi minimal 8 karakter.";
  }

  if (
    rawMsg.includes("rate limit") ||
    rawMsg.includes("too many") ||
    rawMsg.includes("over_request_rate_limit")
  ) {
    return "Terlalu banyak percobaan. Coba lagi beberapa saat.";
  }

  if (rawMsg.includes("email not confirmed") || rawMsg.includes("not confirmed")) {
    return "Email belum dikonfirmasi.";
  }

  return "Terjadi kesalahan. Coba lagi.";
}
