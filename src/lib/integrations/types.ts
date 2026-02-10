/**
 * Integration types and provider configuration.
 *
 * Defines the available Nango-managed integration providers and their metadata.
 */

export const INTEGRATION_PROVIDERS = [
  "google-calendar",
  "outlook-calendar",
  "linkedin",
  "indeed",
  "slack",
] as const;

export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export type IntegrationScope = "organization" | "member";

export type ConnectionStatus = "active" | "error" | "expired" | "disconnected";

export type IntegrationCategory = "calendar" | "syndication" | "communication";

export interface IntegrationProviderConfig {
  provider: IntegrationProvider;
  label: string;
  description: string;
  scope: IntegrationScope;
  category: IntegrationCategory;
  /** Integration ID configured in the Nango dashboard */
  nangoIntegrationId: string;
  /** Phosphor icon component name */
  iconName: string;
}

/**
 * Provider configuration registry.
 *
 * The `nangoIntegrationId` values must match what's configured in the
 * Nango dashboard. Update these if your Nango integration IDs differ.
 */
export const PROVIDER_CONFIGS: IntegrationProviderConfig[] = [
  {
    provider: "google-calendar",
    label: "Google Calendar",
    description: "Sync interviews with Google Calendar",
    scope: "member",
    category: "calendar",
    nangoIntegrationId: "google-calendar",
    iconName: "GoogleLogo",
  },
  {
    provider: "outlook-calendar",
    label: "Outlook Calendar",
    description: "Sync interviews with Microsoft Outlook",
    scope: "member",
    category: "calendar",
    nangoIntegrationId: "outlook-calendar",
    iconName: "MicrosoftOutlookLogo",
  },
  {
    provider: "linkedin",
    label: "LinkedIn",
    description: "Post jobs directly to LinkedIn",
    scope: "organization",
    category: "syndication",
    nangoIntegrationId: "linkedin",
    iconName: "LinkedinLogo",
  },
  {
    provider: "indeed",
    label: "Indeed",
    description: "Syndicate job listings to Indeed",
    scope: "organization",
    category: "syndication",
    nangoIntegrationId: "indeed",
    iconName: "Briefcase",
  },
  {
    provider: "slack",
    label: "Slack",
    description: "Get hiring notifications in Slack",
    scope: "organization",
    category: "communication",
    nangoIntegrationId: "slack",
    iconName: "SlackLogo",
  },
];

/** Look up provider config by provider ID */
export function getProviderConfig(
  provider: IntegrationProvider
): IntegrationProviderConfig | undefined {
  return PROVIDER_CONFIGS.find((p) => p.provider === provider);
}

/** Group providers by category */
export function getProvidersByCategory(): Record<IntegrationCategory, IntegrationProviderConfig[]> {
  return {
    calendar: PROVIDER_CONFIGS.filter((p) => p.category === "calendar"),
    syndication: PROVIDER_CONFIGS.filter((p) => p.category === "syndication"),
    communication: PROVIDER_CONFIGS.filter((p) => p.category === "communication"),
  };
}

/**
 * Generate a deterministic Nango connection ID based on scope.
 *
 * Org-level integrations (Slack, LinkedIn, Indeed): `org_{organizationId}`
 * Member-level integrations (calendars): `member_{memberId}`
 */
export function buildNangoConnectionId(
  scope: IntegrationScope,
  ids: { organizationId: string; memberId?: string }
): string {
  if (scope === "member" && ids.memberId) {
    return `member_${ids.memberId}`;
  }
  return `org_${ids.organizationId}`;
}

/**
 * Parse a Nango connection ID to extract the scope and entity ID.
 *
 * Returns null if the format is unrecognized.
 */
export function parseNangoConnectionId(
  connectionId: string
): { scope: IntegrationScope; entityId: string } | null {
  if (connectionId.startsWith("org_")) {
    return { scope: "organization", entityId: connectionId.slice(4) };
  }
  if (connectionId.startsWith("member_")) {
    return { scope: "member", entityId: connectionId.slice(7) };
  }
  return null;
}
