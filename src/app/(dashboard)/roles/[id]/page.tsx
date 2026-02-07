"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch, SwitchWithLabel } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { RichTextEditor, RichTextToolbar } from "@/components/ui/rich-text-editor";
import { RichTextCharacterCounter } from "@/components/ui/character-counter";
import { BenefitsSelector, defaultBenefitCategories } from "@/components/ui/benefits-selector";
import { RoleTemplateCard } from "@/components/ui/role-template-card";
import { Banner } from "@/components/ui/banner";
import {
  FormCard,
  FormSection,
  FormField,
  FormTitleInput,
  FormRow,
} from "@/components/ui/form-section";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Drag and Drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Icons
import {
  CircleDashed,
  PencilSimpleLine,
  ListChecks,
  User,
  Nut,
  GridFour,
  Buildings,
  Link as LinkIcon,
  CalendarBlank,
  File,
  Folder,
  SlidersHorizontal,
  Info,
  Briefcase,
  Plus,
  Trash,
  TextAa,
  CheckSquare,
  ListBullets,
  Upload,
  X,
  Eye,
  CaretDown,
  Circle,
  Check,
  ChatCenteredText,
  TextAlignLeft,
  DotsSixVertical,
  Copy,
  Link as LinkChain,
} from "@phosphor-icons/react";

/**
 * Job Post / Role Edit Page
 * Uses design system components for consistent styling
 */

// Data
const jobCategories = [
  { value: "renewable-energy", label: "Renewable Energy" },
  { value: "sustainability", label: "Sustainability" },
  { value: "climate-tech", label: "Climate Tech" },
  { value: "conservation", label: "Conservation" },
  { value: "clean-transportation", label: "Clean Transportation" },
  { value: "circular-economy", label: "Circular Economy" },
  { value: "green-building", label: "Green Building" },
  { value: "environmental-policy", label: "Environmental Policy" },
  { value: "other", label: "Other" },
];

const positionTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead / Principal" },
  { value: "executive", label: "Executive" },
];

const educationLevels = [
  { value: "none", label: "No Requirement" },
  { value: "high-school", label: "High School Diploma" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (PhD)" },
];

const payTypes = [
  { value: "salary", label: "Salary" },
  { value: "hourly", label: "Hourly" },
  { value: "commission", label: "Commission" },
];

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "au", label: "Australia" },
  { value: "remote", label: "Remote (Worldwide)" },
];

const usStates = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "wa", label: "Washington" },
  { value: "co", label: "Colorado" },
  { value: "ma", label: "Massachusetts" },
];

// Sortable Question Item Component for drag-and-drop
interface SortableQuestionItemProps {
  question: {
    id: string;
    type: "text" | "yes-no" | "multiple-choice" | "file-upload";
    title: string;
    required: boolean;
    options?: string[];
  };
  onEdit: (id: string, type: string) => void;
  onDelete: (id: string) => void;
  getIconWithBg: (type: string) => React.ReactNode;
}

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
      className="flex items-center justify-between border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6 transition-colors hover:bg-[var(--background-interactive-hover)]"
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

export default function RoleEditPage() {
  const params = useParams();

  // Form state
  const [roleTitle, setRoleTitle] = React.useState("");
  const [jobCategory, setJobCategory] = React.useState("");
  const [positionType, setPositionType] = React.useState("");
  const [experienceLevel, setExperienceLevel] = React.useState("");

  // Rich text content
  const [description, setDescription] = React.useState("");
  const [responsibilities, setResponsibilities] = React.useState("");
  const [requiredQuals, setRequiredQuals] = React.useState("");
  const [desiredQuals, setDesiredQuals] = React.useState("");

  // Education
  const [educationLevel, setEducationLevel] = React.useState("");
  const [educationDetails, setEducationDetails] = React.useState("");

  // Workplace
  const [workplaceType, setWorkplaceType] = React.useState("onsite");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");

  // Compensation
  const [payType, setPayType] = React.useState("salary");
  const [minPay, setMinPay] = React.useState("");
  const [maxPay, setMaxPay] = React.useState("");
  const [payFrequency, setPayFrequency] = React.useState("weekly");
  const [useCompanyBenefits, setUseCompanyBenefits] = React.useState(true);
  const [selectedBenefits, setSelectedBenefits] = React.useState<string[]>([]);
  const [compensationDetails, setCompensationDetails] = React.useState("");

  // Role settings
  const [showRecruiter, setShowRecruiter] = React.useState(false);
  const [closingDate, setClosingDate] = React.useState<Date | undefined>();
  const [externalLink, setExternalLink] = React.useState("");
  const [requireResume, setRequireResume] = React.useState(true);
  const [requireCoverLetter, setRequireCoverLetter] = React.useState(true);
  const [requirePortfolio, setRequirePortfolio] = React.useState(false);

  // Template
  const [templateSaved, setTemplateSaved] = React.useState(false);
  const [savingTemplate, setSavingTemplate] = React.useState(false);

  // Active tab
  const [activeTab, setActiveTab] = React.useState("job-post");

  // Shareable link
  const [linkCopied, setLinkCopied] = React.useState(false);
  const applicationLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/apply/${params.id}`
      : `/apply/${params.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(applicationLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // ============================================
  // APPLY FORM STATE
  // ============================================

  // Personal Details config
  const [personalDetails, setPersonalDetails] = React.useState({
    name: { visible: true, required: true }, // Always required
    email: { visible: true, required: true }, // Always required
    dateOfBirth: { visible: true, required: false },
    pronouns: { visible: true, required: false },
    location: { visible: true, required: false },
  });

  // Career Details config
  const [careerDetails, setCareerDetails] = React.useState({
    currentRole: { visible: true, required: false },
    currentCompany: { visible: true, required: false },
    yearsExperience: { visible: true, required: false },
    linkedIn: { visible: true, required: false },
    portfolio: { visible: true, required: false },
  });

  // Questions section
  const [questionsEnabled, setQuestionsEnabled] = React.useState(true);
  const [questions, setQuestions] = React.useState<
    {
      id: string;
      type: "text" | "yes-no" | "multiple-choice" | "file-upload";
      title: string;
      required: boolean;
      options?: string[];
    }[]
  >([
    { id: "q1", type: "text", title: "Why are you interested in this role?", required: true },
    {
      id: "q2",
      type: "yes-no",
      title: "Do you have experience with renewable energy projects?",
      required: false,
    },
    {
      id: "q3",
      type: "multiple-choice",
      title: "What is your preferred work style?",
      required: false,
      options: ["Remote", "Hybrid", "On-site"],
    },
  ]);

  // Modal state
  const [personalDetailsModalOpen, setPersonalDetailsModalOpen] = React.useState(false);
  const [careerDetailsModalOpen, setCareerDetailsModalOpen] = React.useState(false);
  const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null);
  const [textQuestionModalOpen, setTextQuestionModalOpen] = React.useState(false);
  const [yesNoQuestionModalOpen, setYesNoQuestionModalOpen] = React.useState(false);
  const [multipleChoiceModalOpen, setMultipleChoiceModalOpen] = React.useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = React.useState(false);

  // Temporary state for modal edits
  const [tempPersonalDetails, setTempPersonalDetails] = React.useState(personalDetails);
  const [tempCareerDetails, setTempCareerDetails] = React.useState(careerDetails);

  // Text question modal state
  const [tempTextQuestion, setTempTextQuestion] = React.useState({
    title: "",
    answerType: "long" as "long" | "short",
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  // Yes/No question modal state
  const [tempYesNoQuestion, setTempYesNoQuestion] = React.useState({
    title: "",
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  // Multiple choice question modal state
  const [tempMultipleChoice, setTempMultipleChoice] = React.useState({
    title: "",
    options: ["Option 1", "Option 2", "Option 3"],
    allowMultiple: false,
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  // File upload question modal state
  const [tempFileUpload, setTempFileUpload] = React.useState({
    title: "",
    acceptedTypes: { pdf: true, doc: true, images: false },
    maxFileSize: 10, // MB
    hideFromApplyForm: false,
    requireAnswer: false,
  });

  // Helper functions for Apply Form
  const handleAddQuestion = (type: "text" | "yes-no" | "multiple-choice" | "file-upload") => {
    const newQuestion = {
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
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end to reorder questions
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

  // Handle edit question callback for SortableQuestionItem
  const handleEditQuestion = (id: string, type: string) => {
    if (type === "text") {
      handleOpenTextQuestionModal(id);
    } else if (type === "yes-no") {
      handleOpenYesNoQuestionModal(id);
    } else if (type === "multiple-choice") {
      handleOpenMultipleChoiceModal(id);
    } else if (type === "file-upload") {
      handleOpenFileUploadModal(id);
    }
  };

  const handleOpenPersonalDetailsModal = () => {
    setTempPersonalDetails({ ...personalDetails });
    setPersonalDetailsModalOpen(true);
  };

  const handleSavePersonalDetails = () => {
    setPersonalDetails(tempPersonalDetails);
    setPersonalDetailsModalOpen(false);
  };

  const handleOpenCareerDetailsModal = () => {
    setTempCareerDetails({ ...careerDetails });
    setCareerDetailsModalOpen(true);
  };

  const handleSaveCareerDetails = () => {
    setCareerDetails(tempCareerDetails);
    setCareerDetailsModalOpen(false);
  };

  // Text question modal handlers
  const handleOpenTextQuestionModal = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.type === "text") {
      setEditingQuestionId(questionId);
      setTempTextQuestion({
        title: question.title,
        answerType: "long", // Default to long answer
        hideFromApplyForm: false,
        requireAnswer: question.required,
      });
      setTextQuestionModalOpen(true);
    }
  };

  const handleSaveTextQuestion = () => {
    if (editingQuestionId) {
      setQuestions(
        questions.map((q) =>
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

  // Yes/No question modal handlers
  const handleOpenYesNoQuestionModal = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.type === "yes-no") {
      setEditingQuestionId(questionId);
      setTempYesNoQuestion({
        title: question.title,
        hideFromApplyForm: false,
        requireAnswer: question.required,
      });
      setYesNoQuestionModalOpen(true);
    }
  };

  const handleSaveYesNoQuestion = () => {
    if (editingQuestionId) {
      setQuestions(
        questions.map((q) =>
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

  // Multiple choice question modal handlers
  const handleOpenMultipleChoiceModal = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.type === "multiple-choice") {
      setEditingQuestionId(questionId);
      setTempMultipleChoice({
        title: question.title,
        options: question.options || ["Option 1", "Option 2", "Option 3"],
        allowMultiple: false,
        hideFromApplyForm: false,
        requireAnswer: question.required,
      });
      setMultipleChoiceModalOpen(true);
    }
  };

  const handleSaveMultipleChoice = () => {
    if (editingQuestionId) {
      setQuestions(
        questions.map((q) =>
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

  // File upload question modal handlers
  const handleOpenFileUploadModal = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.type === "file-upload") {
      setEditingQuestionId(questionId);
      setTempFileUpload({
        title: question.title,
        acceptedTypes: { pdf: true, doc: true, images: false },
        maxFileSize: 10,
        hideFromApplyForm: false,
        requireAnswer: question.required,
      });
      setFileUploadModalOpen(true);
    }
  };

  const handleSaveFileUpload = () => {
    if (editingQuestionId) {
      setQuestions(
        questions.map((q) =>
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

  // Get question icon with colored background matching Figma design
  const getQuestionIconWithBg = (type: string) => {
    switch (type) {
      case "text":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
            <ListBullets weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
          </div>
        );
      case "yes-no":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-red-100)]">
            <Circle weight="regular" className="h-5 w-5 text-[var(--primitive-red-500)]" />
          </div>
        );
      case "multiple-choice":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-yellow-100)]">
            <CheckSquare weight="regular" className="h-5 w-5 text-[var(--primitive-yellow-600)]" />
          </div>
        );
      case "file-upload":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
            <Upload weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
            <ListBullets weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
          </div>
        );
    }
  };

  const handleSaveTemplate = async () => {
    setSavingTemplate(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTemplateSaved(true);
    setSavingTemplate(false);
  };

  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)]">
      {/* Top Navigation Bar */}
      <header className="border-b border-[var(--primitive-neutral-100)] bg-[var(--background-default)]">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex h-full items-center px-12 py-4">
            <Link href="/" className="flex items-center py-[15px]">
              <div className="flex items-center gap-1">
                <span className="text-body font-medium text-foreground">Green Jobs Board</span>
                <span className="text-[var(--primitive-green-900)]">*</span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Tabs */}
          <div className="flex flex-1 items-center justify-center gap-3 px-1 py-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 rounded-2xl px-4 py-3 text-caption text-foreground transition-colors hover:bg-[var(--background-interactive-hover)]"
            >
              <GridFour weight="regular" className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-1 rounded-2xl bg-[var(--primitive-blue-100)] px-4 py-3 text-caption text-foreground"
            >
              <Nut weight="regular" className="h-4 w-4" />
              <span>Manage Roles</span>
            </Link>
            <Link
              href="/organization"
              className="flex items-center gap-1 rounded-2xl px-4 py-3 text-caption text-foreground transition-colors hover:bg-[var(--background-interactive-hover)]"
            >
              <Buildings weight="regular" className="h-4 w-4" />
              <span>Organization</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1 rounded-xl px-4 py-2 text-caption text-foreground transition-colors hover:bg-[var(--background-interactive-hover)]"
            >
              <div className="h-6 w-6 overflow-hidden rounded-2xl border border-[var(--primitive-neutral-200)]">
                <Avatar name="Soobin Han" size="xs" />
              </div>
              <span>Profile</span>
            </Link>
          </div>

          {/* Right: Organization selector */}
          <div className="flex h-full items-center px-8 py-4">
            <div className="flex items-center gap-2 rounded-2xl p-2">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[var(--primitive-neutral-200)] bg-[var(--primitive-blue-600)]">
                <span className="text-caption-sm font-bold text-white">SA</span>
              </div>
              <span className="text-caption text-foreground">Seattle Aquarium</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content with left border and rounded corners */}
      <div className="rounded-bl-3xl rounded-tl-3xl border-l border-[var(--primitive-neutral-200)]">
        {/* Page Header */}
        <div className="border-b border-[var(--primitive-neutral-200)] bg-[var(--background-default)] px-12 py-6">
          <div className="relative flex items-center justify-between">
            {/* Left: Icon + Title + Badge - with truncation */}
            <div className="flex min-w-0 max-w-[280px] items-center gap-3">
              <CircleDashed
                weight="regular"
                className="h-5 w-5 shrink-0 text-[var(--primitive-neutral-400)]"
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <h1 className="truncate text-heading-sm text-foreground">
                  {roleTitle || "Untitled Role"}
                </h1>
                <Badge variant="feature" size="sm" className="w-fit">
                  Draft
                </Badge>
              </div>
            </div>

            {/* Center: Segmented Controller - absolutely centered */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <SegmentedController
                options={[
                  {
                    value: "job-post",
                    label: "Job Post",
                    icon: <PencilSimpleLine weight="regular" />,
                  },
                  {
                    value: "apply-form",
                    label: "Apply Form",
                    icon: <ListChecks weight="regular" />,
                  },
                  { value: "candidates", label: "Candidates", icon: <User weight="regular" /> },
                ]}
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-[420px]"
              />
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<CaretDown weight="bold" className="h-4 w-4" />}
              >
                Review Role
              </Button>
              <Button variant="tertiary" size="icon" className="h-12 w-12 rounded-full">
                <Nut weight="regular" className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="bg-[var(--primitive-neutral-100)] px-12 py-6">
          {/* ============================================
              APPLY FORM TAB
              ============================================ */}
          {activeTab === "apply-form" && (
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
                <div className="flex items-center justify-between border-b border-[var(--primitive-neutral-200)] p-6 transition-colors hover:bg-[var(--background-interactive-hover)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                      <User weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-sm font-medium text-foreground">
                        Personal Details
                      </span>
                      <span className="text-caption text-foreground-subtle">
                        Provide a detailed overview of the responsibilities and qualifications
                        expected from the job applicant.
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
                <div className="flex items-center justify-between p-6 transition-colors hover:bg-[var(--background-interactive-hover)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-green-100)]">
                      <ChatCenteredText
                        weight="regular"
                        className="h-5 w-5 text-[var(--primitive-green-600)]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-sm font-medium text-foreground">
                        Career Details
                      </span>
                      <span className="text-caption text-foreground-subtle">
                        What are the key responsibilities that a candidate must fulfill to be
                        considered for this role?
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
          )}

          {/* ============================================
              PERSONAL DETAILS MODAL - Figma Design 523:6134
              ============================================ */}
          <Modal open={personalDetailsModalOpen} onOpenChange={setPersonalDetailsModalOpen}>
            <ModalContent size="md">
              <ModalHeader
                icon={<User weight="regular" className="h-6 w-6 text-foreground" />}
                iconBg="bg-[var(--primitive-blue-200)]"
              >
                <ModalTitle>Personal Details</ModalTitle>
              </ModalHeader>

              <ModalBody>
                <ModalDescription className="text-body text-foreground">
                  Select what should be included or required in the apply form.
                </ModalDescription>

                {/* Table - Figma: border rounded-16 */}
                <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)]">
                  {/* Table Header - Figma: bg neutral-200, p-16 */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-200)] p-4">
                    <span className="flex-1 text-body text-foreground">Field</span>
                    <span className="flex-1 text-body text-foreground">Require an answer</span>
                  </div>

                  {/* Name Row - Always required, opacity 50% */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4 opacity-50">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch checked={true} disabled />
                      <span className="text-body text-foreground">Name</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox checked={true} disabled />
                      <span className="text-caption text-foreground-brand">Always required</span>
                    </div>
                  </div>

                  {/* Email Row - Always required, opacity 50% */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4 opacity-50">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch checked={true} disabled />
                      <span className="text-body text-foreground">Email</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox checked={true} disabled />
                      <span className="text-caption text-foreground-brand">Always required</span>
                    </div>
                  </div>

                  {/* Date of Birth Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempPersonalDetails.dateOfBirth.visible}
                        onCheckedChange={(checked) =>
                          setTempPersonalDetails({
                            ...tempPersonalDetails,
                            dateOfBirth: { ...tempPersonalDetails.dateOfBirth, visible: checked },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Date of birth</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempPersonalDetails.dateOfBirth.required}
                        disabled={!tempPersonalDetails.dateOfBirth.visible}
                        onCheckedChange={(checked) =>
                          setTempPersonalDetails({
                            ...tempPersonalDetails,
                            dateOfBirth: {
                              ...tempPersonalDetails.dateOfBirth,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempPersonalDetails.dateOfBirth.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>

                  {/* Pronouns Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempPersonalDetails.pronouns.visible}
                        onCheckedChange={(checked) =>
                          setTempPersonalDetails({
                            ...tempPersonalDetails,
                            pronouns: { ...tempPersonalDetails.pronouns, visible: checked },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Pronouns</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempPersonalDetails.pronouns.required}
                        disabled={!tempPersonalDetails.pronouns.visible}
                        onCheckedChange={(checked) =>
                          setTempPersonalDetails({
                            ...tempPersonalDetails,
                            pronouns: {
                              ...tempPersonalDetails.pronouns,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempPersonalDetails.pronouns.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>

                  {/* Location Row - Last row, no bottom border */}
                  <div className="flex items-center gap-2 p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempPersonalDetails.location.visible}
                        onCheckedChange={(checked) =>
                          setTempPersonalDetails({
                            ...tempPersonalDetails,
                            location: { ...tempPersonalDetails.location, visible: checked },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Location</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempPersonalDetails.location.required}
                        disabled={!tempPersonalDetails.location.visible}
                        onCheckedChange={(checked) =>
                          setTempPersonalDetails({
                            ...tempPersonalDetails,
                            location: {
                              ...tempPersonalDetails.location,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempPersonalDetails.location.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>
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

              <ModalBody>
                <ModalDescription className="text-body-sm text-foreground-muted">
                  Select what should be included or required in the apply form.
                </ModalDescription>

                {/* Table Container */}
                <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)]">
                  {/* Table Header Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)] p-4">
                    <div className="flex-1">
                      <span className="text-caption font-medium text-foreground-subtle">Field</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-caption font-medium text-foreground-subtle">
                        Require
                      </span>
                    </div>
                  </div>

                  {/* Current Role Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempCareerDetails.currentRole.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            currentRole: { ...tempCareerDetails.currentRole, visible: checked },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Current Role</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempCareerDetails.currentRole.required}
                        disabled={!tempCareerDetails.currentRole.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            currentRole: {
                              ...tempCareerDetails.currentRole,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempCareerDetails.currentRole.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>

                  {/* Current Company Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempCareerDetails.currentCompany.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            currentCompany: {
                              ...tempCareerDetails.currentCompany,
                              visible: checked,
                            },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Current Company</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempCareerDetails.currentCompany.required}
                        disabled={!tempCareerDetails.currentCompany.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            currentCompany: {
                              ...tempCareerDetails.currentCompany,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempCareerDetails.currentCompany.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>

                  {/* Years of Experience Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempCareerDetails.yearsExperience.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            yearsExperience: {
                              ...tempCareerDetails.yearsExperience,
                              visible: checked,
                            },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Years of Experience</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempCareerDetails.yearsExperience.required}
                        disabled={!tempCareerDetails.yearsExperience.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            yearsExperience: {
                              ...tempCareerDetails.yearsExperience,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempCareerDetails.yearsExperience.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn Row */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-300)] p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempCareerDetails.linkedIn.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            linkedIn: { ...tempCareerDetails.linkedIn, visible: checked },
                          })
                        }
                      />
                      <span className="text-body text-foreground">LinkedIn Profile</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempCareerDetails.linkedIn.required}
                        disabled={!tempCareerDetails.linkedIn.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            linkedIn: { ...tempCareerDetails.linkedIn, required: checked === true },
                          })
                        }
                      />
                      {tempCareerDetails.linkedIn.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>

                  {/* Portfolio Row - Last row, no bottom border */}
                  <div className="flex items-center gap-2 p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Switch
                        checked={tempCareerDetails.portfolio.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            portfolio: { ...tempCareerDetails.portfolio, visible: checked },
                          })
                        }
                      />
                      <span className="text-body text-foreground">Portfolio URL</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Checkbox
                        checked={tempCareerDetails.portfolio.required}
                        disabled={!tempCareerDetails.portfolio.visible}
                        onCheckedChange={(checked) =>
                          setTempCareerDetails({
                            ...tempCareerDetails,
                            portfolio: {
                              ...tempCareerDetails.portfolio,
                              required: checked === true,
                            },
                          })
                        }
                      />
                      {tempCareerDetails.portfolio.required && (
                        <span className="text-caption text-foreground-brand">Required</span>
                      )}
                    </div>
                  </div>
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

              <ModalBody className="gap-6">
                {/* Question Title Field */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Question title</label>
                  <Input
                    value={tempTextQuestion.title}
                    onChange={(e) =>
                      setTempTextQuestion({ ...tempTextQuestion, title: e.target.value })
                    }
                    placeholder="Write your question?"
                    className="border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-4 text-body"
                  />
                </div>

                {/* Answer Type Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Answer Type</label>
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
                      {/* Preview Box */}
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
                      {/* Radio Button with Label */}
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
                      {/* Preview Box */}
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
                      {/* Radio Button with Label */}
                      <div className="flex w-full items-center gap-1">
                        <RadioGroupItem value="short" id="short-answer" />
                        <span className="text-caption text-foreground">Short Answer</span>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {/* Settings Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Settings</label>
                  <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)]">
                    {/* Hide from apply form */}
                    <div className="flex items-center justify-between border-b border-[var(--primitive-neutral-300)] px-4 py-3">
                      <span className="text-body text-foreground">Hide from apply form</span>
                      <Switch
                        checked={tempTextQuestion.hideFromApplyForm}
                        onCheckedChange={(checked) =>
                          setTempTextQuestion({ ...tempTextQuestion, hideFromApplyForm: checked })
                        }
                      />
                    </div>
                    {/* Require an answer */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-body text-foreground">Require an answer</span>
                      <Switch
                        checked={tempTextQuestion.requireAnswer}
                        onCheckedChange={(checked) =>
                          setTempTextQuestion({ ...tempTextQuestion, requireAnswer: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="button"
                  variant="tertiary"
                  size="lg"
                  onClick={handleDiscardTextQuestion}
                >
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
                icon={
                  <Circle weight="regular" className="h-6 w-6 text-[var(--primitive-red-500)]" />
                }
                iconBg="bg-[var(--primitive-red-100)]"
              >
                <ModalTitle>Yes/No</ModalTitle>
              </ModalHeader>

              <ModalBody className="gap-6">
                {/* Question Title Field */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Question title</label>
                  <Input
                    value={tempYesNoQuestion.title}
                    onChange={(e) =>
                      setTempYesNoQuestion({ ...tempYesNoQuestion, title: e.target.value })
                    }
                    placeholder="Write your yes/no question?"
                    className="border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-4 text-body"
                  />
                </div>

                {/* Preview Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Answer Preview</label>
                  <div className="rounded-2xl bg-[var(--primitive-neutral-100)] p-6">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 rounded-xl border border-[var(--primitive-neutral-300)] bg-[var(--background-interactive-default)] px-6 py-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--primitive-blue-500)]">
                          <div className="h-2.5 w-2.5 rounded-full bg-[var(--primitive-blue-500)]" />
                        </div>
                        <span className="text-body-sm text-foreground">Yes</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-[var(--primitive-neutral-300)] bg-[var(--background-interactive-default)] px-6 py-3">
                        <div className="h-5 w-5 rounded-full border-2 border-[var(--primitive-neutral-400)]" />
                        <span className="text-body-sm text-foreground">No</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Settings</label>
                  <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)]">
                    <div className="flex items-center justify-between border-b border-[var(--primitive-neutral-300)] px-4 py-3">
                      <span className="text-body text-foreground">Hide from apply form</span>
                      <Switch
                        checked={tempYesNoQuestion.hideFromApplyForm}
                        onCheckedChange={(checked) =>
                          setTempYesNoQuestion({ ...tempYesNoQuestion, hideFromApplyForm: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-body text-foreground">Require an answer</span>
                      <Switch
                        checked={tempYesNoQuestion.requireAnswer}
                        onCheckedChange={(checked) =>
                          setTempYesNoQuestion({ ...tempYesNoQuestion, requireAnswer: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="button"
                  variant="tertiary"
                  size="lg"
                  onClick={handleDiscardYesNoQuestion}
                >
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

              <ModalBody className="gap-6">
                {/* Question Title Field */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Question title</label>
                  <Input
                    value={tempMultipleChoice.title}
                    onChange={(e) =>
                      setTempMultipleChoice({ ...tempMultipleChoice, title: e.target.value })
                    }
                    placeholder="Write your question?"
                    className="border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-4 text-body"
                  />
                </div>

                {/* Selection Type - Single vs Multiple */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Selection Type</label>
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
                      {/* Preview Box */}
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
                      {/* Radio Button with Label */}
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
                      {/* Preview Box */}
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
                      {/* Radio Button with Label */}
                      <div className="flex w-full items-center gap-1">
                        <RadioGroupItem value="multiple" id="multiple-answers" />
                        <span className="text-caption text-foreground">Multiple Answers</span>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {/* Options Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Answer Options</label>
                  <div className="flex flex-col gap-2">
                    {tempMultipleChoice.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-3">
                          {/* Show radio circle or checkbox square based on selection type */}
                          {tempMultipleChoice.allowMultiple ? (
                            <div className="h-5 w-5 rounded-md border-2 border-[var(--primitive-neutral-400)]" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-[var(--primitive-neutral-400)]" />
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

                {/* Settings Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Settings</label>
                  <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)]">
                    <div className="flex items-center justify-between border-b border-[var(--primitive-neutral-300)] px-4 py-3">
                      <span className="text-body text-foreground">Hide from apply form</span>
                      <Switch
                        checked={tempMultipleChoice.hideFromApplyForm}
                        onCheckedChange={(checked) =>
                          setTempMultipleChoice({
                            ...tempMultipleChoice,
                            hideFromApplyForm: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-body text-foreground">Require an answer</span>
                      <Switch
                        checked={tempMultipleChoice.requireAnswer}
                        onCheckedChange={(checked) =>
                          setTempMultipleChoice({ ...tempMultipleChoice, requireAnswer: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
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
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleSaveMultipleChoice}
                >
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
                icon={
                  <Upload weight="regular" className="h-6 w-6 text-[var(--primitive-blue-700)]" />
                }
                iconBg="bg-[var(--primitive-blue-200)]"
              >
                <ModalTitle>File Upload</ModalTitle>
              </ModalHeader>

              <ModalBody className="gap-6">
                {/* Question Title Field */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Question title</label>
                  <Input
                    value={tempFileUpload.title}
                    onChange={(e) =>
                      setTempFileUpload({ ...tempFileUpload, title: e.target.value })
                    }
                    placeholder="e.g., Upload your resume"
                    className="border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-4 text-body"
                  />
                </div>

                {/* Accepted File Types */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Accepted file types</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]">
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
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]">
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
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]">
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
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Upload Preview</label>
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)] p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primitive-blue-100)]">
                      <Upload
                        weight="regular"
                        className="h-6 w-6 text-[var(--primitive-blue-500)]"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-body-sm font-medium text-foreground">
                        Drop files here or click to upload
                      </p>
                      <p className="text-caption text-foreground-subtle">
                        Max file size: {tempFileUpload.maxFileSize}MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-body text-foreground">Settings</label>
                  <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)]">
                    <div className="flex items-center justify-between border-b border-[var(--primitive-neutral-300)] px-4 py-3">
                      <span className="text-body text-foreground">Hide from apply form</span>
                      <Switch
                        checked={tempFileUpload.hideFromApplyForm}
                        onCheckedChange={(checked) =>
                          setTempFileUpload({ ...tempFileUpload, hideFromApplyForm: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-body text-foreground">Require an answer</span>
                      <Switch
                        checked={tempFileUpload.requireAnswer}
                        onCheckedChange={(checked) =>
                          setTempFileUpload({ ...tempFileUpload, requireAnswer: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="button"
                  variant="tertiary"
                  size="lg"
                  onClick={handleDiscardFileUpload}
                >
                  Discard
                </Button>
                <Button type="button" variant="primary" size="lg" onClick={handleSaveFileUpload}>
                  Apply Changes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* ============================================
              CANDIDATES TAB
              ============================================ */}
          {activeTab === "candidates" && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="mb-1 text-heading-sm text-foreground">Applications</h2>
                    <p className="text-body-sm text-foreground-muted">
                      3 candidates have applied for this role
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="tertiary" size="sm">
                      Export CSV
                    </Button>
                    <Button variant="primary" size="sm">
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="rounded-xl bg-[var(--primitive-neutral-100)] p-4">
                    <div className="mb-1 text-heading-md text-foreground">3</div>
                    <div className="text-caption text-foreground-muted">Total Applications</div>
                  </div>
                  <div className="rounded-xl bg-[var(--primitive-blue-100)] p-4">
                    <div className="mb-1 text-heading-md text-foreground">1</div>
                    <div className="text-caption text-foreground-muted">New</div>
                  </div>
                  <div className="rounded-xl bg-[var(--primitive-yellow-100)] p-4">
                    <div className="mb-1 text-heading-md text-foreground">1</div>
                    <div className="text-caption text-foreground-muted">In Review</div>
                  </div>
                  <div className="rounded-xl bg-[var(--primitive-green-100)] p-4">
                    <div className="mb-1 text-heading-md text-foreground">1</div>
                    <div className="text-caption text-foreground-muted">Interview</div>
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
                {/* Table Header */}
                <div className="border-b border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-6 py-3">
                  <div className="grid grid-cols-12 gap-4 text-caption font-semibold text-foreground-muted">
                    <div className="col-span-3">Candidate</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2">Experience</div>
                    <div className="col-span-2">Applied</div>
                    <div className="col-span-1">Match</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>
                </div>

                {/* Application Rows */}
                <div className="divide-y divide-[var(--primitive-neutral-200)]">
                  {/* Application 1 */}
                  <div className="cursor-pointer px-6 py-4 transition-colors hover:bg-[var(--background-interactive-hover)]">
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar name="Sarah Chen" size="default" />
                        <div>
                          <div className="text-body-sm font-medium text-foreground">Sarah Chen</div>
                          <div className="text-caption text-foreground-muted">
                            sarah.chen@example.com
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        San Francisco, CA
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        5-10 years
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        2 days ago
                      </div>
                      <div className="col-span-1">
                        <Badge variant="success" size="sm">
                          92%
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <Badge variant="neutral" size="sm">
                          New
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="tertiary" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Application 2 */}
                  <div className="cursor-pointer px-6 py-4 transition-colors hover:bg-[var(--background-interactive-hover)]">
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar name="Marcus Johnson" size="default" />
                        <div>
                          <div className="text-body-sm font-medium text-foreground">
                            Marcus Johnson
                          </div>
                          <div className="text-caption text-foreground-muted">
                            marcus.j@example.com
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        Austin, TX
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">3-5 years</div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        5 days ago
                      </div>
                      <div className="col-span-1">
                        <Badge variant="warning" size="sm">
                          85%
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <Badge variant="info" size="sm">
                          Reviewing
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="tertiary" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Application 3 */}
                  <div className="cursor-pointer px-6 py-4 transition-colors hover:bg-[var(--background-interactive-hover)]">
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar name="Priya Patel" size="default" />
                        <div>
                          <div className="text-body-sm font-medium text-foreground">
                            Priya Patel
                          </div>
                          <div className="text-caption text-foreground-muted">
                            priya.patel@example.com
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        New York, NY
                      </div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">10+ years</div>
                      <div className="col-span-2 text-body-sm text-foreground-muted">
                        7 days ago
                      </div>
                      <div className="col-span-1">
                        <Badge variant="success" size="sm">
                          88%
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <Badge variant="info" size="sm">
                          Interview
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="tertiary" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================
              JOB POST TAB
              ============================================ */}
          {activeTab === "job-post" && (
            <div className="flex gap-4">
              {/* Left Column - Form */}
              <div className="flex flex-1 flex-col gap-4">
                {/* Basic Info Card */}
                <FormCard>
                  <FormTitleInput
                    placeholder="Untitled Role"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    required
                  />

                  <FormField label="Job Category" required>
                    <Select value={jobCategory} onValueChange={setJobCategory}>
                      <SelectTrigger size="lg">
                        <SelectValue placeholder="Select a Job Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormRow columns={2}>
                    <FormField label="Position Type" required>
                      <Select value={positionType} onValueChange={setPositionType}>
                        <SelectTrigger size="lg">
                          <SelectValue placeholder="Select a Position Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {positionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Level of Experience" required>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger size="lg">
                          <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </FormRow>
                </FormCard>

                {/* Role Information Card */}
                <FormCard>
                  <FormSection title="Role Information">
                    <FormField
                      label="Role Description"
                      required
                      helpText="Provide a detailed overview of the responsibilities and qualifications expected from the job applicant."
                    >
                      <RichTextEditor
                        content={description}
                        onChange={setDescription}
                        placeholder="Write your role description here"
                        minHeight="100px"
                      >
                        <RichTextToolbar />
                      </RichTextEditor>
                      <div className="mt-2 flex justify-end">
                        <RichTextCharacterCounter htmlContent={description} max={250} />
                      </div>
                    </FormField>

                    <FormField
                      label="Primary Responsibilities"
                      helpText="What are the key responsibilities a candidate must fulfill to be considered for this role?"
                    >
                      <RichTextEditor
                        content={responsibilities}
                        onChange={setResponsibilities}
                        placeholder="What are the primary responsibilities for this job?"
                        minHeight="100px"
                      >
                        <RichTextToolbar />
                      </RichTextEditor>
                      <div className="mt-2 flex justify-end">
                        <RichTextCharacterCounter htmlContent={responsibilities} max={250} />
                      </div>
                    </FormField>

                    <FormField
                      label="Required Qualifications"
                      helpText="What are the essential qualifications required for a candidate to be eligible for consideration for this role."
                    >
                      <RichTextEditor
                        content={requiredQuals}
                        onChange={setRequiredQuals}
                        placeholder="What are the required qualifications for this job?"
                        minHeight="100px"
                      >
                        <RichTextToolbar />
                      </RichTextEditor>
                      <div className="mt-2 flex justify-end">
                        <RichTextCharacterCounter htmlContent={requiredQuals} max={250} />
                      </div>
                    </FormField>

                    <FormField
                      label="Desired Qualifications"
                      helpText="What are the qualifications that, while not mandatory, are highly advantageous for the position."
                    >
                      <RichTextEditor
                        content={desiredQuals}
                        onChange={setDesiredQuals}
                        placeholder="What are the desired qualifications for this job?"
                        minHeight="100px"
                      >
                        <RichTextToolbar />
                      </RichTextEditor>
                      <div className="mt-2 flex justify-end">
                        <RichTextCharacterCounter htmlContent={desiredQuals} max={250} />
                      </div>
                    </FormField>
                  </FormSection>
                </FormCard>

                {/* Education Requirements Card */}
                <FormCard>
                  <FormSection title="Education Requirements">
                    <FormField label="Education Level">
                      <Select value={educationLevel} onValueChange={setEducationLevel}>
                        <SelectTrigger size="lg">
                          <SelectValue placeholder="Education Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField
                      label="Specific Education Requirements"
                      helpText="Outline the degrees, credentials, and training required to support students with disabilities and diverse learning needs effectively."
                    >
                      <RichTextEditor
                        content={educationDetails}
                        onChange={setEducationDetails}
                        placeholder="Add any information regarding any specific education requirements"
                        minHeight="100px"
                      >
                        <RichTextToolbar />
                      </RichTextEditor>
                      <div className="mt-2 flex justify-end">
                        <RichTextCharacterCounter htmlContent={educationDetails} max={250} />
                      </div>
                    </FormField>
                  </FormSection>
                </FormCard>

                {/* Workplace Information Card */}
                <FormCard>
                  <FormSection title="Workplace Information">
                    <FormField label="Workplace Type" required>
                      <SegmentedController
                        options={[
                          { value: "onsite", label: "Onsite" },
                          { value: "remote", label: "Remote" },
                          { value: "hybrid", label: "Hybrid" },
                        ]}
                        value={workplaceType}
                        onValueChange={setWorkplaceType}
                      />
                    </FormField>

                    {workplaceType !== "remote" && (
                      <FormField label="Office Location">
                        <FormRow columns={3}>
                          <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            inputSize="lg"
                          />
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger size="lg">
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                              {usStates.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger size="lg">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormRow>
                      </FormField>
                    )}
                  </FormSection>
                </FormCard>

                {/* Compensation & Benefits Card */}
                <FormCard>
                  <FormSection title="Compensation & Benefits Information">
                    {/* Compensation subsection */}
                    <FormField
                      label="Compensation"
                      helpText="Outline the pay range, and incentives needed to fairly reward, attract, and retain someone in this role."
                    >
                      <div className="flex items-center gap-4">
                        <Select value={payType} onValueChange={setPayType}>
                          <SelectTrigger size="lg" className="w-[340px]">
                            <SelectValue placeholder="Pay Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {payTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={minPay}
                          onChange={(e) => setMinPay(e.target.value)}
                          placeholder="Minimum Pay Amount"
                          inputSize="lg"
                          leftAddon={<span className="text-body font-medium">$</span>}
                          className="flex-1"
                        />
                        <span className="text-[var(--primitive-neutral-500)]">—</span>
                        <Input
                          value={maxPay}
                          onChange={(e) => setMaxPay(e.target.value)}
                          placeholder="Maximum Pay Amount"
                          inputSize="lg"
                          leftAddon={<span className="text-body font-medium">$</span>}
                          className="flex-1"
                        />
                      </div>
                    </FormField>

                    <FormField label="Pay frequency">
                      <SegmentedController
                        options={[
                          { value: "weekly", label: "Weekly" },
                          { value: "bi-weekly", label: "Bi-Weekly" },
                          { value: "monthly", label: "Monthly" },
                        ]}
                        value={payFrequency}
                        onValueChange={setPayFrequency}
                      />
                    </FormField>

                    {/* Benefits subsection */}
                    <FormField
                      label="Benefits"
                      helpText="Outline the benefits needed to fairly reward, attract, and retain someone in this role."
                    >
                      <BenefitsSelector
                        categories={defaultBenefitCategories}
                        selectedBenefits={selectedBenefits}
                        onSelectionChange={setSelectedBenefits}
                        useCompanyDefaults={useCompanyBenefits}
                        onUseCompanyDefaultsChange={setUseCompanyBenefits}
                        companyName="Company"
                      />
                      <RichTextEditor
                        content={compensationDetails}
                        onChange={setCompensationDetails}
                        placeholder="Add any details on compensation or benefits."
                        minHeight="100px"
                      >
                        <RichTextToolbar />
                      </RichTextEditor>
                      <div className="mt-2 flex justify-end">
                        <RichTextCharacterCounter htmlContent={compensationDetails} max={250} />
                      </div>
                    </FormField>
                  </FormSection>
                </FormCard>
              </div>

              {/* Right Column - Sidebar */}
              <div className="sticky top-6 flex w-[480px] flex-col gap-4 self-start">
                {/* Role Settings Card - Figma 188:6269 */}
                <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-200)] p-6">
                    <SlidersHorizontal
                      weight="regular"
                      className="h-6 w-6 text-[var(--primitive-neutral-600)]"
                    />
                    <h2 className="flex-1 text-body-strong text-foreground">Role Settings</h2>
                  </div>

                  {/* Show Recruiter */}
                  <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
                    <span className="text-body leading-6 text-foreground">Show Recruiter</span>
                    <div className="flex items-center gap-2">
                      <Avatar
                        name="Soobin Han"
                        size="sm"
                        className="border border-[var(--primitive-neutral-300)]"
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="text-body leading-6 text-foreground">Soobin Han</span>
                        <span className="text-caption leading-4 text-foreground-subtle">
                          Sr. Technical Recruiter
                        </span>
                      </div>
                      <Switch checked={showRecruiter} onCheckedChange={setShowRecruiter} />
                    </div>
                  </div>

                  {/* Closing Date */}
                  <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
                    <label className="text-body leading-6 text-foreground">Closing Date</label>
                    <DatePicker
                      value={closingDate}
                      onChange={setClosingDate}
                      placeholder="Select closing date"
                      className="rounded-xl"
                    />
                  </div>

                  {/* External Link */}
                  <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
                    <label className="text-body leading-6 text-foreground">External Link</label>
                    <Input
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://example.com/apply"
                      inputSize="lg"
                      leftAddon={<LinkIcon weight="regular" />}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Required Files */}
                  <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex-1 text-body leading-6 text-foreground">
                        Required Files
                      </span>
                      <Folder
                        weight="regular"
                        className="h-6 w-6 text-[var(--primitive-neutral-600)]"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <SwitchWithLabel
                        label="Resume"
                        labelPosition="right"
                        checked={requireResume}
                        onCheckedChange={setRequireResume}
                      />
                      <SwitchWithLabel
                        label="Cover Letter"
                        labelPosition="right"
                        checked={requireCoverLetter}
                        onCheckedChange={setRequireCoverLetter}
                      />
                      <SwitchWithLabel
                        label="Portfolio"
                        labelPosition="right"
                        checked={requirePortfolio}
                        onCheckedChange={setRequirePortfolio}
                      />
                    </div>
                  </div>
                </div>

                {/* Role Template Card */}
                <RoleTemplateCard
                  onSaveTemplate={handleSaveTemplate}
                  isSaved={templateSaved}
                  loading={savingTemplate}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-caption">
              <span className="text-foreground-brand">Make an </span>
              <span className="font-semibold text-foreground-brand">Impact.</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
