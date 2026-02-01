"use client";

import * as React from "react";
import Image from "next/image";
import { cn, sanitizeHtml } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { Tooltip } from "./tooltip";
import { RichTextEditor, RichTextToolbar, RichTextExtendedToolbar } from "./rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dropdown";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  PaperPlaneTilt,
  X,
  CaretDown,
  Paperclip,
  Image as ImageIcon,
  Code,
  Eye,
  Clock,
  Trash,
  Copy,
  ArrowBendUpLeft,
  ArrowBendUpRight,
  Plus,
  MagicWand,
  User,
  Briefcase,
  CalendarBlank,
  Buildings,
  Lightning,
  CircleNotch,
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
  CheckCircle,
  WarningCircle,
  Sparkle,
  EnvelopeSimple,
  PaperPlane,
  Timer,
  CaretRight,
  Lightning as LightningIcon,
  Rows,
  SquaresFour,
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
  if (type.includes("pdf")) return <FilePdf className="h-5 w-5 text-red-500" />;
  if (type.includes("word") || type.includes("doc"))
    return <FileDoc className="h-5 w-5 text-blue-500" />;
  if (type.includes("sheet") || type.includes("excel") || type.includes("xls"))
    return <FileXls className="h-5 w-5 text-green-500" />;
  if (type.includes("presentation") || type.includes("powerpoint") || type.includes("ppt"))
    return <FilePpt className="h-5 w-5 text-orange-500" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <FileZip className="h-5 w-5 text-yellow-600" />;
  if (type.includes("image")) return <FileImage className="h-5 w-5 text-purple-500" />;
  if (type.includes("video")) return <FileVideo className="h-5 w-5 text-pink-500" />;
  if (type.includes("audio")) return <FileAudio className="h-5 w-5 text-teal-500" />;
  return <File className="h-5 w-5 text-foreground-muted" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
};

/* ============================================
   Attachment Card Component
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
  const isImage = attachment.type.includes("image");
  const extension = getFileExtension(attachment.name);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
        "dark:bg-neutral-800/50 border border-border-muted bg-neutral-50",
        "hover:border-border-default hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "transition-all duration-150"
      )}
    >
      {/* File icon or thumbnail */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-muted bg-white dark:bg-neutral-900">
        {isImage && attachment.url ? (
          <Image
            src={attachment.url}
            alt={attachment.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          getFileIcon(attachment.type)
        )}
      </div>

      {/* File details */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground-default truncate text-sm font-medium">{attachment.name}</p>
        <p className="text-xs text-foreground-muted">
          {extension && <span className="uppercase">{extension} • </span>}
          {formatFileSize(attachment.size)}
        </p>
      </div>

      {/* Remove button */}
      {!disabled && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(attachment.id)}
          className={cn(
            "h-7 w-7 rounded-full",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30",
            "transition-all duration-150"
          )}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

/* ============================================
   Send Warning Component
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
        "flex items-start gap-2 px-4 py-2.5 text-sm",
        hasError
          ? "border-t border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          : "border-t border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      )}
    >
      {hasError ? (
        <WarningCircle className="mt-0.5 h-4 w-4 flex-shrink-0" weight="fill" />
      ) : (
        <Warning className="mt-0.5 h-4 w-4 flex-shrink-0" weight="fill" />
      )}
      <div className="flex-1">
        {warnings.map((warning, i) => (
          <p key={i}>{warning.message}</p>
        ))}
      </div>
    </div>
  );
};

/* ============================================
   Template Gallery Component
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

  // Group templates by category
  const groupedTemplates = React.useMemo(() => {
    const groups: Record<string, EmailTemplate[]> = {};
    templates.forEach((t) => {
      const category = t.category || "General";
      if (!groups[category]) groups[category] = [];
      groups[category].push(t);
    });
    return groups;
  }, [templates]);

  if (templates.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle className="h-4 w-4 text-primary-600" weight="fill" />
          <h4 className="text-foreground-default text-sm font-semibold">Quick Templates</h4>
          <Badge variant="secondary" className="text-xs">
            {templates.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-800">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md p-1.5 transition-all duration-150",
              viewMode === "grid"
                ? "bg-white shadow-sm dark:bg-neutral-700"
                : "hover:text-foreground-default text-foreground-muted"
            )}
          >
            <SquaresFour className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md p-1.5 transition-all duration-150",
              viewMode === "list"
                ? "bg-white shadow-sm dark:bg-neutral-700"
                : "hover:text-foreground-default text-foreground-muted"
            )}
          >
            <Rows className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {templates.slice(0, 6).map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "group relative flex flex-col rounded-xl border p-4 text-left transition-all duration-150",
                "hover:bg-primary-50/50 hover:border-primary-300 hover:shadow-md",
                "dark:hover:bg-primary-900/20 dark:hover:border-primary-600",
                "focus:ring-ring-color focus:outline-none focus:ring-2 focus:ring-offset-2",
                selectedId === template.id
                  ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500"
                  : "bg-surface-default border-border-muted"
              )}
            >
              {/* Category tag */}
              {template.category && (
                <span className="mb-2 text-[10px] font-medium uppercase tracking-wider text-foreground-muted">
                  {template.category}
                </span>
              )}
              <h5 className="text-foreground-default line-clamp-1 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300">
                {template.name}
              </h5>
              <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">{template.subject}</p>
              {/* Use indicator */}
              <div
                className={cn(
                  "absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full transition-all",
                  selectedId === template.id
                    ? "bg-primary-600 text-white"
                    : "bg-transparent group-hover:bg-primary-100 dark:group-hover:bg-primary-800"
                )}
              >
                {selectedId === template.id ? (
                  <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                ) : (
                  <CaretRight className="h-3.5 w-3.5 text-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all duration-150",
                "hover:bg-primary-50/50 hover:border-primary-300 hover:shadow-sm",
                "dark:hover:bg-primary-900/20 dark:hover:border-primary-600",
                "focus:ring-ring-color focus:outline-none focus:ring-2 focus:ring-offset-2",
                selectedId === template.id
                  ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500"
                  : "bg-surface-default border-border-muted"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                  selectedId === template.id
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-foreground-muted group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-neutral-800"
                )}
              >
                <EnvelopeSimple className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-foreground-default truncate text-sm font-medium">
                  {template.name}
                </h5>
                <p className="truncate text-xs text-foreground-muted">{template.subject}</p>
              </div>
              {template.category && (
                <Badge variant="secondary" className="flex-shrink-0 text-[10px]">
                  {template.category}
                </Badge>
              )}
              <CaretRight
                className={cn(
                  "h-4 w-4 text-foreground-muted transition-all",
                  "group-hover:translate-x-0.5 group-hover:text-primary-600"
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
   Recipient Input Component
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
      // Add as plain email if no match
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
            "flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border px-3 py-1.5",
            "bg-input-background border-input-border",
            "focus-within:ring-ring-color focus-within:ring-2 focus-within:ring-offset-1",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {value.map((recipient) => (
            <Badge key={recipient.id} variant="secondary" className="gap-1 pr-1">
              <Avatar src={recipient.avatar} name={recipient.name} size="xs" />
              <span className="max-w-32 truncate">{recipient.name}</span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRecipient(recipient.id)}
                  className="h-5 w-5 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
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
            className="min-w-32 flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        <div className="max-h-48 overflow-auto">
          {filteredSuggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="ghost"
              onClick={() => handleAddRecipient(suggestion)}
              className="flex h-auto w-full items-center justify-start gap-2 px-2 py-2"
            >
              <Avatar src={suggestion.avatar} name={suggestion.name} size="sm" />
              <div className="min-w-0 text-left">
                <p className="truncate font-medium">{suggestion.name}</p>
                <p className="truncate text-xs text-foreground-muted">{suggestion.email}</p>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ============================================
   Variable Inserter Component
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
    candidate: <User className="h-4 w-4" />,
    job: <Briefcase className="h-4 w-4" />,
    company: <Buildings className="h-4 w-4" />,
    other: <CalendarBlank className="h-4 w-4" />,
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
        <Button variant="ghost" size="sm" disabled={disabled}>
          <Code className="mr-1 h-4 w-4" />
          Variables
          <CaretDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {Object.entries(groupedVariables).map(([category, vars]) =>
          vars.length > 0 ? (
            <React.Fragment key={category}>
              <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                {categoryIcons[category as keyof typeof categoryIcons]}
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              {vars.map((variable) => (
                <DropdownMenuItem
                  key={variable.key}
                  onClick={() => onInsert(variable.key)}
                  className="flex cursor-pointer flex-col items-start gap-1 py-2"
                >
                  <span className="rounded bg-background-brand-subtle px-1.5 py-0.5 font-mono text-xs text-foreground-brand">
                    {variable.key}
                  </span>
                  <span className="text-xs text-foreground-muted">{variable.label}</span>
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
   Email Composer Component
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

    const handleTemplateSelect = (template: EmailTemplate) => {
      setSubject(template.subject);
      setBody(template.body);
      setSelectedTemplate(template.id);
      setShowTemplates(false);
    };

    const handleTemplateSelectById = (templateId: string) => {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        handleTemplateSelect(template);
      }
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

      // Check for empty subject
      if (!subject.trim()) {
        warnings.push({ type: "warning", message: "No subject line" });
      }

      // Check for attachment mention without actual attachments
      const bodyLower = body.toLowerCase();
      const attachmentKeywords = ["attach", "attached", "attachment", "enclosed", "enclosing"];
      const mentionsAttachment = attachmentKeywords.some((keyword) => bodyLower.includes(keyword));
      if (mentionsAttachment && attachments.length === 0) {
        warnings.push({
          type: "warning",
          message: "You mentioned an attachment but haven't attached any files",
        });
      }

      // Check for unfilled variables
      const unfilledVars = body.match(/\{\{[^}]+\}\}/g);
      if (unfilledVars && unfilledVars.length > 0) {
        warnings.push({
          type: "warning",
          message: `${unfilledVars.length} variable(s) will be replaced with actual values`,
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
          "bg-surface-default flex flex-col overflow-hidden rounded-xl border border-border-muted shadow-sm",
          className
        )}
      >
        {/* Header - Enhanced with better spacing and visual hierarchy */}
        <div className="flex items-center justify-between border-b border-border-muted bg-gradient-to-b from-background-subtle to-transparent px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="dark:bg-primary-900/30 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
              <EnvelopeSimple className="h-5 w-5 text-primary-600" weight="duotone" />
            </div>
            <div>
              <h3 className="text-foreground-default font-semibold">New Message</h3>
              {to.length > 0 && (
                <p className="text-xs text-foreground-muted">
                  To {to.length} recipient{to.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {templates.length > 0 && (
              <Button
                variant={showTemplates ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="gap-1.5"
              >
                <Sparkle className="h-4 w-4" weight={showTemplates ? "fill" : "regular"} />
                Templates
              </Button>
            )}
            <div className="mx-1 h-4 w-px bg-border-muted" />
            <Button
              variant={showPreview ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1.5 transition-all duration-150"
            >
              {showPreview ? (
                <>
                  <PencilSimple className="h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
            {onDiscard && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDiscard}
                className="h-8 w-8 transition-colors duration-150 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Template Gallery - Collapsible section */}
        {showTemplates && templates.length > 0 && (
          <div className="border-b border-border-muted bg-neutral-50/50 px-5 py-4 dark:bg-neutral-900/30">
            <TemplateGallery
              templates={templates}
              onSelect={handleTemplateSelect}
              selectedId={selectedTemplate}
            />
          </div>
        )}

        {showPreview ? (
          /* Preview Mode - Enhanced with better visual hierarchy */
          <div className="flex-1 space-y-6 overflow-auto p-6">
            {/* Recipients preview */}
            <div className="space-y-1">
              <Label className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
                Recipients
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {to.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 dark:bg-neutral-800"
                  >
                    <Avatar src={r.avatar} name={r.name} size="xs" />
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="text-xs text-foreground-muted">{r.email}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject preview */}
            <div className="space-y-1">
              <Label className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
                Subject
              </Label>
              <p className="text-foreground-default text-lg font-semibold">
                {subject || "(No subject)"}
              </p>
            </div>

            {/* Body preview */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
                Message
              </Label>
              <div
                className="prose prose-sm mt-3 max-w-none rounded-lg border border-border-muted bg-neutral-50 p-4 dark:bg-neutral-900/50"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(previewBody) }}
              />
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
                  Attachments ({attachments.length})
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {attachments.map((attachment) => (
                    <AttachmentCard
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={handleRemoveAttachment}
                      disabled={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode - Enhanced with better spacing */
          <>
            {/* Recipients Section */}
            <div className="space-y-3 border-b border-border-muted px-5 py-4">
              {/* To field */}
              <div className="flex items-start gap-3">
                <Label className="w-14 pt-2.5 text-right text-sm font-medium text-foreground-muted">
                  To
                </Label>
                <div className="flex-1">
                  <RecipientInput
                    value={to}
                    onChange={setTo}
                    suggestions={suggestedRecipients}
                    disabled={loading}
                  />
                </div>
                {allowCcBcc && !showCc && !showBcc && (
                  <div className="flex gap-1 pt-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCc(true)}
                      className="hover:text-foreground-default h-7 px-2 text-xs text-foreground-muted"
                    >
                      Cc
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBcc(true)}
                      className="hover:text-foreground-default h-7 px-2 text-xs text-foreground-muted"
                    >
                      Bcc
                    </Button>
                  </div>
                )}
              </div>

              {/* Cc field */}
              {showCc && (
                <div className="flex items-start gap-3">
                  <Label className="w-14 pt-2.5 text-right text-sm font-medium text-foreground-muted">
                    Cc
                  </Label>
                  <div className="flex-1">
                    <RecipientInput
                      value={cc}
                      onChange={setCc}
                      suggestions={suggestedRecipients}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCc(false);
                      setCc([]);
                    }}
                    className="h-8 w-8 text-foreground-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Bcc field */}
              {showBcc && (
                <div className="flex items-start gap-3">
                  <Label className="w-14 pt-2.5 text-right text-sm font-medium text-foreground-muted">
                    Bcc
                  </Label>
                  <div className="flex-1">
                    <RecipientInput
                      value={bcc}
                      onChange={setBcc}
                      suggestions={suggestedRecipients}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowBcc(false);
                      setBcc([]);
                    }}
                    className="h-8 w-8 text-foreground-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Subject Field - Separate section for visual hierarchy */}
            <div className="border-b border-border-muted px-5 py-3">
              <div className="flex items-center gap-3">
                <Label className="w-14 text-right text-sm font-medium text-foreground-muted">
                  Subject
                </Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this email about?"
                  disabled={loading}
                  className="placeholder:text-foreground-muted/60 flex-1 border-0 bg-transparent px-0 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Body Editor */}
            <div className="flex min-h-0 flex-1 flex-col">
              <RichTextEditor
                content={body}
                onChange={setBody}
                placeholder="Write your message..."
                className="flex-1 rounded-none border-0"
                minHeight="200px"
              >
                {/* Toolbar with better spacing */}
                <div className="flex items-center justify-between gap-3 bg-neutral-50/50 px-5 py-3 dark:bg-neutral-900/30">
                  <RichTextToolbar />
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <div className="h-4 w-px bg-border-muted" />
                    <VariableInserter
                      variables={variables}
                      onInsert={handleInsertVariable}
                      disabled={loading}
                    />
                    {showAiSuggestions && (
                      <Button variant="ghost" size="sm" disabled={loading} className="gap-1.5">
                        <MagicWand className="h-4 w-4" />
                        <span className="hidden sm:inline">AI Suggest</span>
                      </Button>
                    )}
                  </div>
                </div>
              </RichTextEditor>
            </div>

            {/* Attachments Section - Improved layout */}
            {attachments.length > 0 && (
              <div className="border-t border-border-muted bg-neutral-50/50 px-5 py-4 dark:bg-neutral-900/30">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700">
                      <Paperclip className="h-4 w-4 text-foreground-muted" />
                    </div>
                    <div>
                      <span className="text-foreground-default text-sm font-semibold">
                        {attachments.length}{" "}
                        {attachments.length === 1 ? "Attachment" : "Attachments"}
                      </span>
                      <span className="ml-2 text-xs text-foreground-muted">
                        ({formatFileSize(attachments.reduce((acc, a) => acc + a.size, 0))} total)
                      </span>
                    </div>
                  </div>
                  {allowAttachments && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById("email-attachments")?.click()}
                      disabled={loading}
                      className="gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add more
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        {/* Footer - Enhanced with better visual hierarchy */}
        <div className="flex items-center justify-between border-t border-border-muted bg-gradient-to-t from-background-subtle to-transparent px-5 py-4">
          {/* Left side actions */}
          <div className="flex items-center gap-3">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById("email-attachments")?.click()}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="hidden sm:inline">Attach</span>
                </Button>
              </>
            )}
            {onSaveDraft && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSaveDraft}
                disabled={loading}
                className="text-foreground-muted"
              >
                Save draft
              </Button>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {onSchedule && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" disabled={loading} className="gap-1.5">
                    <Timer className="h-4 w-4" />
                    <span className="hidden sm:inline">Schedule</span>
                    <CaretDown className="ml-0.5 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-xs font-medium text-foreground-muted">
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
            <Button
              onClick={handleSend}
              disabled={loading || to.length === 0}
              size="default"
              className="min-w-[100px] gap-2 shadow-sm transition-all duration-150 hover:shadow-md"
            >
              {loading ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <PaperPlaneTilt className="h-4 w-4" weight="fill" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
EmailComposer.displayName = "EmailComposer";

/* ============================================
   Quick Reply Component
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
        "bg-surface-default overflow-hidden rounded-xl border transition-all duration-200",
        isFocused
          ? "dark:ring-primary-900/30 border-primary-300 shadow-md ring-2 ring-primary-100"
          : "hover:border-border-default border-border-muted shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border-muted bg-gradient-to-b from-background-subtle to-transparent px-4 py-3">
        <div className="dark:bg-primary-900/30 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
          <ArrowBendUpLeft className="h-4 w-4 text-primary-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-muted">Reply to</span>
            <div className="flex items-center gap-1.5">
              <Avatar src={to.avatar} name={to.name} size="xs" />
              <span className="text-sm font-medium">{to.name}</span>
            </div>
          </div>
          {replyTo && (
            <p className="mt-0.5 truncate text-xs text-foreground-muted">Re: {replyTo.subject}</p>
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
        rows={4}
        className={cn(
          "w-full border-0 bg-transparent px-4 py-3 text-sm",
          "resize-none focus:outline-none",
          "placeholder:text-foreground-muted/60"
        )}
      />

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-border-muted bg-neutral-50/50 px-4 py-3 dark:bg-neutral-900/30">
        <div className="text-xs text-foreground-muted">
          {body.length > 0 && `${body.length} characters`}
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onSend(body)}
            disabled={!body.trim()}
            className="gap-1.5 shadow-sm"
          >
            <PaperPlaneTilt className="h-4 w-4" weight="fill" />
            Send Reply
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
