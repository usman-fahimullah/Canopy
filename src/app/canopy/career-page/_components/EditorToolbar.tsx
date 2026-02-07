"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Desktop,
  Laptop,
  DeviceMobile,
  GearSix,
  FloppyDisk,
  Check,
  Eye,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { DeviceMode } from "./DeviceFrame";

interface EditorToolbarProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onSave: () => void;
  onOpenSettings: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  isDirty: boolean;
  isPublished: boolean;
  previewUrl: string | null;
}

const DEVICE_OPTIONS: { mode: DeviceMode; icon: typeof Desktop; label: string }[] = [
  { mode: "desktop", icon: Desktop, label: "Desktop" },
  { mode: "tablet", icon: Laptop, label: "Tablet" },
  { mode: "mobile", icon: DeviceMobile, label: "Mobile" },
];

export function EditorToolbar({
  deviceMode,
  onDeviceModeChange,
  onSave,
  onOpenSettings,
  isSaving,
  saveSuccess,
  isDirty,
  isPublished,
  previewUrl,
}: EditorToolbarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-default)] bg-[var(--background-default)] px-4">
      {/* Left: Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/canopy"
          className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-default)]"
        >
          <ArrowLeft size={18} weight="bold" />
          <span className="hidden sm:inline">Back to Canopy</span>
        </Link>
        <div className="hidden h-5 w-px bg-[var(--border-default)] sm:block" />
        <h1 className="hidden text-sm font-semibold text-[var(--foreground-default)] sm:block">
          Career Page
        </h1>
      </div>

      {/* Center: Device toggles */}
      <div className="flex items-center gap-1 rounded-lg bg-[var(--background-subtle)] p-1">
        {DEVICE_OPTIONS.map(({ mode, icon: Icon, label }) => (
          <Button
            key={mode}
            variant="ghost"
            size="icon"
            onClick={() => onDeviceModeChange(mode)}
            aria-label={`${label} preview`}
            title={label}
            className={cn(
              "h-8 w-8 rounded-md",
              deviceMode === mode
                ? "bg-[var(--background-default)] text-[var(--foreground-default)] shadow-[var(--shadow-xs)]"
                : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
            )}
          >
            <Icon size={18} weight={deviceMode === mode ? "fill" : "regular"} />
          </Button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Badge variant={isPublished ? "success" : "neutral"} className="hidden sm:inline-flex">
          {isPublished ? "Published" : "Draft"}
        </Badge>

        {previewUrl && isPublished && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(previewUrl, "_blank")}
            title="Preview career page"
          >
            <Eye size={16} weight="bold" />
            <ArrowSquareOut size={12} className="ml-0.5" />
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={onOpenSettings} title="Page settings">
          <GearSix size={18} weight="bold" />
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          loading={isSaving}
          disabled={!isDirty && !isSaving}
        >
          {saveSuccess ? (
            <>
              <Check size={16} weight="bold" className="mr-1.5" />
              Saved
            </>
          ) : (
            <>
              <FloppyDisk size={16} weight="bold" className="mr-1.5" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
