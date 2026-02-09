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
      <div
        className="prose prose-lg max-w-none text-[var(--foreground-default)] [&_a]:text-[var(--foreground-link)] [&_a]:underline hover:[&_a]:text-[var(--foreground-link-hover)] [&_h1]:mb-4 [&_h1]:text-heading-sm [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-heading-sm [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-body-strong [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_li]:text-body [&_li]:leading-relaxed [&_ol]:mb-4 [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mb-4 [&_p]:text-body [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
