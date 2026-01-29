"use client";

import React from "react";
import {
  FormCard,
  FormSection,
  FormField,
  FormTitleInput,
  FormRow,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Label,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const formCardProps = [
  { name: "children", type: "ReactNode", required: true, description: "Card content" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const formSectionProps = [
  { name: "title", type: "string", default: "undefined", description: "Section title" },
  { name: "description", type: "string", default: "undefined", description: "Section description" },
  { name: "children", type: "ReactNode", required: true, description: "Section content" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const formFieldProps = [
  { name: "label", type: "string", required: true, description: "Field label" },
  { name: "helpText", type: "string", default: "undefined", description: "Help text below the label" },
  { name: "error", type: "string", default: "undefined", description: "Error message" },
  { name: "required", type: "boolean", default: "false", description: "Show required indicator" },
  { name: "children", type: "ReactNode", required: true, description: "Form input element" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const formTitleInputProps = [
  { name: "placeholder", type: "string", default: '"Untitled"', description: "Placeholder/title text" },
  { name: "required", type: "boolean", default: "false", description: "Show required indicator (*)" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const formRowProps = [
  { name: "children", type: "ReactNode", required: true, description: "Row content (usually 2-3 FormFields)" },
  { name: "columns", type: "2 | 3", default: "2", description: "Number of columns in the row" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function FormSectionPage() {

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Form Section
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Form layout components for organizing complex forms. Includes FormCard,
          FormSection, FormField, FormTitleInput, and FormRow for structured form layouts.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="FormCard with FormSection and FormField"
      >
        <CodePreview
          code={`<FormCard>
  <FormSection title="Basic Information">
    <FormField label="Name" required>
      <Input placeholder="Enter name" />
    </FormField>
    <FormField label="Email" helpText="We'll use this for notifications">
      <Input type="email" placeholder="email@example.com" />
    </FormField>
  </FormSection>
</FormCard>`}
        >
          <div className="max-w-2xl">
            <FormCard>
              <FormSection title="Basic Information">
                <FormField label="Name" required>
                  <Input placeholder="Enter name" />
                </FormField>
                <FormField label="Email" helpText="We'll use this for notifications">
                  <Input type="email" placeholder="email@example.com" />
                </FormField>
              </FormSection>
            </FormCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Form Title Input */}
      <ComponentCard
        id="title-input"
        title="Form Title Input"
        description="Static title placeholder for form headers"
      >
        <div className="max-w-2xl">
          <FormCard>
            <FormTitleInput placeholder="Job Title" />
            <FormSection>
              <FormField label="Department">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </FormSection>
          </FormCard>
        </div>
      </ComponentCard>

      {/* Form Row */}
      <ComponentCard
        id="form-row"
        title="Form Row"
        description="Arrange fields in columns"
      >
        <div className="max-w-2xl">
          <FormCard>
            <FormSection title="Contact Information">
              <FormRow columns={2}>
                <FormField label="First Name" required>
                  <Input placeholder="John" />
                </FormField>
                <FormField label="Last Name" required>
                  <Input placeholder="Doe" />
                </FormField>
              </FormRow>
              <FormRow columns={3}>
                <FormField label="City">
                  <Input placeholder="San Francisco" />
                </FormField>
                <FormField label="State">
                  <Input placeholder="CA" />
                </FormField>
                <FormField label="Zip">
                  <Input placeholder="94102" />
                </FormField>
              </FormRow>
            </FormSection>
          </FormCard>
        </div>
      </ComponentCard>

      {/* With Errors */}
      <ComponentCard
        id="with-errors"
        title="With Errors"
        description="Form fields showing validation errors"
      >
        <div className="max-w-2xl">
          <FormCard>
            <FormSection title="Account Setup">
              <FormField label="Username" required error="Username is already taken">
                <Input placeholder="johndoe" defaultValue="admin" />
              </FormField>
              <FormField label="Password" required error="Password must be at least 8 characters">
                <Input type="password" defaultValue="123" />
              </FormField>
            </FormSection>
          </FormCard>
        </div>
      </ComponentCard>

      {/* Multiple Sections */}
      <ComponentCard
        id="multiple-sections"
        title="Multiple Sections"
        description="Complex form with multiple sections"
      >
        <div className="max-w-2xl">
          <FormCard>
            <FormTitleInput placeholder="Senior Solar Engineer" />

            <FormSection
              title="Job Details"
              description="Basic information about the position"
            >
              <FormRow>
                <FormField label="Department" required>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Location" required>
                  <Input placeholder="e.g., San Francisco, CA" />
                </FormField>
              </FormRow>
              <FormField label="Description">
                <Textarea placeholder="Describe the role..." rows={4} />
              </FormField>
            </FormSection>

            <FormSection
              title="Requirements"
              description="Minimum qualifications for candidates"
            >
              <FormField label="Years of Experience">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <div className="flex items-center gap-2">
                <Checkbox id="remote" />
                <Label htmlFor="remote">Remote work available</Label>
              </div>
            </FormSection>
          </FormCard>
        </div>
      </ComponentCard>

      {/* Props - FormCard */}
      <ComponentCard id="props-card" title="FormCard Props">
        <PropsTable props={formCardProps} />
      </ComponentCard>

      {/* Props - FormSection */}
      <ComponentCard id="props-section" title="FormSection Props">
        <PropsTable props={formSectionProps} />
      </ComponentCard>

      {/* Props - FormField */}
      <ComponentCard id="props-field" title="FormField Props">
        <PropsTable props={formFieldProps} />
      </ComponentCard>

      {/* Props - FormTitleInput */}
      <ComponentCard id="props-title" title="FormTitleInput Props">
        <PropsTable props={formTitleInputProps} />
      </ComponentCard>

      {/* Props - FormRow */}
      <ComponentCard id="props-row" title="FormRow Props">
        <PropsTable props={formRowProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Group related fields into sections",
          "Use FormRow for side-by-side fields",
          "Provide helpful descriptions for complex fields",
          "Mark required fields clearly",
        ]}
        donts={[
          "Don't nest FormCards inside each other",
          "Don't use too many columns on mobile",
          "Don't hide error messages from users",
          "Don't overload sections with too many fields",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/form-section" />
    </div>
  );
}
