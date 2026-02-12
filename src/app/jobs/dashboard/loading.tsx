import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="flex min-h-[108px] items-center border-b border-[var(--border-default)] px-4 py-5 sm:px-6 lg:px-12">
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Greeting + Quick Actions */}
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-12">
        <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-4 py-5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Job Matches */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-24 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-4 py-4 sm:gap-4 sm:px-6"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-24 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-4 py-4 sm:px-6"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
