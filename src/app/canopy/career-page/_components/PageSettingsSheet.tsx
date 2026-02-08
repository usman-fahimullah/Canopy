"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SwitchWithLabel } from "@/components/ui/switch";
import { SegmentedController } from "@/components/ui/segmented-controller";
import {
  Globe,
  ArrowSquareOut,
  UploadSimple,
  Trash,
  Image as ImageIcon,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import type { CareerPageTheme } from "@/lib/career-pages/types";
import {
  CAREER_PAGE_FONTS,
  getFontsByCategory,
  getFontValue,
  getAllFontsPreloadUrl,
} from "@/lib/career-pages/fonts";
import { uploadOrganizationLogo } from "@/lib/storage";

interface PageSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  theme: CareerPageTheme;
  onThemeChange: (theme: CareerPageTheme) => void;
  organizationId?: string;
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
  organizationId,
}: PageSettingsSheetProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = slug ? `${origin}/careers/${slug}` : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] overflow-y-auto sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Page Settings</SheetTitle>
          <SheetDescription>Brand identity, typography, and page configuration</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* -------------------------------------------------------- */}
          {/* Brand Kit                                                 */}
          {/* -------------------------------------------------------- */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground-default)]">Brand Kit</h3>

            {/* Logo */}
            <LogoUploader
              logoUrl={theme.logo}
              onLogoChange={(url) => onThemeChange({ ...theme, logo: url })}
              organizationId={organizationId}
            />

            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                Colors
              </Label>

              <ColorField
                label="Primary"
                value={theme.primaryColor}
                onChange={(color) => onThemeChange({ ...theme, primaryColor: color })}
              />

              <ColorField
                label="Secondary"
                value={theme.secondaryColor || ""}
                onChange={(color) =>
                  onThemeChange({ ...theme, secondaryColor: color || undefined })
                }
                clearable
              />

              <ColorField
                label="Accent"
                value={theme.accentColor || ""}
                onChange={(color) => onThemeChange({ ...theme, accentColor: color || undefined })}
                clearable
              />
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                Typography
              </Label>

              <FontSelector
                label="Body font"
                value={theme.fontFamily}
                onChange={(font) => onThemeChange({ ...theme, fontFamily: font })}
              />

              <FontSelector
                label="Heading font"
                value={theme.headingFontFamily || ""}
                onChange={(font) =>
                  onThemeChange({ ...theme, headingFontFamily: font || undefined })
                }
                placeholder="Same as body font"
              />

              {/* Font preview */}
              <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
                <p
                  className="mb-1 text-lg font-bold text-[var(--foreground-default)]"
                  style={{
                    fontFamily: getFontValue(theme.headingFontFamily || theme.fontFamily),
                  }}
                >
                  The quick brown fox
                </p>
                <p
                  className="text-sm text-[var(--foreground-muted)]"
                  style={{ fontFamily: getFontValue(theme.fontFamily) }}
                >
                  jumps over the lazy dog. This preview shows how your career page text will look
                  with the selected fonts.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-[var(--border-muted)]" />

          {/* -------------------------------------------------------- */}
          {/* Page Settings                                             */}
          {/* -------------------------------------------------------- */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground-default)]">
              Page Settings
            </h3>

            {/* URL */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[var(--foreground-muted)]">
                Career Page URL
              </Label>
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

            {/* Default section padding */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[var(--foreground-muted)]">
                Default Section Spacing
              </Label>
              <SegmentedController
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "default", label: "Default" },
                  { value: "spacious", label: "Spacious" },
                ]}
                value={theme.defaultSectionPadding || "default"}
                onValueChange={(value) =>
                  onThemeChange({
                    ...theme,
                    defaultSectionPadding: value as "compact" | "default" | "spacious",
                  })
                }
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Color picker field                                                  */
/* ------------------------------------------------------------------ */

function ColorField({
  label,
  value,
  onChange,
  clearable,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  clearable?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="w-20 shrink-0 text-xs text-[var(--foreground-muted)]">{label}</Label>
      {/* One-off: Native color picker — no design system ColorInput component exists yet */}
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded-md border border-[var(--border-muted)] p-0.5"
        aria-label={`${label} color picker`}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={clearable ? "Not set" : "#000000"}
        className="w-24 text-xs"
      />
      {clearable && value && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => onChange("")}
          aria-label={`Clear ${label} color`}
        >
          <Trash size={14} />
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Font selector dropdown                                              */
/* ------------------------------------------------------------------ */

function FontSelector({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load all Google Fonts when the dropdown is first opened
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !fontsLoaded) {
      const url = getAllFontsPreloadUrl();
      if (url) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.id = "career-page-fonts-preload";
        if (!document.getElementById("career-page-fonts-preload")) {
          document.head.appendChild(link);
        }
      }
      setFontsLoaded(true);
    }
  }, [isOpen, fontsLoaded]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const categories = getFontsByCategory();
  const displayValue = value || placeholder || "Select font";

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[var(--foreground-muted)]">{label}</Label>
      <div ref={ref} className="relative">
        {/* One-off: Custom dropdown trigger — need per-option font rendering
            which the standard Dropdown component doesn't support */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--border-default)] bg-[var(--input-background)] px-3 text-sm transition-colors hover:border-[var(--border-emphasis)]"
          style={value ? { fontFamily: getFontValue(value) } : undefined}
        >
          <span
            className={
              value ? "text-[var(--foreground-default)]" : "text-[var(--foreground-subtle)]"
            }
          >
            {displayValue}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="shrink-0 text-[var(--foreground-subtle)]"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border border-[var(--border-default)] bg-[var(--background-default)] py-1 shadow-[var(--shadow-dropdown)]">
            {/* "Same as body" option for heading font */}
            {placeholder && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--background-interactive-hover)]"
                >
                  {placeholder}
                </button>
                <div className="my-1 h-px bg-[var(--border-muted)]" />
              </>
            )}

            {categories.map(
              (group) =>
                group.fonts.length > 0 && (
                  <div key={group.category}>
                    <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                      {group.label}
                    </div>
                    {group.fonts.map((font) => {
                      const isSelected = font.name === value;
                      return (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => {
                            onChange(font.name);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-[var(--background-interactive-hover)] ${
                            isSelected
                              ? "bg-[var(--background-interactive-selected)] text-[var(--foreground-brand)]"
                              : "text-[var(--foreground-default)]"
                          }`}
                          style={{ fontFamily: getFontValue(font.name) }}
                        >
                          {font.name}
                        </button>
                      );
                    })}
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo uploader                                                       */
/* ------------------------------------------------------------------ */

function LogoUploader({
  logoUrl,
  onLogoChange,
  organizationId,
}: {
  logoUrl?: string;
  onLogoChange: (url: string | undefined) => void;
  organizationId?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PNG, JPG, or SVG file");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2MB");
      return;
    }

    if (!organizationId) {
      setError("Organization not found");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadOrganizationLogo(file, organizationId);
      if (result.error) {
        setError(result.error);
      } else {
        onLogoChange(result.url);
      }
    } catch {
      setError("Failed to upload logo");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
        Logo
      </Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload logo"
      />

      {logoUrl ? (
        /* Logo uploaded state */
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)]">
            <img src={logoUrl} alt="Company logo" className="h-full w-full object-contain p-1" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Spinner size="sm" variant="current" /> : "Change"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--foreground-error)]"
              onClick={() => onLogoChange(undefined)}
            >
              <Trash size={14} className="mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        /* No logo — upload drop zone */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[var(--border-muted)] bg-[var(--background-subtle)] p-6 text-center transition-colors hover:border-[var(--border-emphasis)] hover:bg-[var(--background-interactive-hover)]"
        >
          {isUploading ? (
            <Spinner size="sm" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
              <UploadSimple size={20} className="text-[var(--foreground-brand)]" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[var(--foreground-default)]">
              {isUploading ? "Uploading..." : "Upload Logo"}
            </p>
            <p className="text-xs text-[var(--foreground-subtle)]">PNG, SVG, or JPG · Max 2MB</p>
          </div>
        </button>
      )}

      {error && <p className="text-xs text-[var(--foreground-error)]">{error}</p>}
    </div>
  );
}
