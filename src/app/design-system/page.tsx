"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { foundationsNav, componentsNav } from "@/lib/design-system-nav";
import {
  Lightbulb,
  MagnifyingGlass,
  Users,
  Heart,
  Book,
  Palette,
  Stack,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";

// Brand Logo Symbol
function LogoSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 149 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M133 0C141.837 0 149 7.16344 149 16V133C149 141.837 141.837 149 133 149H16C7.16344 149 4.02687e-08 141.837 0 133V16C0 7.16344 7.16344 4.02661e-08 16 0H133ZM98.1553 32C76.2113 32.0002 58.4219 49.7894 58.4219 71.7334V118.089H84.9111V78.3555C84.9112 67.3836 93.8055 58.4895 104.777 58.4893H128.783V32H98.1553ZM22 32V58.4893H53.7197C57.047 47.3098 64.4778 37.8975 74.2656 32H22Z"
        fill="currentColor"
      />
    </svg>
  );
}

const values = [
  {
    title: "Proactive Builders",
    description:
      "Creative problem solvers who drive change and leave things better than we found them.",
    icon: Lightbulb,
  },
  {
    title: "Relentlessly Curious",
    description:
      "We dig deep to understand the \"why\" and seek new ways to solve problems.",
    icon: MagnifyingGlass,
  },
  {
    title: "Community Activators",
    description:
      "Bringing people together and making collective forward progress.",
    icon: Users,
  },
  {
    title: "Compassionate Leaders",
    description:
      "Leading with empathy, humility, and integrity to empower our community.",
    icon: Heart,
  },
  {
    title: "Knowledge Seekers",
    description:
      "Approaching every situation as an opportunity to learn and grow.",
    icon: Book,
  },
];

const purposes = [
  "Create a seamless and familiar system for our customers.",
  "Solve problems in an organized and systematic way.",
  "Enable efficiency and consistency across design and development teams.",
  "Ensure usability and accessibility across Green Job Board experiences.",
  "Align teams on the what, why, and how of our design decisions.",
];

export default function DesignSystemPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex justify-center mb-6">
          <LogoSymbol className="w-16 h-16 text-[var(--primitive-green-700)]" />
        </div>
        <h1 className="text-heading-lg lg:text-display font-bold text-foreground mb-4">
          Trails Design System
        </h1>
        <p className="text-body-lg text-foreground-muted max-w-2xl mx-auto">
          Our design system uses cohesive interconnecting components that work
          together to solve problems in a way that meets and exceeds our
          customers&apos; goals and expectations.
        </p>
      </section>

      {/* Quick Links - Foundations & Components */}
      <section className="grid md:grid-cols-2 gap-6">
        <Link
          href="/design-system/foundations"
          className={cn(
            "group p-8 rounded-2xl border border-border-muted bg-background-subtle",
            "hover:border-[var(--primitive-green-400)] hover:shadow-lg transition-all duration-200"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-800)] flex items-center justify-center">
              <Palette
                className="w-6 h-6 text-[var(--primitive-green-700)]"
                weight="duotone"
              />
            </div>
            <div>
              <h2 className="text-heading-sm text-foreground group-hover:text-[var(--primitive-green-700)] transition-colors">
                Foundations
              </h2>
              <p className="text-body-sm text-foreground-muted">
                Colors, typography, spacing & more
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {foundationsNav.slice(0, 5).map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 text-caption bg-background-muted rounded-full text-foreground-muted"
              >
                {item.label}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-caption font-medium text-[var(--primitive-green-600)] group-hover:text-[var(--primitive-green-700)]">
            Explore foundations
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/design-system/components"
          className={cn(
            "group p-8 rounded-2xl border border-border-muted bg-background-subtle",
            "hover:border-[var(--primitive-blue-400)] hover:shadow-lg transition-all duration-200"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primitive-blue-100)] dark:bg-[var(--primitive-blue-900)] flex items-center justify-center">
              <Stack
                className="w-6 h-6 text-[var(--primitive-blue-600)]"
                weight="duotone"
              />
            </div>
            <div>
              <h2 className="text-heading-sm text-foreground group-hover:text-[var(--primitive-blue-600)] transition-colors">
                Components
              </h2>
              <p className="text-body-sm text-foreground-muted">
                {componentsNav.length}+ UI components
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {componentsNav.slice(0, 4).map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 text-caption bg-background-muted rounded-full text-foreground-muted"
              >
                {item.label}
              </span>
            ))}
            <span className="px-3 py-1 text-caption bg-background-muted rounded-full text-foreground-muted">
              +{componentsNav.length - 4} more
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-caption font-medium text-[var(--primitive-blue-500)] group-hover:text-[var(--primitive-blue-600)]">
            Browse components
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      {/* Featured Components Grid */}
      <section>
        <h2 className="text-heading-md text-foreground mb-6">
          Featured Components
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: "buttons",
              label: "Buttons",
              description: "Action triggers and CTAs",
              href: "/design-system/components/buttons",
              isNew: false,
            },
            {
              id: "input",
              label: "Input",
              description: "Text input fields",
              href: "/design-system/components/input",
              isNew: false,
            },
            {
              id: "kanban",
              label: "Kanban Board",
              description: "Drag-and-drop pipeline management",
              href: "/design-system/components/kanban",
              isNew: false,
            },
            {
              id: "data-table",
              label: "Data Table",
              description: "Sortable and filterable tables",
              href: "/design-system/components/data-table",
              isNew: false,
            },
            {
              id: "scheduler",
              label: "Scheduler",
              description: "Calendar and booking UI",
              href: "/design-system/components/scheduler",
              isNew: false,
            },
            {
              id: "date-picker",
              label: "Date Picker",
              description: "Date selection with calendar",
              href: "/design-system/components/date-picker",
              isNew: true,
            },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group p-6 rounded-xl border border-border-muted bg-background-subtle",
                "hover:border-[var(--primitive-green-300)] hover:bg-background transition-all duration-200"
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-body-strong font-medium text-foreground group-hover:text-[var(--primitive-green-700)] transition-colors">
                  {item.label}
                </h3>
                {item.isNew && (
                  <span className="px-2 py-0.5 text-caption-sm font-medium bg-[var(--primitive-green-100)] text-[var(--primitive-green-700)] rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-caption text-foreground-muted">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-heading-md text-foreground mb-6">
          Our Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="p-6 rounded-xl border border-border-muted bg-background-subtle"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-800)] flex items-center justify-center mb-4">
                  <Icon
                    className="w-5 h-5 text-[var(--primitive-green-700)]"
                    weight="duotone"
                  />
                </div>
                <h3 className="text-body-strong font-medium text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-caption text-foreground-muted">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Purpose */}
      <section className="p-8 rounded-2xl bg-[var(--primitive-green-800)]">
        <h2 className="text-heading-md text-[var(--primitive-blue-100)] mb-6">
          Purpose
        </h2>
        <ul className="space-y-3">
          {purposes.map((purpose) => (
            <li key={purpose} className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 text-[var(--primitive-green-400)] mt-0.5 shrink-0"
                weight="fill"
              />
              <span className="text-body text-[var(--primitive-blue-100)]">
                {purpose}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Components", value: `${componentsNav.length}+` },
          { label: "Foundations", value: foundationsNav.length.toString() },
          { label: "Design Tokens", value: "200+" },
          { label: "WCAG", value: "AA" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-background-subtle border border-border-muted text-center"
          >
            <div className="text-heading-sm text-foreground">
              {stat.value}
            </div>
            <div className="text-caption text-foreground-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
