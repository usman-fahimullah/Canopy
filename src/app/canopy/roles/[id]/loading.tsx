import { Skeleton } from "@/components/ui/skeleton";

export default function RoleDetailLoading() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background-default)]">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--background-default)] px-6 py-4">
        {/* Left: icon + title + status */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Center: tabs (desktop only) */}
        <div className="hidden lg:flex">
          <Skeleton className="h-10 w-96 rounded-2xl" />
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-2xl" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="border-b border-[var(--border-muted)] px-6 py-3 lg:hidden">
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-[var(--background-subtle)] p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Form section 1 */}
          <div className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--background-default)] p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
              <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
            </div>
          </div>

          {/* Form section 2 */}
          <div className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--background-default)] p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-40 w-full rounded-[var(--radius-input)]" />
          </div>

          {/* Form section 3 */}
          <div className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--background-default)] p-6">
            <Skeleton className="h-6 w-36" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
              <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
            </div>
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
