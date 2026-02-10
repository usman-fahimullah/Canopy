"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { OrgMemberRole } from "@prisma/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui/dropdown";
import { Tabs, TabsListUnderline, TabsTriggerUnderline, TabsContent } from "@/components/ui/tabs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, WarningCircle } from "@phosphor-icons/react";
import { canManageTeam, formatRoleName, ASSIGNABLE_ROLES } from "../_lib/helpers";
import type { TeamMember } from "../_lib/types";
import { MemberRow } from "./MemberRow";
import { PendingInviteRow } from "./PendingInviteRow";
import { InviteModal } from "./InviteModal";
import {
  useTeamQuery,
  useRoleChangeMutation,
  useRemoveMemberMutation,
  useResendInviteMutation,
  useRevokeInviteMutation,
} from "@/hooks/queries";

/* -------------------------------------------------------------------
   Role filter options
   ------------------------------------------------------------------- */

const ROLE_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "ALL", label: "All roles" },
  ...ASSIGNABLE_ROLES.map((r) => ({
    value: r,
    label: formatRoleName(r),
  })),
];

/* -------------------------------------------------------------------
   Loading Skeleton
   ------------------------------------------------------------------- */

function TeamTableSkeleton() {
  return (
    <div className="space-y-3 pt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          {/* Assigned Jobs column */}
          <div className="hidden gap-1.5 lg:flex">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="hidden h-4 w-24 md:block" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export function TeamPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── React Query: cached team data ──────────────────────
  const { data: teamData, isLoading, error: queryError, refetch } = useTeamQuery();

  const members = teamData?.members ?? [];
  const pendingInvites = teamData?.pendingInvites ?? [];
  const currentUserRole = teamData?.currentUserRole ?? ("MEMBER" as OrgMemberRole);

  // Mutations
  const roleChangeMutation = useRoleChangeMutation();
  const removeMemberMutation = useRemoveMemberMutation();
  const resendInviteMutation = useResendInviteMutation();
  const revokeInviteMutation = useRevokeInviteMutation();

  // Only show skeleton when no cached data exists
  const isFirstLoad = isLoading && members.length === 0;
  const error = queryError ? "Failed to load team data. Please try again." : null;

  // UI state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);

  // Filter state from URL
  const search = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "ALL";

  const updateParams = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`/canopy/team?${params.toString()}`);
    },
    [searchParams, router]
  );

  // Client-side filtering
  const filteredMembers = useMemo(() => {
    let result = members;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter && roleFilter !== "ALL") {
      result = result.filter((m) => m.role === roleFilter);
    }
    return result;
  }, [members, search, roleFilter]);

  // Actions
  const handleRoleChange = useCallback(
    async (memberId: string, newRole: OrgMemberRole) => {
      try {
        await roleChangeMutation.mutateAsync({ memberId, role: newRole });
        toast.success(`Role updated to ${formatRoleName(newRole)}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update role";
        toast.error(message);
      }
    },
    [roleChangeMutation]
  );

  const handleRemoveConfirm = useCallback(async () => {
    if (!removingMember) return;

    try {
      await removeMemberMutation.mutateAsync(removingMember.id);
      toast.success(`${removingMember.name} removed from the team`);
      setRemovingMember(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove member";
      toast.error(message);
    }
  }, [removingMember, removeMemberMutation]);

  const handleResendInvite = useCallback(
    async (inviteId: string) => {
      try {
        await resendInviteMutation.mutateAsync(inviteId);
        toast.success("Invite resent");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to resend invite";
        toast.error(message);
      }
    },
    [resendInviteMutation]
  );

  const handleRevokeInvite = useCallback(
    async (inviteId: string) => {
      try {
        await revokeInviteMutation.mutateAsync(inviteId);
        toast.success("Invite revoked");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to revoke invite";
        toast.error(message);
      }
    },
    [revokeInviteMutation]
  );

  const isAdmin = canManageTeam(currentUserRole);

  return (
    <div>
      <PageHeader
        title="Team"
        actions={
          isAdmin && !isFirstLoad ? (
            <Button variant="primary" onClick={() => setInviteModalOpen(true)}>
              <Plus size={18} weight="bold" />
              Invite Member
            </Button>
          ) : undefined
        }
      />

      <div className="px-8 py-6 lg:px-12">
        {/* Error state */}
        {error && !isFirstLoad && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background-error)]">
              <WarningCircle size={28} weight="fill" className="text-[var(--foreground-error)]" />
            </div>
            <p className="mb-1 text-body font-medium text-[var(--foreground-default)]">
              Something went wrong
            </p>
            <p className="mb-4 text-caption text-[var(--foreground-muted)]">{error}</p>
            <Button variant="tertiary" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Loading */}
        {isFirstLoad && <TeamTableSkeleton />}

        {/* Loaded content */}
        {!isFirstLoad && !error && (
          <>
            {/* Stats */}
            <p className="mb-4 text-caption text-[var(--foreground-muted)]">
              {members.length} member{members.length !== 1 ? "s" : ""}
              {pendingInvites.length > 0 && (
                <>
                  {" "}
                  &middot; {pendingInvites.length} pending invite
                  {pendingInvites.length !== 1 ? "s" : ""}
                </>
              )}
            </p>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <SearchInput
                  size="compact"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => updateParams({ search: e.target.value || undefined })}
                />
              </div>
              <Dropdown value={roleFilter} onValueChange={(v) => updateParams({ role: v })}>
                <DropdownTrigger className="w-[180px]">
                  <DropdownValue placeholder="All roles" />
                </DropdownTrigger>
                <DropdownContent>
                  {ROLE_FILTER_OPTIONS.map((opt) => (
                    <DropdownItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="members">
              <TabsListUnderline>
                <TabsTriggerUnderline value="members">Members</TabsTriggerUnderline>
                <TabsTriggerUnderline value="invites">
                  Pending Invites
                  {pendingInvites.length > 0 && (
                    <Badge variant="default" size="sm" className="ml-1.5">
                      {pendingInvites.length}
                    </Badge>
                  )}
                </TabsTriggerUnderline>
              </TabsListUnderline>

              {/* Members Tab */}
              <TabsContent value="members">
                {filteredMembers.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      preset={search || roleFilter !== "ALL" ? "search" : "users"}
                      title={
                        search || roleFilter !== "ALL"
                          ? "No members match your filters"
                          : "No team members yet"
                      }
                      description={
                        search || roleFilter !== "ALL"
                          ? "Try adjusting your search or filter criteria."
                          : "Invite your first team member to start collaborating."
                      }
                      action={
                        isAdmin && !search && roleFilter === "ALL"
                          ? {
                              label: "Invite Member",
                              onClick: () => setInviteModalOpen(true),
                            }
                          : undefined
                      }
                      size="sm"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border-default)]">
                          <th className="py-3 pl-6 pr-3 text-left text-caption-strong text-[var(--foreground-muted)]">
                            Name
                          </th>
                          <th className="px-3 py-3 text-left text-caption-strong text-[var(--foreground-muted)]">
                            Role
                          </th>
                          <th className="hidden px-3 py-3 text-left text-caption-strong text-[var(--foreground-muted)] lg:table-cell">
                            Assigned Jobs
                          </th>
                          <th className="hidden px-3 py-3 text-left text-caption-strong text-[var(--foreground-muted)] md:table-cell">
                            Last Active
                          </th>
                          <th className="py-3 pl-3 pr-6 text-right text-caption-strong text-[var(--foreground-muted)]">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((member) => (
                          <MemberRow
                            key={member.id}
                            member={member}
                            currentUserRole={currentUserRole}
                            onRoleChange={handleRoleChange}
                            onRemove={setRemovingMember}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              {/* Pending Invites Tab */}
              <TabsContent value="invites">
                {pendingInvites.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      preset="inbox"
                      title="No pending invites"
                      description="Invite team members to collaborate on hiring."
                      action={
                        isAdmin
                          ? {
                              label: "Invite Member",
                              onClick: () => setInviteModalOpen(true),
                            }
                          : undefined
                      }
                      size="sm"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border-default)]">
                          <th className="py-3 pl-6 pr-3 text-left text-caption-strong text-[var(--foreground-muted)]">
                            Email
                          </th>
                          <th className="hidden px-3 py-3 text-left text-caption-strong text-[var(--foreground-muted)] md:table-cell">
                            Invited By
                          </th>
                          <th className="px-3 py-3 text-left text-caption-strong text-[var(--foreground-muted)]">
                            Expires
                          </th>
                          <th className="py-3 pl-3 pr-6 text-right text-caption-strong text-[var(--foreground-muted)]">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingInvites.map((invite) => (
                          <PendingInviteRow
                            key={invite.id}
                            invite={invite}
                            currentUserRole={currentUserRole}
                            onResend={handleResendInvite}
                            onRevoke={handleRevokeInvite}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Invite Modal */}
      <InviteModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onInvitesSent={() => refetch()}
      />

      {/* Remove Confirmation Modal */}
      <Modal
        open={!!removingMember}
        onOpenChange={(open) => {
          if (!open) setRemovingMember(null);
        }}
      >
        <ModalContent size="default">
          <ModalHeader>
            <ModalTitle>Remove team member</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-body-sm text-[var(--foreground-muted)]">
              Remove <strong>{removingMember?.name}</strong> from the team? They will lose access to
              all organization data. This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="tertiary"
              onClick={() => setRemovingMember(null)}
              disabled={removeMemberMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveConfirm}
              loading={removeMemberMutation.isPending}
            >
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
