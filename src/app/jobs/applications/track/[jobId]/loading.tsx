import { Skeleton } from "@/components/ui/skeleton";

export default function TrackedJobLoading() {
  return (
    <div className="flex h-full flex-col bg-[var(--background-default)]">
      {/* Nav bar skeleton */}
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-[250px]" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-[80px] rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Profile header */}
          <div className="mb-8 flex items-start gap-[22px]">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-[300px]" />
              <Skeleton className="h-5 w-[180px]" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-4">
            <Skeleton className="h-9 w-[80px] rounded-lg" />
            <Skeleton className="h-9 w-[120px] rounded-lg" />
          </div>

          {/* Editor skeleton */}
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </main>

        {/* Sidebar skeleton */}
        <aside className="hidden w-[320px] shrink-0 border-l border-[var(--border-muted)] p-6 lg:block">
          <div className="space-y-8">
            {/* Reaction section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-[80px]" />
              <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>

            <div className="h-px bg-[var(--border-muted)]" />

            {/* Migrate to section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-[100px]" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>

            <div className="h-px bg-[var(--border-muted)]" />

            {/* Overview section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-[80px]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
