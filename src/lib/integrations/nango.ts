/**
 * Nango client singleton and helper functions.
 *
 * Nango manages all OAuth token storage, refresh, and lifecycle.
 * This module provides a thin wrapper for the Canopy codebase.
 */

import { Nango } from "@nangohq/node";
import { logger, formatError } from "@/lib/logger";
import {
  type IntegrationProvider,
  type IntegrationScope,
  getProviderConfig,
  buildNangoConnectionId,
} from "./types";

// ---------------------------------------------------------------------------
// Singleton client (same pattern as src/lib/db.ts)
// ---------------------------------------------------------------------------

const globalForNango = globalThis as unknown as { __nango?: Nango };

function createNangoClient(): Nango {
  const secretKey = process.env.NANGO_SECRET_KEY;
  if (!secretKey) {
    logger.warn("NANGO_SECRET_KEY not set — Nango integrations disabled");
    // Return a client that will fail gracefully on calls
    return new Nango({ secretKey: "" });
  }
  return new Nango({ secretKey });
}

export function getNangoClient(): Nango {
  if (!globalForNango.__nango) {
    globalForNango.__nango = createNangoClient();
  }
  return globalForNango.__nango;
}

// ---------------------------------------------------------------------------
// Connect session
// ---------------------------------------------------------------------------

interface CreateConnectSessionParams {
  organizationId: string;
  memberId: string;
  memberEmail?: string;
  memberName?: string;
  provider: IntegrationProvider;
}

/**
 * Create a Nango connect session for the frontend to open the OAuth popup.
 *
 * Returns a session token that the frontend SDK uses to initiate the flow.
 */
export async function createNangoConnectSession(
  params: CreateConnectSessionParams
): Promise<{ sessionToken: string }> {
  const nango = getNangoClient();
  const config = getProviderConfig(params.provider);
  if (!config) {
    throw new Error(`Unknown integration provider: ${params.provider}`);
  }

  const connectionId = buildNangoConnectionId(config.scope, {
    organizationId: params.organizationId,
    memberId: params.memberId,
  });

  const result = await nango.createConnectSession({
    end_user: {
      id: connectionId,
      email: params.memberEmail,
      display_name: params.memberName,
    },
    allowed_integrations: [config.nangoIntegrationId],
  });

  logger.info("Nango connect session created", {
    provider: params.provider,
    connectionId,
    organizationId: params.organizationId,
  });

  return { sessionToken: result.data.token };
}

// ---------------------------------------------------------------------------
// Connection management
// ---------------------------------------------------------------------------

/**
 * Get a connection from Nango (includes fresh access token).
 *
 * Returns null if the connection doesn't exist.
 */
export async function getNangoConnection(
  provider: IntegrationProvider,
  scope: IntegrationScope,
  ids: { organizationId: string; memberId?: string }
) {
  const nango = getNangoClient();
  const config = getProviderConfig(provider);
  if (!config) return null;

  const connectionId = buildNangoConnectionId(scope, ids);

  try {
    const connection = await nango.getConnection(config.nangoIntegrationId, connectionId);
    return connection;
  } catch (error) {
    logger.warn("Failed to get Nango connection", {
      provider,
      connectionId,
      error: formatError(error),
    });
    return null;
  }
}

/**
 * Delete a connection from Nango.
 */
export async function deleteNangoConnection(
  provider: IntegrationProvider,
  nangoConnectionId: string
): Promise<void> {
  const nango = getNangoClient();
  const config = getProviderConfig(provider);
  if (!config) return;

  try {
    await nango.deleteConnection(config.nangoIntegrationId, nangoConnectionId);
    logger.info("Nango connection deleted", { provider, nangoConnectionId });
  } catch (error) {
    logger.warn("Failed to delete Nango connection", {
      provider,
      nangoConnectionId,
      error: formatError(error),
    });
  }
}

// ---------------------------------------------------------------------------
// Proxy helpers — make API calls through Nango
// ---------------------------------------------------------------------------

interface NangoProxyConfig {
  provider: IntegrationProvider;
  scope: IntegrationScope;
  ids: { organizationId: string; memberId?: string };
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

/**
 * Make an API call through Nango's proxy (auto-injects credentials).
 */
export async function nangoProxy<T = unknown>(config: NangoProxyConfig): Promise<T> {
  const nango = getNangoClient();
  const providerConfig = getProviderConfig(config.provider);
  if (!providerConfig) {
    throw new Error(`Unknown integration provider: ${config.provider}`);
  }

  const connectionId = buildNangoConnectionId(config.scope, config.ids);

  const proxyConfig = {
    endpoint: config.endpoint,
    providerConfigKey: providerConfig.nangoIntegrationId,
    connectionId,
    headers: config.headers,
    params: config.params,
    data: config.data,
    retries: 1,
  };

  let response;
  switch (config.method) {
    case "GET":
      response = await nango.get(proxyConfig);
      break;
    case "POST":
      response = await nango.post(proxyConfig);
      break;
    case "PUT":
      response = await nango.put(proxyConfig);
      break;
    case "PATCH":
      response = await nango.patch(proxyConfig);
      break;
    case "DELETE":
      response = await nango.delete(proxyConfig);
      break;
  }

  return response.data as T;
}
