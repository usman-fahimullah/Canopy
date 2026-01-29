"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

export default function MotionPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Motion Tokens</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Animation and transition tokens for consistent, accessible motion throughout the
          application. All durations respect prefers-reduced-motion.
        </p>
      </div>

      {/* Duration Tokens */}
      <ComponentCard
        title="Duration Tokens"
        description="Standardized animation durations for consistent timing."
      >
        <div className="space-y-4">
          {[
            { name: "--duration-instant", value: "0ms", usage: "Immediate feedback, no transition" },
            { name: "--duration-fast", value: "100ms", usage: "Micro-interactions, hover states" },
            { name: "--duration-normal", value: "200ms", usage: "Default transitions, state changes" },
            { name: "--duration-slow", value: "300ms", usage: "Modal/dropdown animations" },
            { name: "--duration-slower", value: "400ms", usage: "Page transitions, large elements" },
            { name: "--duration-slowest", value: "500ms", usage: "Complex animations, emphasis" },
          ].map(({ name, value, usage }) => (
            <div key={name} className="flex items-center gap-4 p-3 bg-background-muted rounded-lg">
              <div
                className="w-16 h-8 bg-primary-500 rounded transition-transform hover:translate-x-4"
                style={{ transitionDuration: value }}
              />
              <div className="flex-1 min-w-0">
                <code className="text-caption font-mono text-foreground">{name}</code>
                <p className="text-caption text-foreground-muted">{value}</p>
              </div>
              <p className="text-caption text-foreground-subtle hidden sm:block">{usage}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Easing Tokens */}
      <ComponentCard title="Easing Tokens" description="Predefined easing curves for natural motion.">
        <div className="space-y-4">
          {[
            { name: "--ease-linear", value: "linear", description: "Constant speed, mechanical feel" },
            {
              name: "--ease-default",
              value: "cubic-bezier(0.4, 0, 0.2, 1)",
              description: "General purpose, smooth",
            },
            {
              name: "--ease-in",
              value: "cubic-bezier(0.4, 0, 1, 1)",
              description: "Starts slow, accelerates",
            },
            {
              name: "--ease-out",
              value: "cubic-bezier(0, 0, 0.2, 1)",
              description: "Starts fast, decelerates",
            },
            {
              name: "--ease-in-out",
              value: "cubic-bezier(0.4, 0, 0.2, 1)",
              description: "Smooth start and end",
            },
            {
              name: "--ease-spring",
              value: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              description: "Bouncy, playful feel",
            },
            {
              name: "--ease-bounce",
              value: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              description: "Overshoot effect",
            },
          ].map(({ name, value, description }) => (
            <div
              key={name}
              className="flex items-center gap-4 p-3 bg-background-muted rounded-lg group"
            >
              <div
                className="w-16 h-8 bg-primary-500 rounded transition-transform duration-500 group-hover:translate-x-4"
                style={{ transitionTimingFunction: value }}
              />
              <div className="flex-1 min-w-0">
                <code className="text-caption font-mono text-foreground">{name}</code>
                <p className="text-caption text-foreground-muted truncate">{value}</p>
              </div>
              <p className="text-caption text-foreground-subtle hidden sm:block">{description}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Accessibility Note */}
      <ComponentCard
        title="Accessibility"
        description="Motion tokens respect user preferences for reduced motion."
      >
        <div className="p-4 bg-background-info rounded-lg">
          <p className="text-body-sm text-foreground">
            All motion tokens automatically respect the <code className="bg-background-muted px-1 rounded">prefers-reduced-motion</code> media query. When users have
            enabled reduced motion in their system preferences, all durations are set to 0ms.
          </p>
          <div className="mt-4 p-3 bg-surface rounded border border-border">
            <code className="text-caption font-mono text-foreground-muted">
              @media (prefers-reduced-motion: reduce) {"{"}
              <br />
              {"  "}--duration-fast: 0ms;
              <br />
              {"  "}--duration-normal: 0ms;
              <br />
              {"  "}/* ... all durations set to 0ms */
              <br />
              {"}"}
            </code>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/motion" />
    </div>
  );
}
