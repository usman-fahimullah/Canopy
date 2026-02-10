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
  onOpenSettings: () => void;
  saving: boolean;
}

// ============================================
// TAB OPTIONS (shared between desktop & mobile)
// ============================================

const tabOptions = [
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
  {
    value: "candidates",
    label: "Candidates",
    icon: <ProfileIcon size={16} />,
  },
];

// ============================================
// COMPONENT
// ============================================

export function RoleHeader({
  roleTitle,
  jobStatus,
  activeTab,
  onTabChange,
  onReviewRole,
  onOpenSettings,
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

  const {
    icon: StatusIcon,
    iconColor,
    badge: statusBadge,
  } = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.DRAFT;

  return (
    <div className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border-default)] bg-[var(--background-default)] px-4 py-4 md:px-8 xl:px-12 xl:py-6">
      {/* Desktop (xl+): 3-column layout with flexbox centering */}
      <div className="flex items-center gap-4">
        {/* Left: Icon + Title + Badge */}
        <div className="flex min-w-0 shrink items-center gap-3">
          <StatusIcon weight="bold" className={`h-8 w-8 shrink-0 ${iconColor}`} />
          <div className="flex min-w-0 flex-col items-start gap-[var(--space-0-5)]">
            <h1 className="max-w-[200px] truncate text-heading-sm font-medium leading-[2rem] text-[var(--foreground-default)] md:max-w-[300px] xl:max-w-none">
              {roleTitle || "Untitled Role"}
            </h1>
            {statusBadge}
          </div>
        </div>

        {/* Center: Segmented Controller (xl+ only) */}
        <div className="hidden min-w-0 flex-1 justify-center xl:flex">
          <SegmentedController
            options={tabOptions}
            value={activeTab}
            onValueChange={onTabChange}
            className="w-[420px]"
          />
        </div>

        {/* Right: Review Role + Settings icon */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
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
            onClick={onOpenSettings}
          >
            <Nut weight="fill" className="h-6 w-6 text-[var(--foreground-default)]" />
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet: Full-width tabs below header row (below xl) */}
      <div className="mt-4 xl:hidden">
        <SegmentedController
          options={tabOptions}
          value={activeTab}
          onValueChange={onTabChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
