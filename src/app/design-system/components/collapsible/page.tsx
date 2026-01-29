"use client";

import React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const collapsibleProps = [
  { name: "open", type: "boolean", default: "undefined", description: "Controlled open state" },
  { name: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Called when open state changes" },
  { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state (uncontrolled)" },
  { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction" },
];

const triggerProps = [
  { name: "showChevron", type: "boolean", default: "false", description: "Show chevron indicator that rotates" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function CollapsiblePage() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Collapsible
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Collapsible is a primitive component for creating expandable/collapsible
          sections. It provides the building blocks for accordions, disclosure widgets,
          and expandable panels.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple collapsible section"
      >
        <CodePreview
          code={`<Collapsible>
  <CollapsibleTrigger showChevron className="p-3 rounded-lg">
    Click to expand
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="p-3">
      Hidden content revealed on click.
    </div>
  </CollapsibleContent>
</Collapsible>`}
        >
          <div className="max-w-md border border-border rounded-lg">
            <Collapsible>
              <CollapsibleTrigger showChevron className="p-3 rounded-lg hover:bg-background-subtle">
                Click to expand
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 pt-0 text-body-sm text-foreground-muted">
                  This content is hidden by default and revealed when the trigger is clicked.
                  The chevron rotates to indicate the open/closed state.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Controlled */}
      <ComponentCard
        id="controlled"
        title="Controlled State"
        description="Manage open state externally"
      >
        <div className="space-y-4 max-w-md">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setIsOpen(true)}>
              Open
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsOpen(!isOpen)}>
              Toggle
            </Button>
          </div>
          <div className="border border-border rounded-lg">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger showChevron className="p-3 rounded-lg hover:bg-background-subtle">
                Controlled Collapsible (isOpen: {isOpen ? "true" : "false"})
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 pt-0 text-body-sm text-foreground-muted">
                  This collapsible is controlled by external state. Use the buttons above
                  to open, close, or toggle the content.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ComponentCard>

      {/* Default Open */}
      <ComponentCard
        id="default-open"
        title="Default Open"
        description="Start in the open state"
      >
        <div className="max-w-md border border-border rounded-lg">
          <Collapsible defaultOpen>
            <CollapsibleTrigger showChevron className="p-3 rounded-lg hover:bg-background-subtle">
              Expanded by default
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 pt-0 text-body-sm text-foreground-muted">
                This section starts open. Users can click to collapse it.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ComponentCard>

      {/* Custom Styled Trigger */}
      <ComponentCard
        id="custom-trigger"
        title="Custom Styled Trigger"
        description="Styled trigger with profile card"
      >
        <div className="max-w-md border border-border rounded-lg overflow-hidden">
          <Collapsible>
            <CollapsibleTrigger className="p-4 bg-background-subtle hover:bg-background-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">JD</span>
                </div>
                <div className="text-left">
                  <p className="text-body-sm font-medium">John Doe</p>
                  <p className="text-caption text-foreground-muted">Solar Energy Engineer</p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-4 text-body-sm">
                  <div>
                    <p className="text-foreground-muted">Email</p>
                    <p>john.doe@email.com</p>
                  </div>
                  <div>
                    <p className="text-foreground-muted">Phone</p>
                    <p>(555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-foreground-muted">Location</p>
                    <p>San Francisco, CA</p>
                  </div>
                  <div>
                    <p className="text-foreground-muted">Experience</p>
                    <p>5 years</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ComponentCard>

      {/* Multiple Collapsibles */}
      <ComponentCard
        id="multiple"
        title="Multiple Sections"
        description="Group of independent collapsibles"
      >
        <div className="max-w-md border border-border rounded-lg divide-y divide-border">
          {[
            { title: "Job Description", content: "We are looking for a passionate Solar Energy Engineer to join our growing team..." },
            { title: "Requirements", content: "5+ years experience in solar PV systems, NABCEP certification preferred..." },
            { title: "Benefits", content: "Competitive salary, health insurance, 401k matching, unlimited PTO..." },
          ].map((section) => (
            <Collapsible key={section.title}>
              <CollapsibleTrigger showChevron className="p-3 hover:bg-background-subtle w-full">
                {section.title}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-3 pb-3 text-body-sm text-foreground-muted">
                  {section.content}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ComponentCard>

      {/* Props - Collapsible */}
      <ComponentCard id="props-root" title="Collapsible Props">
        <PropsTable props={collapsibleProps} />
      </ComponentCard>

      {/* Props - Trigger */}
      <ComponentCard id="props-trigger" title="CollapsibleTrigger Props">
        <PropsTable props={triggerProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for progressive disclosure of secondary content",
          "Provide clear visual indication of expandable state",
          "Use showChevron for consistent expand/collapse patterns",
          "Consider defaultOpen for frequently accessed content",
        ]}
        donts={[
          "Don't hide critical information behind collapsibles",
          "Don't use for navigation (use accordion or menu)",
          "Don't nest collapsibles too deeply",
          "Don't change trigger text when state changes",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/collapsible" />
    </div>
  );
}
