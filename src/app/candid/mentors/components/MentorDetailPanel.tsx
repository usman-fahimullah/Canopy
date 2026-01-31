"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Briefcase,
  Users,
  ArrowLeft,
  ChatCircle,
  CraneTower,
  TextAlignLeft,
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
        <div className="px-12 py-6">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-0">
            <Avatar
              size="2xl"
              src={mentor.avatar || undefined}
              name={mentor.name}
              color="green"
              className="shrink-0 rounded-[24px] border border-[var(--primitive-neutral-200)] !rounded-[24px]"
              shape="square"
            />
            <div className="flex-1 min-w-0">
              {/* Name + Match Badge */}
              <div className="flex items-center gap-2 py-1 flex-wrap">
                <h1 className="text-[36px] font-medium leading-[48px] text-[var(--primitive-neutral-900)]">
                  {mentor.name}
                </h1>
                {mentor.matchQuality && (
                  <MatchBadge quality={mentor.matchQuality} />
                )}
              </div>

              {/* Role + Specialty Tag */}
              <div className="flex items-center gap-1 py-1 flex-wrap">
                <span className="text-body text-[var(--primitive-neutral-600)]">
                  {mentor.role}
                </span>
                {mentor.specialty && (
                  <>
                    <span className="text-[var(--primitive-neutral-500)]">&middot;</span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--primitive-neutral-200)] px-2 py-1">
                      <CraneTower
                        size={18}
                        className="text-[var(--primitive-neutral-800)]"
                      />
                      <span className="text-caption font-bold text-[var(--primitive-neutral-800)]">
                        {mentor.specialty}
                      </span>
                    </span>
                  </>
                )}
              </div>

              {/* Meta: Location, Experience, Mentees */}
              <div className="flex items-center gap-2 py-1 text-caption text-[var(--primitive-neutral-600)] flex-wrap">
                {mentor.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {mentor.location}
                  </span>
                )}
                {mentor.location && (mentor.experienceYears || mentor.menteeCount > 0) && (
                  <span className="text-[var(--primitive-neutral-500)]">&middot;</span>
                )}
                {mentor.experienceYears && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {mentor.experienceYears}+ yrs
                  </span>
                )}
                {mentor.experienceYears && mentor.menteeCount > 0 && (
                  <span className="text-[var(--primitive-neutral-500)]">&middot;</span>
                )}
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {mentor.menteeCount}{" "}
                  {mentor.menteeCount === 1 ? "mentee" : "mentees"}
                </span>
              </div>
            </div>
          </div>

          {/* Why it's a fit — or fallback "Can help with" */}
          <div className="mt-6">
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
          </div>

          {/* About Section */}
          {mentor.bio && (
            <section className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white overflow-hidden mb-6">
              <div className="flex items-center gap-2.5 px-6 pt-6 pb-3">
                <div className="rounded-lg bg-[var(--primitive-purple-200)] p-2">
                  <TextAlignLeft size={18} className="text-[var(--primitive-purple-600)]" />
                </div>
                <h2 className="text-body-strong font-bold text-[var(--primitive-neutral-800)]">
                  About {mentor.name.split(" ")[0]}
                </h2>
              </div>
              <div className="px-6 pb-6 pt-3">
                <div className="rounded-2xl bg-[var(--primitive-neutral-100)] p-6">
                  <p className="text-caption text-[var(--primitive-neutral-800)] leading-relaxed whitespace-pre-wrap">
                    {mentor.bio}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Green Skills — always visible per Figma */}
          {(mentor.greenSkills.length > 0 || mentor.skills.length > 0) && (
            <section className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white overflow-hidden mb-6">
              <div className="flex items-center gap-2.5 px-6 pt-4 pb-2">
                <div className="rounded-lg bg-[var(--primitive-green-200)] p-2">
                  <Tree size={18} className="text-[var(--primitive-green-700)]" />
                </div>
                <h2 className="text-body-strong font-bold text-[var(--primitive-neutral-800)]">
                  Green Skills
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {[...mentor.greenSkills, ...mentor.skills].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-lg bg-[var(--primitive-neutral-200)] px-2 py-1 text-caption text-[var(--primitive-neutral-800)]"
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
      <div className="shrink-0 border-t border-border-muted bg-white">
        <div className="px-12 py-6">
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
