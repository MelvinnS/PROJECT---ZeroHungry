# Dari Sisa Jadi Nilai (SDGs 2: Zero Hunger & Food Waste Reduction)

Platform web cerdas berbasis kecerdasan buatan (AI) yang dirancang untuk membantu rumah tangga dan pelaku UMKM kuliner mengidentifikasi kelayakan bahan pangan sisa, berlebih, atau hampir rusak, serta memberikan panduan pengawetan dan ide olahan bernilai tambah untuk mengurangi *food loss*.

---

## Mode Contoh vs Mode Live

Aplikasi ini dilengkapi dengan arsitektur **Mode Cadangan Cerdas (Smart Fallback)** sehingga dapat beroperasi 100% gratis dan mandiri:

### 1. Mode Contoh (Default / Gratis / Offline-Ready)
- **Kondisi Aktif:**
  - `GEMINI_API_KEY` kosong atau masih bernilai default `ISI_API_KEY_DI_SINI`, **ATAU**
  - `FORCE_FALLBACK=true` pada file `.env.local`, **ATAU**
  - Terjadi kendala saat menghubungi API Gemini (misal kuota habis/rate limit 429, koneksi terputus, atau batas waktu terlewati).
- **Cara Kerja:**
  - Sistem menggunakan mesin analisis deterministik lokal (`lib/fallback.ts` & `lib/fallback-data.ts`).
  - Mampu mendeteksi secara cerdas:
    - **Bukan Pangan:** Input non-makanan (seperti batu, plastik, deterjen) otomatis dinilai tidak aman.
    - **Tanda Kerusakan:** Bau busuk, lendir, atau jamur pada bahan lunak otomatis dinilai tidak aman dan mengosongkan resep.
    - **Pengecualian Bahan Keras:** Jamur pada bahan keras (wortel, kentang, kubis) dinilai waspada dengan instruksi pemotongan bagian rusak.
    - **Personalisasi:** Resep disesuaikan dengan alat yang dimiliki pengguna, filter bahan alergi, serta optimasi potensi nilai jual untuk tipe akun "usaha".
  - Dilengkapi delay buatan acak (700–1200 ms) agar transisi antarmuka pengguna tampak natural saat presentasi/demo.

### 2. Mode Live (Google Gemini 2.5 Flash)
- **Kondisi Aktif:**
  - `GEMINI_API_KEY` diisi dengan API key gratis dari [Google AI Studio](https://aistudio.google.com/apikey) (tanpa perlu kartu kredit), **DAN**
  - `FORCE_FALLBACK=false` (atau tidak diset `true`).
- **Cara Kerja:**
  - Endpoint memanggil Google Gemini API secara langsung dengan model `gemini-2.5-flash` (dapat disesuaikan via `GEMINI_MODEL`).
  - Menggunakan *system prompt* khusus teknologi pangan dan validasi skema JSON terstruktur ketat via Zod (`HasilAnalisisSchema`).
  - Jika terjadi kegagalan jaringan, kuota habis (429), atau parsing, sistem secara otomatis beralih (*graceful fallback*) ke Mode Contoh tanpa menampilkan error 500/502 ke pengguna.

---

## Struktur Monorepo

```
zerohungry/
├── apps/
│   ├── user/          → @zerohungry/user (Next.js — port 3000, app utama pengguna)
│   └── admin/         → @zerohungry/admin (Next.js — port 3001, panel admin)
├── docs/              → dokumentasi arsitektur, database, environment, workflow
├── scripts/           → script verifikasi & utilitas
├── supabase/          → skema SQL Supabase
├── turbo.json         → konfigurasi Turborepo
└── package.json       → workspace root
```

Proyek ini menggunakan **npm workspaces** dan **Turborepo** untuk mengelola monorepo. Dokumentasi lengkap tersedia di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/WORKFLOW.md](docs/WORKFLOW.md), [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md), dan [docs/DATABASE.md](docs/DATABASE.md).

---

## Menjalankan Project

1. **Install dependensi** (dari root):
   ```bash
   npm install
   ```

2. **Jalankan server pengembangan:**
   - **App User saja** (`http://localhost:3000`):
     ```bash
     npm run dev:user
     ```
   - **App Admin saja** (`http://localhost:3001`):
     ```bash
     npm run dev:admin
     ```
   - **User + Admin bersamaan**:
     ```bash
     npm run dev
     ```

3. **Build, Lint, Typecheck & Clean:**
   ```bash
   npm run build        # build semua app (atau build:user / build:admin)
   npm run lint         # jalankan ESLint di semua workspace
   npm run typecheck    # jalankan tsc --noEmit di semua workspace
   npm run clean        # bersihkan .turbo dan .next di semua workspace
   ```

4. **Jalankan script verifikasi:**
   ```bash
   npm run verify:fallback
   npm run verify:kalkulator
   npm run verify:multi
   npm run verify:skor
   npm run verify:chef
   ```
