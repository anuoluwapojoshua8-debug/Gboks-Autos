"use client";

import Link from "next/link";
import {
  PaintRoller,
  Tire,
  Engine,
  Disc,
  Drop,
  SteeringWheel,
  Snowflake,
  Wrench,
  Lightning,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { SERVICES } from "@/lib/demo-data";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
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

// Bento rhythm: lead card spans two columns, pastel icon tiles rotate
// through the four spot tones. Flat hairline cards, whisper hover only.
const TILES = [
  "bg-[#E1F3FE] text-[#1F6C9F]",
  "bg-[#EDF3EC] text-[#346538]",
  "bg-[#FBF3DB] text-[#956400]",
  "bg-[#FDEBEC] text-[#9F2F2D]",
];
export function ServicesGrid({ limit = 6 }: { limit?: number }) {
  const items = SERVICES.slice(0, limit);
  return (
    <section className="section-pad" aria-labelledby="services-h">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Repairs Lagos cars ask for most"
            sub="From quick oil changes to full diagnostics, upfront prices, no surprises."
          />
          <Link href="/services" className="link-more">See all services →</Link>
        </div>
        <Reveal>
        <div id="services-h" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, idx) => {
            const Icon = ICONS[s.icon] ?? Wrench;
            const lead = idx === 0;
            return (
              <article
                key={s.slug}
                className={cn(
                  "card card-hover group flex flex-col",
                  lead && "bg-[#F9F9F8] sm:col-span-2 lg:col-span-1 dark:bg-charcoal-900"
                )}
              >
              <div className="flex h-full flex-col">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${TILES[idx % TILES.length]}`}>
                  <Icon size={22} weight="bold" />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#111111] dark:text-white">{s.title}</h3>
                <p className="mt-1 text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{s.desc}</p>
                <div className="tnum mt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#787774] dark:text-neutral-400">{s.duration}</span>
                  <span className="font-bold text-[#111111] dark:text-white">from {s.priceFrom}</span>
                </div>
                <div className="mt-auto pt-4">
                <Link
                  href={`/booking?service=${s.slug}`}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#333333] active:scale-[0.98] dark:bg-white dark:text-[#111111] dark:hover:bg-neutral-200"
                  aria-label={`Book ${s.title}`}
                >
                  Book this service
                </Link>
                </div>
              </div>
              </article>
            );
          })}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
