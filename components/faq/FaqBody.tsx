"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";
import { cn } from "@/lib/cn";

type QA = { q: string; a: string; tag: string };

const FAQS: QA[] = [
  { q: "Do I need an appointment, or can I drive in?", a: "Appointments get priority and a guaranteed bay. Drive-ins are welcome on weekdays before 3 PM, but you may wait while booked cars go first. Saturdays are appointment-only when busy.", tag: "Booking" },
  { q: "Will the final bill match the quote?", a: "Yes. Every job starts with a free inspection and a written quote with photos on WhatsApp. Nothing starts until you approve it. If we find extra faults mid-job, we stop, photograph them, and quote again before touching anything.", tag: "Pricing" },
  { q: "How do I pay?", a: "Cash or bank transfer at the workshop when you pick up. There is no online payment and we never ask for deposits on chat.", tag: "Pricing" },
  { q: "What parts do you use?", a: "OEM or proven equivalents only — no roadside generics. The quote names the part grade, and your old parts come back to you in a bag with every job.", tag: "Parts" },
  { q: "How long does a service take?", a: "Oil changes run about 45 minutes. General servicing takes 2–4 hours. Diagnostics take 45–90 minutes. Most cars are ready the same day; body work takes 1–5 days and we say so upfront.", tag: "Booking" },
  { q: "Which cars do you handle?", a: "Toyota, Honda, Lexus, Kia and Hyundai daily — plus most Japanese and Korean models. Bring the VIN or a photo of the dashboard plate on WhatsApp if you are unsure and we will confirm before you drive in.", tag: "Repairs" },
  { q: "My dashboard warning light is on. Can I keep driving?", a: "A steady engine light with no noise or heat: drive gently and book diagnostics this week. A flashing light, temperature needle climbing, oil or brake warnings: stop safely and call us — driving on can multiply the repair bill.", tag: "Repairs" },
  { q: "What are your hours?", a: "Monday to Friday 8 AM – 6 PM, Saturday 9 AM – 4 PM. Sundays we are closed except for emergencies on the roadside line.", tag: "Hours" },
  { q: "Do you offer roadside help?", a: "Yes, within Lagos. Call the emergency line, share your location and car details, and we confirm the roadside fee on the phone before dispatch. Jump-starts, towing to our bay, and lockout help.", tag: "Emergency" },
  { q: "Is there a warranty on the work?", a: "Our workmanship guideline is 12 months or 10,000 km, whichever comes first. Parts carry their manufacturer cover. If a fixed fault returns inside the window, bring it back and we recheck free.", tag: "Parts" },
  { q: "How do I track or reschedule my booking?", a: "Use the reference number from your confirmation (GBK-XXXXXX) plus your phone number on the Track booking page. You can move the date and time window or cancel from the same screen.", tag: "Booking" },
  { q: "Do I get photos while you work?", a: "Yes. Approval photos before work, and progress photos on WhatsApp for longer jobs. You approve every naira before we spend it.", tag: "Pricing" },
];

// FAQ: search plus border-bottom accordion with + / - toggles per protocol.
export function FaqBody() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => `${f.q} ${f.a} ${f.tag}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <section>
        <div className="container-x max-w-4xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> FAQ
          </p>
          <p className="tag tag-blue mt-4">Questions, answered plainly</p>
          <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Before you ask on WhatsApp.
          </h1>
          <div className="relative mt-6 max-w-xl">
            <MagnifyingGlass size={18} weight="bold" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
            <label htmlFor="faq-search" className="sr-only">Search questions</label>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(0); }}
              placeholder="Search pricing, hours, parts…"
              autoComplete="off"
              className="min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white py-3 pl-11 pr-4 text-[15px] text-[#111111] placeholder:text-[#787774]/70 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white dark:focus:border-white"
            />
          </div>
          <p aria-live="polite" className="tnum mt-2 text-[13px] text-[#787774] dark:text-neutral-400">
            {filtered.length} of {FAQS.length} questions
          </p>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Frequently asked questions">
        <div className="container-x max-w-4xl">
          <Reveal>
            {filtered.length > 0 ? (
              <div className="border-t border-[#EAEAEA] dark:border-white/10">
                {filtered.map((f, i) => {
                  const isOpen = open === i;
                  return (
                    <div key={f.q} className="border-b border-[#EAEAEA] dark:border-white/10">
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span>
                          <span className={cn("tag mr-2",
                            f.tag === "Pricing" ? "tag-yellow" : f.tag === "Emergency" ? "tag-red"
                            : f.tag === "Parts" ? "tag-green" : "tag-blue")}>{f.tag}</span>
                          <span className="mt-1 block font-display text-[17px] font-semibold text-[#111111] dark:text-white">{f.q}</span>
                        </span>
                        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#EAEAEA] text-xl font-light leading-none dark:border-white/10">
                          {isOpen ? "−" : <Plus size={16} weight="bold" />}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="max-w-[62ch] pb-5 text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-300">{f.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card mx-auto max-w-xl text-center">
                <h2 className="font-display text-xl font-semibold text-[#111111] dark:text-white">No match for “{query.trim()}”</h2>
                <p className="mt-2 text-sm text-[#787774] dark:text-neutral-400">Ask us directly — a technician replies, not a bot.</p>
                <Link href="/contact" className="btn-primary mt-4">Contact the workshop</Link>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
