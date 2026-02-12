"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormCard } from "@/components/ui/form-section";
import { Banner } from "@/components/ui/banner";
import { TruncateText } from "@/components/ui/truncate-text";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import { type TeamMember, roleBadgeVariant, formatRole } from "../_components/types";

/* -------------------------------------------------------------------
   Loading Skeleton
   ------------------------------------------------------------------- */

function TeamSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="space-y-3 rounded-2xl border border-[var(--border-default)] p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Page Component
   ------------------------------------------------------------------- */

export default function TeamPermissionsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTeam() {
      try {
        const res = await fetch("/api/canopy/team");
        if (res.ok) {
          const data = await res.json();
          if (data?.members && !cancelled) {
            setMembers(data.members);
          }
        } else {
          if (!cancelled) setError("Failed to load team members");
        }
      } catch {
        if (!cancelled) setError("Failed to load team members");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTeam();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <TeamSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Team Permissions
        </h2>
        <SimpleTooltip content="Coming soon" side="left">
          <span>
            <Button variant="tertiary" size="sm" disabled>
              <EnvelopeSimple size={16} weight="bold" />
              Invite Member
            </Button>
          </span>
        </SimpleTooltip>
      </div>

      <FormCard>
        {error ? (
          <p className="py-4 text-center text-body-sm text-[var(--foreground-error)]">{error}</p>
        ) : (
          <>
            <p className="text-caption text-foreground-muted">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3"
                >
                  <Avatar
                    src={member.avatar ?? undefined}
                    name={member.name ?? undefined}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1">
                    <TruncateText className="text-body-sm font-medium text-[var(--foreground-default)]">
                      {member.name || "Unnamed"}
                    </TruncateText>
                    <TruncateText className="text-caption text-foreground-muted">
                      {member.email}
                    </TruncateText>
                  </div>

                  <Badge variant={roleBadgeVariant(member.role)} size="sm">
                    {formatRole(member.role)}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </FormCard>

      <Banner
        type="info"
        subtle
        dismissible={false}
        title={
          <>
            Manage detailed team settings on the{" "}
            <Link
              href="/canopy/team"
              className="font-medium underline underline-offset-2 transition-colors hover:text-[var(--foreground-link-hover)]"
            >
              Team page
            </Link>
            .
          </>
        }
      />
    </div>
  );
}
