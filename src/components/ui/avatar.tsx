"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, getInitials } from "@/lib/utils";
import { CheckCircle, Clock, Warning, Star, User, BookmarkSimple } from "@phosphor-icons/react";
import { SimpleTooltip } from "./tooltip";

/* ============================================
   AVATAR COMPONENT - Trails Design System

   A versatile avatar component for displaying user images,
   initials, or icons with support for multiple visual variants,
   sizes, colors, and interactive states.

   Features:
   - Multiple sizes (xs to 2xl)
   - 7 color variants with WCAG AA compliant contrast
   - Visual variants: filled, outlined, soft, high-contrast
   - Shape variants: circle, square
   - Status indicators (online, offline, busy, away)
   - Badge indicators with icons
   - Tooltip showing full name
   - Dark mode support
   - Loading skeleton state
   - Interactive hover/focus states
   - Compound component API
   - Full accessibility support
   ============================================ */

// ============================================
// SIZE VARIANTS
// ============================================

const avatarVariants = cva(
  ["relative flex shrink-0 overflow-hidden", "border border-[var(--avatar-border)]", "select-none"],
  {
    variants: {
      // Figma sizes: 128px, 96px, 64px, 48px, 32px, 24px
      size: {
        "2xl": "h-32 w-32", // 128px
        xl: "h-24 w-24", // 96px
        lg: "h-16 w-16", // 64px
        default: "h-12 w-12", // 48px
        sm: "h-8 w-8", // 32px
        xs: "h-6 w-6", // 24px
      },
      // Shape variants
      shape: {
        circle: "rounded-full",
        square: "rounded-xl", // 12px radius as specified
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
    },
  }
);

// ============================================
// TYPOGRAPHY CONFIGURATION
// ============================================

// Font sizes that scale with avatar size
// Includes letter-spacing for better readability (#1)
// Uses semibold for better legibility at small sizes (#3)
type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>["size"]>;

const fontSizeMap: Record<AvatarSize, string> = {
  "2xl": "text-5xl font-semibold tracking-wide", // 48px
  xl: "text-4xl font-semibold tracking-wide", // 36px
  lg: "text-2xl font-semibold tracking-wide", // 24px
  default: "text-xl font-semibold tracking-wide", // 20px
  sm: "text-sm font-semibold tracking-normal", // 14px - single initial
  xs: "text-xs font-bold tracking-normal", // 12px - single initial
};

// Number of initials to show based on size (#2)
// Smaller sizes show single initial for better fit
const initialsCountMap: Record<AvatarSize, number> = {
  "2xl": 2,
  xl: 2,
  lg: 2,
  default: 2,
  sm: 1, // Single initial for small sizes
  xs: 1, // Single initial for extra small
};

// ============================================
// COLOR CONFIGURATION - Option B: Vibrant Mid-tones
// ============================================

/**
 * Available avatar colors
 * All colors meet WCAG AA contrast requirements (4.5:1+)
 */
export type AvatarColor = "green" | "blue" | "purple" | "red" | "orange" | "yellow" | "neutral";

/**
 * Visual style variants for the avatar
 */
export type AvatarVariant = "filled" | "outlined" | "soft" | "high-contrast";

// Color configuration using CSS custom properties (#32)
// Filled variant: vibrant backgrounds with dark text
const filledColorConfig: Record<AvatarColor, { bg: string; text: string }> = {
  green: {
    bg: "bg-[var(--avatar-green-background)] dark:bg-[var(--primitive-green-700)]/20",
    text: "text-[var(--avatar-green-foreground)] dark:text-[var(--primitive-green-300)]",
  },
  blue: {
    bg: "bg-[var(--avatar-blue-background)] dark:bg-[var(--primitive-blue-700)]/20",
    text: "text-[var(--avatar-blue-foreground)] dark:text-[var(--primitive-blue-300)]",
  },
  purple: {
    bg: "bg-[var(--avatar-purple-background)] dark:bg-[var(--primitive-purple-700)]/20",
    text: "text-[var(--avatar-purple-foreground)] dark:text-[var(--primitive-purple-300)]",
  },
  red: {
    bg: "bg-[var(--avatar-red-background)] dark:bg-[var(--primitive-red-700)]/20",
    text: "text-[var(--avatar-red-foreground)] dark:text-[var(--primitive-red-300)]",
  },
  orange: {
    bg: "bg-[var(--avatar-orange-background)] dark:bg-[var(--primitive-orange-700)]/20",
    text: "text-[var(--avatar-orange-foreground)] dark:text-[var(--primitive-orange-300)]",
  },
  yellow: {
    bg: "bg-[var(--avatar-yellow-background)] dark:bg-[var(--primitive-yellow-700)]/20",
    text: "text-[var(--avatar-yellow-foreground)] dark:text-[var(--primitive-yellow-300)]",
  },
  neutral: {
    bg: "bg-[var(--avatar-neutral-background)] dark:bg-[var(--primitive-neutral-700)]/20",
    text: "text-[var(--avatar-neutral-foreground)] dark:text-[var(--primitive-neutral-300)]",
  },
};

// Soft variant: lighter backgrounds (#13)
const softColorConfig: Record<AvatarColor, { bg: string; text: string }> = {
  green: {
    bg: "bg-[var(--avatar-green-background-soft)] dark:bg-[var(--primitive-green-800)]/15",
    text: "text-[var(--avatar-green-foreground)] dark:text-[var(--primitive-green-400)]",
  },
  blue: {
    bg: "bg-[var(--avatar-blue-background-soft)] dark:bg-[var(--primitive-blue-800)]/15",
    text: "text-[var(--avatar-blue-foreground)] dark:text-[var(--primitive-blue-400)]",
  },
  purple: {
    bg: "bg-[var(--avatar-purple-background-soft)] dark:bg-[var(--primitive-purple-800)]/15",
    text: "text-[var(--avatar-purple-foreground)] dark:text-[var(--primitive-purple-400)]",
  },
  red: {
    bg: "bg-[var(--avatar-red-background-soft)] dark:bg-[var(--primitive-red-800)]/15",
    text: "text-[var(--avatar-red-foreground)] dark:text-[var(--primitive-red-400)]",
  },
  orange: {
    bg: "bg-[var(--avatar-orange-background-soft)] dark:bg-[var(--primitive-orange-800)]/15",
    text: "text-[var(--avatar-orange-foreground)] dark:text-[var(--primitive-orange-400)]",
  },
  yellow: {
    bg: "bg-[var(--avatar-yellow-background-soft)] dark:bg-[var(--primitive-yellow-800)]/15",
    text: "text-[var(--avatar-yellow-foreground)] dark:text-[var(--primitive-yellow-400)]",
  },
  neutral: {
    bg: "bg-[var(--avatar-neutral-background-soft)] dark:bg-[var(--primitive-neutral-800)]/15",
    text: "text-[var(--avatar-neutral-foreground)] dark:text-[var(--primitive-neutral-400)]",
  },
};

// Outlined variant: transparent bg with colored border (#12)
const outlinedColorConfig: Record<AvatarColor, { bg: string; text: string; border: string }> = {
  green: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-green-foreground)] dark:text-[var(--primitive-green-400)]",
    border: "border-2 border-[var(--avatar-green-border)] dark:border-[var(--primitive-green-500)]",
  },
  blue: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-blue-foreground)] dark:text-[var(--primitive-blue-400)]",
    border: "border-2 border-[var(--avatar-blue-border)] dark:border-[var(--primitive-blue-500)]",
  },
  purple: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-purple-foreground)] dark:text-[var(--primitive-purple-400)]",
    border:
      "border-2 border-[var(--avatar-purple-border)] dark:border-[var(--primitive-purple-500)]",
  },
  red: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-red-foreground)] dark:text-[var(--primitive-red-400)]",
    border: "border-2 border-[var(--avatar-red-border)] dark:border-[var(--primitive-red-500)]",
  },
  orange: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-orange-foreground)] dark:text-[var(--primitive-orange-400)]",
    border:
      "border-2 border-[var(--avatar-orange-border)] dark:border-[var(--primitive-orange-500)]",
  },
  yellow: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-yellow-foreground)] dark:text-[var(--primitive-yellow-400)]",
    border:
      "border-2 border-[var(--avatar-yellow-border)] dark:border-[var(--primitive-yellow-500)]",
  },
  neutral: {
    bg: "bg-transparent dark:bg-transparent",
    text: "text-[var(--avatar-neutral-foreground)] dark:text-[var(--primitive-neutral-400)]",
    border:
      "border-2 border-[var(--avatar-neutral-border)] dark:border-[var(--primitive-neutral-500)]",
  },
};

// High contrast variant for accessibility (#9)
const highContrastConfig = {
  bg: "bg-[var(--avatar-high-contrast-background)] dark:bg-[var(--primitive-neutral-0)]",
  text: "text-[var(--avatar-high-contrast-foreground)] dark:text-[var(--primitive-neutral-800)]",
};

/**
 * Generate a consistent color based on a string (name or email)
 * Uses a simple hash function for deterministic results (#25)
 */
function getColorFromString(str: string): AvatarColor {
  const colors: AvatarColor[] = ["green", "blue", "purple", "red", "orange", "yellow"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ============================================
// STATUS INDICATOR CONFIGURATION
// ============================================

export type AvatarStatus = "online" | "offline" | "busy" | "away";

const statusConfig: Record<AvatarStatus, { color: string; label: string; pulseColor?: string }> = {
  online: {
    color: "bg-[var(--primitive-green-500)]",
    label: "Online",
    pulseColor: "rgba(94, 204, 112, 0.5)",
  },
  offline: { color: "bg-[var(--primitive-neutral-400)]", label: "Offline" },
  busy: { color: "bg-[var(--primitive-red-500)]", label: "Busy" },
  away: { color: "bg-[var(--primitive-yellow-500)]", label: "Away" },
};

const statusSizeMap: Record<AvatarSize, { size: string; border: string; position: string }> = {
  xs: { size: "w-1.5 h-1.5", border: "border", position: "bottom-0 right-0" },
  sm: { size: "w-2 h-2", border: "border", position: "bottom-0 right-0" },
  default: { size: "w-2.5 h-2.5", border: "border-2", position: "bottom-0 right-0" },
  lg: { size: "w-3 h-3", border: "border-2", position: "bottom-0.5 right-0.5" },
  xl: { size: "w-4 h-4", border: "border-2", position: "bottom-1 right-1" },
  "2xl": { size: "w-5 h-5", border: "border-2", position: "bottom-1.5 right-1.5" },
};

// ============================================
// BADGE INDICATOR CONFIGURATION
// ============================================

export type AvatarBadge = "success" | "critical" | "favorite" | "bipoc" | "bookmark" | "clock";

const badgeConfig: Record<
  AvatarBadge,
  { bg: string; iconColor: string; label: string; icon: React.ElementType }
> = {
  success: {
    bg: "bg-[var(--primitive-green-200)]",
    iconColor: "text-[var(--primitive-green-600)]",
    label: "Success",
    icon: CheckCircle,
  },
  clock: {
    bg: "bg-[var(--primitive-green-200)]",
    iconColor: "text-[var(--primitive-green-600)]",
    label: "Clock",
    icon: Clock,
  },
  critical: {
    bg: "bg-[var(--primitive-red-100)]",
    iconColor: "text-[var(--primitive-red-500)]",
    label: "Critical",
    icon: Warning,
  },
  favorite: {
    bg: "bg-[var(--primitive-yellow-100)]",
    iconColor: "text-[var(--primitive-yellow-500)]",
    label: "Favorite",
    icon: Star,
  },
  bipoc: {
    bg: "bg-[var(--primitive-purple-200)]",
    iconColor: "text-[var(--primitive-purple-700)]",
    label: "BIPOC Owned",
    icon: User,
  },
  bookmark: {
    bg: "bg-[var(--primitive-blue-100)]",
    iconColor: "text-[var(--primitive-blue-500)]",
    label: "Bookmarked",
    icon: BookmarkSimple,
  },
};

const badgeSizeMap: Record<AvatarSize, { container: string; icon: string; offset: string }> = {
  xs: { container: "w-3.5 h-3.5", icon: "w-2 h-2", offset: "bottom-[-2px] right-[-2px]" },
  sm: { container: "w-4 h-4", icon: "w-2.5 h-2.5", offset: "bottom-[-3px] right-[-3px]" },
  default: { container: "w-5 h-5", icon: "w-3.5 h-3.5", offset: "bottom-[-4px] right-[-4px]" },
  lg: { container: "w-5 h-5", icon: "w-3.5 h-3.5", offset: "bottom-[-4px] right-[-4px]" },
  xl: { container: "w-6 h-6", icon: "w-4 h-4", offset: "bottom-[-4px] right-[-4px]" },
  "2xl": { container: "w-7 h-7", icon: "w-5 h-5", offset: "bottom-[-4px] right-[-4px]" },
};

// Icon size mapping for icon fallback
const iconSizeMap: Record<AvatarSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  default: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
  "2xl": "w-16 h-16",
};

// ============================================
// AVATAR PROPS INTERFACE
// ============================================

export interface AvatarProps
  extends
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Name for generating initials fallback */
  name?: string;
  /** Email for color generation when name unavailable (#20) */
  email?: string;
  /** Custom fallback content (#21) */
  fallback?: React.ReactNode;
  /** Custom fallback character when no name (default: "?") (#21) */
  fallbackChar?: string;
  /** Phosphor icon component to display as fallback */
  icon?: React.ElementType;
  /** Maximum number of initials to show (overrides size-based default) (#22) */
  maxInitials?: 1 | 2 | 3;
  /** Simple status indicator dot */
  status?: AvatarStatus;
  /** Badge indicator with icon */
  badge?: AvatarBadge;
  /** Custom badge icon */
  badgeIcon?: React.ReactNode;
  /** Color variant for fallback */
  color?: AvatarColor;
  /** Visual style variant (#12, #13, #9) */
  variant?: AvatarVariant;
  /** Shape variant (#14) */
  shape?: "circle" | "square";
  /** Enable interactive hover/focus states */
  interactive?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Show loading skeleton state */
  loading?: boolean;
  /** Show tooltip with full name on hover (#18) */
  showTooltip?: boolean;
  /** Tooltip content (defaults to name) */
  tooltipContent?: React.ReactNode;
  /** Tooltip position */
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

// ============================================
// AVATAR COMPONENT
// ============================================

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  (
    {
      className,
      size = "default",
      shape = "circle",
      src,
      alt,
      name,
      email,
      fallback,
      fallbackChar = "?",
      icon: IconComponent,
      maxInitials,
      status,
      badge,
      badgeIcon,
      color,
      variant = "filled",
      interactive,
      onClick,
      loading,
      showTooltip = false,
      tooltipContent,
      tooltipSide = "top",
      ...props
    },
    ref
  ) => {
    // Track image loading state for smooth transitions
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    // Reset states when src changes
    React.useEffect(() => {
      setImageLoaded(false);
      setImageError(false);
    }, [src]);

    // Determine color from name or email (#20, #25)
    const avatarColor =
      color || (name ? getColorFromString(name) : email ? getColorFromString(email) : "neutral");

    // Get color classes based on variant (#12, #13, #9)
    const getColorClasses = () => {
      if (variant === "high-contrast") {
        return { bg: highContrastConfig.bg, text: highContrastConfig.text, border: "" };
      }
      if (variant === "outlined") {
        const config = outlinedColorConfig[avatarColor];
        return { bg: config.bg, text: config.text, border: config.border };
      }
      if (variant === "soft") {
        const config = softColorConfig[avatarColor];
        return { bg: config.bg, text: config.text, border: "" };
      }
      // Default: filled
      const config = filledColorConfig[avatarColor];
      return { bg: config.bg, text: config.text, border: "" };
    };

    const colorClasses = getColorClasses();
    const fontClass = fontSizeMap[size || "default"];
    const iconClass = iconSizeMap[size || "default"];

    // Determine number of initials (#2, #22)
    const effectiveMaxInitials = maxInitials ?? initialsCountMap[size || "default"];

    // Generate initials with improved function (#4, #23, #24)
    const initials = name ? getInitials(name, effectiveMaxInitials) : fallbackChar;

    // Determine if avatar should be interactive (#17, #19)
    const isInteractive = interactive || !!onClick;

    // Get badge config and sizing
    const badgeData = badge ? badgeConfig[badge] : null;
    const badgeSize = badgeSizeMap[size || "default"];
    const BadgeIcon = badgeData?.icon;

    // Improved aria-label (#26)
    const ariaLabel = name
      ? `${initials} - ${name}${status ? `, ${statusConfig[status].label}` : ""}`
      : alt || "Avatar";

    // Wrapper element - use button if interactive, div otherwise
    const WrapperElement = isInteractive ? "button" : "div";
    const wrapperProps = isInteractive
      ? {
          type: "button" as const,
          onClick,
          "aria-label": `View ${name || "profile"}`,
        }
      : {};

    // Loading skeleton state
    if (loading) {
      return (
        <div
          className={cn(
            avatarVariants({ size, shape }),
            "animate-avatar-shimmer",
            "bg-gradient-to-r from-[var(--primitive-neutral-200)] via-[var(--primitive-neutral-100)] to-[var(--primitive-neutral-200)]",
            "bg-[length:200%_100%]",
            className
          )}
          aria-label="Loading avatar"
          aria-busy="true"
        />
      );
    }

    const avatarElement = (
      <WrapperElement
        className={cn(
          "relative inline-block",
          isInteractive && [
            "cursor-pointer",
            // Smooth transitions (#27)
            "transition-all duration-200 ease-out motion-reduce:transition-none",
            // Focus ring (#28)
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avatar-ring)] focus-visible:ring-offset-2",
            // Hover: scale + lift (#17)
            "hover:-translate-y-0.5 hover:scale-105",
            // Active/press feedback (#19)
            "active:translate-y-0 active:scale-[0.98]",
            shape === "circle" ? "rounded-full" : "rounded-xl",
          ]
        )}
        {...wrapperProps}
      >
        <AvatarPrimitive.Root
          ref={ref}
          aria-label={ariaLabel}
          className={cn(
            avatarVariants({ size, shape }),
            variant === "outlined" && colorClasses.border,
            variant !== "outlined" && "border-[var(--avatar-border)]",
            isInteractive && [
              "transition-shadow duration-200 ease-out motion-reduce:transition-none",
              "hover:shadow-[var(--avatar-shadow-hover)]",
            ],
            className
          )}
          {...props}
        >
          {src && !imageError && (
            <AvatarPrimitive.Image
              className={cn(
                "aspect-square h-full w-full object-cover",
                "transition-opacity duration-300 ease-out motion-reduce:transition-none",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              src={src}
              alt={alt || name || "Avatar"}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          <AvatarPrimitive.Fallback
            className={cn(
              "flex h-full w-full items-center justify-center",
              colorClasses.bg,
              colorClasses.text,
              // Fallback reveal animation (#16, #27)
              "motion-safe:animate-avatar-fallback-reveal",
              // Show fallback when no image, image errored, or image not yet loaded
              src && imageLoaded && !imageError ? "opacity-0" : "opacity-100"
            )}
            delayMs={src ? 0 : 600}
          >
            {/* Priority: fallback > icon > initials */}
            {fallback ||
              (IconComponent ? (
                <IconComponent
                  weight="fill"
                  className={cn(iconClass, "select-none")}
                  aria-hidden="true"
                />
              ) : (
                <span className={cn(fontClass, "select-none")} aria-hidden="true">
                  {initials}
                </span>
              ))}
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>

        {/* Simple status indicator dot with enhanced visibility */}
        {status && !badge && (
          <span
            role="status"
            aria-label={statusConfig[status].label}
            aria-live="polite"
            className={cn(
              "absolute rounded-full border-white",
              statusSizeMap[size || "default"].size,
              statusSizeMap[size || "default"].border,
              statusSizeMap[size || "default"].position,
              statusConfig[status].color,
              "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
              // Pulse animation for online status (respects reduced motion) (#27)
              status === "online" && "motion-safe:animate-avatar-status-pulse"
            )}
            style={
              status === "online" && statusConfig[status].pulseColor
                ? ({
                    "--avatar-status-pulse-color": statusConfig[status].pulseColor,
                  } as React.CSSProperties)
                : undefined
            }
            title={statusConfig[status].label}
          />
        )}

        {/* Badge indicator with icon */}
        {badge && badgeData && (
          <span
            role="status"
            aria-label={badgeData.label}
            className={cn(
              "absolute flex items-center justify-center rounded-full border-2 border-white",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
              badgeSize.offset,
              badgeSize.container,
              badgeData.bg
            )}
            title={badgeData.label}
          >
            {badgeIcon ||
              (BadgeIcon && (
                <BadgeIcon weight="fill" className={cn(badgeSize.icon, badgeData.iconColor)} />
              ))}
          </span>
        )}
      </WrapperElement>
    );

    // Wrap with tooltip if enabled (#18)
    if (showTooltip && (name || tooltipContent)) {
      return (
        <SimpleTooltip content={tooltipContent || name} side={tooltipSide} delayDuration={300}>
          {avatarElement}
        </SimpleTooltip>
      );
    }

    return avatarElement;
  }
);

Avatar.displayName = "Avatar";

// ============================================
// AVATAR GROUP COMPONENT
// ============================================

const overlapMap: Record<AvatarSize, string> = {
  xs: "-space-x-1",
  sm: "-space-x-1.5",
  default: "-space-x-2",
  lg: "-space-x-2.5",
  xl: "-space-x-3",
  "2xl": "-space-x-4",
};

const expandedSpacingMap: Record<AvatarSize, string> = {
  xs: "space-x-0.5",
  sm: "space-x-1",
  default: "space-x-1",
  lg: "space-x-1.5",
  xl: "space-x-2",
  "2xl": "space-x-2",
};

export interface AvatarData {
  id?: string;
  src?: string;
  name?: string;
  email?: string;
  alt?: string;
  status?: AvatarStatus;
  color?: AvatarColor;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  avatars?: AvatarData[];
  overlap?: "none" | "sm" | "md" | "lg";
  reverse?: boolean;
  expandOnHover?: boolean;
  variant?: "ring" | "border";
  shape?: "circle" | "square";
  onAvatarClick?: (avatar: AvatarData, index: number) => void;
  onOverflowClick?: (hiddenAvatars: AvatarData[]) => void;
  children?: React.ReactNode;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      max = 4,
      size = "default",
      avatars = [],
      overlap,
      reverse = false,
      expandOnHover = false,
      variant = "ring",
      shape = "circle",
      onAvatarClick,
      onOverflowClick,
      children,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    if (children) {
      const overlapClass = overlap
        ? {
            none: "space-x-1",
            sm: "-space-x-1",
            md: "-space-x-2",
            lg: "-space-x-3",
          }[overlap]
        : overlapMap[size || "default"];

      return (
        <div
          ref={ref}
          role="group"
          aria-label="Avatar group"
          className={cn("flex items-center", overlapClass, className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const visibleAvatars = avatars.slice(0, max);
    const hiddenAvatars = avatars.slice(max);
    const remainingCount = hiddenAvatars.length;

    const getSpacingClass = () => {
      if (expandOnHover && isHovered) {
        return expandedSpacingMap[size || "default"];
      }
      if (overlap) {
        return {
          none: "space-x-1",
          sm: "-space-x-1",
          md: "-space-x-2",
          lg: "-space-x-3",
        }[overlap];
      }
      return overlapMap[size || "default"];
    };

    const getBorderClass = () => {
      if (variant === "border") {
        return "border-2 border-white";
      }
      return "ring-2 ring-white";
    };

    const orderedAvatars = reverse ? [...visibleAvatars].reverse() : visibleAvatars;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`Group of ${avatars.length} avatars`}
        className={cn(
          "flex items-center transition-all duration-200 motion-reduce:transition-none",
          getSpacingClass(),
          className
        )}
        onMouseEnter={() => expandOnHover && setIsHovered(true)}
        onMouseLeave={() => expandOnHover && setIsHovered(false)}
        {...props}
      >
        {orderedAvatars.map((avatar, index) => {
          const zIndex = reverse ? visibleAvatars.length - index : index + 1;

          return (
            <div
              key={avatar.id || index}
              className={cn(
                "relative transition-transform duration-200 motion-reduce:transition-none",
                onAvatarClick && "cursor-pointer hover:scale-110",
                expandOnHover && isHovered && "hover:z-50"
              )}
              style={{ zIndex }}
              onClick={() => onAvatarClick?.(avatar, index)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onAvatarClick) {
                  e.preventDefault();
                  onAvatarClick(avatar, index);
                }
              }}
              tabIndex={onAvatarClick ? 0 : undefined}
              role={onAvatarClick ? "button" : undefined}
              aria-label={onAvatarClick ? `View ${avatar.name || "avatar"}` : undefined}
            >
              <Avatar
                size={size}
                shape={shape}
                src={avatar.src}
                name={avatar.name}
                email={avatar.email}
                alt={avatar.alt}
                status={avatar.status}
                color={avatar.color}
                className={getBorderClass()}
                showTooltip
              />
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div
            className={cn("group relative", onOverflowClick && "cursor-pointer")}
            style={{ zIndex: reverse ? 0 : visibleAvatars.length + 1 }}
            onClick={() => onOverflowClick?.(hiddenAvatars)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && onOverflowClick) {
                e.preventDefault();
                onOverflowClick(hiddenAvatars);
              }
            }}
            tabIndex={onOverflowClick ? 0 : undefined}
            role={onOverflowClick ? "button" : undefined}
            aria-label={`${remainingCount} more people`}
          >
            <div
              className={cn(
                avatarVariants({ size, shape }),
                "flex items-center justify-center",
                "bg-[var(--primitive-neutral-200)] font-medium text-[var(--primitive-neutral-600)]",
                fontSizeMap[size || "default"],
                getBorderClass(),
                onOverflowClick &&
                  "transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none"
              )}
            >
              +{remainingCount}
            </div>
            {/* Tooltip showing hidden names */}
            <div
              className={cn(
                "absolute bottom-full left-1/2 mb-2 -translate-x-1/2 px-3 py-2",
                "bg-[var(--primitive-neutral-800)] text-white",
                "rounded-lg text-sm shadow-lg",
                "invisible opacity-0 group-hover:visible group-hover:opacity-100",
                "z-50 transition-all duration-200",
                "max-w-xs whitespace-nowrap"
              )}
              role="tooltip"
            >
              <div className="space-y-0.5">
                {hiddenAvatars.slice(0, 5).map((avatar, i) => (
                  <div key={avatar.id || i} className="truncate">
                    {avatar.name || "Unknown"}
                  </div>
                ))}
                {hiddenAvatars.length > 5 && (
                  <div className="text-[var(--primitive-neutral-400)]">
                    and {hiddenAvatars.length - 5} more...
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "absolute left-1/2 top-full -translate-x-1/2",
                  "border-4 border-transparent border-t-[var(--primitive-neutral-800)]"
                )}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

// ============================================
// AVATAR STACK COMPONENT
// ============================================

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: AvatarData[];
  label?: string;
  size?: "default" | "large";
  maxVisible?: number;
  showCount?: boolean;
  shape?: "circle" | "square";
}

const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
  (
    {
      className,
      avatars,
      label = "",
      size = "default",
      maxVisible,
      showCount = true,
      shape = "circle",
      ...props
    },
    ref
  ) => {
    const avatarSize: AvatarSize = size === "large" ? "default" : "sm";
    const overlapClass = size === "large" ? "-ml-6" : "-ml-4";
    const paddingRightClass = size === "large" ? "pr-6" : "pr-4";
    const overflowFontClass = size === "large" ? "text-lg leading-6" : "text-sm leading-5";

    const totalCount = avatars.length;
    const effectiveMax = maxVisible ?? (totalCount > 3 ? 2 : totalCount);
    const visibleAvatars = avatars.slice(0, effectiveMax);
    const remainingCount = totalCount - effectiveMax;
    const showOverflow = remainingCount > 0;

    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        <div className={cn("flex items-start", paddingRightClass)}>
          {visibleAvatars.map((avatar, index) => (
            <div
              key={avatar.id || index}
              className={cn(
                "shrink-0 overflow-hidden rounded-full border-2 border-white",
                shape === "square" && "rounded-xl",
                index > 0 && overlapClass
              )}
              style={{ zIndex: visibleAvatars.length - index }}
            >
              <Avatar
                size={avatarSize}
                shape={shape}
                src={avatar.src}
                name={avatar.name}
                email={avatar.email}
                alt={avatar.alt}
                color={avatar.color}
                className="border-0"
              />
            </div>
          ))}

          {showOverflow && (
            <div
              className={cn(
                "shrink-0 overflow-hidden rounded-full border-2 border-white",
                shape === "square" && "rounded-xl",
                "bg-[var(--primitive-blue-200)]",
                "flex items-center justify-center",
                overlapClass,
                size === "large" ? "size-12" : "size-8"
              )}
              style={{ zIndex: 0 }}
            >
              <span
                className={cn(
                  "text-center font-bold text-[var(--primitive-green-800)]",
                  overflowFontClass
                )}
              >
                {remainingCount}+
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-0.5 text-sm text-[var(--primitive-neutral-800)]",
            "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
          )}
        >
          {showCount && <span>{totalCount}</span>}
          {label && <span className="truncate">{label}</span>}
        </div>
      </div>
    );
  }
);

AvatarStack.displayName = "AvatarStack";

// ============================================
// COMPOUND COMPONENT API (#33)
// ============================================

/**
 * Avatar compound components for advanced composition
 *
 * @example
 * ```tsx
 * <Avatar.Root size="lg" shape="square">
 *   <Avatar.Image src="/photo.jpg" alt="John Doe" />
 *   <Avatar.Fallback color="green">JD</Avatar.Fallback>
 *   <Avatar.Status status="online" />
 * </Avatar.Root>
 * ```
 */
const AvatarRoot = AvatarPrimitive.Root;
const AvatarImage = AvatarPrimitive.Image;
const AvatarFallback = AvatarPrimitive.Fallback;

interface AvatarStatusIndicatorProps {
  status: AvatarStatus;
  size?: AvatarSize;
  className?: string;
}

const AvatarStatusIndicator = ({
  status,
  size = "default",
  className,
}: AvatarStatusIndicatorProps) => (
  <span
    role="status"
    aria-label={statusConfig[status].label}
    aria-live="polite"
    className={cn(
      "absolute rounded-full border-white",
      statusSizeMap[size].size,
      statusSizeMap[size].border,
      statusSizeMap[size].position,
      statusConfig[status].color,
      "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
      status === "online" && "motion-safe:animate-avatar-status-pulse",
      className
    )}
    style={
      status === "online" && statusConfig[status].pulseColor
        ? ({
            "--avatar-status-pulse-color": statusConfig[status].pulseColor,
          } as React.CSSProperties)
        : undefined
    }
    title={statusConfig[status].label}
  />
);

interface AvatarBadgeIndicatorProps {
  badge: AvatarBadge;
  size?: AvatarSize;
  customIcon?: React.ReactNode;
  className?: string;
}

const AvatarBadgeIndicator = ({
  badge,
  size = "default",
  customIcon,
  className,
}: AvatarBadgeIndicatorProps) => {
  const badgeData = badgeConfig[badge];
  const badgeSize = badgeSizeMap[size];
  const BadgeIcon = badgeData.icon;

  return (
    <span
      role="status"
      aria-label={badgeData.label}
      className={cn(
        "absolute flex items-center justify-center rounded-full border-2 border-white",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        badgeSize.offset,
        badgeSize.container,
        badgeData.bg,
        className
      )}
      title={badgeData.label}
    >
      {customIcon || (
        <BadgeIcon weight="fill" className={cn(badgeSize.icon, badgeData.iconColor)} />
      )}
    </span>
  );
};

interface AvatarInitialsProps {
  name: string;
  maxInitials?: 1 | 2 | 3;
  size?: AvatarSize;
  className?: string;
}

const AvatarInitials = ({
  name,
  maxInitials,
  size = "default",
  className,
}: AvatarInitialsProps) => {
  const effectiveMax = maxInitials ?? initialsCountMap[size];
  const initials = getInitials(name, effectiveMax);
  const fontClass = fontSizeMap[size];

  return (
    <span className={cn(fontClass, "select-none", className)} aria-hidden="true">
      {initials}
    </span>
  );
};

// Attach compound components to Avatar
const AvatarNamespace = Object.assign(Avatar, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Status: AvatarStatusIndicator,
  Badge: AvatarBadgeIndicator,
  Initials: AvatarInitials,
});

// ============================================
// EXPORTS
// ============================================

export {
  AvatarNamespace as Avatar,
  AvatarGroup,
  AvatarStack,
  avatarVariants,
  // Compound components
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarStatusIndicator,
  AvatarBadgeIndicator,
  AvatarInitials,
  // Utility functions
  getColorFromString,
};
