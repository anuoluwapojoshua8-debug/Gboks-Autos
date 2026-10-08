import { SERVICES, type Service } from "./demo-data";
import { supabase } from "./supabase";

export type { Service };

type ServiceRow = {
  slug: string;
  title: string;
  description: string | null;
  duration: string | null;
  price_from: string | null;
  icon?: string | null;
};

// Slug -> phosphor icon key. Supabase rows carry no icon column,
// so we resolve the tile from the demo catalogue first.
const ICON_BY_SLUG: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.icon])
);

export function iconForSlug(slug: string): string {
  return ICON_BY_SLUG[slug] ?? "wrench";
}

function rowToService(row: ServiceRow): Service {
  const fallback = SERVICES.find((s) => s.slug === row.slug);
  return {
    slug: row.slug,
    title: row.title,
    icon: row.icon ?? fallback?.icon ?? "wrench",
    desc: row.description ?? fallback?.desc ?? "",
    duration: row.duration ?? fallback?.duration ?? "",
    priceFrom: row.price_from ?? fallback?.priceFrom ?? "Quote",
  };
}

// Production read: live Supabase services table when configured.
// Falls back to local demo data when env keys are missing or the
// query fails, so the catalogue always renders.
export async function getServices(): Promise<{ services: Service[]; live: boolean }> {
  if (!supabase) return { services: SERVICES, live: false };
  try {
    const { data, error } = await supabase
      .from("services")
      .select("slug,title,description,duration,price_from")
      .eq("active", true)
      .order("title", { ascending: true });
    if (error || !data || data.length === 0) return { services: SERVICES, live: false };
    return { services: (data as ServiceRow[]).map(rowToService), live: true };
  } catch {
    return { services: SERVICES, live: false };
  }
}
