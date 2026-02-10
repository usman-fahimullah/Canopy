"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PaperPlaneTilt, Globe, Clock } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { getDeterministicAvatarSrc } from "@/lib/profile/avatar-presets";

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
      <Avatar
        size="2xl"
        shape="square"
        name={name}
        src={avatar || getDeterministicAvatarSrc(email || name)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h1 className="truncate text-heading-sm font-medium text-[var(--foreground-brand-emphasis)]">
          {name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-caption text-[var(--foreground-subtle)]">
          <Globe size={16} weight="regular" className="shrink-0" />
          <span className="truncate">{jobTitle}</span>
          <span className="shrink-0 text-[var(--foreground-disabled)]">&middot;</span>
          <Clock size={16} weight="regular" className="shrink-0" />
          <span className="shrink-0">Applied {timeAgo}</span>
        </div>
        <div>
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<PaperPlaneTilt size={16} weight="fill" />}
          >
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
