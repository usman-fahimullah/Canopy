"use client";

import { Star } from "@phosphor-icons/react";
import { MatchReasonCard } from "./MatchReasonCard";
import type { MatchReason } from "./types";

export function WhyItsFit({ reasons }: { reasons: MatchReason[] }) {
  if (reasons.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star
          size={20}
          weight="fill"
          className="text-[var(--primitive-yellow-500)]"
        />
        <h2 className="text-body-strong font-semibold text-foreground-default">
          Why it&apos;s a fit
        </h2>
      </div>
      <div className="space-y-3">
        {reasons.map((reason, i) => (
          <MatchReasonCard key={i} reason={reason} />
        ))}
      </div>
    </section>
  );
}
