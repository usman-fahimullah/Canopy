"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SECTOR_INFO } from "@/lib/candid/types";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { ProgressMeterLinear } from "@/components/ui/progress-meter";
import {
  currentUser,
  getSessionsForUser,
  getUserById,
} from "@/lib/candid";
import {
  CalendarBlank,
  ChatCircle,
  Pencil,
  MapPin,
  LinkedinLogo,
  Globe,
  Upload,
  Target,
  Briefcase,
} from "@phosphor-icons/react";

export default function MyProfilePage() {
  const sessions = getSessionsForUser(currentUser.id);
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const matchedCoach = currentUser.matchedCoachId
    ? getUserById(currentUser.matchedCoachId)
    : null;

  // Mock progress data for the Candid goals
  const progressData = {
    sessions: { current: completedSessions.length, total: 6 },
    actions: { current: 8, total: 10 },
    skills: { current: 3, total: 5 },
    milestones: { current: 2, total: 4 },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* ================================================================
          PROFILE HEADER (Exception - gets special visual treatment)
          ================================================================ */}

      {/* Banner */}
      <div className="relative h-48 rounded-t-xl bg-[var(--primitive-green-800)] overflow-hidden">
        {/* Edit/Upload buttons on banner - using inverse variant */}
        <div className="absolute right-4 top-4 flex gap-2">
          <Button variant="inverse" size="icon-sm">
            <Pencil size={18} />
          </Button>
          <Button variant="inverse" size="icon-sm">
            <Upload size={18} />
          </Button>
        </div>
      </div>

      {/* Avatar overlapping banner */}
      <div className="relative px-6">
        <div className="absolute -top-12">
          <div className="relative">
            <Avatar
              size="xl"
              src={currentUser.avatar}
              name={`${currentUser.firstName} ${currentUser.lastName}`}
              color="green"
              className="ring-4 ring-white h-24 w-24"
            />
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
            >
              <Pencil size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Name, Badge, Location, Social Links */}
      <div className="mt-16 px-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-heading-md font-semibold text-foreground-default">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <Chip variant="blue" size="sm">
                {currentUser.cohort} Cohort
              </Chip>
            </div>
            {currentUser.location && (
              <p className="mt-1 flex items-center gap-1 text-caption text-foreground-muted">
                <MapPin size={14} />
                {currentUser.location}
              </p>
            )}
          </div>
          <Button variant="link" asChild>
            <Link href="/candid/settings">
              Contact Info
            </Link>
          </Button>
        </div>

        {/* Social Links */}
        <div className="mt-4 flex items-center gap-2">
          <Chip variant="neutral" size="sm">
            @{currentUser.firstName.toLowerCase()}{currentUser.lastName.toLowerCase()}
          </Chip>
          <Button variant="tertiary" size="icon-sm">
            <LinkedinLogo size={18} />
          </Button>
          <Button variant="tertiary" size="icon-sm">
            <Globe size={18} />
          </Button>
        </div>
      </div>

      {/* Summary and Skills Cards (Blue 200 - no shadow, no border) */}
      <div className="mt-8 px-6 grid gap-4 md:grid-cols-2">
        {/* Summary Card */}
        <div className="rounded-xl bg-[var(--primitive-blue-200)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-body-strong font-semibold text-foreground-default">Your Summary</h2>
            <Button variant="ghost" size="sm" leftIcon={<Pencil size={14} />}>
              Edit
            </Button>
          </div>
          <p className="text-body text-foreground-default leading-relaxed">
            {currentUser.bio || "Add a summary to tell coaches about yourself, your background, and what you're looking for in your climate career journey."}
          </p>
        </div>

        {/* Skills Card */}
        <div className="rounded-xl bg-[var(--primitive-blue-200)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-body-strong font-semibold text-foreground-default">Skills & Interests</h2>
            <Button variant="ghost" size="sm" leftIcon={<Pencil size={14} />}>
              Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser.targetSectors.map((sector) => (
              <Chip key={sector} variant="neutral" size="sm" removable>
                {SECTOR_INFO[sector].label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
          BELOW HEADER: Container Logic Applies
          ================================================================ */}

      {/* My Progress - Container */}
      <section className="mt-10 px-6">
        <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">My Progress</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sessions Progress Card (white, shadow) */}
          <div className="rounded-card bg-white p-4 shadow-card">
            <ProgressMeterLinear
              goal="sessions"
              value={(progressData.sessions.current / progressData.sessions.total) * 100}
              labelText="Sessions"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.sessions.current} of {progressData.sessions.total} completed
            </p>
          </div>

          {/* Actions Progress Card */}
          <div className="rounded-card bg-white p-4 shadow-card">
            <ProgressMeterLinear
              goal="actions"
              value={(progressData.actions.current / progressData.actions.total) * 100}
              labelText="Actions"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.actions.current} of {progressData.actions.total} completed
            </p>
          </div>

          {/* Skills Progress Card */}
          <div className="rounded-card bg-white p-4 shadow-card">
            <ProgressMeterLinear
              goal="skills"
              value={(progressData.skills.current / progressData.skills.total) * 100}
              labelText="Skills"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.skills.current} of {progressData.skills.total} developed
            </p>
          </div>

          {/* Milestones Progress Card */}
          <div className="rounded-card bg-white p-4 shadow-card">
            <ProgressMeterLinear
              goal="milestones"
              value={(progressData.milestones.current / progressData.milestones.total) * 100}
              labelText="Milestones"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.milestones.current} of {progressData.milestones.total} achieved
            </p>
          </div>
        </div>
      </section>

      {/* My Coach - Container with white card */}
      {matchedCoach && (
        <section className="mt-10 px-6">
          <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">My Coach</h2>

          {/* Coach card (white, shadow) */}
          <div className="rounded-card bg-white p-5 shadow-card">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                src={matchedCoach.avatar}
                name={`${matchedCoach.firstName} ${matchedCoach.lastName}`}
                color="green"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-body-strong font-semibold text-foreground-default">
                  {matchedCoach.firstName} {matchedCoach.lastName}
                </h3>
                <p className="text-caption text-foreground-muted">
                  {(matchedCoach as any).currentRole}
                </p>
                <p className="text-caption text-foreground-muted">
                  {(matchedCoach as any).currentCompany}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="tertiary" size="icon" asChild>
                  <Link href={`/candid/messages?user=${matchedCoach.id}`}>
                    <ChatCircle size={20} />
                  </Link>
                </Button>
                <Button variant="primary" size="icon" asChild>
                  <Link href={`/candid/sessions/schedule?mentor=${matchedCoach.id}`}>
                    <CalendarBlank size={20} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Goals - Container */}
      <section className="mt-10 px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-sm font-semibold text-foreground-default">My Goals</h2>
          <Button variant="ghost" size="sm" leftIcon={<Pencil size={14} />} asChild>
            <Link href="/candid/settings#goals">
              Edit
            </Link>
          </Button>
        </div>

        {/* Goals list - no cards, clean layout */}
        <div className="space-y-3">
          {currentUser.goals.map((goal, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
                <Target size={14} className="text-[var(--primitive-green-800)]" />
              </div>
              <span className="text-body text-foreground-default">{goal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Experience - Container */}
      <section className="mt-10 px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-sm font-semibold text-foreground-default">Experience</h2>
          <Button variant="ghost" size="sm" leftIcon={<Pencil size={14} />}>
            Add
          </Button>
        </div>

        {/* Experience list - no cards per item */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
              <Briefcase size={20} className="text-foreground-muted" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-body-strong font-semibold text-foreground-default">Add your work experience</h3>
                  <p className="text-caption text-foreground-muted">
                    Help coaches understand your background
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
