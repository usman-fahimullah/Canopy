"use client";

import { CandidSymbol } from "@/app/candid/components/CandidSymbol";
import { MatchReasonCard } from "./MatchReasonCard";
import type { MatchReason } from "./types";

export function WhyItsFit({ reasons }: { reasons: MatchReason[] }) {
  if (reasons.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] overflow-hidden mb-6">
      <div className="flex items-center gap-3 px-6 pt-6 pb-3">
        <div className="flex items-center justify-center rounded-lg bg-[var(--primitive-blue-100)] p-2">
          <CandidSymbol size={18} color="var(--primitive-blue-600)" />
        </div>
        <h2 className="text-body-strong font-bold text-[var(--foreground-default)]">
          Why it&apos;s a fit
        </h2>
      </div>
      <div className="px-6 pb-6 pt-3 space-y-3">
        {reasons.map((reason, i) => (
          <MatchReasonCard key={i} reason={reason} />
        ))}
      </div>
    </section>
  );
}
