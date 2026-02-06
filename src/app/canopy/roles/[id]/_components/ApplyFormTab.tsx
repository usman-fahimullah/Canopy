"use client";

import * as React from "react";
import { useParams } from "next/navigation";
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
import { Banner } from "@/components/ui/banner";
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
} from "@phosphor-icons/react";
import type { ApplyFormState } from "../_lib/use-role-form";
import type { FormQuestion, SortableQuestionItemProps } from "../_lib/types";
import { getQuestionIconWithBg } from "../_lib/helpers";
import { ApplyFormModals } from "./ApplyFormModals";

// ============================================
// TYPES
// ============================================

interface ApplyFormTabProps {
  roleId: string;
  applyFormState: ApplyFormState;
}

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
      className="flex items-center justify-between border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6 transition-colors hover:bg-[var(--primitive-neutral-100)]"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          type="button"
          className="-ml-2 cursor-grab p-1 text-[var(--primitive-neutral-400)] transition-colors hover:text-[var(--primitive-neutral-600)] active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <DotsSixVertical weight="bold" className="h-5 w-5" />
        </button>
        {getIconWithBg(question.type)}
        <span className="text-body-sm text-foreground">{question.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<PencilSimpleLine weight="regular" className="h-4 w-4" />}
          onClick={() => onEdit(question.id, question.type)}
        >
          Edit Question
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(question.id)}
          className="rounded-full"
        >
          <Trash weight="regular" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export function ApplyFormTab({ roleId, applyFormState }: ApplyFormTabProps) {
  const params = useParams();
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
  // SHAREABLE LINK
  // ============================================
  const [linkCopied, setLinkCopied] = React.useState(false);
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

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
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
      <div className="flex flex-col gap-4">
        {/* Apply Form Header Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
          {/* Title Section */}
          <div className="border-b border-[var(--primitive-neutral-200)] p-6">
            <h2 className="text-heading-sm text-foreground">Apply Form</h2>
          </div>

          {/* Info Banner */}
          <div className="mx-6 my-4">
            <Banner
              type="feature"
              subtle
              dismissible={false}
              title="Customize how you want candidates to apply."
              action={
                <div className="flex items-center gap-2">
                  <Button
                    variant="tertiary"
                    size="sm"
                    leftIcon={<Eye weight="regular" className="h-4 w-4" />}
                    onClick={() => window.open(`/apply/${params.id}?preview=true`, "_blank")}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      /* Feature: Save changes functionality — requires API endpoint implementation */
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              }
              className="rounded-xl"
            />
          </div>

          {/* Shareable Link Banner */}
          <div className="mx-6 my-4">
            <Banner
              type="success"
              subtle
              dismissible={false}
              title="Share this link with candidates"
              action={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)] px-3 py-2">
                    <LinkChain
                      weight="regular"
                      className="h-4 w-4 text-[var(--primitive-neutral-600)]"
                    />
                    <code className="font-mono text-caption text-foreground">
                      {applicationLink}
                    </code>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={
                      linkCopied ? (
                        <Check weight="bold" className="h-4 w-4" />
                      ) : (
                        <Copy weight="regular" className="h-4 w-4" />
                      )
                    }
                    onClick={copyLink}
                  >
                    {linkCopied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              }
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
          {/* Header */}
          <div className="border-b border-[var(--primitive-neutral-200)] p-6">
            <h2 className="text-body-strong text-foreground">Personal Info</h2>
          </div>

          {/* Personal Details Row */}
          <div className="flex items-center justify-between border-b border-[var(--primitive-neutral-200)] p-6 transition-colors hover:bg-[var(--primitive-neutral-100)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                <User weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-medium text-foreground">Personal Details</span>
                <span className="text-caption text-foreground-subtle">
                  Provide a detailed overview of the responsibilities and qualifications expected
                  from the job applicant.
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
              Edit Details
            </Button>
          </div>

          {/* Career Details Row */}
          <div className="flex items-center justify-between p-6 transition-colors hover:bg-[var(--primitive-neutral-100)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-green-100)]">
                <ChatCenteredText
                  weight="regular"
                  className="h-5 w-5 text-[var(--primitive-green-600)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-medium text-foreground">Career Details</span>
                <span className="text-caption text-foreground-subtle">
                  What are the key responsibilities that a candidate must fulfill to be considered
                  for this role?
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
              Edit Details
            </Button>
          </div>
        </div>

        {/* Questions Section Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
          {/* Header with Toggle */}
          <div className="flex items-center gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
            <Switch checked={questionsEnabled} onCheckedChange={setQuestionsEnabled} />
            <h2 className="text-body-strong text-foreground">Questions</h2>
          </div>

          {questionsEnabled && (
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
                      onDelete={handleDeleteQuestion}
                      getIconWithBg={getQuestionIconWithBg}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {/* Add Question Button with Dropdown */}
              <div className="p-4 px-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="tertiary"
                      size="lg"
                      leftIcon={<Plus weight="bold" className="h-5 w-5" />}
                    >
                      Add a question
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 p-2">
                    <div className="mb-1 px-3 py-2">
                      <span className="text-caption-strong text-foreground">
                        Choose Question Type
                      </span>
                    </div>
                    <DropdownMenuItem
                      onClick={() => handleAddQuestion("text")}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-blue-100)]">
                        <ListBullets
                          weight="regular"
                          className="h-4 w-4 text-[var(--primitive-blue-500)]"
                        />
                      </div>
                      <span className="text-body-sm">Text</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddQuestion("yes-no")}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-red-100)]">
                        <Circle
                          weight="regular"
                          className="h-4 w-4 text-[var(--primitive-red-500)]"
                        />
                      </div>
                      <span className="text-body-sm">Yes/No</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddQuestion("multiple-choice")}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-yellow-100)]">
                        <CheckSquare
                          weight="regular"
                          className="h-4 w-4 text-[var(--primitive-yellow-600)]"
                        />
                      </div>
                      <span className="text-body-sm">Multiple choice</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddQuestion("file-upload")}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-blue-100)]">
                        <Upload
                          weight="regular"
                          className="h-4 w-4 text-[var(--primitive-blue-500)]"
                        />
                      </div>
                      <span className="text-body-sm">File upload</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>

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
