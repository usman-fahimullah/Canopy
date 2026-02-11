"use client";

import DOMPurify from "isomorphic-dompurify";
import { formatDescription } from "./helpers";

interface JobDescriptionProps {
  description: string;
  descriptionHtml?: string | null;
}

export function JobDescription({ description, descriptionHtml }: JobDescriptionProps) {
  const formattedHtml = descriptionHtml || formatDescription(description);
  const sanitizedHtml = DOMPurify.sanitize(formattedHtml, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "b",
      "i",
      "a",
      "br",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });

  return (
    <div className="flex-1 rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-8">
      {/* Section label */}
      <p className="mb-6 text-caption font-medium text-[var(--foreground-subtle)]">Description</p>

      <div
        className={[
          "prose max-w-none text-[var(--foreground-default)]",
          // Links
          "[&_a]:text-[var(--foreground-link)] [&_a]:underline hover:[&_a]:text-[var(--foreground-link-hover)]",
          // H1/H2 — page-level headers (rare in descriptions)
          "[&_h1]:mb-4 [&_h1]:text-heading-sm [&_h1]:font-bold [&_h1]:tracking-tight",
          "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-heading-sm [&_h2]:font-bold [&_h2]:tracking-tight",
          // H3 — section headers (What you'll do, Qualifications, etc.)
          "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:pt-8 [&_h3]:text-body [&_h3]:tracking-tight",
          // Subtle top border between sections
          "[&_h3]:border-t [&_h3]:border-[var(--border-muted)]",
          // First h3 doesn't need top margin or border (flows from intro paragraph)
          "[&_h3:first-child]:mt-0 [&_h3:first-child]:border-t-0 [&_h3:first-child]:pt-0",
          // Paragraphs — caption (14px) for clear hierarchy under body (18px) headers
          "[&_p]:mb-4 [&_p]:text-caption [&_p]:leading-relaxed [&_p]:text-[var(--foreground-muted)]",
          // Lists — same size as paragraphs, reset prose margins on li
          "[&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:pl-5",
          "[&_ol]:mb-4 [&_ol]:space-y-1 [&_ol]:pl-5",
          "[&_li]:my-0 [&_li]:py-0 [&_li]:text-caption [&_li]:leading-relaxed [&_li]:text-[var(--foreground-muted)]",
          // Strong text inside paragraphs stays default color
          "[&_strong]:text-[var(--foreground-default)]",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
