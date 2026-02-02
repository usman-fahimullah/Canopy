"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CandidCoach, CandidMentor } from "@/lib/candid/types";
import { SECTOR_INFO } from "@/lib/candid/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  ChatCircle,
  CalendarBlank,
  Users,
  Lightning,
  Certificate,
} from "@phosphor-icons/react";

interface CoachCardProps {
  mentor: CandidCoach | CandidMentor;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function CoachCard({ mentor, variant = "default", className }: CoachCardProps) {
  const isCoach = mentor.role === "coach";
  const isTopRated = mentor.rating && mentor.rating >= 4.8;

  // Featured variant - Green 800 background (colored card = no shadow, no border)
  if (variant === "featured") {
    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-card bg-[var(--primitive-green-800)] p-6 text-white",
          className
        )}
      >
        {/* Featured Badge */}
        <div className="absolute right-4 top-4">
          <Chip variant="primary" size="sm">
            <Lightning size={12} weight="fill" className="mr-1" />
            Featured
          </Chip>
        </div>

        <div className="relative">
          {/* Avatar */}
          <div className="mb-4">
            <Avatar
              size="xl"
              src={mentor.avatar}
              name={`${mentor.firstName} ${mentor.lastName}`}
              color="blue"
              className="ring-4 ring-white/30"
            />
          </div>

          {/* Info */}
          <div className="mb-4">
            <Link
              href={`/candid/coach/${mentor.id}`}
              className="text-xl font-bold text-white hover:underline"
            >
              {mentor.firstName} {mentor.lastName}
            </Link>
            <p className="mt-1 text-white/80">
              {mentor.currentRole}
            </p>
            <p className="text-caption text-white/60">
              {mentor.currentCompany}
            </p>
          </div>

          {/* Stats */}
          <div className="mb-4 flex items-center gap-4 text-caption">
            {mentor.rating && (
              <span className="flex items-center gap-1">
                <Star size={16} weight="fill" className="text-[var(--primitive-yellow-400)]" />
                <span className="font-semibold">{mentor.rating.toFixed(1)}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-white/80">
              <Users size={16} />
              {mentor.menteeCount} mentees
            </span>
          </div>

          {/* Sectors */}
          <div className="mb-5 flex flex-wrap gap-2">
            {mentor.sectors.slice(0, 3).map((sector) => (
              <Chip key={sector} variant="neutral" size="sm" className="bg-white/20 text-white border-0">
                {SECTOR_INFO[sector].label}
              </Chip>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/candid/coach/${mentor.id}`}
              className={cn(buttonVariants({ variant: "inverse" }), "flex-1")}
            >
              View Profile
            </Link>
            <Link
              href={`/candid/sessions/schedule?mentor=${mentor.id}`}
              className={buttonVariants({ variant: "inverse", size: "icon" })}
            >
              <CalendarBlank size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant - Simplified card for recommendations
  if (variant === "compact") {
    const primarySector = mentor.sectors[0];

    return (
      <Link
        href={`/candid/coach/${mentor.id}`}
        className={cn(
          "group block rounded-card bg-[var(--card-background)] p-5 shadow-card transition-all hover:shadow-card-hover",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <Avatar
            size="lg"
            src={mentor.avatar}
            name={`${mentor.firstName} ${mentor.lastName}`}
            color="green"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-body-strong text-foreground-default group-hover:text-[var(--primitive-green-800)] transition-colors">
                {mentor.firstName} {mentor.lastName}
              </p>
              {mentor.rating && (
                <span className="flex items-center gap-1 text-caption text-foreground-muted">
                  <Star size={12} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                  {mentor.rating.toFixed(1)}
                </span>
              )}
            </div>
            <p className="text-caption text-foreground-muted mt-0.5">
              {mentor.currentRole}
            </p>
            {primarySector && (
              <p className="text-caption text-[var(--primitive-green-800)] mt-1">
                {SECTOR_INFO[primarySector].label}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant - Full card with all details
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-card bg-[var(--card-background)] shadow-card transition-all hover:shadow-card-hover p-6",
        className
      )}
    >
      {/* Badges */}
      <div className="absolute right-4 top-4 flex flex-col gap-1.5">
        {isTopRated && (
          <Chip variant="yellow" size="sm">
            <Star size={10} weight="fill" className="mr-1" />
            Top Rated
          </Chip>
        )}
      </div>

      {/* Header */}
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <Avatar
            size="lg"
            src={mentor.avatar}
            name={`${mentor.firstName} ${mentor.lastName}`}
            color="green"
          />
          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-[var(--primitive-green-500)]" />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/candid/coach/${mentor.id}`}
              className="text-body-strong text-foreground-default hover:text-[var(--primitive-green-800)] transition-colors"
            >
              {mentor.firstName} {mentor.lastName}
            </Link>
            {isCoach && (
              <Certificate size={16} weight="fill" className="text-[var(--primitive-green-800)]" />
            )}
          </div>
          <p className="text-body text-foreground-default truncate">
            {mentor.currentRole}
          </p>
          <p className="text-caption text-foreground-muted truncate">
            {mentor.currentCompany}
          </p>
        </div>
      </div>

      {/* Rating & Stats */}
      <div className="mt-4 flex items-center gap-3">
        {mentor.rating && (
          <div className="flex items-center gap-1.5">
            <Star size={14} weight="fill" className="text-[var(--primitive-yellow-500)]" />
            <span className="text-caption-strong text-foreground-default">{mentor.rating.toFixed(1)}</span>
          </div>
        )}
        <span className="flex items-center gap-1 text-caption text-foreground-muted">
          <Users size={14} />
          {mentor.menteeCount} mentees
        </span>
        {mentor.location && (
          <span className="flex items-center gap-1 text-caption text-foreground-muted">
            <MapPin size={14} />
            {mentor.location.split(",")[0]}
          </span>
        )}
      </div>

      {/* Sectors */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {mentor.sectors.slice(0, 3).map((sector) => (
          <Chip key={sector} variant="neutral" size="sm">
            {SECTOR_INFO[sector].label}
          </Chip>
        ))}
        {mentor.sectors.length > 3 && (
          <Chip variant="neutral" size="sm">
            +{mentor.sectors.length - 3}
          </Chip>
        )}
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p className="mt-3 text-caption text-foreground-muted line-clamp-2">
          {mentor.bio}
        </p>
      )}

      {/* Pricing (Coach only) */}
      {isCoach && (mentor as CandidCoach).monthlyRate && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--primitive-blue-200)] px-4 py-3">
          <span className="text-caption-strong text-[var(--primitive-green-800)]">Monthly coaching</span>
          <span className="text-body-strong text-[var(--primitive-green-800)]">
            ${(mentor as CandidCoach).monthlyRate}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/candid/coach/${mentor.id}`}
          className={cn(buttonVariants({ variant: "secondary" }), "flex-1")}
        >
          View Profile
        </Link>
        <Link
          href={`/candid/messages?new=${mentor.id}`}
          className={buttonVariants({ variant: "tertiary", size: "icon" })}
        >
          <ChatCircle size={18} />
        </Link>
        <Link
          href={`/candid/sessions/schedule?mentor=${mentor.id}`}
          className={buttonVariants({ variant: "primary", size: "icon" })}
        >
          <CalendarBlank size={18} />
        </Link>
      </div>
    </div>
  );
}
