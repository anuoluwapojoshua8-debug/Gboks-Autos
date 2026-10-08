"use client";

import Link from "next/link";
import { Clock, Envelope, MapPin, Phone } from "@phosphor-icons/react";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/constants";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  // Simplified footer: brand + contact/hours + key paths + legal. No link farm.
  return (
    <footer className="bg-[#111111] text-neutral-300">
      <div className="container-x grid gap-10 py-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-bold text-white">GBOKS AUTOS</p>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed">
            Professional auto repair and servicing in {SITE.city}. Fair pricing,
            quality parts, quick turnaround.
          </p>
          <p className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-neutral-400">
            {SITE.payNote}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#111111]">
                {s.label}
              </a>
            ))}
          </div>
          <NewsletterForm />
        </div>
        <nav aria-label="Contact and hours">
          <p className="text-sm font-semibold text-white">Visit or call</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex gap-2"><MapPin size={16} weight="bold" className="mt-0.5 shrink-0 text-neutral-500" /> {SITE.address}</li>
            <li><a className="flex gap-2 transition-colors duration-200 hover:text-white" href={SITE.phoneHref}><Phone size={16} weight="bold" className="mt-0.5 shrink-0 text-neutral-500" /> <span className="tnum">{SITE.phone}</span></a></li>
            <li><a className="flex gap-2 transition-colors duration-200 hover:text-white" href={`mailto:${SITE.email}`}><Envelope size={16} weight="bold" className="mt-0.5 shrink-0 text-neutral-500" /> {SITE.email}</a></li>
            {SITE.hours.slice(0, 2).map((h) => (
              <li key={h.days} className="flex gap-2 text-neutral-400">
                <Clock size={16} weight="bold" className="mt-0.5 shrink-0 text-neutral-500" />
                <span>{h.days}: {h.time}</span>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Key pages">
          <p className="text-sm font-semibold text-white">Start here</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[...NAV_LINKS.slice(0, 4),
              { href: "/booking", label: "Book appointment" },
              { href: "/quote", label: "Get a price estimate" },
              { href: "/complaints", label: "Complaints & feedback" },
            ].slice(0, 7).map((l) => (
              <li key={l.href + l.label}><Link className="transition-colors duration-200 hover:text-white" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-4 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GBOKS AUTOS, {SITE.city}. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/privacy" className="transition-colors duration-200 hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors duration-200 hover:text-white">Terms</Link>
            <Link href="/admin" className="transition-colors duration-200 hover:text-white">Staff login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
