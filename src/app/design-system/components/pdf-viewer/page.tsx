"use client";

import React from "react";
import {
  PdfViewer,
  PdfToolbar,
  ResumeViewer,
  DocumentPreviewCard,
} from "@/components/ui/pdf-viewer";
import type { PdfViewerProps, ResumeViewerProps } from "@/components/ui/pdf-viewer";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  FilePdf,
  Eye,
  DownloadSimple,
  Trash,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsOut,
  Printer,
} from "@phosphor-icons/react";

// Sample PDF URL for demos
const SAMPLE_PDF_URL = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf";

// Props documentation
const pdfViewerProps = [
  {
    name: "src",
    type: "string | File",
    required: true,
    description: "PDF source - URL or File object",
  },
  {
    name: "title",
    type: "string",
    description: "Title to display in header",
  },
  {
    name: "initialPage",
    type: "number",
    default: "1",
    description: "Initial page number to display",
  },
  {
    name: "initialZoom",
    type: "number",
    default: "1",
    description: "Initial zoom level (1 = 100%)",
  },
  {
    name: "showToolbar",
    type: "boolean",
    default: "true",
    description: "Show the toolbar with controls",
  },
  {
    name: "showThumbnails",
    type: "boolean",
    default: "false",
    description: "Show page thumbnails sidebar",
  },
  {
    name: "allowDownload",
    type: "boolean",
    default: "true",
    description: "Allow downloading the PDF",
  },
  {
    name: "allowPrint",
    type: "boolean",
    default: "true",
    description: "Allow printing the PDF",
  },
  {
    name: "onPageChange",
    type: "(page: number) => void",
    description: "Callback when page changes",
  },
  {
    name: "onLoad",
    type: "(numPages: number) => void",
    description: "Callback when document loads",
  },
  {
    name: "onError",
    type: "(error: Error) => void",
    description: "Callback on error",
  },
  {
    name: "height",
    type: "string | number",
    default: '"600px"',
    description: "Height of the viewer",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const resumeViewerProps = [
  {
    name: "src",
    type: "string | File",
    required: true,
    description: "Resume PDF source",
  },
  {
    name: "candidateName",
    type: "string",
    description: "Candidate name for context",
  },
  {
    name: "uploadedAt",
    type: "Date",
    description: "Resume upload date",
  },
  {
    name: "fileSize",
    type: "number",
    description: "File size in bytes",
  },
  {
    name: "showParsingHighlights",
    type: "boolean",
    default: "false",
    description: "Show ATS parsing highlights",
  },
  {
    name: "...PdfViewerProps",
    type: "-",
    description: "All PdfViewer props except showThumbnails",
  },
];

const documentPreviewCardProps = [
  {
    name: "title",
    type: "string",
    required: true,
    description: "Document title",
  },
  {
    name: "src",
    type: "string | File",
    required: true,
    description: "Document source",
  },
  {
    name: "type",
    type: '"pdf" | "doc" | "image"',
    default: '"pdf"',
    description: "Document type for icon",
  },
  {
    name: "uploadedAt",
    type: "Date",
    description: "Upload date",
  },
  {
    name: "fileSize",
    type: "number",
    description: "File size in bytes",
  },
  {
    name: "onView",
    type: "() => void",
    description: "Callback to view document",
  },
  {
    name: "onDownload",
    type: "() => void",
    description: "Callback to download document",
  },
  {
    name: "onDelete",
    type: "() => void",
    description: "Callback to delete document",
  },
];

export default function PdfViewerPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [zoom, setZoom] = React.useState(1);
  const [viewingDocument, setViewingDocument] = React.useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          PDF Viewer
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Resume and document preview component for displaying PDF files inline with zoom, page
          navigation, and download options. Optimized for reviewing candidate resumes and
          application materials in ATS workflows.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Reviewing candidate resumes</li>
              <li>Viewing cover letters and portfolios</li>
              <li>Displaying offer letters and contracts</li>
              <li>Previewing application attachments</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Image galleries (use Image component)</li>
              <li>Document editing (use rich text editor)</li>
              <li>Video content (use video player)</li>
              <li>Large document libraries (use file browser)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Standard PDF viewer with toolbar controls"
      >
        <CodePreview
          code={`import { PdfViewer } from "@/components/ui/pdf-viewer";

<PdfViewer
  src="/path/to/resume.pdf"
  title="Sarah Chen Resume"
  onPageChange={(page) => console.log("Page:", page)}
  onLoad={(numPages) => console.log("Loaded:", numPages, "pages")}
/>`}
        >
          <div className="h-[500px]">
            <PdfViewer
              src={SAMPLE_PDF_URL}
              title="Sample Document.pdf"
              onPageChange={setCurrentPage}
              // eslint-disable-next-line no-console
              onLoad={(numPages) => console.log("Loaded:", numPages)}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Toolbar Controls */}
      <ComponentCard
        id="toolbar"
        title="Toolbar Features"
        description="Built-in controls for navigation and actions"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border-muted p-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MagnifyingGlassMinus className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm">100%</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MagnifyingGlassPlus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-caption text-foreground-muted">Zoom Controls</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border-muted p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">1 / 5</span>
              </div>
              <span className="text-caption text-foreground-muted">Page Navigation</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border-muted p-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <DownloadSimple className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-caption text-foreground-muted">Download / Print</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border-muted p-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowsOut className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-caption text-foreground-muted">Fullscreen</span>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Zoom Levels */}
      <ComponentCard id="zoom" title="Zoom Options" description="Preset and custom zoom levels">
        <CodePreview
          code={`<PdfViewer
  src={pdfUrl}
  initialZoom={1.5}  // Start at 150%
/>`}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((level) => (
              <Button
                key={level}
                variant={zoom === level ? "primary" : "outline"}
                size="sm"
                onClick={() => setZoom(level)}
              >
                {Math.round(level * 100)}%
              </Button>
            ))}
          </div>
          <p className="text-sm text-foreground-muted">
            Current zoom: <span className="font-medium">{Math.round(zoom * 100)}%</span>
          </p>
        </CodePreview>
      </ComponentCard>

      {/* Without Toolbar */}
      <ComponentCard
        id="no-toolbar"
        title="Without Toolbar"
        description="Minimal viewer without controls"
      >
        <CodePreview
          code={`<PdfViewer
  src={pdfUrl}
  showToolbar={false}
  height="400px"
/>`}
        >
          <div className="h-[300px] overflow-hidden rounded-lg border border-border-muted">
            <PdfViewer src={SAMPLE_PDF_URL} showToolbar={false} height="100%" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Restricted Actions */}
      <ComponentCard
        id="restricted"
        title="Restricted Actions"
        description="Disable download or print for sensitive documents"
      >
        <CodePreview
          code={`<PdfViewer
  src={pdfUrl}
  title="Confidential Document"
  allowDownload={false}
  allowPrint={false}
/>`}
        >
          <div className="h-[400px]">
            <PdfViewer
              src={SAMPLE_PDF_URL}
              title="Confidential Document.pdf"
              allowDownload={false}
              allowPrint={false}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Resume Viewer (ATS-specific) */}
      <ComponentCard
        id="resume-viewer"
        title="Resume Viewer"
        description="ATS-specific variant with candidate context"
      >
        <CodePreview
          code={`import { ResumeViewer } from "@/components/ui/pdf-viewer";

<ResumeViewer
  src="/resumes/sarah-chen.pdf"
  candidateName="Sarah Chen"
  uploadedAt={new Date()}
  fileSize={245760}
  showParsingHighlights={true}
  onLoad={(pages) => console.log("Resume loaded:", pages)}
/>`}
        >
          <ResumeViewer
            src={SAMPLE_PDF_URL}
            candidateName="Sarah Chen"
            uploadedAt={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
            fileSize={245760}
            showParsingHighlights={true}
            height="400px"
          />
        </CodePreview>
      </ComponentCard>

      {/* Document Preview Card */}
      <ComponentCard
        id="preview-card"
        title="Document Preview Card"
        description="Compact card for document lists"
      >
        <CodePreview
          code={`import { DocumentPreviewCard } from "@/components/ui/pdf-viewer";

<DocumentPreviewCard
  title="Sarah_Chen_Resume.pdf"
  src="/resumes/sarah-chen.pdf"
  type="pdf"
  uploadedAt={new Date()}
  fileSize={245760}
  onView={() => openViewer()}
  onDownload={() => downloadFile()}
  onDelete={() => deleteFile()}
/>`}
        >
          <div className="max-w-md space-y-3">
            <DocumentPreviewCard
              title="Sarah_Chen_Resume.pdf"
              src={SAMPLE_PDF_URL}
              type="pdf"
              uploadedAt={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
              fileSize={245760}
              onView={() => setViewingDocument("resume")}
              // eslint-disable-next-line no-console
              onDownload={() => console.log("Download")}
              // eslint-disable-next-line no-console
              onDelete={() => console.log("Delete")}
            />
            <DocumentPreviewCard
              title="Cover_Letter.pdf"
              src={SAMPLE_PDF_URL}
              type="pdf"
              uploadedAt={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)}
              fileSize={128000}
              onView={() => setViewingDocument("cover")}
              // eslint-disable-next-line no-console
              onDownload={() => console.log("Download")}
            />
            <DocumentPreviewCard
              title="Portfolio_2024.pdf"
              src={SAMPLE_PDF_URL}
              type="pdf"
              uploadedAt={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)}
              fileSize={5242880}
              onView={() => setViewingDocument("portfolio")}
              // eslint-disable-next-line no-console
              onDownload={() => console.log("Download")}
              // eslint-disable-next-line no-console
              onDelete={() => console.log("Delete")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Loading State */}
      <ComponentCard id="loading" title="Loading State" description="Shows spinner while PDF loads">
        <div className="space-y-4">
          <p className="text-sm text-foreground-muted">
            The PDF viewer shows a loading spinner with the PDF icon while the document loads. This
            provides visual feedback during file download and rendering.
          </p>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border-muted bg-background-subtle p-8">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background-brand-subtle">
                <FilePdf className="h-8 w-8 text-foreground-brand" />
              </div>
              <div className="border-foreground-brand/30 absolute -inset-1 animate-spin rounded-full border-2 border-t-foreground-brand" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">Loading PDF</p>
            <p className="text-xs text-foreground-muted">Please wait...</p>
          </div>
        </div>
      </ComponentCard>

      {/* Error State */}
      <ComponentCard
        id="error"
        title="Error State"
        description="Graceful error handling with retry option"
      >
        <CodePreview
          code={`<PdfViewer
  src={pdfUrl}
  onError={(error) => {
    console.error("PDF failed to load:", error);
    // Show toast or fallback UI
  }}
/>`}
        >
          <div className="flex flex-col items-center justify-center rounded-lg border border-border-muted bg-background-subtle p-8">
            <div className="bg-background-error/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <FilePdf className="h-8 w-8 text-foreground-error" />
            </div>
            <p className="font-medium text-foreground">Unable to load PDF</p>
            <p className="mb-4 mt-1 text-sm text-foreground-muted">The file could not be loaded</p>
            <Button variant="outline" size="sm">
              Try again
            </Button>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Real-world Examples */}
      <ComponentCard
        id="examples"
        title="Real-World Examples"
        description="Common usage patterns in ATS workflows"
      >
        <div className="space-y-8">
          {/* Candidate Profile Documents */}
          <div>
            <h4 className="mb-4 text-body-strong">Candidate Profile - Documents Tab</h4>
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-body-strong">
                  <FilePdf className="h-4 w-4" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DocumentPreviewCard
                  title="Resume_2024.pdf"
                  src={SAMPLE_PDF_URL}
                  uploadedAt={new Date()}
                  fileSize={245760}
                  // eslint-disable-next-line no-console
                  onView={() => console.log("View")}
                  // eslint-disable-next-line no-console
                  onDownload={() => console.log("Download")}
                />
                <DocumentPreviewCard
                  title="Cover_Letter.pdf"
                  src={SAMPLE_PDF_URL}
                  uploadedAt={new Date(Date.now() - 86400000)}
                  fileSize={98304}
                  // eslint-disable-next-line no-console
                  onView={() => console.log("View")}
                  // eslint-disable-next-line no-console
                  onDownload={() => console.log("Download")}
                />
                <Button variant="outline" className="w-full">
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resume Review Modal */}
          <div>
            <h4 className="mb-4 text-body-strong">Resume Review Panel</h4>
            <div className="overflow-hidden rounded-xl border border-border-muted">
              <div className="flex items-center justify-between border-b border-border-muted bg-background-subtle p-4">
                <div className="flex items-center gap-3">
                  <Badge variant="default">Resume</Badge>
                  <span className="font-medium">Sarah Chen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <DownloadSimple className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" size="sm">
                    Move to Interview
                  </Button>
                </div>
              </div>
              <div className="h-[400px]">
                <PdfViewer src={SAMPLE_PDF_URL} showToolbar={true} height="100%" />
              </div>
            </div>
          </div>

          {/* Side-by-side View */}
          <div>
            <h4 className="mb-4 text-body-strong">Side-by-Side Comparison</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">Candidate A - Resume</Label>
                <div className="h-[300px] overflow-hidden rounded-lg border border-border-muted">
                  <PdfViewer src={SAMPLE_PDF_URL} title="John_Smith_Resume.pdf" height="100%" />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Candidate B - Resume</Label>
                <div className="h-[300px] overflow-hidden rounded-lg border border-border-muted">
                  <PdfViewer src={SAMPLE_PDF_URL} title="Jane_Doe_Resume.pdf" height="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-body-strong">PdfViewer</h4>
              <PropsTable props={pdfViewerProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">ResumeViewer</h4>
              <PropsTable props={resumeViewerProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">DocumentPreviewCard</h4>
              <PropsTable props={documentPreviewCardProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Provide clear document titles for context",
          "Show file size and upload date when available",
          "Allow download for non-sensitive documents",
          "Use fullscreen mode for detailed review",
          "Handle errors gracefully with retry option",
          "Provide keyboard shortcuts for power users",
        ]}
        donts={[
          "Don't auto-play or auto-scroll documents",
          "Don't hide critical toolbar controls",
          "Don't allow download of confidential docs",
          "Don't forget to handle loading states",
          "Don't show viewer for unsupported formats",
          "Don't embed large PDFs without pagination",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard Navigation**: Page navigation and zoom controllable via keyboard",
          "**Focus Management**: Focus trapped within viewer in fullscreen mode",
          "**Screen Readers**: Document title and page info announced",
          "**Zoom Controls**: Clear labels for zoom in/out actions",
          "**Loading States**: Loading progress announced to assistive technology",
          "**Error Recovery**: Error messages are focusable with clear retry action",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with PDF Viewer"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/file-upload"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">File Upload</p>
            <p className="text-caption text-foreground-muted">Upload documents</p>
          </a>
          <a
            href="/design-system/components/modal"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Modal</p>
            <p className="text-caption text-foreground-muted">Full-screen preview</p>
          </a>
          <a
            href="/design-system/components/candidate-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Candidate Card</p>
            <p className="text-caption text-foreground-muted">Profile context</p>
          </a>
          <a
            href="/design-system/components/card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Card</p>
            <p className="text-caption text-foreground-muted">Container layout</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/pdf-viewer" />
    </div>
  );
}
