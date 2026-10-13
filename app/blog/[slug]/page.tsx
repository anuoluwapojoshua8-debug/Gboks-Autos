import { notFound } from "next/navigation";
import { TipArticle } from "@/components/blog/TipArticle";
import { TIPS, getTip } from "@/lib/tips";

export function generateStaticParams() {
  return TIPS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tip = getTip(params.slug);
  return { title: tip ? tip.title : "Car tip" };
}

// Server shell: metadata + lookup. Markup with icons lives in the
// TipArticle client island (Phosphor breaks static prerender in RSC).
export default function TipPage({ params }: { params: { slug: string } }) {
  const tip = getTip(params.slug);
  if (!tip) notFound();
  const idx = TIPS.findIndex((t) => t.slug === tip.slug);
  return <TipArticle tip={tip} prev={TIPS[idx - 1]} next={TIPS[idx + 1]} />;
}
