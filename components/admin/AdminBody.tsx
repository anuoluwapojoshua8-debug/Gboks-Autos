"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowSquareOut, DownloadSimple, Envelope } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import {
  createService,
  createTeamMember,
  deleteTeamMember,
  downloadCSV,
  fetchBookings,
  fetchComplaints,
  fetchQuotes,
  fetchReviews,
  fetchServicesAdmin,
  fetchSlots,
  fetchSubscribers,
  fetchTeamAdmin,
  getRole,
  resolveComplaint,
  setBookingStatus,
  setReviewApproved,
  toggleSlot,
  updateQuote,
  updateService,
  updateTeamMember,
  type AdminBooking,
  type AdminComplaint,
  type AdminQuote,
  type AdminReview,
  type AdminService,
  type AdminSlot,
  type AdminTeamMember,
} from "@/lib/admin";
import { TEAM_TINTS } from "@/lib/team";
import { cn } from "@/lib/cn";

const TABS = ["Bookings", "Complaints", "Quotes", "Reviews", "Services", "Team", "Subscribers", "Slots"] as const;
type Tab = (typeof TABS)[number];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const inputCls =
  "min-h-[44px] rounded-xl border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none dark:border-white/10 dark:bg-charcoal-900 dark:text-white";

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[#787774] dark:text-neutral-400">{children}</th>;
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={cn("px-3 py-2.5 text-sm text-[#2F3437] dark:text-neutral-300", mono && "tnum font-mono text-[13px]")}>{children}</td>;
}

// Staff dashboard: role-gated lists for bookings, complaints, quotes,
// reviews, subscribers and slots, with CSV export. Requires Supabase
// Auth + a profiles row with role = 'admin'.
export function AdminBody() {
  const configured = supabase !== null;
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authSent, setAuthSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("Bookings");
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [subs, setSubs] = useState<{ email: string; created_at: string }[]>([]);
  const [slots, setSlots] = useState<AdminSlot[]>([]);
  const [servicesAdmin, setServicesAdmin] = useState<AdminService[]>([]);
  const [teamAdmin, setTeamAdmin] = useState<AdminTeamMember[]>([]);
  const [reply, setReply] = useState<Record<string, string>>({});
  const [est, setEst] = useState<Record<string, { lo: string; hi: string }>>({});
  const [svcEdits, setSvcEdits] = useState<Record<string, Partial<AdminService>>>({});
  const [newSvc, setNewSvc] = useState({ slug: "", title: "", description: "", duration: "", price_from: "" });
  const [memberEdits, setMemberEdits] = useState<Record<string, Partial<AdminTeamMember>>>({});
  const [newMember, setNewMember] = useState({ name: "", role: "", detail: "", tint: TEAM_TINTS[0] });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [b, c, q, r, s, sl, sv, tm] = await Promise.all([
        fetchBookings().catch(() => [] as AdminBooking[]),
        fetchComplaints().catch(() => [] as AdminComplaint[]),
        fetchQuotes().catch(() => [] as AdminQuote[]),
        fetchReviews().catch(() => [] as AdminReview[]),
        fetchSubscribers().catch(() => [] as { email: string; created_at: string }[]),
        fetchSlots().catch(() => [] as AdminSlot[]),
        fetchServicesAdmin().catch(() => [] as AdminService[]),
        fetchTeamAdmin().catch(() => [] as AdminTeamMember[]),
      ]);
      setBookings(b);
      setComplaints(c);
      setQuotes(q);
      setReviews(r);
      setSubs(s);
      setSlots(sl);
      setServicesAdmin(sv);
      setTeamAdmin(tm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    getRole(userId).then((r) => {
      setRole(r);
      if (r === "admin") loadAll();
    }).catch(() => setRole(null));
  }, [userId, loadAll]);

  if (!configured) {
    return (
      <section className="section-pad"><div className="container-x max-w-xl text-center">
        <p className="tag tag-yellow">Staff only</p>
        <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white">Admin needs Supabase keys.</h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-[#787774] dark:text-neutral-400">Add <span className="tnum font-mono text-[13px]">NEXT_PUBLIC_SUPABASE_URL</span> and <span className="tnum font-mono text-[13px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>, redeploy, then sign in here.</p>
      </div></section>
    );
  }

  if (!userId) {
    return (
      <section className="section-pad"><div className="container-x max-w-xl">
        <div className="text-center">
          <p className="tag tag-blue">Staff sign in</p>
          <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white">Admin dashboard.</h1>
          <p className="mt-2 text-sm text-[#787774] dark:text-neutral-400">Magic link, same as customers. Your profile decides access.</p>
        </div>
        <form className="card mt-6" onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
          setAuthBusy(true);
          const { error } = await supabase!.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } });
          if (error) setError(error.message);
          else setAuthSent(true);
          setAuthBusy(false);
        }}>
          {authSent
            ? <p role="status" className="rounded-xl bg-[#EDF3EC] px-4 py-3 text-sm font-medium text-[#346538]">Check your inbox for the sign-in link.</p>
            : <>
              <label htmlFor="ad-email" className="mb-1.5 block text-[13px] font-semibold text-[#111111] dark:text-white">Work email</label>
              <input id="ad-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gboksautos.ng" autoComplete="email" className="min-h-[48px] w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[15px] dark:border-white/10 dark:bg-charcoal-900 dark:text-white" />
              {error && <p role="alert" className="mt-3 text-sm font-medium text-[#9F2F2D]">{error}</p>}
              <button type="submit" disabled={authBusy} className="btn-primary mt-4 w-full disabled:opacity-60"><Envelope size={18} weight="bold" /> {authBusy ? "Sending…" : "Email me a link"}</button>
            </>}
        </form>
      </div></section>
    );
  }

  if (role !== "admin") {
    return (
      <section className="section-pad"><div className="container-x max-w-xl text-center">
        <p className="tag tag-red">Access denied</p>
        <h1 className="serif-display mt-3 text-4xl text-[#111111] dark:text-white">Staff only beyond this point.</h1>
        <p className="tnum mt-3 text-sm text-[#787774] dark:text-neutral-400">Signed in, but no admin profile. Run this once in Supabase SQL:</p>
        <pre className="tnum mt-3 overflow-x-auto rounded-xl border border-[#EAEAEA] bg-white p-4 text-left text-xs dark:border-white/10 dark:bg-charcoal-900">insert into profiles (id, full_name, role){`\nvalues ('${userId}', 'Your Name', 'admin')\non conflict (id) do update set role = 'admin';`}</pre>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => supabase!.auth.signOut().then(() => { setUserId(null); setRole(null); })} className="btn-outline">Sign out</button>
          <Link href="/" className="btn-primary">Back home</Link>
        </div>
      </div></section>
    );
  }

  const counts = { Bookings: bookings.length, Complaints: complaints.filter((c) => c.status !== "resolved").length, Quotes: quotes.filter((q) => q.status === "received").length, Reviews: reviews.filter((r) => !r.approved).length, Services: servicesAdmin.filter((s) => s.active).length, Team: teamAdmin.filter((m) => m.active).length, Subscribers: subs.length, Slots: slots.filter((s) => s.active).length };

  return (
    <section className="section-pad">
      <div className="container-x max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="tag tag-green">Today at the workshop</p>
            <h1 className="serif-display mt-2 text-4xl text-[#111111] dark:text-white">Admin.</h1>
            <p className="tnum mt-1 text-sm text-[#787774] dark:text-neutral-400">
              {bookings.length} bookings • {complaints.filter((c) => c.status !== "resolved").length} open tickets • {quotes.filter((q) => q.status === "received").length} quotes waiting
            </p>
          </div>
          <button onClick={() => supabase!.auth.signOut().then(() => { setUserId(null); setRole(null); })} className="btn-outline !min-h-[44px] !px-4 !py-2 !text-sm">Sign out</button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={cn("tnum rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98]",
                tab === t ? "bg-[#111111] text-white dark:bg-white dark:text-[#111111]"
                  : "border border-[#EAEAEA] bg-white dark:border-white/10 dark:bg-charcoal-900")}>
              {t} <span className="opacity-60">{counts[t]}</span>
            </button>
          ))}
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl border border-[#9F2F2D]/20 bg-[#FDEBEC] px-4 py-3 text-sm font-medium text-[#9F2F2D]">{error}</p>}
        {loading && <div className="mt-4 grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}</div>}

        {!loading && tab === "Bookings" && (
          <div className="card mt-4 overflow-x-auto p-0">
            <div className="flex items-center justify-between gap-2 p-4">
              <h2 className="font-display font-semibold text-[#111111] dark:text-white">Bookings</h2>
              <button onClick={() => downloadCSV("bookings.csv", bookings)} className="inline-flex items-center gap-1.5 rounded-md border border-[#EAEAEA] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10"><DownloadSimple size={14} weight="bold" /> CSV</button>
            </div>
            <table className="w-full min-w-[720px] border-t border-[#EAEAEA] dark:border-white/10">
              <thead><tr><Th>Ref</Th><Th>Customer</Th><Th>Car</Th><Th>Service</Th><Th>Date</Th><Th>Status</Th></tr></thead>
              <tbody className="divide-y divide-[#EAEAEA] dark:divide-white/10">
                {bookings.map((b) => (
                  <tr key={b.ref_no}>
                    <Td mono>{b.ref_no}</Td>
                    <Td>{b.full_name}<span className="tnum block text-xs text-[#787774]">{b.phone}</span></Td>
                    <Td>{b.car_make} {b.car_model}</Td>
                    <Td><span className="tnum text-[13px]">{b.service_slug}</span></Td>
                    <Td mono>{b.preferred_date}</Td>
                    <Td>
                      <select aria-label={`Status for ${b.ref_no}`} value={b.status} onChange={async (e) => {
                        const s = e.target.value;
                        setBookings((prev) => prev.map((x) => x.ref_no === b.ref_no ? { ...x, status: s } : x));
                        try { await setBookingStatus(b.ref_no, s); } catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                      }} className={inputCls}>
                        {["pending", "confirmed", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[#787774]">No bookings yet. New online bookings land here.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === "Complaints" && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-end">
              <button onClick={() => downloadCSV("complaints.csv", complaints)} className="inline-flex items-center gap-1.5 rounded-md border border-[#EAEAEA] bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10 dark:bg-charcoal-900"><DownloadSimple size={14} weight="bold" /> CSV</button>
            </div>
            {complaints.map((c) => (
              <div key={c.ticket_no} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="tnum font-mono text-sm font-bold">{c.ticket_no} <span className="font-sans font-medium text-[#787774]">• {c.category} • {c.name}</span></span>
                  <select aria-label={`Status for ${c.ticket_no}`} value={c.status} onChange={async (e) => {
                    const s = e.target.value;
                    setComplaints((prev) => prev.map((x) => x.ticket_no === c.ticket_no ? { ...x, status: s } : x));
                    try { await resolveComplaint(c.ticket_no, s, reply[c.ticket_no] ?? c.admin_reply ?? ""); } catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                  }} className={inputCls}>
                    {["received", "in_review", "resolved"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>
                <p className="mt-2 text-sm leading-[1.6] text-[#2F3437] dark:text-neutral-300">{c.message}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input aria-label={`Reply to ${c.ticket_no}`} value={reply[c.ticket_no] ?? c.admin_reply ?? ""} onChange={(e) => setReply((p) => ({ ...p, [c.ticket_no]: e.target.value }))} placeholder="Write the reply the customer sees…" className={cn(inputCls, "flex-1")} />
                  <button onClick={async () => {
                    try { await resolveComplaint(c.ticket_no, c.status === "resolved" ? "resolved" : "in_review", reply[c.ticket_no] ?? ""); setComplaints((prev) => prev.map((x) => x.ticket_no === c.ticket_no ? { ...x, admin_reply: reply[c.ticket_no] ?? x.admin_reply, status: x.status === "received" ? "in_review" : x.status } : x)); }
                    catch (err) { setError(err instanceof Error ? err.message : "Reply failed."); }
                  }} className="btn-primary !min-h-[44px] shrink-0 !px-4 !py-2 !text-sm">Save reply</button>
                </div>
              </div>
            ))}
            {complaints.length === 0 && <p className="card text-center text-sm text-[#787774]">No complaints. Good sign.</p>}
          </div>
        )}

        {!loading && tab === "Quotes" && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-end">
              <button onClick={() => downloadCSV("quotes.csv", quotes)} className="inline-flex items-center gap-1.5 rounded-md border border-[#EAEAEA] bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10 dark:bg-charcoal-900"><DownloadSimple size={14} weight="bold" /> CSV</button>
            </div>
            {quotes.map((q) => (
              <div key={q.ref_no} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="tnum font-mono text-sm font-bold">{q.ref_no} <span className="font-sans font-medium text-[#787774]">• {q.name} • {q.car_make} {q.car_model}</span></span>
                  <select aria-label={`Status for ${q.ref_no}`} value={q.status} onChange={async (e) => {
                    const s = e.target.value;
                    const e2 = est[q.ref_no] ?? { lo: q.estimate_low ?? "", hi: q.estimate_high ?? "" };
                    setQuotes((prev) => prev.map((x) => x.ref_no === q.ref_no ? { ...x, status: s } : x));
                    try { await updateQuote(q.ref_no, { status: s, estimate_low: e2.lo, estimate_high: e2.hi }); } catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                  }} className={inputCls}>
                    {["received", "quoted", "booked", "declined"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <p className="mt-2 text-sm text-[#2F3437] dark:text-neutral-300">{q.symptom}</p>
                <div className="tnum mt-3 flex flex-col gap-2 sm:flex-row">
                  <input aria-label={`Low estimate for ${q.ref_no}`} value={est[q.ref_no]?.lo ?? q.estimate_low ?? ""} onChange={(e) => setEst((p) => ({ ...p, [q.ref_no]: { lo: e.target.value, hi: p[q.ref_no]?.hi ?? q.estimate_high ?? "" } }))} placeholder="₦ low" className={cn(inputCls, "sm:max-w-[160px]")} />
                  <input aria-label={`High estimate for ${q.ref_no}`} value={est[q.ref_no]?.hi ?? q.estimate_high ?? ""} onChange={(e) => setEst((p) => ({ ...p, [q.ref_no]: { lo: p[q.ref_no]?.lo ?? q.estimate_low ?? "", hi: e.target.value } }))} placeholder="₦ high" className={cn(inputCls, "sm:max-w-[160px]")} />
                  <button onClick={async () => {
                    const e2 = est[q.ref_no] ?? { lo: q.estimate_low ?? "", hi: q.estimate_high ?? "" };
                    try { await updateQuote(q.ref_no, { status: "quoted", estimate_low: e2.lo, estimate_high: e2.hi }); setQuotes((prev) => prev.map((x) => x.ref_no === q.ref_no ? { ...x, status: "quoted", estimate_low: e2.lo, estimate_high: e2.hi } : x)); }
                    catch (err) { setError(err instanceof Error ? err.message : "Save failed."); }
                  }} className="btn-primary !min-h-[44px] shrink-0 !px-4 !py-2 !text-sm">Send estimate</button>
                </div>
              </div>
            ))}
            {quotes.length === 0 && <p className="card text-center text-sm text-[#787774]">No quote requests yet.</p>}
          </div>
        )}

        {!loading && tab === "Reviews" && (
          <div className="card mt-4 overflow-x-auto p-0">
            <table className="w-full min-w-[640px]">
              <thead><tr><Th>Name</Th><Th>Review</Th><Th>Stars</Th><Th>Shown</Th></tr></thead>
              <tbody className="divide-y divide-[#EAEAEA] dark:divide-white/10">
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <Td>{r.name}<span className="block text-xs text-[#787774]">{r.car ?? ""}</span></Td>
                    <Td><span className="block max-w-[42ch]">{r.text}</span></Td>
                    <Td mono>{r.rating}/5</Td>
                    <Td>
                      <button onClick={async () => {
                        setReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, approved: !x.approved } : x));
                        try { await setReviewApproved(r.id, !r.approved); } catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                      }} aria-pressed={r.approved}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]", r.approved ? "bg-[#EDF3EC] text-[#346538]" : "border border-[#EAEAEA] dark:border-white/10")}>
                        {r.approved ? "Live" : "Approve"}
                      </button>
                    </Td>
                  </tr>
                ))}
                {reviews.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[#787774]">No reviews submitted yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === "Services" && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-end">
              <button onClick={() => downloadCSV("services.csv", servicesAdmin)} className="inline-flex items-center gap-1.5 rounded-md border border-[#EAEAEA] bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10 dark:bg-charcoal-900"><DownloadSimple size={14} weight="bold" /> CSV</button>
            </div>
            {servicesAdmin.map((s) => {
              const ed = svcEdits[s.slug] ?? {};
              const dirty = Object.keys(ed).length > 0;
              const set = (p: Partial<AdminService>) => setSvcEdits((prev) => ({ ...prev, [s.slug]: { ...prev[s.slug], ...p } }));
              return (
                <div key={s.slug} className="card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="tnum font-mono text-sm font-bold">{s.slug}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => {
                        try { await updateService(s.slug, { active: !s.active }); setServicesAdmin((prev) => prev.map((x) => x.slug === s.slug ? { ...x, active: !x.active } : x)); }
                        catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                      }} aria-pressed={s.active}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]", s.active ? "bg-[#EDF3EC] text-[#346538]" : "border border-[#EAEAEA] dark:border-white/10")}>
                        {s.active ? "Live" : "Hidden"}
                      </button>
                      <button disabled={!dirty} onClick={async () => {
                        try { await updateService(s.slug, ed); setServicesAdmin((prev) => prev.map((x) => x.slug === s.slug ? { ...x, ...ed } : x)); setSvcEdits((prev) => { const n = { ...prev }; delete n[s.slug]; return n; }); }
                        catch (err) { setError(err instanceof Error ? err.message : "Save failed."); }
                      }} className="btn-primary !min-h-[36px] !px-4 !py-1.5 !text-xs disabled:opacity-40">Save</button>
                    </div>
                  </div>
                  <div className="tnum mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="block text-xs text-[#787774]">Title<input value={ed.title ?? s.title} onChange={(e) => set({ title: e.target.value })} className={inputCls + " mt-1 w-full"} aria-label={`Title for ${s.slug}`} /></label>
                    <label className="block text-xs text-[#787774]">Starting price<input value={ed.price_from ?? s.price_from} onChange={(e) => setSvcEdits((prev) => ({ ...prev, [s.slug]: { ...prev[s.slug], price_from: e.target.value } }))} className={inputCls + " tnum mt-1 w-full"} aria-label={`Price for ${s.slug}`} /></label>
                    <label className="block text-xs text-[#787774]">Duration<input value={ed.duration ?? s.duration} onChange={(e) => setSvcEdits((prev) => ({ ...prev, [s.slug]: { ...prev[s.slug], duration: e.target.value } }))} className={inputCls + " tnum mt-1 w-full"} aria-label={`Duration for ${s.slug}`} /></label>
                    <label className="block text-xs text-[#787774] sm:col-span-2 lg:col-span-1">Blurb<input value={ed.description ?? s.description} onChange={(e) => setSvcEdits((prev) => ({ ...prev, [s.slug]: { ...prev[s.slug], description: e.target.value } }))} className={inputCls + " mt-1 w-full"} aria-label={`Description for ${s.slug}`} /></label>
                  </div>
                </div>
              );
            })}
            <form className="card" onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              const slug = newSvc.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
              if (!slug || !newSvc.title.trim() || !newSvc.price_from.trim()) return setError("New service needs a slug, title and price.");
              try {
                await createService({ slug, title: newSvc.title.trim(), description: newSvc.description.trim(), duration: newSvc.duration.trim() || "Quote", price_from: newSvc.price_from.trim() });
                setServicesAdmin((prev) => [...prev, { slug, title: newSvc.title.trim(), description: newSvc.description.trim(), duration: newSvc.duration.trim() || "Quote", price_from: newSvc.price_from.trim(), active: true }]);
                setNewSvc({ slug: "", title: "", description: "", duration: "", price_from: "" });
              } catch (err) { setError(err instanceof Error ? err.message : "Create failed."); }
            }}>
              <h2 className="font-display font-semibold text-[#111111] dark:text-white">Add a service</h2>
              <div className="tnum mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                <input value={newSvc.slug} onChange={(e) => setNewSvc({ ...newSvc, slug: e.target.value })} placeholder="slug-like-this" aria-label="New service slug" className={inputCls} />
                <input value={newSvc.title} onChange={(e) => setNewSvc({ ...newSvc, title: e.target.value })} placeholder="Title" aria-label="New service title" className={inputCls} />
                <input value={newSvc.price_from} onChange={(e) => setNewSvc({ ...newSvc, price_from: e.target.value })} placeholder="₦25,000" aria-label="New service price" className={inputCls} />
                <input value={newSvc.duration} onChange={(e) => setNewSvc({ ...newSvc, duration: e.target.value })} placeholder="2-4 hrs" aria-label="New service duration" className={inputCls} />
                <input value={newSvc.description} onChange={(e) => setNewSvc({ ...newSvc, description: e.target.value })} placeholder="One-line blurb" aria-label="New service blurb" className={inputCls} />
              </div>
              <button type="submit" className="btn-primary mt-3 !min-h-[44px] !px-4 !py-2 !text-sm">Add service</button>
            </form>
          </div>
        )}

        {!loading && tab === "Team" && (
          <div className="mt-4 space-y-4">
            {teamAdmin.map((m) => {
              const ed = memberEdits[m.id] ?? {};
              const dirty = Object.keys(ed).length > 0;
              const set = (p: Partial<AdminTeamMember>) => setMemberEdits((prev) => ({ ...prev, [m.id]: { ...prev[m.id], ...p } }));
              return (
                <div key={m.id} className="card">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-sm font-bold ${ed.tint ?? m.tint}`}>
                      {ed.initials ?? m.initials}
                    </span>
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <input value={ed.name ?? m.name} onChange={(e) => set({ name: e.target.value })} aria-label={`Name for ${m.name}`} className={inputCls} />
                      <input value={ed.role ?? m.role} onChange={(e) => set({ role: e.target.value })} aria-label={`Role for ${m.name}`} className={inputCls} />
                    </div>
                  </div>
                  <input value={ed.detail ?? m.detail} onChange={(e) => set({ detail: e.target.value })} aria-label={`Detail for ${m.name}`} className={inputCls + " mt-2 w-full"} />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="flex gap-1.5" role="radiogroup" aria-label={`Tile color for ${m.name}`}>
                      {TEAM_TINTS.map((t) => (
                        <button key={t} type="button" role="radio" aria-checked={(ed.tint ?? m.tint) === t} aria-label={`Tile ${TEAM_TINTS.indexOf(t) + 1}`}
                          onClick={() => set({ tint: t })}
                          className={cn("grid h-9 w-9 place-items-center rounded-lg font-display text-xs font-bold transition active:scale-[0.95]", t, (ed.tint ?? m.tint) === t && "ring-2 ring-[#111111] ring-offset-2 dark:ring-white")}>
                          {(ed.initials ?? m.initials).slice(0, 1)}
                        </button>
                      ))}
                    </div>
                    <button onClick={async () => {
                      try { await updateTeamMember(m.id, { active: !m.active }); setTeamAdmin((prev) => prev.map((x) => x.id === m.id ? { ...x, active: !x.active } : x)); }
                      catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                    }} aria-pressed={m.active}
                      className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]", m.active ? "bg-[#EDF3EC] text-[#346538]" : "border border-[#EAEAEA] dark:border-white/10")}>
                      {m.active ? "Shown" : "Hidden"}
                    </button>
                    <button disabled={!dirty} onClick={async () => {
                      try { await updateTeamMember(m.id, ed); setTeamAdmin((prev) => prev.map((x) => x.id === m.id ? { ...x, ...ed } : x)); setMemberEdits((prev) => { const n = { ...prev }; delete n[m.id]; return n; }); }
                      catch (err) { setError(err instanceof Error ? err.message : "Save failed."); }
                    }} className="btn-primary !min-h-[36px] !px-4 !py-1.5 !text-xs disabled:opacity-40">Save</button>
                    {confirmDelete === m.id ? (
                      <button onClick={async () => {
                        try { await deleteTeamMember(m.id); setTeamAdmin((prev) => prev.filter((x) => x.id !== m.id)); setConfirmDelete(null); }
                        catch (err) { setError(err instanceof Error ? err.message : "Delete failed."); }
                      }} className="rounded-md bg-[#9F2F2D] px-3 py-1.5 text-xs font-semibold text-white active:scale-[0.98]">Confirm remove</button>
                    ) : (
                      <button onClick={() => setConfirmDelete(m.id)} className="rounded-md border border-[#EAEAEA] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#FDEBEC] active:scale-[0.98] dark:border-white/10">Remove</button>
                    )}
                  </div>
                </div>
              );
            })}
            <form className="card" onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (newMember.name.trim().length < 2 || !newMember.role.trim()) return setError("New member needs a name and role.");
              const initials = newMember.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              try {
                await createTeamMember({ name: newMember.name.trim(), role: newMember.role.trim(), detail: newMember.detail.trim(), initials, tint: newMember.tint });
                const fresh = await fetchTeamAdmin();
                setTeamAdmin(fresh);
                setNewMember({ name: "", role: "", detail: "", tint: TEAM_TINTS[0] });
              } catch (err) { setError(err instanceof Error ? err.message : "Create failed."); }
            }}>
              <h2 className="font-display font-semibold text-[#111111] dark:text-white">Add a crew member</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Full name" aria-label="New member name" className={inputCls} />
                <input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="Role, e.g. Brake specialist" aria-label="New member role" className={inputCls} />
                <input value={newMember.detail} onChange={(e) => setNewMember({ ...newMember, detail: e.target.value })} placeholder="What they handle" aria-label="New member detail" className={inputCls} />
              </div>
              <button type="submit" className="btn-primary mt-3 !min-h-[44px] !px-4 !py-2 !text-sm">Add member</button>
            </form>
          </div>
        )}

        {!loading && tab === "Subscribers" && (
          <div className="card mt-4 overflow-x-auto p-0">
            <div className="flex items-center justify-between gap-2 p-4">
              <h2 className="font-display font-semibold text-[#111111] dark:text-white">Newsletter</h2>
              <button onClick={() => downloadCSV("subscribers.csv", subs)} className="inline-flex items-center gap-1.5 rounded-md border border-[#EAEAEA] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10"><DownloadSimple size={14} weight="bold" /> CSV</button>
            </div>
            <table className="w-full border-t border-[#EAEAEA] dark:border-white/10">
              <thead><tr><Th>Email</Th><Th>Joined</Th></tr></thead>
              <tbody className="divide-y divide-[#EAEAEA] dark:divide-white/10">
                {subs.map((s) => <tr key={s.email}><Td mono>{s.email}</Td><Td mono>{new Date(s.created_at).toLocaleDateString("en-NG")}</Td></tr>)}
                {subs.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-[#787774]">No subscribers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === "Slots" && (
          <div className="card mt-4 overflow-x-auto p-0">
            <table className="w-full min-w-[520px]">
              <thead><tr><Th>Day</Th><Th>Window</Th><Th>Bays</Th><Th>Open</Th></tr></thead>
              <tbody className="divide-y divide-[#EAEAEA] dark:divide-white/10">
                {slots.map((s) => (
                  <tr key={s.id}>
                    <Td>{WEEKDAYS[s.weekday]}</Td>
                    <Td mono>{String(s.start_time).slice(0, 5)} – {String(s.end_time).slice(0, 5)}</Td>
                    <Td mono>{s.capacity}</Td>
                    <Td>
                      <button onClick={async () => {
                        setSlots((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x));
                        try { await toggleSlot(s.id, !s.active); } catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
                      }} aria-pressed={s.active}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]", s.active ? "bg-[#EDF3EC] text-[#346538]" : "border border-[#EAEAEA] dark:border-white/10")}>
                        {s.active ? "Open" : "Closed"}
                      </button>
                    </Td>
                  </tr>
                ))}
                {slots.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[#787774]">No slots seeded. Run the time_slots seed in schema.sql.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 flex items-center gap-1 text-xs text-[#787774] dark:text-neutral-500">
          Production note: add RLS so only admins read these tables.
          <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 underline underline-offset-2">RLS guide <ArrowSquareOut size={12} weight="bold" /></a>
        </p>
      </div>
    </section>
  );
}
