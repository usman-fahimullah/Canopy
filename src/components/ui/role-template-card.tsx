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
          "rounded-2xl overflow-hidden",
          "bg-gradient-to-br from-primary-100 via-primary-50 to-background-subtle",
          "border border-primary-200",
          className
        )}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-600">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-primary-800">Role Template</span>
          </div>
          <p className="text-body-sm text-foreground-muted leading-relaxed">
            Save this role as a template with pre-filled info ready to post. You&apos;ll move faster, stay consistent, and attract the right candidates from the very first post.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative px-4 py-4">
          <div className="flex items-center justify-center">
            {/* Simple illustration using icons and shapes */}
            <div className="relative w-full max-w-[200px] aspect-[4/3]">
              {/* Background card shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Document stack */}
                <div className="relative">
                  {/* Back card */}
                  <div className="absolute -left-2 -top-2 w-24 h-32 rounded-lg bg-white/60 border border-primary-200 transform -rotate-6" />
                  {/* Middle card */}
                  <div className="absolute -left-1 -top-1 w-24 h-32 rounded-lg bg-white/80 border border-primary-200 transform -rotate-3" />
                  {/* Front card */}
                  <div className="relative w-24 h-32 rounded-lg bg-[var(--card-background)] border border-primary-300 shadow-sm">
                    {/* Card content lines */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-primary-400" />
                        <div className="h-2 w-12 rounded bg-foreground-disabled" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full rounded bg-foreground-disabled/50" />
                        <div className="h-1.5 w-3/4 rounded bg-foreground-disabled/50" />
                        <div className="h-1.5 w-5/6 rounded bg-foreground-disabled/50" />
                      </div>
                      <div className="pt-2 space-y-1.5">
                        <div className="h-1.5 w-full rounded bg-foreground-disabled/30" />
                        <div className="h-1.5 w-2/3 rounded bg-foreground-disabled/30" />
                      </div>
                    </div>
                    {/* Checkmark badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-md">
                      <CheckCircle weight="fill" className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-0 right-4 w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center">
                <Lightning weight="fill" className="w-3 h-3 text-primary-600" />
              </div>
              <div className="absolute bottom-4 left-0 w-4 h-4 rounded-full bg-primary-300" />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="px-4 pb-4">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            className={cn(
              "w-full",
              isSaved && "bg-primary-100 text-primary-800 border-primary-300"
            )}
            onClick={onSaveTemplate}
            loading={loading}
            disabled={isSaved}
            leftIcon={
              isSaved ? (
                <CheckCircle weight="fill" className="w-4 h-4" />
              ) : (
                <BookmarkSimple weight="regular" className="w-4 h-4" />
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
