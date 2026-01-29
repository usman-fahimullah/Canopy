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
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  Lightning,
  Calendar,
  User,
} from "@phosphor-icons/react";

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
  },
];

const sampleVariables: EmailVariable[] = [
  { key: "candidate_first_name", label: "Candidate First Name", sampleValue: "John", category: "candidate" },
  { key: "candidate_last_name", label: "Candidate Last Name", sampleValue: "Doe", category: "candidate" },
  { key: "candidate_email", label: "Candidate Email", sampleValue: "john@email.com", category: "candidate" },
  { key: "job_title", label: "Job Title", sampleValue: "Senior Sustainability Analyst", category: "job" },
  { key: "company_name", label: "Company Name", sampleValue: "GreenTech Corp", category: "company" },
  { key: "sender_name", label: "Sender Name", sampleValue: "Sarah Johnson", category: "other" },
  { key: "interview_date", label: "Interview Date", sampleValue: "January 28, 2026", category: "other" },
  { key: "interview_time", label: "Interview Time", sampleValue: "10:00 AM PST", category: "other" },
];

const quickReplies = [
  {
    id: "1",
    label: "Schedule Interview",
    message: "Let me check our availability and get back to you with some time slots.",
  },
  {
    id: "2",
    label: "Request More Info",
    message: "Could you please provide more details about your experience with...",
  },
  {
    id: "3",
    label: "Thanks for Applying",
    message: "Thank you for your interest! We'll review your application and be in touch soon.",
  },
];

// ============================================
// PROPS DEFINITIONS
// ============================================

const emailComposerProps = [
  {
    name: "to",
    type: "EmailRecipient[]",
    description: "Array of primary recipients",
  },
  {
    name: "cc",
    type: "EmailRecipient[]",
    description: "Array of CC recipients",
  },
  {
    name: "bcc",
    type: "EmailRecipient[]",
    description: "Array of BCC recipients",
  },
  {
    name: "subject",
    type: "string",
    description: "Email subject line",
  },
  {
    name: "body",
    type: "string",
    description: "Email body content (HTML)",
  },
  {
    name: "templates",
    type: "EmailTemplate[]",
    description: "Available email templates",
  },
  {
    name: "variables",
    type: "EmailVariable[]",
    description: "Variables available for insertion",
  },
  {
    name: "attachments",
    type: "EmailAttachment[]",
    description: "File attachments",
  },
  {
    name: "onSend",
    type: "(email: EmailPayload) => void",
    description: "Callback when send button is clicked, receives full email payload",
  },
  {
    name: "onSaveDraft",
    type: "() => void",
    description: "Callback when save draft is clicked",
  },
  {
    name: "onSchedule",
    type: "(date: Date) => void",
    description: "Callback for scheduling email",
  },
  {
    name: "onDiscard",
    type: "() => void",
    description: "Callback when discard is clicked",
  },
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
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const quickReplyProps = [
  {
    name: "to",
    type: "EmailRecipient",
    required: true,
    description: "The recipient to reply to",
  },
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
  {
    name: "onCancel",
    type: "() => void",
    description: "Callback when reply is cancelled",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const recipientInputProps = [
  {
    name: "value",
    type: "EmailRecipient[]",
    required: true,
    description: "Current recipients",
  },
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
    type: "(variable: EmailVariable) => void",
    required: true,
    description: "Callback when a variable is inserted",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const emailRecipientType = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier",
  },
  {
    name: "email",
    type: "string",
    required: true,
    description: "Email address",
  },
  {
    name: "name",
    type: "string",
    required: true,
    description: "Display name",
  },
  {
    name: "avatar",
    type: "string",
    description: "URL to avatar image",
  },
];

const emailTemplateType = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier",
  },
  {
    name: "name",
    type: "string",
    required: true,
    description: "Template name",
  },
  {
    name: "subject",
    type: "string",
    required: true,
    description: "Email subject with variables",
  },
  {
    name: "body",
    type: "string",
    required: true,
    description: "Email body HTML with variables",
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
  {
    name: "description",
    type: "string",
    description: "Optional description for the variable",
  },
  {
    name: "category",
    type: '"candidate" | "job" | "company" | "other"',
    description: "Category for grouping variables",
  },
  {
    name: "sampleValue",
    type: "string",
    description: 'Sample value for preview (e.g., "John")',
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function EmailComposerPage() {
  // Recipient input state
  const [recipients, setRecipients] = React.useState<EmailRecipient[]>([sampleRecipients[0]]);

  const handleSend = (email: {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    subject: string;
    body: string;
  }) => {
    console.log("Sending email:", email);
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="text-heading-lg text-foreground mb-2">
          Email Composer
        </h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          A comprehensive email composition interface for sending candidate
          communications. Features template selection, variable placeholders,
          rich text formatting, recipient management, and attachments. Designed
          for ATS workflows where consistent, personalized emails are essential.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Communication
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Templates
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            ATS Feature
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Sending interview invitations to candidates</li>
              <li>Rejection or offer communications</li>
              <li>Follow-up emails with templates</li>
              <li>Any candidate communication from the ATS</li>
              <li>Bulk emails with personalization</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Internal team notes (use MentionInput)</li>
              <li>Chat or instant messaging</li>
              <li>Marketing campaigns (use dedicated tools)</li>
              <li>System notifications (automated emails)</li>
              <li>Simple contact forms</li>
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
            name: "Header",
            description:
              "Template selector dropdown and action buttons (Send, Save Draft)",
            required: true,
          },
          {
            name: "Recipients Section",
            description:
              "To, CC, BCC fields with autocomplete and chip display",
            required: true,
          },
          {
            name: "Subject Line",
            description: "Email subject input with variable support",
            required: true,
          },
          {
            name: "Body Editor",
            description:
              "Rich text editor for email content with toolbar",
            required: true,
          },
          {
            name: "Variable Inserter",
            description: "Dropdown to insert dynamic variables like {{candidate_name}}",
          },
          {
            name: "Attachments",
            description: "File upload area and attachment list",
          },
          {
            name: "Footer Actions",
            description: "Send button with loading state, secondary actions",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A complete email composer with templates and variables"
      >
        <CodePreview
          code={`import { EmailComposer } from "@/components/ui";

<EmailComposer
  to={[{ id: "1", name: "John Doe", email: "john@email.com" }]}
  templates={templates}
  variables={variables}
  suggestedRecipients={suggestedRecipients}
  onSend={(email) => console.log("Send:", email)}
  onSaveDraft={() => console.log("Draft saved")}
/>`}
        >
          <EmailComposer
            to={[sampleRecipients[0]]}
            templates={sampleTemplates}
            variables={sampleVariables}
            suggestedRecipients={sampleRecipients}
            onSend={handleSend}
            onSaveDraft={() => console.log("Draft saved")}
          />
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. QUICK REPLY */}
      {/* ============================================ */}
      <ComponentCard
        id="quick-reply"
        title="Quick Reply"
        description="Compact reply widget for responding to email threads"
      >
        <CodePreview
          code={`import { QuickReply } from "@/components/ui";

<QuickReply
  to={{ id: "1", email: "john@email.com", name: "John Doe" }}
  replyTo={{ subject: "Interview Invitation", body: "Previous message..." }}
  onSend={(body) => console.log("Reply sent:", body)}
  onCancel={() => console.log("Cancelled")}
/>`}
        >
          <div className="max-w-md">
            <QuickReply
              to={sampleRecipients[0]}
              replyTo={{ subject: "Interview Invitation - Senior Engineer", body: "Thank you for your application..." }}
              onSend={(body) => console.log("Reply sent:", body)}
              onCancel={() => console.log("Cancelled")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. RECIPIENT INPUT */}
      {/* ============================================ */}
      <ComponentCard
        id="recipient-input"
        title="Recipient Input"
        description="Standalone recipient input with autocomplete"
      >
        <CodePreview
          code={`import { RecipientInput } from "@/components/ui";

<RecipientInput
  value={recipients}
  onChange={setRecipients}
  suggestions={contactSuggestions}
  placeholder="Add recipients..."
/>`}
        >
          <div className="space-y-4 max-w-md">
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

      {/* ============================================ */}
      {/* 6. VARIABLE INSERTER */}
      {/* ============================================ */}
      <ComponentCard
        id="variable-inserter"
        title="Variable Inserter"
        description="Insert dynamic variables into email content"
      >
        <CodePreview
          code={`import { VariableInserter, emailDefaultVariables } from "@/components/ui";

<VariableInserter
  variables={emailDefaultVariables}
  onInsert={(variableKey) => {
    // Insert {{variableKey}} at cursor position
    insertAtCursor(\`{{\${variableKey}}}\`);
  }}
/>`}
        >
          <div className="space-y-4">
            <Label>Available Variables</Label>
            <VariableInserter
              variables={sampleVariables}
              onInsert={(variableKey) => {
                alert(`Inserted: {{${variableKey}}}`);
              }}
            />
            <div className="p-3 bg-background-muted rounded-lg">
              <Label className="text-caption text-foreground-muted mb-2 block">
                Default Variables Available:
              </Label>
              <div className="flex flex-wrap gap-2">
                {emailDefaultVariables.map((v) => (
                  <Badge key={v.key} variant="secondary">
                    {`{{${v.key}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Different states of the email composer"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="font-semibold">Loading State</Label>
            <p className="text-caption text-foreground-muted mb-2">
              Shows loading indicator on send button
            </p>
            <div className="p-4 border border-border-muted rounded-lg">
              <div className="flex gap-2">
                <Button variant="primary" disabled>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </Button>
                <Button variant="tertiary" disabled>
                  Save Draft
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">With CC/BCC Enabled</Label>
            <p className="text-caption text-foreground-muted mb-2">
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
            <Label className="font-semibold">With Pre-filled Content</Label>
            <p className="text-caption text-foreground-muted mb-2">
              Pass subject and body to pre-fill the composer
            </p>
            <EmailComposer
              to={[sampleRecipients[0]]}
              subject="Interview Invitation - Senior Sustainability Analyst"
              body="<p>Dear John,</p><p>We would like to invite you for an interview...</p>"
              templates={sampleTemplates}
              variables={sampleVariables}
              onSend={handleSend}
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. TEMPLATE WORKFLOW */}
      {/* ============================================ */}
      <ComponentCard
        id="templates"
        title="Template Workflow"
        description="How templates work with the email composer"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {sampleTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:border-border-brand transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <EnvelopeSimple className="h-4 w-4 text-foreground-brand mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-foreground-muted line-clamp-2">
                        {template.subject}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-caption text-foreground-muted">
            Templates are available in the composer dropdown. Variables like{" "}
            <code className="px-1 bg-background-muted rounded">
              {"{{candidate_first_name}}"}
            </code>{" "}
            will be replaced with actual values when sending.
          </p>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Props Reference
        </h2>

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

      {/* ============================================ */}
      {/* 10. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="text-heading-sm text-foreground mb-4">
          Usage Guidelines
        </h2>
        <UsageGuide
          dos={[
            "Always provide commonly used templates for consistency",
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

      {/* ============================================ */}
      {/* 11. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Tab through all form fields and buttons",
            "**Focus management**: Focus moves logically through the composition flow",
            "**Screen readers**: All inputs have proper labels and descriptions",
            "**Rich text toolbar**: Toolbar buttons have accessible names",
            "**Variable insertion**: Variables are announced when inserted",
            "**Error states**: Validation errors are announced and visually indicated",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. RELATED COMPONENTS */}
      {/* ============================================ */}
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

      {/* ============================================ */}
      {/* 13. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Real-World Examples
        </h2>

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
                    <h3 className="text-body-strong text-foreground">
                      Schedule Interview
                    </h3>
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
                  <h3 className="text-body-strong text-foreground">
                    Quick Responses
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label>Quick Reply to Candidate</Label>
                  <QuickReply
                    to={sampleRecipients[0]}
                    replyTo={{ subject: "Application Status - Senior Analyst", body: "I applied for the Senior Analyst position..." }}
                    onSend={(body) => console.log("Reply sent:", body)}
                    onCancel={() => console.log("Cancelled")}
                  />
                </div>
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
                      <h3 className="text-body-strong text-foreground">
                        John Doe
                      </h3>
                      <p className="text-caption text-foreground-muted">
                        Senior Sustainability Analyst
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">Screening</Badge>
                </div>

                <div className="border-t border-border-muted pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <PaperPlaneTilt className="h-4 w-4 text-foreground-muted" />
                    <Label>Send Email</Label>
                  </div>
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
