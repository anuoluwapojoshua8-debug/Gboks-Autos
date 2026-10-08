"use client";

import Image from "next/image";
import Link from "next/link";
import { Medal, Eye, Handshake, Quotes, Target } from "@phosphor-icons/react";
import { SectionHeading } from "@/components/SectionHeading";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";
import { CEO, CERTS, STATS } from "@/lib/demo-data";
import type { TeamMember } from "@/lib/team";

// Client island: renders Phosphor icons (module-scope hooks, no RSC).
const VALUES = [
  { icon: Handshake, tile: "bg-[#EDF3EC] text-[#346538]", title: "Honesty first", text: "We diagnose, show you the fault, and quote before touching a bolt. No invented faults, ever." },
  { icon: Medal, tile: "bg-[#FBF3DB] text-[#956400]", title: "Quality parts", text: "OEM or proven equivalents only, with old parts returned to you in a bag, every time." },
  { icon: Target, tile: "bg-[#E1F3FE] text-[#1F6C9F]", title: "Done right, done fast", text: "Same-day turnaround on most jobs, and we road-test before handover." },
];

export function AboutBody({ team }: { team: TeamMember[] }) {
  return (
    <>
      {/* Page hero: light editorial, serif headline */}
      <section>
        <div className="container-x pb-10 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors duration-200 hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> About
          </p>
          <h1 className="serif-display mt-3 max-w-[20ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            The workshop Lagos drivers recommend to friends.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            GBOKS AUTOS started with one bay, one scanner, and a rule: explain
            before charging. Today we service thousands of cars a year from our
            Ikeja workshop. Same rule.
          </p>
        </div>
      </section>

      {/* Story: asymmetric split, desaturated photography */}
      <section className="section-pad !pt-0" aria-labelledby="story-h">
        <Reveal>
        <div className="container-x grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <figure className="overflow-hidden rounded-xl border border-[#EAEAEA] bg-white dark:border-white/10 dark:bg-charcoal-900">
            <div className="relative aspect-[4/3]">
              <Image
                src="https://picsum.photos/seed/gboks-story/1200/900"
                alt="Technician inspecting an engine inside the workshop"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="photo-warm object-cover"
              />
            </div>
            <figcaption className="tnum border-t border-[#EAEAEA] px-4 py-2.5 text-xs text-[#787774] dark:border-white/10 dark:text-neutral-400">
              Since 2013. Ikeja, Lagos. The founder&apos;s bay in year one.
            </figcaption>
          </figure>
          <div>
            <p className="kicker">Our story</p>
            <h2 id="story-h" className="mt-2 font-display text-2xl font-bold text-[#111111] dark:text-white sm:text-3xl">Built to fix a trust problem</h2>
            <div className="mt-3 max-w-[62ch] space-y-3 text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-300">
              <p>
                GBOKS AUTOS was founded in Lagos to fix a trust problem: drivers
                paying for parts they never saw, for faults never explained. We
                built the opposite: a workshop where every job starts with an
                inspection, a photo, and a written quote you approve.
              </p>
              <p>
                From routine servicing to engine diagnostics, brakes, AC,
                electrical and body work, our technicians handle Toyota, Honda,
                Lexus, Kia, Hyundai and more: daily drivers, family SUVs and
                company fleets.
              </p>
            </div>
            <ol className="mt-5 space-y-2 text-sm">
              {[
                ["2013", "One-bay workshop opens in Ikeja.", "tag-blue"],
                ["2018", "Dealer-level diagnostics bay added; 2,000th car serviced.", "tag-green"],
                ["2024", "Online booking plus WhatsApp photo updates launched.", "tag-yellow"],
              ].map(([y, t, tag]) => (
                <li key={y} className="flex items-center gap-3">
                  <span className={`tag tnum ${tag}`}>{y}</span>
                  <span className="text-[#2F3437] dark:text-neutral-300">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Mission / Vision / Values on flat surfaces */}
      <section className="section-pad !pt-0" aria-label="Mission, vision and values">
        <div className="container-x">
          <Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <p className="tag tag-blue">Mission</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-[#111111] dark:text-white">Keep Lagos moving</h2>
              <p className="mt-1 max-w-[56ch] text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-300">
                Safe, fairly-priced car care. We prove
                every job with photos, old parts, and a road test.
              </p>
            </div>
            <div className="card">
              <p className="tag tag-green">Vision</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-[#111111] dark:text-white">The name drivers pass on</h2>
              <p className="mt-1 max-w-[56ch] text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-300">
                The most trusted independent auto workshop in Nigeria. The name
                drivers give when a friend asks “who is your mechanic?”
              </p>
            </div>
          </div>
          </Reveal>
          <Reveal delay={80}>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v, k) => (
              <div key={v.title} className={`card card-hover ${k === 1 ? "sm:translate-y-3" : ""}`}>
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${v.tile}`}>
                  <v.icon size={22} weight="bold" />
                </span>
                <h3 className="mt-2 font-display font-semibold text-[#111111] dark:text-white">{v.title}</h3>
                <p className="mt-1 text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{v.text}</p>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* CEO */}
      <section className="section-pad bg-white dark:bg-charcoal-950" aria-labelledby="ceo-h">
        <div className="container-x">
          <SectionHeading kicker="Leadership" title="Meet the founder" sub="The standard for every job in our bays." />
          <Reveal>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
            <figure className="overflow-hidden rounded-xl border border-[#EAEAEA] bg-white dark:border-white/10 dark:bg-charcoal-900">
              <div className="relative aspect-[3/4]">
                <Image
                  src="https://picsum.photos/seed/gboks-ceo/560/750"
                  alt="Portrait of the GBOKS AUTOS founder"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="photo-warm object-cover"
                />
              </div>
              <figcaption className="border-t border-[#EAEAEA] px-4 py-2.5 text-xs text-[#787774] dark:border-white/10 dark:text-neutral-400">
                {CEO.name} • {CEO.title}, photo placeholder
              </figcaption>
            </figure>
            <div className="card">
              <h3 id="ceo-h" className="font-display text-2xl font-bold text-[#111111] dark:text-white">{CEO.name}</h3>
              <p className="mt-1"><span className="tag tag-yellow">{CEO.title}</span></p>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-300">{CEO.bio}</p>
              <figure className="mt-5 rounded-xl bg-[#F9F9F8] p-5 dark:bg-white/5">
                <Quotes size={20} weight="fill" className="text-[#956400]" />
                <blockquote className="serif-display mt-2 text-xl italic text-[#111111] dark:text-white">
                  “{CEO.message}”
                </blockquote>
                <figcaption className="mt-2 text-sm font-semibold text-[#111111] dark:text-white">- {CEO.name}</figcaption>
              </figure>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/booking" className="btn-primary">Book with our team</Link>
                <Link href="/contact" className="link-more">Talk to us first →</Link>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Team: pastel initial tiles, staggered */}
      <section className="section-pad" aria-labelledby="team-h">
        <div className="container-x">
          <SectionHeading kicker="The crew" title="Technicians you will actually meet" sub="Specialists by bay, ask for them by name, not by fine print." />
          <Reveal>
          <div id="team-h" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, k) => (
              <div key={m.role} className={`card card-hover text-left ${k % 2 === 1 ? "lg:translate-y-4" : ""}`}>
                <div aria-hidden className={`grid h-16 w-16 place-items-center rounded-xl font-display text-lg font-bold ${m.tint}`}>
                  {m.initials}
                </div>
                <h3 className="mt-3 font-display font-semibold text-[#111111] dark:text-white">{m.name}</h3>
                <p className="text-[13px] font-semibold text-[#956400]">{m.role}</p>
                <p className="mt-1 text-sm text-[#787774] dark:text-neutral-400">{m.detail}</p>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* Proof: certs + counters */}
      <section className="section-pad !pt-0" aria-label="Certifications and track record">
        <div className="container-x">
          <Reveal>
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-[#111111] dark:text-white">Certifications and standards</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {CERTS.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-[#2F3437] dark:text-neutral-300">
                  <Medal size={16} weight="bold" className="mt-0.5 shrink-0 text-[#956400]" /> {c}
                </li>
              ))}
            </ul>
            <dl className="tnum mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl bg-[#F9F9F8] p-4 text-center dark:bg-white/5">
                  <dd className="font-display text-3xl font-bold text-[#111111] dark:text-white">
                    <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </dd>
                  <dt className="mt-1 text-[13px] font-medium text-[#787774] dark:text-neutral-400">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
