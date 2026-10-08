"use client";

// Inline error state: plain language, recovery action. No alert(), no "Oops!".
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section-pad">
      <div className="container-x max-w-xl text-left">
        <p className="kicker">Something failed to load</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Connection failed. Please try again.</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Your booking was not affected. Reload this section, or call the workshop directly.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={reset} className="btn-primary">Try again</button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </div>
    </section>
  );
}
