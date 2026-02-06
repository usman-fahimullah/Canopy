/**
 * Shared types for the Job Detail Page
 *
 * @figma https://www.figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=1425-24686
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isBipocOwned: boolean;
  isWomenOwned: boolean;
  isVeteranOwned: boolean;
  description: string | null;
}

export interface Pathway {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

export interface Recruiter {
  name: string;
  title: string | null;
  avatar: string | null;
}

export interface JobDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  climateCategory: string | null;
  impactDescription: string | null;
  greenSkills: string[];
  requiredCerts: string[];
  experienceLevel: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  closesAt: string | null;
  organization: Organization;
  pathway: Pathway | null;
  recruiter: Recruiter | null;
  isSaved: boolean;
  savedNotes: string | null;
}

export interface SimilarJob {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  climateCategory: string | null;
  experienceLevel: string | null;
  pathwayId: string | null;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    isBipocOwned: boolean;
  };
  pathway: Pathway | null;
  /** Computed similarity score (0-7+) */
  score?: number;
}
