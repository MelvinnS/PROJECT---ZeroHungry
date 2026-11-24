# Alur Kerja Tim (Git Workflow)

Proyek ini menggunakan **2 branch aktif** untuk memisahkan area kerja tanpa saling mengganggu:

| Branch | Pemilik | Area Utama |
|---|---|---|
| `dev-melvin` | Melvin | `apps/user/` (aplikasi pengguna & fitur AI/katalog/dashboard) |
| `wahyu/itdev` | Wahyu | `apps/admin/` (panel admin & fitur administrasi) |

---

## Aturan Kerja

1. **Bekerja di branch masing-masing:**
   - Perubahan pada `apps/user/` dikerjakan di `dev-melvin`.
   - Perubahan pada `apps/admin/` dikerjakan di `wahyu/itdev`.
2. **Conventional Commits:**
   Gunakan format `<type>(<scope>): <deskripsi>`, dengan scope yang jelas:
   - `user` — perubahan di `apps/user`
   - `admin` — perubahan di `apps/admin`
   - `shared` — perubahan di `packages/` (jika sudah ada)
   - `db` — perubahan/dokumentasi terkait database
   - `docs` — dokumentasi umum
   - `ci` — tooling workspace, script, lint, turbo
3. **Larangan:**
   - Dilarang `git push --force`, `git reset --hard`, atau `rebase` pada branch yang sudah ada di remote.
   - Dilarang menghapus file/kode tanpa persetujuan.
   - Perubahan pada area bersama (`package.json` root, `turbo.json`, `supabase/`, `docs/`) harus disepakati kedua pihak lewat PR.
4. **Verifikasi sebelum push/PR:**
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
