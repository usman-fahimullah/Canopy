"use client";

import { Avatar, Button, TruncateText } from "@/components/ui";
import type { Recruiter } from "./types";

interface RecruiterCardProps {
  recruiter: Recruiter | null;
  label?: string;
}

export function RecruiterCard({ recruiter, label = "Recruiter" }: RecruiterCardProps) {
  if (!recruiter) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-6 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar size="lg" src={recruiter.avatar ?? undefined} name={recruiter.name} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TruncateText className="text-body font-medium text-[var(--foreground-default)]">
            {recruiter.name}
          </TruncateText>
          {recruiter.title && (
            <TruncateText className="text-sm text-[var(--foreground-subtle)]">
              {recruiter.title}
            </TruncateText>
          )}
        </div>
      </div>
      <Button variant="tertiary" className="w-full">
        Contact ({label})
      </Button>
    </div>
  );
}
