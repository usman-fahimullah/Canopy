"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface SkeletonProps {
  className?: string;
}

// Base skeleton component
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-[var(--background-subtle)] via-[var(--background-muted)] to-[var(--background-subtle)]",
        "bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

// Mentor card skeleton
export function MentorCardSkeleton() {
  return (
    <Card variant="default">
      <CardContent className="p-5">
      <div className="flex gap-4">
        {/* Avatar skeleton */}
        <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Name */}
          <Skeleton className="h-5 w-36 mb-2" />
          {/* Role */}
          <Skeleton className="h-4 w-48 mb-1" />
          {/* Company */}
          <Skeleton className="h-4 w-32 mb-3" />
          {/* Rating */}
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Bio */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Sectors */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      </CardContent>
    </Card>
  );
}

// Session card skeleton
export function SessionCardSkeleton() {
  return (
    <Card variant="default">
      <CardContent className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="mt-4 flex gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="mt-4 flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      </CardContent>
    </Card>
  );
}

// Message thread skeleton
export function MessageThreadSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3">
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-32 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

// Stat card skeleton
export function StatCardSkeleton() {
  return (
    <Card variant="default">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Sessions */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid gap-4 md:grid-cols-2">
          <SessionCardSkeleton />
          <SessionCardSkeleton />
        </div>
      </div>
    </div>
  );
}

// Browse page skeleton
export function BrowseSkeleton() {
  return (
    <div>
      {/* Filters skeleton */}
      <Card variant="outlined" className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <Skeleton className="h-4 w-32 mb-6" />

      {/* Mentor cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MentorCardSkeleton />
        <MentorCardSkeleton />
        <MentorCardSkeleton />
        <MentorCardSkeleton />
        <MentorCardSkeleton />
        <MentorCardSkeleton />
      </div>
    </div>
  );
}

// Add shimmer keyframes to global styles
export const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
