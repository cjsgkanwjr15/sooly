import { SkeletonCardGrid } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl">
      <section className="border-b bg-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))] px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-14 w-1/3 animate-pulse rounded bg-muted sm:h-16" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </div>
      </section>
      <section className="border-t px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-7 w-1/3 animate-pulse rounded bg-muted" />
          <SkeletonCardGrid count={9} />
        </div>
      </section>
    </main>
  );
}
