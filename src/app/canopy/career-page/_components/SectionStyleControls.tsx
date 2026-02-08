"use client";

import { useState } from "react";
import { TextAlignLeft, TextAlignCenter, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { CaretDown } from "@phosphor-icons/react";
import type { SectionStyle, CareerPageTheme } from "@/lib/career-pages/types";
import { getStylePresets } from "@/lib/career-pages/section-style-utils";

interface SectionStyleControlsProps {
  style: SectionStyle | undefined;
  theme: CareerPageTheme;
  onStyleChange: (updates: Partial<SectionStyle>) => void;
}

/**
 * Design tab controls for per-section styling.
 *
 * Contains:
 * - Style presets (Light / Dark / Brand / Subtle)
 * - Background color picker
 * - Text color picker with auto-contrast toggle
 * - Text alignment
 * - Padding presets
 * - Max width presets
 */
export function SectionStyleControls({ style, theme, onStyleChange }: SectionStyleControlsProps) {
  const presets = getStylePresets(theme);

  // Check if current style matches a preset
  const activePreset = presets.find((p) => {
    if (!style?.backgroundColor && p.id === "light") return true;
    return (
      style?.backgroundColor === p.style.backgroundColor &&
      (style?.textColor || undefined) === (p.style.textColor || undefined)
    );
  });

  return (
    <div className="space-y-4">
      {/* Style Presets */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
          Style Presets
        </Label>
        <div className="flex gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              variant="tertiary"
              size="sm"
              className={`flex items-center gap-1.5 ${
                activePreset?.id === preset.id
                  ? "ring-2 ring-[var(--ring-color)] ring-offset-1"
                  : ""
              }`}
              onClick={() => onStyleChange(preset.style)}
            >
              <span
                className="inline-block h-3 w-3 rounded-full border border-[var(--border-default)]"
                style={{ backgroundColor: preset.dotColor }}
              />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Background */}
      <CollapsibleSection title="Background" defaultOpen>
        <ColorField
          value={style?.backgroundColor || ""}
          onChange={(color) => onStyleChange({ backgroundColor: color || undefined })}
          placeholder="#FFFFFF"
          showClear
          brandSwatches={
            [theme.primaryColor, theme.secondaryColor, theme.accentColor].filter(
              Boolean
            ) as string[]
          }
        />
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Typography" defaultOpen>
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="text-xs text-[var(--foreground-muted)]">Text color</Label>
              <SwitchWithLabel
                label="Auto"
                labelPosition="left"
                checked={!style?.textColor}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onStyleChange({ textColor: undefined });
                  } else {
                    onStyleChange({ textColor: "#1F1D1C" });
                  }
                }}
              />
            </div>
            {style?.textColor && (
              <ColorField
                value={style.textColor}
                onChange={(color) => onStyleChange({ textColor: color || undefined })}
                placeholder="#1F1D1C"
              />
            )}
          </div>

          <div>
            <Label className="mb-1.5 text-xs text-[var(--foreground-muted)]">Alignment</Label>
            <SegmentedController
              options={[
                {
                  value: "left",
                  label: "Left",
                  icon: <TextAlignLeft size={16} />,
                },
                {
                  value: "center",
                  label: "Center",
                  icon: <TextAlignCenter size={16} />,
                },
              ]}
              value={style?.textAlign || "center"}
              onValueChange={(val) =>
                onStyleChange({ textAlign: val as SectionStyle["textAlign"] })
              }
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Spacing */}
      <CollapsibleSection title="Spacing" defaultOpen>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 text-xs text-[var(--foreground-muted)]">Padding</Label>
            <SegmentedController
              options={[
                { value: "compact", label: "Compact" },
                { value: "default", label: "Default" },
                { value: "spacious", label: "Spacious" },
              ]}
              value={style?.padding || theme.defaultSectionPadding || "default"}
              onValueChange={(val) => onStyleChange({ padding: val as SectionStyle["padding"] })}
            />
          </div>

          <div>
            <Label className="mb-1.5 text-xs text-[var(--foreground-muted)]">Max width</Label>
            <SegmentedController
              options={[
                { value: "narrow", label: "Narrow" },
                { value: "default", label: "Default" },
                { value: "wide", label: "Wide" },
                { value: "full", label: "Full" },
              ]}
              value={style?.maxWidth || "default"}
              onValueChange={(val) => onStyleChange({ maxWidth: val as SectionStyle["maxWidth"] })}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Collapsible section wrapper                                         */
/* ------------------------------------------------------------------ */

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground-default)]"
        >
          {title}
          <CaretDown
            size={14}
            className={`transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-1 pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ------------------------------------------------------------------ */
/* Color field with native picker + hex input + brand swatches         */
/* ------------------------------------------------------------------ */

function ColorField({
  value,
  onChange,
  placeholder,
  showClear,
  brandSwatches,
}: {
  value: string;
  onChange: (color: string) => void;
  placeholder?: string;
  showClear?: boolean;
  brandSwatches?: string[];
}) {
  return (
    <div className="space-y-2">
      {/* Brand swatches (quick-select from palette) */}
      {brandSwatches && brandSwatches.length > 0 && (
        <div className="flex gap-1.5">
          {brandSwatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={`h-6 w-6 rounded-md border transition-all ${
                value.toLowerCase() === swatch.toLowerCase()
                  ? "border-[var(--foreground-default)] ring-2 ring-[var(--ring-color)] ring-offset-1"
                  : "border-[var(--border-muted)] hover:border-[var(--border-emphasis)]"
              }`}
              style={{ backgroundColor: swatch }}
              onClick={() => onChange(swatch)}
              title={swatch}
            />
          ))}
        </div>
      )}

      {/* Color picker + hex input */}
      <div className="flex items-center gap-2">
        <label className="relative shrink-0 cursor-pointer">
          <span
            className="block h-8 w-8 rounded-md border border-[var(--border-default)]"
            style={{ backgroundColor: value || "#FFFFFF" }}
          />
          <input
            type="color"
            value={value || "#FFFFFF"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 font-mono text-xs"
        />
        {showClear && value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onChange("")}
            aria-label="Clear color"
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
