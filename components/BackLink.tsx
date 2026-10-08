"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

// Every sub-page gets a way back, no dead ends.
export function BackLink({ href = "/", label = "Back" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="link-more"
    >
      <ArrowLeft size={15} weight="bold" /> {label}
    </Link>
  );
}
