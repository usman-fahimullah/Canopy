"use client";

import { Badge } from "@/components/ui/badge";

interface PathwayCardProps {
  title: string;
  description: string;
  courseCount: number;
  progress: number;
  icon: string;
}

export function PathwayCard({
  title,
  description,
  courseCount,
  progress,
  icon,
}: PathwayCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-6 transition-shadow hover:shadow-card">
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primitive-green-100)]">
        <span className="text-xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--primitive-green-800)]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-body-sm text-[var(--primitive-neutral-600)] line-clamp-2">
        {description}
      </p>

      {/* Bottom row */}
      <div className="mt-auto flex items-center gap-3">
        <Badge variant="neutral" size="sm">
          {courseCount} courses
        </Badge>

        {progress > 0 && (
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--primitive-neutral-200)]">
              <div
                className="h-full rounded-full bg-[var(--primitive-green-500)] transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-caption-sm text-[var(--primitive-neutral-600)]">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
