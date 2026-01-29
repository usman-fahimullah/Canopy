"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionCard,
} from "@/components/ui/accordion";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const accordionProps = [
  { name: "type", type: '"single" | "multiple"', default: '"single"', description: "Allow single or multiple items open" },
  { name: "collapsible", type: "boolean", default: "false", description: "Allow all items to be collapsed (single type only)" },
  { name: "defaultValue", type: "string | string[]", default: "undefined", description: "Initially open item(s)" },
  { name: "value", type: "string | string[]", default: "undefined", description: "Controlled open item(s)" },
  { name: "onValueChange", type: "(value) => void", default: "undefined", description: "Called when open state changes" },
];

const accordionItemProps = [
  { name: "value", type: "string", required: true, description: "Unique identifier for the item" },
  { name: "disabled", type: "boolean", default: "false", description: "Disable the item" },
];

const accordionTriggerProps = [
  { name: "hideIcon", type: "boolean", default: "false", description: "Hide the chevron icon" },
];

export default function AccordionPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Accordion
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Accordions organize content into collapsible sections. Use them to reduce
          visual complexity while keeping content accessible.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Single-select accordion"
      >
        <CodePreview
          code={`<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Canopy ATS?</AccordionTrigger>
    <AccordionContent>
      Canopy is an applicant tracking system...
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
        >
          <Accordion type="single" collapsible className="max-w-lg">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Canopy ATS?</AccordionTrigger>
              <AccordionContent>
                Canopy is an applicant tracking system built specifically for climate-focused
                employers. It combines AI-powered candidate matching with a beautiful career
                page builder.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does AI matching work?</AccordionTrigger>
              <AccordionContent>
                Our AI analyzes job requirements and candidate profiles to calculate a match
                score. It considers skills, experience, certifications, and values alignment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I customize my career page?</AccordionTrigger>
              <AccordionContent>
                Yes! Use our drag-and-drop builder to create a fully branded career page.
                Add your logo, colors, team photos, and impact metrics.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CodePreview>
      </ComponentCard>

      {/* Multiple Selection */}
      <ComponentCard
        id="multiple"
        title="Multiple Selection"
        description="Allow multiple items to be open simultaneously"
      >
        <Accordion type="multiple" className="max-w-lg">
          <AccordionItem value="benefits">
            <AccordionTrigger>Benefits</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-1">
                <li>Competitive salary</li>
                <li>Health insurance</li>
                <li>401(k) matching</li>
                <li>Flexible PTO</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="requirements">
            <AccordionTrigger>Requirements</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-1">
                <li>3+ years experience</li>
                <li>NABCEP certification preferred</li>
                <li>Strong communication skills</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="responsibilities">
            <AccordionTrigger>Responsibilities</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-1">
                <li>Lead installation teams</li>
                <li>Ensure safety compliance</li>
                <li>Train junior technicians</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ComponentCard>

      {/* Default Open */}
      <ComponentCard
        id="default-open"
        title="Default Open"
        description="Pre-expand specific items on load"
      >
        <Accordion type="single" defaultValue="overview" collapsible className="max-w-lg">
          <AccordionItem value="overview">
            <AccordionTrigger>Job Overview</AccordionTrigger>
            <AccordionContent>
              This position focuses on installing residential solar systems in the Bay Area.
              You&apos;ll work directly with homeowners and lead a team of installers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="qualifications">
            <AccordionTrigger>Qualifications</AccordionTrigger>
            <AccordionContent>
              We&apos;re looking for candidates with hands-on solar experience and strong
              leadership skills.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ComponentCard>

      {/* Card Style */}
      <ComponentCard
        id="card-style"
        title="Card Style"
        description="Bordered card variant for standalone sections"
      >
        <div className="space-y-3 max-w-lg">
          <Accordion type="single" collapsible>
            <AccordionCard value="faq-1">
              <AccordionTrigger className="px-4">
                How do I reset my password?
              </AccordionTrigger>
              <AccordionContent className="px-4">
                Click &quot;Forgot Password&quot; on the login page and enter your email.
                You&apos;ll receive a reset link within 5 minutes.
              </AccordionContent>
            </AccordionCard>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionCard value="faq-2">
              <AccordionTrigger className="px-4">
                Can I import candidates from other systems?
              </AccordionTrigger>
              <AccordionContent className="px-4">
                Yes! We support CSV import and have direct integrations with LinkedIn
                Recruiter and Indeed.
              </AccordionContent>
            </AccordionCard>
          </Accordion>
        </div>
      </ComponentCard>

      {/* Without Icon */}
      <ComponentCard
        id="without-icon"
        title="Without Icon"
        description="Hide the chevron for custom designs"
      >
        <Accordion type="single" collapsible className="max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger hideIcon>
              <span className="flex items-center gap-2">
                <span className="text-primary-600">→</span>
                Click to expand
              </span>
            </AccordionTrigger>
            <AccordionContent>
              Custom trigger content without the default chevron icon.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common accordion patterns in an ATS"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">FAQ Section</p>
            <Accordion type="single" collapsible className="max-w-lg">
              <AccordionItem value="faq-1">
                <AccordionTrigger>What file formats do you accept for resumes?</AccordionTrigger>
                <AccordionContent>
                  We accept PDF, DOC, DOCX, and TXT files up to 5MB in size.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>How long does the hiring process take?</AccordionTrigger>
                <AccordionContent>
                  Our typical hiring process takes 2-3 weeks from application to offer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Job Details Sections</p>
            <Accordion type="multiple" defaultValue={["description"]} className="max-w-lg">
              <AccordionItem value="description">
                <AccordionTrigger>Job Description</AccordionTrigger>
                <AccordionContent>
                  We&apos;re seeking a passionate Solar Installation Lead to join our growing team...
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="requirements">
                <AccordionTrigger>Requirements</AccordionTrigger>
                <AccordionContent>
                  5+ years of solar installation experience, NABCEP certification...
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="benefits">
                <AccordionTrigger>Benefits & Perks</AccordionTrigger>
                <AccordionContent>
                  Competitive salary, health insurance, 401(k) matching, equity options...
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-3">Accordion</h4>
            <PropsTable props={accordionProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">AccordionItem</h4>
            <PropsTable props={accordionItemProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">AccordionTrigger</h4>
            <PropsTable props={accordionTriggerProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Accordion accessibility features"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Uses proper ARIA attributes for disclosure pattern
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Arrow keys navigate between triggers
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Enter/Space toggles content
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Focus visible on keyboard navigation
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Smooth animation respects reduced motion
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for content that doesn't need to be visible at once",
          "Group related content in accordion sections",
          "Use clear, descriptive trigger labels",
          "Consider which items should be open by default",
        ]}
        donts={[
          "Don't hide critical information in accordions",
          "Don't use for primary navigation",
          "Don't nest accordions within accordions",
          "Don't use for content users will access frequently",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/accordion" />
    </div>
  );
}
