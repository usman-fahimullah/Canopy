"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { BookmarkSimple, Sparkle, CheckCircle, Lightning } from "@phosphor-icons/react";

/**
 * RoleTemplateCard component
 *
 * A promotional card that encourages users to save their role as a template.
 * Features an illustration and persuasive copy.
 */

export interface RoleTemplateCardProps {
  /** Callback when "Save as Role Template" is clicked */
  onSaveTemplate: () => void;
  /** Whether the role is already saved as a template */
  isSaved?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

const RoleTemplateCard = React.forwardRef<HTMLDivElement, RoleTemplateCardProps>(
  ({ onSaveTemplate, isSaved = false, loading = false, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-2xl",
          "via-primary-50 bg-gradient-to-br from-primary-100 to-background-subtle",
          "border border-primary-200",
          className
        )}
      >
        {/* Header */}
        <div className="px-4 pb-2 pt-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600">
              <Sparkle weight="fill" className="h-3.5 w-3.5 text-[var(--foreground-on-emphasis)]" />
            </div>
            <span className="font-semibold text-primary-800">Role Template</span>
          </div>
          <p className="text-body-sm leading-relaxed text-foreground-muted">
            Save this role as a template with pre-filled info ready to post. You&apos;ll move
            faster, stay consistent, and attract the right candidates from the very first post.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative px-4 py-4">
          <div className="flex items-center justify-center">
            {/* Simple illustration using icons and shapes */}
            <div className="relative aspect-[4/3] w-full max-w-[200px]">
              {/* Background card shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Document stack */}
                <div className="relative">
                  {/* Back card */}
                  <div className="absolute -left-2 -top-2 h-32 w-24 -rotate-6 transform rounded-lg border border-primary-200 bg-white/60" />
                  {/* Middle card */}
                  <div className="absolute -left-1 -top-1 h-32 w-24 -rotate-3 transform rounded-lg border border-primary-200 bg-white/80" />
                  {/* Front card */}
                  <div className="relative h-32 w-24 rounded-lg border border-primary-300 bg-[var(--card-background)] shadow-sm">
                    {/* Card content lines */}
                    <div className="space-y-2 p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded bg-primary-400" />
                        <div className="h-2 w-12 rounded bg-foreground-disabled" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-foreground-disabled/50 h-1.5 w-full rounded" />
                        <div className="bg-foreground-disabled/50 h-1.5 w-3/4 rounded" />
                        <div className="bg-foreground-disabled/50 h-1.5 w-5/6 rounded" />
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <div className="bg-foreground-disabled/30 h-1.5 w-full rounded" />
                        <div className="bg-foreground-disabled/30 h-1.5 w-2/3 rounded" />
                      </div>
                    </div>
                    {/* Checkmark badge */}
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 shadow-md">
                      <CheckCircle
                        weight="fill"
                        className="h-5 w-5 text-[var(--foreground-on-emphasis)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute right-4 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200">
                <Lightning weight="fill" className="h-3 w-3 text-primary-600" />
              </div>
              <div className="absolute bottom-4 left-0 h-4 w-4 rounded-full bg-primary-300" />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="px-4 pb-4">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            className={cn(
              "w-full",
              isSaved && "border-primary-300 bg-primary-100 text-primary-800"
            )}
            onClick={onSaveTemplate}
            loading={loading}
            disabled={isSaved}
            leftIcon={
              isSaved ? (
                <CheckCircle weight="fill" className="h-4 w-4" />
              ) : (
                <BookmarkSimple weight="regular" className="h-4 w-4" />
              )
            }
          >
            {isSaved ? "Saved as Template" : "Save as Role Template"}
          </Button>
        </div>
      </div>
    );
  }
);

RoleTemplateCard.displayName = "RoleTemplateCard";

export { RoleTemplateCard };
