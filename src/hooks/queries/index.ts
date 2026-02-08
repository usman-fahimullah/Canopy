/**
 * React Query Hooks — Barrel Export
 *
 * Import from `@/hooks/queries` for all cached data hooks.
 */

// Key factory (for manual invalidation in one-off cases)
export { queryKeys } from "./keys";

// Fetcher utilities
export { apiFetch, apiMutate, ApiError } from "./fetchers";

// Roles
export {
  useRolesQuery,
  useTemplatesQuery,
  useRoleDetailQuery,
  useCreateRoleMutation,
  useSaveRoleMutation,
} from "./use-roles-query";
export type { RoleListItem, TemplateItem } from "./use-roles-query";

// Candidates
export {
  useCandidatesQuery,
  useCandidateDetailQuery,
  useStageMutation,
} from "./use-candidates-query";
export type { CandidateApplication, CandidateFilters } from "./use-candidates-query";

// Team
export {
  useTeamQuery,
  useRoleChangeMutation,
  useRemoveMemberMutation,
  useResendInviteMutation,
  useRevokeInviteMutation,
} from "./use-team-query";
export type { TeamData, TeamMember, PendingInvite } from "./use-team-query";

// Analytics
export { useAnalyticsQuery } from "./use-analytics-query";
export type { AnalyticsData, PipelineStage, TopJob } from "./use-analytics-query";

// Notifications
export {
  useNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "./use-notifications-query";
export type { Notification } from "./use-notifications-query";
