# Wedding Invitation Boilerplate

Project website undangan pernikahan menggunakan Next.js (App Router), Tailwind CSS, Framer Motion, dan Supabase.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Supabase](https://supabase.com/) (Real-time Guestbook & RSVP)
- **Icons**: [Lucide React](https://lucide.dev/)

## Setup Supabase
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Salin `URL` dan `Anon Public Key` ke file `.env.local`.
3. Jalankan query SQL berikut di SQL Editor Supabase untuk membuat tabel `guestbook`:

```sql
create table guestbook (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  message text not null,
  attendance text not null,
  guest_count integer default 1
);

-- Aktifkan Row Level Security (RLS)
alter table guestbook enable row level security;

-- Policy untuk tabel guestbook (RSVP)
create policy "Public can read guestbook"
  on guestbook for select
  using (true);

create policy "Public can insert into guestbook"
  on guestbook for insert
  with check (true);

-- OPTIONAL: Tabel untuk tracking undangan (Invitations)
-- Digunakan jika ingin menyimpan daftar orang yang diundang ke database
create table invitations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text unique not null,
  status text default 'pending' -- pending, sent, opened
);

-- Policy untuk invitations
alter table invitations enable row level security;
create policy "Admin can do everything on invitations"
  on invitations for all
  using (true);

-- Tabel untuk pengaturan konten (Settings)
create table settings (
  id text primary key default 'wedding_config',
  wedding_date timestamp with time zone default '2026-04-23T09:00:00+07:00',
  wedding_end_time timestamp with time zone default '2026-04-23T13:00:00+07:00',
  love_story jsonb default '[
    {"year": "Januari 2021", "title": "Awal Pertemuan", "description": "Kami pertama kali bertemu di sebuah acara seminar kampus."},
    {"year": "Mei 2022", "title": "Kencan Pertama", "description": "Kencan pertama kami di sebuah kedai kopi kecil."},
    {"year": "Oktober 2024", "title": "Lamaran", "description": "Di bawah cahaya bintang, Habibie melamar Lala."},
    {"year": "April 2026", "title": "Pernikahan", "description": "Hari yang paling dinantikan."}
  ]'::jsonb,
  gallery jsonb default '[
    {"url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", "alt": "Gallery 1"},
    {"url": "https://images.unsplash.com/photo-1519741497674-611481863552", "alt": "Gallery 2"},
    {"url": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8", "alt": "Gallery 3"},
    {"url": "https://images.unsplash.com/photo-1522673607200-1648832cee98", "alt": "Gallery 4"},
    {"url": "https://images.unsplash.com/photo-1532712938310-34cb3982ef74", "alt": "Gallery 5"}
  ]'::jsonb,
  updated_at timestamp with time zone default now()
);

-- Masukkan data awal
insert into settings (id) values ('wedding_config') on conflict (id) do nothing;

-- Policy untuk settings
alter table settings enable row level security;
create policy "Public can read settings" on settings for select using (true);
create policy "Admin can update settings" on settings for update using (true);
```

## Cara Menjalankan
1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Folder
- `/app`: Next.js App Router (Pages, Layout, Globals CSS)
- `/components`: Komponen React (Hero, Countdown, LoveStory, Gallery, Guestbook)
- `/lib`: Konfigurasi library (Supabase client)
- `/public`: Aset statis (Gambar, Font)

## Deployment ke cPanel
1. Pastikan Anda sudah menjalankan `npm run build` di lokal.
2. Upload seluruh file (kecuali `node_modules` dan `.next`) ke cPanel.
3. Folder `.next` hasil build wajib di-upload.
4. Di cPanel Node.js Selector:
   - **Application Root**: Lokasi folder project Anda.
   - **Application URL**: Domain Anda.
   - **Application startup file**: `server.js`.
5. Pastikan Environment Variables (seperti yang ada di `.env.local`) sudah dimasukkan di cPanel.
6. Jalankan **Run JS Install** di cPanel untuk menginstall dependencies.
7. Restart aplikasi.
