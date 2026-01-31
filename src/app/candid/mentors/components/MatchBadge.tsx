"use client";

import { Badge } from "@/components/ui/badge";
import type { MatchQuality } from "./types";

const matchConfig: Record<MatchQuality, { label: string }> = {
  good_match: { label: "Good Match" },
  great_match: { label: "Great Match" },
};

export function MatchBadge({ quality }: { quality: MatchQuality }) {
  const config = matchConfig[quality];
  return (
    <Badge variant="success" size="sm">
      {config.label}
    </Badge>
  );
}
