import { Skeleton } from "@/components/ui/skeleton";

export default function TalentLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="flex min-h-[108px] items-center border-b border-[var(--border-default)] px-4 py-5 sm:px-6 lg:px-12">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Content skeleton */}
      <div className="px-4 py-6 sm:px-6 lg:px-12">
        <div className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
