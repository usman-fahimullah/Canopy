import type { ShellUser } from "./types";

// ---------------------------------------------------------------------------
// Progressive feature keys
// ---------------------------------------------------------------------------

export const FEATURE_COACHING = "coaching";
export const FEATURE_MENTORING = "mentoring";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/** Check whether a user has a progressive feature enabled */
export function hasFeature(
  user: ShellUser | null | undefined,
  feature: string
): boolean {
  if (!user?.progressiveFeatures) return false;
  return user.progressiveFeatures.includes(feature);
}
