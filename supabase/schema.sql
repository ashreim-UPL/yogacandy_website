-- ─────────────────────────────────────────────────────────────────────────────
-- YogaCandy — Supabase schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/_/sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── USER PROFILES ─────────────────────────────────────────────────────────────
create table if not exists user_profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  role             text not null default 'student' check (role in ('student','teacher','studio_owner','admin')),
  level            text not null default 'beginner' check (level in ('beginner','intermediate','advanced','teacher')),
  yoga_goals       text[] default '{}',
  preferred_styles text[] default '{}',
  country_code     text,
  city             text,
  bio              text,
  website_url      text,
  instagram_handle text,
  marketing_consent boolean not null default false,
  gdpr_consent_at  timestamptz,
  onboarding_complete boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Row Level Security: users can only read/write their own profile
alter table user_profiles enable row level security;

create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- Auto-create a blank profile row on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into user_profiles (id, full_name, role, gdpr_consent_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    case when (new.raw_user_meta_data->>'gdpr_consent')::boolean
      then now() else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── EVENT SUBMISSIONS (user-submitted, pending review) ───────────────────────
create table if not exists event_submissions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete set null,
  title        text not null,
  description  text,
  event_date   date not null,
  format       text not null default 'In person' check (format in ('Online','In person','Hybrid')),
  city         text,
  country      text,
  country_code text not null default 'GL',
  price        text,
  source_name  text,
  source_url   text,
  tags         text[] default '{}',
  location_key text,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by  uuid references auth.users(id),
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now()
);

alter table event_submissions enable row level security;

-- Users can insert and view their own submissions
create policy "Users can submit events"
  on event_submissions for insert
  with check (auth.uid() = user_id);

create policy "Users can view own submissions"
  on event_submissions for select
  using (auth.uid() = user_id);

-- ── APPROVED EVENTS (promoted from submissions or auto-ingested) ──────────────
create table if not exists events (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  event_date   date not null,
  format       text not null default 'In person',
  city         text,
  country      text,
  country_code text not null default 'GL',
  price        text,
  booking_url  text,
  source_name  text,
  source_url   text,
  tags         text[] default '{}',
  location_key text,
  style_slug   text,        -- links to a yoga style page
  featured     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Public read access — anyone can see approved events
alter table events enable row level security;
create policy "Events are publicly readable"
  on events for select using (true);

-- Only service role (GitHub Actions) can insert/update
create policy "Service role can manage events"
  on events for all using (auth.role() = 'service_role');

-- ── ARTICLES (AI-generated + human-curated) ───────────────────────────────────
create table if not exists articles (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  body_md         text,              -- Markdown content
  category        text,
  tags            text[] default '{}',
  style_slug      text,              -- related yoga style
  regions         text[] default '{"global"}',  -- ISO-3166-1 codes or 'global'
  read_min        int default 5,
  author          text default 'YogaCandy Editorial',
  ai_generated    boolean default false,
  ai_model        text,
  published       boolean default false,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table articles enable row level security;
create policy "Published articles are publicly readable"
  on articles for select using (published = true);
create policy "Service role can manage articles"
  on articles for all using (auth.role() = 'service_role');

-- ── MONETIZATION: AD SLOTS & AFFILIATE CLICKS ────────────────────────────────
create table if not exists affiliate_clicks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete set null,
  partner     text not null,         -- e.g. 'yogaworks', 'manduka', 'eventbrite'
  url         text not null,
  page        text,
  clicked_at  timestamptz not null default now()
);

alter table affiliate_clicks enable row level security;
create policy "Anyone can log a click"
  on affiliate_clicks for insert with check (true);
create policy "Service role reads clicks"
  on affiliate_clicks for select using (auth.role() = 'service_role');

-- ── INDEXES ───────────────────────────────────────────────────────────────────
create index if not exists events_country_date on events(country_code, event_date);
create index if not exists events_location_key on events(location_key);
create index if not exists articles_regions on articles using gin(regions);
create index if not exists articles_published on articles(published, published_at desc);
create index if not exists articles_slug on articles(slug);
