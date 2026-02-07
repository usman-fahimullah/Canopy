"use client";

import React, { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { X } from "@phosphor-icons/react";

interface CandidateData {
  id: string;
  account: {
    name: string;
    avatar: string | null;
    email: string;
  };
  applications: Array<{
    id: string;
    matchScore: number | null;
    createdAt: string;
    job: {
      id: string;
      title: string;
    };
    scores: Array<{
      id: string;
      overallRating: number;
    }>;
  }>;
  skills: string[];
  yearsExperience: number | null;
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
}

interface CandidateComparisonSheetProps {
  candidateIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateComparisonSheet({
  candidateIds,
  open,
  onOpenChange,
}: CandidateComparisonSheetProps) {
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || candidateIds.length === 0) {
      return;
    }

    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const candidateDataPromises = candidateIds.map((id) =>
          fetch(`/api/canopy/candidates/${id}`)
            .then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch candidate ${id}`);
              return res.json();
            })
            .then((data) => data.data as CandidateData)
        );

        const data = await Promise.all(candidateDataPromises);
        setCandidates(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        logger.error("Failed to fetch candidates for comparison", {
          error: message,
          candidateCount: candidateIds.length,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [candidateIds, open]);

  const getHighestScore = (scores: number[]): number => {
    return Math.max(...scores.filter((s) => s > 0), 0);
  };

  const getAverageScore = (candidates: CandidateData[], index: number): number => {
    const scores = candidates[index]?.applications
      .flatMap((app) => app.scores.map((s) => s.overallRating))
      .filter((s) => s > 0) || [];
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  };

  const getHighestMatchScore = (matchScores: (number | null)[]): number => {
    const validScores = matchScores
      .filter((m): m is number => m !== null && m > 0);
    return validScores.length > 0 ? Math.max(...validScores) : 0;
  };

  const getHighestExperience = (experiences: (number | null)[]): number => {
    const validExperiences = experiences
      .filter((e): e is number => e !== null && e > 0);
    return validExperiences.length > 0 ? Math.max(...validExperiences) : 0;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-4xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Compare Candidates</SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-border-error bg-background-error/5 p-4">
            <p className="text-body text-foreground-error mb-4">Failed to load candidates</p>
            <p className="text-caption text-foreground-muted">{error}</p>
          </div>
        )}

        {!isLoading && !error && candidates.length > 0 && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Candidate columns header */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
              {candidates.map((candidate) => (
                <div key={candidate.id} className="text-center">
                  <div className="mb-3 flex justify-center">
                    <Avatar
                      src={candidate.account.avatar || undefined}
                      name={candidate.account.name}
                      size="lg"
                    />
                  </div>
                  <h3 className="text-heading-sm font-semibold text-foreground-default">
                    {candidate.account.name}
                  </h3>
                  <p className="text-caption text-foreground-muted">{candidate.account.email}</p>
                </div>
              ))}
            </div>

            {/* Match Score Comparison */}
            <div className="border-t border-border-muted pt-6">
              <h4 className="text-caption-strong font-semibold text-foreground-default mb-4">
                Match Score
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
                {candidates.map((candidate, idx) => {
                  const matchScores = candidate.applications.map((app) => app.matchScore);
                  const highest = getHighestMatchScore(matchScores);
                  const currentScore = matchScores[0] || 0;
                  const isHighest = currentScore === highest && highest > 0;

                  return (
                    <div key={candidate.id} className={isHighest ? "ring-2 ring-[var(--primitive-green-400)] rounded-lg p-4" : ""}>
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-heading-sm font-bold text-foreground-brand">
                          {currentScore || 0}%
                        </span>
                        {isHighest && (
                          <Badge variant="success" className="text-xs">
                            Highest
                          </Badge>
                        )}
                      </div>
                      <Progress value={currentScore || 0} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Applied Role & Date */}
            <div className="border-t border-border-muted pt-6">
              <h4 className="text-caption-strong font-semibold text-foreground-default mb-4">
                Applied Role
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
                {candidates.map((candidate) => {
                  const application = candidate.applications[0];
                  return (
                    <div key={candidate.id} className="space-y-2">
                      <p className="text-body font-semibold text-foreground-default">
                        {application?.job?.title || "N/A"}
                      </p>
                      <p className="text-caption text-foreground-muted">
                        {application?.createdAt
                          ? new Date(application.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evaluation Scores */}
            <div className="border-t border-border-muted pt-6">
              <h4 className="text-caption-strong font-semibold text-foreground-default mb-4">
                Evaluation Score
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
                {candidates.map((candidate, idx) => {
                  const avgScore = getAverageScore(candidates, idx);
                  const allScores = candidates.map((c) => getAverageScore(candidates, candidates.indexOf(c)));
                  const highest = Math.max(...allScores);
                  const isHighest = avgScore === highest && highest > 0;

                  return (
                    <div key={candidate.id} className={isHighest ? "ring-2 ring-[var(--primitive-green-400)] rounded-lg p-4" : ""}>
                      <div className="flex items-end justify-between">
                        <span className="text-heading-sm font-bold text-foreground-brand">
                          {avgScore}/5
                        </span>
                        {isHighest && (
                          <Badge variant="success" className="text-xs">
                            Highest
                          </Badge>
                        )}
                      </div>
                      {candidate.applications[0]?.scores.length === 0 && (
                        <p className="text-caption text-foreground-muted mt-2">No scores yet</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experience */}
            <div className="border-t border-border-muted pt-6">
              <h4 className="text-caption-strong font-semibold text-foreground-default mb-4">
                Years of Experience
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
                {candidates.map((candidate) => {
                  const experiences = candidates.map((c) => c.yearsExperience);
                  const highest = getHighestExperience(experiences);
                  const isHighest = candidate.yearsExperience === highest && highest > 0;

                  return (
                    <div key={candidate.id} className={isHighest ? "ring-2 ring-[var(--primitive-green-400)] rounded-lg p-4" : ""}>
                      <div className="flex items-end justify-between">
                        <span className="text-heading-sm font-bold text-foreground-default">
                          {candidate.yearsExperience || "N/A"}
                        </span>
                        {isHighest && (
                          <Badge variant="success" className="text-xs">
                            Highest
                          </Badge>
                        )}
                      </div>
                      {candidate.yearsExperience && (
                        <p className="text-caption text-foreground-muted mt-1">years</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div className="border-t border-border-muted pt-6">
              <h4 className="text-caption-strong font-semibold text-foreground-default mb-4">
                Skills
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="space-y-2">
                    {candidate.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 5).map((skill) => (
                          <Chip key={skill} variant="neutral" size="sm">{skill}</Chip>
                        ))}
                        {candidate.skills.length > 5 && (
                          <Badge variant="neutral" className="text-xs">
                            +{candidate.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-caption text-foreground-muted">No skills listed</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Summary */}
            <div className="border-t border-border-muted pt-6">
              <h4 className="text-caption-strong font-semibold text-foreground-default mb-4">
                Notes
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="space-y-2">
                    {candidate.notes.length > 0 ? (
                      <>
                        <p className="text-caption-strong text-foreground-default">
                          {candidate.notes.length} note{candidate.notes.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-caption text-foreground-muted line-clamp-3">
                          {candidate.notes[0]?.content}
                        </p>
                      </>
                    ) : (
                      <p className="text-caption text-foreground-muted">No notes</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && candidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body text-foreground-muted">No candidates to compare</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
