"use client";

import React from "react";
import { Pagination, SimplePagination } from "@/components/ui/pagination";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const paginationProps = [
  { name: "currentPage", type: "number", required: true, description: "Current active page (1-indexed)" },
  { name: "totalPages", type: "number", required: true, description: "Total number of pages" },
  { name: "onPageChange", type: "(page: number) => void", required: true, description: "Called when page changes" },
  { name: "siblingCount", type: "number", default: "1", description: "Number of sibling pages to show" },
  { name: "showFirstLast", type: "boolean", default: "true", description: "Show first/last page buttons" },
];

const simplePaginationProps = [
  { name: "currentPage", type: "number", required: true, description: "Current active page (1-indexed)" },
  { name: "totalPages", type: "number", required: true, description: "Total number of pages" },
  { name: "onPageChange", type: "(page: number) => void", required: true, description: "Called when page changes" },
];

export default function PaginationPage() {
  const [page1, setPage1] = React.useState(1);
  const [page2, setPage2] = React.useState(5);
  const [page3, setPage3] = React.useState(1);
  const [page4, setPage4] = React.useState(1);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Pagination
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Pagination allows users to navigate through pages of content. Use the full
          pagination for data tables and simple pagination for lighter use cases.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Full pagination with page numbers"
      >
        <CodePreview
          code={`const [currentPage, setCurrentPage] = useState(1);

<Pagination
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>`}
        >
          <Pagination
            currentPage={page1}
            totalPages={10}
            onPageChange={setPage1}
          />
        </CodePreview>
      </ComponentCard>

      {/* Full Pagination */}
      <ComponentCard
        id="full-pagination"
        title="Full Pagination"
        description="Shows page numbers with ellipsis for large page counts"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">At start (page 1)</p>
            <Pagination
              currentPage={1}
              totalPages={10}
              onPageChange={() => {}}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">In middle (page 5)</p>
            <Pagination
              currentPage={page2}
              totalPages={10}
              onPageChange={setPage2}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">At end (page 10)</p>
            <Pagination
              currentPage={10}
              totalPages={10}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Simple Pagination */}
      <ComponentCard
        id="simple-pagination"
        title="Simple Pagination"
        description="Compact pagination with just prev/next buttons"
      >
        <CodePreview
          code={`<SimplePagination
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>`}
        >
          <SimplePagination
            currentPage={page3}
            totalPages={10}
            onPageChange={setPage3}
          />
        </CodePreview>
      </ComponentCard>

      {/* Few Pages */}
      <ComponentCard
        id="few-pages"
        title="Few Pages"
        description="When there are only a few pages"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">3 pages</p>
            <Pagination
              currentPage={page4}
              totalPages={3}
              onPageChange={setPage4}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">5 pages</p>
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common pagination scenarios in an ATS"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Candidates List</p>
            <p className="text-body-sm text-foreground-muted mb-3">
              Use full pagination for browsing large candidate pools
            </p>
            <Pagination
              currentPage={3}
              totalPages={25}
              onPageChange={() => {}}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Activity Timeline</p>
            <p className="text-body-sm text-foreground-muted mb-3">
              Use simple pagination for sequential content
            </p>
            <SimplePagination
              currentPage={2}
              totalPages={8}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-3">Pagination</h4>
            <PropsTable props={paginationProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">SimplePagination</h4>
            <PropsTable props={simplePaginationProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Pagination accessibility features"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Uses <code className="text-caption bg-background-muted px-1 rounded">nav</code> with <code className="text-caption bg-background-muted px-1 rounded">aria-label="Pagination"</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Current page marked with <code className="text-caption bg-background-muted px-1 rounded">aria-current="page"</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Disabled buttons have <code className="text-caption bg-background-muted px-1 rounded">aria-disabled="true"</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Page buttons have accessible labels
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use full pagination for large data sets",
          "Use simple pagination for linear content",
          "Always show current page position",
          "Disable prev/next when at boundaries",
        ]}
        donts={[
          "Don't use pagination for small lists (<10 items)",
          "Don't hide page count from users",
          "Don't use pagination for infinite scroll patterns",
          "Don't make pagination too small to tap on mobile",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/pagination" />
    </div>
  );
}
