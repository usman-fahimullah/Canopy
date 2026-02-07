"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

interface FAQBlockProps {
  title: string;
  items: { question: string; answer: string }[];
  theme?: { primaryColor?: string };
}

export function FAQBlock({ title, items, theme }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-16 md:px-12 lg:px-24">
      <h2 className="mb-10 text-center text-2xl font-bold text-[var(--foreground-default)]">
        {title}
      </h2>
      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[var(--card-background)]"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--background-interactive-hover)]"
            >
              <span className="text-sm font-medium text-[var(--foreground-default)]">
                {item.question}
              </span>
              <CaretDown
                size={18}
                weight="bold"
                className={`shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                style={{ color: theme?.primaryColor || "var(--foreground-muted)" }}
              />
            </button>
            {openIndex === i && (
              <div className="border-t border-[var(--border-muted)] px-6 py-4">
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
