import type { ApplicationSection, EmojiReaction } from "@/components/ui/job-application-table";

export interface TrackedJobData {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  companySlug: string;
  pathway: { name: string; slug: string } | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string | null;
  experienceLevel: string | null;
  educationLevel: string | null;
  location: string | null;
  locationType: string;
  employmentType: string;
  notes: string | null;
  isSaved: boolean;
  applicationId: string | null;
  applicationStatus: string | null;
  coverLetter: string | null;
}

export type { ApplicationSection, EmojiReaction };
