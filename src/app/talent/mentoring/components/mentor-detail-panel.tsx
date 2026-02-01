"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Briefcase,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import type { Mentor } from "./types";

interface MentorDetailPanelProps {
  mentor: Mentor;
  onClose: () => void;
}

function scoreVariant(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 50) return "warning" as const;
  return "error" as const;
}

export function MentorDetailPanel({ mentor, onClose }: MentorDetailPanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Mobile back button */}
      <div className="lg:hidden px-4 py-3 border-b border-[var(--primitive-neutral-200)]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-body-sm font-medium text-[var(--primitive-green-800)] transition-colors hover:text-[var(--primitive-green-700)]"
        >
          <ArrowLeft size={20} weight="bold" />
          Back to list
        </button>
      </div>

      <div className="p-6">
        {/* Header: Avatar, name, role, headline */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-[var(--primitive-neutral-200)]">
          <Avatar
            src={mentor.avatar ?? undefined}
            name={mentor.name}
            size="xl"
            className="mb-4 h-20 w-20"
          />
          <h2 className="text-heading-sm font-semibold text-[var(--primitive-green-800)]">
            {mentor.name}
          </h2>
          <p className="mt-1 text-body-sm text-[var(--primitive-neutral-600)]">
            {mentor.role} at {mentor.company}
          </p>
          <p className="mt-2 text-caption text-[var(--primitive-neutral-500)] max-w-sm">
            {mentor.headline}
          </p>
        </div>

        {/* Match Score section */}
        <div className="py-6 border-b border-[var(--primitive-neutral-200)]">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-body-sm font-semibold text-[var(--primitive-green-800)]">
              Match Score
            </h3>
            <Badge variant={scoreVariant(mentor.matchScore)} size="default">
              {mentor.matchScore}%
            </Badge>
          </div>

          {/* Match reasons */}
          <div className="space-y-3">
            {mentor.matchReasons.map((reason) => (
              <div key={reason.label} className="flex items-start gap-2.5">
                <CheckCircle
                  size={18}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--primitive-green-500)]"
                />
                <div>
                  <p className="text-caption font-medium text-[var(--foreground-default)]">
                    {reason.label}
                  </p>
                  <p className="text-caption text-[var(--primitive-neutral-600)]">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About section */}
        <div className="py-6 border-b border-[var(--primitive-neutral-200)]">
          <h3 className="text-body-sm font-semibold text-[var(--primitive-green-800)] mb-3">
            About
          </h3>
          <p className="text-caption text-[var(--foreground-muted)] leading-relaxed">
            {mentor.bio}
          </p>
        </div>

        {/* Specialties */}
        <div className="py-6 border-b border-[var(--primitive-neutral-200)]">
          <h3 className="text-body-sm font-semibold text-[var(--primitive-green-800)] mb-3">
            Specialties
          </h3>
          <div className="flex flex-wrap gap-2">
            {mentor.specialties.map((specialty) => (
              <Badge key={specialty} variant="neutral" size="default">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="py-6 border-b border-[var(--primitive-neutral-200)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
            <Briefcase size={18} weight="regular" />
            <span className="text-caption">
              {mentor.yearsExperience} years experience
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="pt-6">
          <Button
            variant="primary"
            className="w-full lg:w-auto"
            leftIcon={<PaperPlaneTilt size={18} weight="fill" />}
          >
            Send Introduction
          </Button>
        </div>
      </div>
    </div>
  );
}
