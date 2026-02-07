import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Page header */}
      <Skeleton className="h-8 w-48" />

      {/* Greeting + quick actions */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-36 rounded-2xl" />
          <Skeleton className="h-10 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Stats row — 4 cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-[var(--radius-card)] border border-[var(--border-default)] p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Two-column layout: Active Roles + Recent Applications */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Roles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--border-default)] p-4"
              >
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--border-default)] p-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline chart */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="rounded-[var(--radius-card)] border border-[var(--border-default)] p-6">
          <div className="flex h-40 items-end gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <Skeleton
                  className="w-full rounded-t-md"
                  style={{ height: `${[80, 50, 35, 20, 15][i]}%` }}
                />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
