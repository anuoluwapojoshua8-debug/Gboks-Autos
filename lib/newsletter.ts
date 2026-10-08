import { supabase } from "./supabase";

const LS_KEY = "gboks_newsletter_v1";

// Newsletter: Supabase row when configured, always mirrored locally
// so the form confirms honestly in demo mode too.
export async function subscribeNewsletter(email: string): Promise<{ duplicate: boolean }> {
  const clean = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(clean)) throw new Error("Enter a valid email address.");

  if (supabase) {
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: clean });
    if (error) {
      if (error.code === "23505") return { duplicate: true };
      throw new Error("Could not subscribe. Try again.");
    }
  }

  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as string[];
    if (all.includes(clean)) return { duplicate: true };
    all.push(clean);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  return { duplicate: false };
}
