"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSpacer,
  ToolbarActions,
  ToolbarSeparator,
} from "./toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListBullet,
  ListNumbered,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  ChevronDown,
  Minus,
  Plus,
  Copy,
  Eye,
  Briefcase,
  Users,
  Star,
  CheckCircle,
  GraduationCap,
  Building,
  Clock,
} from "@/components/Icons";

/**
 * JobDescriptionToolbar - Specialized toolbar for ATS job description editing
 *
 * Features:
 * - Quick section insertion (About, Responsibilities, Requirements, Benefits, etc.)
 * - Variable/placeholder insertion for templates
 * - Focused formatting options for job content
 * - Preview toggle
 */

/* ============================================
   Section Templates
   ============================================ */
export interface JobSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  template: string;
}

export const defaultJobSections: JobSection[] = [
  {
    id: "about",
    label: "About the Company",
    icon: <Building weight="bold" />,
    template: `## About {{company_name}}

[Write a brief, compelling description of your company, culture, and mission.]`,
  },
  {
    id: "role",
    label: "About the Role",
    icon: <Briefcase weight="bold" />,
    template: `## About the Role

[Describe what this role does and why it matters to the organization.]`,
  },
  {
    id: "responsibilities",
    label: "Responsibilities",
    icon: <CheckCircle weight="bold" />,
    template: `## What You'll Do

- [Key responsibility 1]
- [Key responsibility 2]
- [Key responsibility 3]
- [Key responsibility 4]
- [Key responsibility 5]`,
  },
  {
    id: "requirements",
    label: "Requirements",
    icon: <Star weight="bold" />,
    template: `## What We're Looking For

**Required:**
- [X+ years of experience in...]
- [Required skill or qualification]
- [Required skill or qualification]

**Nice to Have:**
- [Preferred qualification]
- [Preferred qualification]`,
  },
  {
    id: "qualifications",
    label: "Qualifications",
    icon: <GraduationCap weight="bold" />,
    template: `## Qualifications

- Bachelor's degree in [field] or equivalent experience
- [X] years of experience in [area]
- Proficiency in [tools/technologies]`,
  },
  {
    id: "benefits",
    label: "Benefits & Perks",
    icon: <Star weight="bold" />,
    template: `## What We Offer

- Competitive salary and equity
- Health, dental, and vision insurance
- Flexible PTO policy
- Remote-friendly culture
- Professional development budget
- [Additional benefit]`,
  },
  {
    id: "team",
    label: "The Team",
    icon: <Users weight="bold" />,
    template: `## The Team

You'll be joining a team of [X] professionals who are passionate about [mission/goal]. We value [key team values] and believe in [team philosophy].`,
  },
  {
    id: "process",
    label: "Interview Process",
    icon: <Clock weight="bold" />,
    template: `## Our Interview Process

1. **Application Review** - We review your application
2. **Phone Screen** - 30-minute call with our recruiting team
3. **Technical Interview** - [Description of technical round]
4. **Team Interview** - Meet your potential teammates
5. **Offer** - We extend an offer to successful candidates`,
  },
];

/* ============================================
   Variable/Placeholder Templates
   ============================================ */
export interface TemplateVariable {
  id: string;
  label: string;
  placeholder: string;
  description?: string;
}

export const defaultVariables: TemplateVariable[] = [
  { id: "company_name", label: "Company Name", placeholder: "{{company_name}}", description: "Your organization's name" },
  { id: "job_title", label: "Job Title", placeholder: "{{job_title}}", description: "The position title" },
  { id: "location", label: "Location", placeholder: "{{location}}", description: "Job location or Remote" },
  { id: "department", label: "Department", placeholder: "{{department}}", description: "Team or department name" },
  { id: "salary_range", label: "Salary Range", placeholder: "{{salary_range}}", description: "Compensation range" },
  { id: "employment_type", label: "Employment Type", placeholder: "{{employment_type}}", description: "Full-time, Part-time, Contract" },
  { id: "start_date", label: "Start Date", placeholder: "{{start_date}}", description: "Expected start date" },
  { id: "hiring_manager", label: "Hiring Manager", placeholder: "{{hiring_manager}}", description: "Manager's name" },
  { id: "apply_url", label: "Apply Link", placeholder: "{{apply_url}}", description: "Application URL" },
];

/* ============================================
   Component Props
   ============================================ */
interface JobDescriptionToolbarProps {
  /** Current heading level (paragraph, h1, h2, h3) */
  headingLevel?: "paragraph" | "h1" | "h2" | "h3";
  onHeadingChange?: (level: "paragraph" | "h1" | "h2" | "h3") => void;

  /** Text formatting state */
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  onBoldChange?: (value: boolean) => void;
  onItalicChange?: (value: boolean) => void;
  onUnderlineChange?: (value: boolean) => void;

  /** Alignment state */
  alignment?: "left" | "center" | "right";
  onAlignmentChange?: (value: "left" | "center" | "right") => void;

  /** List state */
  listType?: "none" | "bullet" | "numbered";
  onListChange?: (value: "none" | "bullet" | "numbered") => void;

  /** Insert actions */
  onInsertLink?: () => void;
  onInsertSection?: (section: JobSection) => void;
  onInsertVariable?: (variable: TemplateVariable) => void;

  /** Undo/Redo */
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;

  /** Preview */
  isPreview?: boolean;
  onPreviewToggle?: () => void;

  /** Copy to clipboard */
  onCopy?: () => void;

  /** Custom sections and variables */
  sections?: JobSection[];
  variables?: TemplateVariable[];

  /** Disabled state */
  disabled?: boolean;

  className?: string;
}

const headingLabels = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
};

const HeadingIcon = ({ level }: { level: "paragraph" | "h1" | "h2" | "h3" }) => {
  switch (level) {
    case "h1":
      return <Heading1 weight="bold" />;
    case "h2":
      return <Heading2 weight="bold" />;
    case "h3":
      return <Heading3 weight="bold" />;
    default:
      return <span className="text-sm font-medium">¶</span>;
  }
};

export function JobDescriptionToolbar({
  headingLevel = "paragraph",
  onHeadingChange,
  isBold = false,
  isItalic = false,
  isUnderline = false,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  alignment = "left",
  onAlignmentChange,
  listType = "none",
  onListChange,
  onInsertLink,
  onInsertSection,
  onInsertVariable,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  isPreview = false,
  onPreviewToggle,
  onCopy,
  sections = defaultJobSections,
  variables = defaultVariables,
  disabled = false,
  className,
}: JobDescriptionToolbarProps) {
  return (
    <Toolbar
      disabled={disabled}
      aria-label="Job description editor"
      className={cn("flex-wrap", className)}
    >
      <ToolbarSection>
        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm",
                "text-[var(--primitive-neutral-600)]",
                "hover:bg-[var(--primitive-neutral-100)] hover:text-[var(--primitive-green-900)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)]",
                "transition-colors duration-150",
                disabled && "opacity-50 pointer-events-none"
              )}
            >
              <HeadingIcon level={headingLevel} />
              <span className="hidden sm:inline">{headingLabels[headingLevel]}</span>
              <ChevronDown weight="bold" className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onHeadingChange?.("paragraph")}>
              <span className="w-6 text-center mr-2">¶</span>
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onHeadingChange?.("h1")}>
              <Heading1 weight="bold" className="w-6 h-6 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onHeadingChange?.("h2")}>
              <Heading2 weight="bold" className="w-6 h-6 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onHeadingChange?.("h3")}>
              <Heading3 weight="bold" className="w-6 h-6 mr-2" />
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarSeparator />

        {/* Text Formatting */}
        <ToolbarGroup variant="plain" aria-label="Text formatting">
          <ToolbarButton
            selected={isBold}
            onClick={() => onBoldChange?.(!isBold)}
            tooltip="Bold"
            shortcut="⌘B"
          >
            <Bold weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            selected={isItalic}
            onClick={() => onItalicChange?.(!isItalic)}
            tooltip="Italic"
            shortcut="⌘I"
          >
            <Italic weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            selected={isUnderline}
            onClick={() => onUnderlineChange?.(!isUnderline)}
            tooltip="Underline"
            shortcut="⌘U"
          >
            <Underline weight="bold" />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Alignment */}
        <ToolbarToggleGroup
          value={alignment}
          onValueChange={(v) => onAlignmentChange?.(v as "left" | "center" | "right")}
          aria-label="Text alignment"
        >
          <ToolbarToggleItem value="left" tooltip="Align left">
            <AlignLeft weight="bold" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="center" tooltip="Align center">
            <AlignCenter weight="bold" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="right" tooltip="Align right">
            <AlignRight weight="bold" />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>

        {/* Lists */}
        <ToolbarToggleGroup
          value={listType}
          onValueChange={(v) => onListChange?.(v as "none" | "bullet" | "numbered")}
          allowDeselect
          aria-label="List type"
        >
          <ToolbarToggleItem value="none" tooltip="No list">
            <Minus weight="bold" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="bullet" tooltip="Bullet list">
            <ListBullet weight="bold" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="numbered" tooltip="Numbered list">
            <ListNumbered weight="bold" />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>

        {/* Link */}
        <ToolbarButton
          onClick={onInsertLink}
          tooltip="Insert link"
          shortcut="⌘K"
        >
          <Link weight="bold" />
        </ToolbarButton>
      </ToolbarSection>

      <ToolbarSpacer />

      {/* Insert Section Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
              "bg-[var(--primitive-green-50)] text-[var(--primitive-green-700)]",
              "hover:bg-[var(--primitive-green-100)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)]",
              "transition-colors duration-150",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <Plus weight="bold" className="w-4 h-4" />
            <span className="hidden sm:inline">Add Section</span>
            <ChevronDown weight="bold" className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Insert Section</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => onInsertSection?.(section)}
            >
              {section.icon && (
                <span className="w-5 h-5 mr-2 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                  {section.icon}
                </span>
              )}
              {section.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Insert Variable Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm",
              "text-[var(--primitive-neutral-600)]",
              "hover:bg-[var(--primitive-neutral-100)] hover:text-[var(--primitive-green-900)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)]",
              "transition-colors duration-150",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <span className="font-mono text-xs">{"{{}}"}</span>
            <span className="hidden sm:inline">Variable</span>
            <ChevronDown weight="bold" className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Insert Variable</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {variables.map((variable) => (
            <DropdownMenuItem
              key={variable.id}
              onClick={() => onInsertVariable?.(variable)}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="font-medium">{variable.label}</span>
              <span className="text-xs text-foreground-muted font-mono">
                {variable.placeholder}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarSeparator />

      {/* Actions */}
      <ToolbarActions>
        <ToolbarButton
          onClick={onUndo}
          disabled={!canUndo}
          tooltip="Undo"
          shortcut="⌘Z"
        >
          <Undo weight="bold" />
        </ToolbarButton>
        <ToolbarButton
          onClick={onRedo}
          disabled={!canRedo}
          tooltip="Redo"
          shortcut="⌘⇧Z"
        >
          <Redo weight="bold" />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton
          onClick={onCopy}
          tooltip="Copy to clipboard"
        >
          <Copy weight="bold" />
        </ToolbarButton>
        <ToolbarButton
          selected={isPreview}
          onClick={onPreviewToggle}
          tooltip={isPreview ? "Edit mode" : "Preview"}
        >
          <Eye weight="bold" />
        </ToolbarButton>
      </ToolbarActions>
    </Toolbar>
  );
}

/* ============================================
   Compact Variant for smaller screens/spaces
   ============================================ */
export function JobDescriptionToolbarCompact({
  isBold = false,
  isItalic = false,
  onBoldChange,
  onItalicChange,
  listType = "none",
  onListChange,
  onInsertLink,
  onInsertSection,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  sections = defaultJobSections,
  disabled = false,
  className,
}: Omit<JobDescriptionToolbarProps, "headingLevel" | "onHeadingChange" | "alignment" | "onAlignmentChange" | "isUnderline" | "onUnderlineChange" | "onInsertVariable" | "variables" | "isPreview" | "onPreviewToggle" | "onCopy">) {
  return (
    <Toolbar
      disabled={disabled}
      aria-label="Job description editor"
      className={className}
    >
      <ToolbarSection>
        {/* Text Formatting */}
        <ToolbarGroup variant="plain" aria-label="Text formatting">
          <ToolbarButton
            selected={isBold}
            onClick={() => onBoldChange?.(!isBold)}
            tooltip="Bold"
            shortcut="⌘B"
          >
            <Bold weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            selected={isItalic}
            onClick={() => onItalicChange?.(!isItalic)}
            tooltip="Italic"
            shortcut="⌘I"
          >
            <Italic weight="bold" />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Lists */}
        <ToolbarToggleGroup
          value={listType}
          onValueChange={(v) => onListChange?.(v as "none" | "bullet" | "numbered")}
          allowDeselect
          aria-label="List type"
        >
          <ToolbarToggleItem value="bullet" tooltip="Bullet list">
            <ListBullet weight="bold" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="numbered" tooltip="Numbered list">
            <ListNumbered weight="bold" />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>

        {/* Link */}
        <ToolbarButton onClick={onInsertLink} tooltip="Insert link">
          <Link weight="bold" />
        </ToolbarButton>
      </ToolbarSection>

      <ToolbarSpacer />

      {/* Quick Section Insert */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-sm",
              "bg-[var(--primitive-green-50)] text-[var(--primitive-green-700)]",
              "hover:bg-[var(--primitive-green-100)]",
              "transition-colors duration-150",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <Plus weight="bold" className="w-4 h-4" />
            <ChevronDown weight="bold" className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sections.slice(0, 5).map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => onInsertSection?.(section)}
            >
              {section.icon && (
                <span className="w-4 h-4 mr-2 [&>svg]:w-4 [&>svg]:h-4">
                  {section.icon}
                </span>
              )}
              {section.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Undo/Redo */}
      <ToolbarActions>
        <ToolbarButton onClick={onUndo} disabled={!canUndo} tooltip="Undo">
          <Undo weight="bold" />
        </ToolbarButton>
        <ToolbarButton onClick={onRedo} disabled={!canRedo} tooltip="Redo">
          <Redo weight="bold" />
        </ToolbarButton>
      </ToolbarActions>
    </Toolbar>
  );
}

export { type JobDescriptionToolbarProps };
