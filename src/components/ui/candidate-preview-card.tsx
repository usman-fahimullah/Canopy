"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye } from "@phosphor-icons/react";
import { type InterviewTimeSlot as TimeSlot } from "@/lib/scheduling";

export interface CandidatePreviewCardProps {
  selectedSlots: TimeSlot[];
  duration: number;
  className?: string;
}

const CandidatePreviewCard: React.FC<CandidatePreviewCardProps> = ({
  selectedSlots,
  duration,
  className,
}) => {
  if (selectedSlots.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--primitive-blue-200)] bg-[var(--primitive-blue-50)] p-3",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-[var(--primitive-blue-700)]">
        <Eye size={14} />
        <span>Candidate will see</span>
      </div>
      <p className="text-[12px] text-[var(--primitive-blue-600)]">
        {selectedSlots.length} time option{selectedSlots.length !== 1 ? "s" : ""} to choose from (
        {duration} min each). They&apos;ll pick their preferred slot and confirm.
      </p>
    </div>
  );
};

CandidatePreviewCard.displayName = "CandidatePreviewCard";

export { CandidatePreviewCard };
