"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/newsletter";

// Footer newsletter: single email row, honest states, no noise.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "exists" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const { duplicate } = await subscribeNewsletter(email);
      setState(duplicate ? "exists" : "done");
      if (!duplicate) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p role="status" className="tnum mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-neutral-300">You are on the list. One service reminder a month, nothing else.</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      <label htmlFor="nl-email" className="text-xs font-semibold text-white">Service reminders, monthly</label>
      <div className="mt-2 flex gap-2">
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          aria-label="Email for service reminders"
          className="tnum min-h-[44px] w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "busy"}
          className="shrink-0 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#111111] transition hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-60"
        >
          {state === "busy" ? "Joining…" : "Join"}
        </button>
      </div>
      {state === "exists" && <p role="status" className="mt-2 text-xs text-neutral-400">That email is already on the list.</p>}
      {state === "error" && <p role="alert" className="mt-2 text-xs text-red-300">Enter a valid email address.</p>}
    </form>
  );
}
