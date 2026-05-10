-- =========================================================
-- Wedding Settings & Storage Table Setup
-- Run this in Supabase SQL Editor
-- =========================================================

-- 1) Ensure uuid extension
create extension if not exists "uuid-ossp";

-- 2) Create settings table
create table if not exists public.settings (
  id text primary key,
  wedding_date timestamptz not null default '2026-04-23T09:00:00+07',
  wedding_end_time timestamptz not null default '2026-04-23T13:00:00+07',
  hero_date_text text not null default '',
  hero_image_url text not null default '',
  hero_quote_bottom text not null default '',
  music_url text not null default '',
  music_title text not null default '',
  groom_photo_url text not null default '',
  bride_photo_url text not null default '',
  location_start_time_text text not null default '',
  location_end_time_text text not null default '',
  gift_title text not null default 'Untuk yang ingin memberikan hadiah',
  gift_description text not null default 'Bagi tamu yang ingin memberi kado, silakan gunakan transfer bank di bawah ini. Terima kasih atas doa dan kebaikan Anda.',
  gift_mandiri_account text not null default '',
  gift_bca_account text not null default '',
  gift_show_mandiri boolean not null default true,
  gift_show_bca boolean not null default true,
  love_story jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3) Add missing columns for existing tables
alter table public.settings
  add column if not exists hero_date_text text not null default '';

alter table public.settings
  add column if not exists hero_image_url text not null default '';

alter table public.settings
  add column if not exists hero_quote_bottom text not null default '';

alter table public.settings
  add column if not exists music_url text not null default '';

alter table public.settings
  add column if not exists music_title text not null default '';

alter table public.settings
  add column if not exists groom_photo_url text not null default '';

alter table public.settings
  add column if not exists bride_photo_url text not null default '';

alter table public.settings
  add column if not exists location_start_time_text text not null default '';

alter table public.settings
  add column if not exists location_end_time_text text not null default '';

alter table public.settings
  add column if not exists gift_title text not null default 'Untuk yang ingin memberikan hadiah';

alter table public.settings
  add column if not exists gift_description text not null default 'Bagi tamu yang ingin memberi kado, silakan gunakan transfer bank di bawah ini. Terima kasih atas doa dan kebaikan Anda.';

alter table public.settings
  add column if not exists gift_mandiri_account text not null default '';

alter table public.settings
  add column if not exists gift_bca_account text not null default '';

alter table public.settings
  add column if not exists gift_show_mandiri boolean not null default true;

alter table public.settings
  add column if not exists gift_show_bca boolean not null default true;

-- 4) Ensure row used by app exists
insert into public.settings (
  id, wedding_date, wedding_end_time, hero_date_text, hero_image_url,
  hero_quote_bottom, music_url, music_title, groom_photo_url, bride_photo_url,
  location_start_time_text, location_end_time_text, gift_title, gift_description,
  gift_mandiri_account, gift_bca_account, gift_show_mandiri, gift_show_bca, love_story, gallery, updated_at
)
values (
  'wedding_config', '2026-04-23T09:00:00+07', '2026-04-23T13:00:00+07',
  '23 April 2026', '', '', '', '', '', '', '', '',
  'Untuk yang ingin memberikan hadiah',
  'Bagi tamu yang ingin memberi kado, silakan gunakan transfer bank di bawah ini. Terima kasih atas doa dan kebaikan Anda.',
  '', '', true, true,
  '[]'::jsonb, '[]'::jsonb, now()
)
on conflict (id) do update
set
  wedding_date = excluded.wedding_date,
  wedding_end_time = excluded.wedding_end_time,
  hero_date_text = coalesce(public.settings.hero_date_text, excluded.hero_date_text),
  hero_image_url = coalesce(public.settings.hero_image_url, excluded.hero_image_url),
  hero_quote_bottom = coalesce(public.settings.hero_quote_bottom, excluded.hero_quote_bottom),
  music_url = coalesce(public.settings.music_url, excluded.music_url),
  music_title = coalesce(public.settings.music_title, excluded.music_title),
  groom_photo_url = coalesce(public.settings.groom_photo_url, excluded.groom_photo_url),
  bride_photo_url = coalesce(public.settings.bride_photo_url, excluded.bride_photo_url),
  location_start_time_text = coalesce(public.settings.location_start_time_text, excluded.location_start_time_text),
  location_end_time_text = coalesce(public.settings.location_end_time_text, excluded.location_end_time_text),
  gift_title = coalesce(public.settings.gift_title, excluded.gift_title),
  gift_description = coalesce(public.settings.gift_description, excluded.gift_description),
  gift_mandiri_account = coalesce(public.settings.gift_mandiri_account, excluded.gift_mandiri_account),
  gift_bca_account = coalesce(public.settings.gift_bca_account, excluded.gift_bca_account),
  gift_show_mandiri = coalesce(public.settings.gift_show_mandiri, excluded.gift_show_mandiri),
  gift_show_bca = coalesce(public.settings.gift_show_bca, excluded.gift_show_bca),
  love_story = coalesce(public.settings.love_story, excluded.love_story),
  gallery = coalesce(public.settings.gallery, excluded.gallery),
  updated_at = now();

-- 5) RLS for settings table
alter table public.settings enable row level security;

drop policy if exists "Allow public read settings" on public.settings;
create policy "Allow public read settings" on public.settings for select to public using (true);

drop policy if exists "Allow public update wedding_config" on public.settings;
create policy "Allow public update wedding_config" on public.settings for update to public using (id = 'wedding_config') with check (id = 'wedding_config');

drop policy if exists "Allow public insert wedding_config" on public.settings;
create policy "Allow public insert wedding_config" on public.settings for insert to public with check (id = 'wedding_config');

-- =========================================================
-- STORAGE SETUP
-- =========================================================

-- 6) Create storage buckets
-- Bucket for wedding images (gallery, couple photos, etc.)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-images',
  'wedding-images',
  true,
  10485760,
  '{"image/jpeg", "image/png", "image/webp", "image/gif"}'
)
on conflict (id) do nothing;

-- Bucket for wedding music/audio
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-music',
  'wedding-music',
  true,
  52428800,
  '{"audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"}'
)
on conflict (id) do nothing;

-- 7) Storage RLS policies
-- Wedding-images: public read, authenticated write
drop policy if exists "Public read wedding-images" on storage.objects;
create policy "Public read wedding-images" on storage.objects
for select using (bucket_id = 'wedding-images');

drop policy if exists "Authenticated upload wedding-images" on storage.objects;
create policy "Authenticated upload wedding-images" on storage.objects
for insert to authenticated with check (bucket_id = 'wedding-images');

drop policy if exists "Authenticated delete wedding-images" on storage.objects;
create policy "Authenticated delete wedding-images" on storage.objects
for delete using (bucket_id = 'wedding-images');

-- Wedding-music: public read, authenticated write
drop policy if exists "Public read wedding-music" on storage.objects;
create policy "Public read wedding-music" on storage.objects
for select using (bucket_id = 'wedding-music');

drop policy if exists "Authenticated upload wedding-music" on storage.objects;
create policy "Authenticated upload wedding-music" on storage.objects
for insert to authenticated with check (bucket_id = 'wedding-music');

drop policy if exists "Authenticated delete wedding-music" on storage.objects;
create policy "Authenticated delete wedding-music" on storage.objects
for delete using (bucket_id = 'wedding-music');

-- 8) Verification
select 'Settings table' as table_name, count(*) as rows from public.settings
union all
select 'wedding-images bucket', count(*) from storage.buckets where id = 'wedding-images'
union all
select 'wedding-music bucket', count(*) from storage.buckets where id = 'wedding-music';
