/**
 * Indeed Platform Adapter
 *
 * Indeed supports two integration methods:
 *
 * 1. XML Feed — Indeed scrapes our hosted XML feed at /api/feeds/indeed.xml
 *    This is the primary integration (free organic posting).
 *
 * 2. Sponsored Jobs API — For paid placements. Requires an Indeed Partner
 *    account and API key. Only used if INDEED_API_KEY is configured.
 *
 * For the MVP, we rely on the XML feed approach. The adapter logs success
 * when a job is flagged for inclusion in the feed. The actual scraping is
 * handled by Indeed's crawler.
 */

import { logger } from "@/lib/logger";
import { resolveSyndicationToken } from "@/lib/integrations/syndication-auth";
import type { PlatformAdapter, SyndicationJobPayload, SyndicationResult } from "../types";

export class IndeedAdapter implements PlatformAdapter {
  readonly platform = "indeed" as const;

  async post(payload: SyndicationJobPayload): Promise<SyndicationResult> {
    const resolved = await resolveSyndicationToken("indeed", payload.organizationId);

    if (resolved) {
      return this.postViaApi(payload, resolved.accessToken);
    }

    // XML feed approach: mark as success — Indeed will pick it up via feed scrape
    logger.info("Indeed: Job flagged for XML feed inclusion", {
      jobId: payload.jobId,
      title: payload.title,
    });

    return {
      success: true,
      externalId: `feed:${payload.jobId}`,
    };
  }

  async update(payload: SyndicationJobPayload, externalId: string): Promise<SyndicationResult> {
    const resolved = await resolveSyndicationToken("indeed", payload.organizationId);

    if (resolved && !externalId.startsWith("feed:")) {
      return this.updateViaApi(payload, externalId, resolved.accessToken);
    }

    // XML feed updates happen automatically on next scrape
    logger.info("Indeed: Job update will appear in next feed scrape", {
      jobId: payload.jobId,
    });

    return { success: true, externalId };
  }

  async remove(externalId: string): Promise<SyndicationResult> {
    // For remove, we don't have the payload — fall back to env-based token resolution
    const resolved = await resolveSyndicationToken("indeed");

    if (resolved && !externalId.startsWith("feed:")) {
      return this.removeViaApi(externalId, resolved.accessToken);
    }

    // XML feed: job is excluded from feed when syndicationEnabled is false
    logger.info("Indeed: Job removed from XML feed", { externalId });
    return { success: true };
  }

  // ─── Sponsored Jobs API (when configured) ────────────────────────

  private async postViaApi(
    payload: SyndicationJobPayload,
    apiKey: string
  ): Promise<SyndicationResult> {
    try {
      const body = this.buildApiPayload(payload);
      const response = await fetch("https://apis.indeed.com/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Indeed API ${response.status}: ${errorText}` };
      }

      const result = await response.json();
      return { success: true, externalId: result.jobId || result.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Indeed API request failed",
      };
    }
  }

  private async updateViaApi(
    payload: SyndicationJobPayload,
    externalId: string,
    apiKey: string
  ): Promise<SyndicationResult> {
    try {
      const body = this.buildApiPayload(payload);
      const response = await fetch(`https://apis.indeed.com/v1/jobs/${externalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Indeed API ${response.status}: ${errorText}` };
      }

      return { success: true, externalId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Indeed API update failed",
      };
    }
  }

  private async removeViaApi(externalId: string, apiKey: string): Promise<SyndicationResult> {
    try {
      const response = await fetch(`https://apis.indeed.com/v1/jobs/${externalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Indeed API ${response.status}: ${errorText}` };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Indeed API delete failed",
      };
    }
  }

  private buildApiPayload(payload: SyndicationJobPayload) {
    return {
      title: payload.title,
      description: payload.description,
      location: payload.location || "Remote",
      isRemote: payload.locationType === "REMOTE",
      employmentType: this.mapEmploymentType(payload.employmentType),
      applyUrl: payload.applyUrl,
      companyName: payload.organization.name,
      ...(payload.salaryMin && {
        salary: {
          min: payload.salaryMin,
          max: payload.salaryMax ?? payload.salaryMin,
          currency: payload.salaryCurrency,
          period: "YEAR",
        },
      }),
    };
  }

  private mapEmploymentType(type: string): string {
    const map: Record<string, string> = {
      FULL_TIME: "FULLTIME",
      PART_TIME: "PARTTIME",
      CONTRACT: "CONTRACT",
      INTERNSHIP: "INTERN",
    };
    return map[type] || "FULLTIME";
  }
}
