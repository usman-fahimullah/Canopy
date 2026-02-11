"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  ChatCenteredText,
  PencilSimpleLine,
  DotsSixVertical,
  Plus,
  Trash,
  Eye,
  Copy,
  Check,
  ListBullets,
  Circle,
  CheckSquare,
  Upload,
  Link as LinkChain,
  FloppyDisk,
  CheckCircle,
  ClipboardText,
  Warning,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ApplyFormState } from "../_lib/use-role-form";
import type {
  FormQuestion,
  SortableQuestionItemProps,
  PersonalDetailsConfig,
  CareerDetailsConfig,
} from "../_lib/types";
import { getQuestionIconWithBg } from "../_lib/helpers";
import { ApplyFormModals } from "./ApplyFormModals";

// ============================================
// TYPES
// ============================================

interface ApplyFormTabProps {
  roleId: string;
  applyFormState: ApplyFormState;
  jobStatus: string;
  saving: boolean;
  onSave: () => Promise<boolean>;
}

// ============================================
// HELPERS
// ============================================

const QUESTION_TYPE_LABELS: Record<FormQuestion["type"], string> = {
  text: "Text",
  "yes-no": "Yes / No",
  "multiple-choice": "Multiple Choice",
  "file-upload": "File Upload",
};

function getVisibleFieldNames(
  config: PersonalDetailsConfig | CareerDetailsConfig,
  labelMap: Record<string, string>
): string {
  const entries = Object.entries(config) as [string, { visible: boolean; required: boolean }][];
  const visible = entries.filter(([, v]) => v.visible).map(([k]) => labelMap[k] ?? k);
  if (visible.length === 0) return "No fields enabled";
  return visible.join(", ");
}

const PERSONAL_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  dateOfBirth: "Date of Birth",
  pronouns: "Pronouns",
  location: "Location",
};

const CAREER_FIELD_LABELS: Record<string, string> = {
  currentRole: "Current Role",
  currentCompany: "Current Company",
  yearsExperience: "Experience",
  linkedIn: "LinkedIn",
  portfolio: "Portfolio",
};

// ============================================
// SORTABLE QUESTION ITEM (internal)
// ============================================

function SortableQuestionItem({
  question,
  onEdit,
  onDelete,
  getIconWithBg,
}: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4 transition-colors hover:bg-[var(--background-interactive-hover)]"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          type="button"
          className="-ml-2 cursor-grab p-1 text-[var(--foreground-disabled)] transition-colors hover:text-[var(--foreground-muted)] active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <DotsSixVertical weight="bold" className="h-5 w-5" />
        </button>
        {getIconWithBg(question.type)}
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm font-medium text-foreground">{question.title}</span>
          <div className="flex items-center gap-2">
            <span className="text-caption-sm text-[var(--foreground-subtle)]">
              {QUESTION_TYPE_LABELS[question.type]}
            </span>
            {question.required && (
              <Badge variant="outline-primary" size="sm">
                Required
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<PencilSimpleLine weight="regular" className="h-4 w-4" />}
          onClick={() => onEdit(question.id, question.type)}
        >
          Edit
        </Button>
        <SimpleTooltip content="Delete question">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(question.id)}
            className="text-[var(--foreground-subtle)] hover:text-[var(--foreground-error)]"
          >
            <Trash weight="regular" className="h-4 w-4" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}

// ============================================
// ADD QUESTION DROPDOWN (extracted for reuse)
// ============================================

function AddQuestionDropdown({ onAdd }: { onAdd: (type: FormQuestion["type"]) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="tertiary" size="sm" leftIcon={<Plus weight="bold" className="h-4 w-4" />}>
          Add question
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 p-1.5">
        <div className="mb-1 px-3 py-1.5">
          <span className="text-caption-strong text-[var(--foreground-muted)]">Question Type</span>
        </div>
        <DropdownMenuItem onClick={() => onAdd("text")} className="flex items-center gap-3 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primitive-blue-100)]">
            <ListBullets
              weight="regular"
              className="h-3.5 w-3.5 text-[var(--primitive-blue-500)]"
            />
          </div>
          <span className="text-body-sm">Text</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd("yes-no")}
          className="flex items-center gap-3 py-2.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primitive-red-100)]">
            <Circle weight="regular" className="h-3.5 w-3.5 text-[var(--primitive-red-500)]" />
          </div>
          <span className="text-body-sm">Yes / No</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd("multiple-choice")}
          className="flex items-center gap-3 py-2.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primitive-yellow-100)]">
            <CheckSquare
              weight="regular"
              className="h-3.5 w-3.5 text-[var(--primitive-yellow-600)]"
            />
          </div>
          <span className="text-body-sm">Multiple Choice</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd("file-upload")}
          className="flex items-center gap-3 py-2.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primitive-blue-100)]">
            <Upload weight="regular" className="h-3.5 w-3.5 text-[var(--primitive-blue-500)]" />
          </div>
          <span className="text-body-sm">File Upload</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// COMPONENT
// ============================================

export function ApplyFormTab({
  roleId,
  applyFormState,
  jobStatus,
  saving,
  onSave,
}: ApplyFormTabProps) {
  const {
    personalDetails,
    setPersonalDetails,
    careerDetails,
    setCareerDetails,
    questionsEnabled,
    setQuestionsEnabled,
    questions,
    setQuestions,
  } = applyFormState;

  // ============================================
  // MODAL OPEN STATES (local to this tab)
  // ============================================
  const [personalDetailsModalOpen, setPersonalDetailsModalOpen] = React.useState(false);
  const [careerDetailsModalOpen, setCareerDetailsModalOpen] = React.useState(false);
  const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null);
  const [textQuestionModalOpen, setTextQuestionModalOpen] = React.useState(false);
  const [yesNoQuestionModalOpen, setYesNoQuestionModalOpen] = React.useState(false);
  const [multipleChoiceModalOpen, setMultipleChoiceModalOpen] = React.useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = React.useState(false);

  // ============================================
  // SAVE HANDLER
  // ============================================
  const [saved, setSaved] = React.useState(false);

  const handleSave = React.useCallback(async () => {
    const success = await onSave();
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [onSave]);

  // ============================================
  // DELETE CONFIRMATION
  // ============================================
  const [deleteTarget, setDeleteTarget] = React.useState<FormQuestion | null>(null);

  const handleRequestDelete = React.useCallback(
    (id: string) => {
      const q = questions.find((q) => q.id === id) ?? null;
      setDeleteTarget(q);
    },
    [questions]
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (deleteTarget) {
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }, [deleteTarget, setQuestions]);

  // ============================================
  // SHAREABLE LINK
  // ============================================
  const [linkCopied, setLinkCopied] = React.useState(false);
  const isPublished = jobStatus === "PUBLISHED";
  const applicationLink = `${typeof window !== "undefined" ? window.location.origin : ""}/apply/${roleId}`;

  const copyLink = React.useCallback(() => {
    navigator.clipboard.writeText(applicationLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, [applicationLink]);

  // ============================================
  // DRAG AND DROP
  // ============================================
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ============================================
  // QUESTION HANDLERS
  // ============================================
  const handleAddQuestion = (type: FormQuestion["type"]) => {
    const newQuestion: FormQuestion = {
      id: `q${Date.now()}`,
      type,
      title:
        type === "text"
          ? "New text question"
          : type === "yes-no"
            ? "New yes/no question"
            : type === "multiple-choice"
              ? "New multiple choice question"
              : "Upload a file",
      required: false,
      ...(type === "multiple-choice" ? { options: ["Option 1", "Option 2", "Option 3"] } : {}),
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleEditQuestion = (id: string, type: string) => {
    setEditingQuestionId(id);
    if (type === "text") {
      setTextQuestionModalOpen(true);
    } else if (type === "yes-no") {
      setYesNoQuestionModalOpen(true);
    } else if (type === "multiple-choice") {
      setMultipleChoiceModalOpen(true);
    } else if (type === "file-upload") {
      setFileUploadModalOpen(true);
    }
  };

  const handleOpenPersonalDetailsModal = () => {
    setPersonalDetailsModalOpen(true);
  };

  const handleOpenCareerDetailsModal = () => {
    setCareerDetailsModalOpen(true);
  };

  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {/* Apply Form Header Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--card-background)]">
          {/* Title Row — title left, actions right */}
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-heading-sm text-foreground">Apply Form</h2>
              <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                Customize the application candidates will fill out.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SimpleTooltip content="Preview the form as candidates see it">
                <Button
                  variant="tertiary"
                  size="sm"
                  leftIcon={<Eye weight="regular" className="h-4 w-4" />}
                  onClick={() => window.open(`/apply/${roleId}?preview=true`, "_blank")}
                >
                  Preview
                </Button>
              </SimpleTooltip>
              <Button
                variant="primary"
                size="sm"
                leftIcon={
                  saved ? (
                    <CheckCircle weight="bold" className="h-4 w-4" />
                  ) : (
                    <FloppyDisk weight="regular" className="h-4 w-4" />
                  )
                }
                loading={saving}
                onClick={handleSave}
              >
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Share Link Row — only shown for published roles */}
          {isPublished && (
            <>
              <Separator />
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-2 text-caption text-[var(--foreground-muted)]">
                  <CheckCircle weight="fill" className="h-4 w-4 text-[var(--foreground-success)]" />
                  <span>Share this link with candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-muted)] bg-[var(--background-subtle)] px-3 py-1.5">
                    <LinkChain
                      weight="regular"
                      className="h-3.5 w-3.5 text-[var(--foreground-subtle)]"
                    />
                    <code className="max-w-[300px] truncate font-mono text-caption-sm text-[var(--foreground-default)]">
                      {applicationLink}
                    </code>
                  </div>
                  <SimpleTooltip content={linkCopied ? "Copied!" : "Copy application link"}>
                    <Button
                      variant="tertiary"
                      size="sm"
                      leftIcon={
                        linkCopied ? (
                          <Check
                            weight="bold"
                            className="h-4 w-4 text-[var(--foreground-success)]"
                          />
                        ) : (
                          <Copy weight="regular" className="h-4 w-4" />
                        )
                      }
                      onClick={copyLink}
                    >
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </Button>
                  </SimpleTooltip>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Personal Info Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--card-background)]">
          {/* Header */}
          <div className="border-b border-[var(--border-muted)] p-6">
            <h2 className="text-body-strong text-foreground">Personal Info</h2>
            <p className="mt-1 text-caption text-[var(--foreground-muted)]">
              Choose which fields candidates see when applying.
            </p>
          </div>

          {/* Personal Details Row */}
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-6 py-4 transition-colors hover:bg-[var(--background-interactive-hover)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                <User weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-sm font-medium text-foreground">Personal Details</span>
                <span className="text-caption text-[var(--foreground-subtle)]">
                  {getVisibleFieldNames(personalDetails, PERSONAL_FIELD_LABELS)}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={handleOpenPersonalDetailsModal}
              leftIcon={<PencilSimpleLine weight="regular" className="h-4 w-4" />}
            >
              Edit
            </Button>
          </div>

          {/* Career Details Row */}
          <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--background-interactive-hover)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-green-100)]">
                <ChatCenteredText
                  weight="regular"
                  className="h-5 w-5 text-[var(--primitive-green-600)]"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-sm font-medium text-foreground">Career Details</span>
                <span className="text-caption text-[var(--foreground-subtle)]">
                  {getVisibleFieldNames(careerDetails, CAREER_FIELD_LABELS)}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={handleOpenCareerDetailsModal}
              leftIcon={<PencilSimpleLine weight="regular" className="h-4 w-4" />}
            >
              Edit
            </Button>
          </div>
        </div>

        {/* Questions Section Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--card-background)]">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] p-6">
            <div className="flex items-center gap-3">
              <Switch checked={questionsEnabled} onCheckedChange={setQuestionsEnabled} />
              <div>
                <h2 className="text-body-strong text-foreground">Questions</h2>
                <p className="text-caption text-[var(--foreground-muted)]">
                  {questionsEnabled
                    ? `${questions.length} question${questions.length !== 1 ? "s" : ""}`
                    : "Disabled — candidates won\u2019t see custom questions"}
                </p>
              </div>
            </div>
            {questionsEnabled && questions.length > 0 && (
              <AddQuestionDropdown onAdd={handleAddQuestion} />
            )}
          </div>

          {questionsEnabled ? (
            <>
              {questions.length === 0 ? (
                /* Empty state when no questions */
                <div className="px-6 py-10">
                  <EmptyState
                    icon={
                      <ClipboardText
                        weight="regular"
                        className="h-8 w-8 text-[var(--foreground-subtle)]"
                      />
                    }
                    title="No questions yet"
                    description="Add custom questions to learn more about your candidates."
                    size="sm"
                  />
                  <div className="mt-4 flex justify-center">
                    <AddQuestionDropdown onAdd={handleAddQuestion} />
                  </div>
                </div>
              ) : (
                <>
                  {/* Question Items with Drag and Drop */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={questions.map((q) => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {questions.map((question) => (
                        <SortableQuestionItem
                          key={question.id}
                          question={question}
                          onEdit={handleEditQuestion}
                          onDelete={handleRequestDelete}
                          getIconWithBg={getQuestionIconWithBg}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>

                  {/* Bottom add button */}
                  <div className="p-4 px-6">
                    <AddQuestionDropdown onAdd={handleAddQuestion} />
                  </div>
                </>
              )}
            </>
          ) : (
            /* Disabled state */
            <div className="flex items-center gap-3 px-6 py-5 text-[var(--foreground-subtle)]">
              <Warning weight="regular" className="h-4 w-4 shrink-0" />
              <p className="text-caption">
                Custom questions are turned off. Toggle the switch above to add screening questions
                to your application form.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete question?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `"${deleteTarget.title}" will be removed from the application form. This can\u2019t be undone.`
                : "This question will be removed."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Modals */}
      <ApplyFormModals
        personalDetailsModalOpen={personalDetailsModalOpen}
        setPersonalDetailsModalOpen={setPersonalDetailsModalOpen}
        personalDetails={personalDetails}
        setPersonalDetails={setPersonalDetails}
        careerDetailsModalOpen={careerDetailsModalOpen}
        setCareerDetailsModalOpen={setCareerDetailsModalOpen}
        careerDetails={careerDetails}
        setCareerDetails={setCareerDetails}
        editingQuestionId={editingQuestionId}
        setEditingQuestionId={setEditingQuestionId}
        questions={questions}
        setQuestions={setQuestions}
        textQuestionModalOpen={textQuestionModalOpen}
        setTextQuestionModalOpen={setTextQuestionModalOpen}
        yesNoQuestionModalOpen={yesNoQuestionModalOpen}
        setYesNoQuestionModalOpen={setYesNoQuestionModalOpen}
        multipleChoiceModalOpen={multipleChoiceModalOpen}
        setMultipleChoiceModalOpen={setMultipleChoiceModalOpen}
        fileUploadModalOpen={fileUploadModalOpen}
        setFileUploadModalOpen={setFileUploadModalOpen}
      />
    </>
  );
}
