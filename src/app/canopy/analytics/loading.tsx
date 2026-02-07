import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Page header */}
      <Skeleton className="h-8 w-28" />

      {/* Stats row — 4 cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-[var(--radius-card)] border border-[var(--border-default)] p-4"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts — 2 column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] p-6"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table section */}
      <div className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
          <div className="flex gap-4 border-b border-[var(--border-default)] pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
