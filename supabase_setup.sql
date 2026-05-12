-- =========================================================
-- Setup Supabase para FeedBack Personalizados
-- Login + perfiles + roles: administrador / usuario
-- =========================================================

-- 1) Tabla de perfiles. El correo NO va aquí; el correo vive en auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'usuario' check (role in ('administrador', 'usuario')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists role text not null default 'usuario',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- 2) Updated_at automático.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 3) Crear profile automáticamente cuando se crea usuario en Supabase Auth.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Usuario'),
    'usuario'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- 4) Backfill: crea profile para usuarios existentes que aún no lo tengan.
insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.email, 'Usuario'),
  'usuario'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 5) Row Level Security.
alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles for insert
to authenticated
with check (auth.uid() = id and role = 'usuario');

drop policy if exists profiles_update_own_name on public.profiles;
create policy profiles_update_own_name
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- 6) Verificación de usuarios + roles.
select
  u.id,
  u.email,
  p.full_name,
  p.role,
  p.created_at,
  p.updated_at
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at desc;

-- 7) Asignar administrador por correo.
-- Cambia el correo y ejecuta SOLO cuando ya hayas creado el usuario en Authentication > Users.
-- update public.profiles
-- set role = 'administrador', full_name = coalesce(full_name, 'Administrador')
-- where id = (select id from auth.users where email = 'TU_CORREO@DOMINIO.COM');

-- 8) Asignar usuario general por correo.
-- update public.profiles
-- set role = 'usuario'
-- where id = (select id from auth.users where email = 'TU_CORREO@DOMINIO.COM');
