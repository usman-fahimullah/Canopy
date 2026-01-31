"use client";

import { Heart, LinkSimple, ChatCircleDots } from "@phosphor-icons/react";
import type { MatchReason, MatchReasonType } from "./types";

const reasonConfig: Record<
  MatchReasonType,
  {
    label: string;
    icon: React.ReactNode;
    badgeBg: string;
    badgeText: string;
    iconColor: string;
  }
> = {
  shared_interest: {
    label: "Shared Interest",
    icon: <Heart size={14} weight="fill" />,
    badgeBg: "bg-[var(--primitive-red-100)]",
    badgeText: "text-[var(--primitive-red-600)]",
    iconColor: "text-[var(--primitive-red-500)]",
  },
  common_skill: {
    label: "Common Skill",
    icon: <LinkSimple size={14} weight="bold" />,
    badgeBg: "bg-[var(--primitive-green-100)]",
    badgeText: "text-[var(--primitive-green-600)]",
    iconColor: "text-[var(--primitive-green-600)]",
  },
  ask_about: {
    label: "Ask About",
    icon: <ChatCircleDots size={14} weight="fill" />,
    badgeBg: "bg-[var(--primitive-orange-100)]",
    badgeText: "text-[var(--primitive-orange-500)]",
    iconColor: "text-[var(--primitive-orange-500)]",
  },
};

export function MatchReasonCard({ reason }: { reason: MatchReason }) {
  const config = reasonConfig[reason.type];

  return (
    <div className="rounded-xl bg-[var(--primitive-neutral-100)] p-5">
      {/* Badge */}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium ${config.badgeBg} ${config.badgeText}`}
      >
        <span className={config.iconColor}>{config.icon}</span>
        {config.label}
      </span>

      {/* Description */}
      <p className="mt-3 text-body-sm text-foreground-default">
        {reason.description.split(reason.highlight).map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span className="font-semibold text-[var(--primitive-green-600)]">
                {reason.highlight}
              </span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
