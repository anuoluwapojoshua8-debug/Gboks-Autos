"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, Phone, Wrench } from "@phosphor-icons/react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/cn";

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  // Logo placeholder: swap SVG file in /public when final logo arrives.
  // Single-row brand: icon + stacked text, vertically centered, never wraps.
  return (
    <Link href="/" onClick={onNavigate} className="flex shrink-0 items-center gap-3" aria-label="GBOKS AUTOS home">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#111111] text-white dark:bg-white dark:text-[#111111]">
        <Wrench size={20} weight="bold" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block whitespace-nowrap font-display text-base font-bold tracking-tight text-[#111111] dark:text-white">GBOKS AUTOS</span>
        <span className="hidden truncate whitespace-nowrap text-xs font-medium text-[#787774] dark:text-neutral-400 xl:block">
          Lagos • Repair & Service
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  // Lock body scroll while the overlay menu is open; close on Escape.
  // Also close on route change so the menu never sticks after navigation.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  const isActive = (href: string) => path === href || (href !== "/" && path.startsWith(href));

  return (
    <>
      {/* Static info strip: scrolls away, never sticky */}
      <div className="bg-[#111111] text-white">
        <div className="container-x flex items-center justify-between gap-2 py-1.5 text-xs sm:text-[13px]">
          <p className="truncate">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#346538]" />
            Mon-Sat open • {SITE.payNote}
          </p>
          <a href={SITE.phoneHref} className="inline-flex shrink-0 items-center gap-1 font-medium transition-colors duration-200 hover:text-neutral-300">
            <Phone size={13} weight="bold" /> <span className="tnum">{SITE.phone}</span>
          </a>
        </div>
      </div>

      {/* Crisp floating bar: hairline border, subtle blur, 12px radius.
          Single-row desktop: brand left, links center, actions right.
          Widened to max-w-6xl so 7 links + brand + CTA never squeeze. */}
      <header className="sticky top-0 z-50">
        <div className="container-x">
          <nav
            aria-label="Main"
            className="mx-auto mt-4 flex h-16 w-full max-w-6xl items-center justify-between gap-6 rounded-xl border border-[#EAEAEA] bg-white/85 py-2 pl-4 pr-2 backdrop-blur dark:border-white/10 dark:bg-charcoal-950/85"
          >
            <Logo />
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive(l.href)
                      ? "bg-[#FBF3DB] text-[#956400] dark:bg-white/10 dark:text-amber-200/90"
                      : "text-[#2F3437] hover:bg-[#F7F6F3] dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <Link
                href="/booking"
                className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#333333] active:scale-[0.98] dark:bg-white dark:text-[#111111] dark:hover:bg-neutral-200 sm:inline-flex"
              >
                <CalendarCheck size={16} weight="bold" className="shrink-0" />
                Book appointment
              </Link>
              {/* Morphing hamburger: two lines rotate into an X */}
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-[#EAEAEA] transition-colors duration-200 hover:bg-[#F9F9F8] dark:border-white/10 dark:hover:bg-white/10 lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <span className="relative block h-3.5 w-5" aria-hidden>
                  <span className={cn(
                    "absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all duration-200 motion-reduce:transition-none",
                    open && "top-[6px] rotate-45"
                  )} />
                  <span className={cn(
                    "absolute left-0 top-[12px] h-[2px] w-5 rounded-full bg-current transition-all duration-200 motion-reduce:transition-none",
                    open && "top-[6px] -rotate-45"
                  )} />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Solid overlay menu with staggered reveal */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[70] bg-[#F7F6F3] transition-opacity duration-200 dark:bg-charcoal-950 motion-reduce:transition-none lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="container-x flex h-full flex-col overflow-y-auto pb-10 pt-24">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((l, idx) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                tabIndex={open ? 0 : -1}
                style={{ transitionDelay: open ? `${idx * 80}ms` : "0ms" }}
                className={cn(
                  "rounded-lg px-4 py-3 font-display text-2xl font-bold transition-all duration-200 motion-reduce:transition-none",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  isActive(l.href)
                    ? "bg-[#FBF3DB] text-[#956400] dark:bg-white/10 dark:text-amber-200/90"
                    : "text-[#111111] hover:bg-white dark:text-white dark:hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div
            style={{ transitionDelay: open ? `${NAV_LINKS.length * 80}ms` : "0ms" }}
            className={cn(
              "mt-6 flex flex-col gap-3 transition-all duration-200 motion-reduce:transition-none",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            <Link href="/booking" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="btn-primary w-full">
              <CalendarCheck size={19} weight="bold" /> Book an appointment
            </Link>
            <Link href="/emergency" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="btn-outline w-full">
              <Phone size={19} weight="bold" /> Emergency / roadside help
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
