// Route-level loading skeleton: matches page shapes, not a generic spinner.
export default function Loading() {
  return (
    <section className="section-pad" aria-busy="true" aria-label="Loading">
      <div className="container-x space-y-4">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-flat space-y-3">
              <div className="skeleton h-11 w-11 !rounded-xl" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-10 w-full !rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
