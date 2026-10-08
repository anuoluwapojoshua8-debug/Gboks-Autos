"use client";

import Link from "next/link";
import { useState } from "react";
import { Camera, CheckCircle, MagnifyingGlass, Star, XCircle } from "@phosphor-icons/react";
import { SITE } from "@/lib/constants";
import {
  COMPLAINT_CATEGORIES,
  createComplaint,
  findComplaint,
  submitReview,
  type Complaint,
  type Review,
} from "@/lib/feedback";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, k) => (
        <Star key={k} size={size} weight={k < value ? "fill" : "regular"}
          className={k < value ? "fill-[#956400] text-[#956400]" : "text-neutral-300"} />
      ))}
    </div>
  );
}

const TICKET_TAG: Record<Complaint["status"], string> = {
  received: "tag-yellow",
  in_review: "tag-blue",
  resolved: "tag-green",
};

// Complaints with ticket tracking plus the public reviews wall.
// Single client island; server page supplies the initial approved reviews.
export function FeedbackBody({ initialReviews }: { initialReviews: Review[] }) {
  // Complaint form
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [category, setCategory] = useState<string>(COMPLAINT_CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState("");

  // Ticket lookup
  const [lookTicket, setLookTicket] = useState("");
  const [lookContact, setLookContact] = useState("");
  const [found, setFound] = useState<Complaint | null>(null);
  const [lookedUp, setLookedUp] = useState(false);
  const [looking, setLooking] = useState(false);
  const [lookError, setLookError] = useState("");

  // Review form
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rName, setRName] = useState("");
  const [rCar, setRCar] = useState("");
  const [rRating, setRRating] = useState(5);
  const [rText, setRText] = useState("");
  const [rError, setRError] = useState("");
  const [rSent, setRSent] = useState(false);
  const [rBusy, setRBusy] = useState(false);

  async function onComplaint(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (name.trim().length < 2) return setFormError("Enter your name.");
    if (contact.replace(/\D/g, "").length < 7 && !contact.includes("@")) return setFormError("Enter a phone number or email we can reply to.");
    if (message.trim().length < 10) return setFormError("Describe what happened in a few sentences.");
    setSending(true);
    try {
      const c = await createComplaint(
        { name: name.trim(), contact: contact.trim(), bookingRef: bookingRef.trim().toUpperCase() || undefined, category, message: message.trim() },
        files
      );
      setTicket(c.ticketNo);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not file. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function onLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookError("");
    if (!lookTicket.trim() || !lookContact.trim()) return setLookError("Enter ticket and contact.");
    setLooking(true);
    try {
      const hit = await findComplaint(lookTicket, lookContact);
      setFound(hit);
      setLookedUp(true);
      if (!hit) setLookError("No ticket matches. Check both fields.");
    } finally {
      setLooking(false);
    }
  }

  async function onReview(e: React.FormEvent) {
    e.preventDefault();
    setRError("");
    if (rName.trim().length < 2) return setRError("Enter your name.");
    if (rText.trim().length < 10) return setRError("Write a sentence or two about the visit.");
    setRBusy(true);
    try {
      await submitReview({ name: rName.trim(), car: rCar.trim() || undefined, text: rText.trim(), rating: rRating });
      setReviews((prev) => [{ name: rName.trim(), car: rCar.trim() || undefined, text: rText.trim(), rating: rRating, date: "Just now" }, ...prev].slice(0, 12));
      setRSent(true);
      setRName("");
      setRCar("");
      setRText("");
      setRRating(5);
    } catch (err) {
      setRError(err instanceof Error ? err.message : "Could not save. Try again.");
    } finally {
      setRBusy(false);
    }
  }

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <section>
        <div className="container-x max-w-5xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Complaints & reviews
          </p>
          <p className="tag tag-red mt-4">We read every one</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Something off? Tell us straight.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            File a complaint with a ticket number, track the reply, or leave a review
            for other drivers. The founder reads tickets every evening.
          </p>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Complaints">
        <div className="container-x max-w-5xl">
          {ticket ? (
            <Reveal>
              <div className="card mx-auto max-w-2xl text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#EDF3EC] text-[#346538]">
                  <CheckCircle size={24} weight="bold" />
                </span>
                <p className="tag tag-green mt-4">Complaint filed</p>
                <h2 className="serif-display mt-3 text-3xl text-[#111111] dark:text-white">We will reply within one working day.</h2>
                <p className="mt-4">
                  <kbd className="tnum rounded border border-[#EAEAEA] bg-[#F7F6F3] px-4 py-2 font-mono text-xl font-bold tracking-widest text-[#111111] dark:border-white/10 dark:bg-white/10 dark:text-white">{ticket}</kbd>
                </p>
                <p className="mx-auto mt-3 max-w-[52ch] text-sm text-[#787774] dark:text-neutral-400">
                  Keep this ticket. Use it below with your phone number to follow the reply.
                </p>
                <button onClick={() => { setTicket(""); setLookTicket(ticket); }} className="btn-outline mt-5">Track this ticket</button>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal>
                <form onSubmit={onComplaint} className="card" noValidate>
                  <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">File a complaint</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor="cp-name" className={labelCls}>Your name</label><input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chidi Okafor" autoComplete="name" className={inputCls} required /></div>
                    <div><label htmlFor="cp-contact" className={labelCls}>Phone or email</label><input id="cp-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="0801 234 5678" autoComplete="tel" className={cn(inputCls, "tnum")} required /></div>
                    <div><label htmlFor="cp-book" className={labelCls}>Booking ref <span className="font-normal text-[#787774]">(if any)</span></label><input id="cp-book" value={bookingRef} onChange={(e) => setBookingRef(e.target.value.toUpperCase())} placeholder="GBK-XXXXXX" autoComplete="off" className={cn(inputCls, "tnum font-mono uppercase")} /></div>
                    <div>
                      <label htmlFor="cp-cat" className={labelCls}>Category</label>
                      <select id="cp-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                        {COMPLAINT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2"><label htmlFor="cp-msg" className={labelCls}>What happened</label><textarea id="cp-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="What did we get wrong, and what would put it right?" className={cn(inputCls, "resize-y")} required /></div>
                    <div className="sm:col-span-2">
                      <span className={labelCls}>Evidence <span className="font-normal text-[#787774]">(up to 3 photos, optional)</span></span>
                      <label htmlFor="cp-files" className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#EAEAEA] bg-[#F9F9F8] px-4 py-3 text-sm font-medium text-[#2F3437] transition hover:border-[#111111] dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
                        <Camera size={18} weight="bold" /> Attach photos {files.length > 0 && `(${files.length}/3)`}
                      </label>
                      <input id="cp-files" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                        setFileError("");
                        const next: File[] = [];
                        for (const f of Array.from(e.target.files ?? [])) {
                          if (!f.type.startsWith("image/")) continue;
                          if (f.size > 5 * 1024 * 1024) { setFileError(`${f.name} is over 5MB and was skipped.`); continue; }
                          next.push(f);
                        }
                        setFiles((prev) => [...prev, ...next].slice(0, 3));
                      }} />
                      {fileError && <p className="mt-2 text-xs text-[#9F2F2D]">{fileError}</p>}
                      {files.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {files.map((f, i) => (
                            <li key={f.name + i} className="tnum inline-flex items-center gap-2 rounded-full bg-[#F9F9F8] px-3 py-1 text-xs dark:bg-white/5">
                              {f.name.slice(0, 18)}
                              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-black/10"><XCircle size={14} weight="bold" /></button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  {formError && <p role="alert" className="mt-4 rounded-xl border border-[#9F2F2D]/20 bg-[#FDEBEC] px-4 py-3 text-sm font-medium text-[#9F2F2D]">{formError}</p>}
                  <button type="submit" disabled={sending} className="btn-primary mt-4 w-full disabled:opacity-60">{sending ? "Filing…" : "File complaint"}</button>
                </form>
              </Reveal>

              <div className="space-y-4">
                <Reveal delay={80}>
                  <form onSubmit={onLookup} className="card" noValidate>
                    <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">Track a ticket</h2>
                    <div className="mt-3 grid gap-3">
                      <div><label htmlFor="tk-no" className={labelCls}>Ticket</label><input id="tk-no" value={lookTicket} onChange={(e) => setLookTicket(e.target.value.toUpperCase())} placeholder="CMP-XXXXXX" autoComplete="off" className={cn(inputCls, "tnum font-mono uppercase tracking-widest")} /></div>
                      <div><label htmlFor="tk-contact" className={labelCls}>Phone or email used</label><input id="tk-contact" value={lookContact} onChange={(e) => setLookContact(e.target.value)} placeholder="0801 234 5678" autoComplete="tel" className={cn(inputCls, "tnum")} /></div>
                    </div>
                    {lookError && !found && <p role="alert" className="mt-3 text-sm font-medium text-[#9F2F2D]">{lookError}</p>}
                    <button type="submit" disabled={looking} className="btn-outline mt-3 w-full disabled:opacity-60">
                      <MagnifyingGlass size={18} weight="bold" /> {looking ? "Looking up…" : "Check status"}
                    </button>
                    {lookedUp && found && (
                      <div className="mt-4 border-t border-[#EAEAEA] pt-4 dark:border-white/10">
                        <div className="flex items-center justify-between gap-2">
                          <span className="tnum font-mono text-sm font-bold">{found.ticketNo}</span>
                          <span className={cn("tag", TICKET_TAG[found.status])}>{found.status.replace("_", " ")}</span>
                        </div>
                        <p className="mt-2 text-sm text-[#2F3437] dark:text-neutral-300">{found.category}{found.bookingRef && <span className="tnum text-[#787774]"> • {found.bookingRef}</span>}</p>
                        {found.adminReply && (
                          <blockquote className="mt-3 rounded-xl bg-[#F9F9F8] p-4 text-sm leading-[1.6] text-[#2F3437] dark:bg-white/5 dark:text-neutral-300">
                            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#346538]">Workshop reply</span>
                            <p className="mt-1">{found.adminReply}</p>
                          </blockquote>
                        )}
                      </div>
                    )}
                  </form>
                </Reveal>
                <Reveal delay={160}>
                  <div className="card-flat">
                    <p className="text-sm leading-[1.6] text-[#2F3437] dark:text-neutral-300">
                      <strong className="font-semibold text-[#111111] dark:text-white">Our promise:</strong> every
                      ticket gets a named owner, a reply within one working day, and a fix or
                      a clear reason. Urgent and unsafe? Call <a href={SITE.phoneHref} className="tnum font-semibold underline underline-offset-2">{SITE.phone}</a> now.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="section-pad !pt-0" aria-labelledby="reviews-h">
        <div className="container-x max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="tag tag-yellow">Driver reviews</p>
              <h2 id="reviews-h" className="mt-2 font-display text-2xl font-bold text-[#111111] dark:text-white sm:text-3xl">Rated by the people who drive out</h2>
              <p className="tnum mt-1 text-sm text-[#787774] dark:text-neutral-400">
                {avg.toFixed(1)} average across {reviews.length} reviews shown
              </p>
            </div>
          </div>
          <Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <figure key={r.name + r.text.slice(0, 12)} className="card-flat p-5">
                  <Stars value={r.rating} />
                  <blockquote className="mt-2 text-sm leading-[1.6] text-[#2F3437] dark:text-neutral-300">“{r.text}”</blockquote>
                  <figcaption className="mt-3 text-xs font-semibold text-[#111111] dark:text-white">
                    {r.name} {r.car && <span className="font-normal text-[#787774]">• {r.car}</span>}
                    <span className="tnum block font-normal text-[#787774]">{r.date}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form onSubmit={onReview} className="card mx-auto mt-6 max-w-2xl" noValidate>
              <h3 className="font-display text-lg font-semibold text-[#111111] dark:text-white">Leave a review</h3>
              <p className="mt-1 text-sm text-[#787774] dark:text-neutral-400">Reviews appear after a quick check by the service advisor.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="rv-name" className={labelCls}>Your name</label><input id="rv-name" value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Ngozi E." autoComplete="name" className={inputCls} /></div>
                <div><label htmlFor="rv-car" className={labelCls}>Car <span className="font-normal text-[#787774]">(optional)</span></label><input id="rv-car" value={rCar} onChange={(e) => setRCar(e.target.value)} placeholder="Corolla 2017" className={inputCls} /></div>
              </div>
              <div className="mt-4">
                <span className={labelCls} id="rv-rating-label">Rating</span>
                <div className="flex gap-1" role="radiogroup" aria-labelledby="rv-rating-label">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={rRating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRRating(n)} className="grid h-11 w-11 place-items-center rounded-lg transition active:scale-[0.98]">
                      <Star size={24} weight={n <= rRating ? "fill" : "regular"} className={n <= rRating ? "fill-[#956400] text-[#956400]" : "text-neutral-300"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4"><label htmlFor="rv-text" className={labelCls}>Your visit</label><textarea id="rv-text" value={rText} onChange={(e) => setRText(e.target.value)} rows={3} placeholder="What did we fix, and was the bill what you expected?" className={cn(inputCls, "resize-y")} /></div>
              {rError && <p role="alert" className="mt-3 text-sm font-medium text-[#9F2F2D]">{rError}</p>}
              {rSent && <p role="status" className="mt-3 rounded-xl bg-[#EDF3EC] px-4 py-3 text-sm font-medium text-[#346538]">Thanks. Your review is in for a check and shows above.</p>}
              <button type="submit" disabled={rBusy} className="btn-primary mt-4 w-full disabled:opacity-60">{rBusy ? "Saving…" : "Post review"}</button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
