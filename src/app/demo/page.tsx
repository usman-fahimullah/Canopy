"use client";

import Link from "next/link";
import {
  Briefcase,
  Kanban,
  UserCircle,
  Calendar,
  Highlighter,
  TextAa,
  ArrowLeft,
  Nut,
} from "@phosphor-icons/react";

const demos = [
  {
    title: "Manage Roles",
    description:
      "Full role management page with Job Post, Apply Form, and Candidates tabs. Includes form builder, question types, and modals.",
    href: "/roles/demo",
    icon: Nut,
    color: "blue",
    tags: ["Full Page", "ATS"],
  },
  {
    title: "Job Form Builder",
    description:
      "Complete job posting form with role information, education requirements, workplace details, and compensation sections.",
    href: "/demo/job-form",
    icon: Briefcase,
    color: "green",
    tags: ["Forms", "ATS"],
  },
  {
    title: "Kanban Pipeline",
    description:
      "Drag-and-drop candidate pipeline with custom ATS components including candidate cards, stage badges, and activity indicators.",
    href: "/demo/kanban-dnd",
    icon: Kanban,
    color: "blue",
    tags: ["Drag & Drop", "ATS"],
  },
  {
    title: "Avatar Badges",
    description:
      "Avatar component variations with different badge types including success, critical, favorite, and BIPOC indicators.",
    href: "/demo/avatar-badges",
    icon: UserCircle,
    color: "purple",
    tags: ["Components"],
  },
  {
    title: "Interview Scheduling",
    description:
      "Full-screen interview scheduling modal with attendee management, timezone handling, and calendar integration.",
    href: "/demo/interview-scheduling",
    icon: Calendar,
    color: "orange",
    tags: ["Modal", "Scheduling"],
  },
  {
    title: "Highlight Comparison",
    description:
      "Compare different highlight color options for the rich text editor - neutral warm vs light blue.",
    href: "/demo/highlight-comparison",
    icon: Highlighter,
    color: "yellow",
    tags: ["Editor", "Design Decision"],
  },
  {
    title: "Selection Comparison",
    description:
      "Compare text selection highlight colors across different styling approaches.",
    href: "/demo/selection-comparison",
    icon: TextAa,
    color: "neutral",
    tags: ["Editor", "Design Decision"],
  },
];

const colorMap = {
  green: {
    bg: "bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-900)]/30",
    icon: "text-[var(--primitive-green-600)]",
    hover: "hover:border-[var(--primitive-green-500)]",
    tag: "bg-[var(--primitive-green-100)] text-[var(--primitive-green-700)] dark:bg-[var(--primitive-green-900)]/40 dark:text-[var(--primitive-green-400)]",
  },
  blue: {
    bg: "bg-[var(--primitive-blue-100)] dark:bg-[var(--primitive-blue-900)]/30",
    icon: "text-[var(--primitive-blue-600)]",
    hover: "hover:border-[var(--primitive-blue-500)]",
    tag: "bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)] dark:bg-[var(--primitive-blue-900)]/40 dark:text-[var(--primitive-blue-400)]",
  },
  purple: {
    bg: "bg-[var(--primitive-purple-100)] dark:bg-[var(--primitive-purple-900)]/30",
    icon: "text-[var(--primitive-purple-600)]",
    hover: "hover:border-[var(--primitive-purple-500)]",
    tag: "bg-[var(--primitive-purple-100)] text-[var(--primitive-purple-700)] dark:bg-[var(--primitive-purple-900)]/40 dark:text-[var(--primitive-purple-400)]",
  },
  orange: {
    bg: "bg-[var(--primitive-orange-100)] dark:bg-[var(--primitive-orange-900)]/30",
    icon: "text-[var(--primitive-orange-600)]",
    hover: "hover:border-[var(--primitive-orange-500)]",
    tag: "bg-[var(--primitive-orange-100)] text-[var(--primitive-orange-700)] dark:bg-[var(--primitive-orange-900)]/40 dark:text-[var(--primitive-orange-400)]",
  },
  yellow: {
    bg: "bg-[var(--primitive-yellow-100)] dark:bg-[var(--primitive-yellow-900)]/30",
    icon: "text-[var(--primitive-yellow-600)]",
    hover: "hover:border-[var(--primitive-yellow-500)]",
    tag: "bg-[var(--primitive-yellow-100)] text-[var(--primitive-yellow-700)] dark:bg-[var(--primitive-yellow-900)]/40 dark:text-[var(--primitive-yellow-400)]",
  },
  neutral: {
    bg: "bg-[var(--primitive-neutral-200)] dark:bg-[var(--primitive-neutral-700)]/30",
    icon: "text-[var(--primitive-neutral-600)]",
    hover: "hover:border-[var(--primitive-neutral-500)]",
    tag: "bg-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-700)] dark:bg-[var(--primitive-neutral-700)]/40 dark:text-[var(--primitive-neutral-400)]",
  },
};

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] dark:bg-[var(--primitive-neutral-900)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--primitive-neutral-200)] dark:border-[var(--primitive-neutral-700)] bg-[var(--primitive-neutral-100)]/95 dark:bg-[var(--primitive-neutral-900)]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-body-sm">Back to Home</span>
          </Link>
          <Link
            href="/design-system"
            className="text-body-sm text-[var(--primitive-green-600)] hover:text-[var(--primitive-green-700)] transition-colors"
          >
            View Design System →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-heading-lg font-bold text-foreground mb-2">
            Demo Gallery
          </h1>
          <p className="text-body text-foreground-muted max-w-2xl">
            Interactive demonstrations of Canopy ATS components and features.
            Click on any demo to explore it in detail.
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => {
            const colors = colorMap[demo.color as keyof typeof colorMap];
            const Icon = demo.icon;

            return (
              <Link
                key={demo.href}
                href={demo.href}
                className={`group p-6 rounded-xl border border-[var(--primitive-neutral-200)] dark:border-[var(--primitive-neutral-700)] bg-white dark:bg-[var(--primitive-neutral-800)] ${colors.hover} hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${colors.icon}`} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-heading-sm font-semibold text-foreground group-hover:text-[var(--primitive-green-600)] transition-colors truncate">
                      {demo.title}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {demo.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-caption-sm px-2 py-0.5 rounded-full ${colors.tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-body-sm text-foreground-muted line-clamp-3">
                  {demo.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 rounded-xl border border-dashed border-[var(--primitive-neutral-300)] dark:border-[var(--primitive-neutral-600)] bg-[var(--primitive-neutral-100)]/50 dark:bg-[var(--primitive-neutral-800)]/20">
          <p className="text-body-sm text-foreground-muted text-center">
            More demos coming soon. Check the{" "}
            <Link
              href="/design-system/components"
              className="text-[var(--primitive-green-600)] hover:underline"
            >
              component library
            </Link>{" "}
            for individual component documentation.
          </p>
        </div>
      </main>
    </div>
  );
}
