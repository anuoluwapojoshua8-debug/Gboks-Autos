"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MapPin, SealCheck, Star } from "@phosphor-icons/react";
import { SITE } from "@/lib/constants";

// Client island: renders Phosphor icons (module-scope hooks, no RSC).

// Hero: light editorial split. Serif headline, pastel location tag,
// monochrome CTAs, desaturated workshop photography in a hairline frame.
// Depth comes from a fixed ambient spot + hairline rule texture only.
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="ambient-blob" />
      <div aria-hidden className="rule-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="container-x relative grid items-center gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-24 lg:pt-20">
        <div className="reveal">
          <p className="tag tag-yellow">
            <MapPin size={13} weight="bold" />
            Ikeja, {SITE.city} • Mon-Sat open
          </p>
          <h1 className="serif-display mt-4 text-5xl text-[#111111] dark:text-white sm:text-6xl">
            Fast, honest <em className="pb-1">auto repair</em> you can trust.
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-[1.6] text-[#787774] dark:text-neutral-400 sm:text-lg">
            {SITE.tagline} Dealer-level diagnostics, fair pricing, quality parts.
            Most cars ready same day.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/booking" className="btn-primary reveal-1">
              <CalendarCheck size={19} weight="bold" /> Book an appointment
            </Link>
            <Link href="/services" className="btn-outline reveal-2">
              View services and prices
            </Link>
          </div>
        </div>

        {/* Workshop proof: framed photo over a bordered record */}
        <aside className="reveal-2" aria-label="This week at the workshop">
          <figure className="overflow-hidden rounded-xl border border-[#EAEAEA] bg-white dark:border-white/10 dark:bg-charcoal-900">
            <div className="relative aspect-[16/10]">
              <Image
                src="/images/sections/home-hero-bay.jpg"
                alt="Smiling mechanic in overalls inside the workshop"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="photo-warm object-cover"
              />
            </div>
            <figcaption className="border-t border-[#EAEAEA] px-4 py-2.5 text-xs text-[#787774] dark:border-white/10 dark:text-neutral-400">
              The Ikeja bay on a weekday morning.
            </figcaption>
          </figure>
          <ul className="mt-4 rounded-xl border border-[#EAEAEA] bg-white p-2 dark:border-white/10 dark:bg-charcoal-900">
            {[
              ["Camry 2018", "Full service + brakes", "Ready same day", "tag-green"],
              ["RX 350", "AC compressor + regas", "Tested cold", "tag-blue"],
              ["Corolla 2017", "Diagnostics + mounts", "Quoted first", "tag-yellow"],
            ].map(([car, job, note, tag]) => (
              <li key={car} className="flex items-center justify-between gap-3 border-b border-[#EAEAEA] px-3 py-2.5 text-sm last:border-0 dark:border-white/10">
                <div>
                  <p className="font-semibold text-[#111111] dark:text-white">{car}</p>
                  <p className="text-xs text-[#787774] dark:text-neutral-400">{job}</p>
                </div>
                <span className={`tag ${tag}`}>{note}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

// Trust strip: lives UNDER the hero as its own section, never inside it.
// Single row of proof points, tabular numerals, one restrained accent.
export function TrustStrip() {
  return (
    <section aria-label="Workshop track record" className="border-y border-[#EAEAEA] bg-white dark:border-white/10 dark:bg-charcoal-900">
      <div className="container-x flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm text-[#787774] dark:text-neutral-300">
        <span className="inline-flex items-center gap-1.5">
          <Star size={15} weight="fill" className="fill-[#956400] text-[#956400]" />
          <span className="tnum font-semibold text-[#111111] dark:text-white">4.8</span> from 612 reviews
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SealCheck size={15} weight="bold" className="text-[#346538]" /> Quality parts guaranteed
        </span>
        <span className="tnum">4,732 cars serviced since 2013</span>
      </div>
    </section>
  );
}
