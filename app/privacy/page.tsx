import { BackLink } from "@/components/BackLink";
export const metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <section className="section-pad">
      <div className="container-x max-w-[68ch]">
        <p className="kicker">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Privacy policy</h1>
        <div className="mt-4 space-y-3 leading-relaxed text-neutral-600 dark:text-neutral-300">
          <p>We collect only what a booking needs: your name, phone, car details and service notes. Photos you upload are used for diagnosis and quotes.</p>
          <p>We never sell your data. Records live in our secured database and are shared only with the technicians handling your car.</p>
          <p>To view or delete your record, message us on WhatsApp or email service@gboksautos.ng.</p>
        </div>
        <div className="mt-6"><BackLink href="/" label="Back to home" /></div>
      </div>
    </section>
  );
}
