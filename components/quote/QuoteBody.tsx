"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Camera, CheckCircle, XCircle } from "@phosphor-icons/react";
import type { Service } from "@/lib/services";
import { SITE } from "@/lib/constants";
import { createQuote } from "@/lib/quotes";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

// Price estimate: service + car + symptom + photos. Returns a QTE
// reference; the written quote follows on WhatsApp within one working day.
export function QuoteBody({ services }: { services: Service[] }) {
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [symptom, setSymptom] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refNo, setRefNo] = useState("");

  const service = services.find((s) => s.slug === serviceSlug);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!serviceSlug) return setError("Choose a service.");
    if (name.trim().length < 2) return setError("Enter your name.");
    if (contact.replace(/\D/g, "").length < 7 && !contact.includes("@")) return setError("Enter a phone number or email.");
    if (!carMake.trim() || !carModel.trim()) return setError("Enter your car make and model.");
    if (symptom.trim().length < 10) return setError("Describe the symptom in a sentence or two.");
    const year = carYear.trim() ? Number(carYear) : undefined;
    setBusy(true);
    try {
      const q = await createQuote(
        { name: name.trim(), contact: contact.trim(), carMake: carMake.trim(), carModel: carModel.trim(), carYear: year, serviceSlug, symptom: symptom.trim() },
        photos
      );
      setRefNo(q.refNo);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (refNo) {
    return (
      <section className="section-pad">
        <div className="container-x max-w-2xl">
          <Reveal>
            <div className="card text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#EDF3EC] text-[#346538]">
                <CheckCircle size={24} weight="bold" />
              </span>
              <p className="tag tag-green mt-4">Estimate requested</p>
              <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white">Your written quote is on its way.</h1>
              <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-400">
                A technician reviews {service?.title ?? "your request"} for {carMake} {carModel} and
                replies on WhatsApp within one working day{service && <> — starting around <strong className="tnum">from {service.priceFrom}</strong></>}.
              </p>
              <p className="mt-5">
                <kbd className="tnum rounded border border-[#EAEAEA] bg-[#F7F6F3] px-4 py-2 font-mono text-xl font-bold tracking-widest text-[#111111] dark:border-white/10 dark:bg-white/10 dark:text-white">{refNo}</kbd>
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href={`/booking?service=${serviceSlug}`} className="btn-primary">Book it now instead</Link>
                <Link href="/services" className="btn-outline">Compare services</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="container-x max-w-5xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Price estimate
          </p>
          <p className="tag tag-yellow mt-4">Free, no obligation</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Know the range before you drive in.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            Describe the fault, add photos if you can. A technician replies with a
            written range on WhatsApp. {SITE.payNote}
          </p>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Request a price estimate">
        <div className="container-x max-w-5xl">
          <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2" noValidate>
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">1. Car and service</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label htmlFor="qt-service" className={labelCls}>Service</label>
                  <select id="qt-service" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)} className={inputCls}>
                    {services.map((s) => <option key={s.slug} value={s.slug}>{s.title} — from {s.priceFrom}</option>)}
                  </select>
                </div>
                <div><label htmlFor="qt-make" className={labelCls}>Car make</label><input id="qt-make" value={carMake} onChange={(e) => setCarMake(e.target.value)} placeholder="Toyota" className={inputCls} /></div>
                <div><label htmlFor="qt-model" className={labelCls}>Car model</label><input id="qt-model" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="Camry 2018" className={inputCls} /></div>
                <div><label htmlFor="qt-year" className={labelCls}>Year <span className="font-normal text-[#787774]">(optional)</span></label><input id="qt-year" value={carYear} onChange={(e) => setCarYear(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2018" inputMode="numeric" className={cn(inputCls, "tnum")} /></div>
                <div><label htmlFor="qt-contact" className={labelCls}>Phone / WhatsApp</label><input id="qt-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="0801 234 5678" inputMode="tel" className={cn(inputCls, "tnum")} /></div>
                <div className="sm:col-span-2"><label htmlFor="qt-name" className={labelCls}>Your name</label><input id="qt-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adaeze Okonkwo" autoComplete="name" className={inputCls} /></div>
              </div>
            </div>
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">2. Symptom and photos</h2>
              <div className="mt-4">
                <label htmlFor="qt-symptom" className={labelCls}>What is the car doing?</label>
                <textarea id="qt-symptom" value={symptom} onChange={(e) => setSymptom(e.target.value)} rows={5} placeholder="Squeal when braking cold, stops after 10 minutes…" className={cn(inputCls, "resize-y")} />
              </div>
              <div className="mt-4">
                <span className={labelCls}>Photos <span className="font-normal text-[#787774]">(up to 3, they sharpen the estimate)</span></span>
                <label htmlFor="qt-photos" className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#EAEAEA] bg-[#F9F9F8] px-4 py-3 text-sm font-medium text-[#2F3437] transition hover:border-[#111111] dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
                  <Camera size={18} weight="bold" /> Add photos {photos.length > 0 && `(${photos.length}/3)`}
                </label>
                <input id="qt-photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                  const next: File[] = [];
                  for (const f of Array.from(e.target.files ?? [])) {
                    if (f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024) next.push(f);
                  }
                  setPhotos((prev) => [...prev, ...next].slice(0, 3));
                }} />
                {photos.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {photos.map((f, i) => (
                      <li key={f.name + i} className="tnum inline-flex items-center gap-2 rounded-full bg-[#F9F9F8] px-3 py-1 text-xs dark:bg-white/5">
                        {f.name.slice(0, 18)}
                        <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setPhotos(photos.filter((_, k) => k !== i))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-black/10"><XCircle size={14} weight="bold" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {error && <p role="alert" className="mt-4 rounded-xl border border-[#9F2F2D]/20 bg-[#FDEBEC] px-4 py-3 text-sm font-medium text-[#9F2F2D]">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">{busy ? "Sending…" : "Request estimate"}</button>
              <Link href="/booking" className="link-more mt-3">Skip the estimate, book a visit <ArrowRight size={15} weight="bold" /></Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
