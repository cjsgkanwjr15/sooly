import { SkeletonText } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="flex flex-col gap-4">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted sm:h-12" />
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-6 grid grid-cols-4 gap-3 border-y py-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-10 animate-pulse rounded bg-muted" />
                <div className="h-6 w-14 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="mt-4 h-32 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
      <div className="mt-16">
        <SkeletonText lines={4} />
      </div>
    </main>
  );
}
