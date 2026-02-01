"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, PencilSimple, MapPin, CurrencyDollar, Briefcase, Leaf } from "@phosphor-icons/react";

/* ------------------------------------------------------------------ */
/*  Types — based on /api/profile response shape                       */
/* ------------------------------------------------------------------ */

interface SeekerProfile {
  headline: string | null;
  skills: string[];
  greenSkills: string[];
  certifications: string[];
  yearsExperience: number | null;
  targetSectors: string[];
  resumeUrl: string | null;
  portfolioUrl: string | null;
  summary: string | null;
}

interface Account {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  seekerProfile: SeekerProfile | null;
}

/** Extract up to two initials from a name string */
function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);

  /* ---- data fetch ------------------------------------------------ */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setAccount(data.account ?? null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Profile" />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  const seeker = account?.seekerProfile;

  /* ---- placeholder values when profile data is sparse ------------ */
  const displayName = account?.name ?? "Your Name";
  const displayHeadline = seeker?.headline ?? "Climate professional";
  const displayBio =
    account?.bio ??
    seeker?.summary ??
    "Tell employers about yourself, your experience, and what drives your work in climate and sustainability.";
  const displaySkills =
    seeker && (seeker.skills.length > 0 || seeker.greenSkills.length > 0)
      ? [...seeker.skills, ...seeker.greenSkills]
      : ["Add your skills"];
  const displayLocation = account?.location ?? "Not set";
  const displaySectors =
    seeker && seeker.targetSectors.length > 0 ? seeker.targetSectors : ["Not specified"];

  /* ---- render ---------------------------------------------------- */
  return (
    <div>
      <PageHeader
        title="Profile"
        actions={
          <Button variant="tertiary" leftIcon={<PencilSimple size={18} weight="bold" />}>
            Edit Profile
          </Button>
        }
      />

      <div className="space-y-6 px-8 py-6 lg:px-12">
        {/* ---- Profile Header Card -------------------------------- */}
        <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* Avatar / Initials */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--primitive-green-200)] text-heading-md font-bold text-[var(--primitive-green-800)]">
              {getInitials(account?.name ?? null)}
            </div>

            {/* Name + headline */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-heading-sm font-semibold text-[var(--foreground-default)]">
                {displayName}
              </h2>
              <p className="text-body text-[var(--foreground-muted)]">{displayHeadline}</p>
              {account?.location && (
                <div className="mt-1 flex items-center justify-center gap-1 text-caption text-[var(--foreground-subtle)] sm:justify-start">
                  <MapPin size={14} />
                  <span>{account.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- About Section -------------------------------------- */}
        <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-body font-bold text-[var(--foreground-default)]">About</h3>
            <Button variant="ghost" size="icon-sm" aria-label="Edit about section">
              <PencilSimple size={18} weight="bold" className="text-[var(--foreground-muted)]" />
            </Button>
          </div>
          <p className="text-body leading-relaxed text-[var(--foreground-muted)]">{displayBio}</p>
        </div>

        {/* ---- Skills Section ------------------------------------- */}
        <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-body font-bold text-[var(--foreground-default)]">Skills</h3>
            <Button variant="ghost" size="icon-sm" aria-label="Edit skills">
              <PencilSimple size={18} weight="bold" className="text-[var(--foreground-muted)]" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-[16px] bg-[var(--primitive-green-100)] px-3 py-1.5 text-caption font-medium text-[var(--primitive-green-700)]"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Green skills sub-section */}
          {seeker && seeker.greenSkills.length > 0 && (
            <div className="mt-4 border-t border-[var(--primitive-neutral-200)] pt-4">
              <div className="mb-3 flex items-center gap-1.5">
                <Leaf size={16} weight="fill" className="text-[var(--primitive-green-600)]" />
                <span className="text-caption font-bold text-[var(--primitive-green-700)]">
                  Green Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {seeker.greenSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-[16px] bg-[var(--primitive-green-200)] px-3 py-1.5 text-caption font-medium text-[var(--primitive-green-800)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications sub-section */}
          {seeker && seeker.certifications.length > 0 && (
            <div className="mt-4 border-t border-[var(--primitive-neutral-200)] pt-4">
              <p className="mb-3 text-caption font-bold text-[var(--foreground-default)]">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {seeker.certifications.map((cert) => (
                  <Badge key={cert} variant="info" size="sm">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---- Preferences Section -------------------------------- */}
        <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-body font-bold text-[var(--foreground-default)]">Preferences</h3>
            <Button variant="ghost" size="icon-sm" aria-label="Edit preferences">
              <PencilSimple size={18} weight="bold" className="text-[var(--foreground-muted)]" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primitive-green-100)]">
                <MapPin size={18} weight="fill" className="text-[var(--primitive-green-700)]" />
              </div>
              <div>
                <p className="text-caption font-bold text-[var(--foreground-default)]">Location</p>
                <p className="text-caption text-[var(--foreground-muted)]">{displayLocation}</p>
              </div>
            </div>

            {/* Salary range */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primitive-green-100)]">
                <CurrencyDollar
                  size={18}
                  weight="fill"
                  className="text-[var(--primitive-green-700)]"
                />
              </div>
              <div>
                <p className="text-caption font-bold text-[var(--foreground-default)]">
                  Salary Range
                </p>
                <p className="text-caption text-[var(--foreground-muted)]">Not set</p>
              </div>
            </div>

            {/* Role types / sectors */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primitive-green-100)]">
                <Briefcase size={18} weight="fill" className="text-[var(--primitive-green-700)]" />
              </div>
              <div>
                <p className="text-caption font-bold text-[var(--foreground-default)]">
                  Target Sectors
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {displaySectors.map((sector) => (
                    <span key={sector} className="text-caption text-[var(--foreground-muted)]">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Experience Summary --------------------------------- */}
        {seeker?.yearsExperience != null && (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-6">
            <h3 className="mb-2 text-body font-bold text-[var(--foreground-default)]">
              Experience
            </h3>
            <p className="text-body text-[var(--foreground-muted)]">
              {seeker.yearsExperience} {seeker.yearsExperience === 1 ? "year" : "years"} of
              experience
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
