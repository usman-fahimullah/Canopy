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
import { Plus, Trash, DotsSixVertical, ArrowLeft, ShieldCheck } from "@phosphor-icons/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";

// ============================================
// TYPES
// ============================================

interface StageConfig {
  requiredScorecards?: number;
  requiredInterviews?: number;
  scorecardTemplateId?: string;
  requiresEmail?: boolean;
}

interface StageDefinition {
  id: string;
  name: string;
  phaseGroup: string;
  isBuiltIn?: boolean;
  config?: StageConfig;
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
// SORTABLE STAGE ROW
// ============================================

function SortableStageRow({
  stage,
  onEdit,
  onDelete,
}: {
  stage: StageDefinition;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stage.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid w-full items-center rounded-xl border border-[var(--border-default)] bg-[var(--background-default)] px-3 py-3",
        "grid-cols-[auto_1fr_auto_auto]",
        "transition-all",
        isDragging
          ? "z-10 border-[var(--border-brand)] opacity-90 shadow-[var(--shadow-elevated)]"
          : "hover:border-[var(--border-emphasis)]"
      )}
    >
      {/* Col 1: Drag handle */}
      <button
        type="button"
        className={cn(
          "flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg",
          "text-[var(--foreground-disabled)] transition-colors",
          "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-subtle)]",
          "active:cursor-grabbing",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
        )}
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${stage.name}`}
      >
        <DotsSixVertical weight="bold" className="h-5 w-5" />
      </button>

      {/* Col 2: Stage name */}
      <span className="truncate px-3 text-body-sm font-medium text-[var(--foreground-default)]">
        {stage.name}
      </span>

      {/* Col 3: Phase badge + gate indicator */}
      <div className="mr-2 flex items-center gap-1.5">
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
        {stage.config && (stage.config.requiredScorecards || stage.config.requiredInterviews) ? (
          <Badge variant="outline" className="text-caption-sm">
            <ShieldCheck size={12} weight="bold" className="mr-0.5" />
            Gated
          </Badge>
        ) : null}
      </div>

      {/* Col 4: Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        {!stage.isBuiltIn ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label={`Delete ${stage.name}`}
            className="text-[var(--foreground-error)] hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]"
          >
            <Trash weight="bold" className="h-5 w-5" />
          </Button>
        ) : (
          /* Placeholder to keep actions column width consistent */
          <div className="h-8 w-10" />
        )}
      </div>
    </div>
  );
}

// ============================================
// STAGE SETTINGS PANEL
// ============================================

const scorecardTemplateOptions = [
  { value: "auto", label: "Auto-detect (default)" },
  { value: "screening", label: "Screening Evaluation" },
  { value: "interview", label: "Interview Evaluation" },
  { value: "final", label: "Final Review" },
];

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
  const [requiredScorecards, setRequiredScorecards] = React.useState(
    stage.config?.requiredScorecards ?? 0
  );
  const [requiredInterviews, setRequiredInterviews] = React.useState(
    stage.config?.requiredInterviews ?? 0
  );
  const [scorecardTemplateId, setScorecardTemplateId] = React.useState(
    stage.config?.scorecardTemplateId ?? "auto"
  );

  const handleSave = () => {
    // Only include non-zero/non-empty config values to keep JSON clean
    const config: StageConfig = {};
    if (requiredScorecards > 0) config.requiredScorecards = requiredScorecards;
    if (requiredInterviews > 0) config.requiredInterviews = requiredInterviews;
    if (scorecardTemplateId && scorecardTemplateId !== "auto")
      config.scorecardTemplateId = scorecardTemplateId;

    onUpdate({
      ...stage,
      name,
      phaseGroup,
      ...(Object.keys(config).length > 0 ? { config } : { config: undefined }),
    });
    onBack();
  };

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

      {/* Stage Name */}
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

      {/* Phase Group */}
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

      {/* Stage Requirements */}
      <div className="border-t border-[var(--border-default)] pt-5">
        <h4 className="text-body-sm font-medium text-[var(--foreground-default)]">
          Stage Requirements
        </h4>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Set requirements that must be met before candidates can advance past this stage.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {/* Required Scorecards */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
              Minimum scorecards
            </label>
            <Input
              type="number"
              min={0}
              max={10}
              value={requiredScorecards}
              onChange={(e) =>
                setRequiredScorecards(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))
              }
              className="w-24"
            />
            <p className="text-caption-sm text-[var(--foreground-subtle)]">
              Set to 0 for no requirement.
            </p>
          </div>

          {/* Required Interviews */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
              Minimum completed interviews
            </label>
            <Input
              type="number"
              min={0}
              max={10}
              value={requiredInterviews}
              onChange={(e) =>
                setRequiredInterviews(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))
              }
              className="w-24"
            />
            <p className="text-caption-sm text-[var(--foreground-subtle)]">
              Set to 0 for no requirement.
            </p>
          </div>

          {/* Scorecard Template Override */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
              Scorecard template
            </label>
            <Select value={scorecardTemplateId} onValueChange={setScorecardTemplateId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Auto-detect (default)" />
              </SelectTrigger>
              <SelectContent>
                {scorecardTemplateOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-caption-sm text-[var(--foreground-subtle)]">
              Override which scorecard template is used when evaluating candidates at this stage.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave}>
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStages((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

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
          stages: stages.map(({ id, name, phaseGroup, config }) => ({
            id,
            name,
            phaseGroup,
            ...(config && Object.keys(config).length > 0 ? { config } : {}),
          })),
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
    <div className="flex w-full flex-col gap-4 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          Hiring Stages
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Configure the pipeline stages for this role. Drag to reorder.
        </p>
      </div>

      {/* Stage List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={stages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex w-full flex-col gap-2">
            {stages.map((stage) => (
              <SortableStageRow
                key={stage.id}
                stage={stage}
                onEdit={() => setEditingStage(stage)}
                onDelete={() => handleDeleteStage(stage.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
