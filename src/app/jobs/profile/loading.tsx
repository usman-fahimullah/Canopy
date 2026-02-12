import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div>
      {/* Cover image skeleton */}
      <div className="relative h-[200px] sm:h-[240px] lg:h-[280px]">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Profile header skeleton (overlapping cover) */}
      <div className="relative -mt-16 px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <Skeleton className="h-28 w-28 rounded-full border-4 border-[var(--background-default)] sm:h-32 sm:w-32" />
          <div className="flex-1 space-y-2 pb-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-2xl" />
            <Skeleton className="h-10 w-10 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Bio skeleton */}
      <div className="mt-6 px-4 sm:px-6 lg:px-12">
        <Skeleton className="mb-2 h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-3/4 max-w-md" />
      </div>

      {/* Skills skeleton */}
      <div className="mt-6 px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Sections skeleton */}
      <div className="mt-8 space-y-6 px-4 pb-8 sm:px-6 lg:px-12">
        {["Goals", "Experience", "Files"].map((section) => (
          <div
            key={section}
            className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
