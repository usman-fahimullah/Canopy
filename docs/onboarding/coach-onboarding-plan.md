# Coach Onboarding Implementation Plan

_Build a complete, discoverable profile to attract your first clients_

---

## Overview

### Philosophy

Coach onboarding requires a **complete profile upfront** because coaches need to be discoverable. Unlike talent (who consume content), coaches produce content — their profile IS their product. The onboarding is longer but results in a "go live" moment that feels like launching a business.

### Key Metrics

| Metric                  | Target       |
| ----------------------- | ------------ |
| Time to complete        | 8-10 minutes |
| Profile completion rate | > 70%        |
| Go Live rate            | > 60%        |
| First booking (30 days) | > 25%        |

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COACH ONBOARDING                                │
└─────────────────────────────────────────────────────────────────────────────┘

Phase 1: Identity (3-5 min)
[Sign Up] → [Verify] → [Profile] → [About] → [Expertise]
                          │           │           │
                          ▼           ▼           ▼
                      Name/Photo   Photo/Bio   Coaching types +
                      (required)   Tagline     Pathways + Categories

Phase 2: Services (2-3 min)
[Services] → [Pricing]
    │            │
    ▼            ▼
Session      Rates per
types        service

Phase 3: Availability (1-2 min)
[Availability] → [Calendar Sync]
      │               │
      ▼               ▼
  Weekly hours    Connect Google/
  + buffer        Outlook (optional)

Phase 4: Payout (optional)
[Payout Setup]
      │
      ▼
  Stripe Connect
  (can skip, prompted before first payout)

Phase 5: Launch
[Preview Profile] → [Go Live!] → [Share Profile]
        │                │              │
        ▼                ▼              ▼
    Review all       Publish to     Copy link +
    sections         marketplace    social share

                          │
                          ▼
                       [HOME]
                  with "Get first client"
                       checklist
```

---

## Design System Components

This onboarding uses two tag components from the Trails Design System for the Expertise step:

### PathwayTag — Industry Focus (WHERE clients work)

```typescript
import { PathwayTag, PathwayType } from "@/components/ui/pathway-tag";
```

Used to indicate which climate industries the coach specializes in helping clients navigate.

**20 pathway types** organized by color family:
| Family | Types |
|--------|-------|
| 🟢 Green | `agriculture`, `finance`, `forestry`, `transportation`, `waste-management` |
| 🔵 Blue | `conservation`, `research`, `sports`, `water` |
| 🟠 Orange | `construction`, `manufacturing`, `real-estate`, `urban-planning` |
| 🔴 Red | `education`, `medical`, `tourism` |
| 🟡 Yellow | `energy`, `technology` |
| 🟣 Purple | `arts-culture`, `media`, `policy` |

### CategoryTag — Career Focus (WHAT clients do)

```typescript
import { CategoryTag, JobCategoryType } from "@/components/ui/category-tag";
```

Used to indicate which job functions/roles the coach helps clients with.

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

| Element      | Type       | Required | Notes                         |
| ------------ | ---------- | -------- | ----------------------------- |
| First name   | Text input | Yes      |                               |
| Last name    | Text input | Yes      |                               |
| LinkedIn URL | Text input | No       | For credibility               |
| Bio          | Textarea   | No       | Collected again in About step |

**Note:** Photo is NOT collected here for coaches — it's a dedicated step in "About" with better UX guidance.

---

### Screen 2: About You

**Route:** `/onboarding/coach/about`

| Element       | Type                  | Required | Notes                    |
| ------------- | --------------------- | -------- | ------------------------ |
| Profile photo | Image upload          | **Yes**  | With cropper             |
| Tagline       | Text input            | Yes      | 60 char max              |
| Bio           | Rich textarea         | Yes      | 500 char min recommended |
| Location      | Location autocomplete | Yes      | City, Country            |

**Photo Upload UX:**

```
┌─────────────────────────────────────────┐
│  ┌─────────────┐                        │
│  │             │   Add a photo that     │
│  │   [+Add]    │   shows your face      │
│  │             │   clearly              │
│  └─────────────┘                        │
│                                         │
│  Tips for a great photo:                │
│  • Face clearly visible                 │
│  • Good lighting                        │
│  • Professional but approachable        │
│  • Solid or simple background           │
└─────────────────────────────────────────┘
```

**Tagline Examples:**

- "Helping climate professionals find their path"
- "Executive coach for sustainability leaders"
- "Career transitions into clean energy"

**Bio Guidance:**

```
Tell potential clients:
• Who you help (your ideal client)
• What transformation you provide
• Your background and approach
• Why you're passionate about this work
```

**Validation:**

- Photo: Required, min 200x200px, max 5MB
- Tagline: 10-60 characters
- Bio: 100-2000 characters (500+ recommended)

---

### Screen 3: Expertise

**Route:** `/onboarding/coach/expertise`

This screen uses **PathwayTag** for industry specialization and **CategoryTag** for career function focus.

| Element          | Type                     | Required | Notes                      |
| ---------------- | ------------------------ | -------- | -------------------------- |
| Coaching type    | Multi-select chips       | Yes (1+) | Max 3 recommended          |
| Industry focus   | Multi-select PathwayTag  | Yes (1+) | Max 5 recommended          |
| Career focus     | Multi-select CategoryTag | No       | Max 5 recommended          |
| Experience level | Single select            | Yes      | Years coaching             |
| Certifications   | Tag input                | No       | Free-form with suggestions |

#### Coaching Type Selection

**Question:** "What type of coaching do you offer?"

**Coaching Type Options:**

```
[ ] Career Coaching
[ ] Executive Coaching
[ ] Leadership Development
[ ] Life Coaching
[ ] Interview Prep
[ ] Resume & Personal Branding
[ ] Salary Negotiation
[ ] Career Transitions
[ ] Industry-Specific Guidance
```

#### Industry Focus (PathwayTag)

**Question:** "Which climate industries do you specialize in?"

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

// Recommended pathways for coaches (most common)
const COACH_PATHWAYS: PathwayType[] = [
  "energy",
  "technology",
  "finance",
  "policy",
  "conservation",
  "agriculture",
  "transportation",
  "manufacturing",
  "construction",
  "research",
];

function CoachPathwaySelector({
  selected,
  onToggle,
}: {
  selected: PathwayType[];
  onToggle: (pathway: PathwayType) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Help clients find you by selecting the industries you know best
      </p>
      <div className="flex flex-wrap gap-2">
        {COACH_PATHWAYS.map((pathway) => (
          <PathwayTag
            key={pathway}
            pathway={pathway}
            icon={pathwayIcons[pathway]}
            selected={selected.includes(pathway)}
            onClick={() => onToggle(pathway)}
          />
        ))}
      </div>
      <button className="text-sm text-primary underline">Show all industries</button>
    </div>
  );
}
```

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Which climate industries do you specialize in?                 │
│  Help clients find you by selecting industries you know best    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [⚡ Energy]  [💻 Technology]  [💰 Finance]  [⚖️ Policy]        │
│                                                                 │
│  [🌿 Conservation]  [🌱 Agriculture]  [🚗 Transportation]       │
│                                                                 │
│  [🏭 Manufacturing]  [🏗️ Construction]  [🔬 Research]           │
│                                                                 │
│  Show all industries ↓                                          │
│                                                                 │
│                                          3 selected             │
└─────────────────────────────────────────────────────────────────┘
```

#### Career Focus (CategoryTag)

**Question:** "What types of roles do you help clients with?" (Optional)

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

// All categories available for coaches
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
  "advocacy-policy",
  "administration",
  "content",
  "education",
  "supply-chain",
];

function CoachCategorySelector({
  selected,
  onToggle,
}: {
  selected: JobCategoryType[];
  onToggle: (category: JobCategoryType) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Optional: Specify the career paths you help clients navigate
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onToggle(category)}
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

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  What types of roles do you help clients with? (Optional)       │
│  Specify the career paths you help clients navigate             │
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

#### Experience Level

**Experience Level Options:**

```
( ) New coach (< 1 year)
( ) Developing (1-3 years)
( ) Experienced (3-7 years)
( ) Expert (7+ years)
```

#### Certifications

**Certifications (suggestions):**

- ICF ACC/PCC/MCC
- CTI CPCC
- iPEC CPC
- Marshall Goldsmith
- Custom entry allowed

---

### Screen 4: Services

**Route:** `/onboarding/coach/services`

| Element       | Type            | Required | Notes                 |
| ------------- | --------------- | -------- | --------------------- |
| Service cards | Repeatable form | Yes (1+) | Add multiple services |

**Service Card Fields:**

```
┌─────────────────────────────────────────┐
│  Service 1                    [Remove]  │
├─────────────────────────────────────────┤
│  Name: [Discovery Call          ]       │
│                                         │
│  Duration:  (•) 30 min  ( ) 45 min     │
│             ( ) 60 min  ( ) 90 min     │
│                                         │
│  Price: [$] [0        ] (free)         │
│         or  [75       ] per session    │
│                                         │
│  Description:                           │
│  [Free intro call to discuss goals   ] │
│  [and see if we're a good fit        ] │
│                                         │
└─────────────────────────────────────────┘

[+ Add another service]
```

**Default Services (pre-populated):**

1. Discovery Call — 30 min, Free
2. Coaching Session — 60 min, $150

**Service Templates:**

- Discovery Call (30 min, free)
- Single Session (60 min)
- Package: 4 Sessions
- Package: 8 Sessions
- Intensive: Half Day
- Resume Review (async)

**Validation:**

- At least 1 service required
- Name: 3-50 characters
- Description: 10-500 characters
- Price: $0-$1000 per session

---

### Screen 5: Availability

**Route:** `/onboarding/coach/availability`

| Element         | Type          | Required      | Notes                  |
| --------------- | ------------- | ------------- | ---------------------- |
| Weekly schedule | Day/time grid | Yes (1+ slot) | Recurring availability |
| Timezone        | Dropdown      | Yes           | Auto-detected          |
| Buffer time     | Radio buttons | No            | Between sessions       |
| Calendar sync   | OAuth buttons | No            | Google/Outlook         |

**Weekly Schedule UI:**

```
┌─────────────────────────────────────────┐
│  When are you available for sessions?   │
├─────────────────────────────────────────┤
│                                         │
│  Monday     [9:00 AM] - [5:00 PM]  [x] │
│  Tuesday    [9:00 AM] - [5:00 PM]  [x] │
│  Wednesday  [9:00 AM] - [12:00 PM] [x] │
│  Thursday   [9:00 AM] - [5:00 PM]  [x] │
│  Friday     [9:00 AM] - [3:00 PM]  [x] │
│  Saturday   [ Off ]                     │
│  Sunday     [ Off ]                     │
│                                         │
│  Timezone: Pacific Time (PT)        ▾  │
│                                         │
└─────────────────────────────────────────┘
```

**Buffer Time Options:**

```
( ) No buffer
(•) 15 minutes between sessions
( ) 30 minutes between sessions
( ) 1 hour between sessions
```

**Calendar Sync:**

```
┌─────────────────────────────────────────┐
│  Sync your calendar (recommended)       │
│                                         │
│  Avoid double-bookings by connecting    │
│  your calendar.                         │
│                                         │
│  [Google Calendar]  [Outlook]           │
│                                         │
│  [Skip for now]                         │
└─────────────────────────────────────────┘
```

---

### Screen 6: Payout Setup (Optional)

**Route:** `/onboarding/coach/payout`

| Element       | Type           | Required | Notes    |
| ------------- | -------------- | -------- | -------- |
| Payout method | Stripe Connect | No       | Can skip |

**UI:**

```
┌─────────────────────────────────────────┐
│  How would you like to get paid?        │
├─────────────────────────────────────────┤
│                                         │
│  Connect your bank account to receive   │
│  payments from clients.                 │
│                                         │
│  [Connect with Stripe]                  │
│                                         │
│  Secure • Instant payouts available     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  [Skip for now]                         │
│  You can set this up before your first  │
│  paid session.                          │
│                                         │
└─────────────────────────────────────────┘
```

**Stripe Connect Flow:**

- Opens Stripe Connect onboarding in new tab/modal
- Returns to app on completion
- Shows "Connected ✓" state on success

---

### Screen 7: Profile Preview

**Route:** `/onboarding/coach/preview`

**Full profile preview as clients will see it:**

```
┌─────────────────────────────────────────┐
│  Preview your profile                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────┐  Sarah Chen                 │
│  │ Photo  │  "Helping climate leaders   │
│  │        │   find their next chapter"  │
│  └────────┘                             │
│             San Francisco, CA           │
│             ★★★★★ New coach             │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  About                          [Edit]  │
│  [Bio text preview...]                  │
│                                         │
│  Expertise                      [Edit]  │
│  Career Coaching • Executive Coaching   │
│                                         │
│  Industries                             │
│  [⚡ Energy] [💻 Technology] [💰 Finance]│
│                                         │
│  Career Focus                           │
│  [💻 Software Engineering] [📦 Product] │
│                                         │
│  ICF PCC Certified                      │
│                                         │
│  Services                       [Edit]  │
│  • Discovery Call — Free, 30 min        │
│  • Coaching Session — $150, 60 min      │
│                                         │
│  Availability                   [Edit]  │
│  Mon-Fri, 9am-5pm PT                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [Go back]          [Publish profile]   │
│                                         │
└─────────────────────────────────────────┘
```

**Preview displays PathwayTag and CategoryTag:**

```tsx
// In profile preview, show selected pathways and categories
<div className="space-y-2">
  <div className="flex flex-wrap gap-1">
    {selectedPathways.map((pathway) => (
      <PathwayTag key={pathway} pathway={pathway} icon={pathwayIcons[pathway]} />
    ))}
  </div>
  {selectedCategories.length > 0 && (
    <div className="flex flex-wrap gap-1">
      {selectedCategories.map((category) => (
        <CategoryTag
          key={category}
          category={category}
          icon={categoryIcons[category]}
          variant="mini"
        />
      ))}
    </div>
  )}
</div>
```

**Edit Links:**

- Each section has [Edit] link
- Opens section in slide-over or navigates back
- Returns to preview after edit

---

### Screen 8: Go Live!

**Route:** `/onboarding/coach/live` (or modal)

**Celebration moment:**

```
┌─────────────────────────────────────────┐
│                                         │
│            🎉                           │
│                                         │
│     You're live!                        │
│                                         │
│     Your profile is now visible to      │
│     job seekers looking for coaching.   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│     Share your profile                  │
│                                         │
│     [Copy link]                         │
│                                         │
│     [LinkedIn] [Twitter] [Email]        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│     [Go to dashboard]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior:**

- Confetti animation on load
- Profile URL copied to clipboard on "Copy link"
- Social share opens pre-filled share dialogs
- Auto-redirect to dashboard after 10 seconds if no interaction

---

## Post-Onboarding: Home Experience

### Dashboard Widgets

1. **Profile completion** — If any optional items missing
2. **Get your first client** — Checklist
3. **Upcoming sessions** — Empty state with tips
4. **Profile views** — Analytics teaser

### "Get Your First Client" Checklist

```
┌─────────────────────────────────────────┐
│  Get your first client                  │
│  ━━━━━━━━━━━━━━━━━━━ 60%               │
│                                         │
│  ☑ Complete profile                    │
│  ☑ Add services                        │
│  ☑ Set availability                    │
│  ☐ Share your profile                  │
│  ☐ Connect payout method               │
│  ☐ Get first booking                   │
└─────────────────────────────────────────┘
```

---

## Data Model

### Coach Profile Fields (collected in onboarding)

```typescript
import { PathwayType } from "@/components/ui/pathway-tag";
import { JobCategoryType } from "@/components/ui/category-tag";

interface CoachOnboardingData {
  // Screen 1: Profile (shared)
  firstName: string;
  lastName: string;
  linkedInUrl?: string;

  // Screen 2: About
  photoUrl: string; // Required for coaches
  tagline: string;
  bio: string;
  location: string;

  // Screen 3: Expertise (using design system types)
  coachingTypes: CoachingType[];
  industryFocus: PathwayType[]; // Climate industries coach specializes in
  careerFocus: JobCategoryType[]; // Job functions coach helps with (optional)
  experienceLevel: "new" | "developing" | "experienced" | "expert";
  certifications: string[];

  // Screen 4: Services
  services: CoachService[];

  // Screen 5: Availability
  weeklySchedule: WeeklySchedule;
  timezone: string;
  bufferMinutes: number;
  calendarConnected: boolean;

  // Screen 6: Payout
  stripeAccountId?: string;
  payoutConnected: boolean;
}

type CoachingType =
  | "career-coaching"
  | "executive-coaching"
  | "leadership-development"
  | "life-coaching"
  | "interview-prep"
  | "resume-branding"
  | "salary-negotiation"
  | "career-transitions"
  | "industry-guidance";

interface CoachService {
  id: string;
  name: string;
  duration: 30 | 45 | 60 | 90 | 120;
  price: number; // in cents, 0 for free
  description: string;
  isActive: boolean;
}

interface WeeklySchedule {
  monday: TimeSlot | null;
  tuesday: TimeSlot | null;
  wednesday: TimeSlot | null;
  thursday: TimeSlot | null;
  friday: TimeSlot | null;
  saturday: TimeSlot | null;
  sunday: TimeSlot | null;
}

interface TimeSlot {
  start: string; // "09:00"
  end: string; // "17:00"
}
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
interface CoachOnboardingProgress {
  complete: boolean;
  completedAt: string | null;
  currentStep: "about" | "expertise" | "services" | "availability" | "payout" | "preview" | null;
  isLive: boolean; // Profile published
  publishedAt: string | null;
}
```

---

## Technical Implementation

### Component Structure

```
src/app/onboarding/coach/
├── layout.tsx              # Shared layout with progress bar
├── about/
│   └── page.tsx           # Photo, tagline, bio
├── expertise/
│   ├── page.tsx           # Coaching types, pathways, categories
│   └── components/
│       ├── CoachingTypeSelector.tsx
│       ├── CoachPathwaySelector.tsx   # Uses PathwayTag
│       └── CoachCategorySelector.tsx  # Uses CategoryTag
├── services/
│   └── page.tsx           # Service cards
├── availability/
│   └── page.tsx           # Schedule, calendar sync
├── payout/
│   └── page.tsx           # Stripe Connect
├── preview/
│   └── page.tsx           # Full profile preview
├── live/
│   └── page.tsx           # Celebration + share
└── components/
    ├── PhotoUpload.tsx
    ├── ServiceCard.tsx
    ├── ServiceEditor.tsx
    ├── AvailabilityGrid.tsx
    ├── CalendarSync.tsx
    ├── ProfilePreview.tsx
    └── ShareButtons.tsx
```

### CoachPathwaySelector Component

```tsx
// src/app/onboarding/coach/expertise/components/CoachPathwaySelector.tsx
"use client";

import { PathwayTag, PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Icon imports...

interface CoachPathwaySelectorProps {
  selected: PathwayType[];
  onChange: (pathways: PathwayType[]) => void;
  max?: number;
}

// Most common pathways for coaches (shown by default)
const FEATURED_PATHWAYS: PathwayType[] = [
  "energy",
  "technology",
  "finance",
  "policy",
  "conservation",
  "agriculture",
  "transportation",
  "manufacturing",
  "construction",
  "research",
];

// All pathways (shown when expanded)
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
  "sports",
];

export function CoachPathwaySelector({ selected, onChange, max = 5 }: CoachPathwaySelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const pathways = showAll ? ALL_PATHWAYS : FEATURED_PATHWAYS;

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
        <span className="text-muted-foreground">
          Help clients find you by selecting industries you know best
        </span>
        <span className="font-medium">
          {selected.length}/{max} selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {pathways.map((pathway) => (
          <PathwayTag
            key={pathway}
            pathway={pathway}
            icon={pathwayIcons[pathway]}
            selected={selected.includes(pathway)}
            onClick={() => handleToggle(pathway)}
          />
        ))}
      </div>
      {!showAll && (
        <button onClick={() => setShowAll(true)} className="text-sm text-primary underline">
          Show all {ALL_PATHWAYS.length} industries
        </button>
      )}
    </div>
  );
}
```

### API Endpoints

```
POST /api/onboarding/coach/about
POST /api/onboarding/coach/expertise
  Body: {
    coachingTypes: CoachingType[],
    industryFocus: PathwayType[],
    careerFocus: JobCategoryType[],
    experienceLevel: string,
    certifications: string[]
  }
POST /api/onboarding/coach/services
POST /api/onboarding/coach/availability
POST /api/onboarding/coach/payout/connect    # Stripe Connect
GET  /api/onboarding/coach/preview           # Full profile data
POST /api/onboarding/coach/publish           # Go live
POST /api/onboarding/coach/complete
```

### Third-Party Integrations

- **Image upload:** Cloudinary or similar
- **Calendar sync:** Google Calendar API, Microsoft Graph
- **Payments:** Stripe Connect

---

## Special Considerations

### Photo Requirements

- Coaches MUST have a photo (unlike talent)
- Enforce minimum quality (200x200px)
- Provide cropping tool
- Show tips for good photos

### Service Pricing

- Allow $0 for discovery calls
- Show platform fee disclosure
- "You receive $X after fees"

### Calendar Integration

- OAuth flow for Google/Microsoft
- Handle token refresh
- Sync availability, not events (privacy)
- Show "busy" times from calendar

### Stripe Connect

- Use Stripe Connect Express
- Handle incomplete onboarding state
- Prompt before first paid session if not connected

### Matching Algorithm

The `industryFocus` (PathwayType[]) and `careerFocus` (JobCategoryType[]) fields enable matching:

- Coaches with `energy` pathway show to talent interested in energy
- Coaches with `software-engineering` category show to software engineers
- Multiple overlaps increase match score

---

## Error Handling

| Scenario                  | Handling                                 |
| ------------------------- | ---------------------------------------- |
| Photo upload fails        | Retry with error message, allow continue |
| Calendar sync fails       | Show error, allow skip                   |
| Stripe Connect incomplete | Mark as incomplete, prompt later         |
| Preview load fails        | Show cached data with "refresh" option   |

---

## Analytics Events

| Event                       | Properties                                              |
| --------------------------- | ------------------------------------------------------- |
| `coach_onboarding_started`  |                                                         |
| `coach_step_completed`      | `step, duration_seconds`                                |
| `coach_photo_uploaded`      | `size_kb, dimensions`                                   |
| `coach_pathways_selected`   | `pathways: PathwayType[], count: number`                |
| `coach_categories_selected` | `categories: JobCategoryType[], count: number`          |
| `coach_service_added`       | `service_type, price, duration`                         |
| `coach_calendar_connected`  | `provider: 'google' \| 'outlook'`                       |
| `coach_stripe_connected`    |                                                         |
| `coach_profile_published`   | `total_duration_seconds`                                |
| `coach_profile_shared`      | `channel: 'copy' \| 'linkedin' \| 'twitter' \| 'email'` |

---

## Accessibility Requirements

- Photo upload has keyboard navigation
- PathwayTag and CategoryTag selections announced by screen readers
- Service cards are focusable and editable via keyboard
- Time picker accessible with arrow keys
- Preview screen readable by screen readers
- All required fields clearly marked
- Error messages linked to fields

---

## Mobile Considerations

- Photo capture from camera on mobile
- Tags wrap naturally on narrow screens
- Full-screen service editor
- Time picker optimized for touch
- Sticky "Continue" button
- Preview scrollable with fixed footer
