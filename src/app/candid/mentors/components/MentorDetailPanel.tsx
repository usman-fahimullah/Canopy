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

          {/* Why it's a fit */}
          <WhyItsFit reasons={mentor.matchReasons} />

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
        </div>

        {/* Spacer for sticky CTA */}
        <div className="h-24" />
      </div>

      {/* Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-8 bg-gradient-to-t from-[var(--background-subtle)] to-transparent pointer-events-none" />
        <div className="bg-[var(--background-subtle)] px-6 pb-6 pt-2">
          <div className="max-w-2xl mx-auto">
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
    </div>
  );
}
