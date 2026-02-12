/* -------------------------------------------------------------------
   Shared types, constants, and helpers for Settings pages
   ------------------------------------------------------------------- */

export interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  role: "ADMIN" | "RECRUITER" | "HIRING_TEAM" | "VIEWER";
}

export interface CompanyData {
  name: string;
  website: string;
  size: string;
  sector: string;
  description: string;
  location: string;
}

export interface NotificationPrefs {
  newApplications: boolean;
  messages: boolean;
  jobExpiring: boolean;
  teamActivity: boolean;
}

export const EMPTY_COMPANY: CompanyData = {
  name: "",
  website: "",
  size: "",
  sector: "",
  description: "",
  location: "",
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  newApplications: true,
  messages: true,
  jobExpiring: false,
  teamActivity: false,
};

/** Maps our UI toggle keys to the API's inAppPrefs keys */
export const NOTIF_KEY_MAP: Record<keyof NotificationPrefs, string> = {
  newApplications: "NEW_APPLICATION",
  messages: "NEW_MESSAGE",
  jobExpiring: "OFFER_RECEIVED",
  teamActivity: "APPROVAL_PENDING",
};

export function roleBadgeVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "default" as const;
    case "RECRUITER":
      return "info" as const;
    case "HIRING_TEAM":
      return "neutral" as const;
    case "VIEWER":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

export function formatRole(role: string) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "RECRUITER":
      return "Recruiter";
    case "HIRING_TEAM":
      return "Hiring Team";
    case "VIEWER":
      return "Viewer";
    default:
      return role;
  }
}

/** Convert API inAppPrefs to our UI toggle state */
export function mapApiPrefsToUI(
  inAppPrefs: Record<string, boolean> | null | undefined
): NotificationPrefs {
  if (!inAppPrefs) return DEFAULT_NOTIFICATION_PREFS;
  return {
    newApplications:
      inAppPrefs[NOTIF_KEY_MAP.newApplications] ?? DEFAULT_NOTIFICATION_PREFS.newApplications,
    messages: inAppPrefs[NOTIF_KEY_MAP.messages] ?? DEFAULT_NOTIFICATION_PREFS.messages,
    jobExpiring: inAppPrefs[NOTIF_KEY_MAP.jobExpiring] ?? DEFAULT_NOTIFICATION_PREFS.jobExpiring,
    teamActivity: inAppPrefs[NOTIF_KEY_MAP.teamActivity] ?? DEFAULT_NOTIFICATION_PREFS.teamActivity,
  };
}

/** Convert UI toggle state to API inAppPrefs */
export function mapUIPrefsToApi(prefs: NotificationPrefs): Record<string, boolean> {
  return {
    [NOTIF_KEY_MAP.newApplications]: prefs.newApplications,
    [NOTIF_KEY_MAP.messages]: prefs.messages,
    [NOTIF_KEY_MAP.jobExpiring]: prefs.jobExpiring,
    [NOTIF_KEY_MAP.teamActivity]: prefs.teamActivity,
  };
}

/** Company size options for dropdown */
export const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-1000", label: "201-1,000 employees" },
  { value: "1001+", label: "1,000+ employees" },
];

/** Climate industry/sector options for dropdown */
export const INDUSTRY_OPTIONS = [
  { value: "Renewable Energy", label: "Renewable Energy" },
  { value: "Climate Tech", label: "Climate Tech" },
  { value: "Clean Transportation", label: "Clean Transportation" },
  { value: "Circular Economy", label: "Circular Economy" },
  { value: "Sustainable Agriculture", label: "Sustainable Agriculture" },
  { value: "Green Building", label: "Green Building" },
  { value: "ESG & Finance", label: "ESG & Finance" },
  { value: "Environmental Services", label: "Environmental Services" },
  { value: "Conservation & Biodiversity", label: "Conservation & Biodiversity" },
  { value: "Water & Waste", label: "Water & Waste" },
  { value: "Carbon Management", label: "Carbon Management" },
  { value: "Energy Storage", label: "Energy Storage" },
  { value: "Sustainable Fashion", label: "Sustainable Fashion" },
  { value: "Environmental Nonprofit", label: "Environmental Nonprofit" },
  { value: "Other", label: "Other" },
];
