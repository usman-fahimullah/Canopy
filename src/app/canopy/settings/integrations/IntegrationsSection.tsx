"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import { logger, formatError } from "@/lib/logger";
import {
  PROVIDER_CONFIGS,
  getProviderConfig,
  getProvidersByCategory,
  type IntegrationProvider,
  type IntegrationCategory,
} from "@/lib/integrations/types";
import {
  GoogleLogo,
  MicrosoftOutlookLogo,
  LinkedinLogo,
  SlackLogo,
  Briefcase,
  Plugs,
  LinkBreak,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConnectionData {
  id: string;
  provider: string;
  nangoConnectionId: string;
  scope: string;
  status: string;
  providerAccountEmail: string | null;
  providerAccountName: string | null;
  config: Record<string, unknown> | null;
  connectedByMemberId: string | null;
  errorMessage: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  GoogleLogo,
  MicrosoftOutlookLogo,
  LinkedinLogo,
  SlackLogo,
  Briefcase,
};

const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  calendar: "Calendar",
  syndication: "Job Boards",
  communication: "Communication",
};

// ---------------------------------------------------------------------------
// Integration Card
// ---------------------------------------------------------------------------

function IntegrationCard({
  provider,
  connection,
  connecting,
  onConnect,
  onDisconnect,
}: {
  provider: (typeof PROVIDER_CONFIGS)[number];
  connection: ConnectionData | undefined;
  connecting: boolean;
  onConnect: (provider: IntegrationProvider) => void;
  onDisconnect: (connectionId: string) => void;
}) {
  const Icon = ICON_MAP[provider.iconName] || Briefcase;
  const isConnected = connection?.status === "active";
  const hasError = connection?.status === "error";

  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-background)] p-5 shadow-[var(--shadow-card)]">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-subtle)]">
        <Icon size={24} weight="regular" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-body-sm font-medium text-[var(--foreground-default)]">
            {provider.label}
          </h4>
          {isConnected && (
            <Badge variant="success" size="sm">
              Connected
            </Badge>
          )}
          {hasError && (
            <Badge variant="error" size="sm">
              Error
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">{provider.description}</p>

        {/* Connected account info */}
        {isConnected && connection.providerAccountEmail && (
          <div className="mt-2 flex items-center gap-1.5 text-caption text-[var(--foreground-subtle)]">
            <CheckCircle size={14} weight="fill" className="text-[var(--foreground-success)]" />
            {connection.providerAccountEmail}
          </div>
        )}

        {/* Error message */}
        {hasError && connection?.errorMessage && (
          <div className="mt-2 flex items-center gap-1.5 text-caption text-[var(--foreground-error)]">
            <WarningCircle size={14} weight="fill" />
            {connection.errorMessage}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isConnected ? (
          <Button variant="tertiary" size="sm" onClick={() => onDisconnect(connection.id)}>
            <LinkBreak size={16} weight="bold" />
            Disconnect
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConnect(provider.provider)}
            loading={connecting}
          >
            <Plugs size={16} weight="bold" />
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function IntegrationCardSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-background)] p-5">
      <Skeleton className="h-10 w-10 rounded-[var(--radius-lg)]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-24 rounded-[var(--radius-button)]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Section
// ---------------------------------------------------------------------------

export default function IntegrationsSection({
  showToast,
}: {
  showToast: (message: string, variant?: "success" | "critical") => void;
}) {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<IntegrationProvider | null>(null);

  // Fetch connections
  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch("/api/canopy/integrations");
      if (res.ok) {
        const json = await res.json();
        setConnections(json.data || []);
      }
    } catch (err) {
      logger.error("Failed to fetch integrations", { error: formatError(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Sync a connection directly with Nango (fallback when webhook is delayed)
  const syncConnection = useCallback(async (provider: IntegrationProvider): Promise<boolean> => {
    try {
      const res = await fetch("/api/canopy/integrations/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      if (!res.ok) return false;
      const json = await res.json();
      return json.data?.status === "active";
    } catch {
      return false;
    }
  }, []);

  // Connect flow
  const handleConnect = useCallback(
    async (provider: IntegrationProvider) => {
      setConnectingProvider(provider);
      try {
        // 1. Get connect session token from our API
        const res = await fetch("/api/canopy/integrations/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider }),
        });

        if (!res.ok) {
          const json = await res.json();
          showToast(json.error || "Failed to start connection", "critical");
          return;
        }

        const { sessionToken } = await res.json();

        // 2. Open Nango connect UI with event callback
        const NangoFrontend = (await import("@nangohq/frontend")).default;
        const nango = new NangoFrontend({ connectSessionToken: sessionToken });

        nango.openConnectUI({
          onEvent: async (event) => {
            if (event.type === "connect") {
              // OAuth succeeded — sync the connection to our DB directly
              const synced = await syncConnection(provider);
              if (synced) {
                showToast(`${getProviderConfig(provider)?.label ?? provider} connected`, "success");
              } else {
                // Sync call failed but Nango has the connection;
                // webhook may still arrive so refetch after a delay
                setTimeout(() => fetchConnections(), 3000);
              }
              await fetchConnections();
            } else if (event.type === "error") {
              showToast(
                event.payload.errorMessage || "Connection failed. Please try again.",
                "critical"
              );
            } else if (event.type === "close") {
              // User closed the modal — refetch in case connection was made
              await fetchConnections();
            }
          },
        });
      } catch (err) {
        logger.error("Connect flow failed", { error: formatError(err), provider });
        showToast("Failed to connect. Please try again.", "critical");
      } finally {
        setConnectingProvider(null);
      }
    },
    [showToast, fetchConnections, syncConnection]
  );

  // Disconnect flow
  const handleDisconnect = useCallback(
    async (connectionId: string) => {
      try {
        const res = await fetch(`/api/canopy/integrations/${connectionId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const json = await res.json();
          showToast(json.error || "Failed to disconnect", "critical");
          return;
        }

        showToast("Integration disconnected");
        await fetchConnections();
      } catch (err) {
        logger.error("Disconnect failed", { error: formatError(err) });
        showToast("Failed to disconnect. Please try again.", "critical");
      }
    },
    [showToast, fetchConnections]
  );

  // Group connections by provider for lookup
  const connectionMap = new Map<string, ConnectionData>();
  for (const conn of connections) {
    connectionMap.set(conn.provider, conn);
  }

  const categories = getProvidersByCategory();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Integrations
        </h2>
        <Badge variant="neutral" size="sm">
          {connections.filter((c) => c.status === "active").length} connected
        </Badge>
      </div>

      {loading ? (
        <div className="space-y-8">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <div key={key} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="grid grid-cols-1 gap-4">
                <IntegrationCardSkeleton />
                <IntegrationCardSkeleton />
              </div>
            </div>
          ))}
        </div>
      ) : (
        Object.entries(categories).map(([category, providers]) => (
          <div key={category} className="space-y-3">
            <Label className="text-body-sm font-medium text-[var(--foreground-default)]">
              {CATEGORY_LABELS[category as IntegrationCategory]}
            </Label>
            <div className="grid grid-cols-1 gap-4">
              {providers.map((provider) => (
                <IntegrationCard
                  key={provider.provider}
                  provider={provider}
                  connection={connectionMap.get(provider.provider)}
                  connecting={connectingProvider === provider.provider}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Help text */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-info)] bg-[var(--background-info)] px-5 py-4">
        <p className="text-body-sm text-[var(--foreground-default)]">
          Integrations use OAuth to securely connect your accounts. Your credentials are encrypted
          and managed by our integration provider. You can disconnect at any time.
        </p>
      </div>
    </div>
  );
}
