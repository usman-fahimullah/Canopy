"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StageBadge } from "@/components/ui/stage-badge";
import { Spinner } from "@/components/ui/spinner";
import { X, ArrowRight, Star } from "@phosphor-icons/react";
import { useCandidateDetailQuery } from "@/hooks/queries";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface CandidateRef {
  seekerId: string;
  applicationId: string;
  jobId: string;
}

interface CandidateComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: CandidateRef[];
  /** Called when user wants to advance a specific candidate */
  onAdvance?: (seekerId: string, applicationId: string) => void;
  /** Called when user wants to reject a specific candidate */
  onReject?: (seekerId: string, applicationId: string) => void;
}

/* -------------------------------------------------------------------
   Sub-components
   ------------------------------------------------------------------- */

function ComparisonColumn({
  seekerId,
  onAdvance,
  onReject,
}: {
  seekerId: string;
  onAdvance?: () => void;
  onReject?: () => void;
}) {
  const { data, isLoading } = useCandidateDetailQuery(seekerId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  const candidate = data?.data as Record<string, unknown> | undefined;
  if (!candidate) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-caption text-[var(--foreground-muted)]">
        Candidate not found
      </div>
    );
  }

  const account = candidate.account as Record<string, unknown> | undefined;
  const name = (account?.name as string) ?? "Unknown";
  const email = (account?.email as string) ?? "";
  const avatar = account?.avatar as string | undefined;
  const headline = (candidate.headline as string) ?? "";
  const location = (account?.location as string) ?? "";

  // Applications
  const applications = (candidate.applications as Record<string, unknown>[]) ?? [];
  const activeApp = applications[0];
  const stage = (activeApp?.stage as string) ?? "applied";
  const matchScore = activeApp?.matchScore as number | null;

  // Scores
  const scores = (activeApp?.scores as Record<string, unknown>[]) ?? [];
  const avgRating =
    scores.length > 0
      ? scores.reduce((sum, s) => sum + ((s.overallRating as number) ?? 0), 0) / scores.length
      : null;

  // Skills
  const greenSkills = (candidate.greenSkills as string[]) ?? [];
  const certifications = (candidate.certifications as string[]) ?? [];

  return (
    <div className="flex flex-1 flex-col border-r border-[var(--border-default)] last:border-r-0">
      {/* Header */}
      <div className="border-b border-[var(--border-default)] p-4">
        <div className="flex items-center gap-3">
          <Avatar src={avatar} name={name} size="default" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-body-strong">{name}</h3>
            <p className="truncate text-caption text-[var(--foreground-muted)]">
              {headline || email}
            </p>
            {location && (
              <p className="text-caption-sm text-[var(--foreground-subtle)]">{location}</p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <StageBadge stage={stage}>
            {stage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </StageBadge>
        </div>
      </div>

      {/* Metrics */}
      <div className="border-b border-[var(--border-default)] p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Match Score */}
          <div>
            <p className="text-caption-sm text-[var(--foreground-subtle)]">Match Score</p>
            <p className="text-body-strong">
              {matchScore != null ? `${Math.round(matchScore)}%` : "—"}
            </p>
          </div>
          {/* Review Score */}
          <div>
            <p className="text-caption-sm text-[var(--foreground-subtle)]">Review Score</p>
            <div className="flex items-center gap-1">
              {avgRating != null ? (
                <>
                  <span className="text-body-strong">{avgRating.toFixed(1)}</span>
                  <Star size={14} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                  <span className="text-caption-sm text-[var(--foreground-muted)]">
                    ({scores.length} review{scores.length === 1 ? "" : "s"})
                  </span>
                </>
              ) : (
                <span className="text-body text-[var(--foreground-muted)]">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="flex-1 overflow-y-auto p-4">
        {greenSkills.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-caption-strong text-[var(--foreground-muted)]">Green Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {greenSkills.slice(0, 8).map((skill) => (
                <Badge key={skill} variant="success">
                  {skill}
                </Badge>
              ))}
              {greenSkills.length > 8 && <Badge variant="neutral">+{greenSkills.length - 8}</Badge>}
            </div>
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <p className="mb-2 text-caption-strong text-[var(--foreground-muted)]">
              Certifications
            </p>
            <div className="flex flex-wrap gap-1.5">
              {certifications.map((cert) => (
                <Badge key={cert} variant="info">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {greenSkills.length === 0 && certifications.length === 0 && (
          <p className="text-caption text-[var(--foreground-muted)]">
            No skills or certifications listed
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-[var(--border-default)] p-3">
        <div className="flex items-center gap-2">
          {onAdvance && (
            <Button variant="primary" size="sm" className="flex-1" onClick={onAdvance}>
              <ArrowRight size={16} />
              Advance
            </Button>
          )}
          {onReject && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onReject}>
              Reject
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export function CandidateComparisonSheet({
  open,
  onOpenChange,
  candidates,
  onAdvance,
  onReject,
}: CandidateComparisonSheetProps) {
  if (candidates.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-[900px] p-0 sm:max-w-[900px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
          <SheetTitle className="text-heading-sm">
            Compare Candidates ({candidates.length})
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Comparison columns */}
        <div className="flex h-[calc(100vh-73px)] overflow-hidden">
          {candidates.slice(0, 4).map((c) => (
            <ComparisonColumn
              key={c.seekerId}
              seekerId={c.seekerId}
              onAdvance={onAdvance ? () => onAdvance(c.seekerId, c.applicationId) : undefined}
              onReject={onReject ? () => onReject(c.seekerId, c.applicationId) : undefined}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
