"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { Plus, Trash, DotsSixVertical, ArrowLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";

// ============================================
// TYPES
// ============================================

interface StageDefinition {
  id: string;
  name: string;
  phaseGroup: string;
  isBuiltIn?: boolean;
}

interface HiringStagesSectionProps {
  roleId: string;
}

const phaseGroupOptions = [
  { value: "applied", label: "Applied" },
  { value: "review", label: "Review" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
];

const phaseGroupColors: Record<string, string> = {
  applied: "info",
  review: "neutral",
  interview: "feature",
  offer: "warning",
  hired: "success",
};

// ============================================
// STAGE SETTINGS PANEL
// ============================================

function StageSettingsPanel({
  stage,
  onBack,
  onUpdate,
}: {
  stage: StageDefinition;
  onBack: () => void;
  onUpdate: (updated: StageDefinition) => void;
}) {
  const [name, setName] = React.useState(stage.name);
  const [phaseGroup, setPhaseGroup] = React.useState(stage.phaseGroup);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="tertiary" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft weight="bold" className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
            Stage Settings
          </h3>
          <p className="text-caption text-[var(--foreground-muted)]">{stage.name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Stage Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Stage name"
          inputSize="lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Phase Group
        </label>
        <Select value={phaseGroup} onValueChange={setPhaseGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Select phase" />
          </SelectTrigger>
          <SelectContent>
            {phaseGroupOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-caption-sm text-[var(--foreground-subtle)]">
          Determines which phase of the hiring pipeline this stage belongs to.
        </p>
      </div>

      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button
          variant="primary"
          onClick={() => {
            onUpdate({ ...stage, name, phaseGroup });
            onBack();
          }}
        >
          Update Stage
        </Button>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export function HiringStagesSection({ roleId }: HiringStagesSectionProps) {
  const [stages, setStages] = React.useState<StageDefinition[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editingStage, setEditingStage] = React.useState<StageDefinition | null>(null);

  // Fetch pipeline stages
  React.useEffect(() => {
    fetch(`/api/canopy/roles/${roleId}/pipeline`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => {
        setStages(data.data?.stages ?? []);
      })
      .catch((error) => {
        logger.error("Failed to fetch pipeline stages", { error: formatError(error) });
        toast.error("Failed to load pipeline stages");
      })
      .finally(() => setLoading(false));
  }, [roleId]);

  const handleAddStage = () => {
    const id = `stage-${Date.now()}`;
    setStages((prev) => [
      ...prev.slice(0, -1),
      { id, name: "New Stage", phaseGroup: "review" },
      prev[prev.length - 1],
    ]);
  };

  const handleDeleteStage = (id: string) => {
    const stage = stages.find((s) => s.id === id);
    if (stage?.isBuiltIn) {
      toast.error("Built-in stages cannot be removed");
      return;
    }
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateStage = (updated: StageDefinition) => {
    setStages((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/canopy/roles/${roleId}/pipeline`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stages: stages.map(({ id, name, phaseGroup }) => ({ id, name, phaseGroup })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save pipeline");
      }

      toast.success("Pipeline stages saved");
    } catch (error) {
      logger.error("Failed to save pipeline stages", { error: formatError(error) });
      toast.error(error instanceof Error ? error.message : "Failed to save pipeline");
    } finally {
      setSaving(false);
    }
  };

  // Show stage settings panel when editing
  if (editingStage) {
    return (
      <StageSettingsPanel
        stage={editingStage}
        onBack={() => setEditingStage(null)}
        onUpdate={handleUpdateStage}
      />
    );
  }

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
          Hiring Stages
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Configure the pipeline stages for this role. Drag to reorder.
        </p>
      </div>

      {/* Stage List */}
      <div className="flex flex-col gap-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-[var(--border-default)] p-3",
              "transition-colors hover:border-[var(--border-emphasis)]"
            )}
          >
            <DotsSixVertical
              weight="bold"
              className="h-5 w-5 shrink-0 cursor-grab text-[var(--foreground-disabled)]"
            />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-caption-strong font-medium text-[var(--foreground-default)]">
                {stage.name}
              </span>
              <Badge
                variant={
                  (phaseGroupColors[stage.phaseGroup] as
                    | "info"
                    | "neutral"
                    | "feature"
                    | "warning"
                    | "success") ?? "neutral"
                }
              >
                {stage.phaseGroup}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="tertiary"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingStage(stage)}
              >
                <span className="text-caption-sm font-medium text-[var(--foreground-brand)]">
                  Edit
                </span>
              </Button>
              {!stage.isBuiltIn && (
                <Button
                  variant="tertiary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteStage(stage.id)}
                >
                  <Trash weight="bold" className="h-4 w-4 text-[var(--foreground-error)]" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Stage Button */}
      <Button variant="tertiary" onClick={handleAddStage} className="w-fit">
        <Plus weight="bold" className="h-4 w-4" />
        Add Stage
      </Button>

      {/* Save Button */}
      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving && <Spinner size="sm" variant="current" />}
          {saving ? "Saving..." : "Save Pipeline"}
        </Button>
      </div>
    </div>
  );
}
