import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Page header */}
      <Skeleton className="h-8 w-24" />

      {/* Settings sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-[var(--radius-card)] border border-[var(--border-default)] p-6"
        >
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
            <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
