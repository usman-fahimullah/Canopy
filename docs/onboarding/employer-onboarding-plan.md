# Employer Onboarding Implementation Plan

_Role-based onboarding: Admin setup vs. Invited team members_

---

## Overview

### Philosophy

Employer onboarding has **three distinct flows** based on how the user joins:

1. **Admin (Founder)** — Full company setup, creates the organization
2. **Recruiter (Invited)** — Joins existing company, immediate access to roles
3. **Hiring Team (Invited)** — Joins for specific role(s), scoped candidate access

The Admin flow is comprehensive; invited flows are streamlined.

### Key Metrics

| Metric                    | Target                         |
| ------------------------- | ------------------------------ |
| Admin time to complete    | 2-5 minutes                    |
| Invited user time         | 30-60 seconds                  |
| First role posted (Admin) | > 50% in first session         |
| Team invite rate          | > 30% invite at least 1 person |

---

## Design System Components

This onboarding uses two tag components from the Trails Design System:

### PathwayTag — Company Industry

```typescript
import { PathwayTag, PathwayType } from "@/components/ui/pathway-tag";
```

Used for company industry selection during Admin onboarding.

**20 pathway types** organized by color family:
| Family | Types |
|--------|-------|
| 🟢 Green | `agriculture`, `finance`, `forestry`, `transportation`, `waste-management` |
| 🔵 Blue | `conservation`, `research`, `sports`, `water` |
| 🟠 Orange | `construction`, `manufacturing`, `real-estate`, `urban-planning` |
| 🔴 Red | `education`, `medical`, `tourism` |
| 🟡 Yellow | `energy`, `technology` |
| 🟣 Purple | `arts-culture`, `media`, `policy` |

### CategoryTag — Role Categories

```typescript
import { CategoryTag, JobCategoryType } from "@/components/ui/category-tag";
```

Used when creating roles to categorize the job function.

**15 category types:**

```
software-engineering | supply-chain | administration | advocacy-policy
climate-sustainability | investment | sales | content
marketing-design | product | data | education
finance-compliance | operations | science
```

---

## User Flows Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EMPLOYER ONBOARDING                                │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │  How did    │
                              │  user join? │
                              └──────┬──────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
    ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
    │   ADMIN     │          │  RECRUITER  │          │ HIRING TEAM │
    │  (Signup)   │          │  (Invited)  │          │  (Invited)  │
    └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
           │                         │                         │
           ▼                         ▼                         ▼
    Full company            Accept invite +           Accept invite +
    setup + optional        set password +            set password +
    first role              basic profile             basic profile
           │                         │                         │
           ▼                         ▼                         ▼
        [HOME]                    [HOME]                [CANDIDATES]
    Full dashboard            See all roles           Scoped to assigned
    + setup checklist         + candidates            role(s) only
```

---

## Flow A: Admin (Company Setup)

### Flow Diagram

```
[Sign Up] → [Verify] → [Profile] → [Company] → [Size] → [Industry] → [Hiring Goals]
                                                                           │
                                                                           ▼
                                                              ┌─────────────────────┐
                                                              │ Post first role?    │
                                                              │ [Yes] [Skip]        │
                                                              └──────────┬──────────┘
                                                                         │
                                            ┌────────────────────────────┼──────────┐
                                            │ Yes                        │ Skip     │
                                            ▼                            │          │
                                   ┌─────────────────┐                   │          │
                                   │ Quick Role Setup│                   │          │
                                   │ Title, Dept,    │                   │          │
                                   │ Location, Type  │                   │          │
                                   └────────┬────────┘                   │          │
                                            │                            │          │
                                            ▼                            ▼          │
                                   ┌─────────────────┐          ┌──────────────┐    │
                                   │ Invite Team?    │◄─────────│ Invite Team? │    │
                                   │ [Add] [Skip]    │          │ [Add] [Skip] │    │
                                   └────────┬────────┘          └──────┬───────┘    │
                                            │                          │            │
                                            └────────────┬─────────────┘            │
                                                         │                          │
                                                         ▼                          │
                                                 ┌──────────────┐                   │
                                                 │  "You're all │◄──────────────────┘
                                                 │   set!"      │
                                                 └──────┬───────┘
                                                        │
                                                        ▼
                                                     [HOME]
```

---

### Screen 1: Profile (Shared Base)

**Route:** `/onboarding/profile`

| Element      | Type       | Required | Notes                     |
| ------------ | ---------- | -------- | ------------------------- |
| First name   | Text input | Yes      |                           |
| Last name    | Text input | Yes      |                           |
| Job title    | Text input | Yes      | Their role at the company |
| LinkedIn URL | Text input | No       |                           |

**Note:** This is the person setting up the account, not the company info.

---

### Screen 2: Company Info

**Route:** `/onboarding/employer/company`

| Element             | Type         | Required | Notes                          |
| ------------------- | ------------ | -------- | ------------------------------ |
| Company name        | Text input   | Yes      | With autocomplete for existing |
| Company logo        | Image upload | No       | Encouraged                     |
| Website             | URL input    | No       |                                |
| Company description | Textarea     | No       | Brief tagline                  |

**Company Name Autocomplete:**

```
┌─────────────────────────────────────────┐
│  Company name                           │
│  [Tesla, Inc.                        ]  │
│  ├─ Tesla, Inc. — Palo Alto, CA        │
│  ├─ Tesla Energy — Austin, TX          │
│  └─ + Create "Tesla, Inc."             │
└─────────────────────────────────────────┘
```

**Behavior:**

- Search existing companies in database
- If selected, pre-fill other fields
- If new, create company record
- "Create new" option always available

**Logo Upload:**

```
┌───────────────────┐
│  ┌─────────┐      │
│  │  [+]    │ Add your company logo
│  │  Logo   │ Recommended: 400x400px
│  └─────────┘      │
└───────────────────┘
```

---

### Screen 3: Company Size

**Route:** `/onboarding/employer/company` (same page, step 2)

| Element      | Type                | Required | Notes |
| ------------ | ------------------- | -------- | ----- |
| Company size | Single select cards | Yes      |       |

**Options:**

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   1-10      │ │   11-50     │ │   51-200    │
│  Startup    │ │ Growing     │ │ Scale-up    │
└─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐
│  201-500    │ │   500+      │
│ Mid-size    │ │ Enterprise  │
└─────────────┘ └─────────────┘
```

**UI Notes:**

- Cards with subtle icons
- Single selection
- Selection triggers subtle animation

---

### Screen 4: Industry (PathwayTag)

**Route:** `/onboarding/employer/company` (same page, step 3)

This screen uses **PathwayTag** for industry selection.

| Element  | Type                    | Required  | Notes              |
| -------- | ----------------------- | --------- | ------------------ |
| Industry | Multi-select PathwayTag | Yes (1-3) | Uses design system |

**Question:** "What industry is your company in?"

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

// Primary pathways for employers (most common)
const EMPLOYER_PATHWAYS: PathwayType[] = [
  "energy",
  "technology",
  "transportation",
  "agriculture",
  "conservation",
  "manufacturing",
  "construction",
  "finance",
  "policy",
  "research",
  "water",
  "waste-management",
];

function IndustrySelector({
  selected,
  onToggle,
}: {
  selected: PathwayType[];
  onToggle: (pathway: PathwayType) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Help talent find you by selecting your company's focus areas
      </p>
      <div className="flex flex-wrap gap-2">
        {EMPLOYER_PATHWAYS.map((pathway) => (
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
│  What industry is your company in?                              │
│  Select 1-3 industries                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [⚡ Energy]  [💻 Technology]  [🚗 Transportation]              │
│                                                                 │
│  [🌱 Agriculture]  [🌿 Conservation]  [🏭 Manufacturing]        │
│                                                                 │
│  [🏗️ Construction]  [💰 Finance]  [⚖️ Policy]                   │
│                                                                 │
│  [🔬 Research]  [💧 Water]  [♻️ Waste Management]               │
│                                                                 │
│  Show all industries ↓                                          │
│                                                                 │
│                                          2 selected             │
└─────────────────────────────────────────────────────────────────┘
```

**Validation:**

- Select 1-3 industries
- "Show all" expands to full 20 pathways

---

### Screen 5: Hiring Goals

**Route:** `/onboarding/employer/your-role`

| Element     | Type                | Required | Notes             |
| ----------- | ------------------- | -------- | ----------------- |
| Hiring goal | Single select cards | Yes      | Sets expectations |

**Options:**

```
┌───────────────────────────────────────────────┐
│  What brings you here?                        │
├───────────────────────────────────────────────┤
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ 🎯 Hiring for a specific role           │  │
│  │    I have a position to fill now        │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ 📋 Hiring multiple roles                │  │
│  │    Building out the team                │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ 🔍 Exploring the talent pool            │  │
│  │    Not hiring yet, just looking         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

**Behavior:**

- "Specific role" → Encourage first role creation
- "Multiple roles" → Encourage first role creation
- "Exploring" → Skip role creation, go to invite

---

### Screen 6: Post First Role (Optional)

**Route:** `/onboarding/employer/first-role`

**Prompt:**

```
┌───────────────────────────────────────────────┐
│                                               │
│  Post your first role?                        │
│                                               │
│  Get in front of climate talent right away.   │
│  You can always edit or save as draft.        │
│                                               │
│  [Yes, let's go]        [Skip for now]        │
│                                               │
└───────────────────────────────────────────────┘
```

**If "Yes" — Quick Role Setup (with CategoryTag):**

This screen uses **CategoryTag** for role category selection.

```
┌───────────────────────────────────────────────┐
│  Quick role setup                             │
├───────────────────────────────────────────────┤
│                                               │
│  Job title *                                  │
│  [Senior Software Engineer            ]       │
│                                               │
│  Role category *                              │
│  [💻 Software Engineering] [📊 Data] [📦 Product]│
│  [🎨 Marketing] [⚙️ Operations] [🔬 Science]   │
│  [more...]                                    │
│                                               │
│  Location *                                   │
│  [San Francisco, CA                   ]       │
│                                               │
│  Work type *                                  │
│  (•) On-site  ( ) Hybrid  ( ) Remote         │
│                                               │
│  Employment type                              │
│  [Full-time                           ] ▾     │
│                                               │
├───────────────────────────────────────────────┤
│  [Save as draft]              [Publish role]  │
└───────────────────────────────────────────────┘
```

**Role Category Component:**

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

// Common role categories for quick role setup
const COMMON_CATEGORIES: JobCategoryType[] = [
  "software-engineering",
  "data",
  "product",
  "marketing-design",
  "operations",
  "science",
  "climate-sustainability",
  "finance-compliance",
];

function RoleCategorySelector({
  selected,
  onSelect,
}: {
  selected: JobCategoryType | null;
  onSelect: (category: JobCategoryType) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {COMMON_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              "rounded-lg transition-all",
              selected === category && "ring-2 ring-[var(--primitive-green-500)] ring-offset-2"
            )}
          >
            <CategoryTag category={category} icon={categoryIcons[category]} />
          </button>
        ))}
      </div>
      <button className="text-sm text-primary underline">Show all categories</button>
    </div>
  );
}
```

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Job title | Text input | Yes |
| Role category | Single-select CategoryTag | Yes |
| Location | Location autocomplete | Yes |
| Work type | Radio buttons | Yes |
| Employment type | Dropdown | No |

**Note:** This is intentionally minimal. Full role details can be added later.

---

### Screen 7: Invite Team (Optional)

**Route:** `/onboarding/employer/invite`

```
┌───────────────────────────────────────────────┐
│  Invite your team                             │
│                                               │
│  Collaborate on hiring with your colleagues.  │
├───────────────────────────────────────────────┤
│                                               │
│  ┌───────────────────────────────────────┐    │
│  │ Email                    Role         │    │
│  │ [jane@company.com    ] [Recruiter ▾]  │    │
│  └───────────────────────────────────────┘    │
│                                               │
│  [+ Add another person]                       │
│                                               │
│  Role descriptions:                           │
│  • Recruiter — Create roles, manage pipeline  │
│  • Hiring Team — Review assigned candidates   │
│                                               │
├───────────────────────────────────────────────┤
│  [Skip for now]              [Send invites]   │
└───────────────────────────────────────────────┘
```

**Role Options:**
| Role | Description | Access |
|------|-------------|--------|
| Recruiter | Full hiring access | Roles, all candidates, analytics |
| Hiring Team | Review candidates | Assigned roles only |

**Behavior:**

- Validate email format
- Allow multiple invites
- Send invite emails immediately on submit
- Can skip entirely

---

### Screen 8: Welcome

**Route:** `/onboarding/employer/welcome` (or redirect to HOME)

```
┌───────────────────────────────────────────────┐
│                                               │
│              ✓ You're all set!                │
│                                               │
│  Your company profile is ready.               │
│  [Role posted / No roles yet]                 │
│  [X invites sent / No invites yet]            │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ [View your role]                        │  │
│  │ [Invite team]                           │  │
│  │ [Explore dashboard]                     │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Flow B: Recruiter (Invited)

### Flow Diagram

```
[Email Invite] → [Accept + Set Password] → [Profile] → [HOME]
      │                    │                   │           │
      ▼                    ▼                   ▼           ▼
"You've been         Create account      Name + title   Full access
invited to join      (email pre-filled)                to roles +
[Company]"                                             candidates
```

---

### Email Invite

**Subject:** "You've been invited to join [Company] on Canopy"

```
┌───────────────────────────────────────────────┐
│                                               │
│  [Company Logo]                               │
│                                               │
│  Sarah Chen invited you to join Tesla's       │
│  hiring team on Canopy.                       │
│                                               │
│  As a Recruiter, you'll be able to:           │
│  • Create and manage job postings             │
│  • Review and message candidates              │
│  • Collaborate with your team                 │
│                                               │
│           [Accept invitation]                 │
│                                               │
│  This invitation expires in 7 days.           │
│                                               │
└───────────────────────────────────────────────┘
```

---

### Screen 1: Accept + Set Password

**Route:** `/invite/accept?token=xxx`

```
┌───────────────────────────────────────────────┐
│                                               │
│  Join [Company] on Canopy                     │
│                                               │
│  Email                                        │
│  [jane@tesla.com                    ] (locked)│
│                                               │
│  Create password                              │
│  [••••••••••••••••                  ]         │
│                                               │
│  Confirm password                             │
│  [••••••••••••••••                  ]         │
│                                               │
│  ☐ I agree to the Terms of Service            │
│                                               │
│              [Create account]                 │
│                                               │
│  ─────────── or ───────────                   │
│                                               │
│  [Continue with Google]                       │
│                                               │
└───────────────────────────────────────────────┘
```

**Notes:**

- Email is pre-filled and locked
- OAuth option available (must match invite email)
- Token validates invite is still valid

---

### Screen 2: Profile (Minimal)

**Route:** `/onboarding/profile`

| Element    | Type       | Required |
| ---------- | ---------- | -------- |
| First name | Text input | Yes      |
| Last name  | Text input | Yes      |
| Job title  | Text input | Yes      |

**Note:** No company setup — they're joining an existing company.

---

### Screen 3: Welcome → HOME

**Route:** Redirect to `/employer/dashboard`

**First-time experience:**

- Brief tour tooltip: "Here are your open roles"
- Highlight key actions: "Review candidates", "Create role"
- No checklist (company already set up)

---

## Flow C: Hiring Team (Invited)

### Flow Diagram

```
[Email Invite] → [Accept + Set Password] → [Profile] → [CANDIDATES]
      │                    │                   │            │
      ▼                    ▼                   ▼            ▼
"You've been         Create account      Name only    Scoped to
invited to help      (email pre-filled)              assigned role(s)
hire [Role]"
```

---

### Email Invite

**Subject:** "Help hire: [Role Title] at [Company]"

```
┌───────────────────────────────────────────────┐
│                                               │
│  [Company Logo]                               │
│                                               │
│  Sarah Chen invited you to help hire          │
│  Senior Software Engineer at Tesla.           │
│                                               │
│  As part of the hiring team, you'll:          │
│  • Review candidate profiles                  │
│  • Leave feedback and ratings                 │
│  • Help select the best candidates            │
│                                               │
│           [Accept invitation]                 │
│                                               │
│  This invitation expires in 7 days.           │
│                                               │
└───────────────────────────────────────────────┘
```

---

### Screen 1: Accept + Set Password

**Route:** `/invite/accept?token=xxx`

Same as Recruiter flow.

---

### Screen 2: Profile (Minimal)

**Route:** `/onboarding/profile`

| Element    | Type       | Required |
| ---------- | ---------- | -------- |
| First name | Text input | Yes      |
| Last name  | Text input | Yes      |

**Note:** Even more minimal — no job title needed for hiring team.

---

### Screen 3: Welcome → CANDIDATES

**Route:** Redirect to `/employer/candidates?role=xxx`

**First-time experience:**

- Land directly on candidate list for assigned role
- Brief tour: "Here are the candidates for [Role]"
- Highlight: "Click to review", "Leave feedback"
- Scoped navigation — can only see assigned role(s)

---

## Post-Onboarding: Home Experience

### Admin Home Checklist

```
┌───────────────────────────────────────────────┐
│  Get your first hire                          │
│  ━━━━━━━━━━━━━━━━━━━ 40%                      │
│                                               │
│  ☑ Company profile complete                  │
│  ☐ Post a role — "Start attracting candidates"│
│  ☐ Invite team — "Collaborate on hiring"      │
│  ☐ Review first candidate                     │
│  ☐ Make first hire                            │
└───────────────────────────────────────────────┘
```

### Navigation by Role

| Nav Item   | Admin | Recruiter | Hiring Team |
| ---------- | ----- | --------- | ----------- |
| Home       | ✓     | ✓         | ✓ (scoped)  |
| Roles      | ✓     | ✓         | —           |
| Candidates | ✓     | ✓         | ✓ (scoped)  |
| Team       | ✓     | —         | —           |
| Analytics  | ✓     | ✓         | —           |

---

## Data Model

### Employer User Fields

```typescript
import { PathwayType } from "@/components/ui/pathway-tag";
import { JobCategoryType } from "@/components/ui/category-tag";

interface EmployerOnboardingData {
  // Profile (all flows)
  firstName: string;
  lastName: string;
  jobTitle?: string; // Not required for Hiring Team

  // Company (Admin only)
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
    website?: string;
    description?: string;
    size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
    industries: PathwayType[]; // Uses design system PathwayType
  };

  // Role context
  employerRole: "admin" | "recruiter" | "hiring_team";
  companyId: string;
  assignedRoleIds?: string[]; // For Hiring Team
}

// Quick Role data (used in first-role step)
interface QuickRoleData {
  title: string;
  category: JobCategoryType; // Uses design system CategoryTag
  location: string;
  workType: "onsite" | "hybrid" | "remote";
  employmentType?: "full-time" | "part-time" | "contract" | "internship";
}
```

### Invite Record

```typescript
interface TeamInvite {
  id: string;
  email: string;
  role: "recruiter" | "hiring_team";
  companyId: string;
  assignedRoleIds?: string[]; // For hiring_team
  invitedBy: string; // User ID
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  status: "pending" | "accepted" | "expired" | "revoked";
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
interface EmployerOnboardingProgress {
  complete: boolean;
  completedAt: string | null;
  currentStep: "company" | "your-role" | "first-role" | "invite" | null;

  // Admin-specific
  firstRolePosted: boolean;
  teamInvitesSent: number;

  // Flow type
  flowType: "admin" | "recruiter" | "hiring_team";
}
```

---

## Technical Implementation

### Component Structure

```
src/app/onboarding/employer/
├── layout.tsx              # Shared layout with progress bar
├── company/
│   ├── page.tsx           # Company name, logo, size, industry
│   └── components/
│       ├── CompanySearch.tsx
│       ├── LogoUpload.tsx
│       ├── CompanySizeSelector.tsx
│       └── IndustrySelector.tsx    # Uses PathwayTag
├── your-role/
│   └── page.tsx           # Hiring goals
├── first-role/
│   ├── page.tsx           # Quick role setup (optional)
│   └── components/
│       ├── QuickRoleForm.tsx
│       └── RoleCategorySelector.tsx  # Uses CategoryTag
├── invite/
│   └── page.tsx           # Team invites (optional)
├── welcome/
│   └── page.tsx           # Success screen
└── components/
    ├── HiringGoalCards.tsx
    └── TeamInviteForm.tsx

src/app/invite/
├── accept/
│   └── page.tsx           # Accept invite + set password
└── components/
    └── InviteAcceptForm.tsx
```

### IndustrySelector Component

```tsx
// src/app/onboarding/employer/company/components/IndustrySelector.tsx
"use client";

import { PathwayTag, PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Icon imports...

interface IndustrySelectorProps {
  selected: PathwayType[];
  onChange: (pathways: PathwayType[]) => void;
  max?: number;
}

// Primary pathways for employers
const FEATURED_PATHWAYS: PathwayType[] = [
  "energy",
  "technology",
  "transportation",
  "agriculture",
  "conservation",
  "manufacturing",
  "construction",
  "finance",
  "policy",
  "research",
  "water",
  "waste-management",
];

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

export function IndustrySelector({ selected, onChange, max = 3 }: IndustrySelectorProps) {
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
        <span className="text-muted-foreground">Select 1-{max} industries</span>
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

### RoleCategorySelector Component

```tsx
// src/app/onboarding/employer/first-role/components/RoleCategorySelector.tsx
"use client";

import { CategoryTag, JobCategoryType, jobCategoryLabels } from "@/components/ui/category-tag";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Icon imports...

interface RoleCategorySelectorProps {
  selected: JobCategoryType | null;
  onChange: (category: JobCategoryType) => void;
}

const COMMON_CATEGORIES: JobCategoryType[] = [
  "software-engineering",
  "data",
  "product",
  "marketing-design",
  "operations",
  "science",
  "climate-sustainability",
  "finance-compliance",
];

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

export function RoleCategorySelector({ selected, onChange }: RoleCategorySelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const categories = showAll ? ALL_CATEGORIES : COMMON_CATEGORIES;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "rounded-lg transition-all",
              selected === category && "ring-2 ring-[var(--primitive-green-500)] ring-offset-2"
            )}
          >
            <CategoryTag category={category} icon={categoryIcons[category]} />
          </button>
        ))}
      </div>
      {!showAll && (
        <button onClick={() => setShowAll(true)} className="text-sm text-primary underline">
          Show all categories
        </button>
      )}
    </div>
  );
}
```

### API Endpoints

```
# Admin onboarding
POST /api/onboarding/employer/company
  Body: {
    name: string,
    logoUrl?: string,
    website?: string,
    description?: string,
    size: '1-10' | '11-50' | '51-200' | '201-500' | '500+',
    industries: PathwayType[]  # Design system types
  }
POST /api/onboarding/employer/goals
POST /api/onboarding/employer/first-role
  Body: {
    title: string,
    category: JobCategoryType,  # Design system type
    location: string,
    workType: 'onsite' | 'hybrid' | 'remote',
    employmentType?: string
  }
POST /api/onboarding/employer/invite
POST /api/onboarding/employer/complete

# Invite flow
GET  /api/invite/:token           # Validate invite
POST /api/invite/:token/accept    # Accept + create account

# Team management
GET  /api/employer/team
POST /api/employer/team/invite
DELETE /api/employer/team/invite/:id
PUT  /api/employer/team/:userId/role
```

---

## Invite System Details

### Invite Token

- Cryptographically secure random token
- Expires after 7 days
- Single use
- Encodes: email, role, company, assigned roles

### Email Delivery

- Use transactional email service (SendGrid, Postmark)
- Track delivery status
- Resend capability for admins
- Expiration reminder at day 5

### Security

- Validate token on every step
- Rate limit invite creation
- Rate limit accept attempts
- Log all invite events

---

## Error Handling

| Scenario            | Handling                                          |
| ------------------- | ------------------------------------------------- |
| Invite expired      | Show "expired" message with contact admin option  |
| Invite already used | Show "already accepted" with login link           |
| Company name taken  | Show existing company, offer to request access    |
| Logo upload fails   | Allow continue without logo                       |
| Email send fails    | Retry 3x, then show error with manual copy option |

---

## Analytics Events

| Event                           | Properties                                                        |
| ------------------------------- | ----------------------------------------------------------------- |
| `employer_onboarding_started`   | `flow_type`                                                       |
| `employer_company_created`      | `company_size, industries: PathwayType[], industry_count: number` |
| `employer_industries_selected`  | `industries: PathwayType[], count: number`                        |
| `employer_first_role_created`   | `category: JobCategoryType, work_type, location`                  |
| `employer_first_role_skipped`   |                                                                   |
| `employer_team_invite_sent`     | `invite_count, roles`                                             |
| `employer_team_invite_skipped`  |                                                                   |
| `employer_onboarding_completed` | `flow_type, duration_seconds`                                     |
| `employer_invite_accepted`      | `role, days_to_accept`                                            |
| `employer_invite_expired`       | `role`                                                            |

---

## Re-engagement Emails

| Trigger                    | Email                     | Timing   |
| -------------------------- | ------------------------- | -------- |
| Signed up, no role         | "Post your first role"    | 24 hours |
| Role posted, no candidates | "Boost visibility"        | 3 days   |
| Candidates waiting         | "X candidates waiting"    | 48 hours |
| No team invited            | "Invite your team"        | 7 days   |
| Invite not accepted        | Reminder to invitee       | 3 days   |
| Invite expiring            | "Invite expires tomorrow" | 6 days   |

---

## Accessibility Requirements

- Company search has ARIA live region for results
- PathwayTag industry selection announced by screen readers
- CategoryTag role category selection has proper focus states
- Role selection cards are keyboard navigable
- Invite form allows tab between rows
- All required fields clearly marked
- Error messages linked to fields
- Use `role="button"` and `tabIndex={0}` on clickable tags (PathwayTag has this built-in)

---

## Mobile Considerations

- Company search optimized for mobile keyboard
- Logo upload from camera roll
- Invite form single-column on mobile
- Sticky action buttons
- Invite email mobile-optimized
