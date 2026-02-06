"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";

interface CandidateProfileHeaderProps {
  name: string;
  email: string;
  avatar: string | null;
  jobTitle: string;
  appliedAt: Date;
  pronouns: string | null;
}

export function CandidateProfileHeader({
  name,
  email,
  avatar,
  jobTitle,
  appliedAt,
  pronouns,
}: CandidateProfileHeaderProps) {
  const timeAgo = formatDistanceToNow(new Date(appliedAt), { addSuffix: true });

  return (
    <div className="flex items-start gap-5">
      <Avatar size="xl" name={name} src={avatar ?? undefined} />
      <div className="flex-1">
        <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">{name}</h1>
        <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--primitive-green-500)]" />
            {jobTitle}
          </span>
          <span className="mx-2">·</span>
          <span>Applied {timeAgo}</span>
        </p>
        <div className="mt-4">
          <Button variant="primary" size="default">
            <PaperPlaneTilt size={16} weight="fill" className="mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
