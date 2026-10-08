"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Scroll entry: quiet 12px fade over 600ms. Fires once via
// IntersectionObserver, never window scroll listeners. Collapses to static
// under reduced motion. Stagger parents via the delay prop in 80ms steps.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 will-change-transform",
        className
      )}
    >
      {children}
    </div>
  );
}
