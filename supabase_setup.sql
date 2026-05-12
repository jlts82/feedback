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


-- =========================================================
-- 9) Administración de usuarios desde el frontend
-- Estas funciones permiten que SOLO administradores consulten usuarios
-- y actualicen full_name / role sin exponer service_role en el navegador.
-- =========================================================

create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'administrador'
  );
$$;

grant execute on function public.is_current_user_admin() to authenticated;

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz,
  updated_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'No autorizado';
  end if;

  return query
  select
    u.id,
    u.email::text,
    p.full_name,
    p.role,
    p.created_at,
    p.updated_at,
    u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  order by u.created_at desc;
end;
$$;

grant execute on function public.admin_list_users() to authenticated;

create or replace function public.admin_update_user_profile(
  p_target_id uuid,
  p_full_name text,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role text;
begin
  if not public.is_current_user_admin() then
    raise exception 'No autorizado';
  end if;

  if p_role not in ('administrador', 'usuario') then
    raise exception 'Rol inválido';
  end if;

  select role into current_role
  from public.profiles
  where id = auth.uid();

  -- Evita que un administrador se quite a sí mismo el rol por accidente desde la pantalla actual.
  if p_target_id = auth.uid() and p_role <> current_role then
    raise exception 'No puedes cambiar tu propio rol desde esta pantalla';
  end if;

  insert into public.profiles (id, full_name, role)
  values (p_target_id, nullif(trim(p_full_name), ''), p_role)
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();
end;
$$;

grant execute on function public.admin_update_user_profile(uuid, text, text) to authenticated;

-- Verificación rápida:
-- select * from public.admin_list_users();

-- =========================================================
-- V11: Módulos productivos conectados a Supabase
-- Pedidos + stock + finanzas automáticas
-- =========================================================

-- Control para evitar duplicar descuentos/ingresos.
alter table public.orders
add column if not exists stock_processed boolean not null default false,
add column if not exists finance_processed boolean not null default false;

-- Tabla de movimientos financieros.
create table if not exists public.finance_movements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  concept text not null,
  category text,
  order_id text,
  amount numeric not null default 0,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.finance_movements enable row level security;

-- Políticas simples para operar desde frontend con usuarios autenticados.
-- En una etapa posterior se pueden endurecer por rol.
drop policy if exists finance_movements_select_authenticated on public.finance_movements;
create policy finance_movements_select_authenticated
on public.finance_movements for select
to authenticated
using (true);

drop policy if exists finance_movements_insert_authenticated on public.finance_movements;
create policy finance_movements_insert_authenticated
on public.finance_movements for insert
to authenticated
with check (true);

drop policy if exists finance_movements_update_admin on public.finance_movements;
create policy finance_movements_update_admin
on public.finance_movements for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists finance_movements_delete_admin on public.finance_movements;
create policy finance_movements_delete_admin
on public.finance_movements for delete
to authenticated
using (public.is_current_user_admin());

-- Si RLS está activo en estas tablas, permitir operación a usuarios autenticados.
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.inventory_movements enable row level security;

drop policy if exists clients_all_authenticated on public.clients;
create policy clients_all_authenticated on public.clients
for all to authenticated using (true) with check (true);

drop policy if exists products_all_authenticated on public.products;
create policy products_all_authenticated on public.products
for all to authenticated using (true) with check (true);

drop policy if exists orders_all_authenticated on public.orders;
create policy orders_all_authenticated on public.orders
for all to authenticated using (true) with check (true);

drop policy if exists inventory_movements_all_authenticated on public.inventory_movements;
create policy inventory_movements_all_authenticated on public.inventory_movements
for all to authenticated using (true) with check (true);

-- Verificación rápida.
select 'V11 listo' as status;
