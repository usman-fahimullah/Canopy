"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

export default function TypographyPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Typography</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Type scale based on DM Sans font family. Each size includes specific line-height and
          font-weight for optimal readability.
        </p>
      </div>

      {/* Type Scale */}
      <ComponentCard
        id="typography-scale"
        title="Type Scale"
        description="Complete typography scale with CSS class names and specifications."
      >
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-display
              </code>
              <span className="text-caption-sm text-foreground-muted">72px / 72px • Medium (500)</span>
            </div>
            <p className="text-display text-foreground">Climate Jobs</p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-heading-lg
              </code>
              <span className="text-caption-sm text-foreground-muted">48px / 48px • Medium (500)</span>
            </div>
            <p className="text-heading-lg text-foreground">Find Green Careers</p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-heading-md
              </code>
              <span className="text-caption-sm text-foreground-muted">36px / 48px • Medium (500)</span>
            </div>
            <p className="text-heading-md text-foreground">Sustainable Future</p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-heading-sm
              </code>
              <span className="text-caption-sm text-foreground-muted">24px / 32px • Medium (500)</span>
            </div>
            <p className="text-heading-sm text-foreground">Join the Movement</p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-body-strong
              </code>
              <span className="text-caption-sm text-foreground-muted">18px / 24px • Bold (700)</span>
            </div>
            <p className="text-body-strong text-foreground">
              Connect with climate-focused employers.
            </p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-body
              </code>
              <span className="text-caption-sm text-foreground-muted">18px / 24px • Regular (400)</span>
            </div>
            <p className="text-body text-foreground">
              Our platform connects passionate professionals.
            </p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-body-sm
              </code>
              <span className="text-caption-sm text-foreground-muted">16px / 24px • Regular (400)</span>
            </div>
            <p className="text-body-sm text-foreground">
              Smaller body text for dense content areas.
            </p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-caption-strong
              </code>
              <span className="text-caption-sm text-foreground-muted">14px / 20px • Bold (700)</span>
            </div>
            <p className="text-caption-strong text-foreground">Posted 2 days ago</p>
          </div>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-caption
              </code>
              <span className="text-caption-sm text-foreground-muted">14px / 20px • Regular (400)</span>
            </div>
            <p className="text-caption text-foreground">Posted 2 days ago</p>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <code className="text-caption font-mono bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                text-caption-sm
              </code>
              <span className="text-caption-sm text-foreground-muted">12px / 16px • Regular (400)</span>
            </div>
            <p className="text-caption-sm text-foreground">Smallest text for metadata</p>
          </div>
        </div>
      </ComponentCard>

      {/* Font Weights */}
      <ComponentCard
        id="typography-weights"
        title="Font Weights"
        description="Available font weights for text styling."
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <code className="text-caption font-mono bg-background-muted px-2 py-1 rounded w-28 text-center">
              font-normal
            </code>
            <span className="text-caption text-foreground-muted w-12">400</span>
            <span className="text-body font-normal text-foreground">Regular weight for body text</span>
          </div>
          <div className="flex items-center gap-4">
            <code className="text-caption font-mono bg-background-muted px-2 py-1 rounded w-28 text-center">
              font-medium
            </code>
            <span className="text-caption text-foreground-muted w-12">500</span>
            <span className="text-body font-medium text-foreground">Medium weight for headings</span>
          </div>
          <div className="flex items-center gap-4">
            <code className="text-caption font-mono bg-background-muted px-2 py-1 rounded w-28 text-center">
              font-semibold
            </code>
            <span className="text-caption text-foreground-muted w-12">600</span>
            <span className="text-body font-semibold text-foreground">Semibold for emphasis</span>
          </div>
          <div className="flex items-center gap-4">
            <code className="text-caption font-mono bg-background-muted px-2 py-1 rounded w-28 text-center">
              font-bold
            </code>
            <span className="text-caption text-foreground-muted w-12">700</span>
            <span className="text-body font-bold text-foreground">Bold for strong emphasis</span>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/typography" />
    </div>
  );
}
