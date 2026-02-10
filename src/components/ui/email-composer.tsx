"use client";

import * as React from "react";
import Image from "next/image";
import { cn, sanitizeHtml } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { Spinner } from "./spinner";
import { RichTextEditor, RichTextToolbar } from "./rich-text-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  PaperPlaneTilt,
  X,
  CaretDown,
  Paperclip,
  Code,
  Eye,
  Clock,
  Trash,
  Plus,
  MagicWand,
  User,
  Briefcase,
  CalendarBlank,
  Buildings,
  PencilSimple,
  File,
  FilePdf,
  FileDoc,
  FileXls,
  FilePpt,
  FileZip,
  FileImage,
  FileVideo,
  FileAudio,
  Warning,
  WarningCircle,
  Sparkle,
  EnvelopeSimple,
  Timer,
  CaretRight,
  Rows,
  SquaresFour,
  CheckCircle,
  Smiley,
  Link,
  ArrowsOutSimple,
  Minus,
} from "@phosphor-icons/react";

/* ============================================
   Email Composer Types
   ============================================ */
export interface EmailRecipient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category?: string;
}

export interface EmailVariable {
  key: string;
  label: string;
  description?: string;
  category?: "candidate" | "job" | "company" | "other";
  sampleValue?: string;
}

export interface EmailComposerProps {
  to?: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject?: string;
  body?: string;
  templates?: EmailTemplate[];
  variables?: EmailVariable[];
  attachments?: EmailAttachment[];
  onSend?: (email: {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    subject: string;
    body: string;
    attachments?: EmailAttachment[];
  }) => void;
  onSaveDraft?: () => void;
  onSchedule?: (date: Date) => void;
  onDiscard?: () => void;
  suggestedRecipients?: EmailRecipient[];
  className?: string;
  /** Allow adding CC/BCC */
  allowCcBcc?: boolean;
  /** Allow attachments */
  allowAttachments?: boolean;
  /** Show AI suggestions */
  showAiSuggestions?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Character limit for body */
  characterLimit?: number;
  /** Show broadcast toggle */
  showBroadcast?: boolean;
}

/* ============================================
   Default Variables for ATS
   ============================================ */
const defaultVariables: EmailVariable[] = [
  {
    key: "{{candidate_name}}",
    label: "Candidate Name",
    category: "candidate",
    sampleValue: "John Smith",
  },
  {
    key: "{{candidate_first_name}}",
    label: "First Name",
    category: "candidate",
    sampleValue: "John",
  },
  {
    key: "{{candidate_email}}",
    label: "Candidate Email",
    category: "candidate",
    sampleValue: "john@example.com",
  },
  {
    key: "{{job_title}}",
    label: "Job Title",
    category: "job",
    sampleValue: "Senior Solar Engineer",
  },
  {
    key: "{{job_location}}",
    label: "Job Location",
    category: "job",
    sampleValue: "San Francisco, CA",
  },
  {
    key: "{{company_name}}",
    label: "Company Name",
    category: "company",
    sampleValue: "Green Energy Co",
  },
  {
    key: "{{interview_date}}",
    label: "Interview Date",
    category: "other",
    sampleValue: "January 15, 2024",
  },
  {
    key: "{{interview_time}}",
    label: "Interview Time",
    category: "other",
    sampleValue: "2:00 PM PST",
  },
  {
    key: "{{interviewer_name}}",
    label: "Interviewer Name",
    category: "other",
    sampleValue: "Sarah Johnson",
  },
  {
    key: "{{application_link}}",
    label: "Application Link",
    category: "other",
    sampleValue: "https://careers.example.com/apply",
  },
];

/* ============================================
   Helper Functions
   ============================================ */
const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return <FilePdf className="h-4 w-4 text-red-500" />;
  if (type.includes("word") || type.includes("doc"))
    return <FileDoc className="h-4 w-4 text-blue-500" />;
  if (type.includes("sheet") || type.includes("excel") || type.includes("xls"))
    return <FileXls className="h-4 w-4 text-green-500" />;
  if (type.includes("presentation") || type.includes("powerpoint") || type.includes("ppt"))
    return <FilePpt className="h-4 w-4 text-orange-500" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <FileZip className="h-4 w-4 text-yellow-600" />;
  if (type.includes("image")) return <FileImage className="h-4 w-4 text-purple-500" />;
  if (type.includes("video")) return <FileVideo className="h-4 w-4 text-pink-500" />;
  if (type.includes("audio")) return <FileAudio className="h-4 w-4 text-teal-500" />;
  return <File className="h-4 w-4 text-foreground-muted" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
};

/* ============================================
   Recipient Chip — Pill with avatar + remove
   ============================================ */
interface RecipientChipProps {
  recipient: EmailRecipient;
  onRemove?: (id: string) => void;
  disabled?: boolean;
}

const RecipientChip: React.FC<RecipientChipProps> = ({ recipient, onRemove, disabled }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5",
        "border border-[var(--border-default)] bg-[var(--background-subtle)]",
        "text-sm text-[var(--foreground-default)]",
        "transition-colors duration-100",
        !disabled && "hover:bg-[var(--background-muted)]"
      )}
    >
      <Avatar src={recipient.avatar} name={recipient.name} size="xs" />
      <span className="max-w-40 truncate leading-none">{recipient.name || recipient.email}</span>
      {!disabled && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(recipient.id)}
          className={cn(
            "ml-0.5 flex h-4 w-4 items-center justify-center rounded-full",
            "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
            "hover:bg-[var(--background-emphasized)]",
            "transition-colors duration-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
          )}
          aria-label={`Remove ${recipient.name}`}
        >
          <X className="h-3 w-3" weight="bold" />
        </button>
      )}
    </span>
  );
};

/* ============================================
   Attachment Card — Compact inline style
   ============================================ */
interface AttachmentCardProps {
  attachment: EmailAttachment;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  onRemove,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl px-3 py-2",
        "border border-[var(--border-default)] bg-[var(--background-subtle)]",
        "transition-colors duration-100",
        !disabled && "hover:bg-[var(--background-muted)]"
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-muted)] bg-[var(--card-background)]">
        {attachment.url && attachment.type.includes("image") ? (
          <Image
            src={attachment.url}
            alt={attachment.name}
            width={32}
            height={32}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          getFileIcon(attachment.type)
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight text-[var(--foreground-default)]">
          {attachment.name}
        </p>
        <p className="text-xs text-[var(--foreground-subtle)]">{formatFileSize(attachment.size)}</p>
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={() => onRemove(attachment.id)}
          className={cn(
            "ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            "text-[var(--foreground-subtle)]",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]",
            "transition-all duration-100",
            "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
          )}
          aria-label={`Remove ${attachment.name}`}
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

/* ============================================
   Send Warning Banner
   ============================================ */
interface SendWarning {
  type: "error" | "warning";
  message: string;
}

const SendWarningBanner: React.FC<{ warnings: SendWarning[] }> = ({ warnings }) => {
  if (warnings.length === 0) return null;

  const hasError = warnings.some((w) => w.type === "error");

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 px-5 py-2.5 text-sm",
        hasError
          ? "bg-[var(--background-error)] text-[var(--foreground-error)]"
          : "bg-[var(--background-warning)] text-[var(--foreground-warning)]"
      )}
    >
      {hasError ? (
        <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" weight="fill" />
      ) : (
        <Warning className="mt-0.5 h-4 w-4 shrink-0" weight="fill" />
      )}
      <div className="flex-1 space-y-0.5">
        {warnings.map((warning, i) => (
          <p key={i}>{warning.message}</p>
        ))}
      </div>
    </div>
  );
};

/* ============================================
   Template Gallery — Card grid
   ============================================ */
interface TemplateGalleryProps {
  templates: EmailTemplate[];
  onSelect: (template: EmailTemplate) => void;
  selectedId?: string;
  className?: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  onSelect,
  selectedId,
  className,
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  if (templates.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle className="h-4 w-4 text-[var(--foreground-brand)]" weight="fill" />
          <span className="text-sm font-semibold text-[var(--foreground-default)]">Templates</span>
          <span className="text-xs text-[var(--foreground-subtle)]">{templates.length}</span>
        </div>
        <div className="flex items-center rounded-lg border border-[var(--border-default)] p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md p-1.5 transition-colors duration-100",
              viewMode === "grid"
                ? "bg-[var(--background-subtle)] text-[var(--foreground-default)]"
                : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]"
            )}
            aria-label="Grid view"
          >
            <SquaresFour className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md p-1.5 transition-colors duration-100",
              viewMode === "list"
                ? "bg-[var(--background-subtle)] text-[var(--foreground-default)]"
                : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]"
            )}
            aria-label="List view"
          >
            <Rows className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
          {templates.slice(0, 6).map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "group relative flex flex-col rounded-xl border p-3.5 text-left",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
                selectedId === template.id
                  ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                  : "border-[var(--border-default)] hover:border-[var(--border-emphasis)] hover:shadow-[var(--shadow-sm)]"
              )}
            >
              {template.category && (
                <span className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                  {template.category}
                </span>
              )}
              <span className="line-clamp-1 text-sm font-medium text-[var(--foreground-default)]">
                {template.name}
              </span>
              <span className="mt-1 line-clamp-2 text-xs text-[var(--foreground-subtle)]">
                {template.subject}
              </span>
              {selectedId === template.id && (
                <span className="absolute right-2.5 top-2.5">
                  <CheckCircle className="h-4 w-4 text-[var(--foreground-brand)]" weight="fill" />
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
                selectedId === template.id
                  ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                  : "border-[var(--border-default)] hover:border-[var(--border-emphasis)] hover:bg-[var(--background-subtle)]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  selectedId === template.id
                    ? "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]"
                    : "bg-[var(--background-subtle)] text-[var(--foreground-subtle)] group-hover:text-[var(--foreground-brand)]"
                )}
              >
                <EnvelopeSimple className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--foreground-default)]">
                  {template.name}
                </span>
                <span className="block truncate text-xs text-[var(--foreground-subtle)]">
                  {template.subject}
                </span>
              </div>
              {template.category && (
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {template.category}
                </Badge>
              )}
              <CaretRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-[var(--foreground-subtle)]",
                  "transition-transform duration-150 group-hover:translate-x-0.5"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================
   Recipient Input — Chips + autocomplete
   ============================================ */
interface RecipientInputProps {
  value: EmailRecipient[];
  onChange: (recipients: EmailRecipient[]) => void;
  suggestions?: EmailRecipient[];
  placeholder?: string;
  disabled?: boolean;
}

const RecipientInput: React.FC<RecipientInputProps> = ({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add recipients...",
  disabled = false,
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !value.some((r) => r.id === s.id) &&
      (s.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        s.email.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const handleAddRecipient = (recipient: EmailRecipient) => {
    onChange([...value, recipient]);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveRecipient = (id: string) => {
    onChange(value.filter((r) => r.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      handleRemoveRecipient(value[value.length - 1].id);
    }
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      const match = filteredSuggestions[0];
      if (match) {
        handleAddRecipient(match);
      } else if (inputValue.includes("@")) {
        handleAddRecipient({
          id: inputValue,
          name: inputValue.split("@")[0],
          email: inputValue,
        });
      }
    }
  };

  return (
    <Popover
      open={showSuggestions && filteredSuggestions.length > 0}
      onOpenChange={setShowSuggestions}
    >
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex min-h-[38px] flex-wrap items-center gap-1.5 py-1",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {value.map((recipient) => (
            <RecipientChip
              key={recipient.id}
              recipient={recipient}
              onRemove={disabled ? undefined : handleRemoveRecipient}
              disabled={disabled}
            />
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className={cn(
              "min-w-24 flex-1 bg-transparent text-sm",
              "text-[var(--foreground-default)] placeholder:text-[var(--foreground-subtle)]",
              "focus:outline-none"
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-1" align="start">
        <div className="max-h-52 overflow-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleAddRecipient(suggestion)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                "hover:bg-[var(--background-interactive-hover)]",
                "transition-colors duration-100"
              )}
            >
              <Avatar src={suggestion.avatar} name={suggestion.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground-default)]">
                  {suggestion.name}
                </p>
                <p className="truncate text-xs text-[var(--foreground-subtle)]">
                  {suggestion.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ============================================
   Variable Inserter
   ============================================ */
interface VariableInserterProps {
  variables: EmailVariable[];
  onInsert: (variable: string) => void;
  disabled?: boolean;
}

const VariableInserter: React.FC<VariableInserterProps> = ({
  variables,
  onInsert,
  disabled = false,
}) => {
  const groupedVariables = React.useMemo(() => {
    const groups: Record<string, EmailVariable[]> = {
      candidate: [],
      job: [],
      company: [],
      other: [],
    };
    variables.forEach((v) => {
      const category = v.category || "other";
      groups[category].push(v);
    });
    return groups;
  }, [variables]);

  const categoryIcons = {
    candidate: <User className="h-3.5 w-3.5" />,
    job: <Briefcase className="h-3.5 w-3.5" />,
    company: <Buildings className="h-3.5 w-3.5" />,
    other: <CalendarBlank className="h-3.5 w-3.5" />,
  };

  const categoryLabels = {
    candidate: "Candidate",
    job: "Job",
    company: "Company",
    other: "Other",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={disabled} className="h-8 gap-1.5 px-2.5">
          <Code className="h-4 w-4" />
          <span className="hidden text-xs sm:inline">Variables</span>
          <CaretDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {Object.entries(groupedVariables).map(([category, vars]) =>
          vars.length > 0 ? (
            <React.Fragment key={category}>
              <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-subtle)]">
                {categoryIcons[category as keyof typeof categoryIcons]}
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              {vars.map((variable) => (
                <DropdownMenuItem
                  key={variable.key}
                  onClick={() => onInsert(variable.key)}
                  className="flex cursor-pointer flex-col items-start gap-1 py-2"
                >
                  <span className="rounded bg-[var(--background-brand-subtle)] px-1.5 py-0.5 font-mono text-xs text-[var(--foreground-brand)]">
                    {variable.key}
                  </span>
                  <span className="text-xs text-[var(--foreground-subtle)]">{variable.label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </React.Fragment>
          ) : null
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ============================================
   Email Composer — Main Component

   Redesigned with a modern, clean aesthetic:
   - Minimal header with title + window controls
   - Inline To/Subject fields with subtle labels
   - Full-width body with generous padding
   - Compact attachment chips
   - Streamlined footer: toolbar left, actions right
   ============================================ */
const EmailComposer = React.forwardRef<HTMLDivElement, EmailComposerProps>(
  (
    {
      to: initialTo = [],
      cc: initialCc = [],
      bcc: initialBcc = [],
      subject: initialSubject = "",
      body: initialBody = "",
      templates = [],
      variables = defaultVariables,
      attachments: initialAttachments = [],
      onSend,
      onSaveDraft,
      onSchedule,
      onDiscard,
      suggestedRecipients = [],
      className,
      allowCcBcc = true,
      allowAttachments = true,
      showAiSuggestions = true,
      loading = false,
      characterLimit = 2000,
    },
    ref
  ) => {
    const [to, setTo] = React.useState<EmailRecipient[]>(initialTo);
    const [cc, setCc] = React.useState<EmailRecipient[]>(initialCc);
    const [bcc, setBcc] = React.useState<EmailRecipient[]>(initialBcc);
    const [showCc, setShowCc] = React.useState(initialCc.length > 0);
    const [showBcc, setShowBcc] = React.useState(initialBcc.length > 0);
    const [subject, setSubject] = React.useState(initialSubject);
    const [body, setBody] = React.useState(initialBody);
    const [attachments, setAttachments] = React.useState<EmailAttachment[]>(initialAttachments);
    const [showPreview, setShowPreview] = React.useState(false);
    const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
    const [showTemplates, setShowTemplates] = React.useState(templates.length > 0 && !initialBody);
    const [draftSaved, setDraftSaved] = React.useState(false);

    const bodyTextLength = React.useMemo(() => {
      // Strip HTML tags for character count
      return body.replace(/<[^>]*>/g, "").length;
    }, [body]);

    const handleTemplateSelect = (template: EmailTemplate) => {
      setSubject(template.subject);
      setBody(template.body);
      setSelectedTemplate(template.id);
      setShowTemplates(false);
    };

    const handleInsertVariable = (variable: string) => {
      setBody((prev) => prev + variable);
    };

    const handleSend = () => {
      if (to.length === 0) return;
      onSend?.({
        to,
        cc: cc.length > 0 ? cc : undefined,
        bcc: bcc.length > 0 ? bcc : undefined,
        subject,
        body,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    };

    const handleSaveDraft = () => {
      onSaveDraft?.();
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const newAttachments: EmailAttachment[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    };

    const handleRemoveAttachment = (id: string) => {
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    };

    // Smart send warnings
    const sendWarnings = React.useMemo(() => {
      const warnings: SendWarning[] = [];
      if (!subject.trim()) {
        warnings.push({ type: "warning", message: "No subject line" });
      }
      const bodyLower = body.toLowerCase();
      const attachmentKeywords = ["attach", "attached", "attachment", "enclosed", "enclosing"];
      const mentionsAttachment = attachmentKeywords.some((keyword) => bodyLower.includes(keyword));
      if (mentionsAttachment && attachments.length === 0) {
        warnings.push({
          type: "warning",
          message: "You mentioned an attachment but none are attached",
        });
      }
      const unfilledVars = body.match(/\{\{[^}]+\}\}/g);
      if (unfilledVars && unfilledVars.length > 0) {
        warnings.push({
          type: "warning",
          message: `${unfilledVars.length} variable(s) will be replaced when sending`,
        });
      }
      return warnings;
    }, [subject, body, attachments]);

    // Preview with variables replaced
    const previewBody = React.useMemo(() => {
      let preview = body;
      variables.forEach((v) => {
        preview = preview.replace(
          new RegExp(v.key.replace(/[{}]/g, "\\$&"), "g"),
          v.sampleValue || v.label
        );
      });
      return preview;
    }, [body, variables]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl",
          "border border-[var(--border-default)] bg-[var(--card-background)]",
          "shadow-card",
          className
        )}
      >
        {/* ── Header: Title + window controls ── */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-5 py-3.5">
          <h3 className="text-base font-semibold text-[var(--foreground-default)]">
            Compose Email
          </h3>
          <div className="flex items-center gap-1">
            {templates.length > 0 && (
              <Button
                variant={showTemplates ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="h-7 gap-1.5 px-2 text-xs"
              >
                <Sparkle className="h-3.5 w-3.5" weight={showTemplates ? "fill" : "regular"} />
                Templates
              </Button>
            )}
            <Button
              variant={showPreview ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-7 gap-1 px-2 text-xs"
            >
              {showPreview ? (
                <PencilSimple className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <span className="mx-1 h-4 w-px bg-[var(--border-muted)]" />
            <button
              onClick={onDiscard}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                "hover:bg-[var(--background-subtle)]",
                "transition-colors duration-100"
              )}
              aria-label="Minimize"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                "hover:bg-[var(--background-subtle)]",
                "transition-colors duration-100"
              )}
              aria-label="Expand"
            >
              <ArrowsOutSimple className="h-4 w-4" />
            </button>
            {onDiscard && (
              <button
                onClick={onDiscard}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                  "hover:bg-[var(--background-subtle)]",
                  "transition-colors duration-100"
                )}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Template Gallery (collapsible) ── */}
        {showTemplates && templates.length > 0 && (
          <div className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)] px-5 py-4">
            <TemplateGallery
              templates={templates}
              onSelect={handleTemplateSelect}
              selectedId={selectedTemplate}
            />
          </div>
        )}

        {showPreview ? (
          /* ── Preview Mode ── */
          <div className="flex-1 space-y-5 overflow-auto p-6">
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                Recipients
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {to.map((r) => (
                  <RecipientChip key={r.id} recipient={r} disabled />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                Subject
              </span>
              <p className="text-lg font-semibold text-[var(--foreground-default)]">
                {subject || "(No subject)"}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                Message
              </span>
              <div
                className="prose prose-sm max-w-none rounded-xl border border-[var(--border-muted)] bg-[var(--background-subtle)] p-5"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(previewBody) }}
              />
            </div>
            {attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                  Attachments ({attachments.length})
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <AttachmentCard
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={handleRemoveAttachment}
                      disabled
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Edit Mode ── */
          <>
            {/* Recipients area — clean inline layout */}
            <div className="space-y-2 px-5 pb-0 pt-4">
              {/* To field */}
              <div className="flex items-start gap-0">
                <span className="w-10 shrink-0 pt-2 text-sm font-medium text-[var(--foreground-subtle)]">
                  To:
                </span>
                <div className="min-w-0 flex-1">
                  <RecipientInput
                    value={to}
                    onChange={setTo}
                    suggestions={suggestedRecipients}
                    disabled={loading}
                  />
                </div>
                {allowCcBcc && !showCc && !showBcc && (
                  <span className="shrink-0 pt-1.5 text-sm text-[var(--foreground-subtle)]">
                    <button
                      onClick={() => {
                        setShowCc(true);
                        setShowBcc(true);
                      }}
                      className="px-1 transition-colors duration-100 hover:text-[var(--foreground-default)]"
                    >
                      CC/BCC
                    </button>
                  </span>
                )}
              </div>

              {/* CC field */}
              {showCc && (
                <div className="flex items-start gap-0">
                  <span className="w-10 shrink-0 pt-2 text-sm font-medium text-[var(--foreground-subtle)]">
                    CC
                  </span>
                  <div className="min-w-0 flex-1">
                    <RecipientInput
                      value={cc}
                      onChange={setCc}
                      suggestions={suggestedRecipients}
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowCc(false);
                      setCc([]);
                    }}
                    className="shrink-0 pt-2 text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground-default)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* BCC field */}
              {showBcc && (
                <div className="flex items-start gap-0">
                  <span className="w-10 shrink-0 pt-2 text-sm font-medium text-[var(--foreground-subtle)]">
                    BCC
                  </span>
                  <div className="min-w-0 flex-1">
                    <RecipientInput
                      value={bcc}
                      onChange={setBcc}
                      suggestions={suggestedRecipients}
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowBcc(false);
                      setBcc([]);
                    }}
                    className="shrink-0 pt-2 text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground-default)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mx-5 border-b border-[var(--border-muted)]" />

            {/* Subject field — inline with label */}
            <div className="flex items-center gap-0 px-5 py-3">
              <span className="w-16 shrink-0 text-sm font-medium text-[var(--foreground-subtle)]">
                Subject:
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                disabled={loading}
                className={cn(
                  "flex-1 bg-transparent text-sm font-medium",
                  "text-[var(--foreground-default)] placeholder:text-[var(--foreground-disabled)]",
                  "focus:outline-none"
                )}
              />
            </div>

            {/* Divider */}
            <div className="mx-5 border-b border-[var(--border-muted)]" />

            {/* Body editor */}
            <div className="flex min-h-0 flex-1 flex-col">
              <RichTextEditor
                content={body}
                onChange={setBody}
                placeholder="Write your message..."
                className="flex-1 rounded-none border-0"
                minHeight="180px"
              >
                {/* Minimal toolbar — integrated into the editor area */}
                <div className="flex items-center gap-1 px-5 py-2">
                  <RichTextToolbar />
                  <span className="mx-1 h-4 w-px bg-[var(--border-muted)]" />
                  <VariableInserter
                    variables={variables}
                    onInsert={handleInsertVariable}
                    disabled={loading}
                  />
                  {showAiSuggestions && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={loading}
                      className="h-8 gap-1.5 px-2.5"
                    >
                      <MagicWand className="h-4 w-4" />
                      <span className="hidden text-xs sm:inline">AI Suggest</span>
                    </Button>
                  )}
                </div>
              </RichTextEditor>
            </div>

            {/* Attachments section — horizontal chips */}
            {attachments.length > 0 && (
              <div className="px-5 pb-3 pt-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--foreground-subtle)]">
                    Attachments
                  </span>
                  {allowAttachments && (
                    <button
                      onClick={() => document.getElementById("email-attachments")?.click()}
                      disabled={loading}
                      className="text-xs text-[var(--foreground-brand)] hover:underline"
                    >
                      + Add more
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <AttachmentCard
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={handleRemoveAttachment}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Send Warnings */}
        <SendWarningBanner warnings={sendWarnings} />

        {/* ── Footer: Toolbar icons left, status + actions right ── */}
        <div className="flex items-center justify-between border-t border-[var(--border-muted)] px-4 py-3">
          {/* Left: quick action icons */}
          <div className="flex items-center gap-0.5">
            {allowAttachments && (
              <>
                <input
                  type="file"
                  id="email-attachments"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <button
                  onClick={() => document.getElementById("email-attachments")?.click()}
                  disabled={loading}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                    "hover:bg-[var(--background-subtle)]",
                    "transition-colors duration-100",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  aria-label="Attach file"
                >
                  <Paperclip className="h-[18px] w-[18px]" />
                </button>
              </>
            )}
            {onSchedule && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={loading}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md",
                      "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                      "hover:bg-[var(--background-subtle)]",
                      "transition-colors duration-100",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    aria-label="Schedule send"
                  >
                    <Clock className="h-[18px] w-[18px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <div className="px-2 py-1.5 text-xs font-medium text-[var(--foreground-subtle)]">
                    Send later
                  </div>
                  <DropdownMenuItem
                    onClick={() => onSchedule(new Date(Date.now() + 3600000))}
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    In 1 hour
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSchedule(new Date(Date.now() + 86400000))}
                    className="gap-2"
                  >
                    <CalendarBlank className="h-4 w-4" />
                    Tomorrow morning
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSchedule(new Date(Date.now() + 172800000))}
                    className="gap-2"
                  >
                    <CalendarBlank className="h-4 w-4" />
                    In 2 days
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <CalendarBlank className="h-4 w-4" />
                    Pick date & time...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md",
                "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                "hover:bg-[var(--background-subtle)]",
                "transition-colors duration-100"
              )}
              aria-label="Insert emoji"
            >
              <Smiley className="h-[18px] w-[18px]" />
            </button>
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md",
                "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]",
                "hover:bg-[var(--background-subtle)]",
                "transition-colors duration-100"
              )}
              aria-label="Insert link"
            >
              <Link className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-3">
            {/* Character count */}
            {characterLimit > 0 && bodyTextLength > 0 && (
              <span
                className={cn(
                  "text-xs tabular-nums",
                  bodyTextLength > characterLimit
                    ? "text-[var(--foreground-error)]"
                    : "text-[var(--foreground-subtle)]"
                )}
              >
                {bodyTextLength}/{characterLimit}
              </span>
            )}

            {/* Draft saved indicator */}
            {draftSaved && (
              <span className="flex items-center gap-1 text-xs text-[var(--foreground-success)]">
                <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                Draft Saved
              </span>
            )}

            {/* Save draft */}
            {onSaveDraft && !draftSaved && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                disabled={loading}
                className="h-8 text-xs text-[var(--foreground-subtle)]"
              >
                Save draft
              </Button>
            )}

            {/* Discard */}
            {onDiscard && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDiscard}
                disabled={loading}
                className="h-8 text-xs"
              >
                Discard
              </Button>
            )}

            {/* Generate / Send button with split action */}
            <div className="flex items-center">
              <Button
                onClick={handleSend}
                disabled={loading || to.length === 0}
                size="sm"
                className={cn("h-8 gap-1.5 rounded-r-none px-4", "shadow-[var(--shadow-button)]")}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" variant="current" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Sparkle className="h-3.5 w-3.5" weight="fill" />
                    Send
                  </>
                )}
              </Button>
              {onSchedule && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      disabled={loading || to.length === 0}
                      className="h-8 rounded-l-none border-l border-l-white/20 px-1.5 shadow-[var(--shadow-button)]"
                    >
                      <CaretDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => onSchedule(new Date(Date.now() + 3600000))}
                      className="gap-2"
                    >
                      <Timer className="h-4 w-4" />
                      Schedule for later
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSaveDraft} className="gap-2">
                      <PencilSimple className="h-4 w-4" />
                      Save as draft
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
EmailComposer.displayName = "EmailComposer";

/* ============================================
   Quick Reply Component — Streamlined
   ============================================ */
interface QuickReplyProps {
  to: EmailRecipient;
  replyTo?: { subject: string; body: string };
  onSend: (body: string) => void;
  onCancel?: () => void;
  className?: string;
}

const QuickReply: React.FC<QuickReplyProps> = ({ to, replyTo, onSend, onCancel, className }) => {
  const [body, setBody] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border",
        "bg-[var(--card-background)]",
        "transition-all duration-200",
        isFocused
          ? "border-[var(--border-brand)] shadow-card-hover ring-1 ring-[var(--border-brand)]"
          : "border-[var(--border-default)] shadow-card hover:border-[var(--border-emphasis)]",
        className
      )}
    >
      {/* Compact header */}
      <div className="flex items-center gap-2.5 border-b border-[var(--border-muted)] px-4 py-2.5">
        <Avatar src={to.avatar} name={to.name} size="xs" />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-[var(--foreground-default)]">{to.name}</span>
          {replyTo && (
            <span className="ml-2 text-xs text-[var(--foreground-subtle)]">
              Re: {replyTo.subject}
            </span>
          )}
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Write your reply..."
        rows={3}
        className={cn(
          "w-full border-0 bg-transparent px-4 py-3 text-sm",
          "resize-none focus:outline-none",
          "text-[var(--foreground-default)]",
          "placeholder:text-[var(--foreground-disabled)]"
        )}
      />

      {/* Compact footer */}
      <div className="flex items-center justify-between border-t border-[var(--border-muted)] px-4 py-2.5">
        <span className="text-xs text-[var(--foreground-subtle)]">
          {body.length > 0 && `${body.length} characters`}
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 text-xs">
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onSend(body)}
            disabled={!body.trim()}
            className="h-7 gap-1.5 text-xs"
          >
            <PaperPlaneTilt className="h-3.5 w-3.5" weight="fill" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ============================================
   Exports
   ============================================ */
export {
  EmailComposer,
  QuickReply,
  RecipientInput,
  VariableInserter,
  TemplateGallery,
  AttachmentCard,
  SendWarningBanner,
  defaultVariables,
  getFileIcon,
  formatFileSize,
};
