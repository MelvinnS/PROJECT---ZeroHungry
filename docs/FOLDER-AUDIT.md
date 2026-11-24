# Audit Folder Berbasis Bukti (`chore/restructure-monorepo`)

Tanggal: 2026-11-25  
Branch: `chore/restructure-monorepo` (base: `wahyu/itdev` @ `a37879cc`, HEAD: `8e2e76b`)

---

## 1. Inventaris Tree & Jumlah File per Folder

*(Mengabaikan `node_modules`, `.next`, `.turbo`, `.git`)*

| Folder | Jumlah File |
|---|---:|
| `.` (root) | 7 |
| `apps/user` | 7 |
| `apps/user/app` | 3 |
| `apps/user/app/(auth)/daftar` | 1 |
| `apps/user/app/(auth)/masuk` | 1 |
| `apps/user/app/(public)` | 1 |
| `apps/user/app/(public)/coba-cepat` | 1 |
| `apps/user/app/(public)/katalog` | 1 |
| `apps/user/app/(public)/katalog/[slug]` | 2 |
| `apps/user/app/api/analisis` | 1 |
| `apps/user/app/api/analisis-multi` | 1 |
| `apps/user/app/api/chef` | 1 |
| `apps/user/app/api/riwayat` | 1 |
| `apps/user/app/dashboard` | 2 |
| `apps/user/app/dashboard/kalkulator` | 1 |
| `apps/user/app/dashboard/riwayat` | 1 |
| `apps/user/app/dashboard/riwayat/[id]` | 2 |
| `apps/user/components/features/auth` | 2 |
| `apps/user/components/features/chef` | 1 |
| `apps/user/components/features/coba-cepat` | 6 |
| `apps/user/components/features/dashboard` | 6 |
| `apps/user/components/features/kalkulator` | 4 |
| `apps/user/components/features/katalog` | 2 |
| `apps/user/components/features/landing` | 4 |
| `apps/user/components/layout` | 3 |
| `apps/user/components/ui` | 7 |
| `apps/user/lib` | 15 |
| `apps/user/lib/supabase` | 3 |
| `apps/user/public` | 5 |
| `apps/user/public/images` | 4 |
| `apps/user/public/images/katalog` | 13 |
| `scripts` | 6 |
| `supabase` | 2 |

**Baseline jumlah file sumber:**
- `.ts`: 31 | `.tsx`: 49 | `.css`: 1 | `.sql`: 2 | `.json`: 5 | `.md`: 2 (**Total: 90 file sumber**)

---

## 2. Tabel Audit Setiap Folder di `apps/user`

*(Catatan: folder `hooks/` dan `types/` belum ada di `apps/user`.)*

| Folder | Isi singkat | Jml file | Siapa yang meng-import (grep) | Dipakai di route mana | Penilaian |
|---|---|---:|---|---|---|
| `apps/user/app` | `layout.tsx`, `globals.css`, `favicon.ico` | 3 | Next.js App Router root | Semua route | **SUDAH BENAR** |
| `apps/user/app/(auth)/daftar` | `page.tsx` | 1 | Next.js App Router | `/daftar` | **SUDAH BENAR** |
| `apps/user/app/(auth)/masuk` | `page.tsx` | 1 | Next.js App Router | `/masuk` | **SUDAH BENAR** |
| `apps/user/app/(public)` | `page.tsx` (landing) | 1 | Next.js App Router | `/` | **SUDAH BENAR** |
| `apps/user/app/(public)/coba-cepat` | `page.tsx` | 1 | Next.js App Router | `/coba-cepat` | **SUDAH BENAR** |
| `apps/user/app/(public)/katalog` | `page.tsx` | 1 | Next.js App Router | `/katalog` | **SUDAH BENAR** |
| `apps/user/app/(public)/katalog/[slug]` | `page.tsx`, `not-found.tsx` | 2 | Next.js App Router | `/katalog/[slug]` | **SUDAH BENAR** |
| `apps/user/app/api/analisis` | `route.ts` | 1 | Dipanggil via fetch client (`CobaCepatClient`) | `/api/analisis` | **SUDAH BENAR** |
| `apps/user/app/api/analisis-multi` | `route.ts` | 1 | Dipanggil via fetch client (`CobaCepatClient`) | `/api/analisis-multi` | **SUDAH BENAR** |
| `apps/user/app/api/chef` | `route.ts` | 1 | `ChefChat.tsx` (fetch), `scripts/verify-chef.ts` | `/api/chef` | **SUDAH BENAR** |
| `apps/user/app/api/riwayat` | `route.ts` | 1 | Dipanggil via fetch client (`CobaCepatClient`, `DetailRiwayatClient`, `RiwayatClient`) | `/api/riwayat` | **SUDAH BENAR** |
| `apps/user/app/dashboard` | `layout.tsx`, `page.tsx` | 2 | Next.js App Router | `/dashboard` | **SUDAH BENAR** |
| `apps/user/app/dashboard/kalkulator` | `page.tsx` | 1 | Next.js App Router | `/dashboard/kalkulator` | **SUDAH BENAR** |
| `apps/user/app/dashboard/riwayat` | `page.tsx` | 1 | Next.js App Router | `/dashboard/riwayat` | **SUDAH BENAR** |
| `apps/user/app/dashboard/riwayat/[id]` | `page.tsx`, `not-found.tsx` | 2 | Next.js App Router | `/dashboard/riwayat/[id]` | **SUDAH BENAR** |
| `apps/user/components/features/auth` | `AuthCard.tsx`, `SignOutButton.tsx` | 2 | `AuthCard` ← `daftar/page.tsx`, `masuk/page.tsx`. **`SignOutButton` ← 0 importer** | `/daftar`, `/masuk` (`SignOutButton` tidak dipakai) | **SUDAH BENAR** *(catatan: `SignOutButton.tsx` **TIDAK TERPAKAI**)* |
| `apps/user/components/features/chef` | `ChefChat.tsx` | 1 | `HasilAnalisis.tsx`, `HasilMultiView.tsx`, `DetailRiwayatClient.tsx` | `/coba-cepat`, `/dashboard/riwayat/[id]` | **SUDAH BENAR** |
| `apps/user/components/features/coba-cepat` | `AnalisisForm`, `CobaCepatClient`, `HasilAnalisis`, `HasilMultiView`, `IdeOlahanCard`, `LoadingState` | 6 | `coba-cepat/page.tsx` (`CobaCepatClient`), `DetailRiwayatClient.tsx` (`IdeOlahanCard`), lainnya import relatif `./` | `/coba-cepat`, `/dashboard/riwayat/[id]` | **SUDAH BENAR** |
| `apps/user/components/features/dashboard` | `AktivitasChart`, `DashboardLayoutClient`, `DashboardView`, `DetailRiwayatClient`, `RiwayatClient`, `StatusBadge` | 6 | `dashboard/layout.tsx`, `dashboard/page.tsx`, `dashboard/riwayat/page.tsx`, `dashboard/riwayat/[id]/page.tsx`, lainnya import relatif `./` | `/dashboard/*` | **SUDAH BENAR** |
| `apps/user/components/features/kalkulator` | `BarChartSederhana`, `HasilKalkulator`, `KalkulatorClient`, `KalkulatorForm` | 4 | `dashboard/kalkulator/page.tsx` (`KalkulatorClient`), lainnya import relatif `./` | `/dashboard/kalkulator` | **SUDAH BENAR** |
| `apps/user/components/features/katalog` | `KatalogClient.tsx`, `OlahanCard.tsx` | 2 | `katalog/page.tsx` (`KatalogClient`), `KatalogClient` (`OlahanCard`) | `/katalog` | **SUDAH BENAR** |
| `apps/user/components/features/landing` | `CaraKerja`, `ContohOlahan`, `CtaBand`, `Hero` | 4 | `app/(public)/page.tsx` | `/` | **SUDAH BENAR** |
| `apps/user/components/layout` | `Footer.tsx`, `Navbar.tsx`, `PublicLayoutWrapper.tsx` | 3 | `app/layout.tsx` | Semua route publik & auth | **SUDAH BENAR** |
| `apps/user/components/ui` | `Badge`, `Button`, `Card`, `FoodImage`, `Input`, `Logo`, `Select` | 7 | Dipakai lintas fitur (`app/`, `features/`, `layout/`) | Semua route | **SUDAH BENAR** |
| `apps/user/lib` | `auth`, `auth-client`, `fallback`, `fallback-data`, `gemini`, `kalkulator`, `katalog-data`, `multi-ke-tunggal`, `prompts*`, `riwayat`, `schemas*`, `skor` | 15 | Dipakai oleh `app/`, `components/`, `scripts/*` (lihat temuan `scripts/`) | Semua route & API | **SUDAH BENAR** |
| `apps/user/lib/supabase` | `client.ts`, `config.ts`, `server.ts` | 3 | `daftar`, `masuk`, `api/riwayat`, `proxy.ts`, `lib/auth`, `lib/riwayat`, `AuthCard`, `Navbar`, `DashboardLayoutClient`, `SignOutButton` | Auth, dashboard, API | **SUDAH BENAR** |
| `apps/user/public` | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | 5 | **0 referensi di kode** (template bawaan Next.js) | Tidak ada | **TIDAK TERPAKAI** (hanya dilaporkan) |
| `apps/user/public/images` | `hero-makanan-lokal.jpg`, `olahan-*.jpg` | 4 | `Hero.tsx`, `ContohOlahan.tsx` | `/` | **SUDAH BENAR** |
| `apps/user/public/images/katalog` | 13 file `.jpg` | 13 | 6 file di-import di `lib/katalog-data.ts`; 7 file tidak direferensikan di `katalog-data.ts` | `/katalog`, `/katalog/[slug]` | **SUDAH BENAR** *(catatan: 7 gambar belum terpakai / beda nama slug di `katalog-data.ts`)* |

---

## 3. Cek Konsistensi

- **Penamaan file & folder:**
  - Komponen React (`.tsx`): PascalCase (`AuthCard.tsx`, `ChefChat.tsx`, `FoodImage.tsx`, dll) — konsisten.
  - Folder fitur & route: kebab-case / lowercase (`coba-cepat/`, `analisis-multi/`) — konsisten.
  - Modul `lib/*.ts`: kebab-case (`auth-client.ts`, `fallback-data.ts`, `multi-ke-tunggal.ts`, dll) — konsisten.
- **File di root folder yang seharusnya masuk subfolder:**
  - Root `apps/user/`: hanya config Next.js (`next.config.ts`, `proxy.ts`, `tsconfig.json`, `eslint.config.mjs`, `package.json`, `next-env.d.ts`) — sudah benar.
  - Root `apps/user/components/`: sudah bersih (tidak ada file tersisa di root `components/`).
- **Folder berisi 1 file / kosong:**
  - Tidak ada folder kosong.
  - Folder dengan 1 file: `app/(auth)/*`, `app/(public)/*`, `app/api/*`, `app/dashboard/kalkulator`, `app/dashboard/riwayat`, `components/features/chef` (`ChefChat.tsx`). Semuanya wajar secara arsitektur Next.js App Router & domain fitur.
- **File tidak terpakai (0 importer dari grep):**
  - `apps/user/components/features/auth/SignOutButton.tsx` (0 importer)
  - `apps/user/public/{file,globe,next,vercel,window}.svg` (0 referensi)
  - 7 file di `apps/user/public/images/katalog/` (`bolu-pisang-kukus.jpg`, `kering-tempe-manis.jpg`, `kerupuk-gendar-nasi.jpg`, `mendol-tempe-pedas-gurih.jpg`, `nasi-bakar-aroma-daun.jpg`, `nasi-goreng-daun-jeruk.jpg`, `sawut-singkong-gula-merah.jpg`)
- **Barrel file (`index.ts`):** Tidak ada di repo.

---

## 4. Workspace `packages/` yang Belum Ada

- Root `package.json` memiliki `"workspaces": ["apps/*", "packages/*"]`.
- Folder `packages/` belum dibuat dan **tidak perlu dibuat sekarang** karena baru ada satu aplikasi (`apps/user`) sehingga belum ada kode shared yang dipakai lebih dari satu app.
- Glob `"packages/*"` di `package.json` aman dibiarkan (tidak menyebabkan error pada `npm install` maupun `turbo`), atau baru diisi ketika `apps/admin` dan kode shared nyata sudah ada.

---

## 5. Area Lain (`scripts/`, `supabase/`, Config Root)

- **`scripts/*.ts` (TEMUAN PENTING):**
  - `scripts/test-gemini.ts` → meng-import `../lib/prompts`, `../lib/schemas`
  - `scripts/verify-chef.ts` → meng-import `../app/api/chef/route`
  - `scripts/verify-fallback.ts` → meng-import `../lib/fallback`, `../lib/schemas`
  - `scripts/verify-kalkulator.ts` → meng-import `../lib/kalkulator`
  - `scripts/verify-multi.ts` → meng-import `../lib/schemas`, `../lib/schemas-multi`, `../lib/multi-ke-tunggal`
  - `scripts/verify-skor.ts` → meng-import `../lib/skor`
  - Karena `lib/` dan `app/` sudah pindah ke `apps/user/`, **semua import di `scripts/*.ts` saat ini broken** jika dijalankan dari root (`npm run verify:*`).
- **`supabase/`:** Berisi `schema.sql` dan `riwayat.sql` (2 file). Sudah tepat di root `supabase/`.
- **Config root:** `.env.example`, `.gitignore`, `AGENTS.md`, `package.json`, `package-lock.json`, `README.md`, `turbo.json` — sudah tepat di root.

---

## 6. Status `apps/admin` & Backend

- **`apps/admin`:** Belum ada (`apps/` hanya berisi `user/`). Jika Anda setuju, saya dapat menyiapkan scaffold minimal Next.js untuk `apps/admin` pada tahap berikutnya.
- **Backend:** Saat ini seluruh backend berada di `apps/user/app/api/*` (Next.js Route Handlers) + Supabase (`supabase/`). Belum ada `apps/api` atau server terpisah.

---

## 7. Usulan Rencana Perubahan (Menunggu Persetujuan)

Struktur folder di `apps/user` saat ini **sudah sangat rapi dan konsisten**. Tidak ada pemindahan folder di dalam `apps/user` yang diperlukan. Satu-satunya perbaikan yang benar-benar diperlukan berbasis bukti grep adalah memperbaiki import path di `scripts/*.ts`:

| Lokasi lama | Lokasi baru | Bukti (hasil grep) | Alasan | Risiko |
|---|---|---|---|---|
| Import `../lib/*` & `../app/*` di `scripts/*.ts` (6 file) | Update import ke `../apps/user/lib/*` & `../apps/user/app/*` (tetap di `scripts/`) | `git grep -n "import" -- "scripts/*.ts"` menunjukkan 6 file masih mengarah ke `../lib/` dan `../app/` yang sudah pindah ke `apps/user/` | Memperbaiki script `npm run verify:*` dan `test-gemini.ts` yang rusak akibat pemindahan app ke `apps/user/` | Rendah (hanya perbaikan path import di script dev/verifikasi, tidak mengubah logika app) |
