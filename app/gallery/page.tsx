import { GalleryBody } from "@/components/gallery/GalleryBody";
import { listGallery } from "@/lib/gallery";

export const metadata = {
  title: "Gallery",
  description: "GBOKS AUTOS workshop in Ikeja, Lagos: bays, repairs and the team at work.",
};

// Step 6: public Storage bucket when filled, curated seeds otherwise.
export default async function GalleryPage() {
  const { images, live } = await listGallery();
  return <GalleryBody images={images} live={live} />;
}
