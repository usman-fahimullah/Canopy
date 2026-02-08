"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { Plus, WarningCircle } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import { canManageTeam, formatRoleName, ASSIGNABLE_ROLES } from "../_lib/helpers";
import type { TeamData, TeamMember, PendingInvite } from "../_lib/types";
import { MemberRow } from "./MemberRow";
import { PendingInviteRow } from "./PendingInviteRow";
import { InviteModal } from "./InviteModal";

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

  // Data state
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<OrgMemberRole>("MEMBER");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

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

  // Fetch team data
  const fetchTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/canopy/team");
      if (!res.ok) {
        throw new Error("Failed to load team data");
      }
      const data: TeamData = await res.json();
      setMembers(data.members);
      setPendingInvites(data.pendingInvites);
      setCurrentUserRole(data.currentUserRole);
    } catch (err) {
      logger.error("Failed to fetch team", { error: formatError(err) });
      setError("Failed to load team data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

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
      // Optimistic update
      const prevMembers = members;
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));

      try {
        const res = await fetch(`/api/canopy/team/members/${memberId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update role");
        }

        toast.success(`Role updated to ${formatRoleName(newRole)}`);
      } catch (err) {
        // Revert optimistic update
        setMembers(prevMembers);
        const message = err instanceof Error ? err.message : "Failed to update role";
        toast.error(message);
        logger.error("Role change failed", { error: formatError(err) });
      }
    },
    [members]
  );

  const handleRemoveConfirm = useCallback(async () => {
    if (!removingMember) return;

    setIsRemoving(true);
    try {
      const res = await fetch(`/api/canopy/team/members/${removingMember.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove member");
      }

      setMembers((prev) => prev.filter((m) => m.id !== removingMember.id));
      toast.success(`${removingMember.name} removed from the team`);
      setRemovingMember(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove member";
      toast.error(message);
      logger.error("Remove member failed", { error: formatError(err) });
    } finally {
      setIsRemoving(false);
    }
  }, [removingMember]);

  const handleResendInvite = useCallback(async (inviteId: string) => {
    try {
      const res = await fetch(`/api/canopy/team/invites/${inviteId}/resend`, { method: "POST" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to resend invite");
      }

      toast.success("Invite resent");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend invite";
      toast.error(message);
      logger.error("Resend invite failed", { error: formatError(err) });
    }
  }, []);

  const handleRevokeInvite = useCallback(
    async (inviteId: string) => {
      // Optimistic update
      const prevInvites = pendingInvites;
      setPendingInvites((prev) => prev.filter((inv) => inv.id !== inviteId));

      try {
        const res = await fetch(`/api/canopy/team/invites/${inviteId}`, { method: "DELETE" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to revoke invite");
        }

        toast.success("Invite revoked");
      } catch (err) {
        // Revert
        setPendingInvites(prevInvites);
        const message = err instanceof Error ? err.message : "Failed to revoke invite";
        toast.error(message);
        logger.error("Revoke invite failed", { error: formatError(err) });
      }
    },
    [pendingInvites]
  );

  const isAdmin = canManageTeam(currentUserRole);

  return (
    <div>
      <PageHeader
        title="Team"
        actions={
          isAdmin && !isLoading ? (
            <Button variant="primary" onClick={() => setInviteModalOpen(true)}>
              <Plus size={18} weight="bold" />
              Invite Member
            </Button>
          ) : undefined
        }
      />

      <div className="px-8 py-6 lg:px-12">
        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background-error)]">
              <WarningCircle size={28} weight="fill" className="text-[var(--foreground-error)]" />
            </div>
            <p className="mb-1 text-body font-medium text-[var(--foreground-default)]">
              Something went wrong
            </p>
            <p className="mb-4 text-caption text-[var(--foreground-muted)]">{error}</p>
            <Button variant="tertiary" onClick={fetchTeam}>
              Try Again
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && <TeamTableSkeleton />}

        {/* Loaded content */}
        {!isLoading && !error && (
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
        onInvitesSent={fetchTeam}
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
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirm} loading={isRemoving}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
