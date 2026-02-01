"use client";

import React from "react";
import { JobNoteCard, type JobNoteType } from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// Props documentation
const jobNoteCardProps = [
  {
    name: "type",
    type: '"building-paths" | "prep-talk" | "the-search" | "write-your-story" | "skill-building" | "growth-mindset"',
    required: true,
    description: "Note type determines the background color theme",
  },
  {
    name: "title",
    type: "string",
    required: true,
    description: "Main title/content of the note card",
  },
  {
    name: "authorName",
    type: "string",
    description: "Author name displayed at the bottom",
  },
  {
    name: "authorAvatar",
    type: "string",
    description: "URL for author avatar image",
  },
  {
    name: "showAction",
    type: "boolean",
    default: "true",
    description: "Whether to show the bookmark action button",
  },
  {
    name: "onBookmark",
    type: "() => void",
    description: "Callback when bookmark button is clicked",
  },
  {
    name: "bookmarked",
    type: "boolean",
    default: "false",
    description: "Whether the note is bookmarked",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Callback when card is clicked",
  },
  {
    name: "tagLabel",
    type: "string",
    description: "Custom tag label (overrides default type label)",
  },
  {
    name: "size",
    type: '"default" | "medium" | "skinny" | "small" | "full-default" | "full-medium" | "full-skinny"',
    default: '"default"',
    description: "Size variant of the card",
  },
];

const noteTypes: JobNoteType[] = [
  "building-paths",
  "prep-talk",
  "the-search",
  "write-your-story",
  "skill-building",
  "growth-mindset",
];

const sampleNotes: Record<JobNoteType, { title: string; author: string }> = {
  "building-paths": {
    title: "How to transition into the renewable energy sector",
    author: "Sarah Chen",
  },
  "prep-talk": {
    title: "5 questions you should always ask in climate job interviews",
    author: "Michael Park",
  },
  "the-search": {
    title: "Where to find hidden green job opportunities",
    author: "Emily Davis",
  },
  "write-your-story": {
    title: "Crafting a compelling sustainability-focused resume",
    author: "James Wilson",
  },
  "skill-building": {
    title: "Top certifications for climate careers in 2025",
    author: "Lisa Wang",
  },
  "growth-mindset": {
    title: "Overcoming imposter syndrome in environmental roles",
    author: "David Kim",
  },
};

export default function JobNoteCardPage() {
  const [bookmarked, setBookmarked] = React.useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Job Note Card
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Colorful cards for career guidance, advice, and educational content. Each note type has a
          distinct color theme to help users quickly identify content categories.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Career guidance articles and tips</li>
              <li>Educational content on job platforms</li>
              <li>Featured advice columns</li>
              <li>Resource library displays</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Job listings (use JobPostCard)</li>
              <li>Company profiles (use CompanyCard)</li>
              <li>User-generated content without categories</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard id="anatomy" title="Anatomy" description="The job note card structure">
        <div className="relative rounded-lg bg-background-subtle p-6">
          <div className="max-w-[350px]">
            <div className="relative flex h-[200px] flex-col rounded-[12px] bg-[var(--primitive-green-200)] p-6">
              {/* Tag */}
              <div className="relative inline-flex self-start">
                <div className="rounded-lg bg-[var(--primitive-green-500)] px-2 py-1">
                  <span className="text-sm font-bold text-white">Building Paths</span>
                </div>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  1
                </div>
              </div>
              {/* Title */}
              <div className="relative mt-2 flex-1">
                <h3 className="text-2xl font-medium text-[var(--primitive-neutral-800)]">
                  How to transition into renewable energy
                </h3>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  2
                </div>
              </div>
              {/* Author */}
              <div className="relative mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primitive-neutral-200)] text-xs font-medium">
                    SC
                  </div>
                  <span className="text-sm text-[var(--primitive-neutral-800)]">Sarah Chen</span>
                </div>
                <div className="rounded-2xl bg-[var(--primitive-neutral-200)] p-3">
                  <span className="text-sm">Bookmark</span>
                </div>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  3
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">1</span>{" "}
              Category Tag
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">2</span> Title
              Content
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">3</span> Author
              + Action
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple job note card with essential information"
      >
        <CodePreview
          code={`import { JobNoteCard } from "@/components/ui";

<JobNoteCard
  type="building-paths"
  title="How to transition into the renewable energy sector"
  authorName="Sarah Chen"
  onClick={() => console.log("Read article")}
/>`}
        >
          <div className="max-w-[350px]">
            <JobNoteCard
              type="building-paths"
              title="How to transition into the renewable energy sector"
              authorName="Sarah Chen"
              // eslint-disable-next-line no-console
              onClick={() => console.log("Read article")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Note Types */}
      <ComponentCard
        id="types"
        title="Note Types"
        description="Six distinct color themes for different content categories"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {noteTypes.map((type) => (
            <JobNoteCard
              key={type}
              type={type}
              title={sampleNotes[type].title}
              authorName={sampleNotes[type].author}
              size="medium"
            />
          ))}
        </div>
      </ComponentCard>

      {/* Size Variants */}
      <ComponentCard
        id="sizes"
        title="Size Variants"
        description="Multiple size options for different layouts"
      >
        <div className="space-y-8">
          {/* Default */}
          <div>
            <Label className="mb-3 block">Default (350x416px) - Large featured cards</Label>
            <JobNoteCard
              type="building-paths"
              title="The complete guide to building a career in climate tech"
              authorName="Sarah Chen"
              size="default"
            />
          </div>

          {/* Medium */}
          <div>
            <Label className="mb-3 block">Medium (350x200px) - Standard content cards</Label>
            <JobNoteCard
              type="prep-talk"
              title="5 questions you should always ask in climate job interviews"
              authorName="Michael Park"
              size="medium"
            />
          </div>

          {/* Skinny */}
          <div>
            <Label className="mb-3 block">Skinny (350x124px) - Compact list items</Label>
            <JobNoteCard
              type="the-search"
              title="Where to find hidden green job opportunities"
              authorName="Emily Davis"
              size="skinny"
            />
          </div>

          {/* Small */}
          <div>
            <Label className="mb-3 block">Small (171x200px) - Grid thumbnails</Label>
            <div className="flex gap-4">
              <JobNoteCard type="skill-building" title="Top certifications" size="small" />
              <JobNoteCard type="growth-mindset" title="Overcoming challenges" size="small" />
            </div>
          </div>

          {/* Full Width Variants */}
          <div>
            <Label className="mb-3 block">Full Width Variants</Label>
            <div className="max-w-2xl space-y-4">
              <JobNoteCard
                type="write-your-story"
                title="Crafting a compelling sustainability-focused resume"
                authorName="James Wilson"
                size="full-medium"
              />
              <JobNoteCard
                type="skill-building"
                title="Essential skills for green careers"
                authorName="Lisa Wang"
                size="full-skinny"
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Bookmark State */}
      <ComponentCard
        id="bookmark"
        title="Bookmark State"
        description="Toggle bookmark to save notes for later"
      >
        <CodePreview
          code={`const [bookmarked, setBookmarked] = React.useState(false);

<JobNoteCard
  type="prep-talk"
  title="Interview tips for climate jobs"
  authorName="Michael Park"
  bookmarked={bookmarked}
  onBookmark={() => setBookmarked(!bookmarked)}
/>`}
        >
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Not Bookmarked</Label>
              <JobNoteCard
                type="prep-talk"
                title="Interview tips for climate jobs"
                authorName="Michael Park"
                size="medium"
                bookmarked={false}
                onBookmark={() => {}}
              />
            </div>
            <div className="space-y-2">
              <Label>Bookmarked</Label>
              <JobNoteCard
                type="prep-talk"
                title="Interview tips for climate jobs"
                authorName="Michael Park"
                size="medium"
                bookmarked={true}
                onBookmark={() => {}}
              />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Without Author */}
      <ComponentCard
        id="no-author"
        title="Without Author"
        description="Cards can be displayed without author attribution"
      >
        <div className="flex flex-wrap gap-4">
          <JobNoteCard
            type="building-paths"
            title="Getting started with sustainability careers"
            size="medium"
          />
          <JobNoteCard
            type="growth-mindset"
            title="Building resilience in your climate career"
            size="medium"
            showAction={false}
          />
        </div>
      </ComponentCard>

      {/* Custom Tag Label */}
      <ComponentCard
        id="custom-tag"
        title="Custom Tag Label"
        description="Override the default type label with custom text"
      >
        <CodePreview
          code={`<JobNoteCard
  type="skill-building"
  title="Python for Environmental Data Science"
  authorName="Dr. Jane Smith"
  tagLabel="New Course"
  size="medium"
/>`}
        >
          <div className="max-w-[350px]">
            <JobNoteCard
              type="skill-building"
              title="Python for Environmental Data Science"
              authorName="Dr. Jane Smith"
              tagLabel="New Course"
              size="medium"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Complete Examples */}
      <ComponentCard
        id="examples"
        title="Complete Examples"
        description="Real-world usage patterns"
      >
        <div className="space-y-8">
          {/* Featured Content Section */}
          <div>
            <h4 className="mb-4 text-body-strong">Featured Content Section</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <JobNoteCard
                type="building-paths"
                title="The complete guide to transitioning into climate tech"
                authorName="Sarah Chen"
                bookmarked={bookmarked.has("featured-1")}
                onBookmark={() => toggleBookmark("featured-1")}
                // eslint-disable-next-line no-console
                onClick={() => console.log("Read article")}
              />
              <JobNoteCard
                type="prep-talk"
                title="Ace your next sustainability interview with these tips"
                authorName="Michael Park"
                bookmarked={bookmarked.has("featured-2")}
                onBookmark={() => toggleBookmark("featured-2")}
                // eslint-disable-next-line no-console
                onClick={() => console.log("Read article")}
              />
            </div>
          </div>

          {/* Resource Library Grid */}
          <div>
            <h4 className="mb-4 text-body-strong">Resource Library Grid</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {noteTypes.map((type, i) => (
                <JobNoteCard
                  key={type}
                  type={type}
                  title={sampleNotes[type].title}
                  authorName={sampleNotes[type].author}
                  size="medium"
                  bookmarked={bookmarked.has(`grid-${i}`)}
                  onBookmark={() => toggleBookmark(`grid-${i}`)}
                />
              ))}
            </div>
          </div>

          {/* Compact List */}
          <div>
            <h4 className="mb-4 text-body-strong">Compact Article List</h4>
            <div className="max-w-lg space-y-3">
              <JobNoteCard
                type="the-search"
                title="Where to find hidden green job opportunities"
                authorName="Emily Davis"
                size="full-skinny"
              />
              <JobNoteCard
                type="write-your-story"
                title="Crafting your sustainability narrative"
                authorName="James Wilson"
                size="full-skinny"
              />
              <JobNoteCard
                type="growth-mindset"
                title="Embracing continuous learning in climate careers"
                authorName="David Kim"
                size="full-skinny"
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props Table */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={jobNoteCardProps} />
      </ComponentCard>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Use consistent note types for similar content categories",
          "Keep titles concise and scannable",
          "Show author attribution for credibility",
          "Use appropriate size for the layout context",
          "Allow bookmarking for user-saved content",
        ]}
        donts={[
          "Don't mix job listings with advice content",
          "Don't use overly long titles that get truncated",
          "Don't disable bookmark on content users may want to save",
          "Don't use same color for unrelated content categories",
          "Don't hide the category tag as it aids navigation",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Interactive Cards**: Cards with onClick are focusable with visible focus ring",
          "**Keyboard Navigation**: Tab to focus, Enter/Space to activate",
          "**Bookmark Button**: Has aria-label describing bookmarked state",
          "**Color Independence**: Category tags include text labels, not just color",
          "**Text Contrast**: High contrast text on colored backgrounds",
          "**Avatar Fallback**: Auto-generates initials when image unavailable",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Job Note Card"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/job-post-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Job Post Card</p>
            <p className="text-caption text-foreground-muted">Job listings</p>
          </a>
          <a
            href="/design-system/components/company-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Company Card</p>
            <p className="text-caption text-foreground-muted">Company profiles</p>
          </a>
          <a
            href="/design-system/components/card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Card</p>
            <p className="text-caption text-foreground-muted">Generic container</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Avatar</p>
            <p className="text-caption text-foreground-muted">Author images</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/job-note-card" />
    </div>
  );
}
