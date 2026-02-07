"use client";

import * as React from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Warning } from "@phosphor-icons/react";
import { logger } from "@/lib/logger";

/**
 * Approval Banner Component
 *
 * Displays a banner when the current user has pending approvals.
 * Shows the count of approvals and provides a link to review them.
 *
 * Fetches data client-side from GET /api/canopy/approvals?status=PENDING
 */

export function ApprovalBanner() {
  const [pendingCount, setPendingCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          status: "PENDING",
          take: "1", // Only need count
        });

        const response = await fetch(`/api/canopy/approvals?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch approvals");
        }

        const data = await response.json();
        const count = Array.isArray(data.data) ? data.data.length : 0;

        // Only show banner if user is an approver (has pending approvals)
        setPendingCount(count);
        setError(null);
      } catch (err) {
        logger.error("Failed to fetch pending approvals", {
          error: err instanceof Error ? err.message : "Unknown error",
        });
        setError(null); // Don't show error to user
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingApprovals();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingApprovals, 30000);

    return () => clearInterval(interval);
  }, []);

  // Don't render if no pending approvals or loading
  if (isLoading || pendingCount === 0) {
    return null;
  }

  return (
    <Alert className="border-border-warning bg-background-warning/10">
      <Warning className="h-4 w-4 text-foreground-warning" />
      <AlertTitle className="text-foreground-warning font-semibold">
        Pending Approvals
      </AlertTitle>
      <AlertDescription className="mt-1 text-foreground-warning">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>You have</span>
            <Badge variant="warning" className="px-1.5">
              {pendingCount}
            </Badge>
            <span>{pendingCount === 1 ? "approval" : "approvals"} awaiting your review.</span>
          </div>
          <Link href="/canopy/approvals">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground-warning hover:text-foreground-warning/80"
            >
              Review
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}
