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
    type: '"default" | "outlined" | "elevated" | "flat"',
    default: '"default"',
    description: "Visual style variant of the card",
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
    description: "Additional CSS classes (default: p-6)",
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
    description: "Additional CSS classes (default: p-6 pt-0)",
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
    description: "Additional CSS classes (default: flex items-center p-6 pt-0)",
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
        <h1 className="text-heading-lg text-foreground mb-2">Card</h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          Cards are versatile container components that group related content
          and actions. They provide visual separation, hierarchy, and focus for
          distinct pieces of information. The Card family includes CardHeader,
          CardTitle, CardDescription, CardContent, and CardFooter for flexible
          composition.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Layout
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            4 Variants
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Composable
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Grouping related content (job listings, profiles)</li>
              <li>• Creating scannable content blocks</li>
              <li>• Dashboard widgets and stats</li>
              <li>• Forms that need visual separation</li>
              <li>• Interactive content with actions</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
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
            description:
              "Optional top section with 24px padding containing title and description",
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
            description:
              "Optional bottom section for actions, flex layout with centered items",
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
                This is the main content area of the card. It can contain any
                content including text, images, forms, or other components.
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Default */}
          <div className="space-y-3">
            <Label className="text-body-strong">Default</Label>
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Subtle shadow, hover elevation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted">
                  Standard card with soft shadow. Elevates on hover. Use for
                  most content containers.
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
                  Use when you need explicit boundaries, like in dense layouts
                  or nested contexts.
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
                  Higher elevation for floating content, modals, or important
                  callouts.
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
                  Use for nested cards or when background color provides
                  separation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. WITH FOOTER */}
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
              <CardDescription>
                CleanTech Solutions • San Francisco, CA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-foreground-muted">
                Join our team to design and implement solar energy systems for
                commercial clients across California.
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
                Maintain and repair wind turbines at our growing wind farm
                operations in Texas.
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
      {/* 6. INTERACTIVE STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="interactive"
        title="Interactive Cards"
        description="Cards with hover and click states for selectable content"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Lightning
                className="h-8 w-8 text-foreground-brand mx-auto mb-3"
                weight="duotone"
              />
              <CardTitle className="text-body-strong">Solar Energy</CardTitle>
              <CardDescription className="mt-1">12 open positions</CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Wind
                className="h-8 w-8 text-foreground-brand mx-auto mb-3"
                weight="duotone"
              />
              <CardTitle className="text-body-strong">Wind Power</CardTitle>
              <CardDescription className="mt-1">8 open positions</CardDescription>
            </CardContent>
          </Card>

          <Card variant="outlined" className="cursor-pointer border-border-brand bg-background-brand-subtle">
            <CardContent className="pt-6 text-center">
              <Tree
                className="h-8 w-8 text-foreground-brand mx-auto mb-3"
                weight="duotone"
              />
              <CardTitle className="text-body-strong">Sustainability</CardTitle>
              <CardDescription className="mt-1">15 open positions</CardDescription>
            </CardContent>
          </Card>
        </div>
        <p className="text-caption text-foreground-muted mt-4">
          Default cards elevate on hover. The third card uses outlined variant
          with brand border and background for selected state.
        </p>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Props Reference
        </h2>

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
        <h2 className="text-heading-sm text-foreground mb-4">
          Usage Guidelines
        </h2>
        <UsageGuide
          dos={[
            "Use cards to group related content that belongs together",
            "Keep card content focused and scannable",
            "Use consistent card layouts and sizes within a grid",
            "Include clear actions in the footer when needed",
            "Use appropriate variant for the context (elevated for overlays, form for inputs)",
            "Consider interactive states for clickable/selectable cards",
            "Maintain visual hierarchy with CardTitle and CardDescription",
          ]}
          donts={[
            "Don't overload cards with too much content",
            "Don't nest cards within cards",
            "Don't use cards for single pieces of information",
            "Don't mix drastically different card sizes in the same grid",
            "Don't use cards where simple text or lists would suffice",
            "Don't omit CardContent - it's the required content area",
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
            {
              name: "RoleTemplateCard",
              href: "/design-system/components/role-template-card",
              description: "Card for job role templates",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Real-World Examples
        </h2>

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
                    <CardDescription>
                      GreenFinance Corp • San Francisco, CA
                    </CardDescription>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted mb-4">
                  Analyze environmental, social, and governance factors for
                  investment portfolios and provide strategic recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral" size="sm">ESG</Badge>
                  <Badge variant="neutral" size="sm">Hybrid</Badge>
                  <Badge variant="neutral" size="sm">$120k-$150k</Badge>
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
                    <CardDescription>
                      SunPower Solutions • Austin, TX
                    </CardDescription>
                  </div>
                  <Badge variant="info">Remote</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground-muted mb-4">
                  Lead teams installing residential and commercial solar panel
                  systems. NABCEP certification preferred.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral" size="sm">Solar</Badge>
                  <Badge variant="neutral" size="sm">Full-time</Badge>
                  <Badge variant="neutral" size="sm">$85k-$105k</Badge>
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

        <RealWorldExample
          title="Dashboard Stats"
          description="Metric cards for dashboard overview"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background-brand-subtle">
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
                  <div className="p-2 rounded-lg bg-background-info">
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
                  <div className="p-2 rounded-lg bg-background-success">
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
                  <div className="p-2 rounded-lg bg-background-warning">
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
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-strong font-medium">Sarah Johnson</h3>
                    <p className="text-caption text-foreground-muted">
                      Solar Engineer • 5 years experience
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="success" size="sm">Interview</Badge>
                      <span className="text-caption text-foreground-success font-medium">
                        92% match
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-muted">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral" size="sm">NABCEP Certified</Badge>
                    <Badge variant="neutral" size="sm">PV Design</Badge>
                    <Badge variant="neutral" size="sm">Project Management</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="tertiary" size="sm">View Profile</Button>
                <Button variant="primary" size="sm">Schedule Interview</Button>
              </CardFooter>
            </Card>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Form Card"
          description="Default card for form sections"
        >
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Update your contact details for job applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-email">Email Address</Label>
                <Input
                  id="form-email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-phone">Phone Number</Label>
                <Input
                  id="form-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
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
