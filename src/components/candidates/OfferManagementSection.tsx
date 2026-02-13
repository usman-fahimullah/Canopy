"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { OfferBadge, type OfferBadgeStatus } from "@/components/offers/offer-badge";
import {
  Gift,
  PaperPlaneTilt,
  Eye,
  Pen,
  ArrowCounterClockwise,
  CurrencyDollar,
  Calendar,
  Buildings,
  CheckCircle,
  Warning,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface OfferData {
  id: string;
  status: OfferBadgeStatus;
  salary: number | null;
  salaryCurrency: string;
  startDate: string | Date;
  department: string | null;
  signingMethod: string;
  sentAt: string | Date | null;
  viewedAt: string | Date | null;
  signedAt: string | Date | null;
  withdrawnAt: string | Date | null;
  createdAt: string | Date;
}

interface OfferManagementSectionProps {
  offer: OfferData;
  candidateName: string;
  onOfferSent?: () => void;
  onOfferWithdrawn?: () => void;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function formatCurrency(cents: number, currency: string): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

function formatDate(date: string | Date | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatSigningMethod(method: string): string {
  switch (method) {
    case "EXTERNAL_LINK":
      return "External Link";
    case "UPLOAD_DOCUMENT":
      return "Upload Document";
    case "MANUAL_INSTRUCTIONS":
      return "Manual Instructions";
    default:
      return method;
  }
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function OfferManagementSection({
  offer,
  candidateName,
  onOfferSent,
  onOfferWithdrawn,
}: OfferManagementSectionProps) {
  const [isSending, setIsSending] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // Clear feedback after 4s
  React.useEffect(() => {
    if (!actionSuccess && !actionError) return;
    const timer = setTimeout(() => {
      setActionSuccess(null);
      setActionError(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [actionSuccess, actionError]);

  const handleSendOffer = async () => {
    setIsSending(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/canopy/offers/${offer.id}/send`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send offer");
      }

      setActionSuccess(`Offer sent to ${candidateName}`);
      onOfferSent?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to send offer");
      logger.error("Failed to send offer", { error: formatError(err) });
    } finally {
      setIsSending(false);
    }
  };

  const handleWithdrawOffer = async () => {
    setIsWithdrawing(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/canopy/offers/${offer.id}/withdraw`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to withdraw offer");
      }

      setActionSuccess("Offer withdrawn");
      onOfferWithdrawn?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to withdraw offer");
      logger.error("Failed to withdraw offer", { error: formatError(err) });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const isDraft = offer.status === "DRAFT";
  const isSent = offer.status === "SENT";
  const isViewed = offer.status === "VIEWED";
  const isSigned = offer.status === "SIGNED";
  const isWithdrawn = offer.status === "WITHDRAWN";
  const isAwaitingSignature = offer.status === "AWAITING_SIGNATURE";
  const canSend = isDraft;
  const canWithdraw = !isSigned && !isWithdrawn;

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Gift size={20} weight="bold" className="text-[var(--foreground-brand)]" />
        <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">Offer</h3>
        <OfferBadge status={offer.status} />
      </div>

      {/* Feedback messages */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--background-error)] px-3 py-2 text-caption text-[var(--foreground-error)]">
          <Warning size={16} weight="bold" />
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--background-success)] px-3 py-2 text-caption text-[var(--foreground-success)]">
          <CheckCircle size={16} weight="bold" />
          {actionSuccess}
        </div>
      )}

      {/* Offer details card */}
      <div className="space-y-3 rounded-[var(--radius-card)] bg-[var(--background-subtle)] p-4">
        {/* Salary */}
        {offer.salary && (
          <div className="flex items-center gap-3">
            <CurrencyDollar
              size={16}
              weight="bold"
              className="shrink-0 text-[var(--foreground-subtle)]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-caption text-[var(--foreground-subtle)]">Salary</p>
              <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                {formatCurrency(offer.salary, offer.salaryCurrency)}/year
              </p>
            </div>
          </div>
        )}

        {/* Start date */}
        <div className="flex items-center gap-3">
          <Calendar size={16} weight="bold" className="shrink-0 text-[var(--foreground-subtle)]" />
          <div className="min-w-0 flex-1">
            <p className="text-caption text-[var(--foreground-subtle)]">Start Date</p>
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              {formatDate(offer.startDate)}
            </p>
          </div>
        </div>

        {/* Department */}
        {offer.department && (
          <div className="flex items-center gap-3">
            <Buildings
              size={16}
              weight="bold"
              className="shrink-0 text-[var(--foreground-subtle)]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-caption text-[var(--foreground-subtle)]">Department</p>
              <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                {offer.department}
              </p>
            </div>
          </div>
        )}

        {/* Signing method */}
        <div className="flex items-center gap-3">
          <Pen size={16} weight="bold" className="shrink-0 text-[var(--foreground-subtle)]" />
          <div className="min-w-0 flex-1">
            <p className="text-caption text-[var(--foreground-subtle)]">Signing Method</p>
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              {formatSigningMethod(offer.signingMethod)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Status timeline */}
        <div className="space-y-2">
          <p className="text-caption-strong font-semibold text-[var(--foreground-muted)]">
            Timeline
          </p>
          <div className="space-y-1.5 text-caption text-[var(--foreground-muted)]">
            <div className="flex items-center justify-between">
              <span>Created</span>
              <span>{formatDate(offer.createdAt)}</span>
            </div>
            {offer.sentAt && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <PaperPlaneTilt size={12} weight="bold" />
                  Sent
                </span>
                <span>{formatDate(offer.sentAt)}</span>
              </div>
            )}
            {offer.viewedAt && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Eye size={12} weight="bold" />
                  Viewed
                </span>
                <span>{formatDate(offer.viewedAt)}</span>
              </div>
            )}
            {offer.signedAt && (
              <div className="flex items-center justify-between text-[var(--foreground-success)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={12} weight="fill" />
                  Signed
                </span>
                <span>{formatDate(offer.signedAt)}</span>
              </div>
            )}
            {offer.withdrawnAt && (
              <div className="flex items-center justify-between text-[var(--foreground-error)]">
                <span className="flex items-center gap-1.5">
                  <ArrowCounterClockwise size={12} weight="bold" />
                  Withdrawn
                </span>
                <span>{formatDate(offer.withdrawnAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {(canSend || canWithdraw) && (
        <div className="flex gap-2">
          {canSend && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleSendOffer}
              loading={isSending}
              disabled={isWithdrawing}
            >
              <PaperPlaneTilt size={16} weight="bold" className="mr-1.5" />
              Send to Candidate
            </Button>
          )}
          {canWithdraw && (
            <SimpleTooltip content="Withdraw this offer and move candidate back to screening">
              <Button
                variant="destructive"
                size="sm"
                className={canSend ? "" : "flex-1"}
                onClick={handleWithdrawOffer}
                loading={isWithdrawing}
                disabled={isSending}
              >
                <ArrowCounterClockwise size={16} weight="bold" className="mr-1.5" />
                Withdraw
              </Button>
            </SimpleTooltip>
          )}
        </div>
      )}
    </section>
  );
}
