import { supabase } from "./supabase";

function required() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

export type AdminBooking = {
  ref_no: string;
  full_name: string;
  phone: string;
  car_make: string;
  car_model: string;
  service_slug: string;
  preferred_date: string;
  status: string;
  created_at: string;
};

export type AdminComplaint = {
  ticket_no: string;
  name: string;
  contact: string;
  category: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
};

export type AdminQuote = {
  ref_no: string;
  name: string;
  contact: string;
  car_make: string;
  car_model: string;
  service_slug: string;
  symptom: string;
  status: string;
  estimate_low: string | null;
  estimate_high: string | null;
  created_at: string;
};

export type AdminReview = {
  id: string;
  name: string;
  car: string | null;
  text: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

export type AdminSlot = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  capacity: number;
  active: boolean;
};

export async function getRole(userId: string): Promise<string | null> {
  const sb = required();
  const { data } = await sb.from("profiles").select("role").eq("id", userId).maybeSingle();
  return (data?.role as string) ?? null;
}

export async function fetchBookings(): Promise<AdminBooking[]> {
  const sb = required();
  const { data, error } = await sb.from("bookings")
    .select("ref_no,full_name,phone,car_make,car_model,service_slug,preferred_date,status,created_at")
    .order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminBooking[];
}

export async function setBookingStatus(refNo: string, status: string): Promise<void> {
  const sb = required();
  const { error } = await sb.from("bookings").update({ status }).eq("ref_no", refNo);
  if (error) throw new Error(error.message);
}

export async function fetchComplaints(): Promise<AdminComplaint[]> {
  const sb = required();
  const { data, error } = await sb.from("complaints")
    .select("ticket_no,name,contact,category,message,status,admin_reply,created_at")
    .order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminComplaint[];
}

export async function resolveComplaint(ticketNo: string, status: string, adminReply: string): Promise<void> {
  const sb = required();
  const { error } = await sb.from("complaints").update({ status, admin_reply: adminReply || null }).eq("ticket_no", ticketNo);
  if (error) throw new Error(error.message);
}

export async function fetchQuotes(): Promise<AdminQuote[]> {
  const sb = required();
  const { data, error } = await sb.from("quote_requests")
    .select("ref_no,name,contact,car_make,car_model,service_slug,symptom,status,estimate_low,estimate_high,created_at")
    .order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminQuote[];
}

export async function updateQuote(refNo: string, patch: { status: string; estimate_low: string; estimate_high: string }): Promise<void> {
  const sb = required();
  const { error } = await sb.from("quote_requests").update({
    status: patch.status,
    estimate_low: patch.estimate_low || null,
    estimate_high: patch.estimate_high || null,
  }).eq("ref_no", refNo);
  if (error) throw new Error(error.message);
}

export async function fetchReviews(): Promise<AdminReview[]> {
  const sb = required();
  const { data, error } = await sb.from("testimonials")
    .select("id,name,car,text,rating,approved,created_at")
    .order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminReview[];
}

export async function setReviewApproved(id: string, approved: boolean): Promise<void> {
  const sb = required();
  const { error } = await sb.from("testimonials").update({ approved }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchSubscribers(): Promise<{ email: string; created_at: string }[]> {
  const sb = required();
  const { data, error } = await sb.from("newsletter_subscribers")
    .select("email,created_at").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as { email: string; created_at: string }[];
}

export async function fetchSlots(): Promise<AdminSlot[]> {
  const sb = required();
  const { data, error } = await sb.from("time_slots")
    .select("id,weekday,start_time,end_time,capacity,active").order("weekday").order("start_time");
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminSlot[];
}

export async function toggleSlot(id: string, active: boolean): Promise<void> {
  const sb = required();
  const { error } = await sb.from("time_slots").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
}

export type AdminService = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  price_from: string;
  active: boolean;
};

export type AdminTeamMember = {
  id: string;
  name: string;
  role: string;
  detail: string;
  initials: string;
  tint: string;
  sort_order: number;
  active: boolean;
};

export async function fetchServicesAdmin(): Promise<AdminService[]> {
  const sb = required();
  const { data, error } = await sb.from("services")
    .select("slug,title,description,duration,price_from,active").order("title");
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminService[];
}

export async function updateService(slug: string, patch: Partial<Pick<AdminService, "title" | "description" | "duration" | "price_from" | "active">>): Promise<void> {
  const sb = required();
  const { error } = await sb.from("services").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
}

export async function createService(row: { slug: string; title: string; description: string; duration: string; price_from: string }): Promise<void> {
  const sb = required();
  const { error } = await sb.from("services").insert({ ...row, active: true });
  if (error) throw new Error(error.code === "23505" ? "That URL slug is taken. Use another." : error.message);
}

export async function fetchTeamAdmin(): Promise<AdminTeamMember[]> {
  const sb = required();
  const { data, error } = await sb.from("team_members")
    .select("id,name,role,detail,initials,tint,sort_order,active").order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminTeamMember[];
}

export async function updateTeamMember(id: string, patch: Partial<Pick<AdminTeamMember, "name" | "role" | "detail" | "initials" | "tint" | "sort_order" | "active">>): Promise<void> {
  const sb = required();
  const { error } = await sb.from("team_members").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createTeamMember(row: { name: string; role: string; detail: string; initials: string; tint: string }): Promise<void> {
  const sb = required();
  const { data } = await sb.from("team_members").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const next = ((data?.[0]?.sort_order as number) ?? 0) + 1;
  const { error } = await sb.from("team_members").insert({ ...row, sort_order: next, active: true });
  if (error) throw new Error(error.message);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const sb = required();
  const { error } = await sb.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Client-side CSV download. Works for any row type.
export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
