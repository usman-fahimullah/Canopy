import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Form cards */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3 pt-1">
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
          </div>
        </div>
      ))}

      {/* Third card shorter */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-64 rounded-[var(--radius-input)]" />
      </div>
    </div>
  );
}
