-- GBOKS AUTOS — Supabase schema (run in SQL editor, Step 2+).
-- No online payments: payment_status iseya local only (unpaid | paid_onsite).

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

-- Storage buckets (create in Dashboard > Storage):
--   booking-photos (public read off, authed write) — customer car problem photos
--   complaint-attachments — complaint evidence
--   gallery — before/after + workshop images (public read on)

-- Default weekly windows: Mon-Fri 4 slots, Sat 2, Sun closed.
-- Weekday follows Postgres EXTRACT(DOW): 0 Sunday … 6 Saturday.
insert into time_slots (weekday, start_time, end_time, capacity) values
 (1,'08:00','10:00',2),(1,'10:00','12:00',2),(1,'13:00','15:00',2),(1,'15:00','17:00',2),
 (2,'08:00','10:00',2),(2,'10:00','12:00',2),(2,'13:00','15:00',2),(2,'15:00','17:00',2),
 (3,'08:00','10:00',2),(3,'10:00','12:00',2),(3,'13:00','15:00',2),(3,'15:00','17:00',2),
 (4,'08:00','10:00',2),(4,'10:00','12:00',2),(4,'13:00','15:00',2),(4,'15:00','17:00',2),
 (5,'08:00','10:00',2),(5,'10:00','12:00',2),(5,'13:00','15:00',2),(5,'15:00','17:00',2),
 (6,'09:00','12:00',2),(6,'12:00','15:00',2)
on conflict do nothing;

-- Seed core services (mirrors lib/demo-data.ts fallback):
insert into services (slug, title, description, duration, price_from) values
 ('general-servicing','General Servicing','Full inspection, fluids, filters & 40-point check.','2-4 hrs','₦25,000'),
 ('engine-diagnostics','Engine Diagnostics','Dealer-level OBD scan & repair plan.','45-90 min','₦10,000'),
 ('brake-repair','Brake Repair','Pads, discs, calipers & ABS.','1-3 hrs','₦15,000'),
 ('suspension','Suspension & Steering','Shocks, bushings, tie-rods.','2-5 hrs','₦20,000'),
 ('ac-repair','AC Repair & Regas','Leak test, compressor & regas.','1-2 hrs','₦12,000'),
 ('electrical','Auto Electrical','Battery, alternator, starter & wiring.','1-3 hrs','₦8,000'),
 ('tire-alignment','Tires & Alignment','Fitting, balancing & 3D alignment.','45-90 min','₦7,500'),
 ('oil-change','Oil Change','Quality oil + OEM filter.','~45 min','₦18,000'),
 ('body-work','Body Work & Paint','Dent removal & oven-baked spray.','1-5 days','Quote')
on conflict (slug) do nothing;
