"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { CandidSymbol } from "./CandidSymbol";
import {
  Users,
  CalendarBlank,
  ChatCircle,
  MagnifyingGlass,
  FileMagnifyingGlass,
  ArrowRight,
} from "@phosphor-icons/react";

type EmptyStateVariant =
  | "no-mentors"
  | "no-sessions"
  | "no-messages"
  | "no-results"
  | "no-favorites"
  | "not-found"
  | "welcome";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: React.ElementType | "candid-symbol";
    defaultTitle: string;
    defaultDescription: string;
    defaultActionLabel?: string;
    defaultActionHref?: string;
    iconColor: string;
    bgColor: string;
  }
> = {
  "no-mentors": {
    icon: Users,
    defaultTitle: "No mentors found",
    defaultDescription: "We couldn't find any mentors matching your criteria. Try adjusting your filters or check back later — more mentors join every week!",
    defaultActionLabel: "Clear filters",
    iconColor: "text-[var(--primitive-green-800)]",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
  },
  "no-sessions": {
    icon: CalendarBlank,
    defaultTitle: "Your climate journey starts here",
    defaultDescription: "Book your first coaching session with Saathe Studio — they've helped 500+ people transition into climate careers.",
    defaultActionLabel: "Book a Session",
    defaultActionHref: "/candid/sessions/schedule",
    iconColor: "text-[var(--primitive-green-800)]",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
  },
  "no-messages": {
    icon: ChatCircle,
    defaultTitle: "Start a conversation",
    defaultDescription: "Have a question about your climate career? Message your coach or connect with a mentor who's been where you want to go.",
    defaultActionLabel: "Find a Mentor",
    defaultActionHref: "/candid/mentors",
    iconColor: "text-[var(--primitive-green-800)]",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
  },
  "no-results": {
    icon: MagnifyingGlass,
    defaultTitle: "No results found",
    defaultDescription: "We couldn't find what you're looking for. Try a different search term or browse all options.",
    defaultActionLabel: "Clear search",
    iconColor: "text-foreground-muted",
    bgColor: "bg-[var(--background-subtle)]",
  },
  "no-favorites": {
    icon: "candid-symbol",
    defaultTitle: "No saved items yet",
    defaultDescription: "Save jobs, mentors, and resources you're interested in to easily find them later.",
    defaultActionLabel: "Browse Mentors",
    defaultActionHref: "/candid/mentors",
    iconColor: "text-[var(--primitive-green-800)]",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
  },
  "not-found": {
    icon: FileMagnifyingGlass,
    defaultTitle: "Page not found",
    defaultDescription: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    defaultActionLabel: "Go to Dashboard",
    defaultActionHref: "/candid/dashboard",
    iconColor: "text-foreground-muted",
    bgColor: "bg-[var(--background-subtle)]",
  },
  welcome: {
    icon: "candid-symbol",
    defaultTitle: "Welcome to Candid!",
    defaultDescription: "Your climate career journey starts here. Let's get you set up with the right guidance and support.",
    defaultActionLabel: "Get Started",
    defaultActionHref: "/candid/onboarding",
    iconColor: "text-[var(--primitive-green-800)]",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
  },
};

export function EmptyState({
  variant,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const finalTitle = title || config.defaultTitle;
  const finalDescription = description || config.defaultDescription;
  const finalActionLabel = actionLabel || config.defaultActionLabel;
  const finalActionHref = actionHref || config.defaultActionHref;

  return (
    <div
      className={cn(
        // White card = shadow, no border
        "flex flex-col items-center justify-center rounded-card bg-[var(--card-background)] shadow-card p-8 sm:p-12 text-center",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-xl mb-6",
          config.bgColor
        )}
      >
        {Icon === "candid-symbol" ? (
          <CandidSymbol size={32} color="var(--primitive-green-800)" />
        ) : (
          <Icon size={32} weight="light" className={config.iconColor} />
        )}
      </div>

      {/* Title */}
      <h3 className="text-heading-sm text-foreground-default">
        {finalTitle}
      </h3>

      {/* Description */}
      <p className="mt-2 text-body text-foreground-muted max-w-md">
        {finalDescription}
      </p>

      {/* Actions */}
      {(finalActionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {finalActionLabel && (
            finalActionHref ? (
              <Link href={finalActionHref} className={buttonVariants({ variant: "primary" })}>
                {finalActionLabel}
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Button
                variant="primary"
                onClick={onAction}
                rightIcon={<ArrowRight size={16} />}
              >
                {finalActionLabel}
              </Button>
            )
          )}
          {secondaryActionLabel && (
            secondaryActionHref ? (
              <Link href={secondaryActionHref} className={buttonVariants({ variant: "secondary" })}>
                {secondaryActionLabel}
              </Link>
            ) : (
              <Button variant="secondary" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Quick empty state for inline use
export function InlineEmptyState({
  message,
  icon: IconProp,
  className,
}: {
  message: string;
  icon?: React.ElementType;
  className?: string;
}) {
  const Icon = IconProp || MagnifyingGlass;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <Icon size={32} weight="light" className="text-foreground-muted/50 mb-3" />
      <p className="text-caption text-foreground-muted">{message}</p>
    </div>
  );
}
