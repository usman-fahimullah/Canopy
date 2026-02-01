"use client";

import React from "react";
import { Avatar, AvatarGroup, AvatarStack, Badge, Label } from "@/components/ui";
import {
  ComponentCard,
  ComponentAnatomy,
  UsageGuide,
  AccessibilityInfo,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  Info,
  CheckCircle,
  User,
  Leaf,
  Lightning,
  Star,
  Clock,
  BookmarkSimple,
  Warning,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const avatarProps = [
  {
    name: "src",
    type: "string",
    default: "undefined",
    description: "Image source URL for the avatar",
  },
  {
    name: "alt",
    type: "string",
    default: "undefined",
    description: "Alt text for the image (accessibility)",
  },
  {
    name: "name",
    type: "string",
    default: "undefined",
    description: "Name used for generating initials fallback and color",
  },
  {
    name: "email",
    type: "string",
    default: "undefined",
    description: "Email for color generation when name unavailable",
  },
  {
    name: "fallback",
    type: "ReactNode",
    default: "undefined",
    description: "Custom fallback content when no image",
  },
  {
    name: "fallbackChar",
    type: "string",
    default: '"?"',
    description: "Custom fallback character when no name provided",
  },
  {
    name: "icon",
    type: "React.ElementType",
    default: "undefined",
    description: "Phosphor icon component for fallback (takes precedence over initials)",
  },
  {
    name: "maxInitials",
    type: "1 | 2 | 3",
    default: "auto (based on size)",
    description: "Maximum number of initials to show (overrides size-based default)",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "default" | "lg" | "xl" | "2xl"',
    default: '"default"',
    description: "Size of the avatar (24px to 128px)",
  },
  {
    name: "shape",
    type: '"circle" | "square"',
    default: '"circle"',
    description: "Shape variant (circle or rounded square)",
  },
  {
    name: "color",
    type: '"green" | "blue" | "purple" | "red" | "orange" | "yellow" | "neutral"',
    default: "auto from name/email",
    description: "Color variant for fallback background",
  },
  {
    name: "variant",
    type: '"filled" | "outlined" | "soft" | "high-contrast"',
    default: '"filled"',
    description: "Visual style variant",
  },
  {
    name: "status",
    type: '"online" | "offline" | "busy" | "away"',
    default: "undefined",
    description: "Simple status indicator dot",
  },
  {
    name: "badge",
    type: '"success" | "critical" | "favorite" | "bipoc" | "bookmark"',
    default: "undefined",
    description: "Badge indicator with icon (overrides status)",
  },
  {
    name: "badgeIcon",
    type: "ReactNode",
    default: "undefined",
    description: "Custom icon for the badge (overrides default)",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "false",
    description: "Enable hover/focus states for clickable avatars",
  },
  {
    name: "onClick",
    type: "(e: MouseEvent) => void",
    default: "undefined",
    description: "Click handler (auto-enables interactive state)",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show loading skeleton state",
  },
  {
    name: "showTooltip",
    type: "boolean",
    default: "false",
    description: "Show tooltip with full name on hover",
  },
  {
    name: "tooltipContent",
    type: "ReactNode",
    default: "name",
    description: "Custom tooltip content (defaults to name)",
  },
  {
    name: "tooltipSide",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"top"',
    description: "Tooltip position",
  },
];

const avatarGroupProps = [
  {
    name: "avatars",
    type: "AvatarData[]",
    default: "[]",
    description: "Array of avatar data objects",
  },
  {
    name: "max",
    type: "number",
    default: "4",
    description: "Maximum avatars to show before +N indicator",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "default" | "lg" | "xl" | "2xl"',
    default: '"default"',
    description: "Size of all avatars in the group",
  },
  {
    name: "shape",
    type: '"circle" | "square"',
    default: '"circle"',
    description: "Shape variant for all avatars",
  },
  {
    name: "overlap",
    type: '"none" | "sm" | "md" | "lg"',
    default: "auto from size",
    description: "Custom overlap spacing",
  },
  {
    name: "reverse",
    type: "boolean",
    default: "false",
    description: "Reverse stacking order (last avatar on top)",
  },
  {
    name: "expandOnHover",
    type: "boolean",
    default: "false",
    description: "Expand avatars on hover to show all",
  },
  {
    name: "variant",
    type: '"ring" | "border"',
    default: '"ring"',
    description: "Border style variant",
  },
  {
    name: "onAvatarClick",
    type: "(avatar, index) => void",
    default: "undefined",
    description: "Callback when an avatar is clicked",
  },
  {
    name: "onOverflowClick",
    type: "(hiddenAvatars) => void",
    default: "undefined",
    description: "Callback when overflow indicator is clicked",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "undefined",
    description: "Custom render (overrides avatars prop)",
  },
];

const avatarStackProps = [
  {
    name: "avatars",
    type: "AvatarData[]",
    required: true,
    description: "Array of avatar data objects",
  },
  {
    name: "label",
    type: "string",
    default: '""',
    description: "Text label to show after the count",
  },
  {
    name: "size",
    type: '"default" | "large"',
    default: '"default"',
    description: "Size variant (32px or 48px avatars)",
  },
  {
    name: "shape",
    type: '"circle" | "square"',
    default: '"circle"',
    description: "Shape variant for all avatars",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "auto",
    description: "Maximum avatars before overflow (auto: 2 for 3+, all otherwise)",
  },
  {
    name: "showCount",
    type: "boolean",
    default: "true",
    description: "Whether to show the count in the label",
  },
];

const avatarDataType = [
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "Unique identifier for click handling",
  },
  {
    name: "src",
    type: "string",
    default: "undefined",
    description: "Image source URL",
  },
  {
    name: "name",
    type: "string",
    default: "undefined",
    description: "Name for initials and alt text",
  },
  {
    name: "email",
    type: "string",
    default: "undefined",
    description: "Email for color generation",
  },
  {
    name: "alt",
    type: "string",
    default: "undefined",
    description: "Alt text override",
  },
  {
    name: "status",
    type: '"online" | "offline" | "busy" | "away"',
    default: "undefined",
    description: "Status indicator",
  },
  {
    name: "color",
    type: "AvatarColor",
    default: "undefined",
    description: "Color variant override",
  },
];

// Sample data for examples
const sampleAvatars = [
  {
    id: "1",
    name: "Sarah Chen",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64",
  },
  {
    id: "2",
    name: "Michael Park",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64",
  },
  { id: "3", name: "Emily Johnson" },
  { id: "4", name: "David Kim" },
  { id: "5", name: "Lisa Wang" },
  { id: "6", name: "James Brown" },
];

export default function AvatarPage() {
  return (
    <div className="space-y-12">
      {/* ============================================
          SECTION 1: OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Avatar
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Avatars represent users, organizations, or entities with images, initials, or icons. They
          provide visual identification across the application in lists, cards, comments, and
          navigation.
        </p>

        {/* Category Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="feature" icon={<Info size={14} weight="bold" />}>
            Data Display
          </Badge>
          <Badge variant="neutral" icon={<CheckCircle size={14} weight="bold" />}>
            Stable
          </Badge>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/30 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Representing users in lists or cards</li>
              <li>• Showing team members or collaborators</li>
              <li>• Identifying comment or note authors</li>
              <li>• Displaying candidate profiles in ATS</li>
              <li>• Showing company/organization logos</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/30 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• For decorative images (use Image component)</li>
              <li>• For icons that aren&apos;t representing people</li>
              <li>• When you need complex image layouts</li>
              <li>• For thumbnails of non-person content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: ANATOMY
          ============================================ */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The avatar component consists of these parts"
      >
        <ComponentAnatomy
          parts={[
            { name: "Container", description: "Circular or square frame with border" },
            { name: "Image / Fallback", description: "Photo, initials, or icon" },
            { name: "Status Dot (optional)", description: "Online/offline indicator" },
            { name: "Badge (optional)", description: "Icon badge for special status" },
          ]}
        />
        <div className="mt-6 rounded-lg bg-background-subtle p-4">
          <p className="mb-4 text-caption text-foreground-muted">Live anatomy example:</p>
          <div className="flex items-center gap-8">
            <div className="relative">
              <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
                name="Sarah Chen"
                size="lg"
              />
              <div className="absolute -left-2 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--foreground-brand)] text-xs font-medium text-white">
                1
              </div>
            </div>
            <div className="relative">
              <Avatar name="Mike Park" size="lg" status="online" />
              <div className="absolute -top-3 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--foreground-brand)] text-xs font-medium text-white">
                3
              </div>
            </div>
            <div className="relative">
              <Avatar name="Emily Davis" size="lg" badge="favorite" />
              <div className="absolute -bottom-3 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--foreground-brand)] text-xs font-medium text-white">
                4
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 3: BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest ways to use an avatar"
      >
        <CodePreview
          code={`import { Avatar } from "@/components/ui";

{/* With image */}
<Avatar
  src="https://example.com/photo.jpg"
  alt="Sarah Chen"
  name="Sarah Chen"
/>

{/* With initials fallback */}
<Avatar name="Michael Park" />

{/* With icon fallback */}
<Avatar name="Climate Team" icon={Leaf} />`}
        >
          <div className="flex items-center gap-4">
            <div className="space-y-2 text-center">
              <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
                alt="Sarah Chen"
                name="Sarah Chen"
              />
              <p className="text-caption-sm text-foreground-muted">With image</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Michael Park" />
              <p className="text-caption-sm text-foreground-muted">With initials</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Climate Team" icon={Leaf} />
              <p className="text-caption-sm text-foreground-muted">With icon</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: SIZES
          ============================================ */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available avatar sizes from 24px to 128px. Smaller sizes (xs, sm) automatically show single initials for better readability."
      >
        <CodePreview
          code={`<Avatar size="xs" name="User" />   {/* 24px - 1 initial */}
<Avatar size="sm" name="User" />   {/* 32px - 1 initial */}
<Avatar size="default" name="User" /> {/* 48px - 2 initials */}
<Avatar size="lg" name="User" />   {/* 64px - 2 initials */}
<Avatar size="xl" name="User" />   {/* 96px - 2 initials */}
<Avatar size="2xl" name="User" />  {/* 128px - 2 initials */}`}
        >
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 text-center">
              <Avatar size="xs" name="User XS" />
              <p className="text-caption-sm text-foreground-muted">xs • 24px</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar size="sm" name="User SM" />
              <p className="text-caption-sm text-foreground-muted">sm • 32px</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar size="default" name="User Default" />
              <p className="text-caption-sm text-foreground-muted">default • 48px</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar size="lg" name="User LG" />
              <p className="text-caption-sm text-foreground-muted">lg • 64px</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar size="xl" name="User XL" />
              <p className="text-caption-sm text-foreground-muted">xl • 96px</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar size="2xl" name="User 2XL" />
              <p className="text-caption-sm text-foreground-muted">2xl • 128px</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 5: SHAPES
          ============================================ */}
      <ComponentCard
        id="shapes"
        title="Shapes"
        description="Circle (default) or square with rounded corners (12px radius)"
      >
        <CodePreview
          code={`<Avatar name="Sarah Chen" shape="circle" />
<Avatar name="Michael Park" shape="square" />`}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2 text-center">
              <Avatar name="Sarah Chen" size="lg" shape="circle" />
              <p className="text-caption-sm text-foreground-muted">circle</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Michael Park" size="lg" shape="square" />
              <p className="text-caption-sm text-foreground-muted">square</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
                name="Emily Johnson"
                size="lg"
                shape="circle"
              />
              <p className="text-caption-sm text-foreground-muted">image circle</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64"
                name="David Kim"
                size="lg"
                shape="square"
              />
              <p className="text-caption-sm text-foreground-muted">image square</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: VISUAL VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Visual Variants"
        description="Different visual styles for different contexts"
      >
        <div className="space-y-8">
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Filled (Default)</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              Vibrant mid-tone backgrounds with dark text. All colors meet WCAG AA contrast
              requirements.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {(["green", "blue", "purple", "red", "orange", "yellow", "neutral"] as const).map(
                (color) => (
                  <div key={color} className="space-y-2 text-center">
                    <Avatar name={`${color} User`} color={color} variant="filled" />
                    <p className="text-caption-sm text-foreground-muted">{color}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Soft</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              Lighter, more subtle backgrounds for less emphasis
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {(["green", "blue", "purple", "red", "orange", "yellow", "neutral"] as const).map(
                (color) => (
                  <div key={color} className="space-y-2 text-center">
                    <Avatar name={`${color} User`} color={color} variant="soft" />
                    <p className="text-caption-sm text-foreground-muted">{color}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Outlined</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              Transparent background with colored border
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {(["green", "blue", "purple", "red", "orange", "yellow", "neutral"] as const).map(
                (color) => (
                  <div key={color} className="space-y-2 text-center">
                    <Avatar name={`${color} User`} color={color} variant="outlined" />
                    <p className="text-caption-sm text-foreground-muted">{color}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-body-strong text-foreground">High Contrast</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              Maximum contrast for accessibility needs
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name="High Contrast User" variant="high-contrast" />
              <Avatar name="HC" variant="high-contrast" size="lg" />
              <Avatar name="Accessibility" variant="high-contrast" size="xl" />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 7: COLORS
          ============================================ */}
      <ComponentCard
        id="colors"
        title="Colors"
        description="Color variants for fallback backgrounds (auto-generated from name/email or manual)"
      >
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Auto-Generated Colors</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              When no color is specified, a consistent color is generated from the name hash. The
              same name always produces the same color.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name="Sarah Chen" showTooltip />
              <Avatar name="Michael Park" showTooltip />
              <Avatar name="Emily Johnson" showTooltip />
              <Avatar name="David Kim" showTooltip />
              <Avatar name="Lisa Wang" showTooltip />
              <Avatar name="James Brown" showTooltip />
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Email-Based Colors</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              When name is unavailable, email can be used for consistent color generation
            </p>
            <CodePreview
              code={`<Avatar email="sarah@example.com" />
<Avatar email="mike@company.org" />`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-2 text-center">
                  <Avatar email="sarah@example.com" />
                  <p className="text-caption-sm text-foreground-muted">sarah@...</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar email="mike@company.org" />
                  <p className="text-caption-sm text-foreground-muted">mike@...</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar email="emily@startup.io" />
                  <p className="text-caption-sm text-foreground-muted">emily@...</p>
                </div>
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 8: TOOLTIP
          ============================================ */}
      <ComponentCard
        id="tooltip"
        title="Tooltip"
        description="Show full name or custom content on hover"
      >
        <CodePreview
          code={`{/* Show name as tooltip */}
<Avatar name="Sarah Chen" showTooltip />

{/* Custom tooltip content */}
<Avatar
  name="Michael Park"
  showTooltip
  tooltipContent="Michael Park (Hiring Manager)"
/>

{/* Tooltip position */}
<Avatar name="Emily Johnson" showTooltip tooltipSide="right" />`}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2 text-center">
              <Avatar name="Sarah Chen" showTooltip />
              <p className="text-caption-sm text-foreground-muted">Hover me</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar
                name="Michael Park"
                showTooltip
                tooltipContent="Michael Park (Hiring Manager)"
              />
              <p className="text-caption-sm text-foreground-muted">Custom content</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Emily Johnson" showTooltip tooltipSide="right" />
              <p className="text-caption-sm text-foreground-muted">Right side</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 9: STATUS & BADGES
          ============================================ */}
      <ComponentCard
        id="states"
        title="Status & Badges"
        description="Visual indicators for user status or special attributes"
      >
        <div className="space-y-8">
          {/* Status Dots */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Status Dots</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              Simple dot indicators for real-time presence status. Online status includes a subtle
              pulse animation.
            </p>
            <CodePreview
              code={`<Avatar name="Sarah Chen" status="online" />
<Avatar name="Michael Park" status="away" />
<Avatar name="Emily Johnson" status="busy" />
<Avatar name="David Kim" status="offline" />`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-2 text-center">
                  <Avatar name="Sarah Chen" status="online" />
                  <p className="text-caption-sm text-foreground-muted">online</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="Michael Park" status="away" />
                  <p className="text-caption-sm text-foreground-muted">away</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="Emily Johnson" status="busy" />
                  <p className="text-caption-sm text-foreground-muted">busy</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="David Kim" status="offline" />
                  <p className="text-caption-sm text-foreground-muted">offline</p>
                </div>
              </div>
            </CodePreview>
          </div>

          {/* Badge Indicators */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Badge Indicators</h4>
            <p className="mb-4 text-caption text-foreground-muted">
              Icon badges for special attributes (takes precedence over status)
            </p>
            <CodePreview
              code={`<Avatar name="Sarah Chen" badge="success" />
<Avatar name="Michael Park" badge="critical" />
<Avatar name="Emily Johnson" badge="favorite" />
<Avatar name="David Kim" badge="bipoc" />
<Avatar name="Lisa Wang" badge="bookmark" />`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-2 text-center">
                  <Avatar name="Sarah Chen" badge="success" />
                  <p className="text-caption-sm text-foreground-muted">success</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="Michael Park" badge="critical" />
                  <p className="text-caption-sm text-foreground-muted">critical</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="Emily Johnson" badge="favorite" />
                  <p className="text-caption-sm text-foreground-muted">favorite</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="David Kim" badge="bipoc" />
                  <p className="text-caption-sm text-foreground-muted">bipoc</p>
                </div>
                <div className="space-y-2 text-center">
                  <Avatar name="Lisa Wang" badge="bookmark" />
                  <p className="text-caption-sm text-foreground-muted">bookmark</p>
                </div>
              </div>
            </CodePreview>
          </div>

          {/* Loading State */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Loading State</h4>
            <CodePreview
              code={`<Avatar loading size="sm" />
<Avatar loading size="default" />
<Avatar loading size="lg" shape="square" />`}
            >
              <div className="flex items-center gap-4">
                <Avatar loading size="sm" />
                <Avatar loading size="default" />
                <Avatar loading size="lg" />
                <Avatar loading size="lg" shape="square" />
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 10: INTERACTIVE STATES
          ============================================ */}
      <ComponentCard
        id="interactive"
        title="Interactive States"
        description="Hover, focus, and click feedback for clickable avatars"
      >
        <CodePreview
          code={`{/* With onClick handler */}
<Avatar
  name="Sarah Chen"
  onClick={() => console.log("clicked!")}
/>

{/* Explicitly interactive */}
<Avatar name="Michael Park" interactive />

{/* Interactive with tooltip */}
<Avatar
  name="Emily Johnson"
  interactive
  showTooltip
  tooltipContent="Click to view profile"
/>`}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2 text-center">
              <Avatar name="Sarah Chen" onClick={() => alert("Clicked Sarah!")} />
              <p className="text-caption-sm text-foreground-muted">Click me</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Michael Park" interactive />
              <p className="text-caption-sm text-foreground-muted">Interactive</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar
                name="Emily Johnson"
                interactive
                showTooltip
                tooltipContent="Click to view profile"
              />
              <p className="text-caption-sm text-foreground-muted">With tooltip</p>
            </div>
          </div>
        </CodePreview>
        <p className="mt-4 text-caption text-foreground-muted">
          Interactive avatars have hover scale/lift animation, active press feedback, and visible
          focus rings. Animations respect{" "}
          <code className="rounded bg-background-muted px-1 text-xs">prefers-reduced-motion</code>.
        </p>
      </ComponentCard>

      {/* ============================================
          SECTION 11: NAME HANDLING
          ============================================ */}
      <ComponentCard
        id="name-handling"
        title="Name Handling"
        description="Intelligent initial generation from various name formats"
      >
        <div className="space-y-4">
          <p className="text-caption text-foreground-muted">
            The avatar handles various name formats intelligently:
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-2 text-center">
              <Avatar name="John Doe" />
              <p className="text-caption-sm text-foreground-muted">&quot;John Doe&quot; → JD</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Madonna" />
              <p className="text-caption-sm text-foreground-muted">&quot;Madonna&quot; → MA</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Dr. Jane Smith" />
              <p className="text-caption-sm text-foreground-muted">
                &quot;Dr. Jane Smith&quot; → JS
              </p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="Smith, John" />
              <p className="text-caption-sm text-foreground-muted">&quot;Smith, John&quot; → JS</p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="John Michael Smith Jr." />
              <p className="text-caption-sm text-foreground-muted">
                &quot;John Michael Smith Jr.&quot; → JS
              </p>
            </div>
            <div className="space-y-2 text-center">
              <Avatar name="李明" />
              <p className="text-caption-sm text-foreground-muted">&quot;李明&quot; → 李明</p>
            </div>
          </div>
          <CodePreview
            code={`{/* Override max initials */}
<Avatar name="John Michael Doe" maxInitials={3} /> {/* JMD */}
<Avatar name="John Doe" maxInitials={1} /> {/* J */}`}
          >
            <div className="flex items-center gap-4">
              <div className="space-y-2 text-center">
                <Avatar name="John Michael Doe" maxInitials={3} size="lg" />
                <p className="text-caption-sm text-foreground-muted">maxInitials=3</p>
              </div>
              <div className="space-y-2 text-center">
                <Avatar name="John Doe" maxInitials={1} size="lg" />
                <p className="text-caption-sm text-foreground-muted">maxInitials=1</p>
              </div>
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 12: AVATAR GROUP
          ============================================ */}
      <ComponentCard
        id="avatar-group"
        title="Avatar Group"
        description="Display multiple avatars with overlap and overflow indicator"
      >
        <div className="space-y-8">
          {/* Basic Group */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Basic Group</h4>
            <CodePreview
              code={`<AvatarGroup
  avatars={[
    { id: "1", name: "Sarah Chen", src: "..." },
    { id: "2", name: "Michael Park", src: "..." },
    { id: "3", name: "Emily Johnson" },
    { id: "4", name: "David Kim" },
    { id: "5", name: "Lisa Wang" },
  ]}
  max={4}
/>`}
            >
              <AvatarGroup avatars={sampleAvatars} max={4} />
            </CodePreview>
          </div>

          {/* With Shapes */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">With Shapes</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="w-16 text-caption text-foreground-muted">circle</span>
                <AvatarGroup avatars={sampleAvatars} max={4} shape="circle" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-caption text-foreground-muted">square</span>
                <AvatarGroup avatars={sampleAvatars} max={4} shape="square" />
              </div>
            </div>
          </div>

          {/* Expand on Hover */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Expand on Hover</h4>
            <CodePreview code={`<AvatarGroup avatars={avatars} expandOnHover />`}>
              <AvatarGroup avatars={sampleAvatars} max={4} expandOnHover />
            </CodePreview>
          </div>

          {/* Different Sizes */}
          <div>
            <h4 className="mb-3 text-body-strong text-foreground">Different Sizes</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-16 text-caption text-foreground-muted">xs</span>
                <AvatarGroup avatars={sampleAvatars} max={4} size="xs" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-caption text-foreground-muted">sm</span>
                <AvatarGroup avatars={sampleAvatars} max={4} size="sm" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-caption text-foreground-muted">default</span>
                <AvatarGroup avatars={sampleAvatars} max={4} size="default" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-caption text-foreground-muted">lg</span>
                <AvatarGroup avatars={sampleAvatars} max={4} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 13: AVATAR STACK
          ============================================ */}
      <ComponentCard
        id="avatar-stack"
        title="Avatar Stack"
        description="Horizontal stack with count label (e.g., '5 Applicants')"
      >
        <CodePreview
          code={`<AvatarStack
  avatars={applicants}
  label="Applicants"
  showCount={true}
/>

<AvatarStack
  avatars={reviewers}
  label="Reviewers"
  size="large"
  shape="square"
/>`}
        >
          <div className="space-y-4">
            <AvatarStack avatars={sampleAvatars.slice(0, 5)} label="Applicants" />
            <AvatarStack avatars={sampleAvatars.slice(0, 3)} label="Reviewers" size="large" />
            <AvatarStack avatars={sampleAvatars.slice(0, 4)} label="Team Members" shape="square" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 14: PROPS TABLES
          ============================================ */}
      <ComponentCard id="props" title="Avatar Props">
        <PropsTable props={avatarProps} />
      </ComponentCard>

      <ComponentCard id="props-group" title="AvatarGroup Props">
        <PropsTable props={avatarGroupProps} />
      </ComponentCard>

      <ComponentCard id="props-stack" title="AvatarStack Props">
        <PropsTable props={avatarStackProps} />
      </ComponentCard>

      <ComponentCard id="props-data" title="AvatarData Type">
        <PropsTable props={avatarDataType} />
      </ComponentCard>

      {/* ============================================
          SECTION 15: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Always provide alt text or name for accessibility",
          "Use consistent sizes within the same context",
          "Provide a fallback (name for initials or icon)",
          "Use status indicators only for real-time presence",
          "Keep avatar groups to a reasonable max (3-5)",
          "Use showTooltip for small avatars where initials may be unclear",
          "Use high-contrast variant for accessibility needs",
        ]}
        donts={[
          "Don't use avatars without any fallback mechanism",
          "Don't mix different sizes in the same group",
          "Don't use low-quality or stretched images",
          "Don't use status colors for non-status purposes",
          "Don't show too many avatars (use overflow indicator)",
          "Don't use outlined variant for small sizes (border becomes too thick)",
        ]}
      />

      {/* ============================================
          SECTION 16: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Alt text**: Always provide `alt` or `name` for screen readers",
          "**Improved ARIA labels**: Includes initials and status in screen reader announcements",
          "**Interactive avatars**: Use `interactive` prop or `onClick` for proper button semantics",
          "**Focus states**: Interactive avatars have visible focus rings (green-500)",
          "**Status indicators**: Use `role='status'` and `aria-label` for status dots",
          "**Loading state**: Uses `aria-busy='true'` and appropriate label",
          "**Avatar groups**: Uses `role='group'` with descriptive `aria-label`",
          "**Reduced motion**: All animations respect `prefers-reduced-motion`",
          "**High contrast**: Use `variant='high-contrast'` for maximum visibility",
          "**Color contrast**: All color variants meet WCAG AA requirements (4.5:1+)",
        ]}
      />

      {/* ============================================
          SECTION 17: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Badge",
            href: "/design-system/components/badge",
            description: "Status badges that can accompany avatars",
          },
          {
            name: "CandidateCard",
            href: "/design-system/components/candidate-card",
            description: "Card component that uses avatars prominently",
          },
          {
            name: "Tooltip",
            href: "/design-system/components/tooltip",
            description: "Add tooltips to avatars for more context",
          },
        ]}
      />

      {/* ============================================
          SECTION 18: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Candidate List Item"
        description="Avatar with candidate details in an ATS context"
      >
        <CodePreview
          code={`<div className="flex items-center gap-3 p-4 border rounded-lg">
  <Avatar
    src="https://..."
    name="Sarah Chen"
    size="default"
    status="online"
    showTooltip
  />
  <div className="flex-1">
    <p className="font-semibold">Sarah Chen</p>
    <p className="text-caption text-foreground-muted">
      Solar Installation Manager
    </p>
  </div>
  <Badge variant="feature">Interview</Badge>
</div>`}
        >
          <div className="flex max-w-md items-center gap-3 rounded-lg border bg-surface p-4">
            <Avatar
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
              name="Sarah Chen"
              status="online"
              showTooltip
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">Sarah Chen</p>
              <p className="truncate text-caption text-foreground-muted">
                Solar Installation Manager
              </p>
            </div>
            <Badge variant="feature">Interview</Badge>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Team Members Section"
        description="Avatar group showing interview panel or hiring team"
      >
        <CodePreview
          code={`<div className="space-y-3">
  <h4 className="text-body-strong">Interview Panel</h4>
  <div className="flex items-center gap-3">
    <AvatarGroup
      avatars={panelMembers}
      max={4}
      size="sm"
      expandOnHover
    />
    <span className="text-caption text-foreground-muted">
      4 interviewers assigned
    </span>
  </div>
</div>`}
        >
          <div className="max-w-md space-y-3">
            <h4 className="text-body-strong text-foreground">Interview Panel</h4>
            <div className="flex items-center gap-3">
              <AvatarGroup avatars={sampleAvatars.slice(0, 4)} max={4} size="sm" expandOnHover />
              <span className="text-caption text-foreground-muted">4 interviewers assigned</span>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Comment Thread"
        description="Avatars identifying comment authors with tooltips"
      >
        <CodePreview
          code={`<div className="space-y-4">
  <div className="flex gap-3">
    <Avatar name="Sarah Chen" size="sm" showTooltip />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">Sarah Chen</span>
        <span className="text-caption text-foreground-muted">2h ago</span>
      </div>
      <p className="text-body-sm mt-1">
        Great candidate! Strong solar experience.
      </p>
    </div>
  </div>
</div>`}
        >
          <div className="max-w-md space-y-4">
            <div className="flex gap-3">
              <Avatar name="Sarah Chen" size="sm" showTooltip />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Sarah Chen</span>
                  <span className="text-caption text-foreground-muted">2h ago</span>
                </div>
                <p className="mt-1 text-body-sm text-foreground">
                  Great candidate! Strong solar installation experience and NABCEP certified.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Avatar name="Michael Park" size="sm" showTooltip />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Michael Park</span>
                  <span className="text-caption text-foreground-muted">1h ago</span>
                </div>
                <p className="mt-1 text-body-sm text-foreground">
                  Agreed! Moving to interview stage.
                </p>
              </div>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/avatar" />
    </div>
  );
}
