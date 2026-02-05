import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Tray,
  MagnifyingGlass,
  FileX,
  Users,
  Briefcase,
  WarningCircle,
  Plus,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

/**
 * EmptyState component for no-data illustrations
 *
 * Uses semantic tokens:
 * - foreground-muted for text
 * - background-muted for icon backgrounds
 */

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      sm: "py-8 gap-3",
      md: "py-12 gap-4",
      lg: "py-16 gap-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconContainerVariants = cva("flex items-center justify-center rounded-full", {
  variants: {
    size: {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-20 w-20",
    },
    branded: {
      true: "bg-[var(--shell-nav-item-active-bg,var(--background-muted))]",
      false: "bg-background-muted",
    },
  },
  defaultVariants: {
    size: "md",
    branded: false,
  },
});

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Preset icons for common empty states
const presetIcons = {
  inbox: Tray,
  search: MagnifyingGlass,
  file: FileX,
  users: Users,
  jobs: Briefcase,
  error: WarningCircle,
};

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyStateVariants> {
  /** Preset icon type */
  preset?: keyof typeof presetIcons;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** If true, tint the icon container with the current shell's accent color */
  branded?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size,
      preset,
      icon,
      title,
      description,
      action,
      secondaryAction,
      branded = false,
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent = preset ? presetIcons[preset] : null;

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size }), "animate-fade-in", className)}
        {...props}
      >
        {/* Icon with pulse animation */}
        {(icon || IconComponent) && (
          <div
            className={cn(
              iconContainerVariants({ size, branded }),
              "animate-scale-in transition-all duration-normal",
              "hover:scale-105 hover:shadow-sm"
            )}
          >
            {icon ||
              (IconComponent && (
                <IconComponent
                  className={cn(
                    iconVariants({ size }),
                    branded
                      ? "text-[var(--shell-nav-item-active-text,var(--foreground-muted))]"
                      : "text-foreground-muted",
                    "transition-transform duration-slow",
                    preset === "search" && "animate-[bounce_2s_ease-in-out_infinite]",
                    preset === "inbox" && "animate-[pulse_2s_ease-in-out_infinite]"
                  )}
                />
              ))}
          </div>
        )}

        {/* Text with staggered animation */}
        <div className="max-w-sm space-y-1.5">
          <h3
            className={cn(
              "text-foreground-default animate-fade-in font-medium",
              size === "sm" && "text-body-sm",
              size === "md" && "text-body",
              size === "lg" && "text-heading-sm"
            )}
            style={{ animationDelay: "100ms" }}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                "animate-fade-in text-foreground-muted",
                size === "sm" && "text-caption-sm",
                size === "md" && "text-caption",
                size === "lg" && "text-body-sm"
              )}
              style={{ animationDelay: "200ms" }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions with staggered animation */}
        {(action || secondaryAction || children) && (
          <div
            className="flex animate-fade-in flex-col items-center gap-2 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            {action && (
              <Button
                onClick={action.onClick}
                className="transition-all duration-fast hover:scale-105 active:scale-95"
              >
                {action.icon || (
                  <Plus className="mr-2 h-4 w-4 transition-transform duration-fast group-hover:rotate-90" />
                )}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="ghost"
                onClick={secondaryAction.onClick}
                className="transition-all duration-fast hover:scale-105 active:scale-95"
              >
                {secondaryAction.label}
              </Button>
            )}
            {children}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

// Preset empty states for common ATS scenarios
const EmptyStateNoCandidates = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    preset="users"
    title="No candidates yet"
    description="Candidates will appear here once they apply to your jobs or you add them manually."
    {...props}
  />
);

const EmptyStateNoJobs = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    preset="jobs"
    title="No jobs posted"
    description="Create your first job posting to start receiving applications."
    action={{
      label: "Create Job",
      onClick: () => {},
    }}
    {...props}
  />
);

const EmptyStateNoResults = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    preset="search"
    title="No results found"
    description="Try adjusting your search or filter criteria."
    {...props}
  />
);

const EmptyStateNoActivity = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    preset="inbox"
    title="No activity yet"
    description="Activity and updates will appear here."
    {...props}
  />
);

const EmptyStateError = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    preset="error"
    title="Something went wrong"
    description="We couldn't load this content. Please try again."
    {...props}
  />
);

export {
  EmptyState,
  EmptyStateNoCandidates,
  EmptyStateNoJobs,
  EmptyStateNoResults,
  EmptyStateNoActivity,
  EmptyStateError,
  emptyStateVariants,
};
