"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";

// ============================================
// TYPES
// ============================================

interface EmailConfig {
  [stageId: string]: {
    enabled: boolean;
    templateId: string;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
}

interface EmailSectionProps {
  roleId: string;
}

// ============================================
// SHARED HOOK — fetch email automation config
// ============================================

function useEmailAutomation(roleId: string) {
  const [config, setConfig] = React.useState<EmailConfig>({});
  const [templates, setTemplates] = React.useState<EmailTemplate[]>([]);
  const [stages, setStages] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/canopy/roles/${roleId}/email-automation`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => {
        setConfig(data.data?.config ?? {});
        setTemplates(data.data?.templates ?? []);
        setStages(data.data?.stages ?? []);
      })
      .catch((error) => {
        logger.error("Failed to fetch email automation", { error: formatError(error) });
      })
      .finally(() => setLoading(false));
  }, [roleId]);

  const saveConfig = async (updates: EmailConfig) => {
    const merged = { ...config, ...updates };
    const res = await fetch(`/api/canopy/roles/${roleId}/email-automation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
    if (!res.ok) throw new Error("Failed to save");
    setConfig(merged);
  };

  return { config, setConfig, templates, stages, loading, saveConfig };
}

// ============================================
// CONFIRMATION EMAIL SECTION
// ============================================

export function ConfirmationEmailSection({ roleId }: EmailSectionProps) {
  const { config, templates, loading, saveConfig } = useEmailAutomation(roleId);
  const [saving, setSaving] = React.useState(false);

  // The "applied" stage confirmation email
  const appliedConfig = config["applied"] ?? { enabled: false, templateId: "" };
  const [enabled, setEnabled] = React.useState(appliedConfig.enabled);
  const [templateId, setTemplateId] = React.useState(appliedConfig.templateId);

  // Sync local state when config loads
  React.useEffect(() => {
    if (config["applied"]) {
      setEnabled(config["applied"].enabled);
      setTemplateId(config["applied"].templateId);
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConfig({
        applied: { enabled, templateId },
      });
      toast.success("Confirmation email saved");
    } catch (error) {
      logger.error("Failed to save confirmation email", { error: formatError(error) });
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          Confirmation Email
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Automatically send a confirmation email when a candidate applies.
        </p>
      </div>

      <SwitchWithLabel
        label="Send confirmation email on application"
        helperText="Candidates will receive an email confirming their application was received."
        labelPosition="right"
        checked={enabled}
        onCheckedChange={setEnabled}
      />

      {enabled && (
        <div className="flex flex-col gap-2">
          <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
            Email Template
          </label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((tmpl) => (
                <SelectItem key={tmpl.id} value={tmpl.id}>
                  <span className="flex flex-col">
                    <span>{tmpl.name}</span>
                    <span className="text-caption-sm text-[var(--foreground-subtle)]">
                      {tmpl.subject}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving && <Spinner size="sm" variant="current" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// FIRST REPLY STATUS SECTION
// ============================================

export function FirstReplySection({ roleId }: EmailSectionProps) {
  const { config, templates, stages, loading, saveConfig } = useEmailAutomation(roleId);
  const [saving, setSaving] = React.useState(false);

  // First reply = auto-reply when candidate is moved to screening/next stage
  const screeningStage = stages.find((s) => s.id !== "applied") ?? { id: "screening" };
  const stageConfig = config[screeningStage.id] ?? { enabled: false, templateId: "" };
  const [enabled, setEnabled] = React.useState(stageConfig.enabled);
  const [templateId, setTemplateId] = React.useState(stageConfig.templateId);
  const [delayHours, setDelayHours] = React.useState("0");

  React.useEffect(() => {
    if (config[screeningStage.id]) {
      setEnabled(config[screeningStage.id].enabled);
      setTemplateId(config[screeningStage.id].templateId);
    }
  }, [config, screeningStage.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConfig({
        [screeningStage.id]: { enabled, templateId },
      });
      toast.success("First reply settings saved");
    } catch (error) {
      logger.error("Failed to save first reply", { error: formatError(error) });
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          First Reply Status
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Automatically send a reply when a candidate is moved to the next stage.
        </p>
      </div>

      <SwitchWithLabel
        label="Auto-reply on stage advancement"
        helperText="Send an email when a candidate moves from Applied to the next stage."
        labelPosition="right"
        checked={enabled}
        onCheckedChange={setEnabled}
      />

      {enabled && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
              Email Template
            </label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tmpl) => (
                  <SelectItem key={tmpl.id} value={tmpl.id}>
                    <span className="flex flex-col">
                      <span>{tmpl.name}</span>
                      <span className="text-caption-sm text-[var(--foreground-subtle)]">
                        {tmpl.subject}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
              Delay (hours)
            </label>
            <Input
              type="number"
              min="0"
              max="72"
              value={delayHours}
              onChange={(e) => setDelayHours(e.target.value)}
              placeholder="0"
              inputSize="lg"
            />
            <p className="text-caption-sm text-[var(--foreground-subtle)]">
              Set to 0 to send immediately. Maximum 72 hours.
            </p>
          </div>
        </>
      )}

      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving && <Spinner size="sm" variant="current" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
