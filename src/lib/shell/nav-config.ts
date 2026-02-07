import {
  HouseSimple,
  MagnifyingGlass,
  Table,
  ChatCircleDots,
  Users,
  CalendarDots,
  ChartLine,
  Clock,
  BriefcaseMetal,
  UsersFour,
  ChartDonut,
  GraduationCap,
  Handshake,
  Gear,
} from "@phosphor-icons/react";
import { TreehouseIcon } from "@/components/Icons/treehouse-icon";
import { ProfileIcon } from "@/components/Icons/profile-icon";
import type { ShellNavConfig } from "./types";

// ---------------------------------------------------------------------------
// Talent Shell (Job Seekers — Green Jobs Board)
// ---------------------------------------------------------------------------

export const talentNavConfig: ShellNavConfig = {
  shell: "talent",
  logoHref: "/jobs",
  settingsHref: "/jobs/settings",
  notificationsHref: "/jobs/notifications",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "home",
          href: "/jobs",
          label: "Home",
          icon: HouseSimple,
          iconWeight: "fill",
        },
        {
          id: "jobs",
          href: "/jobs/search",
          label: "Jobs",
          icon: MagnifyingGlass,
          iconWeight: "bold",
        },
        {
          id: "applications",
          href: "/jobs/applications",
          label: "Applications",
          icon: Table,
          iconWeight: "fill",
        },
        {
          id: "treehouse",
          href: "/jobs/treehouse",
          label: "Treehouse",
          customIcon: TreehouseIcon,
        },
        {
          id: "messages",
          href: "/jobs/messages",
          label: "Messages",
          icon: ChatCircleDots,
          iconWeight: "fill",
          badgeKey: "unreadMessages",
        },
        {
          id: "profile",
          href: "/jobs/profile",
          label: "Profile",
          customIcon: ProfileIcon,
          useProfileImage: true,
        },
      ],
    },
    {
      id: "coaching",
      label: "Coaching",
      progressive: true,
      progressiveFeature: "coaching",
      items: [
        {
          id: "coaching",
          href: "/jobs/coaching",
          label: "Coaching",
          icon: GraduationCap,
          iconWeight: "fill",
        },
      ],
    },
    {
      id: "mentoring",
      label: "Mentoring",
      progressive: true,
      progressiveFeature: "mentoring",
      items: [
        {
          id: "mentoring",
          href: "/jobs/mentoring",
          label: "Mentoring",
          icon: Handshake,
          iconWeight: "fill",
        },
      ],
    },
  ],
  recents: {
    id: "recent-applications",
    label: "Recent Applications",
    apiEndpoint: "/api/jobs/recent-applications",
    emptyMessage: "No recent applications",
    itemHrefPrefix: "/jobs/applications/",
  },
  utilityItems: [
    {
      id: "settings",
      href: "/jobs/settings",
      label: "Settings",
      icon: Gear,
      iconWeight: "fill",
    },
  ],
};

// ---------------------------------------------------------------------------
// Coach Shell (Career Coaches — Candid)
// ---------------------------------------------------------------------------

export const coachNavConfig: ShellNavConfig = {
  shell: "coach",
  logoHref: "/candid/coach",
  settingsHref: "/candid/coach/settings",
  notificationsHref: "/candid/coach/notifications",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "home",
          href: "/candid/coach",
          label: "Home",
          icon: HouseSimple,
          iconWeight: "fill",
        },
        {
          id: "clients",
          href: "/candid/coach/clients",
          label: "Clients",
          icon: Users,
          iconWeight: "bold",
        },
        {
          id: "sessions",
          href: "/candid/coach/sessions",
          label: "Sessions",
          icon: CalendarDots,
          iconWeight: "fill",
        },
        {
          id: "earnings",
          href: "/candid/coach/earnings",
          label: "Earnings",
          icon: ChartLine,
          iconWeight: "bold",
        },
        {
          id: "schedule",
          href: "/candid/coach/schedule",
          label: "Schedule",
          icon: Clock,
          iconWeight: "fill",
        },
        {
          id: "messages",
          href: "/candid/coach/messages",
          label: "Messages",
          icon: ChatCircleDots,
          iconWeight: "fill",
          badgeKey: "unreadMessages",
        },
      ],
    },
  ],
  recents: {
    id: "recent-conversations",
    label: "Recent Conversations",
    apiEndpoint: "/api/candid/coach/recent-conversations",
    emptyMessage: "No recent conversations",
    itemHrefPrefix: "/candid/coach/messages/",
  },
  utilityItems: [
    {
      id: "settings",
      href: "/candid/coach/settings",
      label: "Settings",
      icon: Gear,
      iconWeight: "fill",
    },
  ],
};

// ---------------------------------------------------------------------------
// Employer Shell (Hiring — Canopy ATS)
// No Messages nav item — messages are contextual within candidate records.
// ---------------------------------------------------------------------------

export const employerNavConfig: ShellNavConfig = {
  shell: "employer",
  logoHref: "/canopy",
  settingsHref: "/canopy/settings",
  notificationsHref: "/canopy/notifications",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "home",
          href: "/canopy",
          label: "Home",
          icon: HouseSimple,
          iconWeight: "fill",
        },
        {
          id: "roles",
          href: "/canopy/roles",
          label: "Manage Roles",
          icon: BriefcaseMetal,
          iconWeight: "fill",
          requiredRoles: ["ADMIN", "RECRUITER"],
        },
        {
          id: "candidates",
          href: "/canopy/candidates",
          label: "Candidates",
          icon: Users,
          iconWeight: "bold",
        },
        {
          id: "messages",
          href: "/canopy/messages",
          label: "Messages",
          icon: ChatCircleDots,
          iconWeight: "fill",
          badgeKey: "unreadMessages",
        },
        {
          id: "calendar",
          href: "/canopy/calendar",
          label: "Calendar",
          icon: CalendarDots,
          iconWeight: "fill",
          requiredRoles: ["ADMIN", "RECRUITER"],
        },
        {
          id: "team",
          href: "/canopy/team",
          label: "Team",
          icon: UsersFour,
          iconWeight: "bold",
          requiredRoles: ["ADMIN"],
        },
        {
          id: "analytics",
          href: "/canopy/analytics",
          label: "Analytics",
          icon: ChartDonut,
          iconWeight: "fill",
          requiredRoles: ["ADMIN", "RECRUITER"],
        },
      ],
    },
  ],
  recents: {
    id: "recent-postings",
    label: "Recent Postings",
    apiEndpoint: "/api/canopy/recent-postings",
    emptyMessage: "No recent postings",
    itemHrefPrefix: "/canopy/roles/",
  },
  utilityItems: [
    {
      id: "settings",
      href: "/canopy/settings",
      label: "Settings",
      icon: Gear,
      iconWeight: "fill",
    },
  ],
};

// ---------------------------------------------------------------------------
// Lookup helper
// ---------------------------------------------------------------------------

export const shellNavConfigs: Record<string, ShellNavConfig> = {
  talent: talentNavConfig,
  coach: coachNavConfig,
  employer: employerNavConfig,
};
