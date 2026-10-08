"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, Envelope, MapPin, Phone, Siren } from "@phosphor-icons/react";
import { SITE } from "@/lib/constants";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;
const TOPICS = ["Booking question", "Price estimate", "Existing booking", "Complaint", "Other"] as const;

// Contact: visit / call / write cards, hours, and a message form
// that hands off to WhatsApp (the channel the workshop answers fastest)
// with a mail fallback. No database, works offline.
export function ContactBody() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function onSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Enter your name.");
    if (contact.trim().length < 3) return setError("Enter a phone number or email.");
    if (message.trim().length < 10) return setError("Write a sentence or two so we can help.");
    const text = `Hello GBOKS AUTOS (${topic}). I am ${name.trim()} (${contact.trim()}). ${message.trim()}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  }

  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(`Website enquiry: ${topic} — ${name.trim() || "driver"}`)}&body=${encodeURIComponent(`${message.trim()}\n\n— ${name.trim()} (${contact.trim()})`)}`;

  return (
    <>
      <section>
        <div className="container-x max-w-5xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Contact
          </p>
          <p className="tag tag-yellow mt-4">Visit, call, or write</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            The fastest answer is one message away.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            Drive in during hours, call the desk, or send a message. For breakdowns
            right now, use the emergency line instead.
          </p>
        </div>
      </section>

      {/* Visit / call / write */}
      <section className="section-pad !pt-0" aria-label="Contact options">
        <div className="container-x max-w-5xl">
          <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E1F3FE] text-[#1F6C9F]">
                  <MapPin size={22} weight="bold" />
                </span>
                <h2 className="mt-3 font-display font-semibold text-[#111111] dark:text-white">Visit the workshop</h2>
                <p className="mt-1 text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">{SITE.address}</p>
                <a href={DIRECTIONS} target="_blank" rel="noreferrer" className="link-more mt-3">Get directions <ArrowRight size={15} weight="bold" /></a>
              </div>
              <div className="card card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EDF3EC] text-[#346538]">
                  <Phone size={22} weight="bold" />
                </span>
                <h2 className="mt-3 font-display font-semibold text-[#111111] dark:text-white">Call the desk</h2>
                <p className="tnum mt-1 text-sm font-semibold text-[#111111] dark:text-white">{SITE.phone}</p>
                <p className="tnum mt-1 text-[13px] text-[#787774] dark:text-neutral-400">Mon–Fri 8–6 • Sat 9–4</p>
                <a href={SITE.phoneHref} className="link-more mt-3">Call now <ArrowRight size={15} weight="bold" /></a>
              </div>
              <div className="card card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FBF3DB] text-[#956400]">
                  <Envelope size={22} weight="bold" />
                </span>
                <h2 className="mt-3 font-display font-semibold text-[#111111] dark:text-white">Write to us</h2>
                <p className="mt-1 break-all text-sm text-[#787774] dark:text-neutral-400">{SITE.email}</p>
                <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="link-more mt-3">WhatsApp us <ArrowRight size={15} weight="bold" /></a>
              </div>
            </div>
          </Reveal>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Message form */}
            <Reveal>
              <form onSubmit={onSend} className="card" noValidate>
                <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">Send a message</h2>
                <p className="mt-1 text-sm text-[#787774] dark:text-neutral-400">
                  Opens WhatsApp with your note filled in. Prefer email? Use the link after sending.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="ct-name" className={labelCls}>Your name</label><input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adaeze Okonkwo" autoComplete="name" className={inputCls} /></div>
                  <div><label htmlFor="ct-contact" className={labelCls}>Phone or email</label><input id="ct-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="0801 234 5678" autoComplete="tel" className={inputCls} /></div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ct-topic" className={labelCls}>Topic</label>
                    <select id="ct-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}>
                      {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2"><label htmlFor="ct-msg" className={labelCls}>Message</label><textarea id="ct-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="My Camry shudders when braking…" className={`${inputCls} resize-y`} /></div>
                </div>
                {error && <p role="alert" className="mt-3 text-sm font-medium text-[#9F2F2D]">{error}</p>}
                {sent && (
                  <p role="status" className="mt-3 rounded-xl bg-[#EDF3EC] px-4 py-3 text-sm font-medium text-[#346538]">
                    Opened WhatsApp with your note. Or <a href={mailHref} className="underline underline-offset-2">send it by email instead</a>.
                  </p>
                )}
                <button type="submit" className="btn-primary mt-4 w-full">Send via WhatsApp</button>
              </form>
            </Reveal>

            {/* Hours */}
            <div className="space-y-4">
              <Reveal delay={80}>
                <div className="card">
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-[#111111] dark:text-white">
                    <Clock size={20} weight="bold" className="text-[#956400]" /> Workshop hours
                  </h2>
                  <ul className="tnum mt-3 divide-y divide-[#EAEAEA] text-sm dark:divide-white/10">
                    {SITE.hours.map((h) => (
                      <li key={h.days} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="font-medium text-[#2F3437] dark:text-neutral-300">{h.days}</span>
                        <span className="text-right text-[#787774] dark:text-neutral-400">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="tnum mt-3 rounded-xl bg-[#F9F9F8] p-3 text-xs leading-relaxed text-[#787774] dark:bg-white/5 dark:text-neutral-400">{SITE.payNote}</p>
                </div>
              </Reveal>
              <Reveal delay={160}>
                <div className="card flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FDEBEC] text-[#9F2F2D]">
                    <Siren size={22} weight="bold" />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-[#111111] dark:text-white">Broken down now?</p>
                    <Link href="/emergency" className="link-more mt-1">Roadside help →</Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
