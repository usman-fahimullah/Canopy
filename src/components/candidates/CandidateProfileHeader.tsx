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
    <div className="flex items-start gap-[22px]">
      <Avatar size="2xl" shape="square" name={name} src={avatar ?? undefined} />
      <div className="flex flex-col gap-4">
        <h1 className="text-heading-lg font-medium text-[var(--foreground-brand-emphasis)]">
          {name}
        </h1>
        <p className="flex items-center gap-1 text-body text-[var(--foreground-subtle)]">
          <Globe size={24} weight="regular" />
          <span>{jobTitle}</span>
          <span className="text-[var(--foreground-disabled)]">&middot;</span>
          <Clock size={24} weight="regular" />
          <span>Applied {timeAgo}</span>
        </p>
        <div>
          <Button variant="tertiary" leftIcon={<PaperPlaneTilt size={20} weight="fill" />}>
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
