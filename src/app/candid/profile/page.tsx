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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Trash,
} from "@phosphor-icons/react";
import { ExperienceModal, type Experience } from "../components/ExperienceModal";
import { logger, formatError } from "@/lib/logger";

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

interface MatchedCoach {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  currentRole?: string;
  currentCompany?: string;
}

interface Session {
  id: string;
  status: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [matchedCoach, setMatchedCoach] = useState<MatchedCoach | null>(null);
  const [loading, setLoading] = useState(true);

  // Experience modal state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>();
  const [experiencesLoading, setExperiencesLoading] = useState(false);

  // Summary edit modal state
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Skills edit modal state
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [skillsText, setSkillsText] = useState("");
  const [skillsLoading, setSkillsLoading] = useState(false);

  // Goals edit modal state
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [goalsText, setGoalsText] = useState("");
  const [goalsLoading, setGoalsLoading] = useState(false);

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      setExperiencesLoading(true);
      const res = await fetch("/api/experience");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.experiences || []);
      }
    } catch (error) {
      logger.error("Failed to fetch experiences", { error: formatError(error) });
    } finally {
      setExperiencesLoading(false);
    }
  };

  // Save experience (create or update)
  const handleSaveExperience = async (experience: Experience) => {
    const method = experience.id ? "PATCH" : "POST";
    const url = experience.id ? `/api/experience/${experience.id}` : "/api/experience";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experience),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to save experience");
    }

    await fetchExperiences();
  };

  // Delete experience
  const handleDeleteExperience = async (id: string) => {
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete experience");
    }
    await fetchExperiences();
  };

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
          setSummaryText(acct.bio || "");
          setSkillsText(acct.seekerProfile?.targetSectors?.join(", ") || "");
        }
      } catch {
        // API fetch failed, will fall through to Supabase fallback
      }

      // Fallback to Supabase auth data if API didn't work
      if (!profileLoaded) {
        try {
          const supabase = createClient();
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();

          if (authUser) {
            const nameParts = (
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              authUser.email?.split("@")[0] ||
              "User"
            ).split(" ");
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

      // Fetch experiences
      await fetchExperiences();

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
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-foreground-muted">Unable to load your profile. Please try again.</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
      {/* ================================================================
          PROFILE HEADER (Exception - gets special visual treatment)
          ================================================================ */}

      {/* Banner */}
      <div className="relative h-48 overflow-hidden rounded-t-xl bg-[var(--primitive-green-800)]">
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
              className="h-24 w-24 ring-4 ring-white"
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
              <h1 className="text-foreground-default text-heading-md font-semibold">
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
            <Link href="/candid/settings">Contact Info</Link>
          </Button>
        </div>

        {/* Social Links */}
        <div className="mt-4 flex items-center gap-2">
          <Chip variant="neutral" size="sm">
            @{user.firstName.toLowerCase()}
            {user.lastName.toLowerCase()}
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
      <div className="mt-8 grid gap-4 px-6 md:grid-cols-2">
        {/* Summary Card */}
        <div className="rounded-xl bg-[var(--primitive-blue-200)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-foreground-default text-body-strong font-semibold">Your Summary</h2>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Pencil size={14} />}
              onClick={() => setSummaryModalOpen(true)}
            >
              Edit
            </Button>
          </div>
          <p className="text-foreground-default text-body leading-relaxed">
            {user.bio ||
              "Add a summary to tell coaches about yourself, your background, and what you're looking for in your climate career journey."}
          </p>
        </div>

        {/* Skills Card */}
        <div className="rounded-xl bg-[var(--primitive-blue-200)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-foreground-default text-body-strong font-semibold">
              Skills & Interests
            </h2>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Pencil size={14} />}
              onClick={() => setSkillsModalOpen(true)}
            >
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
        <h2 className="text-foreground-default mb-4 text-heading-sm font-semibold">My Progress</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sessions Progress Card */}
          <Card className="p-4">
            <ProgressMeterLinear
              goal="sessions"
              value={(progressData.sessions.current / progressData.sessions.total) * 100}
              labelText="Sessions"
            />
            <p className="mt-1 text-caption text-foreground-muted">
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
            <p className="mt-1 text-caption text-foreground-muted">
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
            <p className="mt-1 text-caption text-foreground-muted">
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
            <p className="mt-1 text-caption text-foreground-muted">
              {progressData.milestones.current} of {progressData.milestones.total} achieved
            </p>
          </Card>
        </div>
      </section>

      {/* My Coach - Container with white card */}
      {matchedCoach && (
        <section className="mt-10 px-6">
          <h2 className="text-foreground-default mb-4 text-heading-sm font-semibold">My Coach</h2>

          {/* Coach card */}
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                src={matchedCoach.avatar ?? undefined}
                name={`${matchedCoach.firstName} ${matchedCoach.lastName}`}
                color="green"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground-default text-body-strong font-semibold">
                  {matchedCoach.firstName} {matchedCoach.lastName}
                </h3>
                <p className="text-caption text-foreground-muted">{matchedCoach.currentRole}</p>
                <p className="text-caption text-foreground-muted">{matchedCoach.currentCompany}</p>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-semibold">My Goals</h2>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={14} />}
            onClick={() => setGoalsModalOpen(true)}
          >
            Edit
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
                <span className="text-foreground-default text-body">{goal}</span>
              </div>
            ))
          ) : (
            <p className="text-caption text-foreground-muted">Add your career goals</p>
          )}
        </div>
      </section>

      {/* Experience - Container */}
      <section className="mt-10 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-semibold">Experience</h2>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={14} />}
            onClick={() => {
              setEditingExperience(undefined);
              setExperienceModalOpen(true);
            }}
          >
            Add
          </Button>
        </div>

        {/* Experience list - no cards per item */}
        <div className="space-y-6">
          {experiencesLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : experiences.length > 0 ? (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex gap-4 border-b border-border-muted pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                  <Briefcase size={20} className="text-foreground-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-foreground-default text-body-strong font-semibold">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-caption text-foreground-muted">{exp.companyName}</p>
                      <p className="mt-1 text-caption text-foreground-muted">
                        {exp.employmentType.replace("_", "-")} · {exp.workType}
                      </p>
                      {exp.description && (
                        <p className="text-foreground-default mt-2 text-body">{exp.description}</p>
                      )}
                      {exp.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {exp.skills.map((skill) => (
                            <Chip key={skill} variant="neutral" size="sm">
                              {skill}
                            </Chip>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-caption text-foreground-muted">
                        {new Date(exp.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                        {" - "}
                        {exp.isCurrent
                          ? "Present"
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })
                            : ""}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingExperience(exp);
                          setExperienceModalOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          if (exp.id && confirm("Delete this experience?")) {
                            handleDeleteExperience(exp.id);
                          }
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                <Briefcase size={20} className="text-foreground-muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-foreground-default text-body-strong font-semibold">
                      Add your work experience
                    </h3>
                    <p className="text-caption text-foreground-muted">
                      Help coaches understand your background
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience Modal */}
      <ExperienceModal
        open={experienceModalOpen}
        onOpenChange={setExperienceModalOpen}
        experience={editingExperience}
        onSave={handleSaveExperience}
        onDelete={handleDeleteExperience}
      />

      {/* Summary Edit Modal */}
      <Dialog open={summaryModalOpen} onOpenChange={setSummaryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Your Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Tell coaches about yourself, your background, and what you're looking for..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              disabled={summaryLoading}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSummaryModalOpen(false)}
              disabled={summaryLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  setSummaryLoading(true);
                  const res = await fetch("/api/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bio: summaryText }),
                  });
                  if (!res.ok) throw new Error("Failed to save");
                  if (user) {
                    setUser({ ...user, bio: summaryText });
                  }
                  setSummaryModalOpen(false);
                } catch (error) {
                  logger.error("Failed to update summary", { error: formatError(error) });
                } finally {
                  setSummaryLoading(false);
                }
              }}
              disabled={summaryLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skills Edit Modal */}
      <Dialog open={skillsModalOpen} onOpenChange={setSkillsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Skills & Interests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-foreground-muted">
                Enter sectors/skills separated by commas
              </p>
              <Textarea
                placeholder="e.g., Solar Energy, Wind Power, Energy Storage, Sustainability"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                disabled={skillsLoading}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSkillsModalOpen(false)}
              disabled={skillsLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  setSkillsLoading(true);
                  const sectors = skillsText
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);

                  const res = await fetch("/api/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ targetSectors: sectors }),
                  });
                  if (!res.ok) throw new Error("Failed to save");
                  if (user) {
                    setUser({ ...user, targetSectors: sectors });
                  }
                  setSkillsModalOpen(false);
                } catch (error) {
                  logger.error("Failed to update skills", { error: formatError(error) });
                } finally {
                  setSkillsLoading(false);
                }
              }}
              disabled={skillsLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goals Edit Modal */}
      <Dialog open={goalsModalOpen} onOpenChange={setGoalsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Your Goals</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-foreground-muted">Enter each goal on a new line</p>
              <Textarea
                placeholder="e.g., Land a job in climate tech&#10;Build my network in sustainability&#10;Learn about renewable energy"
                value={goalsText}
                onChange={(e) => setGoalsText(e.target.value)}
                disabled={goalsLoading}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setGoalsModalOpen(false)}
              disabled={goalsLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  setGoalsLoading(true);
                  const goals = goalsText
                    .split("\n")
                    .map((g) => g.trim())
                    .filter((g) => g.length > 0);

                  // For now, just update local state since we don't have a dedicated goals API
                  if (user) {
                    setUser({ ...user, goals });
                  }
                  setGoalsModalOpen(false);
                } catch (error) {
                  logger.error("Failed to update goals", { error: formatError(error) });
                } finally {
                  setGoalsLoading(false);
                }
              }}
              disabled={goalsLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
