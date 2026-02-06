"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { SwitchWithLabel } from "@/components/ui/switch";
import { FormCard, FormSection } from "@/components/ui/form-section";
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
import { logger, formatError } from "@/lib/logger";

interface SyndicationLog {
  id: string;
  platform: string;
  action: string;
  status: string;
  externalId: string | null;
  error: string | null;
  createdAt: string;
}

interface SyndicationPanelProps {
  jobId: string;
  syndicationEnabled: boolean;
  jobStatus: string;
  onToggleSyndication: (enabled: boolean) => void;
}

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

export function SyndicationPanel({
  jobId,
  syndicationEnabled,
  jobStatus,
  onToggleSyndication,
}: SyndicationPanelProps) {
  const [logs, setLogs] = React.useState<SyndicationLog[]>([]);
  const [latestByPlatform, setLatestByPlatform] = React.useState<Record<string, SyndicationLog>>(
    {}
  );
  const [loading, setLoading] = React.useState(true);
  const [retrying, setRetrying] = React.useState<string | null>(null);

  const fetchStatus = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/canopy/roles/${jobId}/syndication`);
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
  }, [jobId]);

  React.useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleRetry(logId: string) {
    setRetrying(logId);
    try {
      const res = await fetch(`/api/canopy/roles/${jobId}/syndication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (error) {
      logger.error("Failed to retry syndication", {
        error: formatError(error),
      });
    } finally {
      setRetrying(null);
    }
  }

  const isPublished = jobStatus === "PUBLISHED";
  const availablePlatforms = Object.keys(PLATFORM_INFO);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-6">
      {/* Toggle + Description */}
      <FormCard>
        <FormSection title="External Job Board Syndication">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
                <ShareNetwork size={20} weight="regular" />
              </div>
              <div className="flex-1">
                <p className="text-body text-[var(--foreground-default)]">
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
                checked={syndicationEnabled}
                onCheckedChange={onToggleSyndication}
              />
              {syndicationEnabled && !isPublished && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--background-warning)] p-3">
                  <Warning size={16} className="shrink-0 text-[var(--foreground-warning)]" />
                  <p className="text-caption text-[var(--foreground-warning)]">
                    Syndication will begin once the job is published.
                  </p>
                </div>
              )}
            </div>
          </div>
        </FormSection>
      </FormCard>

      {/* Platform Status Cards */}
      <FormCard>
        <FormSection title="Platform Status">
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
                    className="flex items-center gap-4 rounded-xl border border-[var(--border-muted)] bg-[var(--background-default)] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--foreground-default)]">
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
        </FormSection>
      </FormCard>

      {/* Recent Activity */}
      {logs.length > 0 && (
        <FormCard>
          <FormSection title="Recent Activity">
            <div className="max-h-[300px] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {logs.slice(0, 20).map((log) => {
                  const info = PLATFORM_INFO[log.platform];
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 rounded-lg border border-[var(--border-muted)] px-3 py-2"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--background-subtle)]">
                        {info?.icon ?? <ShareNetwork size={14} />}
                      </div>
                      <div className="flex-1 text-caption">
                        <span className="font-medium">{info?.label ?? log.platform}</span>
                        {" — "}
                        <span className="text-[var(--foreground-muted)]">{log.action}</span>
                      </div>
                      <StatusBadge status={log.status} />
                      <span className="text-caption-sm text-[var(--foreground-subtle)]">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FormSection>
        </FormCard>
      )}

      {/* Feed URL Info */}
      {syndicationEnabled && (
        <FormCard>
          <FormSection title="Direct Feed URLs">
            <p className="mb-3 text-caption text-[var(--foreground-muted)]">
              These feed URLs are automatically maintained. Share them with job boards that support
              XML feed ingestion.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-subtle)] px-3 py-2">
                <Rss size={14} className="shrink-0 text-[var(--foreground-muted)]" />
                <code className="flex-1 text-caption-sm text-[var(--foreground-default)]">
                  {typeof window !== "undefined" ? window.location.origin : ""}/api/feeds/indeed.xml
                </code>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-subtle)] px-3 py-2">
                <Rss size={14} className="shrink-0 text-[var(--foreground-muted)]" />
                <code className="flex-1 text-caption-sm text-[var(--foreground-default)]">
                  {typeof window !== "undefined" ? window.location.origin : ""}/feed.xml
                </code>
              </div>
            </div>
          </FormSection>
        </FormCard>
      )}
    </div>
  );
}
