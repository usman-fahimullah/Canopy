"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "@/components/Icons";

interface ComponentSectionProps {
  id: string;
  title: string;
  description?: string;
  figmaUrl?: string;
  children: React.ReactNode;
  className?: string;
}

export function ComponentSection({
  id,
  title,
  description,
  figmaUrl,
  children,
  className,
}: ComponentSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <h2 className="text-heading-sm font-semibold text-foreground">{title}</h2>
          {figmaUrl && (
            <a
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-caption text-foreground-muted transition-colors hover:text-foreground-brand"
            >
              <span>Figma</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {description && <p className="text-body-sm text-foreground-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

interface ComponentCardProps {
  id?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ComponentCard({ id, title, description, children, className }: ComponentCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-xl border border-border bg-surface",
        className
      )}
    >
      {(title || description) && (
        <div className="border-b border-border-muted px-6 py-4">
          {title && <h3 className="text-body-strong text-foreground">{title}</h3>}
          {description && <p className="mt-1 text-caption text-foreground-muted">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface UsageGuideProps {
  dos?: string[];
  donts?: string[];
  className?: string;
}

export function UsageGuide({ dos, donts, className }: UsageGuideProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {dos && dos.length > 0 && (
        <div className="rounded-xl bg-background-success p-4">
          <h4 className="mb-3 flex items-center gap-2 text-body-strong text-foreground-success">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-caption-sm text-white">
              ✓
            </span>
            Do
          </h4>
          <ul className="space-y-2">
            {dos.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-caption text-foreground-success">
                <span className="mt-0.5 text-foreground-success">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {donts && donts.length > 0 && (
        <div className="rounded-xl bg-background-error p-4">
          <h4 className="mb-3 flex items-center gap-2 text-body-strong text-foreground-error">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-caption-sm text-white">
              ✕
            </span>
            Don&apos;t
          </h4>
          <ul className="space-y-2">
            {donts.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-caption text-foreground-error">
                <span className="mt-0.5 text-foreground-error">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface AccessibilityInfoProps {
  items: string[];
  className?: string;
}

export function AccessibilityInfo({ items, className }: AccessibilityInfoProps) {
  return (
    <div className={cn("rounded-xl bg-background-info p-4", className)}>
      <h4 className="mb-3 flex items-center gap-2 text-body-strong text-foreground-info">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-caption-sm text-white">
          ♿
        </span>
        Accessibility
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-caption text-foreground-info">
            <span className="mt-0.5 text-foreground-info">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// COMPONENT ANATOMY
// ============================================

interface AnatomyPart {
  name: string;
  description: string;
  required?: boolean;
}

interface ComponentAnatomyProps {
  parts: AnatomyPart[];
  className?: string;
}

export function ComponentAnatomy({ parts, className }: ComponentAnatomyProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface", className)}>
      <div className="border-b border-border-muted px-6 py-4">
        <h3 className="text-body-strong text-foreground">Component Anatomy</h3>
        <p className="mt-1 text-caption text-foreground-muted">
          Understanding the parts that make up this component
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {parts.map((part, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-brand-subtle text-sm font-semibold text-foreground-brand">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{part.name}</span>
                  {part.required && (
                    <span className="text-caption-sm font-medium text-foreground-error">
                      Required
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-caption text-foreground-muted">{part.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// RELATED COMPONENTS
// ============================================

interface RelatedComponent {
  name: string;
  href: string;
  description: string;
}

interface RelatedComponentsProps {
  components: RelatedComponent[];
  className?: string;
}

export function RelatedComponents({ components, className }: RelatedComponentsProps) {
  return (
    <div className={cn("", className)}>
      <h3 className="mb-4 text-body-strong text-foreground">Related Components</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {components.map((comp, i) => (
          <a
            key={i}
            href={comp.href}
            className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-brand"
          >
            <h4 className="font-medium text-foreground transition-colors group-hover:text-foreground-brand">
              {comp.name}
            </h4>
            <p className="mt-1 text-caption text-foreground-muted">{comp.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================
// REAL WORLD EXAMPLE
// ============================================

interface RealWorldExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function RealWorldExample({
  title,
  description,
  children,
  className,
}: RealWorldExampleProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface", className)}>
      <div className="border-b border-border-muted bg-background-subtle px-6 py-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-background-brand-subtle px-2 py-0.5 text-caption-sm font-medium text-foreground-brand">
            Real-World Example
          </span>
        </div>
        <h3 className="text-body-strong text-foreground">{title}</h3>
        <p className="mt-1 text-caption text-foreground-muted">{description}</p>
      </div>
      <div className="bg-background-muted p-6">{children}</div>
    </div>
  );
}
