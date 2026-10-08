import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { TIPS, getTip } from "@/lib/tips";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return TIPS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tip = getTip(params.slug);
  return { title: tip ? tip.title : "Car tip" };
}

// Article: narrow serif column, generous line height, prev/next walk.
export default function TipPage({ params }: { params: { slug: string } }) {
  const tip = getTip(params.slug);
  if (!tip) notFound();
  const idx = TIPS.findIndex((t) => t.slug === tip.slug);
  const prev = TIPS[idx - 1];
  const next = TIPS[idx + 1];

  return (
    <>
      <article>
        <div className="container-x max-w-2xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span>
            <Link href="/blog" className="transition-colors hover:text-[#111111] dark:hover:text-white">Tips</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> {tip.tag}
          </p>
          <h1 className="serif-display mt-4 text-4xl text-[#111111] dark:text-white sm:text-5xl">{tip.title}</h1>
          <p className="tnum mt-3 text-sm text-[#787774] dark:text-neutral-400">{tip.minutes} min read • {tip.date} • GBOKS workshop notes</p>
        </div>
        <div className="section-pad !pt-0">
          <div className="container-x max-w-2xl">
            <Reveal>
              <div className="space-y-4">
                {tip.body.map((p, i) => (
                  <p key={i} className={cn("leading-[1.75] text-[#2F3437] dark:text-neutral-300", i === 0 ? "text-[17px]" : "text-[15px]")}>{p}</p>
                ))}
              </div>
              <div className="card-flat mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#2F3437] dark:text-neutral-300">Hearing this exact symptom? Diagnostics take 45–90 minutes.</p>
                <Link href="/booking?service=engine-diagnostics" className="link-more shrink-0">Book diagnostics <ArrowRight size={15} weight="bold" /></Link>
              </div>
              <nav aria-label="More tips" className="mt-6 grid gap-3 sm:grid-cols-2">
                {prev ? (
                  <Link href={`/blog/${prev.slug}`} className="card card-hover"><span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.05em] text-[#787774]"><ArrowLeft size={14} weight="bold" /> Previous</span><span className="mt-1 block font-display font-semibold text-[#111111] dark:text-white">{prev.title}</span></Link>
                ) : <span />}
                {next && (
                  <Link href={`/blog/${next.slug}`} className="card card-hover text-right"><span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-[0.05em] text-[#787774]">Next <ArrowRight size={14} weight="bold" /></span><span className="mt-1 block font-display font-semibold text-[#111111] dark:text-white">{next.title}</span></Link>
                )}
              </nav>
            </Reveal>
          </div>
        </div>
      </article>
      <CtaBanner />
    </>
  );
}
