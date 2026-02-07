"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PaperPlaneTilt, Globe, Clock } from "@phosphor-icons/react";
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
      <Avatar size="xl" shape="square" name={name} src={avatar ?? undefined} />
      <div className="flex-1">
        <h1 className="text-heading-lg font-medium text-[var(--foreground-default)]">{name}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-caption text-[var(--foreground-muted)]">
          <Globe size={24} weight="regular" />
          <span>{jobTitle}</span>
          <span className="text-[var(--foreground-disabled)]">&middot;</span>
          <Clock size={24} weight="regular" />
          <span>Applied {timeAgo}</span>
        </p>
        <div className="mt-4">
          <Button variant="tertiary">
            <PaperPlaneTilt size={16} weight="fill" className="mr-2" />
            Message Candidate
          </Button>
        </div>
      </div>
    </div>
  );
}
