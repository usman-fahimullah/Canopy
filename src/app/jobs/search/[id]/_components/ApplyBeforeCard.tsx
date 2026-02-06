"use client";

import { Card, CardContent, Badge } from "@/components/ui";
import { formatDateWithOrdinal, isClosingSoon } from "./helpers";

interface ApplyBeforeCardProps {
  closesAt: string | null;
}

export function ApplyBeforeCard({ closesAt }: ApplyBeforeCardProps) {
  return (
    <Card className="rounded-2xl border-[var(--border-muted)]">
      <CardContent className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-[var(--foreground-default)]">Apply Before:</span>
          <span className="text-body text-[var(--foreground-default)]">
            {formatDateWithOrdinal(closesAt)}
          </span>
        </div>
        {closesAt && isClosingSoon(closesAt) && (
          <Badge variant="warning" className="shrink-0">
            Closing Soon
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
