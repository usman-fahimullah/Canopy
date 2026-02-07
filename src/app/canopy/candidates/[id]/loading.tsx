import { Skeleton } from "@/components/ui/skeleton";

export default function CandidateDetailLoading() {
  return (
    <div className="flex h-[calc(100vh-0px)] flex-col bg-[var(--background-default)]">
      {/* Top nav skeleton */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main content (no right panel by default) */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {/* Header area */}
          <div className="bg-[var(--background-default)] px-8 pb-6 pt-8">
            <div className="mx-auto max-w-3xl">
              {/* Profile header — large square avatar + heading + subtitle */}
              <div className="flex items-start gap-5">
                <Skeleton className="h-24 w-24 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-10 w-64 rounded" />
                  <Skeleton className="h-5 w-80 rounded" />
                  <Skeleton className="mt-2 h-10 w-40 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Content sections on subtle background */}
          <div className="mx-auto max-w-3xl space-y-8 bg-[var(--background-subtle)] px-8 py-8">
            {/* Hiring stages card */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>

            {/* Documents card */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-28 rounded" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>

            {/* Contact info rows */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-28 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-3/4 rounded" />
              </div>
            </div>

            {/* About rows */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-16 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
