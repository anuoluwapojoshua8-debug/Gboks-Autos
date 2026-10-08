import { BlogBody } from "@/components/blog/BlogBody";
import { TIPS } from "@/lib/tips";

export const metadata = {
  title: "Car Tips Blog",
  description: "Practical car care notes from GBOKS AUTOS technicians, written for Lagos driving conditions.",
};

// Step 8: static tips catalogue. Admin CMS (Step 9) can replace the source.
export default function BlogPage() {
  return <BlogBody tips={TIPS} />;
}
