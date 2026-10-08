"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, Camera, CheckCircle, XCircle } from "@phosphor-icons/react";
import type { Service } from "@/lib/services";
import { SITE } from "@/lib/constants";
import {
  createBooking,
  getSlots,
  isSunday,
  minBookableDate,
  type TimeSlot,
} from "@/lib/bookings";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

// Booking flow: service + date + slot, car + contact, problem + photos.
// Confirmation returns the reference number for tracking.
export function BookingBody({
  services,
  preselected,
}: {
  services: Service[];
  preselected?: string;
}) {
  const validSlugs = useMemo(() => new Set(services.map((s) => s.slug)), [services]);
  const [serviceSlug, setServiceSlug] = useState(
    preselected && validSlugs.has(preselected) ? preselected : services[0]?.slug ?? ""
  );
  const [date, setDate] = useState(defaultDate());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotId, setSlotId] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [plate, setPlate] = useState("");
  const [problem, setProblem] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refNo, setRefNo] = useState("");

  const sunday = date ? isSunday(date) : false;

  const loadSlots = useCallback(async (iso: string) => {
    setSlotsLoading(true);
    setSlotId("");
    try {
      const { slots } = await getSlots(iso);
      setSlots(slots);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date && !sunday) loadSlots(date);
    else setSlots([]);
  }, [date, sunday, loadSlots]);

  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  function onPhotos(files: FileList | null) {
    if (!files) return;
    const next: File[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 5 * 1024 * 1024) {
        setError(`${f.name} is over 5MB and was skipped.`);
        continue;
      }
      next.push(f);
    }
    const merged = [...photos, ...next].slice(0, 3);
    setPhotos(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!serviceSlug) return setError("Choose a service first.");
    if (!date) return setError("Pick a preferred date.");
    if (sunday) return setError("We are closed on Sundays. Pick Monday to Saturday.");
    if (!slotId) return setError("Pick a time window.");
    if (fullName.trim().length < 2) return setError("Enter your full name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Enter a valid phone number.");
    if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) return setError("That email address looks off.");
    if (!carMake.trim() || !carModel.trim()) return setError("Enter your car make and model.");
    const year = carYear.trim() ? Number(carYear) : undefined;
    if (carYear.trim() && (!year || year < 1985 || year > new Date().getFullYear() + 1))
      return setError("Car year looks off. Use 1985 to next year.");

    setSubmitting(true);
    try {
      const booking = await createBooking(
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          carMake: carMake.trim(),
          carModel: carModel.trim(),
          carYear: year,
          plateNumber: plate.trim() || undefined,
          serviceSlug,
          preferredDate: date,
          timeSlotId: slotId,
          problem: problem.trim() || undefined,
        },
        photos
      );
      setRefNo(booking.refNo);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save booking. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (refNo) {
    const slot = slots.find((s) => s.id === slotId);
    return (
      <section className="section-pad">
        <div className="container-x max-w-2xl">
          <Reveal>
            <div className="card text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#EDF3EC] text-[#346538]">
                <CheckCircle size={24} weight="bold" />
              </span>
              <p className="tag tag-green mt-4">Booking received</p>
              <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white">
                We have your car down for {date}.
              </h1>
              <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-400">
                Show this reference at the gate or use it to track and reschedule.
                {slot && <> Arrive between <strong className="tnum font-semibold">{slot.start} – {slot.end}</strong>.</>}
              </p>
              <p className="mt-5">
                <kbd className="tnum rounded border border-[#EAEAEA] bg-[#F7F6F3] px-4 py-2 font-mono text-xl font-bold tracking-widest text-[#111111] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  {refNo}
                </kbd>
              </p>
              <p className="tnum mt-3 text-xs text-[#787774]">{SITE.payNote}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href={`/track-booking?ref=${refNo}`} className="btn-primary">Track this booking</Link>
                <a href={`${SITE.whatsappLink}&text=${encodeURIComponent(`Hello GBOKS AUTOS, my booking ref is ${refNo}.`)}`} target="_blank" rel="noreferrer" className="btn-outline">
                  Confirm on WhatsApp
                </a>
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
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Booking
          </p>
          <p className="tag tag-yellow mt-4">Book in 60 seconds</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Pick a service, date and time.
          </h1>
          <p className="mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            Instant reference number, free inspection on arrival, written quote before
            work starts. {SITE.payNote}
          </p>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Booking form">
        <div className="container-x max-w-5xl">
          <form onSubmit={onSubmit} noValidate>
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Service + schedule */}
              <div className="card">
                <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">1. Service and schedule</h2>
                <div className="mt-4">
                  <label htmlFor="bk-service" className={labelCls}>Service</label>
                  <select id="bk-service" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)} className={inputCls} required>
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>{s.title} — from {s.priceFrom}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-date" className={labelCls}>Preferred date</label>
                    <input id="bk-date" type="date" value={date} min={minBookableDate()} onChange={(e) => setDate(e.target.value)} className={cn(inputCls, "tnum")} required />
                  </div>
                  <div>
                    <span className={labelCls}>Time window</span>
                    {sunday ? (
                      <p className="rounded-xl bg-[#F9F9F8] p-3 text-sm text-[#787774] dark:bg-white/5 dark:text-neutral-400">
                        Closed Sundays. Emergency only — call <a className="font-semibold underline underline-offset-2" href={SITE.phoneHref}>{SITE.phone}</a>.
                      </p>
                    ) : slotsLoading ? (
                      <div className="grid grid-cols-2 gap-2" aria-label="Loading slots">
                        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-11" />)}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Time windows">
                        {slots.map((s) => {
                          const left = s.capacity - (s.booked ?? 0);
                          const full = left <= 0;
                          const active = slotId === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              disabled={full}
                              onClick={() => setSlotId(s.id)}
                              className={cn(
                                "tnum rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200 active:scale-[0.98]",
                                active
                                  ? "border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]"
                                  : "border-[#EAEAEA] bg-white hover:bg-[#F9F9F8] dark:border-white/10 dark:bg-charcoal-900",
                                full && "cursor-not-allowed opacity-40"
                              )}
                            >
                              <span className="block font-semibold">{s.start} – {s.end}</span>
                              <span className="block text-xs opacity-70">{full ? "Full" : `${left} bay${left === 1 ? "" : "s"} left`}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Car + contact */}
              <div className="card">
                <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">2. Car and contact</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="bk-name" className={labelCls}>Full name</label><input id="bk-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adaeze Okonkwo" autoComplete="name" className={inputCls} required /></div>
                  <div><label htmlFor="bk-phone" className={labelCls}>Phone / WhatsApp</label><input id="bk-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801 234 5678" autoComplete="tel" inputMode="tel" className={cn(inputCls, "tnum")} required /></div>
                  <div className="sm:col-span-2"><label htmlFor="bk-email" className={labelCls}>Email <span className="font-normal text-[#787774]">(optional)</span></label><input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className={inputCls} /></div>
                  <div><label htmlFor="bk-make" className={labelCls}>Car make</label><input id="bk-make" value={carMake} onChange={(e) => setCarMake(e.target.value)} placeholder="Toyota" className={inputCls} required /></div>
                  <div><label htmlFor="bk-model" className={labelCls}>Car model</label><input id="bk-model" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="Camry 2018" className={inputCls} required /></div>
                  <div><label htmlFor="bk-year" className={labelCls}>Year <span className="font-normal text-[#787774]">(optional)</span></label><input id="bk-year" value={carYear} onChange={(e) => setCarYear(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2018" inputMode="numeric" className={cn(inputCls, "tnum")} /></div>
                  <div><label htmlFor="bk-plate" className={labelCls}>Plate <span className="font-normal text-[#787774]">(optional)</span></label><input id="bk-plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="LAG-123XY" autoComplete="off" className={cn(inputCls, "tnum uppercase")} /></div>
                </div>
              </div>
            </div>

            {/* Problem + photos */}
            <div className="card mt-4">
              <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">3. What is wrong <span className="text-sm font-normal text-[#787774]">(optional, helps us prepare)</span></h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <label htmlFor="bk-problem" className={labelCls}>Describe the symptom</label>
                  <textarea id="bk-problem" value={problem} onChange={(e) => setProblem(e.target.value)} rows={4} placeholder="Knocking over bumps, AC warm in traffic…" className={cn(inputCls, "resize-y")} />
                </div>
                <div>
                  <span className={labelCls}>Photos <span className="font-normal text-[#787774]">(up to 3, 5MB each)</span></span>
                  <label htmlFor="bk-photos" className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#EAEAEA] bg-[#F9F9F8] px-4 py-3 text-sm font-medium text-[#2F3437] transition hover:border-[#111111] dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
                    <Camera size={18} weight="bold" /> Add photos of the fault
                  </label>
                  <input id="bk-photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onPhotos(e.target.files)} />
                  {previews.length > 0 && (
                    <ul className="mt-3 grid grid-cols-3 gap-2">
                      {previews.map((u, i) => (
                        <li key={u} className="relative overflow-hidden rounded-xl border border-[#EAEAEA] dark:border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u} alt={`Fault photo ${i + 1}`} className="photo-warm aspect-square w-full object-cover" />
                          <button
                            type="button"
                            aria-label={`Remove photo ${i + 1}`}
                            onClick={() => {
                              setPhotos(photos.filter((_, k) => k !== i));
                              setPreviews(previews.filter((_, k) => k !== i));
                            }}
                            className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-lg bg-[#111111]/80 text-white"
                          >
                            <XCircle size={16} weight="bold" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-[#9F2F2D]/20 bg-[#FDEBEC] px-4 py-3 text-sm font-medium text-[#9F2F2D]">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" disabled={submitting} className="btn-primary sm:min-w-[240px] disabled:opacity-60">
                <CalendarCheck size={19} weight="bold" /> {submitting ? "Saving…" : "Confirm booking"}
              </button>
              <Link href="/track-booking" className="link-more">Already booked? Track it →</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
