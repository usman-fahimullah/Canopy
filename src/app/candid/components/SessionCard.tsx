"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/candid/types";
import { getUserById } from "@/lib/candid/mock-data";
import { buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { VideoCamera, CaretRight } from "@phosphor-icons/react";
import { format, isToday, isTomorrow } from "date-fns";

interface SessionCardProps {
  session: Session;
  userRole: "mentee" | "mentor";
  className?: string;
}

const sessionTypeLabels: Record<string, string> = {
  coaching: "Coaching",
  "mock-interview": "Mock Interview",
  "resume-review": "Resume Review",
  "career-planning": "Career Planning",
  networking: "Networking",
};

function formatSessionDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE, MMM d");
}

export function SessionCard({ session, userRole, className }: SessionCardProps) {
  const otherUserId = userRole === "mentee" ? session.mentorId : session.menteeId;
  const otherUser = getUserById(otherUserId);

  const isUpcoming = session.status === "scheduled" && session.scheduledAt > new Date();
  const isSoon = isToday(session.scheduledAt);

  return (
    <Link
      href={`/candid/sessions/${session.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-card bg-white p-4 shadow-card transition-all hover:shadow-card-hover",
        className
      )}
    >
      {/* Avatar */}
      <Avatar
        size="default"
        src={otherUser?.avatar}
        name={otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : ""}
        color="green"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-body-strong text-foreground-default group-hover:text-[var(--primitive-green-800)] transition-colors">
            {otherUser?.firstName} {otherUser?.lastName}
          </span>
          {isSoon && isUpcoming && (
            <Chip variant="orange" size="sm">Today</Chip>
          )}
        </div>
        <p className="text-caption text-foreground-muted mt-0.5">
          {formatSessionDate(session.scheduledAt)} · {format(session.scheduledAt, "h:mm a")}
        </p>
      </div>

      {/* Action */}
      {isUpcoming && session.meetingLink ? (
        <a
          href={session.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={buttonVariants({ variant: "primary", size: "sm" })}
        >
          <VideoCamera size={16} />
          Join
        </a>
      ) : (
        <CaretRight size={20} className="text-foreground-muted group-hover:text-foreground-default transition-colors" />
      )}
    </Link>
  );
}
