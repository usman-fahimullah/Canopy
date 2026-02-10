/**
 * Syndication Auth — Token Resolution Service
 *
 * Resolves API credentials for syndication platforms (LinkedIn, Indeed).
 * Priority: Nango connection → environment variable → null (manual mode).
 *
 * This provides backward compatibility: existing env var-based auth
 * continues to work when no Nango connection is configured.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getNangoConnection } from "./nango";
import { getProviderConfig } from "./types";
import type { IntegrationProvider } from "./types";

interface ResolvedToken {
  accessToken: string;
  source: "nango" | "env";
}

/**
 * Resolve an access token for a syndication platform.
 *
 * Priority:
 * 1. Nango connection (org-level) — uses OAuth, auto-refreshed
 * 2. Environment variable fallback — static token from .env
 * 3. null — no credentials available (manual mode)
 */
export async function resolveSyndicationToken(
  platform: "linkedin" | "indeed",
  organizationId?: string
): Promise<ResolvedToken | null> {
  // 1. Try Nango connection (org-scoped)
  if (organizationId) {
    try {
      const provider = platform as IntegrationProvider;
      const config = getProviderConfig(provider);

      if (config) {
        // Check if org has an active connection for this provider
        const connection = await prisma.integrationConnection.findFirst({
          where: {
            organizationId,
            provider: platform,
            status: "active",
          },
        });

        if (connection) {
          const nangoConnection = await getNangoConnection(provider, "organization", {
            organizationId,
          });

          if (nangoConnection?.credentials?.type === "OAUTH2") {
            const token = (nangoConnection.credentials as { access_token?: string }).access_token;
            if (token) {
              logger.info("Syndication token resolved via Nango", {
                platform,
                organizationId,
              });
              return { accessToken: token, source: "nango" };
            }
          }
        }
      }
    } catch (error) {
      logger.warn("Failed to resolve Nango syndication token, falling back to env", {
        platform,
        organizationId,
        error: formatError(error),
      });
    }
  }

  // 2. Environment variable fallback
  const envVarMap: Record<string, string | undefined> = {
    linkedin: process.env.LINKEDIN_ACCESS_TOKEN,
    indeed: process.env.INDEED_API_KEY,
  };

  const envToken = envVarMap[platform];
  if (envToken) {
    return { accessToken: envToken, source: "env" };
  }

  // 3. No credentials available
  return null;
}
