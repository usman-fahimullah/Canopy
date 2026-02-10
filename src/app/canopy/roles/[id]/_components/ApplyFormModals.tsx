"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import {
  User,
  Briefcase,
  TextAlignLeft,
  Circle,
  CheckSquare,
  Upload,
  Check,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import type { PersonalDetailsConfig, CareerDetailsConfig, FormQuestion } from "../_lib/types";

// ============================================
// TYPES
// ============================================

interface ApplyFormModalsProps {
  // Personal Details modal
  personalDetailsModalOpen: boolean;
  setPersonalDetailsModalOpen: (open: boolean) => void;
  personalDetails: PersonalDetailsConfig;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetailsConfig>>;

  // Career Details modal
  careerDetailsModalOpen: boolean;
  setCareerDetailsModalOpen: (open: boolean) => void;
  careerDetails: CareerDetailsConfig;
  setCareerDetails: React.Dispatch<React.SetStateAction<CareerDetailsConfig>>;

  // Question modals — shared editing context
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;
  questions: FormQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<FormQuestion[]>>;

  // Text question modal
  textQuestionModalOpen: boolean;
  setTextQuestionModalOpen: (open: boolean) => void;

  // Yes/No modal
  yesNoQuestionModalOpen: boolean;
  setYesNoQuestionModalOpen: (open: boolean) => void;

  // Multiple choice modal
  multipleChoiceModalOpen: boolean;
  setMultipleChoiceModalOpen: (open: boolean) => void;

  // File upload modal
  fileUploadModalOpen: boolean;
  setFileUploadModalOpen: (open: boolean) => void;
}

// ============================================
// COMPONENT
// ============================================

export function ApplyFormModals({
  personalDetailsModalOpen,
  setPersonalDetailsModalOpen,
  personalDetails,
  setPersonalDetails,
  careerDetailsModalOpen,
  setCareerDetailsModalOpen,
  careerDetails,
  setCareerDetails,
  editingQuestionId,
  setEditingQuestionId,
  questions,
  setQuestions,
  textQuestionModalOpen,
  setTextQuestionModalOpen,
  yesNoQuestionModalOpen,
  setYesNoQuestionModalOpen,
  multipleChoiceModalOpen,
  setMultipleChoiceModalOpen,
  fileUploadModalOpen,
  setFileUploadModalOpen,
}: ApplyFormModalsProps) {
  // ============================================
  // LOCAL TEMP STATE — lives only while modal is open
  // ============================================

  const [tempPersonalDetails, setTempPersonalDetails] = React.useState(personalDetails);
  const [tempCareerDetails, setTempCareerDetails] = React.useState(careerDetails);

  const [tempTextQuestion, setTempTextQuestion] = React.useState({
    title: "",
    answerType: "long" as "long" | "short",
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  const [tempYesNoQuestion, setTempYesNoQuestion] = React.useState({
    title: "",
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  const [tempMultipleChoice, setTempMultipleChoice] = React.useState({
    title: "",
    options: ["Option 1", "Option 2", "Option 3"],
    allowMultiple: false,
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  const [tempFileUpload, setTempFileUpload] = React.useState({
    title: "",
    acceptedTypes: { pdf: true, doc: true, images: false },
    maxFileSize: 10,
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  // Sync temp state ONLY when the modal opens (not on every parent re-render).
  // Including the data objects in the dep array caused the effect to fire on
  // every parent render since the objects are recreated each time.
  const prevPersonalOpen = React.useRef(false);
  React.useEffect(() => {
    if (personalDetailsModalOpen && !prevPersonalOpen.current) {
      setTempPersonalDetails({ ...personalDetails });
    }
    prevPersonalOpen.current = personalDetailsModalOpen;
    // personalDetails intentionally excluded — we only snapshot on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalDetailsModalOpen]);

  const prevCareerOpen = React.useRef(false);
  React.useEffect(() => {
    if (careerDetailsModalOpen && !prevCareerOpen.current) {
      setTempCareerDetails({ ...careerDetails });
    }
    prevCareerOpen.current = careerDetailsModalOpen;
    // careerDetails intentionally excluded — we only snapshot on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerDetailsModalOpen]);

  // ============================================
  // PERSONAL DETAILS HANDLERS
  // ============================================

  const handleSavePersonalDetails = () => {
    setPersonalDetails(tempPersonalDetails);
    setPersonalDetailsModalOpen(false);
  };

  // ============================================
  // CAREER DETAILS HANDLERS
  // ============================================

  const handleSaveCareerDetails = () => {
    setCareerDetails(tempCareerDetails);
    setCareerDetailsModalOpen(false);
  };

  // ============================================
  // TEXT QUESTION HANDLERS
  // ============================================

  const handleSaveTextQuestion = () => {
    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? { ...q, title: tempTextQuestion.title, required: tempTextQuestion.requireAnswer }
            : q
        )
      );
    }
    setTextQuestionModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleDiscardTextQuestion = () => {
    setTextQuestionModalOpen(false);
    setEditingQuestionId(null);
  };

  // ============================================
  // YES/NO QUESTION HANDLERS
  // ============================================

  const handleSaveYesNoQuestion = () => {
    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? { ...q, title: tempYesNoQuestion.title, required: tempYesNoQuestion.requireAnswer }
            : q
        )
      );
    }
    setYesNoQuestionModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleDiscardYesNoQuestion = () => {
    setYesNoQuestionModalOpen(false);
    setEditingQuestionId(null);
  };

  // ============================================
  // MULTIPLE CHOICE HANDLERS
  // ============================================

  const handleSaveMultipleChoice = () => {
    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? {
                ...q,
                title: tempMultipleChoice.title,
                required: tempMultipleChoice.requireAnswer,
                options: tempMultipleChoice.options,
              }
            : q
        )
      );
    }
    setMultipleChoiceModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleDiscardMultipleChoice = () => {
    setMultipleChoiceModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleAddOption = () => {
    setTempMultipleChoice({
      ...tempMultipleChoice,
      options: [...tempMultipleChoice.options, `Option ${tempMultipleChoice.options.length + 1}`],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (tempMultipleChoice.options.length > 2) {
      setTempMultipleChoice({
        ...tempMultipleChoice,
        options: tempMultipleChoice.options.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    setTempMultipleChoice({
      ...tempMultipleChoice,
      options: tempMultipleChoice.options.map((opt, i) => (i === index ? value : opt)),
    });
  };

  // ============================================
  // FILE UPLOAD HANDLERS
  // ============================================

  const handleSaveFileUpload = () => {
    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? { ...q, title: tempFileUpload.title, required: tempFileUpload.requireAnswer }
            : q
        )
      );
    }
    setFileUploadModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleDiscardFileUpload = () => {
    setFileUploadModalOpen(false);
    setEditingQuestionId(null);
  };

  // ============================================
  // IMPERATIVE API — called by parent to init temp state
  // ============================================

  // Expose init helpers so ApplyFormTab can call them before opening
  // We use the useEffect approach above for Personal/Career, but for
  // question modals the parent needs to set temp state before opening.
  // We export these via a ref pattern or just let the parent call them.
  // For simplicity, we keep the open-handlers here as well.

  return (
    <>
      {/* ============================================
            PERSONAL DETAILS MODAL
            ============================================ */}
      <Modal open={personalDetailsModalOpen} onOpenChange={setPersonalDetailsModalOpen}>
        <ModalContent size="md">
          <ModalHeader
            icon={<User weight="regular" className="h-6 w-6 text-foreground" />}
            iconBg="bg-[var(--primitive-blue-200)]"
          >
            <ModalTitle>Personal Details</ModalTitle>
          </ModalHeader>

          <ModalBody className="items-stretch">
            <ModalDescription className="text-body text-foreground">
              Select what should be included or required in the apply form.
            </ModalDescription>

            <div className="w-full overflow-hidden rounded-2xl border border-[var(--border-default)]">
              {/* Table Header */}
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] bg-[var(--background-subtle)] p-4">
                <span className="flex-1 text-caption-strong font-medium text-[var(--foreground-subtle)]">
                  Field
                </span>
                <span className="flex-1 text-caption-strong font-medium text-[var(--foreground-subtle)]">
                  Require an answer
                </span>
              </div>

              {/* Name Row - Always required */}
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] p-4 opacity-50">
                <div className="flex flex-1 items-center gap-3">
                  <Switch checked={true} disabled />
                  <span className="text-body-sm text-[var(--foreground-default)]">Name</span>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <Checkbox checked={true} disabled />
                  <span className="text-caption text-[var(--foreground-brand)]">
                    Always required
                  </span>
                </div>
              </div>

              {/* Email Row - Always required */}
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] p-4 opacity-50">
                <div className="flex flex-1 items-center gap-3">
                  <Switch checked={true} disabled />
                  <span className="text-body-sm text-[var(--foreground-default)]">Email</span>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <Checkbox checked={true} disabled />
                  <span className="text-caption text-[var(--foreground-brand)]">
                    Always required
                  </span>
                </div>
              </div>

              {/* Date of Birth Row */}
              <FieldRow
                label="Date of birth"
                field={tempPersonalDetails.dateOfBirth}
                onChange={(updated) =>
                  setTempPersonalDetails({ ...tempPersonalDetails, dateOfBirth: updated })
                }
                hasBorder
              />

              {/* Pronouns Row */}
              <FieldRow
                label="Pronouns"
                field={tempPersonalDetails.pronouns}
                onChange={(updated) =>
                  setTempPersonalDetails({ ...tempPersonalDetails, pronouns: updated })
                }
                hasBorder
              />

              {/* Location Row */}
              <FieldRow
                label="Location"
                field={tempPersonalDetails.location}
                onChange={(updated) =>
                  setTempPersonalDetails({ ...tempPersonalDetails, location: updated })
                }
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setPersonalDetailsModalOpen(false)}
            >
              Discard
            </Button>
            <Button type="button" variant="primary" onClick={handleSavePersonalDetails}>
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ============================================
            CAREER DETAILS MODAL
            ============================================ */}
      <Modal open={careerDetailsModalOpen} onOpenChange={setCareerDetailsModalOpen}>
        <ModalContent size="md">
          <ModalHeader
            icon={<Briefcase weight="regular" className="h-6 w-6 text-foreground" />}
            iconBg="bg-[var(--primitive-green-200)]"
          >
            <ModalTitle>Career Details</ModalTitle>
          </ModalHeader>

          <ModalBody className="items-stretch">
            <ModalDescription className="text-body-sm text-[var(--foreground-muted)]">
              Select what should be included or required in the apply form.
            </ModalDescription>

            <div className="w-full overflow-hidden rounded-2xl border border-[var(--border-default)]">
              {/* Table Header Row */}
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] bg-[var(--background-subtle)] p-4">
                <div className="flex-1">
                  <span className="text-caption-strong font-medium text-[var(--foreground-subtle)]">
                    Field
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-caption-strong font-medium text-[var(--foreground-subtle)]">
                    Require
                  </span>
                </div>
              </div>

              <FieldRow
                label="Current Role"
                field={tempCareerDetails.currentRole}
                onChange={(updated) =>
                  setTempCareerDetails({ ...tempCareerDetails, currentRole: updated })
                }
                hasBorder
              />
              <FieldRow
                label="Current Company"
                field={tempCareerDetails.currentCompany}
                onChange={(updated) =>
                  setTempCareerDetails({ ...tempCareerDetails, currentCompany: updated })
                }
                hasBorder
              />
              <FieldRow
                label="Years of Experience"
                field={tempCareerDetails.yearsExperience}
                onChange={(updated) =>
                  setTempCareerDetails({ ...tempCareerDetails, yearsExperience: updated })
                }
                hasBorder
              />
              <FieldRow
                label="LinkedIn Profile"
                field={tempCareerDetails.linkedIn}
                onChange={(updated) =>
                  setTempCareerDetails({ ...tempCareerDetails, linkedIn: updated })
                }
                hasBorder
              />
              <FieldRow
                label="Portfolio URL"
                field={tempCareerDetails.portfolio}
                onChange={(updated) =>
                  setTempCareerDetails({ ...tempCareerDetails, portfolio: updated })
                }
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setCareerDetailsModalOpen(false)}
            >
              Discard
            </Button>
            <Button type="button" variant="primary" onClick={handleSaveCareerDetails}>
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ============================================
            TEXT QUESTION MODAL
            ============================================ */}
      <Modal open={textQuestionModalOpen} onOpenChange={setTextQuestionModalOpen}>
        <ModalContent size="md">
          <ModalHeader
            icon={
              <TextAlignLeft
                weight="regular"
                className="h-6 w-6 text-[var(--primitive-blue-700)]"
              />
            }
            iconBg="bg-[var(--primitive-blue-200)]"
          >
            <ModalTitle>Text</ModalTitle>
          </ModalHeader>

          <ModalBody className="items-stretch gap-6">
            {/* Question Title Field */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Question title
              </label>
              <Input
                value={tempTextQuestion.title}
                onChange={(e) =>
                  setTempTextQuestion({ ...tempTextQuestion, title: e.target.value })
                }
                placeholder="Write your question?"
                inputSize="lg"
              />
            </div>

            {/* Answer Type Selection */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Answer Type
              </label>
              <RadioGroup
                value={tempTextQuestion.answerType}
                onValueChange={(value) =>
                  setTempTextQuestion({
                    ...tempTextQuestion,
                    answerType: value as "long" | "short",
                  })
                }
                className="grid grid-cols-2 gap-3"
              >
                {/* Long Answer Option */}
                <label
                  htmlFor="long-answer"
                  className={`flex cursor-pointer flex-col items-center rounded-2xl border px-4 pb-2 pt-4 transition-colors ${
                    tempTextQuestion.answerType === "long"
                      ? "border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)]"
                      : "border-[var(--primitive-neutral-300)]"
                  }`}
                >
                  <div className="mb-2 flex h-[162px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--primitive-neutral-200)]">
                    <div
                      className={`flex h-[89px] w-[85%] items-start rounded-lg p-3 ${
                        tempTextQuestion.answerType === "long"
                          ? "border border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-100)]"
                          : "border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)]"
                      }`}
                    >
                      <span
                        className={`text-body ${
                          tempTextQuestion.answerType === "long"
                            ? "font-medium text-foreground-info"
                            : "text-foreground-subtle"
                        }`}
                      >
                        Write an answer
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <RadioGroupItem value="long" id="long-answer" />
                    <span className="text-caption text-foreground">Long Answer</span>
                  </div>
                </label>

                {/* Short Answer Option */}
                <label
                  htmlFor="short-answer"
                  className={`flex cursor-pointer flex-col items-center rounded-2xl border px-4 pb-2 pt-4 transition-colors ${
                    tempTextQuestion.answerType === "short"
                      ? "border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)]"
                      : "border-[var(--primitive-neutral-300)]"
                  }`}
                >
                  <div className="mb-2 flex h-[162px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--primitive-neutral-200)]">
                    <div
                      className={`w-[85%] rounded-lg p-4 ${
                        tempTextQuestion.answerType === "short"
                          ? "border border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-100)]"
                          : "border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)]"
                      }`}
                    >
                      <span
                        className={`text-body ${
                          tempTextQuestion.answerType === "short"
                            ? "font-medium text-foreground-info"
                            : "text-foreground-subtle"
                        }`}
                      >
                        Write an answer
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <RadioGroupItem value="short" id="short-answer" />
                    <span className="text-caption text-foreground">Short Answer</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Settings Section */}
            <SettingsSection
              hideFromApplyForm={tempTextQuestion.hideFromApplyForm}
              onHideChange={(checked) =>
                setTempTextQuestion({ ...tempTextQuestion, hideFromApplyForm: checked })
              }
              requireAnswer={tempTextQuestion.requireAnswer}
              onRequireChange={(checked) =>
                setTempTextQuestion({ ...tempTextQuestion, requireAnswer: checked })
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="tertiary" size="lg" onClick={handleDiscardTextQuestion}>
              Discard
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={handleSaveTextQuestion}>
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ============================================
            YES/NO QUESTION MODAL
            ============================================ */}
      <Modal open={yesNoQuestionModalOpen} onOpenChange={setYesNoQuestionModalOpen}>
        <ModalContent size="md">
          <ModalHeader
            icon={<Circle weight="regular" className="h-6 w-6 text-[var(--primitive-red-500)]" />}
            iconBg="bg-[var(--primitive-red-100)]"
          >
            <ModalTitle>Yes/No</ModalTitle>
          </ModalHeader>

          <ModalBody className="items-stretch gap-6">
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Question title
              </label>
              <Input
                value={tempYesNoQuestion.title}
                onChange={(e) =>
                  setTempYesNoQuestion({ ...tempYesNoQuestion, title: e.target.value })
                }
                placeholder="Write your yes/no question?"
                inputSize="lg"
              />
            </div>

            {/* Preview Section */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Answer Preview
              </label>
              <div className="rounded-2xl bg-[var(--background-subtle)] p-6">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--background-interactive-default)] px-6 py-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--border-brand-emphasis)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-[var(--border-brand-emphasis)]" />
                    </div>
                    <span className="text-body-sm text-[var(--foreground-default)]">Yes</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--background-interactive-default)] px-6 py-3">
                    <div className="h-5 w-5 rounded-full border-2 border-[var(--border-emphasis)]" />
                    <span className="text-body-sm text-[var(--foreground-default)]">No</span>
                  </div>
                </div>
              </div>
            </div>

            <SettingsSection
              hideFromApplyForm={tempYesNoQuestion.hideFromApplyForm}
              onHideChange={(checked) =>
                setTempYesNoQuestion({ ...tempYesNoQuestion, hideFromApplyForm: checked })
              }
              requireAnswer={tempYesNoQuestion.requireAnswer}
              onRequireChange={(checked) =>
                setTempYesNoQuestion({ ...tempYesNoQuestion, requireAnswer: checked })
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="tertiary" size="lg" onClick={handleDiscardYesNoQuestion}>
              Discard
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={handleSaveYesNoQuestion}>
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ============================================
            MULTIPLE CHOICE QUESTION MODAL
            ============================================ */}
      <Modal open={multipleChoiceModalOpen} onOpenChange={setMultipleChoiceModalOpen}>
        <ModalContent size="md">
          <ModalHeader
            icon={
              <CheckSquare
                weight="regular"
                className="h-6 w-6 text-[var(--primitive-yellow-600)]"
              />
            }
            iconBg="bg-[var(--primitive-yellow-100)]"
          >
            <ModalTitle>Multiple Choice</ModalTitle>
          </ModalHeader>

          <ModalBody className="items-stretch gap-6">
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Question title
              </label>
              <Input
                value={tempMultipleChoice.title}
                onChange={(e) =>
                  setTempMultipleChoice({ ...tempMultipleChoice, title: e.target.value })
                }
                placeholder="Write your question?"
                inputSize="lg"
              />
            </div>

            {/* Selection Type - Single vs Multiple */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Selection Type
              </label>
              <RadioGroup
                value={tempMultipleChoice.allowMultiple ? "multiple" : "single"}
                onValueChange={(value) =>
                  setTempMultipleChoice({
                    ...tempMultipleChoice,
                    allowMultiple: value === "multiple",
                  })
                }
                className="grid grid-cols-2 gap-3"
              >
                {/* Single Answer Option */}
                <label
                  htmlFor="single-answer"
                  className={`flex cursor-pointer flex-col items-center rounded-2xl border px-4 pb-2 pt-4 transition-colors ${
                    !tempMultipleChoice.allowMultiple
                      ? "border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)]"
                      : "border-[var(--primitive-neutral-300)]"
                  }`}
                >
                  <div className="mb-2 flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--primitive-neutral-200)] p-4">
                    <div className="flex w-full flex-col gap-2">
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                          !tempMultipleChoice.allowMultiple
                            ? "border border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-100)]"
                            : "border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)]"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            !tempMultipleChoice.allowMultiple
                              ? "border-[var(--primitive-blue-500)]"
                              : "border-[var(--primitive-neutral-400)]"
                          }`}
                        >
                          {!tempMultipleChoice.allowMultiple && (
                            <div className="h-2 w-2 rounded-full bg-[var(--primitive-blue-500)]" />
                          )}
                        </div>
                        <span className="text-caption">Option A</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)] px-3 py-2">
                        <div className="h-4 w-4 rounded-full border-2 border-[var(--primitive-neutral-400)]" />
                        <span className="text-caption text-foreground-subtle">Option B</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <RadioGroupItem value="single" id="single-answer" />
                    <span className="text-caption text-foreground">Single Answer</span>
                  </div>
                </label>

                {/* Multiple Answers Option */}
                <label
                  htmlFor="multiple-answers"
                  className={`flex cursor-pointer flex-col items-center rounded-2xl border px-4 pb-2 pt-4 transition-colors ${
                    tempMultipleChoice.allowMultiple
                      ? "border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)]"
                      : "border-[var(--primitive-neutral-300)]"
                  }`}
                >
                  <div className="mb-2 flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--primitive-neutral-200)] p-4">
                    <div className="flex w-full flex-col gap-2">
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                          tempMultipleChoice.allowMultiple
                            ? "border border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-100)]"
                            : "border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)]"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-md border-2 ${
                            tempMultipleChoice.allowMultiple
                              ? "border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-500)]"
                              : "border-[var(--primitive-neutral-400)]"
                          }`}
                        >
                          {tempMultipleChoice.allowMultiple && (
                            <Check weight="bold" className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-caption">Option A</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                          tempMultipleChoice.allowMultiple
                            ? "border border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-100)]"
                            : "border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)]"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-md border-2 ${
                            tempMultipleChoice.allowMultiple
                              ? "border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-500)]"
                              : "border-[var(--primitive-neutral-400)]"
                          }`}
                        >
                          {tempMultipleChoice.allowMultiple && (
                            <Check weight="bold" className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-caption">Option B</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <RadioGroupItem value="multiple" id="multiple-answers" />
                    <span className="text-caption text-foreground">Multiple Answers</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Options Section */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Answer Options
              </label>
              <div className="flex flex-col gap-2">
                {tempMultipleChoice.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3">
                      {tempMultipleChoice.allowMultiple ? (
                        <div className="h-5 w-5 rounded-md border-2 border-[var(--border-emphasis)]" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-[var(--border-emphasis)]" />
                      )}
                      <Input
                        value={option}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 border-0 bg-transparent p-0 text-body-sm focus-visible:ring-0"
                      />
                    </div>
                    {tempMultipleChoice.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        className="shrink-0 text-[var(--primitive-red-500)] hover:bg-[var(--primitive-red-100)]"
                      >
                        <Trash weight="regular" className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="tertiary"
                onClick={handleAddOption}
                leftIcon={<Plus weight="bold" className="h-4 w-4" />}
                className="self-start"
              >
                Add option
              </Button>
            </div>

            <SettingsSection
              hideFromApplyForm={tempMultipleChoice.hideFromApplyForm}
              onHideChange={(checked) =>
                setTempMultipleChoice({ ...tempMultipleChoice, hideFromApplyForm: checked })
              }
              requireAnswer={tempMultipleChoice.requireAnswer}
              onRequireChange={(checked) =>
                setTempMultipleChoice({ ...tempMultipleChoice, requireAnswer: checked })
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="tertiary"
              size="lg"
              onClick={handleDiscardMultipleChoice}
            >
              Discard
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={handleSaveMultipleChoice}>
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ============================================
            FILE UPLOAD QUESTION MODAL
            ============================================ */}
      <Modal open={fileUploadModalOpen} onOpenChange={setFileUploadModalOpen}>
        <ModalContent size="md">
          <ModalHeader
            icon={<Upload weight="regular" className="h-6 w-6 text-[var(--primitive-blue-700)]" />}
            iconBg="bg-[var(--primitive-blue-200)]"
          >
            <ModalTitle>File Upload</ModalTitle>
          </ModalHeader>

          <ModalBody className="items-stretch gap-6">
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Question title
              </label>
              <Input
                value={tempFileUpload.title}
                onChange={(e) => setTempFileUpload({ ...tempFileUpload, title: e.target.value })}
                placeholder="e.g., Upload your resume"
                inputSize="lg"
              />
            </div>

            {/* Accepted File Types */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Accepted file types
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]">
                  <Checkbox
                    checked={tempFileUpload.acceptedTypes.pdf}
                    onCheckedChange={(checked) =>
                      setTempFileUpload({
                        ...tempFileUpload,
                        acceptedTypes: {
                          ...tempFileUpload.acceptedTypes,
                          pdf: checked === true,
                        },
                      })
                    }
                  />
                  <span className="text-body-sm">PDF</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]">
                  <Checkbox
                    checked={tempFileUpload.acceptedTypes.doc}
                    onCheckedChange={(checked) =>
                      setTempFileUpload({
                        ...tempFileUpload,
                        acceptedTypes: {
                          ...tempFileUpload.acceptedTypes,
                          doc: checked === true,
                        },
                      })
                    }
                  />
                  <span className="text-body-sm">DOC/DOCX</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]">
                  <Checkbox
                    checked={tempFileUpload.acceptedTypes.images}
                    onCheckedChange={(checked) =>
                      setTempFileUpload({
                        ...tempFileUpload,
                        acceptedTypes: {
                          ...tempFileUpload.acceptedTypes,
                          images: checked === true,
                        },
                      })
                    }
                  />
                  <span className="text-body-sm">Images (PNG, JPG)</span>
                </label>
              </div>
            </div>

            {/* Upload Preview */}
            <div className="flex w-full flex-col gap-3">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Upload Preview
              </label>
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--border-emphasis)] bg-[var(--background-subtle)] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                  <Upload weight="regular" className="h-6 w-6 text-[var(--foreground-brand)]" />
                </div>
                <div className="text-center">
                  <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                    Drop files here or click to upload
                  </p>
                  <p className="text-caption text-[var(--foreground-subtle)]">
                    Max file size: {tempFileUpload.maxFileSize}MB
                  </p>
                </div>
              </div>
            </div>

            <SettingsSection
              hideFromApplyForm={tempFileUpload.hideFromApplyForm}
              onHideChange={(checked) =>
                setTempFileUpload({ ...tempFileUpload, hideFromApplyForm: checked })
              }
              requireAnswer={tempFileUpload.requireAnswer}
              onRequireChange={(checked) =>
                setTempFileUpload({ ...tempFileUpload, requireAnswer: checked })
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="tertiary" size="lg" onClick={handleDiscardFileUpload}>
              Discard
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={handleSaveFileUpload}>
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// ============================================
// SHARED SUB-COMPONENTS (internal to this file)
// ============================================

/** Reusable row for Personal Details / Career Details field toggle tables */
function FieldRow({
  label,
  field,
  onChange,
  hasBorder = false,
}: {
  label: string;
  field: { visible: boolean; required: boolean };
  onChange: (updated: { visible: boolean; required: boolean }) => void;
  hasBorder?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 p-4 ${hasBorder ? "border-b border-[var(--border-default)]" : ""}`}
    >
      <div className="flex flex-1 items-center gap-3">
        <Switch
          checked={field.visible}
          onCheckedChange={(checked) => onChange({ ...field, visible: checked })}
        />
        <span className="text-body-sm text-[var(--foreground-default)]">{label}</span>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Checkbox
          checked={field.required}
          disabled={!field.visible}
          onCheckedChange={(checked) => onChange({ ...field, required: checked === true })}
        />
        {field.required && (
          <span className="text-caption text-[var(--foreground-brand)]">Required</span>
        )}
      </div>
    </div>
  );
}

/** Reusable settings section for question modals */
function SettingsSection({
  hideFromApplyForm,
  onHideChange,
  requireAnswer,
  onRequireChange,
}: {
  hideFromApplyForm: boolean;
  onHideChange: (checked: boolean) => void;
  requireAnswer: boolean;
  onRequireChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
        Settings
      </label>
      <div className="overflow-hidden rounded-2xl border border-[var(--border-default)]">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
          <span className="text-body-sm text-[var(--foreground-default)]">
            Hide from apply form
          </span>
          <Switch checked={hideFromApplyForm} onCheckedChange={onHideChange} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-body-sm text-[var(--foreground-default)]">Require an answer</span>
          <Switch checked={requireAnswer} onCheckedChange={onRequireChange} />
        </div>
      </div>
    </div>
  );
}
