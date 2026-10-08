import { supabase } from "./supabase";

export type GalleryTag = "workshop" | "repairs" | "team";

export type GalleryImage = {
  src: string;
  caption: string;
  tag: GalleryTag;
  alt: string;
};

const DEMO_GALLERY: GalleryImage[] = [
  { src: "https://picsum.photos/seed/gboks-bay/1400/900", caption: "Morning lineup in the Ikeja bay", tag: "workshop", alt: "Cars parked inside the GBOKS workshop bay" },
  { src: "https://picsum.photos/seed/gboks-lift/900/1100", caption: "Underbody check on the lift", tag: "repairs", alt: "Car raised on a lift for underbody inspection" },
  { src: "https://picsum.photos/seed/gboks-engine/900/700", caption: "Full service: fluids, filters, 40-point check", tag: "repairs", alt: "Technician servicing a car engine" },
  { src: "https://picsum.photos/seed/gboks-diag/900/700", caption: "Dealer-level diagnostics before any quote", tag: "workshop", alt: "Diagnostic scanner plugged into a car" },
  { src: "https://picsum.photos/seed/gboks-brake/900/1100", caption: "Brake discs skimmed, pads renewed", tag: "repairs", alt: "Close view of a brake disc and caliper" },
  { src: "https://picsum.photos/seed/gboks-ac/900/700", caption: "AC regas, tested cold before handover", tag: "repairs", alt: "Technician servicing car air conditioning" },
  { src: "https://picsum.photos/seed/gboks-team/1400/900", caption: "The crew that signs off your road test", tag: "team", alt: "Workshop technicians standing by a serviced car" },
  { src: "https://picsum.photos/seed/gboks-paint/900/700", caption: "Panel beating and oven-baked spray", tag: "repairs", alt: "Car body work in the paint booth" },
  { src: "https://picsum.photos/seed/gboks-road/900/1100", caption: "Road-tested on Allen Avenue before pickup", tag: "workshop", alt: "Car on a Lagos road after service" },
];

// Public gallery: live Storage bucket rows first, curated demo seeds
// until real workshop photos are uploaded to the bucket.
export async function listGallery(): Promise<{ images: GalleryImage[]; live: boolean }> {
  if (!supabase) return { images: DEMO_GALLERY, live: false };
  try {
    const { data, error } = await supabase.storage.from("gallery").list(undefined, { limit: 30 });
    if (error || !data || data.length === 0) return { images: DEMO_GALLERY, live: false };
    const images: GalleryImage[] = [];
    for (const f of data) {
      if (!f.name || f.name.startsWith(".")) continue;
      const { data: url } = supabase.storage.from("gallery").getPublicUrl(f.name);
      if (!url?.publicUrl) continue;
      const stem = f.name.replace(/\.[a-z]+$/i, "").replace(/[-_]+/g, " ");
      images.push({
        src: url.publicUrl,
        caption: stem.charAt(0).toUpperCase() + stem.slice(1),
        tag: /team|crew|staff/i.test(f.name) ? "team" : /brake|engine|paint|repair|before|after/i.test(f.name) ? "repairs" : "workshop",
        alt: stem,
      });
    }
    if (images.length === 0) return { images: DEMO_GALLERY, live: false };
    return { images, live: true };
  } catch {
    return { images: DEMO_GALLERY, live: false };
  }
}
