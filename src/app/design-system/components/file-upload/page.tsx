"use client";

import React from "react";
import { FileUpload, Label } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const fileUploadProps = [
  {
    name: "accept",
    type: "string",
    default: "undefined",
    description: 'Accepted file types (e.g., "image/*,.pdf")',
  },
  { name: "multiple", type: "boolean", default: "false", description: "Allow multiple files" },
  { name: "maxSize", type: "number", default: "10MB", description: "Maximum file size in bytes" },
  { name: "maxFiles", type: "number", default: "10", description: "Maximum number of files" },
  { name: "disabled", type: "boolean", default: "false", description: "Disable the uploader" },
  { name: "value", type: "File[]", default: "[]", description: "Files already selected" },
  {
    name: "onChange",
    type: "(files: File[]) => void",
    default: "undefined",
    description: "Callback when files change",
  },
  {
    name: "onUpload",
    type: "(files: File[]) => Promise<void>",
    default: "undefined",
    description: "Custom upload handler",
  },
  {
    name: "onError",
    type: "(error: string) => void",
    default: "undefined",
    description: "Callback on error",
  },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Dropzone size" },
];

export default function FileUploadPage() {
  const [error, setError] = React.useState<string | null>(null);

  const handleUpload = async (files: File[]) => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // eslint-disable-next-line no-console
    console.log("Uploaded files:", files);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          File Upload
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          FileUpload provides a drag-and-drop zone for file uploads. It supports file validation,
          progress indication, and multiple file selection.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard id="basic-usage" title="Basic Usage" description="Simple file upload dropzone">
        <CodePreview
          code={`<FileUpload
  onChange={(files) => console.log(files)}
/>`}
        >
          <div className="max-w-md">
            {/* eslint-disable-next-line no-console */}
            <FileUpload onChange={(files) => console.log("Selected:", files)} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Resume Upload */}
      <ComponentCard
        id="resume-upload"
        title="Resume Upload"
        description="Configured for resume/CV uploads"
      >
        <div className="max-w-md space-y-2">
          <Label>Upload Resume</Label>
          <FileUpload accept=".pdf,.doc,.docx" maxSize={5 * 1024 * 1024} onError={setError} />
          {error && <p className="text-semantic-error text-caption">{error}</p>}
          <p className="text-caption text-foreground-muted">
            Accepted formats: PDF, DOC, DOCX (max 5MB)
          </p>
        </div>
      </ComponentCard>

      {/* Multiple Files */}
      <ComponentCard
        id="multiple"
        title="Multiple Files"
        description="Allow selecting multiple files"
      >
        <div className="max-w-md space-y-2">
          <Label>Upload Documents</Label>
          <FileUpload
            multiple
            maxFiles={5}
            accept=".pdf,.doc,.docx,.txt"
            // eslint-disable-next-line no-console
            onChange={(files) => console.log("Files:", files)}
          />
          <p className="text-caption text-foreground-muted">Upload up to 5 documents</p>
        </div>
      </ComponentCard>

      {/* Image Upload */}
      <ComponentCard id="image-upload" title="Image Upload" description="Configured for images">
        <div className="max-w-md space-y-2">
          <Label>Company Logo</Label>
          <FileUpload accept="image/*" maxSize={2 * 1024 * 1024} />
          <p className="text-caption text-foreground-muted">PNG, JPG, or GIF (max 2MB)</p>
        </div>
      </ComponentCard>

      {/* With Upload Handler */}
      <ComponentCard
        id="with-handler"
        title="With Upload Handler"
        description="Automatic upload with progress"
      >
        <div className="max-w-md space-y-2">
          <Label>Upload with Progress</Label>
          <FileUpload onUpload={handleUpload} accept=".pdf" />
          <p className="text-caption text-foreground-muted">
            Files will automatically upload with progress indication
          </p>
        </div>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard id="sizes" title="Sizes" description="Available dropzone sizes">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label>Small</Label>
            <FileUpload size="sm" />
          </div>
          <div className="space-y-2">
            <Label>Medium (default)</Label>
            <FileUpload size="md" />
          </div>
          <div className="space-y-2">
            <Label>Large</Label>
            <FileUpload size="lg" />
          </div>
        </div>
      </ComponentCard>

      {/* Disabled State */}
      <ComponentCard id="disabled" title="Disabled State" description="Disabled file upload">
        <div className="max-w-md space-y-2">
          <Label className="text-foreground-muted">Upload (disabled)</Label>
          <FileUpload disabled />
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={fileUploadProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Specify accepted file types clearly",
          "Show file size limits",
          "Provide progress feedback for uploads",
          "Allow removing uploaded files",
        ]}
        donts={[
          "Don't accept all file types without filtering",
          "Don't set unreasonably large size limits",
          "Don't hide upload errors from users",
          "Don't auto-upload without user consent",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/file-upload" />
    </div>
  );
}
