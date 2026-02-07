"use client";

import React from "react";
import { Label, Button, Card, CardContent, Badge } from "@/components/ui";
// Rich text editor imported directly to avoid pulling Tiptap into barrel bundle
import {
  RichTextEditor,
  RichTextToolbar,
  RichTextExtendedToolbar,
  RichTextRenderer,
} from "@/components/ui/rich-text-editor";
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
import { Article, Clipboard, Eye, FileText } from "@phosphor-icons/react";

// ============================================
// PROPS DEFINITIONS
// ============================================

const richTextEditorProps = [
  {
    name: "content",
    type: "string",
    default: '""',
    description: "Initial HTML content to populate the editor",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Write your role description here"',
    description: "Placeholder text shown when editor is empty",
  },
  {
    name: "onChange",
    type: "(html: string) => void",
    description: "Callback fired when content changes, receives HTML string",
  },
  {
    name: "onUpdate",
    type: "(editor: Editor) => void",
    description: "Callback fired on update, receives TipTap Editor instance",
  },
  {
    name: "editable",
    type: "boolean",
    default: "true",
    description: "Whether the editor content can be modified",
  },
  {
    name: "autofocus",
    type: "boolean",
    default: "false",
    description: "Whether to focus the editor on mount",
  },
  {
    name: "minHeight",
    type: "string",
    default: '"200px"',
    description: "Minimum height of the editor content area",
  },
  {
    name: "maxHeight",
    type: "string",
    description: "Maximum height with overflow scroll",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Toolbar component(s) to render above the content area",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for the container",
  },
];

const richTextToolbarProps = [
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for the toolbar",
  },
];

const richTextExtendedToolbarProps = [
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for the extended toolbar",
  },
];

const richTextRendererProps = [
  {
    name: "content",
    type: "string",
    required: true,
    description: "HTML content to render (read-only)",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function RichTextEditorPage() {
  const [basicContent, setBasicContent] = React.useState("");
  const [extendedContent, setExtendedContent] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState(
    "<h2>About the Role</h2><p>We are looking for a passionate sustainability professional to join our team...</p>"
  );

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Rich Text Editor</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          A WYSIWYG (What You See Is What You Get) text editor built on TipTap, providing rich text
          formatting capabilities including bold, italic, headings, lists, links, and more. Ideal
          for job descriptions, email templates, and any content that needs formatting.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Form Control
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            TipTap
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            HTML Output
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Job descriptions and role requirements</li>
              <li>Email templates with formatting</li>
              <li>Notes and comments that need rich formatting</li>
              <li>Content that will be rendered as HTML</li>
              <li>Documents requiring headings, lists, and links</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Simple single-line text (use Input)</li>
              <li>Plain text without formatting (use Textarea)</li>
              <li>Structured data entry (use form fields)</li>
              <li>Code editing (use a code editor)</li>
              <li>Markdown-only content (use Markdown editor)</li>
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
              "Outer wrapper with neutral-100 background, neutral-200 border, and 16px radius",
            required: true,
          },
          {
            name: "Toolbar",
            description: "Optional formatting toolbar with grouped buttons for text styling",
          },
          {
            name: "Content Area",
            description: "The editable prose area with proper typography styling",
            required: true,
          },
          {
            name: "Placeholder",
            description: "Ghost text shown when editor is empty (neutral-500 color)",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple rich text editor with the standard toolbar"
      >
        <CodePreview
          code={`import { RichTextEditor, RichTextToolbar } from "@/components/ui";

const [content, setContent] = React.useState("");

<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="Start writing..."
>
  <RichTextToolbar />
</RichTextEditor>`}
        >
          <div className="max-w-2xl space-y-4">
            <Label>Job Description</Label>
            <RichTextEditor
              content={basicContent}
              onChange={setBasicContent}
              placeholder="Start writing your job description..."
            >
              <RichTextToolbar />
            </RichTextEditor>
            <p className="text-caption text-foreground-muted">
              Content length: {basicContent.length} characters
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. TOOLBAR VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Toolbar Variants"
        description="Different toolbar configurations for various use cases"
      >
        <div className="space-y-8">
          {/* Standard Toolbar */}
          <div className="space-y-2">
            <Label className="font-semibold">Standard Toolbar</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Basic formatting: bold, italic, text decoration, alignment, lists, and history
            </p>
            <RichTextEditor
              placeholder="Standard toolbar with essential formatting..."
              minHeight="120px"
            >
              <RichTextToolbar />
            </RichTextEditor>
          </div>

          {/* Extended Toolbar */}
          <div className="space-y-2">
            <Label className="font-semibold">Extended Toolbar</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Full formatting: headings, block elements, links, code blocks, and more
            </p>
            <RichTextEditor
              content={extendedContent}
              onChange={setExtendedContent}
              placeholder="Extended toolbar with all formatting options..."
              minHeight="150px"
            >
              <RichTextExtendedToolbar />
            </RichTextEditor>
          </div>

          {/* No Toolbar */}
          <div className="space-y-2">
            <Label className="font-semibold">No Toolbar (Minimal)</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Clean editor without toolbar - formatting via keyboard shortcuts only
            </p>
            <RichTextEditor
              placeholder="Type here... Use keyboard shortcuts for formatting (Cmd+B for bold, etc.)"
              minHeight="100px"
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. SIZES */}
      {/* ============================================ */}
      <ComponentCard
        id="sizes"
        title="Height Options"
        description="Configure minimum and maximum heights for different contexts"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Compact (minHeight: 100px)</Label>
            <RichTextEditor placeholder="Compact editor for short content..." minHeight="100px">
              <RichTextToolbar />
            </RichTextEditor>
          </div>

          <div className="space-y-2">
            <Label>Default (minHeight: 200px)</Label>
            <RichTextEditor placeholder="Default sized editor..." minHeight="200px">
              <RichTextToolbar />
            </RichTextEditor>
          </div>

          <div className="space-y-2">
            <Label>Large (minHeight: 300px, maxHeight: 400px)</Label>
            <RichTextEditor
              placeholder="Large editor with scroll..."
              minHeight="300px"
              maxHeight="400px"
            >
              <RichTextToolbar />
            </RichTextEditor>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Visual states for different interaction scenarios"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Default</Label>
            <RichTextEditor placeholder="Default editable state..." minHeight="120px">
              <RichTextToolbar />
            </RichTextEditor>
          </div>

          <div className="space-y-2">
            <Label>With Content</Label>
            <RichTextEditor
              content="<p>This editor has <strong>pre-filled content</strong> with formatting.</p>"
              minHeight="120px"
            >
              <RichTextToolbar />
            </RichTextEditor>
          </div>

          <div className="space-y-2">
            <Label>Read Only</Label>
            <RichTextEditor
              content="<p>This content is <em>read-only</em> and cannot be edited.</p>"
              editable={false}
              minHeight="120px"
            />
          </div>

          <div className="space-y-2">
            <Label>Focus State</Label>
            <p className="text-caption text-foreground-muted">
              Green border (green-500) appears when focused
            </p>
            <RichTextEditor placeholder="Click to see focus state..." minHeight="120px">
              <RichTextToolbar />
            </RichTextEditor>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. CONTROLLED USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Using the editor with React state for form integration"
      >
        <CodePreview
          code={`const [content, setContent] = React.useState(
  "<h2>About the Role</h2><p>We are looking for...</p>"
);

<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="Write job description..."
>
  <RichTextExtendedToolbar />
</RichTextEditor>

// Access HTML: content contains the HTML string`}
        >
          <div className="max-w-2xl space-y-4">
            <Label>Job Description (Controlled)</Label>
            <RichTextEditor
              content={jobDescription}
              onChange={setJobDescription}
              placeholder="Write job description..."
              minHeight="150px"
            >
              <RichTextExtendedToolbar />
            </RichTextEditor>
            <div className="rounded-lg bg-background-muted p-3">
              <Label className="mb-1 block text-caption text-foreground-muted">
                HTML Output Preview:
              </Label>
              <code className="break-all text-xs">
                {jobDescription.substring(0, 200)}
                {jobDescription.length > 200 ? "..." : ""}
              </code>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. RENDERER */}
      {/* ============================================ */}
      <ComponentCard
        id="renderer"
        title="Rich Text Renderer"
        description="Read-only display of rich text content"
      >
        <CodePreview
          code={`import { RichTextRenderer } from "@/components/ui";

<RichTextRenderer
  content="<h2>Job Title</h2><p>Description with <strong>formatting</strong>...</p>"
/>`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-foreground-muted" />
              <Label>Rendered Content</Label>
            </div>
            <div className="rounded-lg border border-border-muted bg-background-subtle p-4">
              <RichTextRenderer
                content={`
                  <h2>About This Role</h2>
                  <p>We are looking for a <strong>Senior Sustainability Analyst</strong> to join our growing team. This is an exciting opportunity to make a real impact in the climate tech space.</p>
                  <h3>Key Responsibilities</h3>
                  <ul>
                    <li>Conduct environmental impact assessments</li>
                    <li>Develop sustainability strategies</li>
                    <li>Collaborate with cross-functional teams</li>
                  </ul>
                  <p>Learn more at <a href="#">our careers page</a>.</p>
                `}
              />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. FORMATTING FEATURES */}
      {/* ============================================ */}
      <ComponentCard
        id="formatting"
        title="Formatting Features"
        description="All available formatting options and their keyboard shortcuts"
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Standard Toolbar Features */}
            <div>
              <h4 className="mb-3 font-semibold text-foreground">Standard Toolbar</h4>
              <div className="space-y-2">
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Bold</span>
                  <Badge variant="secondary">Cmd+B</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Italic</span>
                  <Badge variant="secondary">Cmd+I</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Underline</span>
                  <Badge variant="secondary">Cmd+U</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Strikethrough</span>
                  <Badge variant="secondary">Cmd+Shift+S</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Bullet List</span>
                  <Badge variant="secondary">-</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Numbered List</span>
                  <Badge variant="secondary">1.</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Undo / Redo</span>
                  <Badge variant="secondary">Cmd+Z / Cmd+Shift+Z</Badge>
                </div>
              </div>
            </div>

            {/* Extended Toolbar Features */}
            <div>
              <h4 className="mb-3 font-semibold text-foreground">Extended Toolbar (Additional)</h4>
              <div className="space-y-2">
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Heading 1</span>
                  <Badge variant="secondary">H1</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Heading 2</span>
                  <Badge variant="secondary">H2</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Heading 3</span>
                  <Badge variant="secondary">H3</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Blockquote</span>
                  <Badge variant="secondary">&gt;</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Code Block</span>
                  <Badge variant="secondary">```</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Horizontal Rule</span>
                  <Badge variant="secondary">---</Badge>
                </div>
                <div className="flex justify-between rounded bg-background-subtle p-2 text-sm">
                  <span>Link</span>
                  <Badge variant="secondary">Cmd+K</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="RichTextEditor Props">
          <PropsTable props={richTextEditorProps} />
        </ComponentCard>

        <ComponentCard title="RichTextToolbar Props">
          <PropsTable props={richTextToolbarProps} />
        </ComponentCard>

        <ComponentCard title="RichTextExtendedToolbar Props">
          <PropsTable props={richTextExtendedToolbarProps} />
        </ComponentCard>

        <ComponentCard title="RichTextRenderer Props">
          <PropsTable props={richTextRendererProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 11. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use for content that needs HTML formatting (job descriptions, emails)",
            "Provide a visible label above the editor",
            "Use appropriate toolbar variant for the use case",
            "Set sensible min/max heights based on expected content",
            "Use RichTextRenderer for displaying saved content",
            "Sanitize HTML output before storing in database",
          ]}
          donts={[
            "Don't use for simple text without formatting needs",
            "Don't hide the toolbar for complex formatting requirements",
            "Don't allow unlimited height for fixed-space layouts",
            "Don't forget to handle empty state in form validation",
            "Don't render unsanitized user HTML without proper escaping",
            "Don't use multiple editors on the same page without clear labels",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Full keyboard support for all formatting (Cmd+B, Cmd+I, etc.)",
            "**Focus indicator**: Green border clearly indicates when editor is focused",
            "**ARIA labels**: Toolbar buttons include tooltips with keyboard shortcuts",
            "**Screen readers**: Content is properly announced as editable text",
            "**Reduced motion**: Animations respect prefers-reduced-motion setting",
            "**Tab order**: Logical tab order through toolbar buttons and content area",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Textarea",
              href: "/design-system/components/textarea",
              description: "For plain multi-line text without formatting",
            },
            {
              name: "Toolbar",
              href: "/design-system/components/toolbar",
              description: "The underlying toolbar component",
            },
            {
              name: "Input",
              href: "/design-system/components/input",
              description: "For single-line text entry",
            },
            {
              name: "Email Composer",
              href: "/design-system/components/email-composer",
              description: "Uses RichTextEditor for email body",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Job Description Editor"
          description="Creating a job posting with structured content"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-foreground-brand" />
                  <h3 className="text-body-strong text-foreground">Job Description</h3>
                  <Badge variant="secondary">Required</Badge>
                </div>
                <RichTextEditor
                  content={`<h2>About the Role</h2>
<p>We're looking for a passionate <strong>Sustainability Manager</strong> to lead our environmental initiatives.</p>
<h3>Responsibilities</h3>
<ul>
<li>Develop and implement sustainability strategies</li>
<li>Track and report on environmental metrics</li>
<li>Lead cross-functional green initiatives</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>5+ years in sustainability or environmental science</li>
<li>Experience with ESG reporting frameworks</li>
<li>Strong project management skills</li>
</ul>`}
                  minHeight="250px"
                >
                  <RichTextExtendedToolbar />
                </RichTextEditor>
                <div className="flex justify-end gap-3 border-t border-border-muted pt-4">
                  <Button variant="tertiary">Save Draft</Button>
                  <Button variant="primary">Continue</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Notes"
          description="Adding formatted notes to a candidate profile"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Article className="h-5 w-5 text-foreground-brand" />
                    <h3 className="text-body-strong text-foreground">Interview Notes</h3>
                  </div>
                  <Badge>Technical Screen</Badge>
                </div>
                <RichTextEditor placeholder="Add your interview notes here..." minHeight="150px">
                  <RichTextToolbar />
                </RichTextEditor>
                <Button variant="primary" className="w-full">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Email Template Editor"
          description="Creating reusable email templates"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="mb-2 flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-foreground-brand" />
                  <h3 className="text-body-strong text-foreground">
                    Template: Interview Confirmation
                  </h3>
                </div>
                <RichTextEditor
                  content={`<p>Hi {{candidate_first_name}},</p>
<p>Thank you for your interest in the <strong>{{job_title}}</strong> position at {{company_name}}.</p>
<p>We're pleased to confirm your interview scheduled for:</p>
<ul>
<li><strong>Date:</strong> {{interview_date}}</li>
<li><strong>Time:</strong> {{interview_time}}</li>
<li><strong>Interviewer:</strong> {{interviewer_name}}</li>
</ul>
<p>Please let us know if you need to reschedule.</p>
<p>Best regards,<br/>The {{company_name}} Team</p>`}
                  minHeight="200px"
                >
                  <RichTextToolbar />
                </RichTextEditor>
                <div className="flex items-center justify-between border-t border-border-muted pt-4">
                  <p className="text-caption text-foreground-muted">
                    Variables like {"{{candidate_name}}"} will be replaced when sending
                  </p>
                  <Button variant="primary">Save Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/rich-text-editor" />
    </div>
  );
}
