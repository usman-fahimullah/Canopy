"use client";

import { useState } from "react";
import type { FAQSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";
import { CaretDown } from "@phosphor-icons/react";

interface FAQBlockProps {
  section: FAQSection;
  theme: CareerPageTheme;
}

export function FAQBlock({ section, theme }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const resolved = resolveSectionStyle(section.style, theme, "#FFFFFF");
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={resolved.paddingClass}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className={`mb-10 text-2xl font-bold ${resolved.textAlignClass}`}
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.title}
        </h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[var(--card-background)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--background-interactive-hover)]"
              >
                <span className="text-sm font-medium" style={{ color: resolved.textColor }}>
                  {item.question}
                </span>
                <CaretDown
                  size={18}
                  weight="bold"
                  className={`shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  style={{ color: theme.primaryColor }}
                />
              </button>
              {openIndex === i && (
                <div className="border-t border-[var(--border-muted)] px-6 py-4">
                  <p className="text-sm leading-relaxed" style={{ color: resolved.mutedTextColor }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
