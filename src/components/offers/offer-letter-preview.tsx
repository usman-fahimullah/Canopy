"use client";

import React from "react";

interface OfferLetterPreviewProps {
  letterContent: string;
  organization: {
    name: string;
    logo: string | null;
    primaryColor: string;
  };
  className?: string;
}

export function OfferLetterPreview({
  letterContent,
  organization,
  className,
}: OfferLetterPreviewProps) {
  return (
    <div
      className={`mx-auto max-w-2xl rounded-xl border border-[var(--border-default)] bg-white shadow-sm ${className || ""}`}
    >
      {/* Letter header bar */}
      <div
        className="flex items-center gap-3 rounded-t-xl px-8 py-4"
        style={{ backgroundColor: organization.primaryColor + "10" }}
      >
        {organization.logo && (
          <img
            src={organization.logo}
            alt={organization.name}
            className="h-8 w-8 rounded object-contain"
          />
        )}
        <span className="text-body-sm font-semibold" style={{ color: organization.primaryColor }}>
          {organization.name}
        </span>
      </div>

      {/* Letter body */}
      <div
        className="prose prose-sm max-w-none px-8 py-6"
        dangerouslySetInnerHTML={{ __html: letterContent }}
      />
    </div>
  );
}
