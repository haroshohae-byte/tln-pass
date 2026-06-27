create extension if not exists "pgcrypto";

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

create index if not exists partner_page_views_partner_id_created_at_idx
  on public.partner_page_views (partner_id, created_at desc);

create index if not exists partner_click_events_partner_id_created_at_idx
  on public.partner_click_events (partner_id, created_at desc);

create index if not exists partner_click_events_event_type_idx
  on public.partner_click_events (event_type);

alter table public.partner_page_views enable row level security;
alter table public.partner_click_events enable row level security;
