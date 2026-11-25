/**
 * Konfigurasi client Supabase sisi server khusus panel admin (milik Wahyu / admin).
 * SUPABASE_SERVICE_ROLE_KEY hanya boleh dibaca di modul dalam `apps/admin/server/`.
 * Belum menjalankan query database (implementasi client penuh ditambahkan saat fitur login/data admin dibuat).
 */
export function getAdminSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  return {
    url,
    serviceRoleKey,
    isConfigured: Boolean(url && serviceRoleKey),
  };
}
