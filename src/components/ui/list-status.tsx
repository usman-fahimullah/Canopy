"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle, Heart, Warning, Star, BookmarkSimple } from "@phosphor-icons/react";

/**
 * ListStatus component based on Figma Design System (1281:4500)
 *
 * A circular status indicator badge with an icon, used to show different states
 * like critical alerts, favorites, success, BIPOC-owned businesses, or bookmarks.
 *
 * This is a standalone version of the badge used in Avatar components.
 *
 * Figma Specs:
 * - Size: 20px diameter (default)
 * - Border: white, scales proportionally (~10% of container size)
 * - Border radius: full (24px in Figma, but we use rounded-full)
 * - Icon: 14px (fits within 14px inner area after border)
 *
 * Variants:
 * - Critical: red-100 bg (#FFEBF4), red-500 icon (#FF5C5C), Warning icon
 * - Favorite: yellow-100 bg (#FFF7D6), yellow-400 icon (#FFCE47), Star icon
 * - Success: green-200 bg (#DCFAC8), green-600 icon (#3BA36F), CheckCircle icon
 * - BIPOC Owned: purple-200 bg (#F1E0FF), purple-600 icon (#5B1DB8), Heart icon
 * - Bookmark: blue-100 bg (#E5F1FF), blue-500 icon (#3369FF), Bookmark icon
 */

export type ListStatusVariant = "critical" | "favorite" | "success" | "bipoc" | "bookmark";

const listStatusConfig: Record<
  ListStatusVariant,
  { bg: string; iconColor: string; label: string; icon: React.ElementType }
> = {
  critical: {
    bg: "bg-[var(--primitive-red-100)]",
    iconColor: "text-[var(--primitive-red-500)]",
    label: "Critical",
    icon: Warning,
  },
  favorite: {
    bg: "bg-[var(--primitive-yellow-100)]",
    iconColor: "text-[var(--primitive-yellow-400)]",
    label: "Favorite",
    icon: Star,
  },
  success: {
    bg: "bg-[var(--primitive-green-200)]",
    iconColor: "text-[var(--primitive-green-600)]",
    label: "Success",
    icon: CheckCircle,
  },
  bipoc: {
    bg: "bg-[var(--primitive-purple-200)]",
    iconColor: "text-[var(--primitive-purple-600)]",
    label: "BIPOC Owned",
    icon: Heart,
  },
  bookmark: {
    bg: "bg-[var(--primitive-blue-100)]",
    iconColor: "text-[var(--primitive-blue-500)]",
    label: "Bookmarked",
    icon: BookmarkSimple,
  },
};

const listStatusVariants = cva(
  ["inline-flex items-center justify-center", "rounded-full", "border-white"],
  {
    variants: {
      size: {
        sm: "size-4 border-[1.5px]", // 16px — pairs with xs avatar (24px)
        default: "size-5 border-2", // 20px — Figma default
        lg: "size-6 border-[2.5px]", // 24px — pairs with default avatar (48px)
        xl: "size-8 border-[3px]", // 32px — pairs with lg avatar (64px)
        "2xl": "size-12 border-4", // 48px — pairs with xl avatar (96px)
        "3xl": "size-16 border-[5px]", // 64px — pairs with 2xl avatar (128px)
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const iconSizeMap: Record<NonNullable<VariantProps<typeof listStatusVariants>["size"]>, string> = {
  sm: "size-2.5", // 10px
  default: "size-3.5", // 14px
  lg: "size-4", // 16px
  xl: "size-5", // 20px
  "2xl": "size-8", // 32px
  "3xl": "size-10", // 40px
};

export interface ListStatusProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof listStatusVariants> {
  /** The status variant to display */
  variant: ListStatusVariant;
  /** Custom icon to override the default icon for the variant */
  icon?: React.ReactNode;
  /** Whether to show the border (default: true) */
  bordered?: boolean;
}

const ListStatus = React.forwardRef<HTMLSpanElement, ListStatusProps>(
  ({ className, variant, size = "default", icon, bordered = true, ...props }, ref) => {
    const config = listStatusConfig[variant];
    const IconComponent = config.icon;
    const iconSize = iconSizeMap[size || "default"];

    return (
      <span
        ref={ref}
        role="status"
        aria-label={config.label}
        title={config.label}
        className={cn(listStatusVariants({ size }), config.bg, !bordered && "border-0", className)}
        {...props}
      >
        {icon || (
          <IconComponent
            weight="fill"
            className={cn(iconSize, config.iconColor)}
            aria-hidden="true"
          />
        )}
      </span>
    );
  }
);

ListStatus.displayName = "ListStatus";

export { ListStatus, listStatusVariants, listStatusConfig };
