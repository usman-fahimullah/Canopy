"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Button,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const sheetContentProps = [
  { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "Side of the screen to slide in from" },
  { name: "size", type: '"sm" | "md" | "lg" | "xl" | "full"', default: '"md"', description: "Width of the sheet (for left/right sides)" },
  { name: "hideClose", type: "boolean", default: "false", description: "Hide the default close button" },
];

export default function SheetPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Sheet
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Sheets are slide-out panels that overlay the main content. They&apos;re ideal
          for secondary forms, detail views, and actions that don&apos;t require full-page navigation.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple sheet sliding from the right"
      >
        <CodePreview
          code={`<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>
        Sheet description goes here.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Sheet content */}
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="secondary">Cancel</Button>
      </SheetClose>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
                <SheetDescription>
                  This is a description of what this sheet is for.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-body-sm text-foreground-muted">
                  Sheet content goes here. You can add forms, lists,
                  or any other content.
                </p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </SheetClose>
                <Button>Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CodePreview>
      </ComponentCard>

      {/* Sides */}
      <ComponentCard
        id="sides"
        title="Sides"
        description="Sheets can slide in from any edge"
      >
        <div className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm">From Right</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Right Sheet</SheetTitle>
              </SheetHeader>
              <p className="py-4 text-body-sm text-foreground-muted">
                This sheet slides in from the right side.
              </p>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm">From Left</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Left Sheet</SheetTitle>
              </SheetHeader>
              <p className="py-4 text-body-sm text-foreground-muted">
                This sheet slides in from the left side.
              </p>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm">From Top</Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Top Sheet</SheetTitle>
              </SheetHeader>
              <p className="py-4 text-body-sm text-foreground-muted">
                This sheet slides down from the top.
              </p>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm">From Bottom</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Bottom Sheet</SheetTitle>
              </SheetHeader>
              <p className="py-4 text-body-sm text-foreground-muted">
                This sheet slides up from the bottom.
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available width options for side sheets"
      >
        <div className="flex flex-wrap gap-3">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <Sheet key={size}>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm">{size.toUpperCase()}</Button>
              </SheetTrigger>
              <SheetContent size={size}>
                <SheetHeader>
                  <SheetTitle>Size: {size.toUpperCase()}</SheetTitle>
                  <SheetDescription>
                    This sheet uses the {size} size variant.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </ComponentCard>

      {/* Form Sheet */}
      <ComponentCard
        id="form-example"
        title="Form Sheet"
        description="Sheet with form content"
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button>Add Candidate</Button>
          </SheetTrigger>
          <SheetContent size="lg">
            <SheetHeader>
              <SheetTitle>Add New Candidate</SheetTitle>
              <SheetDescription>
                Enter the candidate details below.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes about the candidate..." rows={4} />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="secondary">Cancel</Button>
              </SheetClose>
              <Button>Add Candidate</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ComponentCard>

      {/* Candidate Detail Sheet */}
      <ComponentCard
        id="detail-example"
        title="Detail Sheet"
        description="Sheet for viewing details"
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">View Candidate</Button>
          </SheetTrigger>
          <SheetContent size="lg">
            <SheetHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">JD</span>
                </div>
                <div>
                  <SheetTitle>John Doe</SheetTitle>
                  <SheetDescription>Solar Energy Engineer</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-body-sm">
                <div>
                  <p className="text-foreground-muted mb-1">Email</p>
                  <p>john.doe@email.com</p>
                </div>
                <div>
                  <p className="text-foreground-muted mb-1">Phone</p>
                  <p>(555) 123-4567</p>
                </div>
                <div>
                  <p className="text-foreground-muted mb-1">Location</p>
                  <p>San Francisco, CA</p>
                </div>
                <div>
                  <p className="text-foreground-muted mb-1">Experience</p>
                  <p>5 years</p>
                </div>
              </div>
              <div>
                <p className="text-foreground-muted mb-2 text-body-sm">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {["Solar PV", "AutoCAD", "Project Management", "NABCEP"].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-caption bg-background-subtle rounded-full border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button variant="secondary">Reject</Button>
              <Button>Schedule Interview</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="SheetContent Props">
        <PropsTable props={sheetContentProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for secondary content and actions",
          "Use right side for forms and details",
          "Use bottom for mobile-friendly actions",
          "Include clear close action in the footer",
        ]}
        donts={[
          "Don't use for primary workflows (use full pages)",
          "Don't use full-width sheets on desktop",
          "Don't stack multiple sheets",
          "Don't put critical confirmations in sheets",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/sheet" />
    </div>
  );
}
