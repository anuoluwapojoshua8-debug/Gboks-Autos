import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/constants";

// Fonts: system-native stacks only (no Google Fonts network fetch).
// --font-display and --font-serif are defined in globals.css :root.
// This avoids next/font "Failed to find font override values" errors
// offline and keeps 3G fast in Lagos. Protocol typefaces preserved
// via fallback order: Outfit-like geometric sans -> system, Newsreader-like
// editorial serif -> Georgia.

// SEO: local-business friendly metadata. Per-page titles extend this.
export const metadata: Metadata = {
  metadataBase: new URL("https://gboksautos.ng"),
  title: {
    default: "GBOKS AUTOS - Auto Repair & Servicing in Lagos",
    template: "%s | GBOKS AUTOS",
  },
  description:
    "GBOKS AUTOS: trusted auto repair, servicing, diagnostics, brakes, AC & more in Lagos, Nigeria. Book online, fair pricing, quality parts, quick turnaround.",
  keywords: ["auto repair Lagos", "car service Ikeja", "mechanic Lagos", "GBOKS AUTOS"],
  icons: { icon: "/logo.svg" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: SITE.name,
    title: "GBOKS AUTOS - Auto Repair & Servicing in Lagos",
    description: SITE.tagline,
    images: [{ url: "/images/og/workshop-og.jpg", width: 1200, height: 630, alt: "Cars parked at the GBOKS AUTOS workshop" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // LocalBusiness schema boosts local SEO (address/hours/phone).
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: SITE.name,
    description: SITE.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Allen Avenue, Ikeja",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    telephone: SITE.phone,
    email: SITE.email,
    openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-16:00"],
    priceRange: "₦₦",
  };

  return (
    <html lang="en-NG" suppressHydrationWarning>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-[#111111] focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
