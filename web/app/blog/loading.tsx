export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-14 space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-muted sm:h-12" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 border-b pb-8">
            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
