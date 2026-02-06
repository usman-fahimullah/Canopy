"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, PencilSimpleLine, Rocket } from "@phosphor-icons/react";

interface PreviewBannerProps {
  /** Whether role is already published */
  isPublished: boolean;
  /** Called when "Edit Role" is clicked */
  onEdit: () => void;
  /** Called when "Publish Role" is clicked */
  onPublish: () => void;
  /** Whether publish action is in progress */
  isPublishing?: boolean;
}

export function PreviewBanner({
  isPublished,
  onEdit,
  onPublish,
  isPublishing = false,
}: PreviewBannerProps) {
  return (
    <div
      className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--primitive-blue-300)] bg-[var(--primitive-blue-100)]"
      role="status"
      aria-label="Role preview mode"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3 lg:px-12">
        {/* Left: Icon + message */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
            <Eye size={18} weight="bold" className="text-[var(--primitive-blue-600)]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption-strong text-[var(--primitive-blue-700)]">
              Preview Mode
            </span>
            <span className="hidden text-caption text-[var(--primitive-blue-600)] sm:inline">
              — This is how job seekers will see your role
            </span>
          </div>
          {isPublished && (
            <Badge variant="success" className="ml-2">
              Published
            </Badge>
          )}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="border-[var(--primitive-blue-300)] bg-[var(--background-default)] text-[var(--primitive-blue-700)] hover:bg-[var(--primitive-blue-200)]"
          >
            <PencilSimpleLine size={16} weight="bold" className="mr-1.5" />
            Edit Role
          </Button>
          {!isPublished && (
            <Button
              variant="primary"
              size="sm"
              onClick={onPublish}
              disabled={isPublishing}
              loading={isPublishing}
            >
              <Rocket size={16} weight="bold" className="mr-1.5" />
              {isPublishing ? "Publishing..." : "Publish Role"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
