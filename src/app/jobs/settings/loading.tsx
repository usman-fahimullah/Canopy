import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="flex min-h-[108px] items-center border-b border-[var(--border-default)] px-4 py-5 sm:px-6 lg:px-12">
        <Skeleton className="h-8 w-28" />
      </div>

      {/* Settings layout */}
      <div className="flex flex-col px-4 py-6 sm:px-6 lg:flex-row lg:px-12">
        {/* Sidebar skeleton */}
        <div className="mb-6 flex gap-2 lg:mb-0 lg:w-64 lg:shrink-0 lg:flex-col lg:gap-1 lg:pr-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg lg:w-full" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 space-y-8">
          {/* Avatar + name section */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>

          {/* Save button */}
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
