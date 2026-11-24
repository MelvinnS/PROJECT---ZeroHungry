# Konfigurasi Environment Variable

Referensi variabel lingkungan berdasarkan [.env.example](../.env.example) dan `turbo.json`.

---

## 1. Variabel Lingkungan

| Variabel | Sifat | Dipakai oleh | Keterangan |
|---|---|---|---|
| `GEMINI_API_KEY` | Rahasia (server) | `apps/user`, `scripts/test-gemini.ts` | API key Google AI Studio. Jika kosong / `ISI_API_KEY_DI_SINI`, otomatis memakai Mode Contoh (fallback). |
| `GEMINI_MODEL` | Opsional (server) | `apps/user` | Override model Gemini utama (default `gemini-2.5-flash`). |
| `GEMINI_MODELS` | Opsional (server) | `apps/user` | Daftar rantai model failover dipisah koma. |
| `FORCE_FALLBACK` | Opsional (server) | `apps/user` | Set `true` untuk memaksa Mode Contoh walaupun `GEMINI_API_KEY` terisi. |
| `NEXT_PUBLIC_SUPABASE_URL` | Publik (client + server) | `apps/user` *(dan `apps/admin` nanti)* | URL project Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publik (client + server) | `apps/user` *(dan `apps/admin` nanti)* | Anon/public key Supabase (aman untuk browser karena dilindungi RLS). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Sangat Rahasia (server-only)** | **`apps/admin` saja** (rencana) | **Dilarang keras** dipakai di `apps/user` atau diekspos ke client/browser. Hanya untuk route/server handler terautentikasi admin di `apps/admin`. |

---

## 2. Konfigurasi di Turborepo (`turbo.json`)

- `globalEnv`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `globalPassThroughEnv`: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_MODELS`, `FORCE_FALLBACK`, `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Setup Lokal

1. Salin `.env.example` menjadi `.env.local` di `apps/user/.env.local` (atau sesuai kebutuhan masing-masing app):
   ```bash
   cp .env.example apps/user/.env.local
   ```
2. Jangan pernah meng-commit file `.env*` selain `.env.example` (sudah diabaikan di `.gitignore`).
