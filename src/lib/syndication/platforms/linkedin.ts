/**
 * LinkedIn Platform Adapter
 *
 * LinkedIn Job Posting API requires a LinkedIn Recruiter or Job Posting
 * partnership. When LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET are
 * configured, this adapter will post via the API.
 *
 * Without credentials, syndication is tracked as "pending manual" — the
 * employer is given a direct-post link to LinkedIn's free job posting page.
 */

import { logger } from "@/lib/logger";
import { resolveSyndicationToken } from "@/lib/integrations/syndication-auth";
import type { PlatformAdapter, SyndicationJobPayload, SyndicationResult } from "../types";

export class LinkedInAdapter implements PlatformAdapter {
  readonly platform = "linkedin" as const;

  async post(payload: SyndicationJobPayload): Promise<SyndicationResult> {
    const resolved = await resolveSyndicationToken("linkedin", payload.organizationId);

    if (resolved) {
      return this.postViaApi(payload, resolved.accessToken);
    }

    // Manual fallback: log intent, employer handles via LinkedIn UI
    logger.info("LinkedIn: No API credentials — job flagged for manual posting", {
      jobId: payload.jobId,
      title: payload.title,
    });

    return {
      success: true,
      externalId: `manual:${payload.jobId}`,
    };
  }

  async update(payload: SyndicationJobPayload, externalId: string): Promise<SyndicationResult> {
    const resolved = await resolveSyndicationToken("linkedin", payload.organizationId);

    if (resolved && !externalId.startsWith("manual:")) {
      return this.updateViaApi(payload, externalId, resolved.accessToken);
    }

    logger.info("LinkedIn: Manual update required", {
      jobId: payload.jobId,
    });

    return { success: true, externalId };
  }

  async remove(externalId: string): Promise<SyndicationResult> {
    // For remove, we don't have the payload — fall back to env-based token resolution
    const resolved = await resolveSyndicationToken("linkedin");

    if (resolved && !externalId.startsWith("manual:")) {
      return this.removeViaApi(externalId, resolved.accessToken);
    }

    logger.info("LinkedIn: Manual removal required", { externalId });
    return { success: true };
  }

  // ─── LinkedIn API integration ────────────────────────────────────

  private async postViaApi(
    payload: SyndicationJobPayload,
    accessToken: string
  ): Promise<SyndicationResult> {
    try {
      const body = this.buildApiPayload(payload);
      const response = await fetch("https://api.linkedin.com/v2/simpleJobPostings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `LinkedIn API ${response.status}: ${errorText}` };
      }

      const result = await response.json();
      return { success: true, externalId: result.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "LinkedIn API request failed",
      };
    }
  }

  private async updateViaApi(
    payload: SyndicationJobPayload,
    externalId: string,
    accessToken: string
  ): Promise<SyndicationResult> {
    try {
      const body = this.buildApiPayload(payload);
      const response = await fetch(`https://api.linkedin.com/v2/simpleJobPostings/${externalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `LinkedIn API ${response.status}: ${errorText}` };
      }

      return { success: true, externalId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "LinkedIn API update failed",
      };
    }
  }

  private async removeViaApi(externalId: string, accessToken: string): Promise<SyndicationResult> {
    try {
      const response = await fetch(`https://api.linkedin.com/v2/simpleJobPostings/${externalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `LinkedIn API ${response.status}: ${errorText}` };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "LinkedIn API delete failed",
      };
    }
  }

  private buildApiPayload(payload: SyndicationJobPayload) {
    return {
      title: payload.title,
      description: { text: this.stripHtml(payload.description) },
      location: payload.location || "Remote",
      listedAt: payload.publishedAt?.getTime() ?? Date.now(),
      applyMethod: {
        externalApply: {
          url: payload.applyUrl,
        },
      },
      employmentStatus: this.mapEmploymentType(payload.employmentType),
      workplaceType: this.mapLocationType(payload.locationType),
      companyName: payload.organization.name,
      ...(payload.salaryMin && {
        compensation: {
          baseSalary: {
            min: { amount: payload.salaryMin, currencyCode: payload.salaryCurrency },
            max: {
              amount: payload.salaryMax ?? payload.salaryMin,
              currencyCode: payload.salaryCurrency,
            },
          },
          payPeriod: "YEARLY",
        },
      }),
    };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  private mapEmploymentType(type: string): string {
    const map: Record<string, string> = {
      FULL_TIME: "FULL_TIME",
      PART_TIME: "PART_TIME",
      CONTRACT: "CONTRACT",
      INTERNSHIP: "INTERNSHIP",
    };
    return map[type] || "FULL_TIME";
  }

  private mapLocationType(type: string): string {
    const map: Record<string, string> = {
      REMOTE: "REMOTE",
      HYBRID: "HYBRID",
      ONSITE: "ON_SITE",
    };
    return map[type] || "ON_SITE";
  }
}
