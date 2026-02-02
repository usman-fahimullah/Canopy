# Talent Onboarding Implementation Plan

_Speed to value: Get job seekers to personalized matches in 60-90 seconds_

---

## Overview

### Philosophy

Talent onboarding prioritizes **speed to value**. Job seekers should see relevant opportunities within 90 seconds of starting. Everything else (resume, photo, detailed preferences) is collected progressively through contextual prompts.

### Key Metrics

| Metric                      | Target            |
| --------------------------- | ----------------- |
| Time to complete            | 60-90 seconds     |
| Drop-off rate               | < 15%             |
| Job matches shown           | 5+ relevant roles |
| Profile completion (7 days) | > 60%             |

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TALENT ONBOARDING                               │
└─────────────────────────────────────────────────────────────────────────────┘

[Sign Up] → [Verify Email] → [Profile] → [Background] → [Skills] → [Preferences] → [HOME]
                                │              │            │             │            │
                                ▼              ▼            ▼             ▼            ▼
                            Name *         Stage *      Pathways *    Location *   Job feed +
                            + optional:    Experience * + Categories * Remote *    profile
                            photo,         + optional:                Job types *  checklist
                            pronouns,      role, goals                + optional:
                            phone,                                    salary
                            LinkedIn

* = required field
```

---

## Design System Components

This onboarding uses two tag components from the Trails Design System:

### PathwayTag — Climate Industry (WHERE you work)

```typescript
import { PathwayTag, PathwayType } from "@/components/ui/pathway-tag";
```

**20 pathway types** organized by color family:
| Family | Types |
|--------|-------|
| 🟢 Green | `agriculture`, `finance`, `forestry`, `transportation`, `waste-management` |
| 🔵 Blue | `conservation`, `research`, `sports`, `water` |
| 🟠 Orange | `construction`, `manufacturing`, `real-estate`, `urban-planning` |
| 🔴 Red | `education`, `medical`, `tourism` |
| 🟡 Yellow | `energy`, `technology` |
| 🟣 Purple | `arts-culture`, `media`, `policy` |

### CategoryTag — Job Function (WHAT you do)

```typescript
import { CategoryTag, JobCategoryType } from "@/components/ui/category-tag";
```

**15 category types:**

```
software-engineering | supply-chain | administration | advocacy-policy
climate-sustainability | investment | sales | content
marketing-design | product | data | education
finance-compliance | operations | science
```

---

## Screen-by-Screen Specification

### Screen 1: Profile (Shared Base)

**Route:** `/onboarding/profile`

| Element       | Type         | Required | Notes                                |
| ------------- | ------------ | -------- | ------------------------------------ |
| First name    | Text input   | Yes      | Pre-filled if from OAuth             |
| Last name     | Text input   | Yes      | Pre-filled if from OAuth             |
| Profile photo | Image upload | No       | "Helps you stand out to employers"   |
| Pronouns      | Text input   | No       | "How should we refer to you?"        |
| Phone         | Text input   | No       | "For employer contact"               |
| LinkedIn URL  | Text input   | No       | "Optional, but helps us personalize" |

**UI Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Tell us about yourself                                 │
│                                                         │
│  First name *                    Last name *            │
│  [____________________]         [____________________]  │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Add more details (optional)                            │
│                                                         │
│  ┌─────────┐                                            │
│  │   [+]   │  Profile photo                             │
│  │  Photo  │  Helps you stand out to employers          │
│  └─────────┘                                            │
│                                                         │
│  Pronouns                        Phone                  │
│  [____________________]         [____________________]  │
│                                                         │
│  LinkedIn URL                                           │
│  [____________________]                                 │
│                                                         │
│                                        [Continue →]     │
└─────────────────────────────────────────────────────────┘
```

**UI Notes:**

- Clear visual separation between required and optional fields
- "Add more details (optional)" header sets expectations
- Photo shown but not blocking progress
- Completionists can fill everything; speed-focused users skip optional
- "Continue" button always enabled

**Validation:**

- First name: 1-50 characters
- Last name: 1-50 characters
- LinkedIn URL: Valid URL format if provided
- Phone: Valid phone format if provided

---

### Screen 2: Background

**Route:** `/onboarding/talent/background`

| Element                  | Type                | Required | Notes                                 |
| ------------------------ | ------------------- | -------- | ------------------------------------- |
| Career stage             | Single select chips | Yes      | Options below                         |
| Years of experience      | Single select       | Yes      | Ranges                                |
| Current/most recent role | Text input          | No       | Free text with autocomplete           |
| Goals                    | Textarea            | No       | "What are you looking for?"           |
| Work experience          | Repeatable form     | No       | Add multiple positions                |

**Career Stage Options:**

```
[ ] Student / Recent graduate
[ ] Early career (0-3 years)
[ ] Mid-career (4-10 years)
[ ] Senior / Leadership (10+ years)
[ ] Career changer
```

**Years of Experience Options:**

```
[ ] < 1 year
[ ] 1-3 years
[ ] 4-7 years
[ ] 8-15 years
[ ] 15+ years
```

**UI Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Your background                                        │
│  Help us understand where you are in your career        │
│                                                         │
│  What stage are you at? *                               │
│                                                         │
│  [Student / Recent grad]  [Early career (0-3 yrs)]      │
│  [Mid-career (4-10 yrs)]  [Senior (10+ yrs)]            │
│  [Career changer]                                       │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Years of experience *                                  │
│                                                         │
│  [< 1 year]  [1-3 years]  [4-7 years]                   │
│  [8-15 years]  [15+ years]                              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Build your profile (optional)                          │
│                                                         │
│  Current or most recent role                            │
│  [____________________________________]                 │
│                                                         │
│  What are you looking for?                              │
│  [Share your goals or what excites you about climate___]│
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Work experience                                        │
│  [+ Add work experience]                                │
│                                                         │
│                                        [Continue →]     │
└─────────────────────────────────────────────────────────┘
```

**Work Experience Form (expandable):**

```
┌─────────────────────────────────────────────────────────┐
│  Work experience                                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Job title                                      │    │
│  │  [Product Manager_________________________]     │    │
│  │                                                 │    │
│  │  Company                                        │    │
│  │  [Tesla_________________________________]      │    │
│  │                                                 │    │
│  │  Start date              End date              │    │
│  │  [Jan 2020___]          [Present ☑]           │    │
│  │                                                 │    │
│  │  Description (optional)                         │    │
│  │  [Led product strategy for..._______________]  │    │
│  │                                                 │    │
│  │  [Remove]                              [Save]   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  [+ Add another position]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**UI Notes:**

- Chips should be large, tappable (mobile-first)
- Single selection — selecting one deselects others
- Show subtle helper text: "This helps us show you roles at the right level"
- Goals field lets passionate users share their "why"
- Work experience is collapsible — starts collapsed with "+ Add work experience" button
- Users can add multiple positions
- "Present" checkbox for current role
- Building profile early helps with employer visibility

---

### Screen 3: Skills & Sectors

**Route:** `/onboarding/talent/skills`

This screen uses **PathwayTag** for industry selection and **CategoryTag** for job function selection.

| Element          | Type                     | Required | Notes             |
| ---------------- | ------------------------ | -------- | ----------------- |
| Climate pathways | Multi-select PathwayTag  | Yes (1+) | Max 5 recommended |
| Job categories   | Multi-select CategoryTag | Yes (1+) | Max 3 recommended |

#### Pathway Selection (Industry)

**Question:** "What climate industries interest you?"

**Component Usage:**

```tsx
import { PathwayTag, PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import {
  Plant,
  Coins,
  Tree,
  Car,
  Recycle,
  Leaf,
  Flask,
  Football,
  Drop,
  HardHat,
  Factory,
  Buildings,
  City,
  GraduationCap,
  FirstAid,
  Airplane,
  Lightning,
  Cpu,
  Palette,
  Broadcast,
  Gavel,
} from "@phosphor-icons/react";

const pathwayIcons: Record<PathwayType, React.ReactNode> = {
  agriculture: <Plant />,
  finance: <Coins />,
  forestry: <Tree />,
  transportation: <Car />,
  "waste-management": <Recycle />,
  conservation: <Leaf />,
  research: <Flask />,
  sports: <Football />,
  water: <Drop />,
  construction: <HardHat />,
  manufacturing: <Factory />,
  "real-estate": <Buildings />,
  "urban-planning": <City />,
  education: <GraduationCap />,
  medical: <FirstAid />,
  tourism: <Airplane />,
  energy: <Lightning />,
  technology: <Cpu />,
  "arts-culture": <Palette />,
  media: <Broadcast />,
  policy: <Gavel />,
};

// All 20 pathways
const ALL_PATHWAYS: PathwayType[] = [
  "energy",
  "technology",
  "transportation",
  "agriculture",
  "conservation",
  "water",
  "forestry",
  "manufacturing",
  "construction",
  "real-estate",
  "urban-planning",
  "finance",
  "policy",
  "research",
  "education",
  "waste-management",
  "arts-culture",
  "media",
  "medical",
  "tourism",
];

function PathwaySelector({
  selected,
  onToggle,
}: {
  selected: PathwayType[];
  onToggle: (pathway: PathwayType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_PATHWAYS.map((pathway) => (
        <PathwayTag
          key={pathway}
          pathway={pathway}
          icon={pathwayIcons[pathway]}
          selected={selected.includes(pathway)}
          onClick={() => onToggle(pathway)}
        />
      ))}
    </div>
  );
}
```

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  What climate industries interest you?                          │
│  Select up to 5                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [⚡ Energy]  [💻 Technology]  [🚗 Transportation]              │
│                                                                 │
│  [🌱 Agriculture]  [🌿 Conservation]  [💧 Water]                │
│                                                                 │
│  [🌲 Forestry]  [🏭 Manufacturing]  [🏗️ Construction]           │
│                                                                 │
│  [🏢 Real Estate]  [🏙️ Urban Planning]  [💰 Finance]            │
│                                                                 │
│  [⚖️ Policy]  [🔬 Research]  [🎓 Education]                     │
│                                                                 │
│  [♻️ Waste Management]  [🎨 Arts & Culture]  [📺 Media]         │
│                                                                 │
│  [🏥 Medical]  [✈️ Tourism]  [🏈 Sports]                        │
│                                                                 │
│                                          3 selected             │
└─────────────────────────────────────────────────────────────────┘
```

#### Category Selection (Job Function)

**Question:** "What type of work do you do?"

**Component Usage:**

```tsx
import { CategoryTag, JobCategoryType, jobCategoryLabels } from "@/components/ui/category-tag";
import {
  Code,
  Package,
  UsersThree,
  Megaphone,
  Leaf,
  TrendUp,
  Handshake,
  PencilSimple,
  PaintBrush,
  Cube,
  ChartBar,
  GraduationCap,
  Scales,
  Gear,
  Atom,
} from "@phosphor-icons/react";

const categoryIcons: Record<JobCategoryType, React.ReactNode> = {
  "software-engineering": <Code />,
  "supply-chain": <Package />,
  administration: <UsersThree />,
  "advocacy-policy": <Megaphone />,
  "climate-sustainability": <Leaf />,
  investment: <TrendUp />,
  sales: <Handshake />,
  content: <PencilSimple />,
  "marketing-design": <PaintBrush />,
  product: <Cube />,
  data: <ChartBar />,
  education: <GraduationCap />,
  "finance-compliance": <Scales />,
  operations: <Gear />,
  science: <Atom />,
};

// All 15 categories
const ALL_CATEGORIES: JobCategoryType[] = [
  "software-engineering",
  "data",
  "product",
  "marketing-design",
  "climate-sustainability",
  "operations",
  "finance-compliance",
  "sales",
  "investment",
  "science",
  "research",
  "policy",
  "administration",
  "content",
  "education",
];

function CategorySelector({
  selected,
  onToggle,
}: {
  selected: JobCategoryType[];
  onToggle: (category: JobCategoryType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onToggle(category)}
          className={cn(
            "transition-all",
            selected.includes(category) &&
              "rounded-lg ring-2 ring-[var(--primitive-green-500)] ring-offset-2"
          )}
        >
          <CategoryTag category={category} icon={categoryIcons[category]} />
        </button>
      ))}
    </div>
  );
}
```

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  What type of work do you do?                                   │
│  Select up to 3                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [💻 Software Engineering]  [📊 Data]  [📦 Product]             │
│                                                                 │
│  [🎨 Marketing & Design]  [🌱 Climate & Sustainability]         │
│                                                                 │
│  [⚙️ Operations]  [⚖️ Finance, Legal, & Compliance]             │
│                                                                 │
│  [🤝 Sales]  [📈 Investment]  [🔬 Science]                      │
│                                                                 │
│  [📢 Advocacy & Policy]  [👥 Administration]  [✏️ Content]      │
│                                                                 │
│  [🎓 Education]  [📦 Supply Chain]                              │
│                                                                 │
│                                          2 selected             │
└─────────────────────────────────────────────────────────────────┘
```

**UI Notes:**

- PathwayTag has built-in `selected` prop for visual state
- CategoryTag needs wrapper with ring for selection state
- Show selection count: "3 pathways selected", "2 categories selected"
- Animate chips on selection (scale bounce)

---

### Screen 4: Preferences

**Route:** `/onboarding/talent/preferences`

| Element            | Type                  | Required | Notes                       |
| ------------------ | --------------------- | -------- | --------------------------- |
| Location           | Location autocomplete | Yes      | Multi-select cities/regions |
| Remote preference  | Single select         | Yes      | Options below               |
| Job type           | Multi-select chips    | Yes (1+) | Full-time, Part-time, etc.  |
| Salary expectation | Range slider          | No       | "Skip" option available     |

**Remote Preference Options:**

```
( ) On-site only
( ) Hybrid preferred
( ) Remote preferred
( ) Remote only
( ) Open to all
```

**Job Type Options:**

```
[ ] Full-time
[ ] Part-time
[ ] Contract
[ ] Internship
[ ] Freelance
```

**Salary Range:**

- Dual-handle slider
- Range: $30k - $300k+ (adjust by market)
- Show as "$80k - $120k" format
- "Skip" link below

**UI Notes:**

- Location input with Google Places autocomplete
- Allow multiple locations: "San Francisco, New York, Remote"
- Show "x locations selected" badge

---

## Post-Onboarding: Home Experience

### Job Feed

- Personalized feed based on onboarding selections
- "Why this job" badges showing match reasons using PathwayTag and CategoryTag
- Quick apply with 1-click (if profile sufficient)

**Match Reason Display:**

```tsx
// On job cards, show why this job matches
<div className="flex flex-wrap gap-1">
  <PathwayTag pathway="energy" icon={<Lightning />} minimized />
  <CategoryTag category="software-engineering" icon={<Code />} variant="mini" />
</div>
```

### Profile Completion Checklist

```
┌─────────────────────────────────────────┐
│  Complete your profile                  │
│  ━━━━━━━━━━━━━━━━━━━ 40%               │
│                                         │
│  ☑ Basic info                          │
│  ☑ Career background                   │
│  ☐ Add resume — "Get 3x more views"    │
│  ☐ Add photo — "Stand out to employers"│
│  ☐ Work history                        │
│  ☐ Education                           │
└─────────────────────────────────────────┘
```

**Checklist Behavior:**

- Dismissible but reappears if < 80% complete
- Each item links to relevant profile section
- Show benefit copy for each incomplete item
- Celebrate completion with animation

---

## Progressive Profiling Triggers

| Trigger                | Prompt                                          | Priority |
| ---------------------- | ----------------------------------------------- | -------- |
| First job save         | "Add your resume to apply faster"               | High     |
| 3rd job view           | "Add a photo to stand out"                      | Medium   |
| First application      | "Complete work history for better matches"      | High     |
| 7 days inactive        | Email: "Complete your profile to get noticed"   | Medium   |
| Employer views profile | "An employer viewed you! Complete your profile" | High     |

---

## Data Model

### Talent Profile Fields (collected in onboarding)

```typescript
import { PathwayType } from "@/components/ui/pathway-tag";
import { JobCategoryType } from "@/components/ui/category-tag";

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string; // ISO date
  endDate?: string; // ISO date, null if current
  isCurrent: boolean;
  description?: string;
}

interface TalentOnboardingData {
  // Screen 1: Profile (required)
  firstName: string;
  lastName: string;

  // Screen 1: Profile (optional)
  photoUrl?: string;
  pronouns?: string;
  phone?: string;
  linkedInUrl?: string;

  // Screen 2: Background (required)
  careerStage: "student" | "early" | "mid" | "senior" | "changer";
  yearsExperience: "<1" | "1-3" | "4-7" | "8-15" | "15+";

  // Screen 2: Background (optional)
  currentRole?: string;
  goals?: string;
  workExperience?: WorkExperience[]; // Optional work history

  // Screen 3: Skills (required, using design system types)
  pathways: PathwayType[]; // Climate industries (max 5)
  categories: JobCategoryType[]; // Job functions (max 3)

  // Screen 4: Preferences (required)
  locations: string[];
  remotePreference: "onsite" | "hybrid" | "remote-preferred" | "remote-only" | "open";
  jobTypes: ("full-time" | "part-time" | "contract" | "internship" | "freelance")[];

  // Screen 4: Preferences (optional)
  salaryMin?: number;
  salaryMax?: number;
}

// Note: Ethnicity is NOT collected in onboarding
// It lives in Profile Settings as voluntary self-identification
```

### Type Definitions Reference

```typescript
// From @/components/ui/pathway-tag
type PathwayType =
  | "agriculture"
  | "finance"
  | "forestry"
  | "transportation"
  | "waste-management"
  | "conservation"
  | "research"
  | "sports"
  | "water"
  | "construction"
  | "manufacturing"
  | "real-estate"
  | "urban-planning"
  | "education"
  | "medical"
  | "tourism"
  | "energy"
  | "technology"
  | "arts-culture"
  | "media"
  | "policy";

// From @/components/ui/category-tag
type JobCategoryType =
  | "software-engineering"
  | "supply-chain"
  | "administration"
  | "advocacy-policy"
  | "climate-sustainability"
  | "investment"
  | "sales"
  | "content"
  | "marketing-design"
  | "product"
  | "data"
  | "education"
  | "finance-compliance"
  | "operations"
  | "science";
```

### Onboarding Progress

```typescript
interface TalentOnboardingProgress {
  complete: boolean;
  completedAt: string | null;
  currentStep: "background" | "skills" | "preferences" | null;
  matchCount?: number; // Store for re-display
}
```

---

## Technical Implementation

### Component Structure

```
src/app/onboarding/talent/
├── layout.tsx              # Shared layout with progress bar
├── background/
│   └── page.tsx           # Career stage + experience
├── skills/
│   ├── page.tsx           # Pathways + Categories selection
│   └── components/
│       ├── PathwaySelector.tsx   # Uses PathwayTag
│       └── CategorySelector.tsx  # Uses CategoryTag
├── preferences/
│   └── page.tsx           # Location + work type + salary → redirect to home
└── components/
    ├── CareerStageSelector.tsx
    ├── LocationInput.tsx
    └── SalaryRangeSlider.tsx
```

### PathwaySelector Component

```tsx
// src/app/onboarding/talent/skills/components/PathwaySelector.tsx
"use client";

import { PathwayTag, PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import { cn } from "@/lib/utils";

// Icon imports...

interface PathwaySelectorProps {
  selected: PathwayType[];
  onChange: (pathways: PathwayType[]) => void;
  max?: number;
}

export function PathwaySelector({ selected, onChange, max = 5 }: PathwaySelectorProps) {
  const handleToggle = (pathway: PathwayType) => {
    if (selected.includes(pathway)) {
      onChange(selected.filter((p) => p !== pathway));
    } else if (selected.length < max) {
      onChange([...selected, pathway]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Select up to {max}</span>
        <span className="font-medium">{selected.length} selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_PATHWAYS.map((pathway) => (
          <PathwayTag
            key={pathway}
            pathway={pathway}
            icon={pathwayIcons[pathway]}
            selected={selected.includes(pathway)}
            onClick={() => handleToggle(pathway)}
          />
        ))}
      </div>
    </div>
  );
}
```

### CategorySelector Component

```tsx
// src/app/onboarding/talent/skills/components/CategorySelector.tsx
"use client";

import { CategoryTag, JobCategoryType, jobCategoryLabels } from "@/components/ui/category-tag";
import { cn } from "@/lib/utils";

// Icon imports...

interface CategorySelectorProps {
  selected: JobCategoryType[];
  onChange: (categories: JobCategoryType[]) => void;
  max?: number;
}

export function CategorySelector({ selected, onChange, max = 3 }: CategorySelectorProps) {
  const handleToggle = (category: JobCategoryType) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else if (selected.length < max) {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Select up to {max}</span>
        <span className="font-medium">{selected.length} selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleToggle(category)}
            className={cn(
              "rounded-lg transition-all",
              selected.includes(category) &&
                "ring-2 ring-[var(--primitive-green-500)] ring-offset-2"
            )}
          >
            <CategoryTag category={category} icon={categoryIcons[category]} />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### API Endpoints

```
POST /api/onboarding/talent/background
POST /api/onboarding/talent/skills
  Body: { pathways: PathwayType[], categories: JobCategoryType[] }
POST /api/onboarding/talent/preferences
GET  /api/onboarding/talent/matches   # Returns match count + preview
POST /api/onboarding/talent/complete  # Marks onboarding done
```

### State Management

- Use `OnboardingFormProvider` context for cross-step state
- Persist to server after each step (not just at end)
- Store in `Account.onboardingProgress` JSON field

---

## Error Handling

| Scenario             | Handling                                               |
| -------------------- | ------------------------------------------------------ |
| API timeout on save  | Show retry button, don't block progress                |
| No job matches found | Show "0 matches" with suggestions to broaden criteria  |
| Network offline      | Queue saves, show offline indicator                    |
| Session expired      | Redirect to login, preserve form state in localStorage |

---

## Analytics Events

| Event                            | Properties                                            |
| -------------------------------- | ----------------------------------------------------- |
| `onboarding_started`             | `shell: 'talent'`                                     |
| `onboarding_step_completed`      | `step: string, duration_seconds: number`              |
| `onboarding_pathways_selected`   | `pathways: PathwayType[], count: number`              |
| `onboarding_categories_selected` | `categories: JobCategoryType[], count: number`        |
| `onboarding_step_skipped`        | `step: string`                                        |
| `onboarding_completed`           | `total_duration_seconds: number, match_count: number` |
| `onboarding_abandoned`           | `last_step: string, duration_seconds: number`         |

---

## Accessibility Requirements

- All form inputs have visible labels
- PathwayTag and CategoryTag selections announced by screen readers
- Use `role="button"` and `tabIndex={0}` on clickable tags (PathwayTag has this built-in)
- Progress bar has aria-label with step count
- Transition animation respects `prefers-reduced-motion`
- Minimum touch target size: 44x44px
- Color contrast: WCAG AA minimum

---

## Mobile Considerations

- Full-screen steps (no visible chrome)
- Sticky "Continue" button at bottom
- Tags wrap naturally on narrow screens
- Keyboard avoidance for text inputs
- Native-feeling transitions between steps
