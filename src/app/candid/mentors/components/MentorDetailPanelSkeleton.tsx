"use client";

import { Skeleton, SkeletonAvatar, SkeletonText } from "@/components/ui/skeleton";

export function MentorDetailPanelSkeleton() {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Profile Header Skeleton */}
          <div className="flex items-start gap-5 mb-8">
            <Skeleton
              variant="circular"
              className="h-20 w-20 shrink-0"
              animation="shimmer"
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48" animation="shimmer" />
                <Skeleton
                  className="h-6 w-24 rounded-full"
                  animation="shimmer"
                />
              </div>
              <Skeleton className="h-4 w-64" animation="shimmer" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-24" animation="shimmer" />
                <Skeleton className="h-3 w-16" animation="shimmer" />
                <Skeleton className="h-3 w-20" animation="shimmer" />
              </div>
            </div>
          </div>

          {/* Why it's a fit Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-5 w-32 mb-4" animation="shimmer" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-xl"
                  animation="shimmer"
                />
              ))}
            </div>
          </div>

          {/* About Section Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-5 w-28 mb-4" animation="shimmer" />
            <SkeletonText lines={4} />
          </div>
        </div>
      </div>

      {/* Sticky CTA Skeleton */}
      <div className="px-6 pb-6 pt-2 bg-[var(--background-subtle)]">
        <div className="max-w-2xl mx-auto">
          <Skeleton
            className="h-14 w-full rounded-xl"
            animation="shimmer"
          />
        </div>
      </div>
    </div>
  );
}
