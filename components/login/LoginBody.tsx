"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, Envelope } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/Reveal";

const inputCls =
  "min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#787774]/60 focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white";

// Customer login: passwordless magic link when Supabase Auth is wired.
// Bookings never need an account — tracking works with ref + phone.
export function LoginBody() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const configured = supabase !== null;

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (!supabase) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setError(error.message);
      else setSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="container-x max-w-xl">
        <Reveal>
          <div className="text-center">
            <p className="tag tag-blue">Customer login</p>
            <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white sm:text-5xl">No passwords to forget.</h1>
            <p className="mx-auto mt-3 max-w-[52ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
              Service history lives on your bookings. Track any visit with its reference —
              accounts are only needed for saved cars and reminders.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card mt-6">
            {sent ? (
              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#EDF3EC] text-[#346538]">
                  <CheckCircle size={24} weight="bold" />
                </span>
                <h2 className="mt-3 font-display text-xl font-semibold text-[#111111] dark:text-white">Check your inbox</h2>
                <p className="tnum mt-2 text-sm text-[#787774] dark:text-neutral-400">A sign-in link is on its way to {email.trim()}.</p>
              </div>
            ) : configured ? (
              <form onSubmit={onSend} noValidate>
                <label htmlFor="login-email" className={labelCls}>Email address</label>
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className={inputCls} />
                {error && <p role="alert" className="mt-3 text-sm font-medium text-[#9F2F2D]">{error}</p>}
                <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">
                  <Envelope size={18} weight="bold" /> {busy ? "Sending link…" : "Email me a sign-in link"}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h2 className="font-display text-xl font-semibold text-[#111111] dark:text-white">Accounts open with the next deploy</h2>
                <p className="mx-auto mt-2 max-w-[48ch] text-sm leading-[1.6] text-[#787774] dark:text-neutral-400">
                  Sign-in needs Supabase Auth keys in the site settings. Nothing is lost meanwhile —
                  every booking already tracks by reference number.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/track-booking" className="btn-primary">Track a booking</Link>
                  <Link href="/booking" className="btn-outline">Book a visit</Link>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
