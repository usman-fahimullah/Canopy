"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Avatar,
  Label,
  Input,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Users,
  Lightning,
  Wind,
  Tree,
} from "@/components/Icons";

// ============================================
// PROPS DEFINITIONS
// ============================================

const cardProps = [
  {
    name: "variant",
    type: '"default" | "outlined" | "elevated" | "flat" | "interactive" | "feature"',
    default: '"default"',
    description:
      "Visual style variant. default: subtle shadow. outlined: border only. elevated: strong shadow. flat: no shadow/border. interactive: clickable with hover shadow. feature: brand-colored.",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description:
      "Controls internal padding via CSS custom property. sm: 16px, default: 24px, lg: 32px. Propagates to CardHeader, CardContent, and CardFooter.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Card content (header, content, footer)",
  },
];

const cardHeaderProps = [
  {
    name: "className",
    type: "string",
    description:
      "Additional CSS classes. Padding controlled by parent Card size prop via --card-padding (default: 24px).",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Header content (typically CardTitle and CardDescription)",
  },
];

const cardContentProps = [
  {
    name: "className",
    type: "string",
    description:
      "Additional CSS classes. Horizontal + bottom padding controlled by parent Card size prop via --card-padding (default: 24px). No top padding.",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Main card content",
  },
];

const cardFooterProps = [
  {
    name: "className",
    type: "string",
    description:
      "Additional CSS classes. Flex row with centered items. Padding controlled by parent Card size prop via --card-padding (default: 24px). No top padding.",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Footer content (typically actions)",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function CardPage() {
  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Card</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Cards are versatile container components that group related content and actions. They
          provide visual separation, hierarchy, and focus for distinct pieces of information. The
          Card family includes CardHeader, CardTitle, CardDescription, CardContent, and CardFooter
          for flexible composition.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Layout
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            6 Variants
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            3 Sizes
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Composable
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Grouping related content (job listings, profiles)</li>
              <li>• Creating scannable content blocks</li>
              <li>• Dashboard widgets and stats</li>
              <li>• Forms that need visual separation</li>
              <li>• Interactive content with actions</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Simple text content (use plain layout)</li>
              <li>• Nesting cards within cards</li>
              <li>• Single pieces of information (use Badge/Text)</li>
              <li>• Full-width page sections</li>
              <li>• Navigation elements (use Sidebar/Nav)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Card (Container)",
            description:
              "The outer wrapper with white background, rounded corners (12px), and subtle shadow",
            required: true,
          },
          {
            name: "CardHeader",
            description: "Optional top section with 24px padding containing title and description",
          },
          {
            name: "CardTitle",
            description: "Heading element (h3) with heading-sm font size and semibold weight",
          },
          {
            name: "CardDescription",
            description: "Supporting text in body-sm size and muted color",
          },
          {
            name: "CardContent",
            description:
              "Main content area with 24px horizontal padding, no top padding if header exists",
            required: true,
          },
          {
            name: "CardFooter",
            description: "Optional bottom section for actions, flex layout with centered items",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple card with header and content"
      >
        <CodePreview
          code={`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description goes here
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content...</p>
  </CardContent>
</Card>`}
        >
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-foreground-muted">
                This is the main content area of the card. It can contain any content including
                text, images, forms, or other components.
              </p>
            </CardContent>
          </Card>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different visual styles for various contexts"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Default */}
          <div className="space-y-3">
            <Label className="text-body-strong">Default</Label>
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Subtle shadow, static</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Standard card with soft shadow. No hover effect. Use for most static content
                  containers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Outlined */}
          <div className="space-y-3">
            <Label className="text-body-strong">Outlined</Label>
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>Border only, no shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Use for inline sections, form containers, or dense layouts where borders provide
                  separation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Elevated */}
          <div className="space-y-3">
            <Label className="text-body-strong">Elevated</Label>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Prominent shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Higher elevation for floating content, modals, or important callouts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Flat */}
          <div className="space-y-3">
            <Label className="text-body-strong">Flat</Label>
            <Card variant="flat" className="bg-background-subtle">
              <CardHeader>
                <CardTitle>Flat Card</CardTitle>
                <CardDescription>No shadow or border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Use for nested cards or when background color provides separation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive */}
          <div className="space-y-3">
            <Label className="text-body-strong">Interactive</Label>
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Clickable with hover shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Pointer cursor and shadow elevation on hover. Use for clickable/selectable cards.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feature */}
          <div className="space-y-3">
            <Label className="text-body-strong">Feature</Label>
            <Card variant="feature">
              <CardHeader>
                <CardTitle>Feature Card</CardTitle>
                <CardDescription>Brand-colored, dark background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm opacity-80">
                  Brand-colored card for promotional content, CTAs, or highlighted sections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. SIZES */}
      {/* ============================================ */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Control internal padding with the size prop. Propagates to all sub-components via CSS custom property."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <Label className="text-body-strong">Small (16px padding)</Label>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Compact Card</CardTitle>
                <CardDescription>Tighter padding for dense UIs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Use for dashboard widgets, sidebar cards, or any context where space is limited.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Label className="text-body-strong">Default (24px padding)</Label>
            <Card size="default">
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>Default padding for most uses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  The standard size. Use for general content cards, forms, and detail views.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Label className="text-body-strong">Large (32px padding)</Label>
            <Card size="lg">
              <CardHeader>
                <CardTitle>Spacious Card</CardTitle>
                <CardDescription>Generous padding for emphasis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Use for hero sections, feature highlights, or when the card is the primary content
                  area.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. WITH FOOTER */}
      {/* ============================================ */}
      <ComponentCard
        id="with-footer"
        title="With Footer"
        description="Cards with action buttons in the footer"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Solar Energy Engineer</CardTitle>
              <CardDescription>CleanTech Solutions • San Francisco, CA</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-foreground-muted">
                Join our team to design and implement solar energy systems for commercial clients
                across California.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="success">Active</Badge>
              <Button variant="secondary" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wind Turbine Technician</CardTitle>
              <CardDescription>GreenPower Inc • Houston, TX</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-foreground-muted">
                Maintain and repair wind turbines at our growing wind farm operations in Texas.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="info">Remote</Badge>
              <div className="flex gap-2">
                <Button variant="tertiary" size="sm">
                  Save
                </Button>
                <Button variant="primary" size="sm">
                  Apply
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. INTERACTIVE CARDS */}
      {/* ============================================ */}
      <ComponentCard
        id="interactive"
        title="Interactive Cards"
        description="Use variant='interactive' for clickable cards with hover shadow elevation"
      >
        <CodePreview
          code={`<Card variant="interactive">
  <CardContent className="pt-6 text-center">
    <Lightning className="h-8 w-8 mx-auto mb-3" weight="duotone" />
    <CardTitle className="text-body-strong">Solar Energy</CardTitle>
    <CardDescription>12 open positions</CardDescription>
  </CardContent>
</Card>`}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="interactive">
              <CardContent className="pt-6 text-center">
                <Lightning
                  className="mx-auto mb-3 h-8 w-8 text-foreground-brand"
                  weight="duotone"
                />
                <CardTitle className="text-body-strong">Solar Energy</CardTitle>
                <CardDescription className="mt-1">12 open positions</CardDescription>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="pt-6 text-center">
                <Wind className="mx-auto mb-3 h-8 w-8 text-foreground-brand" weight="duotone" />
                <CardTitle className="text-body-strong">Wind Power</CardTitle>
                <CardDescription className="mt-1">8 open positions</CardDescription>
              </CardContent>
            </Card>

            <Card
              variant="interactive"
              className="border border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
            >
              <CardContent className="pt-6 text-center">
                <Tree className="mx-auto mb-3 h-8 w-8 text-foreground-brand" weight="duotone" />
                <CardTitle className="text-body-strong">Sustainability</CardTitle>
                <CardDescription className="mt-1">15 open positions</CardDescription>
              </CardContent>
            </Card>
          </div>
        </CodePreview>
        <p className="mt-4 text-caption text-foreground-muted">
          Interactive cards show pointer cursor and elevate shadow on hover. The third card adds
          brand border and background for a selected state.
        </p>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="Card Props">
          <PropsTable props={cardProps} />
        </ComponentCard>

        <ComponentCard title="CardHeader Props">
          <PropsTable props={cardHeaderProps} />
        </ComponentCard>

        <ComponentCard title="CardContent Props">
          <PropsTable props={cardContentProps} />
        </ComponentCard>

        <ComponentCard title="CardFooter Props">
          <PropsTable props={cardFooterProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 8. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use cards to group related content that belongs together",
            "Use variant='interactive' for clickable cards (not className='cursor-pointer')",
            "Use the size prop for consistent padding across sub-components",
            "Keep card content focused and scannable",
            "Use consistent card sizes within a grid",
            "Include clear actions in the footer when needed",
            "Use appropriate variant for the context (outlined for forms, elevated for floating)",
            "Compose with Section for semantic page structure",
          ]}
          donts={[
            "Don't add cursor-pointer manually — use variant='interactive' instead",
            "Don't overload cards with too much content",
            "Don't nest cards within cards",
            "Don't mix shadow and border on the same card",
            "Don't use cards for single pieces of information",
            "Don't mix drastically different card sizes in the same grid",
            "Don't use more than one primary action per card",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 9. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Semantic structure**: CardTitle uses h3 element for proper heading hierarchy",
            "**Interactive cards**: Use role='button' or wrap in Link for clickable cards",
            "**Focus states**: Interactive cards should have visible focus indicators",
            "**Color contrast**: Text meets WCAG AA standards against white background",
            "**Screen readers**: Content structure (header, main, footer) is conveyed semantically",
            "**Keyboard navigation**: Interactive cards should be focusable and activatable",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 10. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Section",
              href: "/design-system/components/section",
              description:
                "Semantic grouping with header structure. Compose with Card for visual containers.",
            },
            {
              name: "Container",
              href: "/design-system/components/container",
              description: "Page-level padding, max-width, and background zones.",
            },
            {
              name: "CandidateCard",
              href: "/design-system/components/candidate-card",
              description: "Specialized card for candidate profiles",
            },
            {
              name: "StatCard",
              href: "/design-system/components/stat-card",
              description: "Card for displaying metrics",
            },
            {
              name: "Dialog",
              href: "/design-system/components/dialog",
              description: "Modal card for focused content",
            },
            {
              name: "Sheet",
              href: "/design-system/components/sheet",
              description: "Slide-out panel with card-like content",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Job Listing Cards"
          description="Cards for displaying job postings in a grid"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Senior Sustainability Analyst</CardTitle>
                    <CardDescription>GreenFinance Corp • San Francisco, CA</CardDescription>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-body-sm text-foreground-muted">
                  Analyze environmental, social, and governance factors for investment portfolios
                  and provide strategic recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral" size="sm">
                    ESG
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    Hybrid
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    $120k-$150k
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border-muted pt-4">
                <div className="flex items-center gap-4 text-caption text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Users size={14} /> 24 applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Posted 3 days ago
                  </span>
                </div>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                  View
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Solar Installation Lead</CardTitle>
                    <CardDescription>SunPower Solutions • Austin, TX</CardDescription>
                  </div>
                  <Badge variant="info">Remote</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-body-sm text-foreground-muted">
                  Lead teams installing residential and commercial solar panel systems. NABCEP
                  certification preferred.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral" size="sm">
                    Solar
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    Full-time
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    $85k-$105k
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border-muted pt-4">
                <div className="flex items-center gap-4 text-caption text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Users size={14} /> 12 applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Posted 1 week ago
                  </span>
                </div>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                  View
                </Button>
              </CardFooter>
            </Card>
          </div>
        </RealWorldExample>

        <RealWorldExample title="Dashboard Stats" description="Metric cards for dashboard overview">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background-brand-subtle p-2">
                    <Briefcase className="h-5 w-5 text-foreground-brand" />
                  </div>
                  <div>
                    <p className="text-caption text-foreground-muted">Active Jobs</p>
                    <p className="text-heading-md">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background-info p-2">
                    <Users className="h-5 w-5 text-foreground-info" />
                  </div>
                  <div>
                    <p className="text-caption text-foreground-muted">Candidates</p>
                    <p className="text-heading-md">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background-success p-2">
                    <Clock className="h-5 w-5 text-foreground-success" />
                  </div>
                  <div>
                    <p className="text-caption text-foreground-muted">Avg. Time to Hire</p>
                    <p className="text-heading-md">18 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background-warning p-2">
                    <MapPin className="h-5 w-5 text-foreground-warning" />
                  </div>
                  <div>
                    <p className="text-caption text-foreground-muted">Locations</p>
                    <p className="text-heading-md">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Profile Card"
          description="Card showing candidate details in pipeline view"
        >
          <div className="max-w-md">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar name="Sarah Johnson" size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-body-strong font-medium">Sarah Johnson</h3>
                    <p className="text-caption text-foreground-muted">
                      Solar Engineer • 5 years experience
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        Interview
                      </Badge>
                      <span className="text-caption font-medium text-foreground-success">
                        92% match
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-border-muted pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral" size="sm">
                      NABCEP Certified
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      PV Design
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      Project Management
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="tertiary" size="sm">
                  View Profile
                </Button>
                <Button variant="primary" size="sm">
                  Schedule Interview
                </Button>
              </CardFooter>
            </Card>
          </div>
        </RealWorldExample>

        <RealWorldExample title="Form Card" description="Default card for form sections">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details for job applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-email">Email Address</Label>
                <Input id="form-email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-phone">Phone Number</Label>
                <Input id="form-phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-3">
              <Button variant="tertiary">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </CardFooter>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/card" />
    </div>
  );
}
