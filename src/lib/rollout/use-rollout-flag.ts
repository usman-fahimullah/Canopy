"use client";

import { useMemo } from "react";
import {
  isFeatureEnabled,
  isFeatureAvailable,
  isFeatureVisibleInternal,
  ROLLOUT_FEATURES,
  type FeatureStatus,
} from "./feature-flags";

/**
 * React hook to check if a rollout feature is enabled.
 *
 * Usage:
 *   const { enabled, status, feature } = useRolloutFlag("career_page_builder");
 *
 *   if (!enabled) {
 *     return <ComingSoonBanner feature={feature} />;
 *   }
 */
export function useRolloutFlag(featureKey: string): {
  /** Whether the feature is GA (generally available) */
  enabled: boolean;
  /** Whether the feature is at least beta (GA or beta) */
  available: boolean;
  /** Whether the feature is visible to internal/admin users */
  visibleInternal: boolean;
  /** Current status of the feature */
  status: FeatureStatus | null;
  /** Full feature metadata */
  feature: (typeof ROLLOUT_FEATURES)[string] | null;
} {
  return useMemo(() => {
    const feature = ROLLOUT_FEATURES[featureKey] ?? null;

    return {
      enabled: isFeatureEnabled(featureKey),
      available: isFeatureAvailable(featureKey),
      visibleInternal: isFeatureVisibleInternal(featureKey),
      status: feature?.status ?? null,
      feature,
    };
  }, [featureKey]);
}

/**
 * React hook to get the full rollout status summary.
 * Useful for admin dashboards and internal status pages.
 */
export { getRolloutSummary } from "./feature-flags";
