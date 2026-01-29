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
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-heading-sm font-semibold text-foreground">{title}</h2>
          {figmaUrl && (
            <a
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-caption text-foreground-muted hover:text-foreground-brand transition-colors"
            >
              <span>Figma</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        {description && (
          <p className="text-body-sm text-foreground-muted">{description}</p>
        )}
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

export function ComponentCard({
  id,
  title,
  description,
  children,
  className,
}: ComponentCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "bg-surface rounded-xl border border-border overflow-hidden scroll-mt-24",
        className
      )}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-border-muted">
          {title && (
            <h3 className="text-body-strong text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-caption text-foreground-muted mt-1">{description}</p>
          )}
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
        <div className="bg-background-success rounded-xl p-4">
          <h4 className="text-body-strong text-foreground-success mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-caption-sm">
              ✓
            </span>
            Do
          </h4>
          <ul className="space-y-2">
            {dos.map((item, i) => (
              <li key={i} className="text-caption text-foreground-success flex items-start gap-2">
                <span className="text-foreground-success mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {donts && donts.length > 0 && (
        <div className="bg-background-error rounded-xl p-4">
          <h4 className="text-body-strong text-foreground-error mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-caption-sm">
              ✕
            </span>
            Don't
          </h4>
          <ul className="space-y-2">
            {donts.map((item, i) => (
              <li key={i} className="text-caption text-foreground-error flex items-start gap-2">
                <span className="text-foreground-error mt-0.5">•</span>
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
    <div className={cn("bg-background-info rounded-xl p-4", className)}>
      <h4 className="text-body-strong text-foreground-info mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-caption-sm">
          ♿
        </span>
        Accessibility
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-caption text-foreground-info flex items-start gap-2">
            <span className="text-foreground-info mt-0.5">•</span>
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
    <div className={cn("bg-surface rounded-xl border border-border overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-border-muted">
        <h3 className="text-body-strong text-foreground">Component Anatomy</h3>
        <p className="text-caption text-foreground-muted mt-1">
          Understanding the parts that make up this component
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {parts.map((part, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background-brand-subtle text-foreground-brand font-semibold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{part.name}</span>
                  {part.required && (
                    <span className="text-caption-sm text-foreground-error font-medium">Required</span>
                  )}
                </div>
                <p className="text-caption text-foreground-muted mt-0.5">{part.description}</p>
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
      <h3 className="text-body-strong text-foreground mb-4">Related Components</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {components.map((comp, i) => (
          <a
            key={i}
            href={comp.href}
            className="group bg-surface rounded-xl border border-border p-4 hover:border-border-brand transition-colors"
          >
            <h4 className="font-medium text-foreground group-hover:text-foreground-brand transition-colors">
              {comp.name}
            </h4>
            <p className="text-caption text-foreground-muted mt-1">{comp.description}</p>
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

export function RealWorldExample({ title, description, children, className }: RealWorldExampleProps) {
  return (
    <div className={cn("bg-surface rounded-xl border border-border overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-border-muted bg-background-subtle">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-background-brand-subtle text-foreground-brand rounded text-caption-sm font-medium">
            Real-World Example
          </span>
        </div>
        <h3 className="text-body-strong text-foreground">{title}</h3>
        <p className="text-caption text-foreground-muted mt-1">{description}</p>
      </div>
      <div className="p-6 bg-background-muted">{children}</div>
    </div>
  );
}
