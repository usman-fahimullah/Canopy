"use client";

import React from "react";
import { InlineEditableTitle } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const inlineEditableTitleProps = [
  { name: "value", type: "string", required: true, description: "Current title value" },
  { name: "onChange", type: "(value: string) => void", required: true, description: "Callback when value changes" },
  { name: "placeholder", type: "string", default: '"Untitled"', description: "Placeholder when empty" },
  { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Title size" },
  { name: "disabled", type: "boolean", default: "false", description: "Disable editing" },
  { name: "onEditStart", type: "() => void", default: "undefined", description: "Called when editing starts" },
  { name: "onEditEnd", type: "() => void", default: "undefined", description: "Called when editing ends" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function InlineEditableTitlePage() {
  const [title1, setTitle1] = React.useState("Click to edit");
  const [title2, setTitle2] = React.useState("Solar Energy Engineer");
  const [title3, setTitle3] = React.useState("");
  const [smallTitle, setSmallTitle] = React.useState("Small title");
  const [mediumTitle, setMediumTitle] = React.useState("Medium title");
  const [largeTitle, setLargeTitle] = React.useState("Large title");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Inline Editable Title
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          InlineEditableTitle provides a click-to-edit title that seamlessly
          transitions between display and edit modes. Perfect for page headers
          and document titles.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Click to edit inline title"
      >
        <CodePreview
          code={`const [title, setTitle] = useState("Click to edit");

<InlineEditableTitle
  value={title}
  onChange={setTitle}
/>`}
        >
          <div className="max-w-md">
            <InlineEditableTitle
              value={title1}
              onChange={setTitle1}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available title sizes"
      >
        <div className="space-y-6 max-w-md">
          <div>
            <p className="text-caption text-foreground-muted mb-2">Small</p>
            <InlineEditableTitle
              value={smallTitle}
              onChange={setSmallTitle}
              size="sm"
            />
          </div>
          <div>
            <p className="text-caption text-foreground-muted mb-2">Default</p>
            <InlineEditableTitle
              value={mediumTitle}
              onChange={setMediumTitle}
              size="default"
            />
          </div>
          <div>
            <p className="text-caption text-foreground-muted mb-2">Large</p>
            <InlineEditableTitle
              value={largeTitle}
              onChange={setLargeTitle}
              size="lg"
            />
          </div>
        </div>
      </ComponentCard>

      {/* With Placeholder */}
      <ComponentCard
        id="placeholder"
        title="With Placeholder"
        description="Custom placeholder text"
      >
        <div className="max-w-md">
          <InlineEditableTitle
            value={title3}
            onChange={setTitle3}
            placeholder="Enter job title..."
          />
        </div>
      </ComponentCard>

      {/* Disabled State */}
      <ComponentCard
        id="disabled"
        title="Disabled State"
        description="Non-editable title"
      >
        <div className="max-w-md">
          <InlineEditableTitle
            value="Read-only title"
            onChange={() => {}}
            disabled
          />
        </div>
      </ComponentCard>

      {/* In Context */}
      <ComponentCard
        id="in-context"
        title="In Context"
        description="Title in a page header"
      >
        <div className="max-w-2xl p-6 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <InlineEditableTitle
              value={title2}
              onChange={setTitle2}
              size="lg"
            />
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-background-subtle">
                Preview
              </button>
              <button className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Publish
              </button>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-foreground-muted">
            <span>Draft</span>
            <span>•</span>
            <span>Last edited 2 hours ago</span>
          </div>
        </div>
      </ComponentCard>

      {/* With Edit Callbacks */}
      <ComponentCard
        id="with-callbacks"
        title="With Edit Callbacks"
        description="Detect when editing starts and ends"
      >
        <div className="max-w-md">
          <InlineEditableTitle
            value={title1}
            onChange={setTitle1}
            onEditStart={() => console.log("Edit started")}
            onEditEnd={() => console.log("Edit ended, value:", title1)}
            placeholder="Edit to see callbacks"
          />
          <p className="text-caption text-foreground-muted mt-2">
            Check console for edit events
          </p>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={inlineEditableTitleProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for page headers and document titles",
          "Provide meaningful placeholder text",
          "Use onBlur for auto-save functionality",
          "Choose appropriate size for context",
        ]}
        donts={[
          "Don't use for short labels or form fields",
          "Don't nest inside other interactive elements",
          "Don't hide the edit affordance completely",
          "Don't use without proper keyboard support",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/inline-editable-title" />
    </div>
  );
}
