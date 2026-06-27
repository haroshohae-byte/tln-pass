create extension if not exists "pgcrypto";

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

create index if not exists partner_promotions_partner_id_created_at_idx
  on public.partner_promotions (partner_id, created_at desc);

create index if not exists partner_promotions_active_idx
  on public.partner_promotions (partner_id, is_active);

alter table public.partner_promotions enable row level security;
