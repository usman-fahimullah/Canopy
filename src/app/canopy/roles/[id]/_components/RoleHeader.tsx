"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SegmentedController } from "@/components/ui/segmented-controller";
import {
  CircleDashed,
  CheckCircle,
  Pause,
  XCircle,
  PencilSimpleLine,
  ListChecks,
  Nut,
  ShareNetwork,
} from "@phosphor-icons/react";
import { ProfileIcon } from "@/components/Icons/profile-icon";

// ============================================
// TYPES
// ============================================

interface RoleHeaderProps {
  roleTitle: string;
  jobStatus: string | undefined;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReviewRole: () => void;
  saving: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function RoleHeader({
  roleTitle,
  jobStatus,
  activeTab,
  onTabChange,
  onReviewRole,
  saving,
}: RoleHeaderProps) {
  const status = jobStatus || "DRAFT";

  // Status icon + badge mapping
  const statusConfig = {
    PUBLISHED: {
      icon: CheckCircle,
      iconColor: "text-[var(--foreground-success)]",
      badge: <Badge variant="success">Published</Badge>,
    },
    PAUSED: {
      icon: Pause,
      iconColor: "text-[var(--foreground-warning)]",
      badge: <Badge variant="warning">Paused</Badge>,
    },
    CLOSED: {
      icon: XCircle,
      iconColor: "text-[var(--foreground-subtle)]",
      badge: <Badge variant="neutral">Closed</Badge>,
    },
    DRAFT: {
      icon: CircleDashed,
      iconColor: "text-[var(--foreground-subtle)]",
      badge: <Badge variant="feature">Draft</Badge>,
    },
  } as const;

  const { icon: StatusIcon, iconColor, badge: statusBadge } =
    statusConfig[status as keyof typeof statusConfig] ?? statusConfig.DRAFT;

  return (
    <div className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)] px-4 py-4 md:px-8 lg:px-12 lg:py-6">
      <div className="relative flex items-center justify-between">
        {/* Left: Icon + Title + Badge */}
        <div className="flex min-w-0 items-center gap-3">
          <StatusIcon
            weight="bold"
            className={`h-8 w-8 shrink-0 ${iconColor}`}
          />
          <div className="flex min-w-0 flex-col items-start gap-[var(--space-0-5)]">
            <h1 className="truncate text-heading-sm font-medium leading-[2rem] text-[var(--primitive-neutral-900)]">
              {roleTitle || "Untitled Role"}
            </h1>
            {statusBadge}
          </div>
        </div>

        {/* Center: Segmented Controller — absolutely centered (lg+ only) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <SegmentedController
            options={[
              {
                value: "job-post",
                label: "Job Post",
                icon: <PencilSimpleLine weight="fill" />,
              },
              {
                value: "apply-form",
                label: "Apply Form",
                icon: <ListChecks weight="bold" />,
              },
              { value: "candidates", label: "Candidates", icon: <ProfileIcon size={16} /> },
              {
                value: "syndication",
                label: "Syndication",
                icon: <ShareNetwork size={16} weight="regular" />,
              },
            ]}
            value={activeTab}
            onValueChange={onTabChange}
            className="w-[540px]"
          />
        </div>

        {/* Right: Review Role + Settings icon */}
        <div className="flex shrink-0 items-center gap-[6px]">
          <Button
            variant="primary"
            onClick={onReviewRole}
            disabled={saving}
            className="rounded-[var(--radius-2xl)] px-4 py-[14px]"
          >
            {saving ? "Saving..." : "Review Role"}
          </Button>
          <Button
            variant="tertiary"
            size="icon"
            className="rounded-[var(--radius-2xl)] p-3"
            aria-label="Role settings"
          >
            <Nut weight="fill" className="h-6 w-6 text-[var(--primitive-green-800)]" />
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet: Full-width tabs below header row */}
      <div className="mt-4 lg:hidden">
        <SegmentedController
          options={[
            {
              value: "job-post",
              label: "Job Post",
              icon: <PencilSimpleLine weight="fill" />,
            },
            {
              value: "apply-form",
              label: "Apply Form",
              icon: <ListChecks weight="bold" />,
            },
            { value: "candidates", label: "Candidates", icon: <ProfileIcon size={16} /> },
            {
              value: "syndication",
              label: "Syndication",
              icon: <ShareNetwork size={16} weight="regular" />,
            },
          ]}
          value={activeTab}
          onValueChange={onTabChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
