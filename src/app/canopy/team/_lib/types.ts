import type { OrgMemberRole } from "@prisma/client";

export interface AssignedJob {
  id: string;
  title: string;
  type: "recruiter" | "hiring_manager" | "reviewer";
}

export interface TeamMember {
  id: string;
  accountId: string;
  name: string;
  email: string;
  avatar: string | null;
  role: OrgMemberRole;
  title: string | null;
  lastActiveAt: string | null;
  joinedAt: string;
  assignedJobs?: AssignedJob[];
  assignedJobCount?: number;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: OrgMemberRole;
  invitedBy: { name: string; email: string };
  expiresAt: string;
  createdAt: string;
}

export interface TeamData {
  members: TeamMember[];
  pendingInvites: PendingInvite[];
  currentUserRole: OrgMemberRole;
  meta: {
    memberCount: number;
    pendingCount: number;
  };
}
