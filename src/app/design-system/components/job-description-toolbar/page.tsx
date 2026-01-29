"use client";

import React from "react";
import {
  JobDescriptionToolbar,
  JobDescriptionToolbarCompact,
  defaultJobSections,
  jobDefaultVariables,
  type JobSection,
  type TemplateVariable,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const jobDescriptionToolbarProps = [
  { name: "headingLevel", type: '"paragraph" | "h1" | "h2" | "h3"', default: '"paragraph"', description: "Current heading level" },
  { name: "onHeadingChange", type: "(level: string) => void", default: "undefined", description: "Heading change callback" },
  { name: "isBold", type: "boolean", default: "false", description: "Bold formatting active" },
  { name: "isItalic", type: "boolean", default: "false", description: "Italic formatting active" },
  { name: "isUnderline", type: "boolean", default: "false", description: "Underline formatting active" },
  { name: "onBoldChange", type: "(value: boolean) => void", default: "undefined", description: "Bold toggle callback" },
  { name: "onItalicChange", type: "(value: boolean) => void", default: "undefined", description: "Italic toggle callback" },
  { name: "onUnderlineChange", type: "(value: boolean) => void", default: "undefined", description: "Underline toggle callback" },
  { name: "alignment", type: '"left" | "center" | "right"', default: '"left"', description: "Text alignment" },
  { name: "onAlignmentChange", type: "(value: string) => void", default: "undefined", description: "Alignment change callback" },
  { name: "listType", type: '"none" | "bullet" | "numbered"', default: '"none"', description: "List type" },
  { name: "onListChange", type: "(value: string) => void", default: "undefined", description: "List type change callback" },
  { name: "onInsertLink", type: "() => void", default: "undefined", description: "Insert link callback" },
  { name: "onInsertSection", type: "(section: JobSection) => void", default: "undefined", description: "Insert section callback" },
  { name: "onInsertVariable", type: "(variable: TemplateVariable) => void", default: "undefined", description: "Insert variable callback" },
  { name: "canUndo", type: "boolean", default: "false", description: "Undo available" },
  { name: "canRedo", type: "boolean", default: "false", description: "Redo available" },
  { name: "onUndo", type: "() => void", default: "undefined", description: "Undo callback" },
  { name: "onRedo", type: "() => void", default: "undefined", description: "Redo callback" },
  { name: "isPreview", type: "boolean", default: "false", description: "Preview mode active" },
  { name: "onPreviewToggle", type: "() => void", default: "undefined", description: "Preview toggle callback" },
  { name: "onCopy", type: "() => void", default: "undefined", description: "Copy callback" },
  { name: "sections", type: "JobSection[]", default: "defaultJobSections", description: "Available sections" },
  { name: "variables", type: "TemplateVariable[]", default: "defaultVariables", description: "Available variables" },
  { name: "disabled", type: "boolean", default: "false", description: "Disable the toolbar" },
];

export default function JobDescriptionToolbarPage() {
  const [headingLevel, setHeadingLevel] = React.useState<"paragraph" | "h1" | "h2" | "h3">("paragraph");
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [alignment, setAlignment] = React.useState<"left" | "center" | "right">("left");
  const [listType, setListType] = React.useState<"none" | "bullet" | "numbered">("none");
  const [isPreview, setIsPreview] = React.useState(false);
  const [lastAction, setLastAction] = React.useState<string>("");

  const handleInsertSection = (section: JobSection) => {
    setLastAction(`Inserted section: ${section.label}`);
  };

  const handleInsertVariable = (variable: TemplateVariable) => {
    setLastAction(`Inserted variable: ${variable.placeholder}`);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Job Description Toolbar
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          JobDescriptionToolbar provides a specialized editing toolbar for job
          descriptions. Includes text formatting, section insertion, template
          variables, and preview toggle.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Full-featured toolbar for job description editing"
      >
        <CodePreview
          code={`<JobDescriptionToolbar
  headingLevel={headingLevel}
  onHeadingChange={setHeadingLevel}
  isBold={isBold}
  onBoldChange={setIsBold}
  onInsertSection={(section) => console.log(section)}
  onInsertVariable={(variable) => console.log(variable)}
/>`}
        >
          <div className="space-y-4">
            <JobDescriptionToolbar
              headingLevel={headingLevel}
              onHeadingChange={setHeadingLevel}
              isBold={isBold}
              isItalic={isItalic}
              isUnderline={isUnderline}
              onBoldChange={setIsBold}
              onItalicChange={setIsItalic}
              onUnderlineChange={setIsUnderline}
              alignment={alignment}
              onAlignmentChange={setAlignment}
              listType={listType}
              onListChange={setListType}
              onInsertLink={() => setLastAction("Insert link dialog opened")}
              onInsertSection={handleInsertSection}
              onInsertVariable={handleInsertVariable}
              canUndo={true}
              canRedo={false}
              onUndo={() => setLastAction("Undo")}
              onRedo={() => setLastAction("Redo")}
              isPreview={isPreview}
              onPreviewToggle={() => setIsPreview(!isPreview)}
              onCopy={() => setLastAction("Content copied")}
            />
            {lastAction && (
              <p className="text-caption text-foreground-muted">
                Last action: {lastAction}
              </p>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Compact Variant */}
      <ComponentCard
        id="compact"
        title="Compact Variant"
        description="Simplified toolbar for smaller spaces"
      >
        <div className="space-y-4">
          <JobDescriptionToolbarCompact
            isBold={isBold}
            isItalic={isItalic}
            onBoldChange={setIsBold}
            onItalicChange={setIsItalic}
            listType={listType}
            onListChange={setListType}
            onInsertLink={() => console.log("Insert link")}
            onInsertSection={(section) => console.log("Insert:", section.label)}
            canUndo={true}
            canRedo={false}
            onUndo={() => console.log("Undo")}
            onRedo={() => console.log("Redo")}
          />
          <p className="text-caption text-foreground-muted">
            Compact version with essential formatting options
          </p>
        </div>
      </ComponentCard>

      {/* Default Sections */}
      <ComponentCard
        id="sections"
        title="Default Sections"
        description="Pre-built section templates for job descriptions"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {defaultJobSections.map((section) => (
            <div
              key={section.id}
              className="p-4 border border-border rounded-lg hover:bg-background-subtle"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-600 [&>svg]:w-5 [&>svg]:h-5">
                  {section.icon}
                </span>
                <h4 className="font-medium">{section.label}</h4>
              </div>
              <pre className="text-xs text-foreground-muted whitespace-pre-wrap line-clamp-3">
                {section.template}
              </pre>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Template Variables */}
      <ComponentCard
        id="variables"
        title="Template Variables"
        description="Dynamic placeholders for job templates"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 font-medium">Label</th>
                <th className="text-left py-2 px-4 font-medium">Placeholder</th>
                <th className="text-left py-2 px-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {jobDefaultVariables.map((variable) => (
                <tr key={variable.id} className="border-b border-border">
                  <td className="py-2 px-4">{variable.label}</td>
                  <td className="py-2 px-4">
                    <code className="text-xs bg-background-subtle px-2 py-1 rounded">
                      {variable.placeholder}
                    </code>
                  </td>
                  <td className="py-2 px-4 text-foreground-muted">{variable.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* Disabled State */}
      <ComponentCard
        id="disabled"
        title="Disabled State"
        description="Toolbar in disabled state"
      >
        <JobDescriptionToolbar disabled />
      </ComponentCard>

      {/* In Context */}
      <ComponentCard
        id="in-context"
        title="In Context"
        description="Toolbar with editor area"
      >
        <div className="border border-border rounded-lg overflow-hidden">
          <JobDescriptionToolbar
            headingLevel={headingLevel}
            onHeadingChange={setHeadingLevel}
            isBold={isBold}
            isItalic={isItalic}
            isUnderline={isUnderline}
            onBoldChange={setIsBold}
            onItalicChange={setIsItalic}
            onUnderlineChange={setIsUnderline}
            alignment={alignment}
            onAlignmentChange={setAlignment}
            listType={listType}
            onListChange={setListType}
            onInsertSection={handleInsertSection}
            onInsertVariable={handleInsertVariable}
            isPreview={isPreview}
            onPreviewToggle={() => setIsPreview(!isPreview)}
            className="border-b border-border"
          />
          <div className="p-4 min-h-[200px]">
            {isPreview ? (
              <div className="prose prose-sm max-w-none">
                <h2>About the Role</h2>
                <p>
                  We&apos;re looking for a passionate Solar Energy Engineer to join our
                  growing team. You&apos;ll work on cutting-edge renewable energy projects
                  that make a real impact on climate change.
                </p>
              </div>
            ) : (
              <div className="text-foreground-muted text-center py-12">
                <p>Editor content area</p>
                <p className="text-caption mt-2">
                  Use the toolbar above to format your job description
                </p>
              </div>
            )}
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="JobDescriptionToolbar Props">
        <PropsTable props={jobDescriptionToolbarProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for job description editing workflows",
          "Include section templates for consistency",
          "Provide template variables for reusable content",
          "Show preview mode for final review",
        ]}
        donts={[
          "Don't use for general text editing",
          "Don't remove essential formatting options",
          "Don't hide undo/redo functionality",
          "Don't disable preview in production",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/job-description-toolbar" />
    </div>
  );
}
