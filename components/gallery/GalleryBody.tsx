"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { GalleryImage, GalleryTag } from "@/lib/gallery";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/home/Sections";
import { cn } from "@/lib/cn";

const FILTERS: { key: GalleryTag | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "workshop", label: "Workshop" },
  { key: "repairs", label: "Repairs" },
  { key: "team", label: "Team" },
];

// Bento gallery: lead frame spans two columns, hairline frames,
// desaturated photos, captions below. Click opens a quiet lightbox.
export function GalleryBody({ images, live }: { images: GalleryImage[]; live: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? images : images.filter((g) => g.tag === filter)),
    [images, filter]
  );

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, filtered.length]);

  return (
    <>
      <section>
        <div className="container-x max-w-5xl pb-8 pt-12 sm:pt-16">
          <p className="text-[13px] font-medium text-[#787774] dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-[#111111] dark:hover:text-white">Home</Link>
            <span aria-hidden className="mx-2 text-neutral-400">/</span> Gallery
          </p>
          <p className="tag tag-green mt-4">Inside the workshop</p>
          <h1 className="serif-display mt-3 max-w-[22ch] text-4xl text-[#111111] dark:text-white sm:text-5xl">
            Real bays, real cars, no stock shine.
          </h1>
          <p className="tnum mt-3 max-w-[56ch] leading-[1.6] text-[#787774] dark:text-neutral-400">
            {filtered.length} photos{live ? " from the workshop feed" : ", updated as jobs finish"}.
            Select any frame to view it large.
          </p>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter photos">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setOpen(null); }}
                aria-pressed={filter === f.key}
                className={cn(
                  "tnum rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                  filter === f.key
                    ? "bg-[#111111] text-white dark:bg-white dark:text-[#111111]"
                    : "border border-[#EAEAEA] bg-white text-[#2F3437] hover:bg-[#F9F9F8] dark:border-white/10 dark:bg-charcoal-900 dark:text-neutral-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad !pt-0" aria-label="Photo gallery">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g, i) => (
                <button
                  key={g.src + i}
                  onClick={() => setOpen(i)}
                  aria-label={`View: ${g.caption}`}
                  className={cn(
                    "card-hover group overflow-hidden rounded-xl border border-[#EAEAEA] bg-white text-left transition-all duration-200 dark:border-white/10 dark:bg-charcoal-900",
                    i === 0 && "sm:col-span-2"
                  )}
                >
                  <span className={cn("photo-warm relative block w-full overflow-hidden", i === 0 ? "aspect-[16/9]" : "aspect-[4/3]")}>
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      loading={i < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="photo-warm object-cover"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 border-t border-[#EAEAEA] px-4 py-2.5 dark:border-white/10">
                    <span className="truncate text-[13px] font-medium text-[#2F3437] dark:text-neutral-300">{g.caption}</span>
                    <span className={cn("tag shrink-0",
                      g.tag === "repairs" ? "tag-blue" : g.tag === "team" ? "tag-yellow" : "tag-green")}>{g.tag}</span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
          <p className="tnum mt-4 text-center text-xs text-[#787774] dark:text-neutral-500">
            Photos are of everyday jobs. Number plates are covered on request.
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {open !== null && filtered[open] && (
        <div role="dialog" aria-modal="true" aria-label={filtered[open].caption}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#111111]/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}>
          <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-white dark:bg-charcoal-900" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] w-full">
              <Image src={filtered[open].src} alt={filtered[open].alt} fill sizes="100vw" className="photo-warm object-cover" />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <p className="truncate text-sm font-medium text-[#111111] dark:text-white">
                {filtered[open].caption} <span className="tnum text-xs font-normal text-[#787774]">{open + 1} / {filtered.length}</span>
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button aria-label="Previous photo" onClick={() => setOpen((open - 1 + filtered.length) % filtered.length)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[#EAEAEA] transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10"><CaretLeft size={18} weight="bold" /></button>
                <button aria-label="Next photo" onClick={() => setOpen((open + 1) % filtered.length)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[#EAEAEA] transition hover:bg-[#F9F9F8] active:scale-[0.98] dark:border-white/10"><CaretRight size={18} weight="bold" /></button>
                <button aria-label="Close viewer" onClick={() => setOpen(null)}
                  className="grid h-10 w-10 place-items-center rounded-md bg-[#111111] text-white transition hover:bg-[#333333] active:scale-[0.98] dark:bg-white dark:text-[#111111]"><X size={18} weight="bold" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CtaBanner />
    </>
  );
}
