create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  bio text,
  city text,
  country text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  format text not null check (format in ('Online', 'In person', 'Hybrid')),
  city text not null,
  country text not null,
  country_code text not null,
  price text,
  description text not null,
  source_name text not null,
  source_url text,
  tags text[] not null default '{}',
  location_key text not null,
  status text not null default 'active' check (status in ('active', 'archived', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  event_date date not null,
  format text not null check (format in ('Online', 'In person', 'Hybrid')),
  city text not null,
  country text not null,
  country_code text not null,
  price text,
  description text not null,
  source_name text not null default 'user submission',
  source_url text,
  tags text[] not null default '{}',
  location_key text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, city, country)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'student'),
    nullif(new.raw_user_meta_data->>'city', ''),
    nullif(new.raw_user_meta_data->>'country', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = case
      when excluded.role in ('student', 'teacher', 'admin') then excluded.role
      else public.profiles.role
    end,
    city = coalesce(excluded.city, public.profiles.city),
    country = coalesce(excluded.country, public.profiles.country),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.event_listings enable row level security;
alter table public.event_submissions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "event_listings_read_public" on public.event_listings;
create policy "event_listings_read_public"
  on public.event_listings
  for select
  using (true);

drop policy if exists "event_submissions_insert_authenticated" on public.event_submissions;
create policy "event_submissions_insert_authenticated"
  on public.event_submissions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "event_submissions_select_own" on public.event_submissions;
create policy "event_submissions_select_own"
  on public.event_submissions
  for select
  using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create index if not exists event_listings_location_key_idx on public.event_listings (location_key, event_date);
create index if not exists event_submissions_location_key_idx on public.event_submissions (location_key, status, event_date);
