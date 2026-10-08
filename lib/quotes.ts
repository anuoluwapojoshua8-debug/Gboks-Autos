import { supabase } from "./supabase";

export type QuoteInput = {
  name: string;
  contact: string;
  carMake: string;
  carModel: string;
  carYear?: number;
  serviceSlug: string;
  symptom: string;
};

export type Quote = QuoteInput & {
  refNo: string;
  createdAt: string;
};

const LS_KEY = "gboks_quotes_v1";

function makeRef(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  let s = "";
  for (const n of buf) s += chars[n % chars.length];
  return `QTE-${s}`;
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

// Quote requests: Supabase row when configured, always mirrored locally.
export async function createQuote(input: QuoteInput, files: File[] = []): Promise<Quote> {
  const refNo = makeRef();
  const photoUrls = await uploadPhotos(files);

  if (supabase) {
    const { error } = await supabase.from("quote_requests").insert({
      ref_no: refNo,
      name: input.name,
      contact: input.contact,
      car_make: input.carMake,
      car_model: input.carModel,
      car_year: input.carYear || null,
      service_slug: input.serviceSlug,
      symptom: input.symptom,
      photo_urls: photoUrls,
    });
    if (error) throw new Error("Could not send your request. Check your connection and try again.");
  }

  const quote: Quote = { ...input, refNo, createdAt: new Date().toISOString() };
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as Quote[];
    all.push(quote);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  return quote;
}
