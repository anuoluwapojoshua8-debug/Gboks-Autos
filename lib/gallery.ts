import { supabase } from "./supabase";

export type GalleryTag = "workshop" | "repairs" | "team";

export type GalleryImage = {
  src: string;
  caption: string;
  tag: GalleryTag;
  alt: string;
};

const DEMO_GALLERY: GalleryImage[] = [
  { src: "/images/gallery/workshop-bay-lineup.jpg", caption: "Morning lineup in the Ikeja bay", tag: "workshop", alt: "Classic cars lined up in a row" },
  { src: "/images/gallery/car-on-lift-inspection.jpg", caption: "Underbody check on the lift", tag: "repairs", alt: "Hydraulic lift controls inside a workshop bay" },
  { src: "/images/gallery/engine-service.jpg", caption: "Full service: fluids, filters, 40-point check", tag: "repairs", alt: "V8 engine and running gear close-up" },
  { src: "/images/gallery/diagnostics-obd-scan.jpg", caption: "Dealer-level diagnostics before any quote", tag: "workshop", alt: "OBD-II diagnostic port under a car dashboard" },
  { src: "/images/gallery/brake-disc-caliper.jpg", caption: "Brake discs skimmed, pads renewed", tag: "repairs", alt: "Worn brake disc and caliper during replacement" },
  { src: "/images/gallery/ac-service-gauges.jpg", caption: "AC regas, tested cold before handover", tag: "repairs", alt: "Car dashboard with air vents and climate controls" },
  { src: "/images/gallery/crew-workshop-team.jpg", caption: "The crew that signs off your road test", tag: "team", alt: "Two mechanics working on an engine" },
  { src: "/images/gallery/paint-spray-booth.jpg", caption: "Panel beating and oven-baked spray", tag: "repairs", alt: "Bare-metal project car at a restoration shop" },
  { src: "/images/gallery/road-test-drive.jpg", caption: "Road-tested on Allen Avenue before pickup", tag: "workshop", alt: "Driver point of view on a highway with traffic" },
];

// Public gallery: live Storage bucket rows first, curated local workshop
// photos until real GBOKS photos are uploaded to the bucket.
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
