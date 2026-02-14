"use client";

import * as React from "react";
import { toast } from "sonner";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock } from "@phosphor-icons/react";
import { useApprovalsQuery, useRespondApprovalMutation } from "@/hooks/queries/use-approvals-query";
import type { ApprovalRequest } from "@/hooks/queries/use-approvals-query";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface ApprovalBannerProps {
  /** The entity ID to check for pending approvals (e.g., offer ID or job ID) */
  entityId: string;
  /** The type of approval to look for */
  approvalType: "JOB_PUBLISH" | "OFFER_SEND";
  /** Whether the current user is an approver (shows action buttons) */
  isApprover?: boolean;
  /** Callback when approval status changes */
  onStatusChange?: (status: "APPROVED" | "REJECTED") => void;
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function ApprovalBanner({
  entityId,
  approvalType,
  isApprover = false,
  onStatusChange,
}: ApprovalBannerProps) {
  const { data, isLoading } = useApprovalsQuery({ type: approvalType });
  const respondMutation = useRespondApprovalMutation();

  // Find the approval for this entity
  const approval = React.useMemo(() => {
    if (!data?.data) return null;
    return data.data.find((a: ApprovalRequest) => a.entityId === entityId) ?? null;
  }, [data, entityId]);

  if (isLoading || !approval) return null;

  const handleRespond = async (status: "APPROVED" | "REJECTED") => {
    try {
      await respondMutation.mutateAsync({
        approvalId: approval.id,
        status,
      });
      toast.success(status === "APPROVED" ? "Approval granted" : "Approval denied");
      onStatusChange?.(status);
    } catch {
      toast.error("Failed to respond to approval request");
    }
  };

  // Render based on status
  if (approval.status === "APPROVED") {
    const approverName = approval.approver?.account?.name;
    return (
      <Banner
        type="success"
        icon={<CheckCircle size={20} weight="fill" />}
        title={`Approved${approverName ? ` by ${approverName}` : ""}`}
        dismissible={false}
      />
    );
  }

  if (approval.status === "REJECTED") {
    const approverName = approval.approver?.account?.name;
    return (
      <Banner
        type="critical"
        icon={<XCircle size={20} weight="fill" />}
        title={`Not approved${approverName ? ` by ${approverName}` : ""}`}
        description={approval.reason ? `Reason: ${approval.reason}` : undefined}
        dismissible={false}
      />
    );
  }

  // PENDING status
  const approverAccount = approval.approver?.account;
  const pendingTitle = (
    <div className="flex items-center gap-2">
      <span>Pending approval</span>
      {approverAccount && (
        <span className="flex items-center gap-1.5 text-caption">
          from
          <Avatar
            src={approverAccount.avatar ?? undefined}
            name={approverAccount.name ?? "Approver"}
            size="xs"
          />
          <span>{approverAccount.name}</span>
        </span>
      )}
    </div>
  );

  const pendingAction = isApprover ? (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleRespond("APPROVED")}
        disabled={respondMutation.isPending}
      >
        {respondMutation.isPending ? (
          <Spinner size="sm" variant="current" />
        ) : (
          <>
            <CheckCircle size={16} weight="bold" />
            Approve
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRespond("REJECTED")}
        disabled={respondMutation.isPending}
      >
        <XCircle size={16} weight="bold" />
        Reject
      </Button>
    </div>
  ) : undefined;

  return (
    <Banner
      type="warning"
      icon={<Clock size={20} weight="fill" />}
      title={pendingTitle}
      action={pendingAction}
      dismissible={false}
    />
  );
}
