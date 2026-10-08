# GBOKS AUTOS — Lagos Auto Repair & Servicing

Modern, mobile-first site. **Next.js 14 (App Router) + Tailwind + Supabase.**
Payment is **local only** (cash / bank transfer on pickup) — no gateway.

## Quick start

```powershell
npm install
Copy-Item .env.example .env.local   # add Supabase URL + anon key (optional for Step 1)
npm run dev                          # http://localhost:3000
```

Without Supabase keys the site runs on built-in demo data (Step 1).

## Scripts

- `npm run dev` — local dev
- `npm run build` / `npm run start` — production
- `npm run typecheck` — TypeScript check

## Structure

```
app/            layout, page (Home), about, services, booking, track-booking,
                complaints, gallery, contact, faq, blog, quote, login, emergency, admin
components/     Navbar, Footer, WhatsAppFloat, ThemeToggle, Providers,
                home/ (Hero, ServicesGrid, WhyChooseUs, Testimonials, Sections)
lib/            constants, supabase, demo-data
supabase/       schema.sql (run in Supabase SQL editor)
public/         logo.svg, images/ (drop real workshop photos here)
```

## Brand

- Deep charcoal `#1A1D21`, safety orange `#FF5C00`, white
- Light/dark via `next-themes` (`class` strategy)
- System font stack = fast on slow 3G; `next/image` lazy for photos

## Deploy

Vercel (recommended): import repo → set `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY` → Deploy. Or any Node host with `npm run build`.

## Roadmap (step by step)

1. ✅ Structure + Home
2. ✅ About (story, CEO, team, counters)
3. ✅ Services catalogue (Supabase-driven)
4. ✅ Booking + track/reschedule (slots, ref-no, uploads)
5. ✅ Complaints + reviews
6. ✅ Gallery  7. ✅ Contact  8. ✅ Extras (FAQ/blog/quote/login/newsletter/emergency)
9. ✅ Admin dashboard + CSV export
