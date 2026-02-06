import { Skeleton } from "@/components/ui/skeleton";

export default function CandidateDetailLoading() {
  return (
    <div className="flex h-screen flex-col bg-[var(--background-default)]">
      {/* Top nav skeleton */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Two-panel skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          {/* Profile header */}
          <div className="flex items-start gap-5">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48 rounded" />
              <Skeleton className="h-5 w-64 rounded" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>

          {/* Banner */}
          <Skeleton className="h-12 w-full rounded-lg" />

          {/* Hiring stages */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 rounded" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>

          {/* Resume */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-14 w-64 rounded-lg" />
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-28 rounded" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[380px] shrink-0 space-y-6 border-l border-[var(--border-muted)] p-6">
          <Skeleton className="h-6 w-40 rounded" />
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded" />
            ))}
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
