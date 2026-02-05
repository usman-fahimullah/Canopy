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
    default:
      return employmentType;
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
