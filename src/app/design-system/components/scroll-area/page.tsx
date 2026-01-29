"use client";

import React from "react";
import { ScrollArea } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const scrollAreaProps = [
  { name: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "Orientation of the scrollbar(s)" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
  { name: "children", type: "ReactNode", required: true, description: "Content to be scrollable" },
];

const sampleItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Candidate ${i + 1}`,
  role: ["Software Engineer", "Product Designer", "Data Analyst", "Project Manager"][i % 4],
}));

const sampleTags = [
  "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB",
  "AWS", "Docker", "Kubernetes", "GraphQL", "REST API", "CI/CD",
  "Agile", "Scrum", "LEED Certified", "NABCEP", "ESG", "Sustainability",
];

export default function ScrollAreaPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Scroll Area
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          ScrollArea provides a custom-styled scrollable container with subtle
          scrollbars that appear on hover. Useful for constrained height/width areas.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Vertical scroll area with fixed height"
      >
        <CodePreview
          code={`<ScrollArea className="h-48 w-full rounded-lg border">
  <div className="p-4">
    {/* Long content here */}
  </div>
</ScrollArea>`}
        >
          <ScrollArea className="h-48 w-full max-w-md rounded-lg border border-border">
            <div className="p-4 space-y-2">
              {sampleItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-background-subtle border border-border"
                >
                  <p className="text-body-sm font-medium">{item.name}</p>
                  <p className="text-caption text-foreground-muted">{item.role}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CodePreview>
      </ComponentCard>

      {/* Horizontal Scroll */}
      <ComponentCard
        id="horizontal"
        title="Horizontal Scroll"
        description="Horizontal scrolling for wide content"
      >
        <ScrollArea orientation="horizontal" className="w-full max-w-md rounded-lg border border-border">
          <div className="flex gap-2 p-4">
            {sampleTags.map((tag) => (
              <span
                key={tag}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-caption whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </ScrollArea>
      </ComponentCard>

      {/* Both Orientations */}
      <ComponentCard
        id="both"
        title="Both Orientations"
        description="Scroll in both directions"
      >
        <ScrollArea orientation="both" className="h-48 w-full max-w-md rounded-lg border border-border">
          <div className="p-4" style={{ width: "600px" }}>
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Role</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Location</th>
                  <th className="text-left p-2 font-medium">Experience</th>
                </tr>
              </thead>
              <tbody>
                {sampleItems.slice(0, 10).map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.role}</td>
                    <td className="p-2">Active</td>
                    <td className="p-2">San Francisco, CA</td>
                    <td className="p-2">{item.id + 2} years</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </ComponentCard>

      {/* Candidate List Example */}
      <ComponentCard
        id="examples"
        title="ATS Example"
        description="Candidate list in a fixed-height panel"
      >
        <div className="max-w-md border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border bg-background-subtle">
            <p className="text-body-strong font-medium">Candidates (20)</p>
          </div>
          <ScrollArea className="h-64">
            <div className="divide-y divide-border">
              {sampleItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-background-subtle transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-caption font-medium">
                      {item.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-body-sm font-medium">{item.name}</p>
                      <p className="text-caption text-foreground-muted">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={scrollAreaProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for fixed-height containers with variable content",
          "Use horizontal scroll for tag lists or image galleries",
          "Provide visual cues that content is scrollable",
          "Consider keyboard navigation for scrollable regions",
        ]}
        donts={[
          "Don't nest scroll areas within scroll areas",
          "Don't use for full-page scrolling (use native)",
          "Don't hide important content below the fold without indication",
          "Don't make scroll areas too small to be usable",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/scroll-area" />
    </div>
  );
}
