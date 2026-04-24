import { SkeletonCardGrid, SkeletonHeader } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SkeletonHeader />
      <div className="mt-4 h-8 w-full animate-pulse rounded bg-muted" />
      <div className="mt-6">
        <SkeletonCardGrid count={12} />
      </div>
    </main>
  );
}
