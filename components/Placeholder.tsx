import Link from "next/link";

// Shared placeholder so nav links don't 404 before their step lands.
// Each step replaces its file with the full implementation.
export function Placeholder({
  title,
  desc,
  next,
}: {
  title: string;
  desc: string;
  next?: string;
}) {
  return (
    <section className="section-pad">
      <div className="container-x max-w-2xl text-center">
        <p className="kicker">Coming in next step</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">{desc}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/booking" className="btn-primary">Book an Appointment</Link>
          <Link href="/" className="btn-outline">Back to Home</Link>
        </div>
        {next && <p className="mt-4 text-xs text-neutral-500">{next}</p>}
      </div>
    </section>
  );
}
