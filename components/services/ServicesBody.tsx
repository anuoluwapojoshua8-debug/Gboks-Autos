"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Disc,
  Drop,
  Engine,
  Lightning,
  MagnifyingGlass,
  PaintRoller,
  Snowflake,
  SteeringWheel,
  Tire,
  Wrench,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import type { Service } from "@/lib/services";
import { SITE } from "@/lib/constants";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";
import { cn } from "@/lib/cn";

const ICONS: Record<string, PhosphorIcon> = {
  wrench: Wrench,
  cpu: Engine,
  disc: Disc,
  move: SteeringWheel,
  snowflake: Snowflake,
  zap: Lightning,
  circle: Tire,
  droplet: Drop,
  spray: PaintRoller,
};

const TILES = [
  "bg-[#E1F3FE] text-[#1F6C9F]",
  "bg-[#EDF3EC] text-[#346538]",
  "bg-[#FBF3DB] text-[#956400]",
  "bg-[#FDEBEC] text-[#9F2F2D]",
];

// Catalogue body: editorial hero, live search, flat bento grid,
// per-service booking links. Quiet entry via Reveal, no layout motion.
export function ServicesBody({
  services,
  live,
}: {
  services: Service[];
  live: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      `${s.title} ${s.desc} ${s.duration} ${s.priceFrom}`.toLowerCase().includes(q)
    );
  }, [services, query]);

  return (
    <>
      {/* Page hero: breadcrumb, serif headline, search */}
      <section>
        <div className="container-x max-w-5xl pb-10 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors duration-200 hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Services
          </p>
          <p className="tag tag-blue mt-4">Services & prices</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Every job, priced before we lift a spanner.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            {services.length} workshop services with honest durations and starting
            prices. Pick one to start a booking. Final quote is written and approved
            before work begins.
          </p>
          <p className="tnum mt-3 text-xs font-medium text-[#787774] dark:text-neutral-500">
            {live ? "Live prices from the workshop system" : "Showing standard prices"} • {SITE.payNote}
          </p>

          <div className="relative mt-6 max-w-xl">
            <MagnifyingGlass size={18} weight="bold" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
            <label htmlFor="service-search" className="sr-only">Search services</label>
            <input
              id="service-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brakes, AC, oil change…"
              autoComplete="off"
              className="min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white py-3 pl-11 pr-4 text-[15px] text-[#111111] placeholder:text-[#787774]/70 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white dark:focus:border-white"
            />
          </div>
          <p aria-live="polite" className="tnum mt-2 text-[13px] text-[#787774] dark:text-neutral-400">
            {filtered.length} of {services.length} services
            {query.trim() && <> for “{query.trim()}”</>}
          </p>
        </div>
      </section>

      {/* Catalogue grid */}
      <section className="section-pad !pt-0" aria-label="Service catalogue">
        <div className="container-x">
          {filtered.length > 0 ? (
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s, idx) => {
                  const Icon = ICONS[s.icon] ?? Wrench;
                  return (
                    <article key={s.slug} id={s.slug} className="card card-hover flex scroll-mt-28 flex-col">
                      <span className={cn("grid h-11 w-11 place-items-center rounded-xl", TILES[idx % TILES.length])}>
                        <Icon size={22} weight="bold" />
                      </span>
                      <h2 className="mt-3 font-display text-lg font-semibold text-[#111111] dark:text-white">{s.title}</h2>
                      <p className="mt-1 text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{s.desc}</p>
                      <div className="tnum mt-3 flex items-center justify-between border-t border-[#EAEAEA] pt-3 text-sm dark:border-white/10">
                        <span className="font-medium text-[#787774] dark:text-neutral-400">{s.duration}</span>
                        <span className="font-bold text-[#111111] dark:text-white">from {s.priceFrom}</span>
                      </div>
                      <div className="mt-auto pt-4">
                        <Link
                          href={`/booking?service=${s.slug}`}
                          aria-label={`Book ${s.title}`}
                          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#333333] active:scale-[0.98] dark:bg-white dark:text-[#111111] dark:hover:bg-neutral-200"
                        >
                          <CalendarCheck size={16} weight="bold" /> Book this service
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Reveal>
          ) : (
            <div className="card mx-auto max-w-xl text-center">
              <h2 className="font-display text-xl font-semibold text-[#111111] dark:text-white">No match for “{query.trim()}”</h2>
              <p className="mx-auto mt-2 max-w-[48ch] text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">
                Try “brakes”, “AC”, “diagnostics” or “oil”. Or describe the symptom
                when booking and we will trace it.
              </p>
              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => setQuery("")} className="btn-outline">Clear search</button>
                <Link href="/booking" className="btn-primary">Book general inspection</Link>
              </div>
            </div>
          )}

          {/* Quote promise */}
          <Reveal delay={80}>
            <div className="card-flat mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[62ch] text-sm leading-[1.6] text-[#2F3437] dark:text-neutral-300">
                <strong className="font-semibold text-[#111111] dark:text-white">How pricing works:</strong>{" "}
                the price above is the starting point. You get a free inspection, a written
                quote with photos on WhatsApp, and old parts returned in a bag.
              </p>
              <Link href="/quote" className="link-more shrink-0">
                Get a price estimate <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
