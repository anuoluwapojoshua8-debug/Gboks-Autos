-- GBOKS AUTOS — Supabase schema (run in SQL editor, Step 2+).
-- No online payments: payment_status isiy local only (unpaid | paid_onsite).

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  duration text not null default '',
  price_from text not null default 'Quote',
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists time_slots (
  id uuid primary key default gen_random_uuid(),
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  capacity int not null default 2,
  active boolean not null default true
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  ref_no text unique not null,               -- e.g. GBK-7X2K9A
  full_name text not null,
  phone text not null,
  email text,
  car_make text not null,
  car_model text not null,
  car_year int,
  plate_number text,
  service_slug text not null references services(slug),
  preferred_date date not null,
  time_slot_id uuid references time_slots(id),
  problem text,
  photo_urls text[] default '{}',
  status text not null default 'pending',    -- pending|confirmed|completed|cancelled
  payment_status text not null default 'unpaid', -- unpaid|paid_onsite (LOCAL ONLY)
  created_at timestamptz default now()
);

create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  ticket_no text unique not null,            -- e.g. CMP-4F8K2Q
  name text not null,
  contact text not null,
  booking_ref text,
  category text not null,                    -- service quality|pricing|delay|staff conduct|other
  message text not null,
  attachment_urls text[] default '{}',
  status text not null default 'received',   -- received|in_review|resolved
  admin_reply text,
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  car text,
  text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer',     -- customer|admin
  created_at timestamptz default now()
);

-- Step 8 extras: quote requests + newsletter subscribers.
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  ref_no text unique not null,               -- e.g. QTE-7X2K9A
  name text not null,
  contact text not null,
  car_make text not null,
  car_model text not null,
  car_year int,
  service_slug text not null references services(slug),
  symptom text not null,
  photo_urls text[] default '{}',
  status text not null default 'received',   -- received|quoted|booked|declined
  estimate_low text,
  estimate_high text,
  created_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Step 9b: team roster edited from the admin dashboard.
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  detail text not null default '',
  initials text not null default '',
  tint text not null default 'bg-[#E1F3FE] text-[#1F6C9F]',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Storage buckets (create in Dashboard > Storage):
--   booking-photos (public read off, authed write) — customer car problem photos
--   complaint-attachments — complaint evidence
--   gallery — before/after + workshop images (public read on)
