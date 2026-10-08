"use client";

import { useEffect, useState } from "react";
import { CaretLeft, CaretRight, Star } from "@phosphor-icons/react";
import { TESTIMONIALS } from "@/lib/demo-data";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

function Stars({ value, size = 17 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, k) => (
        <Star
          key={k}
          size={size}
          weight={k < value ? "fill" : "regular"}
          className={k < value ? "fill-[#956400] text-[#956400]" : "text-neutral-300"}
        />
      ))}
    </div>
  );
}

// Editorial reviews: one featured serif quote plus a staggered wall.
// Auto-rotates the feature; dates vary so the wall reads real.
export function Testimonials() {
  const [i, setI] = useState(0);
  const n = TESTIMONIALS.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);

  const featured = TESTIMONIALS[i];
  const rest = TESTIMONIALS.filter((_, k) => k !== i).slice(0, 4);

  return (
    <section className="section-pad" aria-labelledby="testi-h">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="Word of mouth keeps our bays full" />
          <div className="flex items-center gap-2">
            <button onClick={() => go(-1)} aria-label="Previous review"
              className="grid h-11 w-11 place-items-center rounded-lg border border-[#EAEAEA] bg-white transition-all duration-200 hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10 dark:bg-charcoal-900 dark:hover:bg-white/10">
              <CaretLeft size={20} weight="bold" />
            </button>
            <button onClick={() => go(1)} aria-label="Next review"
              className="grid h-11 w-11 place-items-center rounded-lg border border-[#EAEAEA] bg-white transition-all duration-200 hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10 dark:bg-charcoal-900 dark:hover:bg-white/10">
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>

        <Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Featured rotating quote */}
          <figure key={i} className="card p-6 sm:p-8" aria-live="polite">
            <div className="flex items-center justify-between gap-2">
              <Stars value={featured.rating} />
              <span className="text-xs font-medium text-[#787774]">{featured.date}</span>
            </div>
            <blockquote className="serif-display mt-4 text-2xl text-[#111111] dark:text-white sm:text-[1.7rem]">
              “{featured.text}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-[#111111] dark:text-white">
              {featured.name} <span className="font-normal text-[#787774]">• {featured.car}</span>
            </figcaption>
            <div className="mt-4 flex gap-2" aria-label="Choose review">
              {TESTIMONIALS.map((_, k) => (
                <button key={k} aria-selected={k === i} aria-label={`Review ${k + 1}`} onClick={() => setI(k)}
                  className={cn("h-2 rounded-full transition-all duration-200", k === i ? "w-8 bg-[#111111] dark:bg-white" : "w-2 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-400")} />
              ))}
            </div>
          </figure>

          {/* Staggered wall of shorter notes */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {rest.map((t, k) => (
              <figure key={t.name} className={cn("card-flat p-4", k % 2 === 1 && "sm:translate-y-3")}>
                <Stars value={t.rating} size={13} />
                <blockquote className="mt-2 text-sm leading-[1.6] text-[#2F3437] dark:text-neutral-300">“{t.text}”</blockquote>
                <figcaption className="mt-2 text-xs font-semibold text-[#111111] dark:text-white">
                  {t.name} <span className="font-normal text-[#787774]">• {t.date}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
