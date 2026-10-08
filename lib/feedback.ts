import { TESTIMONIALS } from "./demo-data";
import { supabase } from "./supabase";

export const COMPLAINT_CATEGORIES = [
  "Service quality",
  "Pricing",
  "Delay",
  "Staff conduct",
  "Other",
] as const;

export type ComplaintStatus = "received" | "in_review" | "resolved";

export type ComplaintInput = {
  name: string;
  contact: string;
  bookingRef?: string;
  category: string;
  message: string;
};

export type Complaint = ComplaintInput & {
  ticketNo: string;
  status: ComplaintStatus;
  adminReply?: string;
  createdAt: string;
};

export type Review = {
  name: string;
  car?: string;
  text: string;
  rating: number;
  date: string;
};

export type ReviewInput = {
  name: string;
  car?: string;
  text: string;
  rating: number;
};

const LS_COMPLAINTS = "gboks_complaints_v1";
const LS_REVIEWS = "gboks_reviews_v1";

function makeTicket(prefix: "CMP"): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  let s = "";
  for (const n of buf) s += chars[n % chars.length];
  return `${prefix}-${s}`;
}

function readLS<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

async function uploadAttachments(files: File[]): Promise<string[]> {
  if (!supabase || files.length === 0) return [];
  const urls: string[] = [];
  for (const f of files.slice(0, 3)) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("complaint-attachments").upload(path, f, { contentType: f.type });
    if (!error) {
      const { data } = await supabase.storage.from("complaint-attachments").createSignedUrl(path, 60 * 60 * 24 * 30);
      if (data?.signedUrl) urls.push(data.signedUrl);
    }
  }
  return urls;
}

export async function createComplaint(input: ComplaintInput, files: File[] = []): Promise<Complaint> {
  const ticketNo = makeTicket("CMP");
  const attachmentUrls = await uploadAttachments(files);

  if (supabase) {
    const { error } = await supabase.from("complaints").insert({
      ticket_no: ticketNo,
      name: input.name,
      contact: input.contact,
      booking_ref: input.bookingRef || null,
      category: input.category,
      message: input.message,
      attachment_urls: attachmentUrls,
    });
    if (error) throw new Error("Could not file your complaint. Check your connection and try again.");
  }

  const complaint: Complaint = { ...input, ticketNo, status: "received", createdAt: new Date().toISOString() };
  try {
    const all = readLS<Complaint>(LS_COMPLAINTS);
    all.push(complaint);
    localStorage.setItem(LS_COMPLAINTS, JSON.stringify(all));
  } catch {
    // ignore
  }
  return complaint;
}

export async function findComplaint(ticketNo: string, contact: string): Promise<Complaint | null> {
  const ticket = ticketNo.trim().toUpperCase();
  const ct = contact.replace(/\s/g, "").toLowerCase();

  if (supabase) {
    try {
      const { data } = await supabase
        .from("complaints")
        .select("ticket_no,name,contact,booking_ref,category,message,status,admin_reply,created_at")
        .eq("ticket_no", ticket)
        .maybeSingle();
      if (data) {
        const rowContact = String(data.contact).replace(/\s/g, "").toLowerCase();
        if (rowContact === ct || rowContact.slice(-7) === ct.slice(-7)) {
          return {
            name: data.name,
            contact: data.contact,
            bookingRef: data.booking_ref ?? undefined,
            category: data.category,
            message: data.message,
            ticketNo: data.ticket_no,
            status: data.status as ComplaintStatus,
            adminReply: data.admin_reply ?? undefined,
            createdAt: data.created_at,
          };
        }
        return null;
      }
    } catch {
      // fall through
    }
  }

  return readLS<Complaint>(LS_COMPLAINTS).find((c) => c.ticketNo.toUpperCase() === ticket) ?? null;
}

// Approved reviews wall. Live rows first, demo fallback always present
// so the page reads real with or without Supabase.
export async function getReviews(): Promise<{ reviews: Review[]; live: boolean }> {
  const demo: Review[] = TESTIMONIALS.map((t) => ({
    name: t.name,
    car: t.car,
    text: t.text,
    rating: t.rating,
    date: t.date,
  }));

  if (!supabase) {
    const local = readLS<Review>(LS_REVIEWS);
    return { reviews: [...local, ...demo], live: false };
  }
  try {
    const { data } = await supabase
      .from("testimonials")
      .select("name,car,text,rating,created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    const live = (data ?? []).map((r) => ({
      name: r.name as string,
      car: (r.car as string) ?? undefined,
      text: r.text as string,
      rating: r.rating as number,
      date: new Date(r.created_at as string).toLocaleDateString("en-NG", { month: "short", year: "numeric" }),
    }));
    const local = readLS<Review>(LS_REVIEWS);
    return { reviews: [...live, ...local, ...demo].slice(0, 12), live: live.length > 0 };
  } catch {
    return { reviews: demo, live: false };
  }
}

export async function submitReview(input: ReviewInput): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("testimonials").insert({
      name: input.name,
      car: input.car || null,
      text: input.text,
      rating: input.rating,
      approved: false,
    });
    if (error) throw new Error("Could not save your review. Try again.");
  }
  const review: Review = {
    ...input,
    date: new Date().toLocaleDateString("en-NG", { month: "short", year: "numeric" }),
  };
  try {
    const all = readLS<Review>(LS_REVIEWS);
    all.unshift(review);
    localStorage.setItem(LS_REVIEWS, JSON.stringify(all.slice(0, 12)));
  } catch {
    // ignore
  }
}
