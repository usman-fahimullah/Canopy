"use client";

import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Star,
  DotsThreeVertical,
  ArrowSquareOut,
  ShareNetwork,
  Trash,
} from "@phosphor-icons/react";

/**
 * TrackedJobNavBar — Top navigation bar for the tracked job detail page.
 *
 * Adapted from CandidateDetailNavBar pattern:
 * - Same structural approach: `nav` + `flex items-center justify-between`
 * - Same `Button variant="outline" size="icon"` wrapped in `SimpleTooltip`
 * - 72px height, border-b, px-8
 *
 * Key differences from candidate nav:
 * - Back arrow icon button instead of X close (no text)
 * - Favorite star in nav bar for prominent placement
 * - "Apply" CTA instead of "Move to Stage" (seeker action vs employer action)
 */

interface TrackedJobNavBarProps {
  title: string;
  isSaved: boolean;
  hasApplication: boolean;
  isActionLoading?: boolean;
  onBack: () => void;
  onFavoriteToggle: () => void;
  onApply?: () => void;
  onViewJobPosting?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
}

export function TrackedJobNavBar({
  title,
  isSaved,
  hasApplication,
  isActionLoading,
  onBack,
  onFavoriteToggle,
  onApply,
  onViewJobPosting,
  onShare,
  onRemove,
}: TrackedJobNavBarProps) {
  return (
    <nav className="flex h-[72px] shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-4 sm:px-6 lg:px-8">
      {/* Left: Back button only (matching candidate X close button pattern) */}
      <SimpleTooltip content="Back to Your Jobs">
        <Button variant="outline" size="icon" onClick={onBack} aria-label="Back to Your Jobs">
          <ArrowLeft size={24} weight="bold" />
        </Button>
      </SimpleTooltip>

      {/* Center: Job title (truncated) */}
      <span className="hidden max-w-[400px] truncate text-body-strong text-[var(--foreground-default)] md:block">
        {title}
      </span>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Favorite star */}
        <SimpleTooltip content={isSaved ? "Unsave" : "Save"}>
          <Button
            variant="outline"
            size="icon"
            onClick={onFavoriteToggle}
            disabled={isActionLoading}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            <Star
              size={24}
              weight={isSaved ? "fill" : "regular"}
              className={isSaved ? "text-[var(--primitive-yellow-500)]" : ""}
            />
          </Button>
        </SimpleTooltip>

        {/* Apply button (only if not already applied) */}
        {!hasApplication && (
          <Button variant="primary" onClick={onApply} disabled={isActionLoading}>
            Apply
          </Button>
        )}

        {/* Overflow menu */}
        <DropdownMenu>
          <SimpleTooltip content="More actions">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="More actions"
                disabled={isActionLoading}
              >
                <DotsThreeVertical size={24} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
          </SimpleTooltip>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            <DropdownMenuItem onClick={onViewJobPosting} className="flex items-center gap-2">
              <ArrowSquareOut size={16} />
              <span>View Job Posting</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare} className="flex items-center gap-2">
              <ShareNetwork size={16} />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onRemove}
              className="flex items-center gap-2 text-[var(--foreground-error)]"
            >
              <Trash size={16} />
              <span>Remove from Tracked</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
