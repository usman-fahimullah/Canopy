"use client";

import React from "react";
import { CharacterCounter, RichTextCharacterCounter, Textarea } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const characterCounterProps = [
  { name: "current", type: "number", required: true, description: "Current character count" },
  { name: "max", type: "number", required: true, description: "Maximum character limit" },
  { name: "warningThreshold", type: "number", default: "80", description: "Percentage threshold for warning state (e.g., 80 for 80%)" },
  { name: "showWhenEmpty", type: "boolean", default: "true", description: "Show counter even when count is 0" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const richTextCharacterCounterProps = [
  { name: "htmlContent", type: "string", required: true, description: "HTML content to count (tags stripped)" },
  { name: "max", type: "number", required: true, description: "Maximum character limit" },
  { name: "warningThreshold", type: "number", default: "80", description: "Percentage threshold for warning state" },
  { name: "showWhenEmpty", type: "boolean", default: "true", description: "Show counter even when count is 0" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function CharacterCounterPage() {
  const [text1, setText1] = React.useState("");
  const [text2, setText2] = React.useState("This is some sample text that shows how the counter works when there's content.");
  const [text3, setText3] = React.useState("Getting close to the limit...");

  const richTextContent = "<p>This is <strong>rich text</strong> with <em>formatting</em>.</p>";

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Character Counter
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          CharacterCounter displays character count progress with warning and error
          states. Use with textareas and inputs that have character limits.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Character counter with a textarea"
      >
        <CodePreview
          code={`const [text, setText] = useState("");

<Textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  maxLength={200}
/>
<CharacterCounter current={text.length} max={200} />`}
        >
          <div className="max-w-md space-y-2">
            <Textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Start typing..."
              maxLength={200}
            />
            <CharacterCounter current={text1.length} max={200} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Counter States */}
      <ComponentCard
        id="states"
        title="Counter States"
        description="Normal, warning, and error states"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Normal (0-80%)</p>
            <CharacterCounter current={50} max={200} />
          </div>
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Warning (80-100%)</p>
            <CharacterCounter current={175} max={200} />
          </div>
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Error (over limit)</p>
            <CharacterCounter current={220} max={200} />
          </div>
        </div>
      </ComponentCard>

      {/* With Pre-filled Text */}
      <ComponentCard
        id="with-content"
        title="With Content"
        description="Counter showing existing content length"
      >
        <div className="max-w-md space-y-2">
          <Textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            maxLength={150}
          />
          <CharacterCounter
            current={text2.length}
            max={150}
          />
        </div>
      </ComponentCard>

      {/* Custom Warning Threshold */}
      <ComponentCard
        id="custom-threshold"
        title="Custom Warning Threshold"
        description="Set when the warning state activates"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Default threshold (80%)</p>
            <CharacterCounter current={160} max={200} />
          </div>
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Lower threshold (60%)</p>
            <CharacterCounter current={160} max={200} warningThreshold={60} />
          </div>
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Higher threshold (90%)</p>
            <CharacterCounter current={160} max={200} warningThreshold={90} />
          </div>
        </div>
      </ComponentCard>

      {/* Rich Text Counter */}
      <ComponentCard
        id="rich-text"
        title="Rich Text Counter"
        description="Count characters in HTML content (ignores tags)"
      >
        <div className="space-y-4 max-w-md">
          <div className="p-4 border border-border rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: richTextContent }} />
          </div>
          <RichTextCharacterCounter htmlContent={richTextContent} max={100} />
          <p className="text-caption text-foreground-muted">
            HTML tags are stripped from the count. Only visible text is counted.
          </p>
        </div>
      </ComponentCard>

      {/* Interactive Example */}
      <ComponentCard
        id="interactive"
        title="Interactive Example"
        description="Try approaching and exceeding the limit"
      >
        <div className="max-w-md space-y-2">
          <Textarea
            value={text3}
            onChange={(e) => setText3(e.target.value)}
            placeholder="Type to see the counter change..."
            rows={4}
          />
          <div className="flex justify-end">
            <CharacterCounter current={text3.length} max={50} />
          </div>
        </div>
      </ComponentCard>

      {/* Props - CharacterCounter */}
      <ComponentCard id="props-counter" title="CharacterCounter Props">
        <PropsTable props={characterCounterProps} />
      </ComponentCard>

      {/* Props - RichTextCharacterCounter */}
      <ComponentCard id="props-rich" title="RichTextCharacterCounter Props">
        <PropsTable props={richTextCharacterCounterProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Place counter near the input it relates to",
          "Set appropriate warning thresholds",
          "Use RichTextCharacterCounter for WYSIWYG editors",
          "Use showWhenEmpty=false to hide counter on empty inputs",
        ]}
        donts={[
          "Don't hide the counter when approaching the limit",
          "Don't set warning threshold too low (annoying) or too high (no warning)",
          "Don't use for inputs without character limits",
          "Don't ignore the error state styling",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/character-counter" />
    </div>
  );
}
