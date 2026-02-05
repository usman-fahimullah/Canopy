/**
 * Checklist configuration — single source of truth for all shell getting-started items.
 *
 * Both the API (`/api/checklist`) and the UI (`DashboardChecklist`) import from here.
 * Item IDs are stable and used for localStorage persistence + API auto-detection.
 */

import type { Shell } from "@/lib/onboarding/types";

// ─── Types ───────────────────────────────────────────────────────

export interface ChecklistItemConfig {
  id: string;
  label: string;
  description: string;
  href: string;
}

// ─── Checklist Items Per Shell ───────────────────────────────────

export const CHECKLIST_ITEMS: Record<Shell, ChecklistItemConfig[]> = {
  talent: [
    {
      id: "profile",
      label: "Complete your profile",
      description: "Add your background and climate career goals",
      href: "/jobs/profile",
    },
    {
      id: "skills",
      label: "Add skills & sectors",
      description: "Help us find the best job matches for you",
      href: "/jobs/profile",
    },
    {
      id: "preferences",
      label: "Set job preferences",
      description: "Choose role types, locations, and salary range",
      href: "/jobs/profile",
    },
    {
      id: "browse",
      label: "Browse job listings",
      description: "Explore climate roles that match your profile",
      href: "/jobs/search",
    },
    {
      id: "save",
      label: "Save your first job",
      description: "Bookmark roles you're interested in",
      href: "/jobs/search",
    },
  ],
  coach: [
    {
      id: "profile",
      label: "Set up your coach profile",
      description: "Add your headline, bio, and expertise",
      href: "/candid/coach/settings",
    },
    {
      id: "availability",
      label: "Set your availability",
      description: "Choose when you're available for sessions",
      href: "/candid/coach/schedule",
    },
    {
      id: "rate",
      label: "Set your hourly rate",
      description: "Configure your session pricing",
      href: "/candid/coach/settings",
    },
    {
      id: "stripe",
      label: "Connect Stripe for payments",
      description: "Set up payouts to receive earnings",
      href: "/candid/coach/settings",
    },
    {
      id: "verified",
      label: "Get verified",
      description: "Complete verification to start accepting clients",
      href: "/candid/coach/settings",
    },
  ],
  employer: [
    {
      id: "company",
      label: "Add company information",
      description: "Set up your company profile and brand",
      href: "/canopy/settings",
    },
    {
      id: "role",
      label: "Post your first role",
      description: "Create a job listing to start receiving applications",
      href: "/canopy/roles",
    },
    {
      id: "team",
      label: "Invite a team member",
      description: "Collaborate on hiring with your colleagues",
      href: "/canopy/team",
    },
    {
      id: "pipeline",
      label: "Set up your pipeline",
      description: "Customize hiring stages for your roles",
      href: "/canopy/roles",
    },
    {
      id: "candidates",
      label: "Review candidates",
      description: "Browse and evaluate applicants",
      href: "/canopy/candidates",
    },
  ],
};

// ─── Shell Display Names (product brands) ────────────────────────

export const SHELL_DISPLAY_NAMES: Record<Shell, string> = {
  talent: "Green Jobs Board",
  coach: "Candid",
  employer: "Canopy",
};

// ─── Default Pipeline Stages ─────────────────────────────────────
// Used by employer auto-detection to check if pipeline has been customized.

export const DEFAULT_PIPELINE_STAGES =
  '[{"id":"applied","name":"Applied"},{"id":"screening","name":"Screening"},{"id":"interview","name":"Interview"},{"id":"offer","name":"Offer"},{"id":"hired","name":"Hired"}]';

// ─── Default Coach Rate ──────────────────────────────────────────
// Prisma default for sessionRate. If it hasn't changed, the coach
// hasn't configured pricing yet.

export const DEFAULT_COACH_SESSION_RATE = 15000;
