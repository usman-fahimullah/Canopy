"use client";

import type { OrgMemberRole } from "@prisma/client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  DotsThreeVertical,
  ShieldCheck,
  Star,
  UserCircle,
  UserMinus,
} from "@phosphor-icons/react";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { formatRoleName, roleBadgeVariant, ASSIGNABLE_ROLES, canManageTeam } from "../_lib/helpers";
import type { TeamMember } from "../_lib/types";

interface MemberRowProps {
  member: TeamMember;
  currentUserRole: OrgMemberRole;
  onRoleChange: (memberId: string, newRole: OrgMemberRole) => void;
  onRemove: (member: TeamMember) => void;
}

export function MemberRow({ member, currentUserRole, onRoleChange, onRemove }: MemberRowProps) {
  const isManageable = canManageTeam(currentUserRole);
  const isOwner = member.role === "OWNER";

  return (
    <tr className="group border-b border-[var(--border-default)] last:border-b-0">
      {/* Avatar + Name + Email */}
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} src={member.avatar ?? undefined} size="default" />
          <div className="min-w-0">
            <p className="truncate text-body-sm font-medium text-[var(--foreground-default)]">
              {member.name}
            </p>
            <p className="truncate text-caption text-[var(--foreground-muted)]">{member.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-3 py-4">
        <Badge variant={roleBadgeVariant(member.role)} size="sm">
          {formatRoleName(member.role)}
        </Badge>
      </td>

      {/* Assigned Jobs */}
      <td className="hidden px-3 py-4 lg:table-cell">
        {member.assignedJobs && member.assignedJobs.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {member.assignedJobs.slice(0, 3).map((job) => {
              const Icon =
                job.type === "recruiter"
                  ? Briefcase
                  : job.type === "hiring_manager"
                    ? UserCircle
                    : Star;
              return (
                <Badge key={`${job.id}-${job.type}`} variant="neutral" size="sm">
                  <Icon size={12} weight="fill" className="shrink-0" />
                  <span className="max-w-[100px] truncate">{job.title}</span>
                </Badge>
              );
            })}
            {member.assignedJobs.length > 3 && (
              <span className="text-caption text-[var(--foreground-muted)]">
                +{member.assignedJobs.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-caption text-[var(--foreground-subtle)]">--</span>
        )}
      </td>

      {/* Last Active */}
      <td className="hidden px-3 py-4 md:table-cell">
        <span className="text-caption text-[var(--foreground-muted)]">
          {formatRelativeTime(member.lastActiveAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 pl-3 pr-6 text-right">
        {isManageable && !isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`}>
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ShieldCheck size={16} className="mr-2" />
                  Change Role
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(value) => onRoleChange(member.id, value as OrgMemberRole)}
                  >
                    {ASSIGNABLE_ROLES.map((role) => (
                      <DropdownMenuRadioItem key={role} value={role}>
                        {formatRoleName(role)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem destructive onClick={() => onRemove(member)}>
                <UserMinus size={16} className="mr-2" />
                Remove from Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </td>
    </tr>
  );
}
