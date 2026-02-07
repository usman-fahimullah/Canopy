import { Skeleton } from "@/components/ui/skeleton";

export default function EmployerLoading() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Page header */}
      <Skeleton className="h-8 w-48" />

      {/* Content placeholder */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-[var(--radius-card)] border border-[var(--border-default)] p-4"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
