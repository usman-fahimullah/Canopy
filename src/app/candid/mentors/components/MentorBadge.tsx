"use client";

import { Badge } from "@/components/ui/badge";
import { Trophy, Lightning, Star } from "@phosphor-icons/react";
import type { MentorBadgeType } from "./types";

const badgeConfig: Record<
  MentorBadgeType,
  { label: string; variant: "warning" | "feature" | "success"; icon: React.ReactNode }
> = {
  top_mentor: {
    label: "Top mentor",
    variant: "warning",
    icon: <Trophy size={12} weight="fill" />,
  },
  quick_responder: {
    label: "Quick Responder",
    variant: "feature",
    icon: <Lightning size={12} weight="fill" />,
  },
  featured: {
    label: "Featured",
    variant: "success",
    icon: <Star size={12} weight="fill" />,
  },
};

export function MentorBadge({ type }: { type: MentorBadgeType }) {
  const config = badgeConfig[type];
  return (
    <Badge variant={config.variant} size="sm" icon={config.icon}>
      {config.label}
    </Badge>
  );
}
