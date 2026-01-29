"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getUserById, getSessionsForUser } from "@/lib/candid";
import { SECTOR_INFO } from "@/lib/candid/types";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import type { Coach, LightMentor, TimeSlot } from "@/lib/candid/types";
import {
  ArrowLeft,
  Star,
  MapPin,
  CalendarBlank,
  ChatCircle,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Lightning,
  LinkedinLogo,
  Users,
} from "@phosphor-icons/react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const user = getUserById(userId);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
        <div className="rounded-card bg-white p-12 shadow-card text-center">
          <h2 className="text-heading-sm font-semibold text-foreground-default">
            Profile not found
          </h2>
          <p className="mt-2 text-body text-foreground-muted">
            The mentor you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" className="mt-4" leftIcon={<ArrowLeft size={16} />} asChild>
            <Link href="/candid/browse">
              Back to Browse
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCoach = user.role === "coach";
  const isLightMentor = user.role === "light-mentor";
  const mentor = user as Coach | LightMentor;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Back Link */}
      <Button variant="ghost" size="sm" className="mb-6" leftIcon={<ArrowLeft size={16} />} asChild>
        <Link href="/candid/browse">
          Back to Browse
        </Link>
      </Button>

      {/* Profile Card - White card with shadow */}
      <div className="rounded-card bg-white shadow-card overflow-hidden">
        {/* Header with solid Green 800 background */}
        <div className="relative h-32 bg-[var(--primitive-green-800)]">
          {isCoach && (mentor as Coach).isFeatured && (
            <Chip variant="yellow" size="sm" className="absolute right-4 top-4">
              <Lightning size={14} weight="fill" className="mr-1" />
              Featured Coach
            </Chip>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <Avatar
              size="xl"
              src={mentor.avatar}
              name={`${mentor.firstName} ${mentor.lastName}`}
              color="green"
              className="h-32 w-32 border-4 border-white shadow-lg"
            />
            {mentor.isFoundingMember && (
              <Chip variant="blue" size="sm" className="absolute -right-2 bottom-2 shadow-sm">
                Founding Mentor
              </Chip>
            )}
          </div>

          {/* Name & Role */}
          <div className="mb-6">
            <h1 className="text-heading-md font-semibold text-foreground-default">
              {mentor.firstName} {mentor.lastName}
            </h1>
            <p className="text-body-lg text-foreground-muted">
              {mentor.currentRole} at {mentor.currentCompany}
            </p>

            {/* Rating & Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {mentor.rating && (
                <div className="flex items-center gap-1.5">
                  <Star size={16} weight="fill" className="text-[#F59E0B]" />
                  <span className="text-body font-medium">{mentor.rating.toFixed(1)}</span>
                  <span className="text-caption text-foreground-muted">
                    ({mentor.reviewCount} reviews)
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-caption text-foreground-muted">
                <CheckCircle size={16} weight="fill" className="text-[var(--primitive-green-600)]" />
                <span>{mentor.menteeCount} mentees</span>
              </div>
              {isCoach && (mentor as Coach).successStories && (
                <div className="flex items-center gap-1.5 text-caption text-foreground-muted">
                  <GraduationCap size={16} />
                  <span>{(mentor as Coach).successStories} success stories</span>
                </div>
              )}
              {mentor.location && (
                <div className="flex items-center gap-1.5 text-caption text-foreground-muted">
                  <MapPin size={16} />
                  <span>{mentor.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-3 flex items-center gap-2">
              {mentor.linkedIn && (
                <a
                  href={mentor.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-foreground-muted hover:bg-[var(--background-subtle)] hover:text-[#0077b5]"
                >
                  <LinkedinLogo size={20} weight="fill" />
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Button variant="primary" leftIcon={<CalendarBlank size={18} />} asChild>
              <Link href={`/candid/sessions/schedule?mentor=${mentor.id}`}>
                Schedule Session
              </Link>
            </Button>
            <Button variant="secondary" leftIcon={<ChatCircle size={18} />} asChild>
              <Link href={`/candid/messages?new=${mentor.id}`}>
                Send Message
              </Link>
            </Button>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="mb-2 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
              About
            </h2>
            <p className="text-body text-foreground-default leading-relaxed">{mentor.bio}</p>
          </div>

          {/* Sectors */}
          <div className="mb-6">
            <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
              Sectors
            </h2>
            <div className="flex flex-wrap gap-2">
              {mentor.sectors.map((sector) => (
                <Chip key={sector} variant="blue" size="sm">
                  {SECTOR_INFO[sector].label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
              Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill) => (
                <Chip key={skill} variant="neutral" size="sm">
                  {skill}
                </Chip>
              ))}
            </div>
          </div>

          {/* Previous Roles (Coaches only) */}
          {isCoach && (mentor as Coach).previousRoles.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Experience
              </h2>
              <div className="space-y-3">
                {(mentor as Coach).previousRoles.map((role, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                      <Briefcase size={18} className="text-foreground-muted" />
                    </div>
                    <div>
                      <p className="text-body-strong font-medium text-foreground-default">{role.title}</p>
                      <p className="text-caption text-foreground-muted">
                        {role.company} • {role.years} years
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available For (Light Mentors) */}
          {isLightMentor && (
            <div className="mb-6">
              <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Available For
              </h2>
              <div className="flex flex-wrap gap-2">
                {(mentor as LightMentor).availableFor.map((activity) => (
                  <Chip key={activity} variant="primary" size="sm">
                    {activity
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Pricing (Coaches only) */}
          {isCoach && ((mentor as Coach).hourlyRate || (mentor as Coach).monthlyRate) && (
            <div className="rounded-card bg-[var(--background-subtle)] p-5">
              <h2 className="mb-4 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Coaching Rates
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {(mentor as Coach).hourlyRate && (
                  <div className="rounded-lg bg-white p-4 shadow-card">
                    <p className="text-caption text-foreground-muted">Per Session (1 hour)</p>
                    <p className="mt-1 text-heading-sm font-semibold text-[var(--primitive-green-800)]">
                      ${(mentor as Coach).hourlyRate}
                    </p>
                  </div>
                )}
                {(mentor as Coach).monthlyRate && (
                  <div className="rounded-lg bg-[var(--primitive-blue-200)] p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-caption text-[var(--primitive-green-800)]">Monthly Package</p>
                      <Chip variant="primary" size="sm">
                        Best Value
                      </Chip>
                    </div>
                    <p className="mt-1 text-heading-sm font-semibold text-[var(--primitive-green-800)]">
                      ${(mentor as Coach).monthlyRate}
                      <span className="text-caption font-normal text-[var(--primitive-green-800)]/70">/month</span>
                    </p>
                    <p className="mt-1 text-caption text-[var(--primitive-green-800)]/70">
                      Includes 2 sessions + unlimited messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Availability Preview */}
          {isCoach && (
            <div className="mt-6">
              <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Typical Availability
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries((mentor as Coach).availability)
                  .filter(([_, slots]) => slots.length > 0)
                  .map(([day, slots]) => (
                    <div
                      key={day}
                      className="rounded-lg bg-[var(--background-subtle)] px-3 py-2"
                    >
                      <p className="text-caption font-medium text-foreground-default capitalize">
                        {day}
                      </p>
                      <p className="text-caption text-foreground-muted">
                        {slots.map((s: TimeSlot) => `${s.start}-${s.end}`).join(", ")}
                      </p>
                    </div>
                  ))}
              </div>
              <p className="mt-2 text-caption text-foreground-muted">
                Times shown in {mentor.timezone?.replace("_", " ") || "their local time"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
