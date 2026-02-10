"use client";

import { useState, useMemo } from "react";
import { Modal, ModalContent, ModalBody, ModalClose } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  X,
  MagnifyingGlass,
  Target,
  Check,
  Clock,
  Users,
  CaretRight,
  Funnel,
} from "@phosphor-icons/react";
import { GOAL_CATEGORIES, type GoalCategoryKey } from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

type ExperienceLevel = "entry" | "mid" | "senior" | "switcher";
type Difficulty = "easy" | "medium" | "hard";

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: GoalCategoryKey;
  experienceLevels: ExperienceLevel[];
  difficulty: Difficulty;
  estimatedDays: string;
  tasks: string[];
  popularity: number;
}

interface BrowseTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: GoalTemplate) => void;
}

// =============================================================================
// DATA - Extended templates
// =============================================================================

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  entry: "Entry Level",
  mid: "Mid Career",
  senior: "Senior",
  switcher: "Career Switcher",
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; bg: string; text: string }> = {
  easy: {
    label: "Easy",
    bg: "bg-[var(--primitive-green-100)]",
    text: "text-[var(--primitive-green-700)]",
  },
  medium: {
    label: "Medium",
    bg: "bg-[var(--primitive-orange-100)]",
    text: "text-[var(--primitive-orange-700)]",
  },
  hard: {
    label: "Hard",
    bg: "bg-[var(--primitive-red-100)]",
    text: "text-[var(--primitive-red-700)]",
  },
};

const TEMPLATES: GoalTemplate[] = [
  {
    id: "networking-expand",
    title: "Expand Professional Network",
    description: "Connect with industry professionals to explore opportunities",
    category: "NETWORKING",
    experienceLevels: ["entry", "mid", "switcher"],
    difficulty: "easy",
    estimatedDays: "2-3 weeks",
    tasks: [
      "Optimize your LinkedIn headline and summary",
      "Reach out to 5 professionals in your target role",
      "Schedule 2 informational interviews",
      "Attend 1 industry networking event",
      "Follow up with new connections within 48 hours",
    ],
    popularity: 89,
  },
  {
    id: "interview-prep-technical",
    title: "Ace Technical Interviews",
    description: "Systematic preparation for technical interview rounds",
    category: "INTERVIEWING",
    experienceLevels: ["entry", "mid"],
    difficulty: "hard",
    estimatedDays: "4-6 weeks",
    tasks: [
      "Review fundamentals of your technical domain",
      "Practice common technical questions daily",
      "Complete 3 mock interviews with peers",
      "Prepare 5 STAR stories for behavioral questions",
      "Research company tech stacks before interviews",
    ],
    popularity: 94,
  },
  {
    id: "interview-prep-behavioral",
    title: "Prepare for Behavioral Interviews",
    description: "Build confidence with STAR method and storytelling",
    category: "INTERVIEWING",
    experienceLevels: ["entry", "mid", "senior", "switcher"],
    difficulty: "medium",
    estimatedDays: "1-2 weeks",
    tasks: [
      "Identify 8-10 key career stories",
      "Structure each story using STAR method",
      "Practice responses out loud",
      "Prepare thoughtful questions for interviewers",
      "Do a mock interview with a friend",
    ],
    popularity: 91,
  },
  {
    id: "salary-research",
    title: "Research Salary Expectations",
    description: "Understand market rates and prepare for negotiations",
    category: "COMPENSATION",
    experienceLevels: ["mid", "senior"],
    difficulty: "medium",
    estimatedDays: "1-2 weeks",
    tasks: [
      "Research salaries on Glassdoor and Levels.fyi",
      "Talk to 2 people in similar roles about comp",
      "Document your unique value propositions",
      "Practice negotiation scripts out loud",
      "Determine your walk-away number",
    ],
    popularity: 82,
  },
  {
    id: "job-search-organize",
    title: "Organize Your Job Search",
    description: "Create a structured approach to finding opportunities",
    category: "ORGANIZATION",
    experienceLevels: ["entry", "mid", "senior", "switcher"],
    difficulty: "easy",
    estimatedDays: "1 week",
    tasks: [
      "Set up a job tracking spreadsheet or tool",
      "Create a list of 20 target companies",
      "Set daily/weekly application goals",
      "Schedule dedicated job search time blocks",
    ],
    popularity: 87,
  },
  {
    id: "resume-refresh",
    title: "Refresh Your Resume",
    description: "Update and optimize for ATS and human readers",
    category: "ORGANIZATION",
    experienceLevels: ["entry", "mid", "senior", "switcher"],
    difficulty: "medium",
    estimatedDays: "3-5 days",
    tasks: [
      "Audit current resume for outdated information",
      "Quantify achievements with specific metrics",
      "Tailor summary to your target role",
      "Run through an ATS checker tool",
      "Get feedback from 2 people in your field",
    ],
    popularity: 94,
  },
  {
    id: "career-transition",
    title: "Career Transition Roadmap",
    description: "Navigate your switch to a new field or role",
    category: "NETWORKING",
    experienceLevels: ["switcher"],
    difficulty: "hard",
    estimatedDays: "6-8 weeks",
    tasks: [
      "Identify transferable skills from current role",
      "Research 3 target roles and their requirements",
      "Enroll in one relevant course or certification",
      "Rewrite resume highlighting transferable skills",
      "Connect with 3 people who made similar transitions",
    ],
    popularity: 76,
  },
  {
    id: "wellness-plan",
    title: "Job Search Wellness Plan",
    description: "Maintain mental health during your search",
    category: "ORGANIZATION",
    experienceLevels: ["entry", "mid", "senior", "switcher"],
    difficulty: "easy",
    estimatedDays: "Ongoing",
    tasks: [
      "Set boundaries: max 4 hours of job search daily",
      "Schedule daily exercise or outdoor time",
      "Connect with a friend or support group weekly",
      "Practice rejection resilience techniques",
      "Celebrate small wins each week",
    ],
    popularity: 65,
  },
];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: GoalCategoryKey | null;
  onSelect: (cat: GoalCategoryKey | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-3 py-1.5 text-caption font-medium transition-colors",
          selected === null
            ? "bg-[var(--background-brand)] text-white"
            : "bg-[var(--background-muted)] text-[var(--foreground-muted)] hover:bg-[var(--background-interactive-hover)]"
        )}
      >
        All
      </button>
      {(Object.keys(GOAL_CATEGORIES) as GoalCategoryKey[]).map((key) => {
        const cat = GOAL_CATEGORIES[key];
        const Icon = cat.icon;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-caption font-medium transition-colors",
              selected === key
                ? "bg-[var(--background-brand)] text-white"
                : "bg-[var(--background-muted)] text-[var(--foreground-muted)] hover:bg-[var(--background-interactive-hover)]"
            )}
          >
            <Icon size={14} weight={selected === key ? "fill" : "regular"} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: GoalTemplate; onSelect: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const cat = GOAL_CATEGORIES[template.category];
  const IconComponent = cat.icon;
  const difficulty = DIFFICULTY_CONFIG[template.difficulty];

  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        "border-[var(--border-muted)] bg-[var(--background-default)]",
        "hover:border-[var(--border-brand)] hover:shadow-card"
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", cat.bg)}>
              <IconComponent size={16} weight="fill" className={cat.text} />
            </div>
            <span className="text-caption text-[var(--foreground-muted)]">{cat.label}</span>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-caption-sm font-medium",
              difficulty.bg,
              difficulty.text
            )}
          >
            {difficulty.label}
          </span>
        </div>

        {/* Title & Description */}
        <h4 className="mb-1 text-body-strong text-[var(--foreground-default)]">{template.title}</h4>
        <p className="mb-3 text-caption text-[var(--foreground-muted)]">{template.description}</p>

        {/* Meta info */}
        <div className="mb-3 flex items-center gap-4 text-caption text-[var(--foreground-subtle)]">
          <span className="flex items-center gap-1">
            <Check size={14} />
            {template.tasks.length} tasks
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {template.estimatedDays}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {template.popularity}% use this
          </span>
        </div>

        {/* Expandable tasks */}
        {expanded && (
          <div className="mb-3 rounded-lg bg-[var(--background-subtle)] p-3">
            <p className="mb-2 text-caption-strong text-[var(--foreground-muted)]">
              Tasks included:
            </p>
            <ul className="space-y-1">
              {template.tasks.map((task, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-caption text-[var(--foreground-default)]"
                >
                  <span className="mt-0.5 text-[var(--foreground-subtle)]">○</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex-1"
          >
            {expanded ? "Hide Tasks" : "Preview Tasks"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSelect}
            className="flex-1"
            rightIcon={<CaretRight size={14} />}
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function BrowseTemplatesModal({
  open,
  onOpenChange,
  onSelectTemplate,
}: BrowseTemplatesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GoalCategoryKey | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | null>(null);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesSearch =
        !searchQuery ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || template.category === selectedCategory;

      const matchesExperience =
        !selectedExperience || template.experienceLevels.includes(selectedExperience);

      return matchesSearch && matchesCategory && matchesExperience;
    });
  }, [searchQuery, selectedCategory, selectedExperience]);

  const handleClose = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedExperience(null);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent size="xl" className="max-h-[90vh]">
        <ModalBody className="p-0">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-[var(--border-muted)] bg-[var(--background-default)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ModalClose asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Close">
                    <X size={18} />
                  </Button>
                </ModalClose>
                <div className="flex items-center gap-2">
                  <Target size={20} weight="fill" className="text-[var(--foreground-brand)]" />
                  <span className="text-body-strong text-[var(--foreground-default)]">
                    Goal Templates
                  </span>
                </div>
              </div>
              <span className="text-caption text-[var(--foreground-muted)]">
                {filteredTemplates.length} templates
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <MagnifyingGlass
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>

            {/* Category filters */}
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

            {/* Experience filter */}
            <div className="mt-3 flex items-center gap-2">
              <Funnel size={14} className="text-[var(--foreground-subtle)]" />
              <span className="text-caption text-[var(--foreground-muted)]">Experience:</span>
              <div className="flex gap-1">
                {(Object.keys(EXPERIENCE_LABELS) as ExperienceLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setSelectedExperience(selectedExperience === level ? null : level)
                    }
                    className={cn(
                      "rounded-full px-2 py-0.5 text-caption transition-colors",
                      selectedExperience === level
                        ? "bg-[var(--background-brand)] text-white"
                        : "bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:bg-[var(--background-interactive-hover)]"
                    )}
                  >
                    {EXPERIENCE_LABELS[level]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template grid */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => {
                      onSelectTemplate(template);
                      handleClose();
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MagnifyingGlass size={32} weight="light" />}
                title="No templates found"
                description="Try adjusting your filters or search query"
                size="sm"
                action={{
                  label: "Clear filters",
                  onClick: () => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedExperience(null);
                  },
                }}
              />
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
