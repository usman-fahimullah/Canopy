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
  },
} as const;
