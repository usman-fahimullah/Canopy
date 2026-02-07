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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsThreeVertical, ArrowClockwise, Prohibit } from "@phosphor-icons/react";
import { formatRoleName, roleBadgeVariant, formatExpiresIn, canManageTeam } from "../_lib/helpers";
import type { PendingInvite } from "../_lib/types";

interface PendingInviteRowProps {
  invite: PendingInvite;
  currentUserRole: OrgMemberRole;
  onResend: (inviteId: string) => void;
  onRevoke: (inviteId: string) => void;
}

export function PendingInviteRow({
  invite,
  currentUserRole,
  onResend,
  onRevoke,
}: PendingInviteRowProps) {
  const isManageable = canManageTeam(currentUserRole);
  const expiresIn = formatExpiresIn(invite.expiresAt);

  return (
    <tr className="group border-b border-[var(--border-default)] last:border-b-0">
      {/* Email + Role */}
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <Avatar name={invite.email} size="default" />
          <div className="min-w-0">
            <p className="truncate text-body-sm font-medium text-[var(--foreground-default)]">
              {invite.email}
            </p>
            <Badge variant={roleBadgeVariant(invite.role)} size="sm" className="mt-1">
              {formatRoleName(invite.role)}
            </Badge>
          </div>
        </div>
      </td>

      {/* Invited By */}
      <td className="hidden px-3 py-4 md:table-cell">
        <span className="text-caption text-[var(--foreground-muted)]">{invite.invitedBy.name}</span>
      </td>

      {/* Expires */}
      <td className="px-3 py-4">
        <Badge variant={expiresIn === "Expired" ? "error" : "warning"} size="sm">
          {expiresIn}
        </Badge>
      </td>

      {/* Actions */}
      <td className="py-4 pl-3 pr-6 text-right">
        {isManageable && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for invite to ${invite.email}`}
              >
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onResend(invite.id)}>
                <ArrowClockwise size={16} className="mr-2" />
                Resend Invite
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem destructive onClick={() => onRevoke(invite.id)}>
                <Prohibit size={16} className="mr-2" />
                Revoke Invite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </td>
    </tr>
  );
}
