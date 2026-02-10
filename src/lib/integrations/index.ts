/**
 * Integration module barrel export.
 */

// Types and constants
export {
  INTEGRATION_PROVIDERS,
  PROVIDER_CONFIGS,
  getProviderConfig,
  getProvidersByCategory,
  buildNangoConnectionId,
  parseNangoConnectionId,
} from "./types";
export type {
  IntegrationProvider,
  IntegrationScope,
  ConnectionStatus,
  IntegrationCategory,
  IntegrationProviderConfig,
} from "./types";

// Nango client
export {
  getNangoClient,
  createNangoConnectSession,
  getNangoConnection,
  deleteNangoConnection,
  nangoProxy,
} from "./nango";

// Calendar service
export {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarAvailability,
} from "./calendar";

// Syndication auth
export { resolveSyndicationToken } from "./syndication-auth";

// Slack
export { sendSlackNotification } from "./slack";
