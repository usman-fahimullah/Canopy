import type { Shell } from "@/lib/onboarding/types";
import type { IconProps } from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// Employer org roles — control nav visibility in employer shell
// ---------------------------------------------------------------------------

export type EmployerOrgRole = "ADMIN" | "RECRUITER" | "HIRING_TEAM";

// ---------------------------------------------------------------------------
// Nav item types
// ---------------------------------------------------------------------------

/** A single navigation item in a shell sidebar */
export interface ShellNavItem {
  id: string;
  href: string;
  label: string;
  /** Phosphor icon component — omit if using customIcon */
  icon?: React.ComponentType<IconProps>;
  /** Icon weight — per Navigation-Spec, mix of "fill" and "bold" */
  iconWeight?: "fill" | "bold" | "regular";
  /** Custom SVG component for non-Phosphor icons (Treehouse, Profile) */
  customIcon?: React.ComponentType<{ size?: number; className?: string }>;
  /** If true, show user's profile image instead of icon */
  useProfileImage?: boolean;
  /** Badge count key — looked up via useNotifications or ShellUser.badges */
  badgeKey?: string;
  /** Employer-only: which org roles can see this item */
  requiredRoles?: EmployerOrgRole[];
}

/** A nav section (group of items with optional heading) */
export interface ShellNavSection {
  id: string;
  /** Section heading — hidden when sidebar is collapsed */
  label?: string;
  items: ShellNavItem[];
  /** If true, section only shows when user has the feature activated */
  progressive?: boolean;
  /** Feature key checked against user capabilities, e.g. "coaching" */
  progressiveFeature?: string;
}

/** Configuration for a shell's recents section */
export interface RecentsConfig {
  id: string;
  /** Display label, e.g. "Recent Applications" */
  label: string;
  /** API endpoint to fetch recents from */
  apiEndpoint: string;
  /** Message shown when no recents exist */
  emptyMessage: string;
  /** URL prefix for each recent item link */
  itemHrefPrefix: string;
}

/** Full navigation config for a shell */
export interface ShellNavConfig {
  shell: Shell;
  /** Where the logo links to (shell dashboard) */
  logoHref: string;
  /** Sidebar nav sections */
  sections: ShellNavSection[];
  /** Optional recents section config */
  recents?: RecentsConfig;
  /** Path to settings page for this shell */
  settingsHref: string;
  /** Path to notifications page for this shell */
  notificationsHref: string;
}

// ---------------------------------------------------------------------------
// Shell user context
// ---------------------------------------------------------------------------

/** User data available in shell context */
export interface ShellUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  activeShells: Shell[];
  primaryShell: Shell;
  currentShell: Shell;
  /** Employer org role — only set when in employer shell */
  employerOrgRole?: EmployerOrgRole;
  /** Badge counts by key */
  badges: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Recents item (returned from API)
// ---------------------------------------------------------------------------

export interface RecentItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}
