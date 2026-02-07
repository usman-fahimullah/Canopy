import { Skeleton } from "@/components/ui/skeleton";

export default function CandidatesLoading() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Page header */}
      <Skeleton className="h-8 w-36" />

      {/* Search + filter toolbar */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-64 rounded-[var(--radius-input)]" />
        <Skeleton className="h-10 w-24 rounded-2xl" />
      </div>

      {/* Candidate cards */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-default)] px-4 py-5"
          >
            {/* Checkbox */}
            <Skeleton className="h-5 w-5 rounded" />
            {/* Avatar */}
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            {/* Name + role info */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            {/* Match score */}
            <Skeleton className="h-5 w-12 rounded" />
            {/* Stage badge */}
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
