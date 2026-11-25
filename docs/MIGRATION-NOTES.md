# Catatan Migrasi Struktur Monorepo & Pemisahan Frontend/Backend

Tabel ringkasan pemindahan file dari struktur tunggal awal (`536121d`) menuju struktur monorepo dengan pemisahan `components/`, `lib/`, dan `server/`.

| Lokasi Lama | Lokasi Baru | Keterangan |
|---|---|---|
| `app/**` | `apps/user/app/**` | Dipindah ke workspace `@zerohungry/user`, route dikelompokkan ke `(auth)` & `(public)` |
| `components/*` | `apps/user/components/{ui,layout,features}/` | Komponen UI (`Badge`, `Button`, `Card`, `FoodImage`, `Input`, `Logo`, `Select`), layout, & fitur |
| `public/**` | `apps/user/public/**` | Aset statis aplikasi user |
| `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `proxy.ts` | `apps/user/*` | Konfigurasi app user (ESLint ditambah aturan batas import) |
| `lib/auth-client.ts`, `lib/supabase/{client,config}.ts` | `apps/user/lib/*` | Tetap di `lib/` karena `CLIENT-SAFE` |
| `lib/schemas*.ts`, `lib/kalkulator.ts`, `lib/katalog-data.ts`, `lib/multi-ke-tunggal.ts` | `apps/user/lib/*` | Tetap di `lib/` karena dipakai client & server |
| Tipe `RiwayatItem`, `TitikGrafik`, `RingkasanRiwayat` (dari `lib/riwayat.ts`) | `apps/user/lib/riwayat-types.ts` | Diekstrak agar komponen client hanya meng-import tipe dari `lib/` |
| Tipe `PesanRiwayat`, `KonteksChef` (dari `lib/prompts-chef.ts`) | `apps/user/lib/chef-types.ts` | Diekstrak agar `ChefChat.tsx` hanya meng-import tipe dari `lib/` |
| `lib/gemini.ts` | `apps/user/server/ai/gemini.ts` | Dipindah ke backend `server/ai/` |
| `lib/prompts.ts`, `prompts-multi.ts`, `prompts-chef.ts` | `apps/user/server/ai/prompts*.ts` | Dipindah ke backend `server/ai/` |
| `lib/fallback.ts`, `lib/fallback-data.ts` | `apps/user/server/ai/fallback*.ts` | Dipindah ke backend `server/ai/` |
| `lib/auth.ts`, `lib/riwayat.ts`, `lib/skor.ts` | `apps/user/server/services/{auth,riwayat,skor}.ts` | Dipindah ke backend `server/services/` |
| `lib/supabase/server.ts` | `apps/user/server/supabase/server.ts` | Dipindah ke backend `server/supabase/` |
| *(baru)* | `apps/admin/**` | Scaffold panel admin (`port 3001`) dengan struktur kembar (`components/`, `hooks/`, `lib/`, `server/`) |
