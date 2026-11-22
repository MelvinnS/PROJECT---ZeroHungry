create table if not exists public.riwayat_analisis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nama_bahan text not null,
  jumlah numeric not null,
  satuan text not null,
  kondisi text not null,
  kategori text not null,
  keamanan text not null check (keamanan in ('aman','waspada','tidak_aman')),
  hasil jsonb not null,
  kg_diselamatkan numeric not null default 0,
  rupiah_dihemat numeric not null default 0,
  porsi numeric not null default 0,
  source text not null default 'fallback',
  created_at timestamptz not null default now()
);
create index if not exists riwayat_user_waktu on public.riwayat_analisis (user_id, created_at desc);
alter table public.riwayat_analisis enable row level security;
create policy "riwayat_select_own" on public.riwayat_analisis for select using (auth.uid() = user_id);
create policy "riwayat_insert_own" on public.riwayat_analisis for insert with check (auth.uid() = user_id);
create policy "riwayat_delete_own" on public.riwayat_analisis for delete using (auth.uid() = user_id);
-- sengaja tanpa policy update
