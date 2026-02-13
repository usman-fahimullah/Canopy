# CLAUDE.md - Canopy ATS Project

## Project Overview

**Green Jobs Board** is a climate recruitment platform with three products:

| Product              | Description           | Target Users              |
| -------------------- | --------------------- | ------------------------- |
| **Green Jobs Board** | Job seeker platform   | Climate job seekers       |
| **Canopy**           | ATS app for employers | Climate-focused employers |
| **Candid**           | Career coaching app   | Job seekers + coaches     |

**This repo is Canopy** — the ATS for climate hiring. It combines a design-forward career page builder with AI-powered candidate sourcing specifically for the climate/sustainability sector.

**Philosophy:** "Human-first, AI-enabled" — AI assists and suggests, humans decide. Always show reasoning, allow override.

**Target Users:** Climate-focused employers (renewable energy, ESG, sustainable brands, climate tech startups, environmental nonprofits)

**Competitive Positioning:** Design-forward UX + AI sourcing capabilities + climate specialization that generic ATS platforms can't match.

---

## Tech Stack

| Layer               | Technology               | Notes                          |
| ------------------- | ------------------------ | ------------------------------ |
| Framework           | Next.js 14+ (App Router) | TypeScript, Server Components  |
| Styling             | Tailwind CSS             | Design tokens as CSS variables |
| Database            | PostgreSQL + Prisma      | Hosted on Supabase or Neon     |
| Auth                | Clerk                    | Multi-tenant, team invites     |
| Career Page Builder | Craft.js                 | Custom blocks, JSON storage    |
| Kanban/Drag-Drop    | dnd-kit                  | Pipeline management            |
| File Storage        | Supabase Storage         | Resume, media uploads          |
| Email               | Resend                   | Transactional + templates      |
| Calendar            | Cal.com or Nylas         | Google + Outlook sync          |
| AI                  | Claude API / OpenAI      | Sourcing, matching, generation |

---

## File Structure

```
canopy/
├── CLAUDE.md                    # This file
├── package.json
├── tailwind.config.ts
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       # Dashboard shell
│   │   │   ├── page.tsx         # Overview/home
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx     # Jobs list
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx # Job detail + pipeline
│   │   │   │   │   └── edit/
│   │   │   │   └── new/
│   │   │   ├── candidates/
│   │   │   │   ├── page.tsx     # All candidates
│   │   │   │   └── [id]/
│   │   │   ├── career-page/
│   │   │   │   ├── page.tsx     # Career page editor (Craft.js)
│   │   │   │   └── settings/
│   │   │   ├── team/
│   │   │   ├── settings/
│   │   │   └── analytics/
│   │   ├── (public)/
│   │   │   └── careers/
│   │   │       └── [domain]/    # Public career pages (SSR)
│   │   ├── api/
│   │   │   ├── jobs/
│   │   │   ├── candidates/
│   │   │   ├── applications/
│   │   │   ├── career-page/
│   │   │   ├── ai/
│   │   │   │   ├── source/
│   │   │   │   ├── match/
│   │   │   │   └── generate/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # Design system primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── index.ts
│   │   ├── craft/               # Career page builder blocks
│   │   │   ├── editor.tsx
│   │   │   ├── toolbox.tsx
│   │   │   ├── settings-panel.tsx
│   │   │   ├── blocks/
│   │   │   │   ├── container.tsx
│   │   │   │   ├── text.tsx
│   │   │   │   ├── heading.tsx
│   │   │   │   ├── image.tsx
│   │   │   │   ├── video.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── spacer.tsx
│   │   │   │   ├── divider.tsx
│   │   │   │   ├── columns.tsx
│   │   │   │   ├── hero.tsx
│   │   │   │   ├── team-grid.tsx
│   │   │   │   ├── benefits-list.tsx
│   │   │   │   ├── jobs-list.tsx
│   │   │   │   ├── testimonial.tsx
│   │   │   │   ├── impact-metrics.tsx      # Climate-specific
│   │   │   │   ├── sustainability-badges.tsx
│   │   │   │   ├── carbon-footprint.tsx
│   │   │   │   └── index.ts
│   │   │   └── renderer.tsx     # For public pages
│   │   ├── jobs/
│   │   │   ├── job-card.tsx
│   │   │   ├── job-form.tsx
│   │   │   └── job-filters.tsx
│   │   ├── candidates/
│   │   │   ├── candidate-card.tsx
│   │   │   ├── candidate-profile.tsx
│   │   │   ├── candidate-timeline.tsx
│   │   │   └── ai-match-score.tsx
│   │   ├── pipeline/
│   │   │   ├── kanban-board.tsx
│   │   │   ├── kanban-column.tsx
│   │   │   ├── kanban-card.tsx
│   │   │   └── stage-settings.tsx
│   │   ├── scorecards/
│   │   │   ├── scorecard-form.tsx
│   │   │   └── scorecard-summary.tsx
│   │   └── layout/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── mobile-nav.tsx
│   ├── lib/
│   │   ├── db.ts                # Prisma client
│   │   ├── auth.ts              # Clerk helpers
│   │   ├── tokens.ts            # Design tokens as JS
│   │   ├── utils.ts             # cn(), formatters, etc.
│   │   ├── ai/
│   │   │   ├── sourcing.ts
│   │   │   ├── matching.ts
│   │   │   └── prompts.ts
│   │   └── validators/          # Zod schemas
│   │       ├── job.ts
│   │       ├── candidate.ts
│   │       └── application.ts
│   ├── hooks/
│   │   ├── use-jobs.ts
│   │   ├── use-candidates.ts
│   │   └── use-pipeline.ts
│   └── types/
│       └── index.ts
└── public/
    └── ...
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  logo          String?

  // Brand kit for career pages
  primaryColor  String    @default("#0F766E")
  secondaryColor String?
  fontFamily    String    @default("Inter")

  // Career page settings
  customDomain  String?   @unique
  careerPageJson String?  @db.Text  // Craft.js JSON

  jobs          Job[]
  candidates    Candidate[]
  users         User[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model User {
  id            String    @id @default(cuid())
  clerkId       String    @unique
  email         String
  name          String?
  avatar        String?
  role          UserRole  @default(MEMBER)

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  notes         Note[]
  scores        Score[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

model Job {
  id            String    @id @default(cuid())
  title         String
  slug          String
  description   String    @db.Text
  location      String?
  locationType  LocationType @default(ONSITE)
  employmentType EmploymentType @default(FULL_TIME)
  salaryMin     Int?
  salaryMax     Int?
  salaryCurrency String   @default("USD")

  // Climate-specific fields
  climateCategory String?  // e.g., "Renewable Energy", "Circular Economy"
  impactDescription String? @db.Text
  requiredCerts String[]  // e.g., ["LEED", "NABCEP"]
  greenSkills   String[]  // From GJB Pathways taxonomy

  status        JobStatus @default(DRAFT)
  publishedAt   DateTime?
  closesAt      DateTime?

  // Pipeline stages (JSON for flexibility)
  stages        String    @default("[{\"id\":\"applied\",\"name\":\"Applied\"},{\"id\":\"screening\",\"name\":\"Screening\"},{\"id\":\"interview\",\"name\":\"Interview\"},{\"id\":\"offer\",\"name\":\"Offer\"},{\"id\":\"hired\",\"name\":\"Hired\"}]")

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  applications  Application[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([organizationId, slug])
}

enum JobStatus {
  DRAFT
  PUBLISHED
  PAUSED
  CLOSED
}

enum LocationType {
  ONSITE
  REMOTE
  HYBRID
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
}

model Candidate {
  id            String    @id @default(cuid())
  email         String
  name          String
  phone         String?
  location      String?
  resumeUrl     String?
  linkedinUrl   String?
  portfolioUrl  String?

  // Parsed/AI-enriched data
  skills        String[]
  greenSkills   String[]  // Climate-specific skills
  certifications String[]
  yearsExperience Int?

  // AI matching
  aiSummary     String?   @db.Text

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  applications  Application[]
  notes         Note[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([organizationId, email])
}

model Application {
  id            String    @id @default(cuid())

  candidateId   String
  candidate     Candidate @relation(fields: [candidateId], references: [id])

  jobId         String
  job           Job       @relation(fields: [jobId], references: [id])

  stage         String    @default("applied")
  stageOrder    Int       @default(0)  // For sorting within stage

  // Application form responses
  formResponses String?   @db.Text  // JSON
  coverLetter   String?   @db.Text

  // AI matching score
  matchScore    Float?    // 0-100
  matchReasons  String?   @db.Text  // JSON explanation

  // Screening
  knockoutPassed Boolean  @default(true)

  source        String?   // e.g., "Green Jobs Board", "LinkedIn", "Referral"

  scores        Score[]

  rejectedAt    DateTime?
  hiredAt       DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([candidateId, jobId])
}

model Note {
  id            String    @id @default(cuid())
  content       String    @db.Text

  candidateId   String
  candidate     Candidate @relation(fields: [candidateId], references: [id])

  authorId      String
  author        User      @relation(fields: [authorId], references: [id])

  // For @mentions
  mentions      String[]  // User IDs

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Score {
  id            String    @id @default(cuid())

  applicationId String
  application   Application @relation(fields: [applicationId], references: [id])

  scorerId      String
  scorer        User      @relation(fields: [scorerId], references: [id])

  // Scorecard responses (JSON)
  responses     String    @db.Text
  overallRating Int       // 1-5
  recommendation Recommendation
  comments      String?   @db.Text

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([applicationId, scorerId])
}

enum Recommendation {
  STRONG_YES
  YES
  NEUTRAL
  NO
  STRONG_NO
}
```

---

## Design Tokens

**The authoritative token reference is in `.claude/rules/figma-implementation.md`.**
That file contains the complete 3-tier token system (primitive → semantic → component)
with all color scales, spacing, typography, radius, shadow, motion, and z-index tokens.

Token source files:

- `src/app/globals.css` — CSS custom properties (primary source of truth)
- `src/lib/tokens.ts` — TypeScript access for runtime/animations
- `tailwind.config.ts` — Tailwind theme extension mapping tokens to utility classes

---

## Component Patterns

### Button Component Example

```tsx
// src/components/ui/button.tsx

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SpinnerGap } from "@phosphor-icons/react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        destructive: "bg-error text-white hover:bg-red-600 active:bg-red-700",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

### Craft.js Block Pattern

```tsx
// src/components/craft/blocks/impact-metrics.tsx

import { useNode, UserComponent } from "@craftjs/core";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MetricProps {
  value: string;
  label: string;
  icon?: string;
}

interface ImpactMetricsProps {
  headline: string;
  metrics: MetricProps[];
  backgroundColor: string;
  textColor: string;
}

export const ImpactMetrics: UserComponent<ImpactMetricsProps> = ({
  headline,
  metrics,
  backgroundColor,
  textColor,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <section
      ref={(ref) => connect(drag(ref!))}
      className="px-8 py-16"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold">{headline}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-5xl font-bold">{metric.value}</div>
              <div className="text-lg opacity-80">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ImpactMetricsSettings = () => {
  const {
    actions: { setProp },
    headline,
    metrics,
    backgroundColor,
    textColor,
  } = useNode((node) => ({
    headline: node.data.props.headline,
    metrics: node.data.props.metrics,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Headline</Label>
        <Input
          value={headline}
          onChange={(e) =>
            setProp((props: ImpactMetricsProps) => (props.headline = e.target.value))
          }
        />
      </div>

      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2 rounded-lg border p-3">
          <Label>Metric {index + 1}</Label>
          <Input
            placeholder="Value (e.g., 50K)"
            value={metric.value}
            onChange={(e) =>
              setProp((props: ImpactMetricsProps) => {
                props.metrics[index].value = e.target.value;
              })
            }
          />
          <Input
            placeholder="Label (e.g., Tons CO2 Reduced)"
            value={metric.label}
            onChange={(e) =>
              setProp((props: ImpactMetricsProps) => {
                props.metrics[index].label = e.target.value;
              })
            }
          />
        </div>
      ))}

      <div>
        <Label>Background Color</Label>
        <Input
          type="color"
          value={backgroundColor}
          onChange={(e) =>
            setProp((props: ImpactMetricsProps) => (props.backgroundColor = e.target.value))
          }
        />
      </div>

      <div>
        <Label>Text Color</Label>
        <Input
          type="color"
          value={textColor}
          onChange={(e) =>
            setProp((props: ImpactMetricsProps) => (props.textColor = e.target.value))
          }
        />
      </div>
    </div>
  );
};

ImpactMetrics.craft = {
  displayName: "Impact Metrics",
  props: {
    headline: "Our Climate Impact",
    metrics: [
      { value: "50K", label: "Tons CO2 Reduced" },
      { value: "120", label: "Clean Energy Jobs Created" },
      { value: "15", label: "Countries Impacted" },
    ],
    backgroundColor: "#f0fdfa",
    textColor: "#134e4a",
  },
  related: {
    settings: ImpactMetricsSettings,
  },
};
```

---

## UX Requirements

### Critical Patterns (Must Have)

1. **Dashboard-first design** — Users land on unified overview showing active jobs, pipeline status, pending actions
2. **Kanban pipelines** — Visual drag-and-drop candidate movement across customizable stages
3. **Unified candidate profiles** — All emails, notes, scores, attachments in one place
4. **Career page builder** — No-code drag-drop with live preview (Craft.js)
5. **Transparent AI** — When AI ranks candidates, show why. Always allow override.
6. **Mobile-responsive** — All views must work on tablet/mobile

### Multi-Shell Routing Architecture

The app has three independent "shells" — each a separate product with its own layout, navigation, and routes:

| Shell        | Internal Type | URL Prefix        | Product                        |
| ------------ | ------------- | ----------------- | ------------------------------ |
| **Jobs**     | `"talent"`    | `/jobs/*`         | Green Jobs Board (job seekers) |
| **Coach**    | `"coach"`     | `/candid/coach/*` | Candid (coach side)            |
| **Employer** | `"employer"`  | `/canopy/*`       | Canopy (ATS for employers)     |

**Key decoupling:** Internal Shell types (`"talent"`, `"coach"`, `"employer"`) are stored in the database and MUST NOT change. URL paths use product-name slugs instead. The mapping layer lives in `src/lib/onboarding/types.ts` (`SHELL_URL_SLUGS`, `getShellSlug()`, `getShellFromSlug()`).

**Onboarding routes:**

- `/onboarding/jobs/*` — talent onboarding
- `/onboarding/coach/*` — coach onboarding
- `/onboarding/canopy/*` — employer onboarding

**API routes follow the same pattern:**

- `/api/jobs/*` — talent APIs
- `/api/candid/coach/*` — coach APIs
- `/api/canopy/*` — employer APIs

**Navigation config:** `src/lib/shell/nav-config.ts` is the single source of truth for all shell sidebar links. The `shell` property uses internal types; `href` values use URL slugs.

### Navigation Structure (Canopy / Employer Shell)

```
Sidebar:
├── Dashboard (overview)
├── Roles
├── Candidates (talent pool)
├── Team
├── Analytics
└── Settings
```

### AI Integration UX

- AI suggestions appear contextually, not in separate "AI section"
- Show confidence indicators (high/medium/low)
- Always show reasoning: "85% match: 5 years solar experience, NABCEP certified"
- "Accept" / "Dismiss" actions on every AI suggestion
- Learn from feedback when users override AI

---

## Build Order

### Phase 1: Foundation (Week 1-2)

1. Next.js scaffold with App Router
2. Clerk auth integration
3. Database schema + Prisma setup
4. Design tokens from Figma
5. UI primitives (Button, Input, Card, etc.)
6. Dashboard layout shell

### Phase 2: Career Page Builder (Week 2-4)

1. Craft.js basic integration
2. Core blocks (Container, Text, Image, Video, Columns)
3. Climate-specific blocks (ImpactMetrics, SustainabilityBadges)
4. Settings panel (per-block editing)
5. Brand kit system
6. Save/publish flow
7. Public page SSR renderer

### Phase 3: Core ATS (Week 3-5)

1. Job posting CRUD
2. Kanban pipeline with dnd-kit
3. Candidate profiles
4. Application forms
5. Team notes + @mentions

### Phase 4: AI Integration (Week 5-6)

1. AI sourcing agent
2. Candidate matching/ranking
3. Match score UI with reasoning
4. AI-generated job descriptions

### Phase 5: Polish (Week 6-7)

1. Calendar sync
2. Email templates
3. Analytics dashboard
4. Mobile responsive pass
5. GJB native integration

---

## Climate-Specific Features

These differentiate Canopy from generic ATS platforms:

1. **Green Skills Taxonomy** — Integration with GJB Pathways for climate skill matching
2. **Sustainability Certifications** — Track LEED, B Corp, NABCEP, PMP, etc.
3. **Impact Metrics Blocks** — Career page widgets showing company climate impact
4. **Climate Job Templates** — Pre-built job posts for Solar Installer, ESG Analyst, etc.
5. **Impact Description Field** — "Your role will help reduce X tons of CO2"
6. **Values Alignment Scoring** — AI assessment of candidate-company mission fit

---

## Commands

```bash
# Development
pnpm dev

# Database
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed sample data

# Build
pnpm build
pnpm start

# Linting
pnpm lint
pnpm type-check
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Email
RESEND_API_KEY="..."

# AI
ANTHROPIC_API_KEY="..."
OPENAI_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Notes for Claude Code

### Engineering Philosophy

**Build for scale, not for speed.** Canopy is a multi-tenant SaaS product.
Every implementation should work at 100 organizations, 10K jobs, and 100K
candidates. See `.claude/rules/scale-first-engineering.md` for the full
engineering standards.

**Build from the design system, not from scratch.** Every screen is composed
from Trails Design System components. Never bypass the component library with
raw HTML when a design system component exists. See
`.claude/rules/design-first-implementation.md` for the mandatory workflow.

### Core Rules

1. **Design system first** — Decompose Figma designs into existing components from `/src/components/ui/` before writing any code. Never use raw `<button>`, `<input>`, `<select>` when a design system component exists.
2. **Tokens, not hardcoded values** — All colors, spacing, radii, and shadows must reference CSS variable tokens. See `.claude/rules/figma-implementation.md` for the token reference.
3. **Scale-ready queries** — Always scope by `organizationId`, always paginate, always validate with Zod, never return unbounded result sets.
4. **All states required** — Every data-driven view must handle: loading (Skeleton/Spinner), empty (EmptyState), error (error boundary), and populated states.
5. **Accessibility first** — Proper ARIA attributes, keyboard navigation, focus states on every interactive element.
6. **Type everything** — Full TypeScript, no `any` types.
7. **Server Components default** — Only use "use client" when interactivity requires it.
8. **Phosphor Icons ONLY** — NEVER use Lucide, Heroicons, or any other icon library. Always use Phosphor Icons (`@phosphor-icons/react`). See `src/components/Icons/ICON_MAPPING.md` for the full mapping of icon names to Phosphor equivalents. Import from `@/components/Icons` when using domain-specific aliases (e.g., `Agriculture`, `Energy`) or directly from `@phosphor-icons/react` for standard icons.
9. **Build incrementally** — One component at a time, validate before moving on.
10. **Consistent patterns** — Follow the component patterns established in this file and in `.claude/rules/`.

---

## Design System Implementation Status

### Completed Work

#### Design System Page (`/src/app/page.tsx`)

A comprehensive, functional design system documentation page has been built. It serves as the source of truth for the Trails Design System used across all Green Jobs Board products (Green Jobs Board, Canopy, and Candid).

**Page Structure:**

- **Header** - Sticky navigation with search (⌘K), theme toggle, and section links
- **Left Sidebar** - Collapsible navigation organized by Foundations and Components
- **Main Content** - Component showcases with live examples, code previews, props tables
- **Right Sidebar (On This Page)** - Dynamic table of contents with scroll tracking

**Section Wrappers:**

```tsx
<div id="components" className="space-y-16 scroll-mt-24">
  {/* All component sections: buttons, form-controls, data-display, overlays, etc. */}
</div>

<div id="foundations" className="space-y-16 scroll-mt-24">
  {/* All foundation sections: colors, typography, spacing, shadows, borders */}
</div>
```

#### Design System Components (`/src/components/design-system/`)

| Component         | File                   | Description                                                                                                                        |
| ----------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Header            | `Header.tsx`           | Sticky header with search, theme toggle, nav links. NavLinks use IntersectionObserver for active state tracking and smooth scroll. |
| Sidebar           | `Sidebar.tsx`          | Collapsible navigation with section groupings. Uses IntersectionObserver for scroll-based highlighting.                            |
| SearchModal       | `SearchModal.tsx`      | Command palette (⌘K) with keyboard navigation and smooth scroll to sections.                                                       |
| ThemeToggle       | `ThemeToggle.tsx`      | Light/dark mode toggle using next-themes. Dynamically imported to avoid hydration issues.                                          |
| OnThisPage        | `OnThisPage.tsx`       | Right sidebar TOC with scroll tracking via IntersectionObserver.                                                                   |
| ComponentSection  | `ComponentSection.tsx` | Section wrapper with title, description, optional Figma link.                                                                      |
| ComponentCard     | `ComponentSection.tsx` | Card container for component examples.                                                                                             |
| CodeBlock         | `CodeBlock.tsx`        | Syntax-highlighted code display with copy button.                                                                                  |
| CodePreview       | `CodeBlock.tsx`        | Live component preview with toggleable code view.                                                                                  |
| PropsTable        | `PropsTable.tsx`       | Table for documenting component props.                                                                                             |
| VariantTable      | `PropsTable.tsx`       | Table for showing component variants with previews.                                                                                |
| UsageGuide        | `ComponentSection.tsx` | Do's and Don'ts guidance cards.                                                                                                    |
| AccessibilityInfo | `ComponentSection.tsx` | Accessibility notes card.                                                                                                          |

#### Dark Mode Implementation

**General rule:** Use semantic CSS variable tokens for dark mode. The token system
automatically switches values in dark mode, so no manual `dark:` overrides are needed
in feature code. See `.claude/rules/figma-implementation.md` for token reference.

**Legacy exception — Design system documentation pages only:** The design system
docs pages in `/src/components/design-system/` and `/src/app/page.tsx` use an older
Tailwind utility class pattern where neutral colors invert unexpectedly. These specific
files use hardcoded hex values for dark mode as a workaround. **This pattern must NOT
be used in feature code** — use semantic tokens instead.

Design system docs files with this legacy pattern:

- `Header.tsx`, `Sidebar.tsx`, `SearchModal.tsx`, `ComponentSection.tsx`
- `PropsTable.tsx`, `CodeBlock.tsx`, `page.tsx`

#### Navigation System

All three navigation systems are synchronized and functional:

1. **Header NavLinks** (`Header.tsx`)
   - Links to `#foundations` and `#components` wrapper sections
   - Active state via IntersectionObserver
   - Smooth scroll with 80px offset for sticky header

2. **Sidebar** (`Sidebar.tsx`)
   - Hierarchical navigation matching page structure
   - Expandable sections for Colors, Typography, Buttons, Form Controls, etc.
   - Active state tracking via IntersectionObserver
   - Smooth scroll to sections

3. **SearchModal** (`SearchModal.tsx`)
   - Full-text search across all components and tokens
   - Keyboard navigation (↑↓ to navigate, ↵ to select, ESC to close)
   - Smooth scroll to selected section
   - All hrefs verified to match actual section IDs

**Section ID Mapping:**

```
Components (id="components"):
├── buttons
├── form-controls (children: input, textarea, select, checkbox, radio, switch, slider, segmented-controller, search-input, chips)
├── data-display (children: badge, avatar, card, toast)
├── overlays (children: dialog, modal, tooltip)
├── toolbar
├── tabs
├── breadcrumbs
├── pagination
├── dropdown-menu
├── kanban
├── candidate-card
├── stage-badge
└── scorecard

Foundations (id="foundations"):
├── colors (children: colors-primary, colors-neutral, colors-semantic, colors-secondary)
├── typography (children: typography-scale, typography-weights)
├── spacing
├── shadows
└── borders
```

#### Motion Tokens

See `.claude/rules/figma-implementation.md` for the authoritative motion token
values (durations, easings, semantic transitions). The source of truth is `globals.css`.

### UI Components Implemented (`/src/components/ui/`)

All components are fully functional with dark mode support:

| Category          | Components                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Buttons**       | Button (primary, secondary, tertiary, destructive, ghost, inverse, icon sizes)                                         |
| **Form Controls** | Input, Textarea, Label, Select, Checkbox, RadioGroup, Switch, Slider, SegmentedController, SearchInput, Chip/ChipGroup |
| **Data Display**  | Badge, Avatar/AvatarGroup, Card, Toast                                                                                 |
| **Overlays**      | Dialog, Modal, Tooltip                                                                                                 |
| **Navigation**    | Tabs (pill & underline variants), Breadcrumbs, Pagination, DropdownMenu                                                |
| **Editor**        | Toolbar, ToolbarButton, ToolbarToggleGroup                                                                             |
| **ATS-Specific**  | KanbanBoard/Column/Card, CandidateCard, StageBadge/StageProgress, Scorecard/StarRating                                 |

### Build Verification

```bash
pnpm build  # ✓ Compiled successfully
pnpm dev    # Design system available at localhost:3000
```

---

## Documentation Organization

### Docs Folder Structure

All project documentation (`.md` files) is organized in the `docs/` folder with topic-based subfolders:

```
docs/
├── design-system/       # Gradient system, design tokens, visual references
├── candid-platform/     # Candid coaching platform features and specs
├── job-seeker/          # Job seeker portal, Green Jobs Board PRD
├── implementation/      # Checklists, status summaries, remediation
├── ux-audits/           # UI/UX audits and improvement plans
├── other/               # Miscellaneous documentation
└── interview-scheduler-ux-improvements.md
```

### Auto-Organization Rule

**When creating new `.md` documentation files:**

1. **Review the file** - After creating any new `.md` documentation file at the project root, review its content and purpose
2. **Categorize appropriately** - Move the file to the correct `docs/` subfolder based on its topic:
   - Design/gradient/visual → `docs/design-system/`
   - Candid coaching/platform features → `docs/candid-platform/`
   - Job seeker/portal/Green Jobs Board → `docs/job-seeker/`
   - Checklists/status/implementation → `docs/implementation/`
   - UI/UX audits/improvements → `docs/ux-audits/`
   - Other topics → `docs/other/`
3. **Create new subfolders if needed** - If a new topic emerges that doesn't fit existing categories, create a new descriptive subfolder

**Files that stay at root:**

- `CLAUDE.md` - This project context file
- `README.md` - Project readme (if exists)
- Configuration files

---

### Known Issues & Future Work

1. **ThemeToggle hydration** - Resolved with `dynamic()` import and `ssr: false`
2. **"Patterns" section** - Removed from header nav (no patterns section exists yet)
3. **Mobile navigation** - Sidebar hidden on mobile, could add mobile drawer
