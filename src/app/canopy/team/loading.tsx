import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Page header + invite button */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-36 rounded-2xl" />
      </div>

      {/* Stats */}
      <Skeleton className="h-4 w-48" />

      {/* Search + filter */}
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-2xl" />
        <Skeleton className="h-12 w-[180px] rounded-lg" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-6 border-b border-[var(--border-default)] pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Table rows */}
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-[var(--border-default)] px-6 py-4 last:border-b-0"
          >
            <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            {/* Assigned Jobs column */}
            <div className="hidden gap-1.5 lg:flex">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
