"use client";

import { useState } from "react";
import { Crosshair, Phone, Siren } from "@phosphor-icons/react";
import { SITE } from "@/lib/constants";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

const PROBLEMS = ["Won't start", "Overheating", "Flat tire", "Accident / bump", "Locked out", "Strange noise / smoke", "Other"];

// Emergency: call-first banner plus a dispatch form that composes a
// WhatsApp message with car, problem and location for the rescue team.
export function EmergencyBody() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [problem, setProblem] = useState(PROBLEMS[0]);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  function shareLocation() {
    setError("");
    if (!navigator.geolocation) return setError("This device cannot share location. Type the nearest landmark instead.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords(`${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`);
        setLocating(false);
      },
      () => {
        setError("Location blocked. Type the nearest landmark or bus stop instead.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  function onDispatch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Enter your name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Enter a reachable phone number.");
    if (!car.trim()) return setError("Enter your car make and model.");
    const pin = coords ? ` Location pin: https://www.google.com/maps?q=${coords}` : "";
    const text = `EMERGENCY: ${problem}. I am ${name.trim()} (${phone.trim()}), driving ${car.trim()}. Where: ${location.trim() || "location below"}.${pin} Please confirm the roadside fee before dispatch.`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <div className="container-x max-w-2xl">
      <Reveal>
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[#FDEBEC] text-[#9F2F2D]">
            <Siren size={26} weight="bold" />
          </span>
          <p className="tag tag-red mt-4">Stranded? Start here</p>
          <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Call first. The form gets the truck rolling.
          </h1>
          <p className="mx-auto mt-3 max-w-[52ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            If it is unsafe, call now. Then send the dispatch note below so the team
            has your car and location in writing.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={SITE.phoneHref} className="btn-primary">
              <Phone size={18} weight="bold" /> Call <span className="tnum">{SITE.phone}</span>
            </a>
            <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="btn-outline">
              WhatsApp without form
            </a>
          </div>
          <p className="tnum mt-3 text-xs text-[#787774] dark:text-neutral-500">Roadside fees confirmed on the phone before dispatch. {SITE.payNote}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <form onSubmit={onDispatch} className="card mt-6" noValidate>
          <h2 className="font-display text-lg font-semibold text-[#111111] dark:text-white">Dispatch note</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="em-name" className={labelCls}>Your name</label><input id="em-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Segun A." autoComplete="name" className={inputCls} /></div>
            <div><label htmlFor="em-phone" className={labelCls}>Reachable phone</label><input id="em-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801 234 5678" inputMode="tel" autoComplete="tel" className={cn(inputCls, "tnum")} /></div>
            <div><label htmlFor="em-car" className={labelCls}>Car</label><input id="em-car" value={car} onChange={(e) => setCar(e.target.value)} placeholder="RX 350, silver" className={inputCls} /></div>
            <div><label htmlFor="em-problem" className={labelCls}>What happened</label>
              <select id="em-problem" value={problem} onChange={(e) => setProblem(e.target.value)} className={inputCls}>
                {PROBLEMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="em-loc" className={labelCls}>Where are you?</label>
              <textarea id="em-loc" value={location} onChange={(e) => setLocation(e.target.value)} rows={2} placeholder="Ojota bridge inward Maryland, beside the filling station…" className={cn(inputCls, "resize-y")} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" onClick={shareLocation} disabled={locating} className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#EAEAEA] px-4 py-2 text-sm font-semibold transition hover:bg-[#F9F9F8] active:scale-[0.98] disabled:opacity-60 dark:border-white/10">
                  <Crosshair size={16} weight="bold" /> {locating ? "Locating…" : coords ? "Location attached" : "Attach GPS pin"}
                </button>
                {coords && <span className="tnum text-xs text-[#346538]">Pin ready — goes with the message.</span>}
              </div>
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm font-medium text-[#9F2F2D]">{error}</p>}
          <button type="submit" className="btn-primary mt-4 w-full">
            <Siren size={18} weight="bold" /> Send dispatch note
          </button>
        </form>
      </Reveal>
    </div>
  );
}
