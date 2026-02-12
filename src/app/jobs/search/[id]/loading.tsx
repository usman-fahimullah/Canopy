import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function JobDetailLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="border-b border-[var(--border-muted)] px-4 py-6 sm:px-6 lg:px-12">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60 sm:w-80" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>
          <div className="hidden gap-3 sm:flex">
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-28 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-6 bg-[var(--background-subtle)] px-4 py-6 sm:px-6 lg:flex-row lg:px-12">
        {/* Left column */}
        <div className="flex-1">
          <SkeletonCard className="min-h-[600px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-6" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="mt-6" />
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </SkeletonCard>
        </div>

        {/* Right column */}
        <div className="w-full shrink-0 space-y-6 lg:w-[350px]">
          {/* Tabs skeleton */}
          <div className="flex gap-4 border-b border-[var(--border-muted)] pb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <SkeletonCard className="h-20" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-40" />
        </div>
      </div>
    </div>
  );
}
