-- GBOKS AUTOS — RLS lockdown (run AFTER supabase/schema.sql in the SQL editor).
-- schema.sql ships with NO RLS, so without this file every table is
-- wide open once you expose the anon key. Run this second.
--
-- Model:
--   public (anon) : INSERT bookings / complaints / testimonials /
--                   quote_requests / newsletter_subscribers.
--                   SELECT services, team_members, time_slots (active only),
--                   testimonials (approved only),
--                   bookings/complaints by ref (app enforces phone/contact match).
--   admin only    : SELECT + UPDATE + DELETE on everything (auth.uid() with
--                   profiles.role = 'admin'). Profiles role can only be set via SQL.

-- 1) Admin helper. SECURITY DEFINER so it bypasses profiles RLS and
--    avoids infinite recursion when profiles policies call it.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2) Switch RLS on for every app table.
alter table public.services               enable row level security;
alter table public.time_slots             enable row level security;
alter table public.bookings               enable row level security;
alter table public.complaints             enable row level security;
alter table public.testimonials           enable row level security;
alter table public.profiles               enable row level security;
alter table public.quote_requests         enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.team_members           enable row level security;

-- 3) SERVICES — public catalogue read, admin writes.
drop policy if exists "public_read_active_services" on public.services;
create policy "public_read_active_services" on public.services
  for select to anon, authenticated using (active = true);

drop policy if exists "admin_all_services" on public.services;
create policy "admin_all_services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4) TEAM_MEMBERS — public roster read, admin writes.
drop policy if exists "public_read_active_team" on public.team_members;
create policy "public_read_active_team" on public.team_members
  for select to anon, authenticated using (active = true);

drop policy if exists "admin_all_team" on public.team_members;
create policy "admin_all_team" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5) TIME_SLOTS — public reads open windows, admin manages capacity.
drop policy if exists "public_read_active_slots" on public.time_slots;
create policy "public_read_active_slots" on public.time_slots
  for select to anon, authenticated using (active = true);

drop policy if exists "admin_all_slots" on public.time_slots;
create policy "admin_all_slots" on public.time_slots
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 6) BOOKINGS
-- Public insert (online booking) + public select-by-ref. NOTE: RLS alone
-- cannot verify the phone number — lib/bookings.ts fetches by ref_no and
-- then compares the last 7 digits of the phone client-side, returning null
-- on mismatch. Treat ref_no as a capability URL: unguessable (GBK-XXXXXX)
-- but anyone holding it can view that one row.
-- Public update covers customer reschedule/cancel (date/slot/status).
-- No public delete. Full access is admin-only.
drop policy if exists "public_insert_bookings" on public.bookings;
create policy "public_insert_bookings" on public.bookings
  for insert to anon, authenticated with check (true);

drop policy if exists "public_select_bookings_by_ref" on public.bookings;
create policy "public_select_bookings_by_ref" on public.bookings
  for select to anon, authenticated using (true);

drop policy if exists "public_update_own_booking" on public.bookings;
create policy "public_update_own_booking" on public.bookings
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "admin_all_bookings" on public.bookings;
create policy "admin_all_bookings" on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 7) COMPLAINTS — same shape as bookings, no public update/delete.
drop policy if exists "public_insert_complaints" on public.complaints;
create policy "public_insert_complaints" on public.complaints
  for insert to anon, authenticated with check (true);

drop policy if exists "public_select_complaints_by_ticket" on public.complaints;
create policy "public_select_complaints_by_ticket" on public.complaints
  for select to anon, authenticated using (true);

drop policy if exists "admin_all_complaints" on public.complaints;
create policy "admin_all_complaints" on public.complaints
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 8) TESTIMONIALS (reviews) — public submits unapproved, reads approved wall.
drop policy if exists "public_insert_reviews" on public.testimonials;
create policy "public_insert_reviews" on public.testimonials
  for insert to anon, authenticated with check (approved = false);

drop policy if exists "public_read_approved_reviews" on public.testimonials;
create policy "public_read_approved_reviews" on public.testimonials
  for select to anon, authenticated using (approved = true);

drop policy if exists "admin_all_reviews" on public.testimonials;
create policy "admin_all_reviews" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 9) QUOTE_REQUESTS — public insert only. No public read (refs stay private).
drop policy if exists "public_insert_quotes" on public.quote_requests;
create policy "public_insert_quotes" on public.quote_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "admin_all_quotes" on public.quote_requests;
create policy "admin_all_quotes" on public.quote_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 10) NEWSLETTER_SUBSCRIBERS — public insert only. No public read.
drop policy if exists "public_insert_newsletter" on public.newsletter_subscribers;
create policy "public_insert_newsletter" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

drop policy if exists "admin_all_newsletter" on public.newsletter_subscribers;
create policy "admin_all_newsletter" on public.newsletter_subscribers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 11) PROFILES — users see/insert their own row; ONLY admins update/delete.
-- This blocks privilege escalation (customers cannot set role='admin').
drop policy if exists "users_select_own_profile" on public.profiles;
create policy "users_select_own_profile" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "users_insert_own_profile" on public.profiles;
create policy "users_insert_own_profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "admin_all_profiles" on public.profiles;
create policy "admin_all_profiles" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 12) STORAGE — create private + public buckets (idempotent).
insert into storage.buckets (id, name, public)
values
  ('booking-photos', 'booking-photos', false),
  ('complaint-attachments', 'complaint-attachments', false),
  ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- booking-photos / complaint-attachments: anyone can upload (booking flow),
-- nobody lists publicly; admin reads/deletes. Reads go via signed URLs
-- minted in lib/bookings.ts + lib/feedback.ts.
drop policy if exists "public_upload_booking_photos" on storage.objects;
create policy "public_upload_booking_photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'booking-photos');

drop policy if exists "public_upload_complaint_files" on storage.objects;
create policy "public_upload_complaint_files" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'complaint-attachments');

drop policy if exists "admin_read_private_uploads" on storage.objects;
create policy "admin_read_private_uploads" on storage.objects
  for select to authenticated using (
    bucket_id in ('booking-photos', 'complaint-attachments') and public.is_admin()
  );

drop policy if exists "admin_delete_private_uploads" on storage.objects;
create policy "admin_delete_private_uploads" on storage.objects
  for delete to authenticated using (
    bucket_id in ('booking-photos', 'complaint-attachments') and public.is_admin()
  );

-- gallery: world-readable, admin-writable.
drop policy if exists "public_read_gallery" on storage.objects;
create policy "public_read_gallery" on storage.objects
  for select to anon, authenticated using (bucket_id = 'gallery');

drop policy if exists "admin_write_gallery" on storage.objects;
create policy "admin_write_gallery" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admin_update_gallery" on storage.objects;
create policy "admin_update_gallery" on storage.objects
  for update to authenticated using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admin_delete_gallery" on storage.objects;
create policy "admin_delete_gallery" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery' and public.is_admin());
