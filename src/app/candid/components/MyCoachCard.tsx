"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import {
  Star,
  CalendarBlank,
  ChatCircle,
  VideoCamera,
  CaretRight,
  Users,
} from "@phosphor-icons/react";
import { format, isToday, isTomorrow } from "date-fns";

interface MyCoach {
  id: string;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  headline: string | null;
  bio: string | null;
  expertise: string[];
  sectors: string[];
  rating: number | null;
  reviewCount: number;
  totalSessions: number;
  sessionsCompleted: number;
  upcomingSessionsCount: number;
  nextSession: {
    id: string;
    title: string | null;
    scheduledAt: string;
    duration: number;
    videoLink: string | null;
  } | null;
}

interface MyCoachCardProps {
  className?: string;
}

export function MyCoachCard({ className }: MyCoachCardProps) {
  const [coach, setCoach] = useState<MyCoach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await fetch("/api/my-coach");
        if (res.ok) {
          const data = await res.json();
          setCoach(data.coach);
        }
      } catch (error) {
        console.error("Failed to fetch assigned coach:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, []);

  if (loading) {
    return (
      <div className={cn("animate-pulse rounded-card bg-white p-6", className)}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[var(--primitive-neutral-200)]" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 rounded bg-[var(--primitive-neutral-200)]" />
            <div className="h-4 w-28 rounded bg-[var(--primitive-neutral-200)]" />
          </div>
        </div>
      </div>
    );
  }

  // No assigned coach — show fallback CTA
  if (!coach) {
    return (
      <div
        className={cn(
          "rounded-card bg-white p-6 shadow-card",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
            <Users size={28} className="text-[var(--foreground-brand)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-body-strong font-semibold text-foreground-default">
              Find Your Coach
            </h3>
            <p className="mt-0.5 text-caption text-foreground-muted">
              Get matched with a climate career coach
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button variant="primary" className="flex-1" asChild>
            <Link href="/candid/sessions/schedule">
              <CalendarBlank size={16} weight="fill" />
              Book a Session
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/candid/mentors">Browse Coaches</Link>
          </Button>
        </div>
      </div>
    );
  }

  const coachName = `${coach.firstName || ""} ${coach.lastName || ""}`.trim() || "Your Coach";
  const nextSessionDate = coach.nextSession
    ? new Date(coach.nextSession.scheduledAt)
    : null;

  const formatNextSession = () => {
    if (!nextSessionDate) return null;
    if (isToday(nextSessionDate)) return `Today at ${format(nextSessionDate, "h:mma")}`;
    if (isTomorrow(nextSessionDate)) return `Tomorrow at ${format(nextSessionDate, "h:mma")}`;
    return format(nextSessionDate, "EEE, MMM d 'at' h:mma");
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card bg-[var(--primitive-green-800)] p-6 text-[var(--primitive-blue-100)]",
        className
      )}
    >
      {/* Coach Info */}
      <div className="flex items-center gap-4">
        <Avatar
          size="xl"
          src={coach.photoUrl || undefined}
          name={coachName}
          color="blue"
          className="ring-2 ring-white/20"
        />
        <div className="flex-1 min-w-0">
          <p className="text-caption text-[var(--primitive-green-400)]">Your Coach</p>
          <Link
            href={`/candid/coach/${coach.id}`}
            className="text-body-strong font-semibold text-[var(--primitive-blue-100)] hover:underline"
          >
            {coachName}
          </Link>
          {coach.headline && (
            <p className="mt-0.5 truncate text-caption text-[var(--primitive-blue-100)]/70">
              {coach.headline}
            </p>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-4 flex items-center gap-4 text-caption">
        {coach.rating && coach.rating > 0 && (
          <span className="flex items-center gap-1">
            <Star size={14} weight="fill" className="text-[#FFD700]" />
            <span className="font-medium text-[var(--primitive-blue-100)]">
              {coach.rating.toFixed(1)}
            </span>
          </span>
        )}
        <span className="text-[var(--primitive-blue-100)]/70">
          {coach.sessionsCompleted} session{coach.sessionsCompleted !== 1 ? "s" : ""} completed
        </span>
      </div>

      {/* Expertise Chips */}
      {coach.expertise.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {coach.expertise.slice(0, 3).map((skill) => (
            <Chip
              key={skill}
              variant="neutral"
              size="sm"
              className="border-0 bg-white/15 text-[var(--primitive-blue-100)]"
            >
              {skill}
            </Chip>
          ))}
          {coach.expertise.length > 3 && (
            <Chip
              variant="neutral"
              size="sm"
              className="border-0 bg-white/15 text-[var(--primitive-blue-100)]"
            >
              +{coach.expertise.length - 3}
            </Chip>
          )}
        </div>
      )}

      {/* Next Session Banner */}
      {coach.nextSession && (
        <div className="mt-4 rounded-lg bg-white/10 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption-strong text-[var(--primitive-blue-100)]">
                Next Session
              </p>
              <p className="mt-0.5 text-caption text-[var(--primitive-blue-100)]/80">
                {coach.nextSession.title || "1:1 Session"} · {formatNextSession()}
              </p>
            </div>
            {nextSessionDate && isToday(nextSessionDate) && coach.nextSession.videoLink && (
              <Button variant="inverse" size="sm" asChild>
                <a href={coach.nextSession.videoLink} target="_blank" rel="noopener noreferrer">
                  <VideoCamera size={16} weight="fill" />
                  Join
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Button variant="inverse" className="flex-1" asChild>
          <Link href="/candid/sessions/schedule">
            <CalendarBlank size={16} weight="fill" />
            Book Session
          </Link>
        </Button>
        <Link
          href={`/candid/messages?new=${coach.id}`}
          className={cn(
            buttonVariants({ variant: "inverse", size: "icon" }),
          )}
        >
          <ChatCircle size={18} />
        </Link>
        <Link
          href={`/candid/coach/${coach.id}`}
          className={cn(
            buttonVariants({ variant: "inverse", size: "icon" }),
          )}
        >
          <CaretRight size={18} />
        </Link>
      </div>
    </div>
  );
}
