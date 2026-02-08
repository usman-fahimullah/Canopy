"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SwitchWithLabel } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { EnvelopeSimple, Lightning } from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface StageConfig {
  enabled: boolean;
  templateId: string;
}

interface StageInfo {
  id: string;
  name: string;
}

interface TemplateOption {
  id: string;
  name: string;
  type: string;
  subject: string;
}

interface EmailAutomationSettingsProps {
  roleId: string;
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function EmailAutomationSettings({ roleId }: EmailAutomationSettingsProps) {
  const [config, setConfig] = React.useState<Record<string, StageConfig>>({});
  const [stages, setStages] = React.useState<StageInfo[]>([]);
  const [templates, setTemplates] = React.useState<TemplateOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Fetch automation config
  React.useEffect(() => {
    fetch(`/api/canopy/roles/${roleId}/email-automation`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setConfig(json.data.config ?? {});
        setStages(json.data.stages ?? []);
        setTemplates(json.data.templates ?? []);
      })
      .catch(() => {
        toast.error("Failed to load email automation settings");
      })
      .finally(() => setIsLoading(false));
  }, [roleId]);

  // Save config on change (debounced)
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveConfig = React.useCallback(
    (newConfig: Record<string, StageConfig>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          const res = await fetch(`/api/canopy/roles/${roleId}/email-automation`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newConfig),
          });
          if (!res.ok) throw new Error("Failed to save");
          toast.success("Email automation saved");
        } catch {
          toast.error("Failed to save email automation");
        } finally {
          setIsSaving(false);
        }
      }, 500);
    },
    [roleId]
  );

  const toggleStage = (stageId: string, enabled: boolean) => {
    const newConfig = {
      ...config,
      [stageId]: { ...(config[stageId] ?? { templateId: "" }), enabled },
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setTemplate = (stageId: string, templateId: string) => {
    const newConfig = {
      ...config,
      [stageId]: { ...(config[stageId] ?? { enabled: true }), templateId },
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Don't show automation for these stages (they're entry or terminal)
  const excludeStages = new Set(["applied", "hired"]);
  const configurableStages = stages.filter((s) => !excludeStages.has(s.id));

  const enabledCount = Object.values(config).filter((c) => c.enabled).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
          <Lightning size={18} weight="fill" className="text-[var(--foreground-brand)]" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-body-strong">Email Automation</CardTitle>
          <p className="text-caption text-[var(--foreground-muted)]">
            Auto-send emails when candidates move stages
          </p>
        </div>
        {enabledCount > 0 && <Badge variant="success">{enabledCount} active</Badge>}
        {isSaving && <Spinner size="sm" variant="current" />}
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {configurableStages.length === 0 && (
          <p className="text-caption text-[var(--foreground-muted)]">
            No pipeline stages configured for this role.
          </p>
        )}

        {configurableStages.map((stage) => {
          const stageConfig = config[stage.id];
          const isEnabled = stageConfig?.enabled ?? false;

          return (
            <div key={stage.id} className="rounded-lg border border-[var(--border-default)] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EnvelopeSimple
                    size={16}
                    className={
                      isEnabled
                        ? "text-[var(--foreground-brand)]"
                        : "text-[var(--foreground-disabled)]"
                    }
                  />
                  <span className="text-caption-strong">{stage.name}</span>
                </div>
                <SwitchWithLabel
                  label=""
                  checked={isEnabled}
                  onCheckedChange={(checked) => toggleStage(stage.id, checked)}
                />
              </div>

              {isEnabled && (
                <div className="mt-3">
                  <Select
                    value={stageConfig?.templateId || "default"}
                    onValueChange={(val) => setTemplate(stage.id, val === "default" ? "" : val)}
                  >
                    <SelectTrigger className="h-8 text-caption">
                      <SelectValue placeholder="Select template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default template</SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
