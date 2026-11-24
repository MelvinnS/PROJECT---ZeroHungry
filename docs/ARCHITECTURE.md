# Arsitektur Monorepo — Dari Sisa Jadi Nilai

Dokumen ini menjelaskan struktur monorepo, batasan antar-aplikasi, serta aturan kapan kode boleh diekstrak ke `packages/`.

---

## 1. Struktur Workspace

```
zerohungry/
├── apps/
│   ├── user/          # @zerohungry/user — Next.js 16 (port 3000), aplikasi utama pengguna
│   └── admin/         # @zerohungry/admin — Next.js 16 (port 3001), panel admin (scaffold)
├── docs/              # Dokumentasi arsitektur, database, environment, workflow, audit
├── scripts/           # Script verifikasi & pengujian Gemini / fallback / skor
├── supabase/          # Skema SQL & kebijakan RLS Supabase
├── .github/           # Template CODEOWNERS (.github/CODEOWNERS.example)
├── package.json       # npm workspaces ("apps/*", "packages/*") + script Turborepo
└── turbo.json         # Pipeline build, dev, lint, typecheck
```

---

## 2. Batasan Antar-Aplikasi

- `apps/user` dan `apps/admin` adalah aplikasi Next.js terpisah dan **dilarang saling meng-import langsung** (ditegakkan oleh aturan ESLint `no-restricted-imports` di kedua app).
- `apps/user` memiliki client Supabase sendiri di `apps/user/lib/supabase/` dan helper auth di `apps/user/lib/auth.ts`.
- `apps/admin` **akan memiliki `apps/admin/lib/supabase/` sendiri** saat fitur login dan akses database admin mulai dibuat (termasuk pemakaian `SUPABASE_SERVICE_ROLE_KEY` khusus di sisi server `apps/admin`).

---

## 3. Kriteria Ekstraksi ke `packages/`

Saat ini folder `packages/` **belum dibuat** (glob `"packages/*"` di `package.json` tetap dipertahankan sebagai kesiapan workspace). Suatu modul/komponen/konfigurasi **hanya boleh** dipindahkan ke `packages/` jika memenuhi **semua** kriteria berikut:

1. **Dipakai oleh `apps/user` DAN `apps/admin`** secara nyata (bukan spekulasi masa depan).
2. **Sudah identik** (atau memiliki kontrak yang benar-benar sama di kedua aplikasi).
3. **Disetujui lewat Pull Request** oleh pemilik area `apps/user` dan `apps/admin`.

Jika ketiga syarat belum terpenuhi, biarkan kode tetap berada di masing-masing `apps/*` agar perubahan di satu aplikasi tidak mengganggu aplikasi lainnya.
