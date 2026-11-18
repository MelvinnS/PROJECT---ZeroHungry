# Dari Sisa Jadi Nilai (SDGs 2: Zero Hunger & Food Waste Reduction)

Platform web cerdas berbasis kecerdasan buatan (AI) yang dirancang untuk membantu rumah tangga dan pelaku UMKM kuliner mengidentifikasi kelayakan bahan pangan sisa, berlebih, atau hampir rusak, serta memberikan panduan pengawetan dan ide olahan bernilai tambah untuk mengurangi *food loss*.

---

## Mode Contoh vs Mode Live

Aplikasi ini dilengkapi dengan arsitektur **Mode Cadangan Cerdas (Smart Fallback)** sehingga dapat beroperasi 100% gratis dan mandiri tanpa memerlukan saldo API berbayar:

### 1. Mode Contoh (Default / Gratis / Offline-Ready)
- **Kondisi Aktif:**
  - `ANTHROPIC_API_KEY` kosong atau masih bernilai default `ISI_API_KEY_DI_SINI`, **ATAU**
  - `FORCE_FALLBACK=true` pada file `.env.local`, **ATAU**
  - Terjadi kendala saat menghubungi API Claude (misal kuota habis, koneksi terputus, atau batas waktu terlewati).
- **Cara Kerja:**
  - Sistem menggunakan mesin analisis deterministik lokal (`lib/fallback.ts` & `lib/fallback-data.ts`).
  - Mampu mendeteksi secara cerdas:
    - **Bukan Pangan:** Input non-makanan (seperti batu, plastik, deterjen) otomatis dinilai tidak aman.
    - **Tanda Kerusakan:** Bau busuk, lendir, atau jamur pada bahan lunak otomatis dinilai tidak aman dan mengosongkan resep.
    - **Pengecualian Bahan Keras:** Jamur pada bahan keras (wortel, kentang, kubis) dinilai waspada dengan instruksi pemotongan bagian rusak.
    - **Personalisasi:** Resep disesuaikan dengan alat yang dimiliki pengguna, filter bahan alergi, serta optimasi potensi nilai jual untuk tipe akun "usaha".
  - Dilengkapi delay buatan acak (700–1200 ms) agar transisi antarmuka pengguna tampak natural saat presentasi/demo.

### 2. Mode Live (Claude Sonnet 5.5)
- **Kondisi Aktif:**
  - `ANTHROPIC_API_KEY` diisi dengan API key resmi dari Anthropic, **DAN**
  - `FORCE_FALLBACK=false` (atau tidak diset `true`).
- **Cara Kerja:**
  - Endpoint memanggil Claude API secara langsung dengan model `claude-sonnet-5-5`.
  - Menggunakan *system prompt* khusus teknologi pangan dan validasi skema JSON terstruktur via Zod.
  - Jika terjadi kegagalan jaringan atau parsing, sistem memiliki mekanisme *retry* otomatis 1 kali, dan bila tetap gagal akan secara mulus (*graceful degradation*) beralih ke Mode Contoh tanpa menampilkan error 500/502 ke pengguna.

---

## Menjalankan Project

1. **Install dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan script verifikasi data cadangan:**
   ```bash
   npx tsx scripts/verify-fallback.ts
   ```

3. **Jalankan server pengembangan (Dev Server):**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban Anda.
