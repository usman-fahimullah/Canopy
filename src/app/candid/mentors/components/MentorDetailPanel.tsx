"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Briefcase,
  Users,
  ArrowLeft,
  ChatCircle,
  Crosshair,
  ClipboardText,
  BookOpen,
  Tree,
  Lightning,
} from "@phosphor-icons/react";
import { MatchBadge } from "./MatchBadge";
import { WhyItsFit } from "./WhyItsFit";
import type { Mentor } from "./types";

export function MentorDetailPanel({
  mentor,
  onSendIntro,
  sending,
  onBack,
}: {
  mentor: Mentor;
  onSendIntro: (mentorId: string) => void;
  sending: boolean;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col animate-fade-in" key={mentor.id}>
      {/* Mobile Back Button */}
      <div className="lg:hidden px-4 py-3 border-b border-border-default">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={18} className="mr-2" />
          Back to mentors
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Profile Header */}
          <div className="flex items-start gap-5 mb-8">
            <Avatar
              size="2xl"
              src={mentor.avatar || undefined}
              name={mentor.name}
              color="green"
              className="shrink-0 ring-4 ring-background-brand-subtle"
            />
            <div className="flex-1 min-w-0">
              {/* Name + Match Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-heading-md font-bold text-foreground-default">
                  {mentor.name}
                </h1>
                {mentor.matchQuality && (
                  <MatchBadge quality={mentor.matchQuality} />
                )}
              </div>

              {/* Role + Specialty */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-body text-foreground-muted">
                  {mentor.role}
                </span>
                {mentor.specialty && (
                  <>
                    <span className="text-foreground-subtle">&middot;</span>
                    <span className="inline-flex items-center gap-1 text-body font-medium text-foreground-muted">
                      <Crosshair
                        size={14}
                        weight="bold"
                        className="text-foreground-subtle"
                      />
                      {mentor.specialty}
                    </span>
                  </>
                )}
              </div>

              {/* Meta: Location, Experience, Mentees */}
              <div className="flex items-center gap-3 mt-2 text-caption text-foreground-muted flex-wrap">
                {mentor.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {mentor.location}
                  </span>
                )}
                {mentor.experienceYears && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {mentor.experienceYears}+ yrs
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {mentor.menteeCount}{" "}
                  {mentor.menteeCount === 1 ? "mentee" : "mentees"}
                </span>
              </div>
            </div>
          </div>

          {/* Why it's a fit — or fallback "Can help with" */}
          {mentor.matchReasons.length > 0 ? (
            <WhyItsFit reasons={mentor.matchReasons} />
          ) : mentor.mentorTopics.length > 0 ? (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightning
                  size={20}
                  weight="fill"
                  className="text-[var(--primitive-yellow-500)]"
                />
                <h2 className="text-body-strong font-semibold text-foreground-default">
                  Can help with
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primitive-green-100)] px-3 py-1.5 text-caption font-medium text-[var(--primitive-green-700)]"
                  >
                    <BookOpen size={14} />
                    {topic}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {/* About Section */}
          {mentor.bio && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardText
                  size={20}
                  weight="fill"
                  className="text-[var(--primitive-green-600)]"
                />
                <h2 className="text-body-strong font-semibold text-foreground-default">
                  About {mentor.name.split(" ")[0]}
                </h2>
              </div>
              <p className="text-body text-foreground-muted leading-relaxed whitespace-pre-wrap">
                {mentor.bio}
              </p>
            </section>
          )}

          {/* Green Skills — always visible per Figma */}
          {(mentor.greenSkills.length > 0 || mentor.skills.length > 0) && (
            <section className="mb-8 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 pt-4 pb-2">
                <div className="rounded-lg bg-[var(--primitive-green-200)] p-2">
                  <Tree size={18} weight="regular" className="text-[var(--primitive-green-700)]" />
                </div>
                <h2 className="text-body-strong font-bold text-foreground-default">
                  Green Skills
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {[...mentor.greenSkills, ...mentor.skills].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-lg bg-[var(--primitive-neutral-200)] px-2 py-1 text-caption text-foreground-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

      </div>

      {/* Sticky CTA */}
      <div className="shrink-0 border-t border-border-muted bg-[var(--background-subtle)]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-[var(--primitive-green-800)] hover:bg-[var(--primitive-green-700)] text-white rounded-xl h-14 text-body font-semibold"
            onClick={() => onSendIntro(mentor.accountId)}
            loading={sending}
          >
            <ChatCircle size={18} weight="fill" className="mr-2" />
            Send intro message
          </Button>
        </div>
      </div>
    </div>
  );
}
