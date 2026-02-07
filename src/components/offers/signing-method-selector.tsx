"use client";

import React from "react";
import { Link as LinkIcon, Upload, HandWaving } from "@phosphor-icons/react";
import { Input, Label } from "@/components/ui";

export type SigningMethodType = "SIGNING_LINK" | "DOCUMENT_UPLOAD" | "OFFLINE";

interface SigningMethodSelectorProps {
  value: SigningMethodType;
  onChange: (method: SigningMethodType) => void;
  signingLink?: string;
  onSigningLinkChange?: (link: string) => void;
}

const OPTIONS = [
  {
    value: "SIGNING_LINK" as const,
    label: "Paste a signing link",
    description: "DocuSign, HelloSign, or another e-signing tool",
    icon: LinkIcon,
  },
  {
    value: "DOCUMENT_UPLOAD" as const,
    label: "Upload a signing document",
    description: "Upload a PDF for the candidate to download",
    icon: Upload,
  },
  {
    value: "OFFLINE" as const,
    label: "Handle offline",
    description: "Signing will happen outside of Canopy",
    icon: HandWaving,
  },
];

export function SigningMethodSelector({
  value,
  onChange,
  signingLink,
  onSigningLinkChange,
}: SigningMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.value;

        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              isSelected
                ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                : "border-[var(--border-default)] hover:bg-[var(--background-subtle)]"
            }`}
          >
            <input
              type="radio"
              name="signingMethod"
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="mt-1"
            />
            <Icon size={20} className="mt-0.5 text-[var(--foreground-muted)]" />
            <div className="flex-1">
              <p className="text-body-sm font-semibold text-[var(--foreground-default)]">
                {option.label}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">
                {option.description}
              </p>
            </div>
          </label>
        );
      })}

      {value === "SIGNING_LINK" && onSigningLinkChange && (
        <div className="ml-8 space-y-2">
          <Label htmlFor="signingLink">Signing URL</Label>
          <Input
            id="signingLink"
            type="url"
            placeholder="https://docusign.com/..."
            value={signingLink || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSigningLinkChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
