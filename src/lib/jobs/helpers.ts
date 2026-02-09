import type { PathwayType } from "@/components/ui/pathway-tag";

/* ------------------------------------------------------------------ */
/*  Location & Employment Type Labels                                  */
/* ------------------------------------------------------------------ */

export function getLocationTypeLabel(locationType: string): string {
  switch (locationType) {
    case "REMOTE":
      return "Remote";
    case "HYBRID":
      return "Hybrid";
    case "ONSITE":
      return "Onsite";
    default:
      return locationType;
  }
}

export function getEmploymentTypeLabel(employmentType: string): string {
  switch (employmentType) {
    case "FULL_TIME":
      return "Full-Time";
    case "PART_TIME":
      return "Part-Time";
    case "CONTRACT":
      return "Contract";
    case "INTERNSHIP":
      return "Internship";
    case "VOLUNTEER":
      return "Volunteer";
    default:
      return employmentType;
  }
}

/* ------------------------------------------------------------------ */
/*  Experience Level Labels                                             */
/* ------------------------------------------------------------------ */

export function getExperienceLevelLabel(level: string | null): string {
  switch (level) {
    case "ENTRY":
      return "Entry Level";
    case "INTERMEDIATE":
      return "Mid Level";
    case "SENIOR":
      return "Senior or Executive";
    case "EXECUTIVE":
      return "Executive";
    default:
      return "Not specified";
  }
}

/* ------------------------------------------------------------------ */
/*  Education Level Labels                                              */
/* ------------------------------------------------------------------ */

export function getEducationLevelLabel(level: string | null): string {
  switch (level) {
    case "NONE":
      return "No Requirement";
    case "HIGH_SCHOOL":
      return "High School Diploma";
    case "ASSOCIATE":
      return "Associate Degree";
    case "BACHELOR":
      return "Bachelor's Degree";
    case "MASTER":
      return "Master's Degree";
    case "DOCTORATE":
      return "Doctorate (PhD)";
    case "VOCATIONAL":
      return "Vocational / Trade School";
    case "PROFESSIONAL":
      return "Professional Degree";
    default:
      return "Not specified";
  }
}

/* ------------------------------------------------------------------ */
/*  Salary Period Labels                                                */
/* ------------------------------------------------------------------ */

export function getSalaryPeriodLabel(period: string | null): string {
  switch (period) {
    case "ANNUAL":
      return "per year";
    case "HOURLY":
      return "per hour";
    case "WEEKLY":
      return "per week";
    case "MONTHLY":
      return "per month";
    default:
      return "per year";
  }
}

/* ------------------------------------------------------------------ */
/*  Salary Formatting                                                   */
/* ------------------------------------------------------------------ */

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period?: string | null
): string {
  if (!min && !max) return "Not specified";
  const suffix = period ? ` ${getSalaryPeriodLabel(period)}` : "";
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}${suffix}`;
    if (min) return `From ${formatter.format(min)}${suffix}`;
    return `Up to ${formatter.format(max!)}${suffix}`;
  } catch {
    // Fallback for invalid currency codes
    const fallback = (v: number) => `$${v.toLocaleString()}`;
    if (min && max) return `${fallback(min)} - ${fallback(max)}${suffix}`;
    if (min) return `From ${fallback(min)}${suffix}`;
    return `Up to ${fallback(max!)}${suffix}`;
  }
}

/* ------------------------------------------------------------------ */
/*  Job Status                                                         */
/* ------------------------------------------------------------------ */

export type JobPostStatus = "default" | "featured" | "bipoc-owned" | "closing-soon";

export function getJobStatus(job: {
  organization?: { isBipocOwned?: boolean } | null;
  isBipocOwned?: boolean;
  isFeatured?: boolean;
  isClosingSoon?: boolean;
}): JobPostStatus {
  if (job.organization?.isBipocOwned || job.isBipocOwned) return "bipoc-owned";
  if (job.isFeatured) return "featured";
  if (job.isClosingSoon) return "closing-soon";
  return "default";
}

/* ------------------------------------------------------------------ */
/*  Stage Badge Variant                                                */
/* ------------------------------------------------------------------ */

export function stageBadgeVariant(stage: string) {
  switch (stage.toLowerCase()) {
    case "applied":
    case "new":
      return "info" as const;
    case "screening":
    case "reviewing":
      return "default" as const;
    case "interview":
      return "feature" as const;
    case "offer":
      return "warning" as const;
    case "hired":
      return "success" as const;
    case "rejected":
      return "error" as const;
    default:
      return "neutral" as const;
  }
}

/* ------------------------------------------------------------------ */
/*  Stage Label Normalizer                                             */
/* ------------------------------------------------------------------ */

export function stageLabel(stage: string): string {
  switch (stage.toLowerCase()) {
    case "new":
      return "Applied";
    case "reviewing":
      return "Screening";
    default:
      return stage.charAt(0).toUpperCase() + stage.slice(1);
  }
}

/* ------------------------------------------------------------------ */
/*  Collection Pathways                                                */
/* ------------------------------------------------------------------ */

export function getCollectionPathways(collection: { title: string }): PathwayType[] {
  const title = collection.title.toLowerCase();

  if (title.includes("urban") || title.includes("city")) {
    return ["urban-planning", "construction", "transportation"];
  }
  if (title.includes("planet") || title.includes("global") || title.includes("conservation")) {
    return ["conservation", "research", "policy"];
  }
  if (title.includes("game") || title.includes("sport")) {
    return ["sports"];
  }
  if (title.includes("knowledge") || title.includes("education") || title.includes("research")) {
    return ["education", "research", "media"];
  }
  if (title.includes("energy") || title.includes("clean") || title.includes("renewable")) {
    return ["energy", "technology"];
  }
  if (title.includes("finance") || title.includes("green finance") || title.includes("esg")) {
    return ["finance"];
  }

  return ["conservation", "energy"];
}
