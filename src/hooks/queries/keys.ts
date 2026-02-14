/**
 * React Query Key Factory
 *
 * Hierarchical key strategy so invalidation cascades correctly.
 * Example: invalidating ["canopy", "roles"] hits both list and detail queries.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

export const queryKeys = {
  // ── Canopy (Employer Shell) ──────────────────────────────

  canopy: {
    /** Invalidate everything in the Canopy shell */
    all: ["canopy"] as const,

    dashboard: {
      all: ["canopy", "dashboard"] as const,
    },

    roles: {
      /** Invalidate all role queries (list + every detail) */
      all: ["canopy", "roles"] as const,
      list: (filters?: Record<string, unknown>) =>
        filters
          ? (["canopy", "roles", "list", filters] as const)
          : (["canopy", "roles", "list"] as const),
      detail: (roleId: string) => ["canopy", "roles", "detail", roleId] as const,
    },

    templates: {
      all: ["canopy", "templates"] as const,
    },

    candidates: {
      /** Invalidate all candidate queries (list + every detail) */
      all: ["canopy", "candidates"] as const,
      list: (filters?: Record<string, unknown>) =>
        filters
          ? (["canopy", "candidates", "list", filters] as const)
          : (["canopy", "candidates", "list"] as const),
      detail: (seekerId: string) => ["canopy", "candidates", "detail", seekerId] as const,
    },

    team: {
      all: ["canopy", "team"] as const,
    },

    analytics: {
      all: ["canopy", "analytics"] as const,
    },

    notifications: {
      all: ["canopy", "notifications"] as const,
    },

    interviews: {
      all: ["canopy", "interviews"] as const,
      list: (filters?: Record<string, unknown>) =>
        filters
          ? (["canopy", "interviews", "list", filters] as const)
          : (["canopy", "interviews", "list"] as const),
      detail: (interviewId: string) => ["canopy", "interviews", "detail", interviewId] as const,
    },

    offers: {
      all: ["canopy", "offers"] as const,
      list: (filters?: Record<string, unknown>) =>
        filters
          ? (["canopy", "offers", "list", filters] as const)
          : (["canopy", "offers", "list"] as const),
      detail: (offerId: string) => ["canopy", "offers", "detail", offerId] as const,
    },

    approvals: {
      all: ["canopy", "approvals"] as const,
      list: (filters?: Record<string, unknown>) =>
        filters
          ? (["canopy", "approvals", "list", filters] as const)
          : (["canopy", "approvals", "list"] as const),
    },

    scores: {
      all: ["canopy", "scores"] as const,
      forApplication: (applicationId: string) =>
        ["canopy", "scores", "application", applicationId] as const,
      aggregate: (applicationId: string) =>
        ["canopy", "scores", "aggregate", applicationId] as const,
    },

    activity: {
      all: ["canopy", "activity"] as const,
      forEntity: (entityType: string, entityId: string) =>
        ["canopy", "activity", entityType, entityId] as const,
      forSeeker: (seekerId: string) => ["canopy", "activity", "seeker", seekerId] as const,
    },
  },
} as const;
