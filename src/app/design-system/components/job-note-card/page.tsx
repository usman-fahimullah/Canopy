"use client";

import React from "react";
import {
  JobNoteCard,
  type JobNoteType,
} from "@/components/ui";
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
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Job Note Card
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl mb-4">
          Colorful cards for career guidance, advice, and educational content.
          Each note type has a distinct color theme to help users quickly identify
          content categories.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success/10 rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">When to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Career guidance articles and tips</li>
              <li>Educational content on job platforms</li>
              <li>Featured advice columns</li>
              <li>Resource library displays</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error/10 rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">When not to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Job listings (use JobPostCard)</li>
              <li>Company profiles (use CompanyCard)</li>
              <li>User-generated content without categories</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The job note card structure"
      >
        <div className="relative p-6 bg-background-subtle rounded-lg">
          <div className="max-w-[350px]">
            <div className="relative bg-[var(--primitive-green-200)] rounded-[12px] p-6 h-[200px] flex flex-col">
              {/* Tag */}
              <div className="relative inline-flex self-start">
                <div className="px-2 py-1 rounded-lg bg-[var(--primitive-green-500)]">
                  <span className="text-sm font-bold text-white">Building Paths</span>
                </div>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
              </div>
              {/* Title */}
              <div className="relative mt-2 flex-1">
                <h3 className="text-2xl font-medium text-[var(--primitive-neutral-800)]">
                  How to transition into renewable energy
                </h3>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
              </div>
              {/* Author */}
              <div className="relative flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--primitive-neutral-200)] flex items-center justify-center text-xs font-medium">
                    SC
                  </div>
                  <span className="text-sm text-[var(--primitive-neutral-800)]">Sarah Chen</span>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--primitive-neutral-200)]">
                  <span className="text-sm">Bookmark</span>
                </div>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">1</span> Category Tag</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">2</span> Title Content</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">3</span> Author + Action</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <JobNoteCard
                type="skill-building"
                title="Top certifications"
                size="small"
              />
              <JobNoteCard
                type="growth-mindset"
                title="Overcoming challenges"
                size="small"
              />
            </div>
          </div>

          {/* Full Width Variants */}
          <div>
            <Label className="mb-3 block">Full Width Variants</Label>
            <div className="space-y-4 max-w-2xl">
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
            <h4 className="text-body-strong mb-4">Featured Content Section</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <JobNoteCard
                type="building-paths"
                title="The complete guide to transitioning into climate tech"
                authorName="Sarah Chen"
                bookmarked={bookmarked.has("featured-1")}
                onBookmark={() => toggleBookmark("featured-1")}
                onClick={() => console.log("Read article")}
              />
              <JobNoteCard
                type="prep-talk"
                title="Ace your next sustainability interview with these tips"
                authorName="Michael Park"
                bookmarked={bookmarked.has("featured-2")}
                onBookmark={() => toggleBookmark("featured-2")}
                onClick={() => console.log("Read article")}
              />
            </div>
          </div>

          {/* Resource Library Grid */}
          <div>
            <h4 className="text-body-strong mb-4">Resource Library Grid</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            <h4 className="text-body-strong mb-4">Compact Article List</h4>
            <div className="space-y-3 max-w-lg">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/job-post-card"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Job Post Card</p>
            <p className="text-caption text-foreground-muted">Job listings</p>
          </a>
          <a
            href="/design-system/components/company-card"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Company Card</p>
            <p className="text-caption text-foreground-muted">Company profiles</p>
          </a>
          <a
            href="/design-system/components/card"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Card</p>
            <p className="text-caption text-foreground-muted">Generic container</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
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
