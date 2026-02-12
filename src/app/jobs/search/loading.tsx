import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="flex min-h-[108px] items-center justify-between border-b border-[var(--border-default)] px-4 py-5 sm:px-6 lg:px-12">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Search bar skeleton */}
      <div className="border-b border-[var(--border-muted)] px-4 py-4 sm:px-6 lg:px-12">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>

      {/* Filter chips skeleton */}
      <div className="border-b border-[var(--border-muted)] px-4 py-3 sm:px-6 lg:px-12">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      </div>

      {/* Collections section skeleton */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[180px] w-[280px] shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Job grid skeleton */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] p-4"
            >
              <Skeleton className="mb-3 h-[140px] w-full rounded-xl" />
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
