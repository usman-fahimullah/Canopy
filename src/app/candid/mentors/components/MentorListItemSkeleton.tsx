"use client";

import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";

export function MentorListItemSkeleton() {
  return (
    <div className="px-5 py-4 border-l-2 border-l-transparent">
      <div className="flex items-start gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" animation="shimmer" />
            <Skeleton className="h-5 w-20 rounded-full" animation="shimmer" />
          </div>
          <Skeleton className="h-3 w-40" animation="shimmer" />
          <Skeleton className="h-3 w-44" animation="shimmer" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-24" animation="shimmer" />
            <Skeleton className="h-3 w-10" animation="shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
