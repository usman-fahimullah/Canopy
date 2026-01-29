import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Timeline component for activity history
 *
 * Uses semantic tokens:
 * - border-default for connector lines
 * - foreground-muted for timestamps
 * - Various status colors for dots
 */

const timelineVariants = cva("relative", {
  variants: {
    orientation: {
      vertical: "flex flex-col",
      horizontal: "flex flex-row overflow-x-auto",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(timelineVariants({ orientation }), className)}
      {...props}
    />
  )
);

Timeline.displayName = "Timeline";

// Timeline Item
const timelineItemVariants = cva("relative flex gap-4", {
  variants: {
    orientation: {
      vertical: "pb-8 last:pb-0",
      horizontal: "pr-8 last:pr-0 flex-shrink-0",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(timelineItemVariants({ orientation }), className)}
      {...props}
    />
  )
);

TimelineItem.displayName = "TimelineItem";

// Timeline Dot
const timelineDotVariants = cva(
  "relative z-10 flex items-center justify-center rounded-full border-2 border-background-default bg-background-default",
  {
    variants: {
      variant: {
        default: "bg-border-default",
        primary: "bg-foreground-brand",
        success: "bg-foreground-success",
        warning: "bg-foreground-warning",
        error: "bg-foreground-error",
        info: "bg-foreground-info",
      },
      size: {
        sm: "h-2 w-2",
        md: "h-3 w-3",
        lg: "h-4 w-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {
  /** Custom icon inside the dot */
  icon?: React.ReactNode;
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant, size, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        timelineDotVariants({ variant, size }),
        icon && "h-8 w-8",
        className
      )}
      {...props}
    >
      {icon}
    </div>
  )
);

TimelineDot.displayName = "TimelineDot";

// Timeline Connector
interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-border-default",
        orientation === "vertical"
          ? "absolute left-[5px] top-3 h-full w-0.5"
          : "absolute top-[5px] left-3 h-0.5 w-full",
        className
      )}
      {...props}
    />
  )
);

TimelineConnector.displayName = "TimelineConnector";

// Timeline Content
const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 pb-1", className)}
    {...props}
  />
));

TimelineContent.displayName = "TimelineContent";

// Timeline Header
const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));

TimelineHeader.displayName = "TimelineHeader";

// Timeline Title
const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-body-sm font-medium text-foreground-default", className)}
    {...props}
  />
));

TimelineTitle.displayName = "TimelineTitle";

// Timeline Time
const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    className={cn("text-caption-sm text-foreground-muted", className)}
    {...props}
  />
));

TimelineTime.displayName = "TimelineTime";

// Timeline Description
const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-caption text-foreground-muted mt-1", className)}
    {...props}
  />
));

TimelineDescription.displayName = "TimelineDescription";

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
};
