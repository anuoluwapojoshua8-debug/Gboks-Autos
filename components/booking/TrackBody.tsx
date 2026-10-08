"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MagnifyingGlass, CalendarCheck } from "@phosphor-icons/react";
import type { Service } from "@/lib/services";
import { SITE } from "@/lib/constants";
import {
  cancelBooking,
  findBooking,
  getSlots,
  isSunday,
  rescheduleBooking,
  type Booking,
  type TimeSlot,
} from "@/lib/bookings";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const STATUS_TAG: Record<Booking["status"], string> = {
  pending: "tag-yellow",
  confirmed: "tag-blue",
  completed: "tag-green",
  cancelled: "tag-red",
};

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

// Track by reference + phone. Reschedule or cancel from the same card.
export function TrackBody({ services, initialRef }: { services: Service[]; initialRef?: string }) {
  const [ref, setRef] = useState(initialRef ?? "");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [lookedUp, setLookedUp] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotId, setSlotId] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const titleOf = (slug: string) => services.find((s) => s.slug === slug)?.title ?? slug;

  async function lookup(refNo: string, ph: string) {
    setError("");
    setBusy(true);
    try {
      const hit = await findBooking(refNo, ph);
      setBooking(hit);
      setLookedUp(true);
      setConfirmCancel(false);
      if (hit) {
        setNewDate(hit.preferredDate);
        setSlotId(hit.timeSlotId);
      } else {
        setError("No booking matches that reference and phone. Check both and try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (initialRef && phone) lookup(initialRef, phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!newDate || isSunday(newDate)) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    getSlots(newDate).then(({ slots }) => {
      setSlots(slots);
      setSlotsLoading(false);
    });
  }, [newDate]);

  const slotLabel = (id: string, dateISO: string) => {
    const s = slots.find((x) => x.id === id);
    if (s) return `${s.start} – ${s.end}`;
    return id;
  };

  return (
    <>
      <section>
        <div className="container-x max-w-2xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Track booking
          </p>
          <p className="tag tag-blue mt-4">Track & reschedule</p>
          <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Where is my car in the queue?
          </h1>
          <p className="mt-3 leading-[1.6] text-[#787774] dark:text-neutral-400">
            Enter the reference from your confirmation and the phone number used at booking.
          </p>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Track a booking">
        <div className="container-x max-w-2xl">
          <Reveal>
            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                if (!ref.trim() || !phone.trim()) return setError("Enter both reference and phone.");
                lookup(ref, phone);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="trk-ref" className={labelCls}>Reference</label>
                  <input id="trk-ref" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} placeholder="GBK-XXXXXX" autoComplete="off" className={cn(inputCls, "tnum font-mono uppercase tracking-widest")} />
                </div>
                <div>
                  <label htmlFor="trk-phone" className={labelCls}>Phone</label>
                  <input id="trk-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801 234 5678" inputMode="tel" autoComplete="tel" className={cn(inputCls, "tnum")} />
                </div>
              </div>
              {error && !booking && (
                <p role="alert" className="mt-4 rounded-xl border border-[#9F2F2D]/20 bg-[#FDEBEC] px-4 py-3 text-sm font-medium text-[#9F2F2D]">{error}</p>
              )}
              <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">
                <MagnifyingGlass size={18} weight="bold" /> {busy ? "Looking up…" : "Find my booking"}
              </button>
            </form>
          </Reveal>

          {lookedUp && booking && (
            <Reveal delay={80}>
              <div className="card mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <kbd className="tnum rounded border border-[#EAEAEA] bg-[#F7F6F3] px-3 py-1.5 font-mono text-base font-bold tracking-widest text-[#111111] dark:border-white/10 dark:bg-white/10 dark:text-white">
                    {booking.refNo}
                  </kbd>
                  <span className={cn("tag", STATUS_TAG[booking.status])}>{booking.status}</span>
                </div>
                <dl className="tnum mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-[#787774]">Service</dt><dd className="font-semibold text-[#111111] dark:text-white">{titleOf(booking.serviceSlug)}</dd></div>
                  <div><dt className="text-xs text-[#787774]">Date</dt><dd className="font-semibold text-[#111111] dark:text-white">{booking.preferredDate}</dd></div>
                  <div><dt className="text-xs text-[#787774]">Window</dt><dd className="font-semibold text-[#111111] dark:text-white">{slotLabel(booking.timeSlotId, booking.preferredDate)}</dd></div>
                  <div><dt className="text-xs text-[#787774]">Car</dt><dd className="font-semibold text-[#111111] dark:text-white">{booking.carMake} {booking.carModel}</dd></div>
                </dl>
                <p className="tnum mt-3 text-xs text-[#787774]">Payment: {booking.paymentStatus === "paid_onsite" ? "paid at workshop" : "pay on pickup, cash or transfer"}.</p>

                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <div className="mt-5 border-t border-[#EAEAEA] pt-5 dark:border-white/10">
                    <h2 className="font-display font-semibold text-[#111111] dark:text-white">Reschedule</h2>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="rs-date" className={labelCls}>New date</label>
                        <input id="rs-date" type="date" value={newDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setNewDate(e.target.value)} className={cn(inputCls, "tnum")} />
                      </div>
                      <div>
                        <span className={labelCls}>New window</span>
                        {slotsLoading ? (
                          <div className="skeleton h-11" />
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {slots.map((s) => {
                              const left = s.capacity - (s.booked ?? 0);
                              const full = left <= 0 && s.id !== booking.timeSlotId;
                              return (
                                <button key={s.id} type="button" disabled={full} onClick={() => setSlotId(s.id)}
                                  className={cn("tnum rounded-xl border px-3 py-2 text-left text-sm active:scale-[0.98]",
                                    slotId === s.id ? "border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]"
                                      : "border-[#EAEAEA] bg-white dark:border-white/10 dark:bg-charcoal-900",
                                    full && "cursor-not-allowed opacity-40")}>
                                  <span className="block font-semibold">{s.start} – {s.end}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        disabled={busy || !newDate || !slotId || isSunday(newDate)}
                        onClick={async () => {
                          setBusy(true);
                          try {
                            await rescheduleBooking(booking.refNo, newDate, slotId);
                            const hit = await findBooking(booking.refNo, booking.phone);
                            setBooking(hit);
                          } finally {
                            setBusy(false);
                          }
                        }}
                        className="btn-primary disabled:opacity-60"
                      >
                        <CalendarCheck size={18} weight="bold" /> Save new slot
                      </button>
                      {!confirmCancel ? (
                        <button type="button" onClick={() => setConfirmCancel(true)} className="btn-outline">Cancel booking</button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            setBusy(true);
                            try {
                              await cancelBooking(booking.refNo);
                              const hit = await findBooking(booking.refNo, booking.phone);
                              setBooking(hit);
                              setConfirmCancel(false);
                            } finally {
                              setBusy(false);
                            }
                          }}
                          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#9F2F2D] px-6 py-3 text-base font-semibold text-white active:scale-[0.98]"
                        >
                          Confirm cancellation
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 border-t border-[#EAEAEA] pt-4 text-sm sm:flex-row dark:border-white/10">
                  <Link href="/booking" className="link-more">Book another car →</Link>
                  <a href={SITE.phoneHref} className="link-more tnum">Call the workshop →</a>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
