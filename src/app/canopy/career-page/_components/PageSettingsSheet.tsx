"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Globe, ArrowSquareOut } from "@phosphor-icons/react";
import type { CareerPageTheme } from "@/lib/career-pages/types";

interface PageSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  theme: CareerPageTheme;
  onThemeChange: (theme: CareerPageTheme) => void;
}

export function PageSettingsSheet({
  open,
  onOpenChange,
  slug,
  onSlugChange,
  enabled,
  onEnabledChange,
  theme,
  onThemeChange,
}: PageSettingsSheetProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = slug ? `${origin}/careers/${slug}` : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[380px] overflow-y-auto sm:max-w-[380px]">
        <SheetHeader>
          <SheetTitle>Page Settings</SheetTitle>
          <SheetDescription>
            Configure your career page URL, visibility, and brand theme
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Career Page URL</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs text-[var(--foreground-subtle)]">
                {origin}/careers/
              </span>
              <Input
                value={slug}
                onChange={(e) =>
                  onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                placeholder="your-company"
                className="text-sm"
              />
            </div>
          </div>

          {/* Publish */}
          <div className="space-y-2">
            <SwitchWithLabel
              label="Publish Career Page"
              checked={enabled}
              onCheckedChange={onEnabledChange}
            />
            <p className="text-xs text-[var(--foreground-subtle)]">
              When enabled, your career page is publicly accessible
            </p>

            {enabled && previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1.5 text-xs text-[var(--foreground-brand)] hover:underline"
              >
                <Globe size={14} />
                {previewUrl}
                <ArrowSquareOut size={12} />
              </a>
            )}
          </div>

          <div className="h-px bg-[var(--border-muted)]" />

          {/* Brand Theme */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground-default)]">Brand Theme</h3>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-[var(--foreground-muted)]">
                Primary Color
              </Label>
              <div className="flex items-center gap-2">
                {/* One-off: Native color picker — no design system ColorInput component exists yet
                    TODO: Extract to <ColorInput> if pattern is reused */}
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => onThemeChange({ ...theme, primaryColor: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded-md border border-[var(--border-muted)]"
                  aria-label="Primary color picker"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => onThemeChange({ ...theme, primaryColor: e.target.value })}
                  className="w-28 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-[var(--foreground-muted)]">
                Font Family
              </Label>
              <Input
                value={theme.fontFamily}
                onChange={(e) => onThemeChange({ ...theme, fontFamily: e.target.value })}
                placeholder="DM Sans"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
