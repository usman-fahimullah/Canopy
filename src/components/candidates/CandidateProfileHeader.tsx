"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { PaperPlaneTilt, Globe, Clock, PencilSimple } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { getDeterministicAvatarSrc } from "@/lib/profile/avatar-presets";
import { ChangeAvatarModal } from "@/components/profile/modals/change-avatar-modal";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";

interface CandidateProfileHeaderProps {
  name: string;
  email: string;
  avatar: string | null;
  jobTitle: string;
  appliedAt: Date;
  pronouns: string | null;
  /** Seeker profile ID — needed for avatar update API */
  seekerId?: string;
  /** Callback when avatar is changed */
  onAvatarChange?: (newAvatarSrc: string) => void;
}

export function CandidateProfileHeader({
  name,
  email,
  avatar,
  jobTitle,
  appliedAt,
  pronouns,
  seekerId,
  onAvatarChange,
}: CandidateProfileHeaderProps) {
  const timeAgo = formatDistanceToNow(new Date(appliedAt), { addSuffix: true });
  const [avatarModalOpen, setAvatarModalOpen] = React.useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = React.useState(false);
  const [currentAvatar, setCurrentAvatar] = React.useState(avatar);

  // Keep in sync with parent prop
  React.useEffect(() => {
    setCurrentAvatar(avatar);
  }, [avatar]);

  const handleAvatarSave = async (presetSrc: string | null, customFile?: File) => {
    if (!seekerId || !presetSrc) {
      setAvatarModalOpen(false);
      return;
    }

    setIsSavingAvatar(true);
    try {
      const res = await fetch(`/api/canopy/candidates/${seekerId}/avatar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarSrc: presetSrc }),
      });

      if (!res.ok) {
        throw new Error("Failed to update avatar");
      }

      setCurrentAvatar(presetSrc);
      onAvatarChange?.(presetSrc);
      toast.success("Avatar updated");
      setAvatarModalOpen(false);
    } catch (err) {
      logger.error("Failed to update candidate avatar", { error: formatError(err) });
      toast.error("Failed to update avatar");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const avatarSrc = currentAvatar || getDeterministicAvatarSrc(email || name);

  return (
    <>
      <div className="flex items-start gap-5">
        <div className="group relative">
          <Avatar size="2xl" shape="square" name={name} src={avatarSrc} />
          {seekerId && (
            <SimpleTooltip content="Change avatar">
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--background-default)] bg-[var(--background-brand)] text-[var(--foreground-inverse)] opacity-0 transition-all hover:scale-110 active:scale-95 group-hover:opacity-100"
                aria-label="Change avatar"
              >
                <PencilSimple size={14} weight="bold" />
              </button>
            </SimpleTooltip>
          )}
        </div>
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

      {seekerId && (
        <ChangeAvatarModal
          open={avatarModalOpen}
          onOpenChange={setAvatarModalOpen}
          currentAvatar={currentAvatar}
          onSave={handleAvatarSave}
          loading={isSavingAvatar}
        />
      )}
    </>
  );
}
