"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";
import type { JobData } from "../../_lib/types";

// ============================================
// TYPES
// ============================================

interface ShareSettingsSectionProps {
  roleId: string;
  jobData: JobData;
  onJobDataChange: (updater: (prev: JobData) => JobData) => void;
}

// ============================================
// COMPONENT
// ============================================

export function ShareSettingsSection({
  roleId,
  jobData,
  onJobDataChange,
}: ShareSettingsSectionProps) {
  const fc = (jobData.formConfig as Record<string, unknown>) ?? {};
  const shareConfig = (fc.shareSettings as Record<string, string>) ?? {};

  const [ogTitle, setOgTitle] = React.useState(shareConfig.ogTitle ?? jobData.title);
  const [ogDescription, setOgDescription] = React.useState(shareConfig.ogDescription ?? "");
  const [ogImage, setOgImage] = React.useState(shareConfig.ogImage ?? "");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/canopy/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formConfig: {
            ...fc,
            shareSettings: { ogTitle, ogDescription, ogImage },
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      onJobDataChange((prev) => ({
        ...prev,
        formConfig: {
          ...(prev.formConfig as Record<string, unknown>),
          shareSettings: { ogTitle, ogDescription, ogImage },
        },
      }));

      toast.success("Share settings saved");
    } catch (error) {
      logger.error("Failed to save share settings", { error: formatError(error) });
      toast.error("Failed to save share settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          Share Settings
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Customize how this role appears when shared on social media.
        </p>
      </div>

      {/* OG Title */}
      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Social Title
        </label>
        <Input
          value={ogTitle}
          onChange={(e) => setOgTitle(e.target.value)}
          placeholder="Title shown when shared"
          inputSize="lg"
        />
      </div>

      {/* OG Description */}
      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Social Description
        </label>
        <Input
          value={ogDescription}
          onChange={(e) => setOgDescription(e.target.value)}
          placeholder="Description shown when shared"
          inputSize="lg"
        />
        <p className="text-caption-sm text-[var(--foreground-subtle)]">
          Keep it under 160 characters for best results.
        </p>
      </div>

      {/* OG Image */}
      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Share Image URL
        </label>
        <Input
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
          placeholder="https://example.com/image.png"
          inputSize="lg"
        />
        <p className="text-caption-sm text-[var(--foreground-subtle)]">
          Recommended size: 1200x630px. Falls back to company logo if not set.
        </p>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] p-4">
        <p className="mb-2 text-caption-strong font-medium text-[var(--foreground-default)]">
          Preview
        </p>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--background-default)] p-4">
          {ogImage && (
            <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-[var(--background-muted)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogImage} alt="Share preview" className="h-full w-full object-cover" />
            </div>
          )}
          <p className="text-caption-strong font-bold text-[var(--foreground-default)]">
            {ogTitle || jobData.title}
          </p>
          {ogDescription && (
            <p className="mt-1 text-caption-sm text-[var(--foreground-muted)]">{ogDescription}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving && <Spinner size="sm" variant="current" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
