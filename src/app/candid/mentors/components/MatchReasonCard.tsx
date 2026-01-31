"use client";

import { Heart, Handshake, ChatCircleDots } from "@phosphor-icons/react";
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
    icon: <Heart size={18} weight="fill" />,
    badgeBg: "bg-[var(--primitive-red-100)]",
    badgeText: "text-[var(--primitive-red-600)]",
    iconColor: "text-[var(--primitive-red-600)]",
  },
  common_skill: {
    label: "Common Skill",
    icon: <Handshake size={18} weight="fill" />,
    badgeBg: "bg-[var(--primitive-green-100)]",
    badgeText: "text-[var(--primitive-green-600)]",
    iconColor: "text-[var(--primitive-green-600)]",
  },
  ask_about: {
    label: "Ask About",
    icon: <ChatCircleDots size={18} weight="fill" />,
    badgeBg: "bg-[var(--primitive-orange-100)]",
    badgeText: "text-[var(--primitive-orange-500)]",
    iconColor: "text-[var(--primitive-orange-500)]",
  },
};

export function MatchReasonCard({ reason }: { reason: MatchReason }) {
  const config = reasonConfig[reason.type];

  return (
    <div className="rounded-2xl bg-[var(--primitive-neutral-100)] p-6">
      {/* Badge */}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-caption font-bold ${config.badgeBg} ${config.badgeText}`}
      >
        <span className={config.iconColor}>{config.icon}</span>
        {config.label}
      </span>

      {/* Description */}
      <p className="mt-4 text-body text-[var(--primitive-green-800)]">
        {reason.description.split(reason.highlight).map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span className="font-bold text-[var(--primitive-blue-400)]">
                {reason.highlight}
              </span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
