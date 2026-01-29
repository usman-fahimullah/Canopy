"use client";

import React from "react";
import {
  Textarea,
  Label,
  Button,
  Card,
  CardContent,
  InputMessage,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ArrowRight } from "@/components/Icons";

// ============================================
// PROPS DEFINITIONS
// ============================================

const textareaProps = [
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text shown when the textarea is empty",
  },
  {
    name: "variant",
    type: '"default" | "error"',
    default: '"default"',
    description: "Visual variant that affects border color and text styling",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Applies error styling. Shorthand for variant='error'",
  },
  {
    name: "rows",
    type: "number",
    description: "Number of visible text lines. Minimum height is 120px",
  },
  {
    name: "maxLength",
    type: "number",
    description: "Maximum number of characters allowed",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the textarea and applies reduced opacity",
  },
  {
    name: "readOnly",
    type: "boolean",
    default: "false",
    description: "Makes the textarea read-only but still focusable",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function TextareaPage() {
  const [charCount, setCharCount] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const maxLength = 500;

  const getCharCountColor = () => {
    const remaining = maxLength - charCount;
    if (remaining <= 0) return "text-foreground-error";
    if (remaining <= 50) return "text-foreground-warning";
    return "text-foreground-muted";
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="text-heading-lg text-foreground mb-2">
          Textarea
        </h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          Textarea components allow users to enter and edit multi-line text.
          They are ideal for longer content such as descriptions, comments,
          cover letters, and messages. Textareas can be resized vertically by
          default and have a minimum height of 120px.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Form Control
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Multi-line
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Resizable
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Long-form text entry (descriptions, bios)</li>
              <li>• Messages and comments that span multiple lines</li>
              <li>• Cover letters and application responses</li>
              <li>• Notes and feedback requiring paragraph text</li>
              <li>• Any content that benefits from line breaks</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Single-line inputs (use Input instead)</li>
              <li>• Rich text with formatting (use Rich Text Editor)</li>
              <li>• Short answers like names or emails</li>
              <li>• Code editing (use code editor component)</li>
              <li>• Structured data entry (use specialized inputs)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Container",
            description:
              "The outer wrapper with 8px border radius, 16px padding, and neutral-100 background",
            required: true,
          },
          {
            name: "Text Area",
            description:
              "The editable text region with body font size. Allows vertical resize by default",
            required: true,
          },
          {
            name: "Placeholder",
            description:
              "Optional hint text shown when empty (neutral-600 color)",
          },
          {
            name: "Resize Handle",
            description:
              "Browser-native resize control in the bottom-right corner for vertical resizing",
          },
          {
            name: "Character Count",
            description:
              "Optional counter showing current/maximum characters (implement externally)",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest implementation with a label and placeholder"
      >
        <CodePreview
          code={`import { Textarea, Label } from "@/components/ui";

<div className="space-y-2">
  <Label htmlFor="description">Job Description</Label>
  <Textarea
    id="description"
    placeholder="Describe the role and responsibilities..."
  />
</div>`}
        >
          <div className="space-y-2 max-w-lg">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role and responsibilities..."
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. SIZES (ROWS) */}
      {/* ============================================ */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Control visible height with the rows prop"
      >
        <div className="space-y-6 max-w-lg">
          <div className="space-y-2">
            <Label>Small (2 rows)</Label>
            <Textarea rows={2} placeholder="Quick note or short comment..." />
            <p className="text-caption text-foreground-muted">
              Good for brief comments or notes
            </p>
          </div>

          <div className="space-y-2">
            <Label>Default (4 rows)</Label>
            <Textarea rows={4} placeholder="Standard description area..." />
            <p className="text-caption text-foreground-muted">
              Good for moderate-length content
            </p>
          </div>

          <div className="space-y-2">
            <Label>Large (6 rows)</Label>
            <Textarea rows={6} placeholder="Detailed content or long-form text..." />
            <p className="text-caption text-foreground-muted">
              Good for cover letters, detailed descriptions
            </p>
          </div>

          <div className="space-y-2">
            <Label>Extra Large (10 rows)</Label>
            <Textarea rows={10} placeholder="Extended content area..." />
            <p className="text-caption text-foreground-muted">
              Good for job descriptions, full articles
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Visual states for different interaction scenarios"
      >
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
          <div className="space-y-2">
            <Label>Default</Label>
            <Textarea placeholder="Default state" rows={3} />
            <p className="text-caption text-foreground-muted">
              Neutral border, ready for input
            </p>
          </div>

          <div className="space-y-2">
            <Label>Focus</Label>
            <Textarea
              placeholder="Focus state"
              rows={3}
              className="border-primary-500"
            />
            <p className="text-caption text-foreground-muted">
              Primary-500 border when focused
            </p>
          </div>

          <div className="space-y-2">
            <Label>Filled</Label>
            <Textarea
              rows={3}
              defaultValue="This textarea contains user-entered content that spans multiple lines for demonstration."
            />
            <p className="text-caption text-foreground-muted">
              Black text when filled
            </p>
          </div>

          <div className="space-y-2">
            <Label>Error</Label>
            <Textarea error placeholder="Error state" rows={3} />
            <InputMessage status="error">
              Description is required
            </InputMessage>
          </div>

          <div className="space-y-2">
            <Label>Disabled</Label>
            <Textarea disabled placeholder="Cannot edit" rows={3} />
            <p className="text-caption text-foreground-muted">
              50% opacity, no interaction
            </p>
          </div>

          <div className="space-y-2">
            <Label>Read-only</Label>
            <Textarea
              readOnly
              rows={3}
              value="This content is read-only and cannot be modified, but can still be selected and copied."
            />
            <p className="text-caption text-foreground-muted">
              Focusable but not editable
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. CONTROLLED USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Managing textarea state with React hooks"
      >
        <CodePreview
          code={`const [value, setValue] = React.useState("");
const maxLength = 500;

<div className="space-y-2">
  <Label>Description</Label>
  <Textarea
    value={value}
    onChange={(e) => setValue(e.target.value)}
    maxLength={maxLength}
    placeholder="Enter description..."
    error={value.length > maxLength}
  />
  <p className={charCount >= maxLength ? "text-error" : ""}>
    {value.length}/{maxLength} characters
  </p>
</div>`}
        >
          <div className="space-y-2 max-w-lg">
            <Label htmlFor="controlled-textarea">Description</Label>
            <Textarea
              id="controlled-textarea"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setCharCount(e.target.value.length);
              }}
              maxLength={maxLength}
              placeholder="Enter a description for your job posting..."
              rows={4}
              error={charCount > maxLength}
            />
            <div className="flex items-center justify-between">
              <p className="text-caption text-foreground-muted">
                Current length:{" "}
                <code className="bg-background-muted px-1 rounded">
                  {charCount}
                </code>
              </p>
              <p className={`text-caption ${getCharCountColor()}`}>
                {charCount}/{maxLength} characters
              </p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. WITH CHARACTER COUNT */}
      {/* ============================================ */}
      <ComponentCard
        id="character-count"
        title="With Character Count"
        description="Show remaining characters for limited inputs"
      >
        <div className="space-y-6 max-w-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Professional Bio</Label>
              <span className="text-caption text-foreground-muted">
                Max 300 characters
              </span>
            </div>
            <Textarea
              id="bio"
              placeholder="Tell us about your professional background and climate focus..."
              rows={4}
              maxLength={300}
            />
            <div className="flex justify-end">
              <span className="text-caption text-foreground-muted">
                0/300
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cover">Cover Letter</Label>
              <span className="text-caption text-foreground-muted">
                Recommended: 200-500 words
              </span>
            </div>
            <Textarea
              id="cover"
              placeholder="Write your cover letter..."
              rows={8}
            />
            <InputMessage status="info">
              A well-crafted cover letter can significantly improve your chances
            </InputMessage>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. PROPS TABLE */}
      {/* ============================================ */}
      <ComponentCard id="props" title="Props Reference">
        <PropsTable props={textareaProps} />
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="text-heading-sm text-foreground mb-4">
          Usage Guidelines
        </h2>
        <UsageGuide
          dos={[
            "Use for multi-line content like descriptions and comments",
            "Set appropriate row count for expected content length",
            "Show character count when there's a limit",
            "Allow vertical resizing when content length varies",
            "Always pair with a visible label",
            "Provide helpful placeholder text showing expected format",
            "Show validation errors with clear messages",
          ]}
          donts={[
            "Don't use for single-line inputs (use Input instead)",
            "Don't make textareas too small for expected content",
            "Don't hide the resize handle unless layout requires it",
            "Don't use for rich formatted text (use Rich Text Editor)",
            "Don't rely only on placeholder as the label",
            "Don't truncate user input without warning",
            "Don't disable resize without good reason",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 10. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Labels**: Always associate labels with textareas using htmlFor/id",
            "**aria-invalid**: Set to 'true' when error prop is true",
            "**aria-describedby**: Connect to error messages for screen readers",
            "**Resize**: Vertical resize enabled by default for user comfort",
            "**Focus visible**: Clear border color change indicates keyboard focus",
            "**Character limits**: Announce remaining characters to screen readers",
            "**Read-only vs Disabled**: Use readOnly for content that should be copyable",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Input",
              href: "/design-system/components/input",
              description: "For single-line text entry",
            },
            {
              name: "Rich Text Editor",
              href: "/design-system/components/rich-text-editor",
              description: "For formatted text with styling",
            },
            {
              name: "Character Counter",
              href: "/design-system/components/character-counter",
              description: "Dedicated character counting component",
            },
            {
              name: "Label",
              href: "/design-system/components/label",
              description: "Form field labels",
            },
            {
              name: "InputMessage",
              href: "/design-system/components/input",
              description: "Validation and helper messages",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Real-World Examples
        </h2>

        <RealWorldExample
          title="Job Description Editor"
          description="Textarea for entering job posting description"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="job-desc">Job Description *</Label>
                    <span className="text-caption text-foreground-muted">
                      Markdown supported
                    </span>
                  </div>
                  <Textarea
                    id="job-desc"
                    rows={8}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting...

Include:
• Key responsibilities
• Required qualifications
• Why candidates should apply
• Impact they'll have on climate goals"
                  />
                  <InputMessage status="info">
                    Tip: Be specific about how this role contributes to sustainability goals
                  </InputMessage>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border-muted">
                  <Button variant="tertiary">Save Draft</Button>
                  <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                    Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Application Cover Letter"
          description="Textarea in a job application form"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-body-strong text-foreground">
                  Tell Us About Yourself
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="cover-letter">Cover Letter</Label>
                  <Textarea
                    id="cover-letter"
                    rows={10}
                    placeholder="Dear Hiring Manager,

I'm excited to apply for [Position] at [Company]. My background in [relevant experience] aligns well with your mission to [company's climate/sustainability focus].

[Your qualifications and why you're passionate about this role]

Thank you for considering my application.

Best regards,
[Your name]"
                  />
                  <div className="flex items-center justify-between">
                    <InputMessage status="info">
                      Personalize your letter for each application
                    </InputMessage>
                    <span className="text-caption text-foreground-muted">
                      0/2000
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Notes"
          description="Internal notes about a candidate in the ATS"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-body-strong text-foreground">
                    Add Note
                  </h3>
                  <span className="text-caption text-foreground-muted">
                    Only visible to your team
                  </span>
                </div>

                <div className="space-y-2">
                  <Textarea
                    rows={4}
                    placeholder="Add notes about this candidate (interview feedback, screening observations, etc.)..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="tertiary">Cancel</Button>
                  <Button variant="primary">Save Note</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Feedback Form with Validation"
          description="Textarea with error state and validation"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-body-strong text-foreground">
                  Interview Feedback
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="strengths">Candidate Strengths *</Label>
                  <Textarea
                    id="strengths"
                    error
                    rows={3}
                    placeholder="What were the candidate's strongest qualities?"
                  />
                  <InputMessage status="error">
                    Please provide feedback on candidate strengths
                  </InputMessage>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concerns">Areas of Concern</Label>
                  <Textarea
                    id="concerns"
                    rows={3}
                    placeholder="Any concerns or areas for follow-up?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Textarea
                    id="recommendation"
                    rows={3}
                    defaultValue="Strong candidate with excellent solar installation experience. Recommend moving forward to technical assessment."
                  />
                  <InputMessage status="success">
                    Great feedback! This will help the hiring team make informed decisions.
                  </InputMessage>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/textarea" />
    </div>
  );
}
