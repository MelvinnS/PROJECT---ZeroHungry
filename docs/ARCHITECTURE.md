# Arsitektur Monorepo — Dari Sisa Jadi Nilai

Dokumen ini menjelaskan struktur monorepo, pemisahan frontend vs backend di setiap aplikasi, arah ketergantungan import, serta aturan kapan kode boleh diekstrak ke `packages/`.

---

## 1. Struktur Workspace

```
zerohungry/
├── apps/
│   ├── user/          # @zerohungry/user — Next.js 16 (port 3000), aplikasi utama pengguna
│   └── admin/         # @zerohungry/admin — Next.js 16 (port 3001), panel admin
├── docs/              # Dokumentasi arsitektur, database, environment, workflow, migrasi
├── scripts/           # Script verifikasi & pengujian Gemini / fallback / skor
├── supabase/          # Skema SQL & kebijakan RLS Supabase
├── .github/           # CODEOWNERS & template
├── package.json       # npm workspaces ("apps/*", "packages/*") + script Turborepo
└── turbo.json         # Pipeline build, dev, lint, typecheck
```

---

## 2. Struktur Kembar Frontend vs Backend (Per App)

Baik `apps/user/` maupun `apps/admin/` menggunakan struktur lapisan yang sama:

```
apps/<app>/
├── app/               # Halaman App Router + app/api/** (pintu HTTP tipis)
├── components/        # FRONTEND: ui/, layout/, features/<domain>/
├── hooks/             # FRONTEND: custom React hooks
├── lib/               # CLIENT-SAFE: tipe, format, konstanta, Supabase browser client
└── server/            # BACKEND: ai/, services/, supabase/ (hanya berjalan di server)
```

### Arah Import (Ditegakkan oleh ESLint `no-restricted-imports`)

```
app/ (pages & api) ──▶ server/ ──▶ lib/
components/ & hooks/ ──────────────▶ lib/
```

- `components/`, `hooks/`, dan `lib/` **dilarang keras** meng-import modul dari `server/` (termasuk `import type`).
- `apps/user` dan `apps/admin` **dilarang keras** saling meng-import langsung.
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh dibaca di `apps/admin/server/` (tidak pernah di `apps/user`, `lib/`, atau `components/`).

---

## 3. Kriteria Ekstraksi ke `packages/`

Saat ini folder `packages/` **belum dibuat** (glob `"packages/*"` di `package.json` tetap dipertahankan sebagai kesiapan workspace). Suatu modul/komponen/konfigurasi **hanya boleh** dipindahkan ke `packages/` jika memenuhi **semua** kriteria berikut:

1. **Dipakai oleh `apps/user` DAN `apps/admin`** secara nyata (bukan spekulasi masa depan).
2. **Sudah identik** (atau memiliki kontrak yang benar-benar sama di kedua aplikasi).
3. **Disetujui lewat Pull Request** oleh pemilik area `apps/user` dan `apps/admin`.

Jika ketiga syarat belum terpenuhi, biarkan kode tetap berada di masing-masing `apps/*` agar perubahan di satu aplikasi tidak mengganggu aplikasi lainnya.
