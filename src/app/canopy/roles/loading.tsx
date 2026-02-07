import { Skeleton } from "@/components/ui/skeleton";

export default function RolesLoading() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Page header + action buttons */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-36 rounded-2xl" />
        </div>
      </div>

      {/* Templates section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] p-5"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-28 rounded-2xl" />
            </div>
          ))}
          {/* Dashed create card */}
          <div className="flex items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed border-[var(--border-default)] p-5">
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </div>

      {/* Open Roles section */}
      <div className="space-y-4 rounded-[var(--radius-card)] bg-[var(--background-subtle)] p-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>

        {/* Data table skeleton */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--background-default)]">
          {/* Table header */}
          <div className="flex gap-4 border-b border-[var(--border-default)] px-4 py-3">
            <Skeleton className="h-4 w-32 flex-[2]" />
            <Skeleton className="h-4 w-20 flex-1" />
            <Skeleton className="h-4 w-24 flex-1" />
            <Skeleton className="h-4 w-20 flex-1" />
            <Skeleton className="h-4 w-16 flex-1" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-[var(--border-muted)] px-4 py-4 last:border-0"
            >
              <Skeleton className="h-4 w-48 flex-[2]" />
              <Skeleton className="h-4 w-20 flex-1" />
              <Skeleton className="h-4 w-28 flex-1" />
              <Skeleton className="h-5 w-24 flex-1 rounded-full" />
              <Skeleton className="h-4 w-8 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
