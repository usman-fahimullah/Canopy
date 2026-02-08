"use client";

import * as React from "react";
import { Export } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

interface ExportButtonProps {
  /** If provided, scopes export to a specific job */
  jobId?: string;
  /** If provided, scopes export to a specific stage */
  stage?: string;
  /** Show analytics export option */
  showAnalytics?: boolean;
}

export function ExportButton({ jobId, stage, showAnalytics }: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = React.useCallback(
    async (type: "all" | "filtered" | "analytics") => {
      setIsExporting(true);
      try {
        let url: string;
        if (type === "analytics") {
          url = "/api/canopy/export/analytics";
        } else {
          const params = new URLSearchParams();
          if (jobId) params.set("jobId", jobId);
          if (type === "filtered" && stage) params.set("stage", stage);
          const qs = params.toString();
          url = `/api/canopy/export/candidates${qs ? `?${qs}` : ""}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Export failed");

        const blob = await res.blob();
        const disposition = res.headers.get("Content-Disposition") || "";
        const filenameMatch = disposition.match(/filename="(.+?)"/);
        const filename = filenameMatch?.[1] || "export.csv";

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch {
        // Silently fail — could add toast here
      } finally {
        setIsExporting(false);
      }
    },
    [jobId, stage]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Spinner size="sm" variant="current" />
          ) : (
            <Export size={16} weight="bold" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("all")}>
          Export all candidates
        </DropdownMenuItem>
        {stage && (
          <DropdownMenuItem onClick={() => handleExport("filtered")}>
            Export this stage
          </DropdownMenuItem>
        )}
        {showAnalytics && (
          <DropdownMenuItem onClick={() => handleExport("analytics")}>
            Export analytics
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
