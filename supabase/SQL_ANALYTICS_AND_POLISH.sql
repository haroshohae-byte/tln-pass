create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value)
values
  ('instagram_url', ''),
  ('tiktok_url', ''),
  ('support_email', ''),
  ('business_email', ''),
  ('contact_phone', ''),
  ('main_city', 'Tallinn'),
  ('hero_title', 'Tallinn, unlocked.'),
  ('hero_subtitle', ''),
  ('homepage_hero_image', ''),
  ('contact_image', ''),
  ('membership_price_texts', ''),
  ('partner_applications_enabled', 'true'),
  ('enable_partner_applications', 'true'),
  ('stripe_payments_enabled', 'true'),
  ('maintenance_mode', 'false'),
  ('announcement_banner', '')
on conflict (key) do nothing;

alter table if exists public.partner_menu_items
  add column if not exists old_price numeric,
  add column if not exists discount_type text default 'none',
  add column if not exists discount_value numeric,
  add column if not exists discount_custom text,
  add column if not exists image_url text,
  add column if not exists is_available boolean default true,
  add column if not exists is_active boolean default true,
  add column if not exists sort_order integer default 100,
  add column if not exists updated_at timestamptz default now();

alter table if exists public.partners
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists opening_hours text,
  add column if not exists offer text,
  add column if not exists rules text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists edit_token text,
  add column if not exists slug text,
  add column if not exists updated_at timestamptz default now();

alter table if exists public.partner_applications
  add column if not exists status text default 'pending',
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists message text,
  add column if not exists description text,
  add column if not exists offer text,
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists opening_hours text;

create index if not exists partners_status_idx on public.partners (status);
create index if not exists partners_slug_idx on public.partners (slug);
create index if not exists partner_menu_items_partner_id_idx
  on public.partner_menu_items (partner_id);
create index if not exists partner_applications_status_idx
  on public.partner_applications (status);

create table if not exists public.partner_page_views (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  event_type text not null default 'page_view',
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists public.partner_click_events (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.partner_promotions (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  title text not null,
  description text,
  promotion_type text not null default 'discount',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partner_page_views_partner_id_created_at_idx
  on public.partner_page_views (partner_id, created_at desc);
create index if not exists partner_click_events_partner_id_created_at_idx
  on public.partner_click_events (partner_id, created_at desc);
create index if not exists partner_promotions_partner_id_created_at_idx
  on public.partner_promotions (partner_id, created_at desc);

alter table public.site_settings enable row level security;
alter table public.partner_page_views enable row level security;
alter table public.partner_click_events enable row level security;
alter table public.partner_promotions enable row level security;
