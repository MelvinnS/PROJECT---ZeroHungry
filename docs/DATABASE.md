# Dokumentasi Database (Supabase)

Dokumen ini menjelaskan struktur tabel, kebijakan Row Level Security (RLS), pemetaan pemakaian antar-aplikasi (`apps/user` dan `apps/admin`), serta aturan keamanan akses admin.

> [!NOTE]
> Sumber skema aktif berada di `supabase/schema.sql` dan `supabase/riwayat.sql`. Dokumen ini hanya bersifat dokumentasi dan draft usulan; **file di folder `supabase/` tidak diubah**.

---

## 1. Tabel yang Tersedia

### `public.profiles` (`supabase/schema.sql`)
Menyimpan profil pengguna dan perannya, terhubung 1:1 dengan `auth.users`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` (PK, FK → `auth.users.id`) | ID pengguna Supabase Auth (`on delete cascade`) |
| `nama` | `text not null` | Nama tampilan pengguna |
| `role` | `text not null default 'rumah_tangga'` | Check: `'rumah_tangga'`, `'usaha'`, `'admin'` |
| `tipe_usaha` | `text` | Check: `'UMKM'`, `'Petani'` (nullable) |
| `nama_usaha` | `text` | Nama usaha (nullable) |
| `created_at` | `timestamptz not null default now()` | Waktu pembuatan |

- **Trigger otomatis:** `on_auth_user_created` → memanggil `public.handle_new_user()` (`security definer`) saat user baru mendaftar. Trigger ini hanya mengizinkan `role` bernilai `'rumah_tangga'` atau `'usaha'` — **tidak pernah** `'admin'` dari metadata registrasi.

### `public.riwayat_analisis` (`supabase/riwayat.sql`)
Menyimpan riwayat analisis bahan pangan pengguna yang login.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` (PK, `gen_random_uuid()`) | ID unik riwayat |
| `user_id` | `uuid not null` (FK → `auth.users.id`) | Pemilik riwayat (`on delete cascade`) |
| `nama_bahan` | `text not null` | Nama bahan yang dianalisis |
| `jumlah` | `numeric not null` | Kuantitas bahan |
| `satuan` | `text not null` | Satuan kuantitas |
| `kondisi` | `text not null` | Kondisi bahan input |
| `kategori` | `text not null` | Kategori pangan |
| `keamanan` | `text not null` | Check: `'aman'`, `'waspada'`, `'tidak_aman'` |
| `hasil` | `jsonb not null` | Payload hasil analisis terstruktur |
| `kg_diselamatkan` | `numeric not null default 0` | Skor kg (dihitung di server) |
| `rupiah_dihemat` | `numeric not null default 0` | Skor rupiah (dihitung di server) |
| `porsi` | `numeric not null default 0` | Estimasi porsi (dihitung di server) |
| `source` | `text not null default 'fallback'` | Sumber analisis (`'live'` atau `'fallback'`) |
| `created_at` | `timestamptz not null default now()` | Waktu simpan |

- **Index:** `riwayat_user_waktu` pada `(user_id, created_at desc)`.

---

## 2. Kebijakan Row Level Security (RLS)

| Tabel | RLS Aktif | Policy Saat Ini | Catatan Keamanan |
|---|---|---|---|
| `public.profiles` | ✅ Ya | `SELECT`: `auth.uid() = id` | Sengaja **tanpa** policy `INSERT`/`UPDATE` untuk user agar pengguna tidak dapat menaikkan `role` sendiri menjadi `'admin'`. |
| `public.riwayat_analisis` | ✅ Ya | `SELECT`, `INSERT`, `DELETE`: `auth.uid() = user_id` | Sengaja **tanpa** policy `UPDATE` agar riwayat & skor yang sudah tercatat tidak dimanipulasi. |

---

## 3. Area Pemakai Tabel

| Tabel | `apps/user` | `apps/admin` (rencana) |
|---|---|---|
| `public.profiles` | Baca profil sendiri (`lib/auth.ts`, `Navbar`, `Dashboard`) | Verifikasi `role = 'admin'`, daftar pengguna/UMKM |
| `public.riwayat_analisis` | `POST` & `DELETE` (`/api/riwayat`), baca riwayat (`/dashboard`) | Monitoring agregat dampak & statistik penyelamatan pangan |

---

## 4. Rekomendasi Akses Admin & Aturan `SUPABASE_SERVICE_ROLE_KEY`

1. **Penetapan role admin:** Dilakukan manual lewat SQL Editor Supabase (atau skrip admin terautentikasi):
   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'email-admin@contoh.com');
   ```
2. **Aturan ketat `SUPABASE_SERVICE_ROLE_KEY`:**
   - **HANYA** boleh digunakan di kode server-side `apps/admin` (Route Handlers / Server Actions / Server Components), **TIDAK PERNAH** di `apps/user` maupun kode client (`NEXT_PUBLIC_*`).
   - Pastikan setiap handler server `apps/admin` tetap memverifikasi session user (`supabase.auth.getUser()`) dan memeriksa `profiles.role === 'admin'` sebelum menjalankan query dengan service role key.
3. **Draft SQL Usulan (BELUM diterapkan ke `supabase/`):**
   Jika nantinya `apps/admin` membutuhkan akses baca lintas user tanpa service role key (via RLS), dapat dipertimbangkan helper function + policy berikut di migrasi mendatang:
   ```sql
   -- DRAFT USULAN (belum diterapkan ke supabase/)
   create or replace function public.is_admin()
   returns boolean
   language sql
   security definer
   stable
   set search_path = public
   as $$
     select exists (
       select 1 from public.profiles
       where id = auth.uid() and role = 'admin'
     );
   $$;

   -- Contoh policy baca semua profil oleh admin:
   -- create policy "Admin baca semua profil" on public.profiles
   --   for select using (public.is_admin());
   ```
