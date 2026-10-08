import { BackLink } from "@/components/BackLink";

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-x max-w-xl text-left">
        <p className="kicker">Page not found</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          That bay is empty.
        </h1>
        <p className="mt-3 max-w-[52ch] leading-relaxed text-neutral-600 dark:text-neutral-400">
          The page you asked for moved or never existed. The workshop is still
          open, start from home or book directly.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href="/" className="btn-primary">Go home</a>
          <a href="/booking" className="link-more">Book appointment instead →</a>
        </div>
        <div className="mt-8">
          <BackLink href="/" label="Back to home" />
        </div>
      </div>
    </section>
  );
}
