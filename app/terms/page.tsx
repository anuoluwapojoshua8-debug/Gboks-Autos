import { BackLink } from "@/components/BackLink";
export const metadata = { title: "Terms of Service" };
export default function Page() {
  return (
    <section className="section-pad">
      <div className="container-x max-w-[68ch]">
        <p className="kicker">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Terms of service</h1>
        <div className="mt-4 space-y-3 leading-relaxed text-neutral-600 dark:text-neutral-300">
          <p>Every job starts with a written quote you approve. No work begins without your go-ahead on WhatsApp, phone, or in person.</p>
          <p>Payment is made locally at pickup, cash or bank transfer. Old parts are returned with every job unless you waive them.</p>
          <p>Workmanship follows a 12-month / 10,000 km guideline. Wear items (pads, filters, wipers) carry the part maker&apos;s warranty.</p>
        </div>
        <div className="mt-6"><BackLink href="/" label="Back to home" /></div>
      </div>
    </section>
  );
}
