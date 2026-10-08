"use client";

import { HandCoins, SealCheck, Timer, UserCheck } from "@phosphor-icons/react";
import { SectionHeading } from "@/components/SectionHeading";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import { STATS } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

const WHY = [
  { icon: UserCheck, tile: "bg-[#E1F3FE] text-[#1F6C9F]", title: "Technicians with road years", text: "11+ years on Toyota, Honda, Lexus, Kia and more. We show you the fault before we fix it." },
  { icon: HandCoins, tile: "bg-[#EDF3EC] text-[#346538]", title: "Quotes you approve first", text: "Written quote before work starts. You approve every naira, no surprise add-ons." },
  { icon: SealCheck, tile: "bg-[#FBF3DB] text-[#956400]", title: "Parts you can verify", text: "OEM or proven equivalents, with old parts returned to you in a bag." },
  { icon: Timer, tile: "bg-[#FDEBEC] text-[#9F2F2D]", title: "Same-day where it matters", text: "Most servicing done same day, with WhatsApp photo updates while we work." },
];

// Offset two-column panels with pastel icon tiles. Flat hairlines,
// whisper hover. Counters use tabular figures in plain bordered cells.
export function WhyChooseUs() {
  return (
    <section className="section-pad bg-white dark:bg-charcoal-950" aria-labelledby="why-h">
      <div className="container-x">
        <SectionHeading
          title="The workshop habit Lagos drivers keep"
          sub="Not the cheapest bay on the street, the one that explains, proves, and road-tests."
        />
        <Reveal>
        <div id="why-h" className="mt-8 grid gap-4 md:grid-cols-2">
          {WHY.map((w, k) => (
            <div key={w.title} className={cn("card card-hover", k % 2 === 1 && "md:translate-y-4")}>
              <div className="flex gap-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${w.tile}`}>
                  <w.icon size={22} weight="bold" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#111111] dark:text-white">{w.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{w.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </Reveal>
        {/* Proof counters */}
        <Reveal delay={80}>
        <dl className="tnum mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-[#EAEAEA] bg-white p-4 text-center dark:border-white/10 dark:bg-charcoal-900">
              <dd className="font-display text-3xl font-bold text-[#111111] dark:text-white">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </dd>
              <dt className="mt-1 text-[13px] font-medium text-[#787774] dark:text-neutral-400">{s.label}</dt>
            </div>
          ))}
        </dl>
        </Reveal>
      </div>
    </section>
  );
}
