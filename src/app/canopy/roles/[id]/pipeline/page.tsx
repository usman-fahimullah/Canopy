"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { ArrowLeft, DotsSixVertical, Plus, Trash, FloppyDisk, Info } from "@phosphor-icons/react";
import { ASSIGNABLE_PHASE_GROUPS, type PhaseGroup } from "@/lib/pipeline/stage-registry";
import { getPhaseGroupConfig } from "@/lib/pipeline/stage-registry-ui";
import { logger, formatError } from "@/lib/logger";

// ============================================
// TYPES
// ============================================

interface PipelineStage {
  id: string;
  name: string;
  phaseGroup: PhaseGroup;
  isBuiltIn: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function PipelineSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch pipeline stages
  const fetchStages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/canopy/roles/${roleId}/pipeline`);
      if (!res.ok) throw new Error("Failed to load pipeline");
      const data = await res.json();
      setStages(data.data.stages);
      setError(null);
    } catch (err) {
      logger.error("Failed to fetch pipeline stages", {
        error: formatError(err),
        endpoint: "pipeline/page",
      });
      setError("Failed to load pipeline stages");
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  // Save pipeline
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/canopy/roles/${roleId}/pipeline`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stages: stages.map((s) => ({
            id: s.id,
            name: s.name,
            phaseGroup: s.phaseGroup,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save");
      }

      setHasChanges(false);
      setToast({ message: "Pipeline saved successfully", variant: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save pipeline";
      setToast({ message, variant: "critical" });
    } finally {
      setSaving(false);
    }
  };

  // Add a new custom stage
  const handleAddStage = () => {
    const newId = `custom-${Date.now()}`;
    const newStage: PipelineStage = {
      id: newId,
      name: "",
      phaseGroup: "review",
      isBuiltIn: false,
    };

    // Insert before the last stage (typically "hired")
    const insertIdx = stages.length > 1 ? stages.length - 1 : stages.length;
    const updated = [...stages];
    updated.splice(insertIdx, 0, newStage);
    setStages(updated);
    setHasChanges(true);
  };

  // Remove a stage
  const handleRemoveStage = (index: number) => {
    setStages((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Update stage name
  const handleNameChange = (index: number, name: string) => {
    setStages((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        // Auto-generate ID from name for new custom stages
        const isNewCustom = s.id.startsWith("custom-");
        const id = isNewCustom
          ? name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || s.id
          : s.id;
        return { ...s, name, id };
      })
    );
    setHasChanges(true);
  };

  // Update stage phase group
  const handlePhaseGroupChange = (index: number, phaseGroup: string) => {
    setStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, phaseGroup: phaseGroup as PhaseGroup } : s))
    );
    setHasChanges(true);
  };

  // Move stage up/down (simple reorder without drag-and-drop for now)
  const handleMoveStage = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= stages.length) return;

    const updated = [...stages];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setStages(updated);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-body text-foreground-error">{error}</p>
        <Button variant="secondary" onClick={fetchStages}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/canopy/roles/${roleId}`)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-heading-sm font-semibold text-foreground">Pipeline Settings</h1>
            <p className="text-caption text-foreground-muted">
              Configure the hiring stages for this role
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!hasChanges || saving}
          loading={saving}
        >
          <FloppyDisk weight="bold" className="mr-2 h-4 w-4" />
          Save Pipeline
        </Button>
      </div>

      {/* Phase Group Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-body-strong">
            <Info size={18} className="text-foreground-muted" />
            Phase Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-caption text-foreground-muted">
            Each stage belongs to a phase group. Job seekers see a simplified view grouped by these
            phases (e.g., all &quot;Review&quot; stages appear under &quot;In Review&quot;).
          </p>
          <div className="flex flex-wrap gap-2">
            {ASSIGNABLE_PHASE_GROUPS.map((g) => {
              const config = getPhaseGroupConfig(g.value);
              const Icon = config.icon;
              return (
                <SimpleTooltip key={g.value} content={g.description}>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${config.badgeBg} ${config.badgeText}`}
                  >
                    <Icon size={14} weight="bold" />
                    <span className="text-caption-strong">{g.label}</span>
                  </div>
                </SimpleTooltip>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-body-strong">Pipeline Stages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stages.map((stage, index) => {
            const phaseConfig = getPhaseGroupConfig(stage.phaseGroup);
            const Icon = phaseConfig.icon;

            return (
              <div
                key={stage.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--background-default)] p-3 transition-colors hover:border-[var(--border-emphasis)]"
              >
                {/* Drag handle (visual only for now) */}
                <DotsSixVertical
                  size={20}
                  className="flex-shrink-0 cursor-grab text-foreground-disabled"
                />

                {/* Phase icon */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${phaseConfig.badgeBg}`}
                >
                  <Icon size={16} weight="bold" className={phaseConfig.badgeText} />
                </div>

                {/* Stage name input */}
                <div className="min-w-0 flex-1">
                  <Input
                    value={stage.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder="Stage name..."
                    className="h-9"
                  />
                </div>

                {/* Phase group dropdown */}
                <div className="w-36 flex-shrink-0">
                  <Dropdown
                    value={stage.phaseGroup}
                    onValueChange={(v) => handlePhaseGroupChange(index, v)}
                  >
                    <DropdownTrigger className="h-9 w-full">
                      <DropdownValue placeholder="Phase" />
                    </DropdownTrigger>
                    <DropdownContent>
                      {ASSIGNABLE_PHASE_GROUPS.map((g) => (
                        <DropdownItem key={g.value} value={g.value}>
                          {g.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </div>

                {/* Built-in badge or delete button */}
                {stage.isBuiltIn ? (
                  <Badge variant="neutral" className="flex-shrink-0">
                    Default
                  </Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStage(index)}
                    className="flex-shrink-0 text-foreground-muted hover:text-foreground-error"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            );
          })}

          {/* Add Stage Button */}
          <button
            type="button"
            onClick={handleAddStage}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border-default)] py-3 text-caption text-foreground-muted transition-colors hover:border-[var(--border-emphasis)] hover:text-foreground"
          >
            <Plus size={16} weight="bold" />
            Add custom stage
          </button>
        </CardContent>
      </Card>

      {/* Toast */}
      {toast && (
        <Toast
          variant={toast.variant}
          dismissible
          onDismiss={() => setToast(null)}
          autoDismiss={3000}
        >
          {toast.variant === "success" ? "Saved" : "Error"}: {toast.message}
        </Toast>
      )}
    </div>
  );
}
