"use client";

import { ChatCircle } from "@phosphor-icons/react";
import { SITE } from "@/lib/constants";

// Floating WhatsApp button, visible on every page, mobile-first.
export function WhatsAppFloat() {
  return (
    <a
      href={SITE.whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with GBOKS AUTOS on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-xl bg-[#25D366] text-white transition duration-200 hover:scale-105 active:scale-95"
    >
      <ChatCircle size={26} weight="fill" />
    </a>
  );
}
