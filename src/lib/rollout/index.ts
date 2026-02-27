// Rollout feature flag system
export {
  // Types
  type RolloutPhase,
  type FeatureStatus,
  type RolloutFeature,
  // Constants
  ROLLOUT_FEATURES,
  CURRENT_PHASE,
  // Feature checks
  isFeatureEnabled,
  isFeatureAvailable,
  isFeatureVisibleInternal,
  // Phase utilities
  isPhaseActive,
  getFeaturesForPhase,
  getFeaturesByStatus,
  getPhaseReadiness,
  getRolloutSummary,
  // Dependency checks
  areDependenciesMet,
  getBlockingDependencies,
} from "./feature-flags";

// Client-side hook
export { useRolloutFlag } from "./use-rollout-flag";
