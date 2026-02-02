"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Plus, EnvelopeSimple, CalendarBlank } from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RECRUITER" | "HIRING_TEAM" | "VIEWER";
  joinedAt: string;
  avatarColor?: "green" | "blue" | "purple" | "orange";
}

/* -------------------------------------------------------------------
   Mock Data
   ------------------------------------------------------------------- */

const MOCK_TEAM: TeamMember[] = [
  {
    id: "tm_001",
    name: "Jordan Rivera",
    email: "jordan@canopy.co",
    role: "ADMIN",
    joinedAt: "2025-09-15T00:00:00Z",
    avatarColor: "green",
  },
  {
    id: "tm_002",
    name: "Alex Chen",
    email: "alex@canopy.co",
    role: "RECRUITER",
    joinedAt: "2025-10-02T00:00:00Z",
    avatarColor: "blue",
  },
  {
    id: "tm_003",
    name: "Sam Okafor",
    email: "sam@canopy.co",
    role: "HIRING_TEAM",
    joinedAt: "2025-11-20T00:00:00Z",
    avatarColor: "purple",
  },
  {
    id: "tm_004",
    name: "Casey Nguyen",
    email: "casey@canopy.co",
    role: "RECRUITER",
    joinedAt: "2025-12-05T00:00:00Z",
    avatarColor: "orange",
  },
];

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function roleBadgeVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "default" as const;
    case "RECRUITER":
      return "info" as const;
    case "HIRING_TEAM":
      return "neutral" as const;
    case "VIEWER":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

function formatRole(role: string) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "RECRUITER":
      return "Recruiter";
    case "HIRING_TEAM":
      return "Hiring Team";
    case "VIEWER":
      return "Viewer";
    default:
      return role;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Team"
        actions={
          <Link
            href="/canopy/team/invite"
            className={cn(buttonVariants({ variant: "primary" }), "rounded-[16px]")}
          >
            <Plus size={18} weight="bold" />
            Invite Member
          </Link>
        }
      />

      <div className="px-8 py-6 lg:px-12">
        {/* Team Count */}
        <p className="mb-4 text-caption text-foreground-muted">
          {MOCK_TEAM.length} member{MOCK_TEAM.length !== 1 ? "s" : ""}
        </p>

        {/* Member Cards */}
        <div className="space-y-3">
          {MOCK_TEAM.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-6 py-5 sm:flex-row sm:items-center"
            >
              {/* Avatar */}
              <Avatar name={member.name} color={member.avatarColor} size="default" />

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-foreground-default truncate text-body font-medium">
                  {member.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <EnvelopeSimple size={12} weight="bold" />
                    {member.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarBlank size={12} weight="bold" />
                    Joined {formatDate(member.joinedAt)}
                  </span>
                </div>
              </div>

              {/* Role Badge */}
              <Badge variant={roleBadgeVariant(member.role)} size="sm">
                {formatRole(member.role)}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
