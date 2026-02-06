"use client";

import { Card, CardContent, Avatar, Button } from "@/components/ui";
import type { Recruiter } from "./types";

interface RecruiterCardProps {
  recruiter: Recruiter | null;
}

export function RecruiterCard({ recruiter }: RecruiterCardProps) {
  if (!recruiter) return null;

  return (
    <Card className="rounded-2xl border-[var(--border-muted)]">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Avatar size="lg" src={recruiter.avatar ?? undefined} name={recruiter.name} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-body font-medium text-[var(--foreground-default)]">
              {recruiter.name}
            </span>
            {recruiter.title && (
              <span className="truncate text-sm text-[var(--foreground-subtle)]">
                {recruiter.title}
              </span>
            )}
          </div>
        </div>
        <Button variant="tertiary" className="w-full">
          Contact (Recruiter)
        </Button>
      </CardContent>
    </Card>
  );
}
