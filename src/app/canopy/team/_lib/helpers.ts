import type { OrgMemberRole } from "@prisma/client";

/** Map DB role enum to human-readable display name. */
export function formatRoleName(role: OrgMemberRole): string {
  const map: Record<OrgMemberRole, string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    RECRUITER: "Recruiter",
    HIRING_MANAGER: "Hiring Manager",
    MEMBER: "Reviewer",
    VIEWER: "Viewer",
  };
  return map[role] || role;
}

/** Map role to Badge variant for visual distinction. */
export function roleBadgeVariant(
  role: OrgMemberRole
): "default" | "info" | "success" | "feature" | "neutral" {
  const map: Record<OrgMemberRole, "default" | "info" | "success" | "feature" | "neutral"> = {
    OWNER: "default",
    ADMIN: "info",
    RECRUITER: "success",
    HIRING_MANAGER: "feature",
    MEMBER: "neutral",
    VIEWER: "neutral",
  };
  return map[role] || "neutral";
}

/** Roles available for assignment (excludes OWNER — only one per org). */
export const ASSIGNABLE_ROLES: OrgMemberRole[] = [
  "ADMIN",
  "RECRUITER",
  "HIRING_MANAGER",
  "MEMBER",
  "VIEWER",
];

/** Can the current user manage team members (change roles, remove, invite)? */
export function canManageTeam(role: OrgMemberRole): boolean {
  return role === "OWNER" || role === "ADMIN";
}

/** Format time until expiry as human-readable text. */
export function formatExpiresIn(expiresAt: string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `${diffDays}d left`;
  if (diffHours > 0) return `${diffHours}h left`;
  return "Expiring soon";
}
