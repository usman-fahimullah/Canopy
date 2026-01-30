"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ProgressMeterLinear } from "@/components/ui/progress-meter";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
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

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  cohort: string;
  targetSectors: string[];
  goals: string[];
  matchedCoachId: string | null;
}

interface Session {
  id: string;
  status: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [matchedCoach, setMatchedCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      let profileLoaded = false;

      // Try to get rich profile data from API first
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const acct = data.account;
          const nameParts = (acct.name || "").split(" ");
          setUser({
            id: acct.id,
            firstName: nameParts[0] || "User",
            lastName: nameParts.slice(1).join(" ") || "",
            email: acct.email || "",
            avatar: acct.avatar || null,
            bio: acct.bio || null,
            location: acct.location || null,
            cohort: "Spring 2026",
            targetSectors: acct.seekerProfile?.targetSectors || [],
            goals: ["Land a job in climate tech", "Build my network in sustainability"],
            matchedCoachId: null,
          });
          profileLoaded = true;
        }
      } catch {
        // API fetch failed, will fall through to Supabase fallback
      }

      // Fallback to Supabase auth data if API didn't work
      if (!profileLoaded) {
        try {
          const supabase = createClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (authUser) {
            const nameParts = (authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User").split(" ");
            setUser({
              id: authUser.id,
              firstName: nameParts[0] || "User",
              lastName: nameParts.slice(1).join(" ") || "",
              email: authUser.email || "",
              avatar: authUser.user_metadata?.avatar_url || null,
              bio: null,
              location: null,
              cohort: "Spring 2026",
              targetSectors: [],
              goals: ["Land a job in climate tech", "Build my network in sustainability"],
              matchedCoachId: null,
            });
          }
        } catch {
          // Supabase auth also failed
        }
      }

      // Fetch sessions separately
      try {
        const sessionsRes = await fetch("/api/sessions");
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          setSessions(sessionsData.sessions || []);
        }
      } catch {
        // Sessions fetch failed silently
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  // Progress data for goals
  const progressData = {
    sessions: { current: completedSessions.length, total: 6 },
    actions: { current: 0, total: 10 },
    skills: { current: 0, total: 5 },
    milestones: { current: 0, total: 4 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-foreground-muted">Unable to load your profile. Please try again.</p>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

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
              src={user.avatar || undefined}
              name={`${user.firstName} ${user.lastName}`}
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
                {user.firstName} {user.lastName}
              </h1>
              <Chip variant="blue" size="sm">
                {user.cohort} Cohort
              </Chip>
            </div>
            {user.location && (
              <p className="mt-1 flex items-center gap-1 text-caption text-foreground-muted">
                <MapPin size={14} />
                {user.location}
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
            @{user.firstName.toLowerCase()}{user.lastName.toLowerCase()}
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
            {user.bio || "Add a summary to tell coaches about yourself, your background, and what you're looking for in your climate career journey."}
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
            {user.targetSectors.length > 0 ? (
              user.targetSectors.map((sector) => (
                <Chip key={sector} variant="neutral" size="sm" removable>
                  {sector}
                </Chip>
              ))
            ) : (
              <p className="text-caption text-foreground-muted">Add your target sectors</p>
            )}
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
          {/* Sessions Progress Card */}
          <Card className="p-4">
            <ProgressMeterLinear
              goal="sessions"
              value={(progressData.sessions.current / progressData.sessions.total) * 100}
              labelText="Sessions"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.sessions.current} of {progressData.sessions.total} completed
            </p>
          </Card>

          {/* Actions Progress Card */}
          <Card className="p-4">
            <ProgressMeterLinear
              goal="actions"
              value={(progressData.actions.current / progressData.actions.total) * 100}
              labelText="Actions"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.actions.current} of {progressData.actions.total} completed
            </p>
          </Card>

          {/* Skills Progress Card */}
          <Card className="p-4">
            <ProgressMeterLinear
              goal="skills"
              value={(progressData.skills.current / progressData.skills.total) * 100}
              labelText="Skills"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.skills.current} of {progressData.skills.total} developed
            </p>
          </Card>

          {/* Milestones Progress Card */}
          <Card className="p-4">
            <ProgressMeterLinear
              goal="milestones"
              value={(progressData.milestones.current / progressData.milestones.total) * 100}
              labelText="Milestones"
            />
            <p className="text-caption text-foreground-muted mt-1">
              {progressData.milestones.current} of {progressData.milestones.total} achieved
            </p>
          </Card>
        </div>
      </section>

      {/* My Coach - Container with white card */}
      {matchedCoach && (
        <section className="mt-10 px-6">
          <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">My Coach</h2>

          {/* Coach card */}
          <Card className="p-5">
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
          </Card>
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
          {user.goals.length > 0 ? (
            user.goals.map((goal, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
                  <Target size={14} className="text-[var(--primitive-green-800)]" />
                </div>
                <span className="text-body text-foreground-default">{goal}</span>
              </div>
            ))
          ) : (
            <p className="text-caption text-foreground-muted">Add your career goals</p>
          )}
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
