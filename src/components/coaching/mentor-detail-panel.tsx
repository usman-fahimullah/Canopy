"use client";

import { ArrowLeft, Star, Users, MapPin, ChatCircleDots } from "@phosphor-icons/react";
import { Avatar, Badge, Button, Chip } from "@/components/ui";
import type { Mentor, MatchReason } from "@/lib/coaching";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MentorDetailPanelProps {
  mentor: Mentor;
  /** Called when the user wants to initiate a conversation */
  onConnect?: (mentor: Mentor) => void;
  /** Called to go back (mobile) */
  onBack?: () => void;
  /** Show back button (typically on mobile) */
  showBack?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-component: Match Reason Card
// ---------------------------------------------------------------------------

function MatchReasonCard({ reason }: { reason: MatchReason }) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--background-subtle)] px-3 py-2">
      <p className="text-caption text-[var(--foreground-default)]">{reason.description}</p>
      {reason.highlight && (
        <p className="mt-0.5 text-caption-sm text-[var(--foreground-brand)]">{reason.highlight}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MentorDetailPanel({
  mentor,
  onConnect,
  onBack,
  showBack = false,
  className,
}: MentorDetailPanelProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="border-b border-[var(--border-muted)] p-5">
        {showBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-3">
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
        )}

        <div className="flex items-start gap-4">
          <Avatar size="xl" src={mentor.avatar ?? undefined} fallback={mentor.name.charAt(0)} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">
                {mentor.name}
              </h2>
              {mentor.matchQuality === "great_match" && (
                <Badge variant="success">Great Match</Badge>
              )}
              {mentor.matchQuality === "good_match" && <Badge variant="info">Good Match</Badge>}
            </div>

            {mentor.role && (
              <p className="mt-0.5 text-body-sm text-[var(--foreground-muted)]">
                {mentor.role}
                {mentor.company ? ` at ${mentor.company}` : ""}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-[var(--foreground-subtle)]">
              {mentor.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-[var(--foreground-warning)]" />
                  {mentor.rating.toFixed(1)}
                </span>
              )}
              {mentor.menteeCount > 0 && (
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {mentor.menteeCount} mentees
                </span>
              )}
              {mentor.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {mentor.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {onConnect && (
          <Button variant="primary" className="mt-4 w-full" onClick={() => onConnect(mentor)}>
            <ChatCircleDots size={18} className="mr-2" />
            Send Introduction
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Bio */}
        {mentor.bio && (
          <div className="mb-5">
            <h3 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
              About
            </h3>
            <p className="mt-1.5 text-body-sm text-[var(--foreground-muted)]">{mentor.bio}</p>
          </div>
        )}

        {/* Skills & Green Skills */}
        {(mentor.skills?.length > 0 || mentor.greenSkills?.length > 0) && (
          <div className="mb-5">
            <h3 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
              Expertise
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mentor.greenSkills?.map((skill) => (
                <Chip key={skill} variant="primary" size="sm">
                  {skill}
                </Chip>
              ))}
              {mentor.skills?.map((skill) => (
                <Chip key={skill} variant="neutral" size="sm">
                  {skill}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {mentor.mentorTopics?.length > 0 && (
          <div className="mb-5">
            <h3 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
              Can Help With
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mentor.mentorTopics.map((topic) => (
                <Chip key={topic} variant="neutral" size="sm">
                  {topic}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Match Reasons */}
        {mentor.matchReasons?.length > 0 && (
          <div>
            <h3 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
              Why You Match
            </h3>
            <div className="mt-2 space-y-2">
              {mentor.matchReasons.map((reason, i) => (
                <MatchReasonCard key={i} reason={reason} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
