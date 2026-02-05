"use client";

import React from "react";
import { ListStatus, Avatar } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { CheckCircle, Warning, Star, BookmarkSimple, Heart } from "@phosphor-icons/react";

const listStatusProps = [
  {
    name: "variant",
    type: '"critical" | "favorite" | "success" | "bipoc" | "bookmark"',
    default: "-",
    required: true,
    description:
      "The status variant to display. Each variant has a unique color scheme and default icon.",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg" | "xl" | "2xl" | "3xl"',
    default: '"default"',
    description: "Size of the status badge (16px, 20px, 24px, 28px, 40px, or 54px diameter).",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    default: "undefined",
    description: "Custom icon to override the default icon for the variant.",
  },
  {
    name: "bordered",
    type: "boolean",
    default: "true",
    description: "Whether to show the white border around the badge.",
  },
  {
    name: "ref",
    type: "React.Ref<HTMLSpanElement>",
    default: "undefined",
    description: "Forwarded ref to the underlying span element.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes to apply.",
  },
];

const variantDetails = [
  {
    variant: "critical" as const,
    label: "Critical",
    description: "Use for urgent alerts or warnings that need immediate attention.",
    bgColor: "red-100",
    iconColor: "red-500",
    icon: "Warning",
  },
  {
    variant: "favorite" as const,
    label: "Favorite",
    description: "Use to indicate favorited or starred items.",
    bgColor: "yellow-100",
    iconColor: "yellow-400",
    icon: "Star",
  },
  {
    variant: "success" as const,
    label: "Success",
    description: "Use for successful completions or verified states.",
    bgColor: "green-200",
    iconColor: "green-600",
    icon: "CheckCircle",
  },
  {
    variant: "bipoc" as const,
    label: "BIPOC Owned",
    description: "Use to highlight BIPOC-owned businesses or candidates.",
    bgColor: "purple-200",
    iconColor: "purple-600",
    icon: "Heart",
  },
  {
    variant: "bookmark" as const,
    label: "Bookmark",
    description: "Use for bookmarked or saved items.",
    bgColor: "blue-100",
    iconColor: "blue-500",
    icon: "BookmarkSimple",
  },
];

export default function ListStatusPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          List Status
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          Circular status indicator badges with icons, used to show different states like critical
          alerts, favorites, success, BIPOC-owned businesses, or bookmarks. Commonly positioned on
          avatars or list items.
        </p>
      </div>

      {/* When to use */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
          <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
          <ul className="space-y-1 text-sm text-foreground-muted">
            <li>Indicate special status on user avatars</li>
            <li>Show favorited or bookmarked items in lists</li>
            <li>Highlight verified or certified entities</li>
            <li>Display urgent alerts requiring attention</li>
          </ul>
        </div>
        <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
          <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
          <ul className="space-y-1 text-sm text-foreground-muted">
            <li>For general content badges (use Badge instead)</li>
            <li>For counts or notifications (use NotificationBadge)</li>
            <li>When the status needs text labels</li>
            <li>For pipeline stages (use StageBadge)</li>
          </ul>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentAnatomy
        parts={[
          {
            name: "Container",
            description: "Circular wrapper with background color and optional white border",
            required: true,
          },
          {
            name: "Icon",
            description: "Phosphor icon centered within the container, sized proportionally",
            required: true,
          },
          {
            name: "Border",
            description:
              "White border that scales proportionally with the badge size (~10% of container)",
          },
        ]}
      />

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple status indicator with a variant"
      >
        <CodePreview
          code={`import { ListStatus } from "@/components/ui";

<ListStatus variant="success" />
<ListStatus variant="favorite" />
<ListStatus variant="critical" />`}
        >
          <div className="flex items-center gap-4">
            <ListStatus variant="success" />
            <ListStatus variant="favorite" />
            <ListStatus variant="critical" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* All Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Each variant has a unique color scheme and default icon"
      >
        <div className="space-y-6">
          {variantDetails.map(({ variant, label, description, bgColor, iconColor, icon }) => (
            <div
              key={variant}
              className="flex items-start gap-4 rounded-lg bg-background-subtle p-4"
            >
              <ListStatus variant={variant} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold text-foreground">{label}</span>
                  <code className="rounded bg-background-muted px-1.5 py-0.5 text-caption">
                    variant=&quot;{variant}&quot;
                  </code>
                </div>
                <p className="mb-2 text-body-sm text-foreground-muted">{description}</p>
                <div className="flex items-center gap-4 text-caption text-foreground-muted">
                  <span>Background: {bgColor}</span>
                  <span>Icon: {iconColor}</span>
                  <span>Default Icon: {icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available size options from small (16px) to 3xl (54px)"
      >
        <CodePreview
          code={`<ListStatus variant="success" size="sm" />  {/* 16px */}
<ListStatus variant="success" size="default" />  {/* 20px */}
<ListStatus variant="success" size="lg" />  {/* 24px */}
<ListStatus variant="success" size="xl" />  {/* 28px */}
<ListStatus variant="success" size="2xl" />  {/* 40px */}
<ListStatus variant="success" size="3xl" />  {/* 54px */}`}
        >
          <div className="flex items-end gap-6">
            {(["sm", "default", "lg", "xl", "2xl", "3xl"] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <ListStatus variant="success" size={size} />
                <span className="text-caption text-foreground-muted">{size}</span>
              </div>
            ))}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Custom Icons */}
      <ComponentCard
        id="custom-icons"
        title="Custom Icons"
        description="Override the default icon with a custom one"
      >
        <CodePreview
          code={`import { Heart, CheckCircle } from "@phosphor-icons/react";

<ListStatus
  variant="favorite"
  icon={<Heart weight="fill" className="size-3.5 text-[var(--primitive-red-500)]" />}
/>`}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <ListStatus
                variant="favorite"
                icon={<Heart weight="fill" className="size-3.5 text-[var(--primitive-red-500)]" />}
              />
              <span className="text-caption text-foreground-muted">Heart icon</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ListStatus
                variant="success"
                icon={
                  <CheckCircle
                    weight="fill"
                    className="size-3.5 text-[var(--primitive-blue-500)]"
                  />
                }
              />
              <span className="text-caption text-foreground-muted">Blue checkmark</span>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Without Border */}
      <ComponentCard
        id="bordered"
        title="Without Border"
        description="Remove the white border for seamless integration"
      >
        <CodePreview
          code={`<ListStatus variant="success" bordered={false} />
<ListStatus variant="favorite" bordered={false} />`}
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <ListStatus variant="success" bordered />
                <ListStatus variant="success" bordered={false} />
              </div>
              <span className="text-caption text-foreground-muted">With border vs without</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <ListStatus variant="favorite" bordered />
                <ListStatus variant="favorite" bordered={false} />
              </div>
              <span className="text-caption text-foreground-muted">With border vs without</span>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Avatar */}
      <ComponentCard
        id="with-avatar"
        title="With Avatar"
        description="Position the status badge on user avatars. Badge size should scale proportionally with the avatar."
      >
        <CodePreview
          code={`{/* 48px avatar (default) + 20px badge (default) */}
<div className="relative inline-flex">
  <Avatar name="Jane Doe" size="default" />
  <span className="absolute -bottom-0.5 -right-0.5">
    <ListStatus variant="success" />
  </span>
</div>`}
        >
          <div className="flex items-center gap-8">
            {/* Success - Verified */}
            <div className="relative inline-flex">
              <Avatar name="Jane Doe" size="default" />
              <span className="absolute -bottom-0.5 -right-0.5">
                <ListStatus variant="success" />
              </span>
            </div>

            {/* Favorite */}
            <div className="relative inline-flex">
              <Avatar name="John Smith" size="default" />
              <span className="absolute -bottom-0.5 -right-0.5">
                <ListStatus variant="favorite" />
              </span>
            </div>

            {/* BIPOC Owned */}
            <div className="relative inline-flex">
              <Avatar name="Maria Garcia" size="default" />
              <span className="absolute -bottom-0.5 -right-0.5">
                <ListStatus variant="bipoc" />
              </span>
            </div>

            {/* Critical */}
            <div className="relative inline-flex">
              <Avatar name="Alex Kim" size="default" />
              <span className="absolute -bottom-0.5 -right-0.5">
                <ListStatus variant="critical" />
              </span>
            </div>
          </div>
        </CodePreview>

        {/* Proportional sizing guide */}
        <div className="mt-6 border-t border-border-muted pt-6">
          <p className="mb-4 text-caption-strong text-foreground">Proportional Sizing Guide</p>
          <div className="flex items-end gap-6">
            {[
              { avatarSize: "xs" as const, badgeSize: "sm" as const, label: "24px + 16px" },
              { avatarSize: "sm" as const, badgeSize: "sm" as const, label: "32px + 16px" },
              {
                avatarSize: "default" as const,
                badgeSize: "default" as const,
                label: "48px + 20px",
              },
              { avatarSize: "lg" as const, badgeSize: "xl" as const, label: "64px + 28px" },
              { avatarSize: "xl" as const, badgeSize: "2xl" as const, label: "96px + 40px" },
              { avatarSize: "2xl" as const, badgeSize: "3xl" as const, label: "128px + 54px" },
            ].map(({ avatarSize, badgeSize, label }) => (
              <div key={avatarSize} className="flex flex-col items-center gap-2">
                <div className="relative inline-flex">
                  <Avatar name="Jane Doe" size={avatarSize} />
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <ListStatus variant="success" size={badgeSize} />
                  </span>
                </div>
                <span className="text-caption text-foreground-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      {/* In a List */}
      <ComponentCard
        id="in-list"
        title="In a List Context"
        description="Show status indicators alongside list items"
      >
        <div className="max-w-md space-y-3">
          {[
            { name: "Climate Solutions Inc.", status: "bipoc" as const, role: "Senior Developer" },
            { name: "Green Energy Co.", status: "favorite" as const, role: "Product Manager" },
            { name: "Eco Startup", status: "success" as const, role: "UX Designer" },
            { name: "Urgent Review Needed", status: "critical" as const, role: "Backend Engineer" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-background-subtle p-3"
            >
              <div className="relative">
                <Avatar name={item.name} size="sm" />
                <span className="absolute -bottom-0.5 -right-0.5">
                  <ListStatus variant={item.status} size="sm" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="text-caption text-foreground-muted">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* All Variants Grid */}
      <ComponentCard
        id="all-variants"
        title="All Variants at All Sizes"
        description="Complete matrix showing every combination"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-muted text-left">
                <th className="py-2 pr-4 text-caption-strong text-foreground-muted">Variant</th>
                {(["sm", "default", "lg", "xl", "2xl", "3xl"] as const).map((size) => (
                  <th
                    key={size}
                    className="px-4 py-2 text-center text-caption-strong text-foreground-muted"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["critical", "favorite", "success", "bipoc", "bookmark"] as const).map(
                (variant) => (
                  <tr key={variant} className="border-b border-border-muted last:border-0">
                    <td className="py-3 pr-4">
                      <code className="rounded bg-background-muted px-1.5 py-0.5 text-caption">
                        {variant}
                      </code>
                    </td>
                    {(["sm", "default", "lg", "xl", "2xl", "3xl"] as const).map((size) => (
                      <td key={size} className="px-4 py-3 text-center">
                        <ListStatus variant={variant} size={size} />
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={listStatusProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use consistent sizes relative to the parent element",
          "Position at bottom-right corner of avatars",
          "Use the appropriate variant for the context (critical for urgent, success for verified)",
          "Provide meaningful aria-label through the variant's built-in label",
          "Use the bordered prop when overlaying on images or complex backgrounds",
        ]}
        donts={[
          "Don't use multiple status badges on the same element",
          "Don't mix sizes inconsistently in the same list",
          "Don't use as a replacement for text-based status indicators",
          "Don't override colors that conflict with the semantic meaning",
          "Don't remove borders when the badge is hard to see against the background",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          'Uses role="status" for semantic meaning',
          'Each variant has a built-in aria-label (e.g., "Critical", "Success")',
          "Includes a title attribute for hover tooltips",
          'Icons are marked with aria-hidden="true" since status is conveyed via role and label',
          "Color is not the only indicator - icons provide additional visual distinction",
          "Sufficient color contrast between icon and background colors",
        ]}
      />

      {/* Related Components */}
      <RelatedComponents
        components={[
          {
            name: "Badge",
            href: "/design-system/components/badge",
            description: "Text-based status badges for labels and categories",
          },
          {
            name: "Avatar",
            href: "/design-system/components/avatar",
            description: "User profile images with optional status indicators",
          },
          {
            name: "NotificationBadge",
            href: "/design-system/components/badge#notification-badge",
            description: "Numeric indicators for counts and notifications",
          },
          {
            name: "StageBadge",
            href: "/design-system/components/stage-badge",
            description: "Pipeline stage indicators for ATS workflows",
          },
        ]}
      />

      <PageNavigation currentPath="/design-system/components/list-status" />
    </div>
  );
}
