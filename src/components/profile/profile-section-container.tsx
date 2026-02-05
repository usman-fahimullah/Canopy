"use client";

import { Button, Badge } from "@/components/ui";
import { Plus } from "@phosphor-icons/react";

/**
 * ProfileSectionContainer - Figma Design Pattern
 *
 * A container component with the header INSIDE (not separate).
 * Used for Goals, Experience, and Files sections.
 *
 * Structure:
 * ┌─────────────────────────────────────────────────┐
 * │  Header Row (INSIDE container)                  │
 * │  ┌──────────────────────────────────────────┐  │
 * │  │ [Icon] Section Title (count) [Action]    │  │
 * │  └──────────────────────────────────────────┘  │
 * │                                                 │
 * │  Content Area (empty state or list items)       │
 * └─────────────────────────────────────────────────┘
 *
 * @figma https://figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=2215-7340
 */

interface ProfileSectionContainerProps {
  /** Icon to display in header (24px) */
  icon: React.ReactNode;
  /** Section title */
  title: string;
  /** Item count (shown as badge) */
  count?: number;
  /** Extra content to display after title/count (e.g., streak badge) */
  headerExtra?: React.ReactNode;
  /** Action button label */
  actionLabel: string;
  /** Action button callback */
  onAction: () => void;
  /** Secondary action label (optional link-style button) */
  secondaryActionLabel?: string;
  /** Secondary action callback */
  onSecondaryAction?: () => void;
  /** Whether to show the content area */
  isEmpty?: boolean;
  /** Empty state content */
  emptyState?: React.ReactNode;
  /** Section content (list items) */
  children?: React.ReactNode;
}

export function ProfileSectionContainer({
  icon,
  title,
  count,
  headerExtra,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  isEmpty = false,
  emptyState,
  children,
}: ProfileSectionContainerProps) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--border-muted)]">
      {/* Header row - Figma: inside container, white bg */}
      <div className="flex items-center justify-between bg-white px-6 py-4">
        <div className="flex items-center gap-2.5">
          {/* Icon - Figma: 24px, brand color */}
          <span className="flex h-6 w-6 items-center justify-center text-[var(--foreground-brand)]">
            {icon}
          </span>
          {/* Title - Figma: 18px bold */}
          <h2 className="text-body-strong text-[var(--foreground-default)]">{title}</h2>
          {/* Count badge */}
          {count !== undefined && count > 0 && (
            <Badge variant="neutral" size="sm">
              {count}
            </Badge>
          )}
          {/* Extra content (e.g., streak badge) */}
          {headerExtra}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="link" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          <Button variant="inverse" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </div>

      {/* Content area */}
      {isEmpty && emptyState ? (
        <div className="bg-white">{emptyState}</div>
      ) : (
        <div className="bg-white">{children}</div>
      )}
    </div>
  );
}

/**
 * ProfileSectionEmptyState - Empty state for section containers
 *
 * Centered layout with illustration, title, description, and tertiary button.
 *
 * @figma https://figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=2215-7340
 */

interface ProfileSectionEmptyStateProps {
  /** Custom illustration (SVG) */
  illustration?: React.ReactNode;
  /** Empty state title - Figma: 18px bold */
  title: string;
  /** Description text - Figma: 14px, muted */
  description?: string;
  /** CTA button label */
  actionLabel: string;
  /** CTA button callback */
  onAction: () => void;
}

export function ProfileSectionEmptyState({
  illustration,
  title,
  description,
  actionLabel,
  onAction,
}: ProfileSectionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12">
      {/* Illustration - Figma: custom SVG */}
      {illustration && <div className="mb-4">{illustration}</div>}

      {/* Text content - Figma: max-width 304px, centered */}
      <div className="flex max-w-[304px] flex-col items-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-body-strong text-[var(--foreground-default)]">{title}</p>
          {description && (
            <p className="text-caption text-[var(--foreground-muted)]">{description}</p>
          )}
        </div>

        {/* CTA button - Figma: Tertiary, no icon */}
        <Button variant="tertiary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

/**
 * ProfileSectionListContent - Content wrapper for list items
 *
 * Includes optional "Add another" button at bottom.
 */

interface ProfileSectionListContentProps {
  children: React.ReactNode;
  /** Show "Add another" button */
  showAddButton?: boolean;
  /** Add button label */
  addLabel?: string;
  /** Add button callback */
  onAdd?: () => void;
}

export function ProfileSectionListContent({
  children,
  showAddButton = false,
  addLabel = "Add another",
  onAdd,
}: ProfileSectionListContentProps) {
  return (
    <div className="px-6 py-2">
      {children}
      {showAddButton && onAdd && (
        <div className="border-t border-[var(--border-muted)] py-3">
          <Button variant="ghost" leftIcon={<Plus size={16} weight="bold" />} onClick={onAdd}>
            {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
