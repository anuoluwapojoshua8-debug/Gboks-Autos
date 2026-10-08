import { supabase } from "./supabase";

export type TimeSlot = {
  id: string;
  weekday: number;
  start: string; // "08:00"
  end: string; // "10:00"
  capacity: number;
  booked?: number;
};

export type BookingInput = {
  fullName: string;
  phone: string;
  email?: string;
  carMake: string;
  carModel: string;
  carYear?: number;
  plateNumber?: string;
  serviceSlug: string;
  preferredDate: string; // YYYY-MM-DD
  timeSlotId: string;
  problem?: string;
  photoUrls?: string[];
};

export type Booking = BookingInput & {
  refNo: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid_onsite";
  createdAt: string;
};

const LS_KEY = "gboks_bookings_v1";

// Demo slots mirror workshop hours: Mon-Fri 4 windows, Sat 2, Sun closed.
const DEMO_SLOTS: Omit<TimeSlot, "booked">[] = [
  { id: "wd-1", weekday: -1, start: "08:00", end: "10:00", capacity: 2 },
  { id: "wd-2", weekday: -1, start: "10:00", end: "12:00", capacity: 2 },
  { id: "wd-3", weekday: -1, start: "13:00", end: "15:00", capacity: 2 },
  { id: "wd-4", weekday: -1, start: "15:00", end: "17:00", capacity: 2 },
];
const DEMO_SAT: Omit<TimeSlot, "booked">[] = [
  { id: "sa-1", weekday: 6, start: "09:00", end: "12:00", capacity: 2 },
  { id: "sa-2", weekday: 6, start: "12:00", end: "15:00", capacity: 2 },
];

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isSunday(dateISO: string): boolean {
  const d = new Date(dateISO + "T12:00:00");
  return d.getDay() === 0;
}

export function minBookableDate(): string {
  return toISODate(new Date());
}

export function makeRefNo(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  for (const n of buf) s += chars[n % chars.length];
  return `GBK-${s}`;
}

function readLocal(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

function writeLocal(all: Booking[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

// Slots for a date. Live: workshop time_slots + booked counts.
// Demo: static windows with localStorage counts.
export async function getSlots(dateISO: string): Promise<{ slots: TimeSlot[]; live: boolean }> {
  if (!dateISO || isSunday(dateISO)) return { slots: [], live: !!supabase };
  const weekday = new Date(dateISO + "T12:00:00").getDay();

  if (supabase) {
    try {
      const [{ data: slotRows }, { data: bookedRows }] = await Promise.all([
        supabase.from("time_slots").select("id,weekday,start_time,end_time,capacity").eq("active", true).eq("weekday", weekday).order("start_time"),
        supabase.from("bookings").select("time_slot_id").eq("preferred_date", dateISO).neq("status", "cancelled"),
      ]);
      const counts: Record<string, number> = {};
      for (const b of bookedRows ?? []) {
        const id = (b as { time_slot_id: string }).time_slot_id;
        if (id) counts[id] = (counts[id] ?? 0) + 1;
      }
      const slots = (slotRows ?? []).map((r) => ({
        id: r.id as string,
        weekday: r.weekday as number,
        start: String(r.start_time).slice(0, 5),
        end: String(r.end_time).slice(0, 5),
        capacity: (r.capacity as number) ?? 2,
        booked: counts[r.id as string] ?? 0,
      }));
      if (slots.length > 0) return { slots, live: true };
    } catch {
      // fall through to demo
    }
  }

  const base = weekday === 6 ? DEMO_SAT : DEMO_SLOTS;
  const all = readLocal().filter((b) => b.preferredDate === dateISO && b.status !== "cancelled");
  return {
    slots: base.map((s) => ({
      ...s,
      weekday,
      booked: all.filter((b) => b.timeSlotId === s.id).length,
    })),
    live: false,
  };
}

async function uploadPhotos(files: File[]): Promise<string[]> {
  if (!supabase || files.length === 0) return [];
  const urls: string[] = [];
  for (const f of files.slice(0, 3)) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("booking-photos").upload(path, f, { contentType: f.type });
    if (!error) {
      const { data } = await supabase.storage.from("booking-photos").createSignedUrl(path, 60 * 60 * 24 * 30);
      if (data?.signedUrl) urls.push(data.signedUrl);
    }
  }
  return urls;
}

export async function createBooking(input: BookingInput, photos: File[] = []): Promise<Booking> {
  const refNo = makeRefNo();
  const photoUrls = await uploadPhotos(photos);

  if (supabase) {
    const { error } = await supabase.from("bookings").insert({
      ref_no: refNo,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email || null,
      car_make: input.carMake,
      car_model: input.carModel,
      car_year: input.carYear || null,
      plate_number: input.plateNumber || null,
      service_slug: input.serviceSlug,
      preferred_date: input.preferredDate,
      time_slot_id: input.timeSlotId,
      problem: input.problem || null,
      photo_urls: photoUrls,
    });
    if (error) throw new Error("Could not save booking. Check your connection and try again.");
  }

  const booking: Booking = {
    ...input,
    photoUrls,
    refNo,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };
  // Always mirror to localStorage so Track works offline / in demo.
  try {
    const all = readLocal();
    all.push(booking);
    writeLocal(all);
  } catch {
    // storage full or blocked, confirmation still valid
  }
  return booking;
}

export async function findBooking(refNo: string, phone: string): Promise<Booking | null> {
  const ref = refNo.trim().toUpperCase();
  const ph = phone.replace(/\s/g, "");

  if (supabase) {
    try {
      const { data } = await supabase
        .from("bookings")
        .select("ref_no,full_name,phone,email,car_make,car_model,car_year,plate_number,service_slug,preferred_date,time_slot_id,problem,photo_urls,status,payment_status,created_at")
        .eq("ref_no", ref)
        .maybeSingle();
      if (data) {
        const rowPhone = String(data.phone).replace(/\s/g, "");
        if (rowPhone.endsWith(ph.slice(-7)) || ph.endsWith(rowPhone.slice(-7))) {
          return {
            fullName: data.full_name,
            phone: data.phone,
            email: data.email ?? undefined,
            carMake: data.car_make,
            carModel: data.car_model,
            carYear: data.car_year ?? undefined,
            plateNumber: data.plate_number ?? undefined,
            serviceSlug: data.service_slug,
            preferredDate: data.preferred_date,
            timeSlotId: data.time_slot_id,
            problem: data.problem ?? undefined,
            photoUrls: data.photo_urls ?? [],
            refNo: data.ref_no,
            status: data.status,
            paymentStatus: data.payment_status,
            createdAt: data.created_at,
          };
        }
        return null;
      }
    } catch {
      // fall through to local
    }
  }

  const hit = readLocal().find(
    (b) => b.refNo.toUpperCase() === ref && b.phone.replace(/\s/g, "").slice(-7) === ph.slice(-7)
  );
  return hit ?? null;
}

export async function rescheduleBooking(refNo: string, dateISO: string, slotId: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("bookings")
      .update({ preferred_date: dateISO, time_slot_id: slotId, status: "pending" })
      .eq("ref_no", refNo.trim().toUpperCase());
    if (error) throw new Error("Could not reschedule. Try again.");
  }
  try {
    const all = readLocal();
    const hit = all.find((b) => b.refNo.toUpperCase() === refNo.trim().toUpperCase());
    if (hit) {
      hit.preferredDate = dateISO;
      hit.timeSlotId = slotId;
      hit.status = "pending";
      writeLocal(all);
    }
  } catch {
    // ignore
  }
}

export async function cancelBooking(refNo: string): Promise<void> {
  if (supabase) {
    await supabase.from("bookings").update({ status: "cancelled" }).eq("ref_no", refNo.trim().toUpperCase());
  }
  try {
    const all = readLocal();
    const hit = all.find((b) => b.refNo.toUpperCase() === refNo.trim().toUpperCase());
    if (hit) {
      hit.status = "cancelled";
      writeLocal(all);
    }
  } catch {
    // ignore
  }
}
