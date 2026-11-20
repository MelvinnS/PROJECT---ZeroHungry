create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  role text not null default 'rumah_tangga' check (role in ('rumah_tangga','usaha','admin')),
  tipe_usaha text check (tipe_usaha in ('UMKM','Petani')),
  nama_usaha text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Baca profil sendiri" on public.profiles;
create policy "Baca profil sendiri" on public.profiles
  for select using (auth.uid() = id);

-- Sengaja TIDAK ada policy insert/update untuk pengguna, agar tidak bisa mengubah role sendiri.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  r text;
  t text;
begin
  r := case when new.raw_user_meta_data->>'role' = 'usaha' then 'usaha' else 'rumah_tangga' end;
  t := case when r = 'usaha' and new.raw_user_meta_data->>'tipe_usaha' in ('UMKM','Petani')
            then new.raw_user_meta_data->>'tipe_usaha' else null end;
  insert into public.profiles (id, nama, role, tipe_usaha, nama_usaha)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'nama'), ''), 'Pengguna'),
    r,
    t,
    case when r = 'usaha' then nullif(trim(new.raw_user_meta_data->>'nama_usaha'), '') else null end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Menjadikan seseorang admin (jalankan manual, ganti email):
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'email-admin@contoh.com');
