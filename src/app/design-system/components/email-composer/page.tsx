"use client";

import React from "react";
import {
  EmailComposer,
  QuickReply,
  RecipientInput,
  VariableInserter,
  emailDefaultVariables,
  Label,
  Button,
  Card,
  CardContent,
  Badge,
} from "@/components/ui";
import type {
  EmailRecipient,
  EmailTemplate,
  EmailVariable,
  EmailAttachment,
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
import { EnvelopeSimple, PaperPlaneTilt, Lightning, Calendar, User } from "@phosphor-icons/react";

// ============================================
// SAMPLE DATA
// ============================================

const sampleRecipients: EmailRecipient[] = [
  {
    id: "1",
    email: "john.doe@email.com",
    name: "John Doe",
  },
  {
    id: "2",
    email: "sarah@company.com",
    name: "Sarah Johnson",
  },
];

const sampleAttachments: EmailAttachment[] = [
  {
    id: "att-1",
    name: "JohnCV.pdf",
    size: 12582912,
    type: "application/pdf",
  },
  {
    id: "att-2",
    name: "Portfolio.zip",
    size: 58720256,
    type: "application/zip",
  },
];

const sampleTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Interview Invitation",
    subject: "Interview Invitation - {{job_title}} at {{company_name}}",
    body: `<p>Dear {{candidate_first_name}},</p>
<p>Thank you for applying for the <strong>{{job_title}}</strong> position at {{company_name}}.</p>
<p>We are pleased to invite you for an interview. Please let us know your availability for the following dates:</p>
<ul>
<li>{{interview_date_1}}</li>
<li>{{interview_date_2}}</li>
</ul>
<p>Best regards,<br/>{{sender_name}}<br/>{{company_name}}</p>`,
    category: "Scheduling",
  },
  {
    id: "2",
    name: "Rejection - Generic",
    subject: "Update on your application - {{job_title}}",
    body: `<p>Dear {{candidate_first_name}},</p>
<p>Thank you for your interest in the {{job_title}} position at {{company_name}}.</p>
<p>After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.</p>
<p>We appreciate your time and wish you success in your job search.</p>
<p>Best regards,<br/>{{sender_name}}</p>`,
    category: "Status",
  },
  {
    id: "3",
    name: "Offer Letter",
    subject: "Offer Letter - {{job_title}} at {{company_name}}",
    body: `<p>Dear {{candidate_first_name}},</p>
<p>We are delighted to extend an offer for the <strong>{{job_title}}</strong> position at {{company_name}}!</p>
<p>Please find the details of your offer below:</p>
<ul>
<li><strong>Position:</strong> {{job_title}}</li>
<li><strong>Start Date:</strong> {{start_date}}</li>
<li><strong>Salary:</strong> {{salary}}</li>
</ul>
<p>Please confirm your acceptance by {{response_deadline}}.</p>
<p>Welcome to the team!</p>
<p>{{sender_name}}<br/>{{company_name}}</p>`,
    category: "Offers",
  },
];

const sampleVariables: EmailVariable[] = [
  {
    key: "candidate_first_name",
    label: "Candidate First Name",
    sampleValue: "John",
    category: "candidate",
  },
  {
    key: "candidate_last_name",
    label: "Candidate Last Name",
    sampleValue: "Doe",
    category: "candidate",
  },
  {
    key: "candidate_email",
    label: "Candidate Email",
    sampleValue: "john@email.com",
    category: "candidate",
  },
  {
    key: "job_title",
    label: "Job Title",
    sampleValue: "Senior Sustainability Analyst",
    category: "job",
  },
  {
    key: "company_name",
    label: "Company Name",
    sampleValue: "GreenTech Corp",
    category: "company",
  },
  { key: "sender_name", label: "Sender Name", sampleValue: "Sarah Johnson", category: "other" },
  {
    key: "interview_date",
    label: "Interview Date",
    sampleValue: "January 28, 2026",
    category: "other",
  },
  {
    key: "interview_time",
    label: "Interview Time",
    sampleValue: "10:00 AM PST",
    category: "other",
  },
];

// ============================================
// PROPS DEFINITIONS
// ============================================

const emailComposerProps = [
  { name: "to", type: "EmailRecipient[]", description: "Array of primary recipients" },
  { name: "cc", type: "EmailRecipient[]", description: "Array of CC recipients" },
  { name: "bcc", type: "EmailRecipient[]", description: "Array of BCC recipients" },
  { name: "subject", type: "string", description: "Email subject line" },
  { name: "body", type: "string", description: "Email body content (HTML)" },
  { name: "templates", type: "EmailTemplate[]", description: "Available email templates" },
  { name: "variables", type: "EmailVariable[]", description: "Variables available for insertion" },
  { name: "attachments", type: "EmailAttachment[]", description: "File attachments" },
  {
    name: "onSend",
    type: "(email: EmailPayload) => void",
    description: "Callback when send button is clicked, receives full email payload",
  },
  { name: "onSaveDraft", type: "() => void", description: "Callback when save draft is clicked" },
  {
    name: "onSchedule",
    type: "(date: Date) => void",
    description: "Callback for scheduling email",
  },
  { name: "onDiscard", type: "() => void", description: "Callback when discard is clicked" },
  {
    name: "suggestedRecipients",
    type: "EmailRecipient[]",
    description: "Suggested recipients for autocomplete",
  },
  {
    name: "allowCcBcc",
    type: "boolean",
    default: "true",
    description: "Allow adding CC/BCC recipients",
  },
  {
    name: "allowAttachments",
    type: "boolean",
    default: "true",
    description: "Allow file attachments",
  },
  {
    name: "showAiSuggestions",
    type: "boolean",
    default: "false",
    description: "Show AI writing suggestions",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows loading state on send button",
  },
  {
    name: "characterLimit",
    type: "number",
    default: "2000",
    description: "Character limit for body text. Shows counter in footer when typing.",
  },
  { name: "className", type: "string", description: "Additional CSS classes" },
];

const quickReplyProps = [
  { name: "to", type: "EmailRecipient", required: true, description: "The recipient to reply to" },
  {
    name: "replyTo",
    type: "{ subject: string; body: string }",
    description: "The original message being replied to",
  },
  {
    name: "onSend",
    type: "(body: string) => void",
    required: true,
    description: "Callback when reply is sent",
  },
  { name: "onCancel", type: "() => void", description: "Callback when reply is cancelled" },
  { name: "className", type: "string", description: "Additional CSS classes" },
];

const recipientInputProps = [
  { name: "value", type: "EmailRecipient[]", required: true, description: "Current recipients" },
  {
    name: "onChange",
    type: "(recipients: EmailRecipient[]) => void",
    required: true,
    description: "Callback when recipients change",
  },
  {
    name: "suggestions",
    type: "EmailRecipient[]",
    default: "[]",
    description: "Suggested recipients for autocomplete",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Add recipients..."',
    description: "Placeholder text",
  },
];

const variableInserterProps = [
  {
    name: "variables",
    type: "EmailVariable[]",
    required: true,
    description: "Available variables",
  },
  {
    name: "onInsert",
    type: "(variable: string) => void",
    required: true,
    description: "Callback when a variable is inserted",
  },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the inserter" },
];

const emailRecipientType = [
  { name: "id", type: "string", required: true, description: "Unique identifier" },
  { name: "email", type: "string", required: true, description: "Email address" },
  { name: "name", type: "string", required: true, description: "Display name" },
  { name: "avatar", type: "string", description: "URL to avatar image" },
];

const emailTemplateType = [
  { name: "id", type: "string", required: true, description: "Unique identifier" },
  { name: "name", type: "string", required: true, description: "Template name" },
  { name: "subject", type: "string", required: true, description: "Email subject with variables" },
  { name: "body", type: "string", required: true, description: "Email body HTML with variables" },
  {
    name: "category",
    type: "string",
    description: "Category for grouping (e.g., Scheduling, Offers)",
  },
];

const emailVariableType = [
  {
    name: "key",
    type: "string",
    required: true,
    description: 'Variable key (e.g., "candidate_first_name")',
  },
  {
    name: "label",
    type: "string",
    required: true,
    description: 'Display label (e.g., "Candidate First Name")',
  },
  { name: "description", type: "string", description: "Optional description for the variable" },
  {
    name: "category",
    type: '"candidate" | "job" | "company" | "other"',
    description: "Category for grouping variables",
  },
  { name: "sampleValue", type: "string", description: 'Sample value for preview (e.g., "John")' },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function EmailComposerPage() {
  const [recipients, setRecipients] = React.useState<EmailRecipient[]>([sampleRecipients[0]]);

  const handleSend = (email: {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    subject: string;
    body: string;
  }) => {
    // eslint-disable-next-line no-console
    console.log("Sending email:", email);
  };

  return (
    <div className="space-y-12">
      {/* ── 1. OVERVIEW ── */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Email Composer</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          A modern email composition interface for candidate communications. Features recipient
          chips with avatars, inline subject fields, rich text editing, template selection, variable
          placeholders, attachments, and a streamlined send footer. Designed for ATS workflows.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Communication
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Templates
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            ATS Feature
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Sending interview invitations to candidates</li>
              <li>Rejection or offer communications</li>
              <li>Follow-up emails with templates</li>
              <li>Any candidate communication from the ATS</li>
              <li>Bulk emails with personalization</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Internal team notes (use MentionInput)</li>
              <li>Chat or instant messaging</li>
              <li>Marketing campaigns (use dedicated tools)</li>
              <li>System notifications (automated emails)</li>
              <li>Simple contact forms</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── 2. ANATOMY ── */}
      <ComponentAnatomy
        parts={[
          {
            name: "Header Bar",
            description:
              "Title, template toggle, preview toggle, and window controls (minimize/expand/close)",
            required: true,
          },
          {
            name: "Recipients Section",
            description:
              "Inline To/CC/BCC fields with pill-shaped recipient chips featuring avatars",
            required: true,
          },
          {
            name: "Subject Line",
            description: "Inline subject input with label, separated by subtle dividers",
            required: true,
          },
          {
            name: "Body Editor",
            description:
              "Rich text editor with integrated formatting toolbar and variable inserter",
            required: true,
          },
          {
            name: "Attachments",
            description: "Horizontal chip-style attachment cards with file icons and sizes",
          },
          {
            name: "Footer",
            description:
              "Left: action icons (attach, schedule, emoji, link). Right: character count, draft status, discard, split send button",
          },
        ]}
      />

      {/* ── 3. BASIC USAGE ── */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A complete email composer with templates, variables, and attachments"
      >
        <CodePreview
          code={`import { EmailComposer } from "@/components/ui";

<EmailComposer
  to={[{ id: "1", name: "John Doe", email: "john@email.com" }]}
  templates={templates}
  variables={variables}
  attachments={attachments}
  suggestedRecipients={suggestedRecipients}
  onSend={(email) => console.log("Send:", email)}
  onSaveDraft={() => console.log("Draft saved")}
  onSchedule={(date) => console.log("Schedule:", date)}
  onDiscard={() => console.log("Discard")}
/>`}
        >
          <EmailComposer
            to={[sampleRecipients[0]]}
            templates={sampleTemplates}
            variables={sampleVariables}
            attachments={sampleAttachments}
            suggestedRecipients={sampleRecipients}
            onSend={handleSend}
            // eslint-disable-next-line no-console
            onSaveDraft={() => console.log("Draft saved")}
            // eslint-disable-next-line no-console
            onSchedule={(date) => console.log("Schedule:", date)}
            // eslint-disable-next-line no-console
            onDiscard={() => console.log("Discard")}
          />
        </CodePreview>
      </ComponentCard>

      {/* ── 4. QUICK REPLY ── */}
      <ComponentCard
        id="quick-reply"
        title="Quick Reply"
        description="Compact reply widget for responding to email threads"
      >
        <CodePreview
          code={`import { QuickReply } from "@/components/ui";

<QuickReply
  to={{ id: "1", email: "john@email.com", name: "John Doe" }}
  replyTo={{ subject: "Interview Invitation", body: "..." }}
  onSend={(body) => console.log("Reply:", body)}
  onCancel={() => console.log("Cancelled")}
/>`}
        >
          <div className="max-w-md">
            <QuickReply
              to={sampleRecipients[0]}
              replyTo={{
                subject: "Interview Invitation - Senior Engineer",
                body: "Thank you for your application...",
              }}
              // eslint-disable-next-line no-console
              onSend={(body) => console.log("Reply sent:", body)}
              // eslint-disable-next-line no-console
              onCancel={() => console.log("Cancelled")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ── 5. RECIPIENT INPUT ── */}
      <ComponentCard
        id="recipient-input"
        title="Recipient Input"
        description="Standalone recipient input with autocomplete and avatar chips"
      >
        <CodePreview
          code={`import { RecipientInput } from "@/components/ui";

<RecipientInput
  value={recipients}
  onChange={setRecipients}
  suggestions={contactSuggestions}
  placeholder="Type email or name..."
/>`}
        >
          <div className="max-w-md space-y-4">
            <Label>To:</Label>
            <RecipientInput
              value={recipients}
              onChange={setRecipients}
              suggestions={sampleRecipients}
              placeholder="Type email or name..."
            />
            <p className="text-caption text-foreground-muted">
              Recipients: {recipients.map((r) => r.email).join(", ") || "None"}
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ── 6. VARIABLE INSERTER ── */}
      <ComponentCard
        id="variable-inserter"
        title="Variable Inserter"
        description="Insert dynamic variables into email content"
      >
        <CodePreview
          code={`import { VariableInserter, emailDefaultVariables } from "@/components/ui";

<VariableInserter
  variables={emailDefaultVariables}
  onInsert={(variableKey) => insertAtCursor(variableKey)}
/>`}
        >
          <div className="space-y-4">
            <Label>Available Variables</Label>
            <VariableInserter
              variables={sampleVariables}
              onInsert={(variableKey) => {
                alert(`Inserted: ${variableKey}`);
              }}
            />
            <div className="rounded-lg bg-background-muted p-3">
              <Label className="mb-2 block text-caption text-foreground-muted">
                Default Variables:
              </Label>
              <div className="flex flex-wrap gap-2">
                {emailDefaultVariables.map((v) => (
                  <Badge key={v.key} variant="secondary">
                    {v.key}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ── 7. STATES ── */}
      <ComponentCard
        id="states"
        title="States"
        description="Different states of the email composer"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="font-semibold">With Pre-filled Content + Attachments</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Pre-populated subject, body, and attachments
            </p>
            <EmailComposer
              to={[sampleRecipients[0], sampleRecipients[1]]}
              subject="Application for Product Designer - John Doe"
              body="<p>Hi Albert,</p><p>I hope this message finds you well. I'm writing to express my interest in the Product Designer position. I've attached my resume and portfolio for your review.</p><p>Best regards,<br/>John Doe</p>"
              attachments={sampleAttachments}
              variables={sampleVariables}
              onSend={handleSend}
              // eslint-disable-next-line no-console
              onSaveDraft={() => console.log("Draft saved")}
              // eslint-disable-next-line no-console
              onDiscard={() => console.log("Discard")}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">With CC/BCC Enabled</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Use allowCcBcc prop to enable CC and BCC fields
            </p>
            <EmailComposer
              to={[sampleRecipients[0]]}
              templates={sampleTemplates}
              variables={sampleVariables}
              allowCcBcc
              onSend={handleSend}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Minimal — No Templates</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Simple composer without templates, schedule, or AI suggestions
            </p>
            <EmailComposer
              to={[sampleRecipients[0]]}
              variables={sampleVariables}
              showAiSuggestions={false}
              onSend={handleSend}
            />
          </div>
        </div>
      </ComponentCard>

      {/* ── 8. TEMPLATE WORKFLOW ── */}
      <ComponentCard
        id="templates"
        title="Template Workflow"
        description="How templates work with the email composer"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {sampleTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer transition-colors hover:border-border-brand"
              >
                <CardContent className="pt-4">
                  <div className="mb-2 flex items-start gap-2">
                    <EnvelopeSimple className="mt-0.5 h-4 w-4 text-foreground-brand" />
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="line-clamp-2 text-xs text-foreground-muted">
                        {template.subject}
                      </p>
                    </div>
                  </div>
                  {template.category && (
                    <Badge variant="secondary" className="text-[10px]">
                      {template.category}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-caption text-foreground-muted">
            Click &quot;Templates&quot; in the composer header to browse and select. Variables like{" "}
            <code className="rounded bg-background-muted px-1">{"{{candidate_first_name}}"}</code>{" "}
            are replaced with actual values when sending.
          </p>
        </div>
      </ComponentCard>

      {/* ── 9. PROPS TABLES ── */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="EmailComposer Props">
          <PropsTable props={emailComposerProps} />
        </ComponentCard>

        <ComponentCard title="QuickReply Props">
          <PropsTable props={quickReplyProps} />
        </ComponentCard>

        <ComponentCard title="RecipientInput Props">
          <PropsTable props={recipientInputProps} />
        </ComponentCard>

        <ComponentCard title="VariableInserter Props">
          <PropsTable props={variableInserterProps} />
        </ComponentCard>

        <ComponentCard title="EmailRecipient Type">
          <PropsTable props={emailRecipientType} />
        </ComponentCard>

        <ComponentCard title="EmailTemplate Type">
          <PropsTable props={emailTemplateType} />
        </ComponentCard>

        <ComponentCard title="EmailVariable Type">
          <PropsTable props={emailVariableType} />
        </ComponentCard>
      </div>

      {/* ── 10. USAGE GUIDELINES ── */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Provide commonly used templates for consistency",
            "Include candidate-specific variables for personalization",
            "Show a preview before sending when possible",
            "Allow saving drafts for long compositions",
            "Validate recipient emails before enabling send",
            "Use Quick Reply for frequently sent responses",
          ]}
          donts={[
            "Don't send without recipient validation",
            "Don't lose draft content on accidental navigation",
            "Don't hide important variables from the inserter",
            "Don't allow sending with unresolved {{variables}}",
            "Don't use for high-volume marketing campaigns",
            "Don't skip confirmation for bulk sends",
          ]}
        />
      </div>

      {/* ── 11. ACCESSIBILITY ── */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Tab through all form fields, toolbar buttons, and actions",
            "**Focus management**: Focus moves logically through the composition flow",
            "**Screen readers**: All inputs have proper labels; recipient chips announce name and removal",
            "**Rich text toolbar**: All formatting buttons have accessible names via aria-label",
            "**Variable insertion**: Variables are announced when inserted into the body",
            "**Error states**: Send warnings are announced and visually indicated",
          ]}
        />
      </div>

      {/* ── 12. RELATED COMPONENTS ── */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Rich Text Editor",
              href: "/design-system/components/rich-text-editor",
              description: "The underlying editor for email body",
            },
            {
              name: "Mention Input",
              href: "/design-system/components/mention-input",
              description: "For internal notes with @mentions",
            },
            {
              name: "Combobox",
              href: "/design-system/components/combobox",
              description: "Used in recipient autocomplete",
            },
            {
              name: "Chip",
              href: "/design-system/components/chip",
              description: "Used for displaying recipients",
            },
          ]}
        />
      </div>

      {/* ── 13. REAL-WORLD EXAMPLES ── */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Interview Scheduling"
          description="Sending an interview invitation to a candidate"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-foreground-brand" />
                    <h3 className="text-body-strong text-foreground">Schedule Interview</h3>
                  </div>
                  <Badge variant="info">Interview</Badge>
                </div>
                <EmailComposer
                  to={[sampleRecipients[0]]}
                  subject="Interview Invitation - Senior Sustainability Analyst at GreenTech"
                  body={`<p>Dear John,</p>
<p>We would like to invite you for an interview for the <strong>Senior Sustainability Analyst</strong> position.</p>
<p>Please select a time that works for you:</p>
<ul>
<li>Monday, Jan 27 at 10:00 AM</li>
<li>Tuesday, Jan 28 at 2:00 PM</li>
</ul>
<p>Best regards,<br/>Sarah Johnson<br/>GreenTech Corp</p>`}
                  variables={sampleVariables}
                  onSend={handleSend}
                />
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Quick Response Panel"
          description="Quick reply options for common candidate queries"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightning className="h-5 w-5 text-foreground-brand" />
                  <h3 className="text-body-strong text-foreground">Quick Responses</h3>
                </div>
                <QuickReply
                  to={sampleRecipients[0]}
                  replyTo={{
                    subject: "Application Status - Senior Analyst",
                    body: "I applied for the Senior Analyst position...",
                  }}
                  // eslint-disable-next-line no-console
                  onSend={(body) => console.log("Reply sent:", body)}
                  // eslint-disable-next-line no-console
                  onCancel={() => console.log("Cancelled")}
                />
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Communication Panel"
          description="Full email composer in candidate profile sidebar"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-foreground-brand" />
                    <div>
                      <h3 className="text-body-strong text-foreground">John Doe</h3>
                      <p className="text-caption text-foreground-muted">
                        Senior Sustainability Analyst
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">Screening</Badge>
                </div>
                <div className="border-t border-border-muted pt-4">
                  <EmailComposer
                    to={[sampleRecipients[0]]}
                    templates={sampleTemplates}
                    variables={sampleVariables}
                    suggestedRecipients={sampleRecipients}
                    onSend={handleSend}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/email-composer" />
    </div>
  );
}
