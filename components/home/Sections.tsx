"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Siren } from "@phosphor-icons/react";
import { SITE } from "@/lib/constants";
import { Reveal } from "@/components/Reveal";

export function IntroSteps() {
  const steps = [
    { n: "1", t: "Book in 60 seconds", d: "Pick a service, date and time. Get an instant reference number." },
    { n: "2", t: "We inspect and quote", d: "Free inspection plus a written quote with photos on WhatsApp." },
    { n: "3", t: "We fix, you drive", d: "Quality parts, same-day turnaround, pay on pickup." },
  ];
  return (
    <section className="section-pad !pt-0" aria-label="How booking works">
      <div className="container-x">
        {/* Split intro: sticky statement left, steps cascade right */}
        <Reveal>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-2xl font-bold leading-tight text-[#111111] dark:text-white sm:text-3xl">
              One visit, one honest bill.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-300">
              <strong className="font-semibold text-[#111111] dark:text-white">GBOKS AUTOS</strong> is a
              full-service workshop in Ikeja, servicing, diagnostics, brakes,
              suspension, AC, electrical, tires, oil change and body work.
            </p>
            <Link href="/booking" className="link-more mt-4">Start a booking →</Link>
          </div>
          <ol className="space-y-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="flex gap-4 rounded-xl border border-[#EAEAEA] bg-white p-5 dark:border-white/10 dark:bg-charcoal-900"
              >
                <span aria-hidden
                  className="tnum grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#111111] font-display text-base font-bold text-white dark:bg-white dark:text-[#111111]">
                  {s.n}
                </span>
                <div>
                  <p className="font-display font-semibold text-[#111111] dark:text-white">{s.t}</p>
                  <p className="mt-1 max-w-[52ch] text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="section-pad !pt-0" aria-label="Book or get emergency help">
      <div className="container-x">
        <Reveal>
        <div className="relative overflow-hidden rounded-xl bg-[#111111] text-white">
          <Image
            src="/images/sections/cta-road-dusk.jpg"
            alt="Cars on a bridge road at dusk"
            fill
            loading="lazy"
            sizes="100vw"
            className="photo-warm object-cover opacity-25"
          />
          <div className="relative px-6 py-12 text-left sm:px-10 lg:px-14">
            <p className="tag tag-yellow">Same-week slots open</p>
            <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-bold leading-[1.08] sm:text-4xl">
              Car acting up? Don&apos;t wait for it to strand you.
            </h2>
            <p className="tnum mt-2 max-w-[52ch] text-[15px] text-white/70">
              {SITE.payNote}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/booking" className="btn-primary !bg-white !text-[#111111] hover:!bg-neutral-200 dark:!bg-white dark:!text-[#111111]">
                <CalendarCheck size={19} weight="bold" /> Book an appointment
              </Link>
              <Link
                href="/emergency"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-[#111111] active:scale-[0.98]"
              >
                <Siren size={19} weight="bold" /> Emergency / roadside
              </Link>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
