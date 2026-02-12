"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

type NotificationType =
  | "APPLICATION_RECEIVED"
  | "STAGE_CHANGED"
  | "INTERVIEW_SCHEDULED"
  | "APPLICATION_REJECTED"
  | "NEW_APPLICATION"
  | "OFFER_RECEIVED"
  | "OFFER_VIEWED";

interface NotificationPreference {
  type: NotificationType;
  label: string;
  description: string;
  inApp: boolean;
  email: boolean;
}

interface NotificationPreferencesData {
  preferences: NotificationPreference[];
}

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const NOTIFICATION_TYPES: Record<NotificationType, { label: string; description: string }> = {
  APPLICATION_RECEIVED: {
    label: "Application Received",
    description: "New candidate application submitted",
  },
  STAGE_CHANGED: {
    label: "Stage Changed",
    description: "Candidate moves to a new pipeline stage",
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview Scheduled",
    description: "Interview scheduled with a candidate",
  },
  APPLICATION_REJECTED: {
    label: "Application Rejected",
    description: "Candidate application rejected or withdrawn",
  },
  NEW_APPLICATION: {
    label: "New Application",
    description: "Fresh application submitted",
  },
  OFFER_RECEIVED: {
    label: "Offer Received",
    description: "Candidate receives an offer",
  },
  OFFER_VIEWED: {
    label: "Offer Viewed",
    description: "Candidate views a sent offer",
  },
};

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications/preferences");
      if (!res.ok) {
        throw new Error("Failed to fetch notification preferences");
      }
      const data = await res.json();
      const raw = data.preferences || {};

      // API returns { inAppPrefs: {type: bool}, emailPrefs: {type: bool} }
      // Transform to array format the UI expects
      if (Array.isArray(raw)) {
        setPreferences(raw);
      } else {
        const inAppPrefs = (raw.inAppPrefs || {}) as Record<string, boolean>;
        const emailPrefs = (raw.emailPrefs || {}) as Record<string, boolean>;

        const prefs: NotificationPreference[] = Object.entries(NOTIFICATION_TYPES).map(
          ([type, { label, description }]) => ({
            type: type as NotificationType,
            label,
            description,
            inApp: inAppPrefs[type] !== false,
            email: emailPrefs[type] !== false,
          })
        );
        setPreferences(prefs);
      }
    } catch (err) {
      const message = formatError(err);
      logger.error("Failed to fetch notification preferences", { error: message });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Update a single preference
  const handleToggle = useCallback(
    (type: NotificationType, channel: "inApp" | "email", value: boolean) => {
      setPreferences((prev) =>
        prev.map((pref) => (pref.type === type ? { ...pref, [channel]: value } : pref))
      );
    },
    []
  );

  // Save all preferences
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      // Transform array format back to the API's { inAppPrefs, emailPrefs } shape
      const inAppPrefs: Record<string, boolean> = {};
      const emailPrefs: Record<string, boolean> = {};
      for (const pref of preferences) {
        inAppPrefs[pref.type] = pref.inApp;
        emailPrefs[pref.type] = pref.email;
      }

      const res = await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inAppPrefs, emailPrefs }),
      });

      if (!res.ok) {
        throw new Error("Failed to save notification preferences");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const message = formatError(err);
      logger.error("Failed to save notification preferences", { error: message });
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [preferences]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
        Notifications
      </h2>

      <p className="text-body text-[var(--foreground-muted)]">
        Choose how you want to be notified about hiring activities
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-l-4 border-l-[var(--border-error)]">
          <div className="flex gap-4 p-6">
            <WarningCircle size={24} className="shrink-0 text-[var(--foreground-error)]" />
            <div>
              <p className="font-medium text-[var(--foreground-error)]">
                Failed to load preferences
              </p>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">{error}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={fetchPreferences}>
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="rounded-lg border border-[var(--border-success)] bg-[var(--background-success)] px-6 py-4">
          <p className="text-body font-medium text-[var(--foreground-success)]">
            Preferences saved successfully
          </p>
        </div>
      )}

      {/* Content State */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {/* Notification Table */}
          <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
            <div className="bg-[var(--background-subtle)] px-6 py-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 text-caption-strong font-semibold uppercase text-[var(--foreground-subtle)]">
                  Notification Type
                </div>
                <div className="col-span-4 flex justify-end text-caption-strong font-semibold uppercase text-[var(--foreground-subtle)]">
                  In-App
                </div>
                <div className="col-span-4 flex justify-end text-caption-strong font-semibold uppercase text-[var(--foreground-subtle)]">
                  Email
                </div>
              </div>
            </div>

            <div className="divide-y divide-[var(--border-muted)]">
              {preferences.map((pref) => (
                <div key={pref.type} className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Label & Description */}
                    <div className="col-span-4">
                      <p className="text-body font-medium text-[var(--foreground-default)]">
                        {pref.label}
                      </p>
                      <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                        {pref.description}
                      </p>
                    </div>

                    {/* In-App Toggle */}
                    <div className="col-span-4 flex justify-end">
                      <SwitchWithLabel
                        label="In-App"
                        labelPosition="left"
                        labelClassName="sr-only"
                        checked={pref.inApp}
                        onCheckedChange={(value) => handleToggle(pref.type, "inApp", value)}
                      />
                    </div>

                    {/* Email Toggle */}
                    <div className="col-span-4 flex justify-end">
                      <SwitchWithLabel
                        label="Email"
                        labelPosition="left"
                        labelClassName="sr-only"
                        checked={pref.email}
                        onCheckedChange={(value) => handleToggle(pref.type, "email", value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <Card className="bg-[var(--background-info)] p-6">
            <p className="text-body text-[var(--foreground-default)]">
              <strong>In-App Notifications</strong> appear in your notification panel and via the
              badge count. <strong>Email Notifications</strong> are sent to your registered email
              address.
            </p>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={fetchPreferences} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSaving}
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
