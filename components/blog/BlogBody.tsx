"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import type { Tip } from "@/lib/tips";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";
import { cn } from "@/lib/cn";

const TAG_CLS: Record<string, string> = {
  Diagnostics: "tag-blue",
  "AC & cooling": "tag-blue",
  Brakes: "tag-red",
  Cooling: "tag-red",
  Servicing: "tag-green",
  Seasonal: "tag-yellow",
};

// Tips index: editorial cards with tag, read time and excerpt.
export function BlogBody({ tips }: { tips: Tip[] }) {
  return (
    <>
      <section>
        <div className="container-x max-w-5xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Car tips
          </p>
          <p className="tag tag-green mt-4">Plain maintenance notes</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Small habits that keep bills small.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            Written by the technicians, for Lagos conditions: heat, hold-ups, harmattan dust and rainy-season floods.
          </p>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Car care articles">
        <div className="container-x max-w-5xl">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {tips.map((t, i) => (
                <Link
                  key={t.slug}
                  href={`/blog/${t.slug}`}
                  className={cn("card card-hover group", i === 0 && "sm:col-span-2")}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("tag", TAG_CLS[t.tag] ?? "tag-blue")}>{t.tag}</span>
                    <span className="tnum text-xs text-[#787774] dark:text-neutral-400">{t.minutes} min • {t.date}</span>
                  </span>
                  <span className="mt-2 block font-display text-xl font-semibold leading-snug text-[#111111] dark:text-white">{t.title}</span>
                  <span className="mt-1 block text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{t.excerpt}</span>
                  <span className="link-more mt-3">Read the note <ArrowRight size={15} weight="bold" /></span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
