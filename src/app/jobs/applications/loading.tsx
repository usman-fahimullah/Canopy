import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-5 sm:px-6 lg:px-12">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Tracker skeleton */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="flex flex-col divide-y divide-[var(--border-muted)]">
          {["Saved", "Applied", "Interview"].map((section) => (
            <div key={section} className="py-4">
              {/* Section header */}
              <div className="flex items-center gap-3 py-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              {/* Table rows */}
              <div className="mt-2 space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl px-4 py-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
