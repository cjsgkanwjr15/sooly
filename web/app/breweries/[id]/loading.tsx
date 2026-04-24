import { SkeletonText } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-8 aspect-[16/9] animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 space-y-3">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-10">
        <SkeletonText lines={5} />
      </div>
    </main>
  );
}
