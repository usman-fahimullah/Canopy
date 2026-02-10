"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { SwitchWithLabel } from "@/components/ui/switch";
import {
  ShareNetwork,
  ArrowClockwise,
  CheckCircle,
  XCircle,
  Clock,
  Rss,
  LinkedinLogo,
  Warning,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";
import type { JobData } from "../../_lib/types";

// ============================================
// TYPES
// ============================================

interface JobBoardsSectionProps {
  jobData: JobData;
  onJobDataChange: (updater: (prev: JobData) => JobData) => void;
}

interface SyndicationLog {
  id: string;
  platform: string;
  action: string;
  status: string;
  externalId: string | null;
  error: string | null;
  createdAt: string;
}

// ============================================
// CONSTANTS
// ============================================

const PLATFORM_INFO: Record<string, { label: string; icon: React.ReactNode; description: string }> =
  {
    indeed: {
      label: "Indeed",
      icon: <Rss size={20} weight="regular" />,
      description: "Jobs appear in Indeed's organic search results via XML feed.",
    },
    linkedin: {
      label: "LinkedIn",
      icon: <LinkedinLogo size={20} weight="regular" />,
      description: "Jobs posted to LinkedIn via the Job Posting API.",
    },
    ziprecruiter: {
      label: "ZipRecruiter",
      icon: <ShareNetwork size={20} weight="regular" />,
      description: "Jobs distributed to ZipRecruiter's network.",
    },
  };

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "success":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle size={12} weight="fill" />
          Synced
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="error" className="gap-1">
          <XCircle size={12} weight="fill" />
          Failed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock size={12} weight="fill" />
          Pending
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" className="gap-1">
          <Clock size={12} />
          {status}
        </Badge>
      );
  }
}

// ============================================
// COMPONENT
// ============================================

export function JobBoardsSection({ jobData, onJobDataChange }: JobBoardsSectionProps) {
  const [logs, setLogs] = React.useState<SyndicationLog[]>([]);
  const [latestByPlatform, setLatestByPlatform] = React.useState<Record<string, SyndicationLog>>(
    {}
  );
  const [loading, setLoading] = React.useState(true);
  const [retrying, setRetrying] = React.useState<string | null>(null);

  const fetchStatus = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/canopy/roles/${jobData.id}/syndication`);
      if (!res.ok) return;
      const json = await res.json();
      setLogs(json.data.logs ?? []);
      setLatestByPlatform(json.data.latestByPlatform ?? {});
    } catch (error) {
      logger.error("Failed to fetch syndication status", {
        error: formatError(error),
      });
    } finally {
      setLoading(false);
    }
  }, [jobData.id]);

  React.useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleToggleSyndication = async (enabled: boolean) => {
    try {
      const res = await fetch(`/api/canopy/roles/${jobData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syndicationEnabled: enabled }),
      });
      if (res.ok) {
        onJobDataChange((prev) => ({ ...prev, syndicationEnabled: enabled }));
        toast.success(enabled ? "Syndication enabled" : "Syndication disabled");
      }
    } catch (error) {
      logger.error("Failed to toggle syndication", { error: formatError(error) });
      toast.error("Failed to update syndication");
    }
  };

  async function handleRetry(logId: string) {
    setRetrying(logId);
    try {
      const res = await fetch(`/api/canopy/roles/${jobData.id}/syndication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      });
      if (res.ok) {
        await fetchStatus();
        toast.success("Retry submitted");
      }
    } catch (error) {
      logger.error("Failed to retry syndication", {
        error: formatError(error),
      });
      toast.error("Failed to retry");
    } finally {
      setRetrying(null);
    }
  }

  const isPublished = jobData.status === "PUBLISHED";
  const availablePlatforms = Object.keys(PLATFORM_INFO);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          Job Boards
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Syndicate this role to external job boards and track posting status.
        </p>
      </div>

      {/* Syndication Toggle */}
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-default)] p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
            <ShareNetwork size={20} weight="regular" className="text-[var(--foreground-brand)]" />
          </div>
          <div className="flex-1">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              Distribute this job to external job boards to reach more candidates.
            </p>
            <p className="mt-1 text-caption text-[var(--foreground-muted)]">
              When enabled, your job will be posted to Indeed, LinkedIn, and other job boards
              automatically when published.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--border-muted)] pt-4">
          <SwitchWithLabel
            label="Enable syndication"
            checked={jobData.syndicationEnabled}
            onCheckedChange={handleToggleSyndication}
          />
          {jobData.syndicationEnabled && !isPublished && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--background-warning)] p-3">
              <Warning size={16} className="shrink-0 text-[var(--foreground-warning)]" />
              <p className="text-caption text-[var(--foreground-warning)]">
                Syndication will begin once the job is published.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Platform Status */}
      <div className="flex flex-col gap-3">
        <h4 className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Platform Status
        </h4>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {availablePlatforms.map((platform) => {
              const info = PLATFORM_INFO[platform];
              const latestLog = latestByPlatform[platform];

              return (
                <div
                  key={platform}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--background-default)] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                        {info.label}
                      </span>
                      {latestLog && <StatusBadge status={latestLog.status} />}
                    </div>
                    <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                      {info.description}
                    </p>
                    {latestLog?.error && (
                      <p className="mt-1 text-caption text-[var(--foreground-error)]">
                        {latestLog.error}
                      </p>
                    )}
                  </div>
                  {latestLog?.status === "failed" && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => handleRetry(latestLog.id)}
                      loading={retrying === latestLog.id}
                    >
                      <ArrowClockwise size={14} className="mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
