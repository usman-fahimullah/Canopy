"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const popoverContentProps = [
  { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment relative to trigger" },
  { name: "sideOffset", type: "number", default: "4", description: "Distance from the trigger in pixels" },
  { name: "hideArrow", type: "boolean", default: "false", description: "Hide the arrow pointer" },
  { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side to render" },
];

export default function PopoverPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Popover
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Popovers display floating content in relation to a trigger element.
          They are more persistent than tooltips and can contain interactive content.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple popover with content"
      >
        <CodePreview
          code={`<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Popover Title</PopoverTitle>
      <PopoverDescription>
        This is the popover description.
      </PopoverDescription>
    </PopoverHeader>
    <p>Popover content goes here.</p>
  </PopoverContent>
</Popover>`}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Popover Title</PopoverTitle>
                <PopoverDescription>
                  This is a brief description of the popover content.
                </PopoverDescription>
              </PopoverHeader>
              <p className="text-body-sm">
                Additional content can be placed here. Popovers can contain
                forms, lists, or any other content.
              </p>
            </PopoverContent>
          </Popover>
        </CodePreview>
      </ComponentCard>

      {/* Alignment */}
      <ComponentCard
        id="alignment"
        title="Alignment"
        description="Different alignment options"
      >
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm">Align Start</Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <p className="text-body-sm">Aligned to the start of the trigger.</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm">Align Center</Button>
            </PopoverTrigger>
            <PopoverContent align="center">
              <p className="text-body-sm">Centered relative to the trigger.</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm">Align End</Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <p className="text-body-sm">Aligned to the end of the trigger.</p>
            </PopoverContent>
          </Popover>
        </div>
      </ComponentCard>

      {/* Without Arrow */}
      <ComponentCard
        id="no-arrow"
        title="Without Arrow"
        description="Popover without the pointing arrow"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">No Arrow</Button>
          </PopoverTrigger>
          <PopoverContent hideArrow>
            <p className="text-body-sm">
              This popover has no arrow pointing to the trigger.
            </p>
          </PopoverContent>
        </Popover>
      </ComponentCard>

      {/* With Form */}
      <ComponentCard
        id="with-form"
        title="With Form"
        description="Popover containing interactive form elements"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button>Quick Edit</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <PopoverHeader>
              <PopoverTitle>Edit Details</PopoverTitle>
              <PopoverDescription>
                Make quick changes to the candidate profile.
              </PopoverDescription>
            </PopoverHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="flex justify-end gap-2">
                <PopoverClose asChild>
                  <Button variant="secondary" size="sm">Cancel</Button>
                </PopoverClose>
                <Button size="sm">Save</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ComponentCard>

      {/* Filter Popover */}
      <ComponentCard
        id="filter-example"
        title="Filter Example"
        description="Common pattern for filter popovers"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">
              Filters
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">3</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <PopoverHeader>
              <PopoverTitle>Filter Candidates</PopoverTitle>
            </PopoverHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <div className="flex flex-wrap gap-2">
                  {["Entry", "Mid", "Senior", "Lead"].map((level) => (
                    <button
                      key={level}
                      className="px-3 py-1 text-caption rounded-full border border-border hover:bg-background-subtle"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Search locations..." />
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <Button variant="ghost" size="sm">Clear all</Button>
                <PopoverClose asChild>
                  <Button size="sm">Apply</Button>
                </PopoverClose>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="PopoverContent Props">
        <PropsTable props={popoverContentProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for interactive content that requires user input",
          "Include a clear way to close the popover",
          "Use PopoverClose for closing buttons",
          "Keep content focused and actionable",
        ]}
        donts={[
          "Don't use for simple hover information (use Tooltip)",
          "Don't put critical actions only in popovers",
          "Don't make popovers too large - use a Modal instead",
          "Don't nest popovers inside other popovers",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/popover" />
    </div>
  );
}
