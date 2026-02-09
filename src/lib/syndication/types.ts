/**
 * Syndication type definitions.
 *
 * Shared types for the syndication system that posts jobs to external boards
 * (Indeed, LinkedIn, ZipRecruiter, etc.).
 */

export type SyndicationPlatform = "indeed" | "linkedin" | "ziprecruiter";

export type SyndicationAction = "post" | "update" | "remove";

export type SyndicationStatus = "pending" | "success" | "failed";

/** The data a platform adapter needs to post/update a job. */
export interface SyndicationJobPayload {
  jobId: string;
  title: string;
  description: string;
  location: string | null;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "VOLUNTEER";
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  climateCategory: string | null;
  publishedAt: Date | null;
  closesAt: Date | null;
  applyUrl: string;
  organization: {
    name: string;
    logo: string | null;
    slug: string;
  };
}

/** Result returned by a platform adapter after attempting syndication. */
export interface SyndicationResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

/** Interface that every platform adapter must implement. */
export interface PlatformAdapter {
  readonly platform: SyndicationPlatform;
  post(payload: SyndicationJobPayload): Promise<SyndicationResult>;
  update(payload: SyndicationJobPayload, externalId: string): Promise<SyndicationResult>;
  remove(externalId: string): Promise<SyndicationResult>;
}
