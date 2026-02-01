"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "@phosphor-icons/react";

interface CourseCardProps {
  title: string;
  provider: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
}

const difficultyVariant = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
} as const;

export function CourseCard({
  title,
  provider,
  duration,
  difficulty,
  progress,
}: CourseCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-5 transition-shadow hover:shadow-card">
      {/* Difficulty badge */}
      <div>
        <Badge variant={difficultyVariant[difficulty]} size="sm">
          {difficulty}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-body font-semibold text-[var(--primitive-green-800)]">
        {title}
      </h3>

      {/* Provider */}
      <p className="text-caption text-[var(--primitive-neutral-600)]">
        {provider}
      </p>

      {/* Bottom row */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-caption text-[var(--primitive-neutral-600)]">
          <Clock size={16} weight="regular" />
          <span>{duration}</span>
        </div>

        {progress > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--primitive-neutral-200)]">
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
