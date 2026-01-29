"use client";

import React from "react";
import {
  MentionInput,
  MentionTextarea,
  MentionHighlight,
  NoteInput,
  Label,
  Button,
  Card,
  CardContent,
  Badge,
  Avatar,
} from "@/components/ui";
import type { MentionUser, MentionData } from "@/components/ui";
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
import { At, NotePencil, ChatCircle, Bell } from "@phosphor-icons/react";

// ============================================
// SAMPLE DATA
// ============================================

const sampleUsers: MentionUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@greentech.com",
    avatar: "",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@greentech.com",
    avatar: "",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@greentech.com",
    avatar: "",
  },
  {
    id: "4",
    name: "Alex Thompson",
    email: "alex@greentech.com",
    avatar: "",
  },
  {
    id: "5",
    name: "Lisa Park",
    email: "lisa@greentech.com",
    avatar: "",
  },
];

// ============================================
// PROPS DEFINITIONS
// ============================================

const mentionInputProps = [
  {
    name: "value",
    type: "string",
    required: true,
    description: "The current text value of the input",
  },
  {
    name: "onChange",
    type: "(value: string) => void",
    required: true,
    description: "Callback fired when text changes",
  },
  {
    name: "mentions",
    type: "MentionData[]",
    required: true,
    description: "Array of active mentions with their positions",
  },
  {
    name: "onMentionsChange",
    type: "(mentions: MentionData[]) => void",
    required: true,
    description: "Callback fired when mentions array changes",
  },
  {
    name: "users",
    type: "MentionUser[]",
    required: true,
    description: "List of users available for mentioning",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Type @ to mention someone..."',
    description: "Placeholder text when input is empty",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the input",
  },
  {
    name: "trigger",
    type: "string",
    default: '"@"',
    description: "Character that triggers the mention popup",
  },
  {
    name: "minChars",
    type: "number",
    default: "0",
    description: "Minimum characters after trigger before showing suggestions",
  },
  {
    name: "onSearch",
    type: "(query: string) => Promise<MentionUser[]>",
    description: "Async function to search users (for large user lists)",
  },
  {
    name: "onSubmit",
    type: "() => void",
    description: "Callback when user presses Enter (single-line) or Cmd+Enter (multi-line)",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const mentionTextareaProps = [
  {
    name: "rows",
    type: "number",
    default: "3",
    description: "Initial number of visible rows",
  },
  {
    name: "maxRows",
    type: "number",
    default: "10",
    description: "Maximum rows before scrolling",
  },
  {
    name: "...MentionInputProps",
    type: "MentionInputProps",
    description: "All MentionInput props are also accepted",
  },
];

const noteInputProps = [
  {
    name: "onSubmit",
    type: "() => void",
    required: true,
    description: "Callback when submitting the note",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows loading state on submit button",
  },
  {
    name: "...MentionTextareaProps",
    type: "MentionTextareaProps",
    description: "All MentionTextarea props are also accepted",
  },
];

const mentionUserType = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the user",
  },
  {
    name: "name",
    type: "string",
    required: true,
    description: "Display name of the user",
  },
  {
    name: "email",
    type: "string",
    description: "Email address shown in suggestions",
  },
  {
    name: "avatar",
    type: "string",
    description: "URL to user's avatar image",
  },
];

const mentionDataType = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "The mentioned user's ID",
  },
  {
    name: "display",
    type: "string",
    required: true,
    description: "The display name shown in the mention",
  },
  {
    name: "startIndex",
    type: "number",
    required: true,
    description: "Character index where the mention starts",
  },
  {
    name: "endIndex",
    type: "number",
    required: true,
    description: "Character index where the mention ends",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function MentionInputPage() {
  // Basic single-line input
  const [basicValue, setBasicValue] = React.useState("");
  const [basicMentions, setBasicMentions] = React.useState<MentionData[]>([]);

  // Textarea example
  const [textareaValue, setTextareaValue] = React.useState("");
  const [textareaMentions, setTextareaMentions] = React.useState<MentionData[]>([]);

  // Note input example
  const [noteValue, setNoteValue] = React.useState("");
  const [noteMentions, setNoteMentions] = React.useState<MentionData[]>([]);
  const [noteLoading, setNoteLoading] = React.useState(false);

  // Pre-filled example
  const [prefilledValue, setPrefilledValue] = React.useState(
    "Great interview with the candidate! @Sarah Johnson should follow up on technical skills."
  );
  const [prefilledMentions, setPrefilledMentions] = React.useState<MentionData[]>([
    { id: "1", display: "Sarah Johnson", startIndex: 43, endIndex: 57 },
  ]);

  const handleNoteSubmit = () => {
    setNoteLoading(true);
    setTimeout(() => {
      setNoteLoading(false);
      setNoteValue("");
      setNoteMentions([]);
    }, 1500);
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="text-heading-lg text-foreground mb-2">
          Mention Input
        </h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          Text input with @mention functionality for tagging team members in
          notes and comments. Features autocomplete suggestions, keyboard
          navigation, and notification triggers. Available as single-line input,
          multi-line textarea, and a pre-built note input with submit button.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Form Control
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Collaboration
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
              <li>Candidate notes that need to notify team members</li>
              <li>Internal comments on job postings</li>
              <li>Task assignments with user tagging</li>
              <li>Activity feeds where users can be mentioned</li>
              <li>Collaborative review processes</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Public-facing forms (use standard inputs)</li>
              <li>Simple text without collaboration needs</li>
              <li>External communication like emails</li>
              <li>When the user list is very large (&gt;1000 users)</li>
              <li>Rich text formatting is required (use Rich Text Editor)</li>
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
            name: "Input Field",
            description:
              "Text input or textarea with @ icon indicator",
            required: true,
          },
          {
            name: "Trigger Character",
            description:
              'The @ symbol that activates the mention popup (configurable)',
            required: true,
          },
          {
            name: "Suggestion Popup",
            description:
              "Popover showing filtered user suggestions with avatars",
          },
          {
            name: "User Item",
            description:
              "Each suggestion showing avatar, name, and email",
          },
          {
            name: "Mention Highlight",
            description:
              "Visual highlight for inserted mentions (green background)",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Single-line mention input for quick tagging"
      >
        <CodePreview
          code={`import { MentionInput } from "@/components/ui";

const [value, setValue] = React.useState("");
const [mentions, setMentions] = React.useState<MentionData[]>([]);

const users = [
  { id: "1", name: "Sarah Johnson", email: "sarah@company.com" },
  { id: "2", name: "Mike Chen", email: "mike@company.com" },
];

<MentionInput
  value={value}
  onChange={setValue}
  mentions={mentions}
  onMentionsChange={setMentions}
  users={users}
  placeholder="Type @ to mention someone..."
/>`}
        >
          <div className="space-y-4 max-w-md">
            <Label>Quick Mention</Label>
            <MentionInput
              value={basicValue}
              onChange={setBasicValue}
              mentions={basicMentions}
              onMentionsChange={setBasicMentions}
              users={sampleUsers}
              placeholder="Type @ to mention someone..."
            />
            <p className="text-caption text-foreground-muted">
              Mentions: {basicMentions.length > 0
                ? basicMentions.map((m) => m.display).join(", ")
                : "None"}
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different input types for various use cases"
      >
        <div className="space-y-8">
          {/* Single-line Input */}
          <div className="space-y-2">
            <Label className="font-semibold">MentionInput (Single-line)</Label>
            <p className="text-caption text-foreground-muted mb-2">
              For quick, short mentions. Press Enter to submit.
            </p>
            <MentionInput
              value={basicValue}
              onChange={setBasicValue}
              mentions={basicMentions}
              onMentionsChange={setBasicMentions}
              users={sampleUsers}
              placeholder="Quick mention..."
              onSubmit={() => alert("Submitted: " + basicValue)}
            />
          </div>

          {/* Multi-line Textarea */}
          <div className="space-y-2">
            <Label className="font-semibold">MentionTextarea (Multi-line)</Label>
            <p className="text-caption text-foreground-muted mb-2">
              For longer notes. Auto-expands up to maxRows. Press Cmd+Enter to submit.
            </p>
            <MentionTextarea
              value={textareaValue}
              onChange={setTextareaValue}
              mentions={textareaMentions}
              onMentionsChange={setTextareaMentions}
              users={sampleUsers}
              placeholder="Add a detailed note... Type @ to mention someone"
              rows={3}
              maxRows={8}
            />
          </div>

          {/* NoteInput (Pre-built) */}
          <div className="space-y-2">
            <Label className="font-semibold">NoteInput (Pre-built with Submit)</Label>
            <p className="text-caption text-foreground-muted mb-2">
              Complete note input with submit button and loading state.
            </p>
            <NoteInput
              value={noteValue}
              onChange={setNoteValue}
              mentions={noteMentions}
              onMentionsChange={setNoteMentions}
              users={sampleUsers}
              onSubmit={handleNoteSubmit}
              loading={noteLoading}
              placeholder="Add a note... Type @ to mention a team member"
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. MENTION HIGHLIGHT */}
      {/* ============================================ */}
      <ComponentCard
        id="highlight"
        title="Mention Highlight"
        description="Display mentions with visual highlighting in read-only views"
      >
        <CodePreview
          code={`import { MentionHighlight } from "@/components/ui";

const text = "Great work @Sarah Johnson! Let's sync with @Mike Chen tomorrow.";
const mentions = [
  { id: "1", display: "Sarah Johnson", startIndex: 12, endIndex: 26 },
  { id: "2", display: "Mike Chen", startIndex: 47, endIndex: 57 },
];

<MentionHighlight text={text} mentions={mentions} />`}
        >
          <div className="space-y-4">
            <Label>Activity Feed Message</Label>
            <div className="p-4 bg-background-subtle rounded-lg">
              <MentionHighlight
                text="Great work @Sarah Johnson! Let's sync with @Mike Chen tomorrow."
                mentions={[
                  { id: "1", display: "Sarah Johnson", startIndex: 12, endIndex: 26 },
                  { id: "2", display: "Mike Chen", startIndex: 47, endIndex: 57 },
                ]}
              />
            </div>
            <p className="text-caption text-foreground-muted">
              Mentions are highlighted with a green background and are visually distinct.
            </p>
          </div>
        </CodePreview>
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
            <MentionInput
              value=""
              onChange={() => {}}
              mentions={[]}
              onMentionsChange={() => {}}
              users={sampleUsers}
              placeholder="Default state..."
            />
          </div>

          <div className="space-y-2">
            <Label>With Content</Label>
            <MentionInput
              value={prefilledValue}
              onChange={setPrefilledValue}
              mentions={prefilledMentions}
              onMentionsChange={setPrefilledMentions}
              users={sampleUsers}
            />
          </div>

          <div className="space-y-2">
            <Label>Disabled</Label>
            <MentionInput
              value="This input is disabled"
              onChange={() => {}}
              mentions={[]}
              onMentionsChange={() => {}}
              users={sampleUsers}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Loading (async search)</Label>
            <p className="text-caption text-foreground-muted">
              Shows loading spinner when onSearch is provided and searching
            </p>
            <MentionInput
              value=""
              onChange={() => {}}
              mentions={[]}
              onMentionsChange={() => {}}
              users={[]}
              placeholder="Search loads users..."
              onSearch={async (query) => {
                await new Promise((r) => setTimeout(r, 1000));
                return sampleUsers.filter((u) =>
                  u.name.toLowerCase().includes(query.toLowerCase())
                );
              }}
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. CONTROLLED USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Managing mentions state for form integration"
      >
        <CodePreview
          code={`const [value, setValue] = React.useState("");
const [mentions, setMentions] = React.useState<MentionData[]>([]);

const handleSubmit = () => {
  // Extract mentioned user IDs for notifications
  const mentionedUserIds = mentions.map(m => m.id);

  // Send to API
  saveNote({
    content: value,
    mentionedUsers: mentionedUserIds,
  });
};

<NoteInput
  value={value}
  onChange={setValue}
  mentions={mentions}
  onMentionsChange={setMentions}
  users={teamMembers}
  onSubmit={handleSubmit}
/>`}
        >
          <div className="space-y-4 max-w-lg">
            <Label>Candidate Note</Label>
            <NoteInput
              value={noteValue}
              onChange={setNoteValue}
              mentions={noteMentions}
              onMentionsChange={setNoteMentions}
              users={sampleUsers}
              onSubmit={handleNoteSubmit}
              loading={noteLoading}
            />
            <div className="p-3 bg-background-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Current State:</p>
              <p>Value: {noteValue || "(empty)"}</p>
              <p>
                Mentioned Users:{" "}
                {noteMentions.length > 0
                  ? noteMentions.map((m) => m.display).join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. ASYNC SEARCH */}
      {/* ============================================ */}
      <ComponentCard
        id="async-search"
        title="Async User Search"
        description="For large user lists, fetch users dynamically"
      >
        <CodePreview
          code={`<MentionInput
  value={value}
  onChange={setValue}
  mentions={mentions}
  onMentionsChange={setMentions}
  users={[]} // Empty - will use onSearch results
  onSearch={async (query) => {
    const response = await fetch(\`/api/users?q=\${query}\`);
    return response.json();
  }}
  minChars={2} // Require 2 chars before searching
  placeholder="Type @ and at least 2 characters..."
/>`}
        >
          <div className="space-y-4 max-w-md">
            <Label>Team Member Search</Label>
            <MentionInput
              value=""
              onChange={() => {}}
              mentions={[]}
              onMentionsChange={() => {}}
              users={[]}
              onSearch={async (query) => {
                // Simulate API delay
                await new Promise((r) => setTimeout(r, 800));
                return sampleUsers.filter(
                  (u) =>
                    u.name.toLowerCase().includes(query.toLowerCase()) ||
                    u.email?.toLowerCase().includes(query.toLowerCase())
                );
              }}
              minChars={1}
              placeholder="Type @ then start typing a name..."
            />
            <p className="text-caption text-foreground-muted">
              Uses async search - type @ followed by at least 1 character
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Props Reference
        </h2>

        <ComponentCard title="MentionInput Props">
          <PropsTable props={mentionInputProps} />
        </ComponentCard>

        <ComponentCard title="MentionTextarea Props (extends MentionInput)">
          <PropsTable props={mentionTextareaProps} />
        </ComponentCard>

        <ComponentCard title="NoteInput Props (extends MentionTextarea)">
          <PropsTable props={noteInputProps} />
        </ComponentCard>

        <ComponentCard title="MentionUser Type">
          <PropsTable props={mentionUserType} />
        </ComponentCard>

        <ComponentCard title="MentionData Type">
          <PropsTable props={mentionDataType} />
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
            "Use NoteInput for most candidate/job note scenarios",
            "Provide clear placeholder text explaining the @ trigger",
            "Use async search (onSearch) for teams larger than 50 users",
            "Track mentioned users for notification systems",
            "Show MentionHighlight in activity feeds and read-only views",
            "Set appropriate minChars (1-2) to reduce unnecessary searches",
          ]}
          donts={[
            "Don't use for public-facing user input",
            "Don't preload thousands of users - use async search",
            "Don't ignore the mentions array - it's needed for notifications",
            "Don't use MentionTextarea when single-line input suffices",
            "Don't forget to handle the onSubmit callback",
            "Don't use for rich text content (use Rich Text Editor instead)",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Arrow keys to navigate suggestions, Enter to select",
            "**Escape key**: Closes the suggestion popup",
            "**Focus management**: Focus returns to input after selection",
            "**Screen readers**: Suggestions are announced as a listbox",
            "**Visible focus**: Clear focus ring on input and suggestion items",
            "**ARIA**: Uses combobox pattern with proper roles and states",
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
              name: "Input",
              href: "/design-system/components/input",
              description: "For plain text without mentions",
            },
            {
              name: "Textarea",
              href: "/design-system/components/textarea",
              description: "For multi-line text without mentions",
            },
            {
              name: "Combobox",
              href: "/design-system/components/combobox",
              description: "For selecting from a list with search",
            },
            {
              name: "Activity Feed",
              href: "/design-system/components/activity-feed",
              description: "Often displays MentionHighlight content",
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
          title="Candidate Profile Notes"
          description="Adding notes to a candidate's profile with team mentions"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NotePencil className="h-5 w-5 text-foreground-brand" />
                    <h3 className="text-body-strong text-foreground">
                      Interview Notes
                    </h3>
                  </div>
                  <Badge>Technical Screen</Badge>
                </div>

                <NoteInput
                  value={noteValue}
                  onChange={setNoteValue}
                  mentions={noteMentions}
                  onMentionsChange={setNoteMentions}
                  users={sampleUsers}
                  onSubmit={handleNoteSubmit}
                  loading={noteLoading}
                  placeholder="Add your notes... Type @ to notify a team member"
                />

                {/* Previous notes */}
                <div className="border-t border-border-muted pt-4 space-y-3">
                  <p className="text-caption text-foreground-muted">Previous Notes</p>
                  <div className="p-3 bg-background-subtle rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name="Emily Davis" size="xs" />
                      <span className="text-sm font-medium">Emily Davis</span>
                      <span className="text-xs text-foreground-muted">2 hours ago</span>
                    </div>
                    <MentionHighlight
                      text="Strong technical skills. @Sarah Johnson can you schedule the system design round?"
                      mentions={[
                        { id: "1", display: "Sarah Johnson", startIndex: 27, endIndex: 41 },
                      ]}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Quick Comment"
          description="Single-line mention for quick feedback"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ChatCircle className="h-5 w-5 text-foreground-brand" />
                  <h3 className="text-body-strong text-foreground">
                    Quick Feedback
                  </h3>
                </div>
                <div className="flex gap-2">
                  <MentionInput
                    value={basicValue}
                    onChange={setBasicValue}
                    mentions={basicMentions}
                    onMentionsChange={setBasicMentions}
                    users={sampleUsers}
                    placeholder="Add a quick comment..."
                    onSubmit={() => {
                      setBasicValue("");
                      setBasicMentions([]);
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      setBasicValue("");
                      setBasicMentions([]);
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Notification Preview"
          description="Showing who will be notified"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-foreground-brand" />
                  <h3 className="text-body-strong text-foreground">
                    Add Note with Notification
                  </h3>
                </div>

                <MentionTextarea
                  value={textareaValue}
                  onChange={setTextareaValue}
                  mentions={textareaMentions}
                  onMentionsChange={setTextareaMentions}
                  users={sampleUsers}
                  placeholder="Write a note... @mention team members to notify them"
                  rows={3}
                />

                {textareaMentions.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-background-info rounded-lg border border-border-info">
                    <Bell className="h-4 w-4 text-foreground-info" />
                    <span className="text-sm text-foreground-info">
                      {textareaMentions.length} team member
                      {textareaMentions.length !== 1 ? "s" : ""} will be notified:{" "}
                      <strong>{textareaMentions.map((m) => m.display).join(", ")}</strong>
                    </span>
                  </div>
                )}

                <Button variant="primary" className="w-full">
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/mention-input" />
    </div>
  );
}
