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
  ChatTeardropDots,
  Handshake,
} from "@phosphor-icons/react";
import { TreehouseIcon } from "@/components/Icons/treehouse-icon";
import { ProfileIcon } from "@/components/Icons/profile-icon";
import type { ShellNavConfig } from "./types";

// ---------------------------------------------------------------------------
// Talent Shell (Job Seekers — Green Jobs Board)
// ---------------------------------------------------------------------------

export const talentNavConfig: ShellNavConfig = {
  shell: "talent",
  logoHref: "/talent",
  settingsHref: "/talent/settings",
  notificationsHref: "/talent/notifications",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "home",
          href: "/talent",
          label: "Home",
          icon: HouseSimple,
          iconWeight: "fill",
        },
        {
          id: "jobs",
          href: "/talent/jobs",
          label: "Jobs",
          icon: MagnifyingGlass,
          iconWeight: "bold",
        },
        {
          id: "applications",
          href: "/talent/applications",
          label: "Applications",
          icon: Table,
          iconWeight: "fill",
        },
        {
          id: "treehouse",
          href: "/talent/treehouse",
          label: "Treehouse",
          customIcon: TreehouseIcon,
        },
        {
          id: "messages",
          href: "/talent/messages",
          label: "Messages",
          icon: ChatCircleDots,
          iconWeight: "fill",
          badgeKey: "unreadMessages",
        },
        {
          id: "profile",
          href: "/talent/profile",
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
          id: "coaching-sessions",
          href: "/talent/coaching",
          label: "Coaching",
          icon: GraduationCap,
          iconWeight: "fill",
        },
        {
          id: "coach-messages",
          href: "/talent/coaching/messages",
          label: "Coach Messages",
          icon: ChatTeardropDots,
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
          id: "mentoring-sessions",
          href: "/talent/mentoring",
          label: "Mentoring",
          icon: Handshake,
          iconWeight: "fill",
        },
        {
          id: "mentor-connect",
          href: "/talent/mentoring/connect",
          label: "Find Mentors",
          icon: Users,
          iconWeight: "bold",
        },
      ],
    },
  ],
  recents: {
    id: "recent-applications",
    label: "Recent Applications",
    apiEndpoint: "/api/talent/recent-applications",
    emptyMessage: "No recent applications",
    itemHrefPrefix: "/talent/applications/",
  },
};

// ---------------------------------------------------------------------------
// Coach Shell (Career Coaches — Candid)
// ---------------------------------------------------------------------------

export const coachNavConfig: ShellNavConfig = {
  shell: "coach",
  logoHref: "/coach",
  settingsHref: "/coach/settings",
  notificationsHref: "/coach/notifications",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "home",
          href: "/coach",
          label: "Home",
          icon: HouseSimple,
          iconWeight: "fill",
        },
        {
          id: "clients",
          href: "/coach/clients",
          label: "Clients",
          icon: Users,
          iconWeight: "bold",
        },
        {
          id: "sessions",
          href: "/coach/sessions",
          label: "Sessions",
          icon: CalendarDots,
          iconWeight: "fill",
        },
        {
          id: "earnings",
          href: "/coach/earnings",
          label: "Earnings",
          icon: ChartLine,
          iconWeight: "bold",
        },
        {
          id: "schedule",
          href: "/coach/schedule",
          label: "Schedule",
          icon: Clock,
          iconWeight: "fill",
        },
        {
          id: "messages",
          href: "/coach/messages",
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
    apiEndpoint: "/api/coach/recent-conversations",
    emptyMessage: "No recent conversations",
    itemHrefPrefix: "/coach/messages/",
  },
};

// ---------------------------------------------------------------------------
// Employer Shell (Hiring — Canopy ATS)
// No Messages nav item — messages are contextual within candidate records.
// ---------------------------------------------------------------------------

export const employerNavConfig: ShellNavConfig = {
  shell: "employer",
  logoHref: "/employer",
  settingsHref: "/employer/settings",
  notificationsHref: "/employer/notifications",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "home",
          href: "/employer",
          label: "Home",
          icon: HouseSimple,
          iconWeight: "fill",
        },
        {
          id: "roles",
          href: "/employer/roles",
          label: "Roles",
          icon: BriefcaseMetal,
          iconWeight: "fill",
          requiredRoles: ["ADMIN", "RECRUITER"],
        },
        {
          id: "candidates",
          href: "/employer/candidates",
          label: "Candidates",
          icon: Users,
          iconWeight: "bold",
        },
        {
          id: "team",
          href: "/employer/team",
          label: "Team",
          icon: UsersFour,
          iconWeight: "bold",
          requiredRoles: ["ADMIN"],
        },
        {
          id: "analytics",
          href: "/employer/analytics",
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
    apiEndpoint: "/api/employer/recent-postings",
    emptyMessage: "No recent postings",
    itemHrefPrefix: "/employer/roles/",
  },
};

// ---------------------------------------------------------------------------
// Lookup helper
// ---------------------------------------------------------------------------

export const shellNavConfigs: Record<string, ShellNavConfig> = {
  talent: talentNavConfig,
  coach: coachNavConfig,
  employer: employerNavConfig,
};
