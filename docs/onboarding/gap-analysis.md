# Onboarding Gap Analysis

_Comparing existing UI to implementation plans_

---

## Overview

This document analyzes your existing onboarding screens (from screenshots) against the implementation plans and provides specific recommendations for adapting each screen.

**Legend:**
- ✅ **Keep** — Matches the spec, no changes needed
- 🔄 **Modify** — Exists but needs adjustment
- ➕ **Add** — Missing from current UI
- 📍 **Make Optional** — Keep but don't require
- ❌ **Move** — Relocate to profile settings

---

## Philosophy: Optional vs. Removed

We're not removing fields—we're making them **optional** so users can choose their own experience:

| User Type | Behavior | Our Approach |
|-----------|----------|--------------|
| Completionist | Wants to fill everything | Optional fields available upfront |
| Speed-focused | Wants to get to value fast | Only required fields block progress |
| Privacy-conscious | Shares minimum needed | Clear labels on what's optional |

**Principle:** Respect user autonomy. Show fields, don't hide them. Just don't require them.

---

## Talent (Job Seeker) Onboarding

### Current vs. Planned Flow

| Current Screen | Planned Screen | Status |
|----------------|----------------|--------|
| Profile setup (photo, pronouns, ethnicity, phone, location) | Profile (name + optional details) | 🔄 Restructure |
| Career journey (stage, ethnicity, goals, types) | Background (stage, experience) + Preferences (types) | 🔄 Split |
| — | Skills (PathwayTag + CategoryTag) | ➕ Add new screen |

---

### Screen-by-Screen Adaptations

#### Screen 1: Profile Setup

**Current UI shows:**
- Profile photo upload
- Pronouns (optional)
- Ethnicity (multi-select)
- Phone number
- Location

**Plan specifies:**
- First name, Last name (required)
- LinkedIn URL (optional)
- Bio (optional)

**Recommendation:**

```
🔄 MODIFY this screen:

Required:
- First name, Last name

Optional (keep visible, don't require):
- Profile photo — some users want to add upfront
- Pronouns — quick to add, signals inclusivity
- Phone number — some prefer providing it early
- LinkedIn URL — add this field

Move to Profile Settings:
- Ethnicity — sensitive demographic data, not for job matching

Move to Preferences screen:
- Location — needed for job matching, fits better there
```

**New Layout:**

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

**Key Changes:**
- Clear visual separation between required and optional
- "Add more details (optional)" header sets expectations
- Photo shown but not blocking
- Ethnicity moved to profile settings (not onboarding)

---

#### Screen 2: Background (NEW structure)

**Current UI shows (in "Career Journey"):**
- Career stage (chips)
- Ethnicity
- Goals text
- Job type preferences

**Plan specifies:**
- Career stage (single select chips)
- Years of experience (single select)
- Current/most recent role (optional text)

**Recommendation:**

```
🔄 MODIFY by splitting career journey screen:

Required:
- Career stage chips (already have this!)
- Years of experience selector

Optional:
- Current role text input
- Goals text — keep it! Users who want to share their "why" can
- Work experience — let users build their profile if they want

Move to Preferences screen:
- Job type preferences (full-time, part-time, etc.)

Move to Profile Settings:
- Ethnicity — sensitive demographic data, voluntary self-identification
```

**New Layout:**

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
│  [Senior Product Manager at _______]                    │
│                                                         │
│  What are you looking for?                              │
│  [Share your goals or what excites you____]             │
│                                                         │
│  Work experience                                        │
│  [+ Add work experience]                                │
│                                                         │
│                                        [Continue →]     │
└─────────────────────────────────────────────────────────┘
```

**Why include optional profile building:**
- Users who are passionate about climate want to express their "why"
- Work experience helps with employer visibility and matching
- Completionists appreciate building their profile early
- Speed-focused users can skip and add later

---

#### Screen 3: Skills & Sectors (NEW)

**Current UI:** Does not exist

**Plan specifies:**
- PathwayTag multi-select for climate industries (max 5)
- CategoryTag multi-select for job functions (max 3)

**Recommendation:**

```
➕ ADD this entire screen using design system components:

This is the key differentiation for your platform.
Use PathwayTag and CategoryTag components directly.
```

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Skills & sectors                                       │
│  What climate sectors interest you?                     │
│                                                         │
│  What climate industries interest you? *                │
│  Select up to 5                                         │
│                                                         │
│  [⚡ Energy]  [💻 Technology]  [🚗 Transportation]      │
│  [🌱 Agriculture]  [🌿 Conservation]  [💧 Water]        │
│  [🌲 Forestry]  [🏭 Manufacturing]  [🏗️ Construction]   │
│  [🏢 Real Estate]  [🏙️ Urban Planning]  [💰 Finance]    │
│  [⚖️ Policy]  [🔬 Research]  [🎓 Education]             │
│  [♻️ Waste Mgmt]  [🎨 Arts & Culture]  [📺 Media]       │
│  [🏥 Medical]  [✈️ Tourism]  [🏈 Sports]                │
│                                                         │
│                                          3 selected     │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  What type of work do you do? *                         │
│  Select up to 3                                         │
│                                                         │
│  [💻 Software Engineering]  [📊 Data]  [📦 Product]     │
│  [🎨 Marketing & Design]  [🌱 Climate & Sustainability] │
│  [⚙️ Operations]  [⚖️ Finance, Legal, & Compliance]     │
│  [🤝 Sales]  [📈 Investment]  [🔬 Science]              │
│  [📢 Advocacy & Policy]  [👥 Administration]            │
│  [✏️ Content]  [🎓 Education]  [📦 Supply Chain]        │
│                                                         │
│                                          2 selected     │
│                                                         │
│                                    [Continue →]         │
└─────────────────────────────────────────────────────────┘
```

**Component Code:**

```tsx
// Use existing design system components
import { PathwayTag, PathwayType } from "@/components/ui/pathway-tag";
import { CategoryTag, JobCategoryType } from "@/components/ui/category-tag";

// PathwayTag has built-in selected prop
<PathwayTag
  pathway="energy"
  icon={<Lightning />}
  selected={selectedPathways.includes("energy")}
  onClick={() => togglePathway("energy")}
/>

// CategoryTag needs wrapper for selection state
<button
  className={cn(
    "rounded-lg transition-all",
    selectedCategories.includes("software-engineering") &&
      "ring-2 ring-[var(--primitive-green-500)] ring-offset-2"
  )}
>
  <CategoryTag category="software-engineering" icon={<Code />} />
</button>
```

---

#### Screen 4: Preferences

**Current UI shows (partial, in career journey):**
- Job type preferences (full-time, part-time, etc.)

**Plan specifies:**
- Location (multi-select with autocomplete)
- Remote preference (single select)
- Job type (multi-select chips)
- Salary expectation (optional range slider)

**Recommendation:**

```
🔄 MODIFY by combining elements:

Move from Profile screen:
- Location (but enhance to multi-select)

Move from Career Journey:
- Job type preferences

Add:
- Remote preference selector
- Salary range slider (optional)
```

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  What you're looking for                                │
│  Help us match you with the right opportunities         │
│                                                         │
│  Where do you want to work? *                           │
│  [San Francisco, CA ×] [New York, NY ×] [+ Add]         │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Remote preference *                                    │
│                                                         │
│  ( ) On-site only                                       │
│  ( ) Hybrid preferred                                   │
│  (•) Remote preferred                                   │
│  ( ) Remote only                                        │
│  ( ) Open to all                                        │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  What type of work? *                                   │
│                                                         │
│  [Full-time ✓]  [Part-time]  [Contract]                 │
│  [Internship]  [Freelance]                              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Salary expectation                                     │
│  [$80k ────●────●──── $150k+]                           │
│  [Skip this question]                                   │
│                                                         │
│                                    [Find my matches →]  │
└─────────────────────────────────────────────────────────┘
```

---

## Employer Onboarding

### Current vs. Planned Flow

| Current Screen | Planned Screen | Status |
|----------------|----------------|--------|
| Company workspace (name, logo, desc, website, location, pathway) | Company Info (name, logo, website, desc) | ✅ Close match |
| — | Company Size | ➕ Add |
| Pathway dropdown | Industry (PathwayTag multi-select) | 🔄 Replace dropdown |
| — | Hiring Goals | ➕ Add |
| Your role (title, phone, LinkedIn, photo) | Profile (name, title) | 🔄 Simplify |
| Team invites | Team invites | ✅ Keep |
| — | Post First Role (optional) | ➕ Add |

---

### Screen-by-Screen Adaptations

#### Screen 1: Company Workspace

**Current UI shows:**
- Company name
- Company logo upload
- Description
- Website
- Location
- Pathway (single dropdown)

**Plan specifies:**
- Company name (with autocomplete for existing)
- Company logo
- Website
- Description
- Size (separate section)
- Industry/Pathway (PathwayTag multi-select, 1-3)

**Recommendation:**

```
🔄 MODIFY this screen:

Keep:
- Company name (add autocomplete for existing companies)
- Logo upload
- Description
- Website

Remove or Move:
- Location (move to company profile settings, not critical for onboarding)

Replace:
- Single pathway dropdown → PathwayTag multi-select (1-3)

Add (can be same page, step 2):
- Company size selector
```

**New Layout (Step 1 - Company Info):**

```
┌─────────────────────────────────────────────────────────┐
│  Your company                                           │
│  Tell us about your organization                        │
│                                                         │
│  Company name *                                         │
│  [Tesla, Inc._________________________]                 │
│  ├─ Tesla, Inc. — Palo Alto, CA                        │
│  └─ + Create "Tesla, Inc."                             │
│                                                         │
│  ┌─────────┐                                            │
│  │   [+]   │  Add company logo                          │
│  │   Logo  │  Recommended: 400x400px                    │
│  └─────────┘                                            │
│                                                         │
│  Website                                                │
│  [https://tesla.com___________________]                 │
│                                                         │
│  About your company                                     │
│  [Brief description of what you do____]                 │
│  [____________________________________]                 │
│                                                         │
│                                    [Continue →]         │
└─────────────────────────────────────────────────────────┘
```

**New Layout (Step 2 - Size & Industry):**

```
┌─────────────────────────────────────────────────────────┐
│  Company size *                                         │
│                                                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│  │   1-10    │ │   11-50   │ │  51-200   │             │
│  │  Startup  │ │  Growing  │ │ Scale-up  │             │
│  └───────────┘ └───────────┘ └───────────┘             │
│                                                         │
│  ┌───────────┐ ┌───────────┐                            │
│  │  201-500  │ │   500+    │                            │
│  │  Mid-size │ │Enterprise │                            │
│  └───────────┘ └───────────┘                            │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  What industry is your company in? *                    │
│  Select 1-3 industries                                  │
│                                                         │
│  [⚡ Energy]  [💻 Technology]  [🚗 Transportation]      │
│  [🌱 Agriculture]  [🌿 Conservation]  [🏭 Manufacturing]│
│  [🏗️ Construction]  [💰 Finance]  [⚖️ Policy]           │
│  [🔬 Research]  [💧 Water]  [♻️ Waste Management]       │
│                                                         │
│  Show all industries ↓                                  │
│                                          2/3 selected   │
│                                                         │
│                                    [Continue →]         │
└─────────────────────────────────────────────────────────┘
```

**Key Change - Replace Dropdown with PathwayTag:**

```tsx
// BEFORE (current UI - dropdown)
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select pathway" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="energy">Energy</SelectItem>
    ...
  </SelectContent>
</Select>

// AFTER (plan - PathwayTag multi-select)
<div className="flex flex-wrap gap-2">
  {EMPLOYER_PATHWAYS.map((pathway) => (
    <PathwayTag
      key={pathway}
      pathway={pathway}
      icon={pathwayIcons[pathway]}
      selected={selectedIndustries.includes(pathway)}
      onClick={() => toggleIndustry(pathway)}
    />
  ))}
</div>
```

---

#### Screen 2: Your Role

**Current UI shows:**
- Job title
- Phone number
- LinkedIn URL
- Profile photo

**Plan specifies:**
- First name, Last name
- Job title
- LinkedIn URL (optional)

**Recommendation:**

```
🔄 MODIFY this screen:

Required:
- First name, Last name (if not already captured in signup)
- Job title

Optional (keep visible):
- Phone number — some employers prefer to share upfront
- LinkedIn URL
- Profile photo — adds credibility when messaging candidates

Rationale: Employers who want to present professionally can
add photo/LinkedIn. Those in a hurry can skip to posting roles.
```

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Your role                                              │
│                                                         │
│  First name *              Last name *                  │
│  [Sarah______________]    [Chen_______________]         │
│                                                         │
│  Your job title *                                       │
│  [Head of Talent_________________________]              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Add more details (optional)                            │
│                                                         │
│  ┌─────────┐                                            │
│  │   [+]   │  Your photo                                │
│  │  Photo  │  Candidates like seeing who they'll        │
│  └─────────┘  work with                                 │
│                                                         │
│  Phone                           LinkedIn URL           │
│  [____________________]         [____________________]  │
│                                                         │
│                                        [Continue →]     │
└─────────────────────────────────────────────────────────┘
```

---

#### Screen 3: Hiring Goals (NEW)

**Current UI:** Does not exist

**Plan specifies:**
- Single-select cards for hiring intent

**Recommendation:**

```
➕ ADD this screen:

This sets expectations and determines next steps:
- "Specific role" or "Multiple roles" → Prompt first role creation
- "Exploring" → Skip to invite/dashboard
```

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  What brings you here?                                  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 🎯  Hiring for a specific role                    │  │
│  │     I have a position to fill now                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 📋  Hiring multiple roles                         │  │
│  │     Building out the team                         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 🔍  Exploring the talent pool                     │  │
│  │     Not hiring yet, just looking                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

#### Screen 4: Post First Role (NEW, Optional)

**Current UI:** Does not exist

**Plan specifies:**
- Optional prompt to post first role
- Quick role setup with CategoryTag

**Recommendation:**

```
➕ ADD this optional step:

Gets employers to value faster. Uses CategoryTag
for role category instead of dropdown.
```

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Post your first role?                                  │
│                                                         │
│  Get in front of climate talent right away.             │
│  You can always edit or save as draft.                  │
│                                                         │
│  [Yes, let's go]              [Skip for now]            │
└─────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────┐
│  Quick role setup                                       │
│                                                         │
│  Job title *                                            │
│  [Senior Software Engineer_______________]              │
│                                                         │
│  Role category *                                        │
│  [💻 Software Engineering]  [📊 Data]  [📦 Product]     │
│  [🎨 Marketing & Design]  [⚙️ Operations]  [🔬 Science] │
│  [🌱 Climate & Sustainability]  [more...]               │
│                                                         │
│  Location *                                             │
│  [San Francisco, CA______________________]              │
│                                                         │
│  Work type *                                            │
│  (•) On-site   ( ) Hybrid   ( ) Remote                 │
│                                                         │
│  Employment type                                        │
│  [Full-time_______________________________] ▾           │
│                                                         │
│  [Save as draft]                    [Publish role →]    │
└─────────────────────────────────────────────────────────┘
```

---

#### Screen 5: Team Invites

**Current UI shows:**
- Email input
- Role selector (dropdown)
- Add more capability

**Plan specifies:**
- Same structure

**Recommendation:**

```
✅ KEEP this screen as-is

Your current implementation matches the spec well.
Only minor enhancements:

- Add role descriptions below the form
- Add "Skip for now" option
- Clarify Recruiter vs Hiring Team permissions
```

**Enhanced Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Invite your team                                       │
│  Collaborate on hiring with your colleagues             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Email                         Role              │    │
│  │ [jane@company.com_______]    [Recruiter    ▾]  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  [+ Add another person]                                 │
│                                                         │
│  Role permissions:                                      │
│  • Recruiter — Create roles, manage all candidates      │
│  • Hiring Team — Review candidates for assigned roles   │
│                                                         │
│  [Skip for now]                      [Send invites →]   │
└─────────────────────────────────────────────────────────┘
```

---

## Coach Onboarding (NEW)

**Current UI:** Does not exist (per your note)

**Plan specifies:** Complete 8-10 minute flow with:
1. Profile (name, LinkedIn)
2. About (photo required, tagline, bio, location)
3. Expertise (coaching types, PathwayTag industries, CategoryTag careers)
4. Services (session types, pricing)
5. Availability (schedule, calendar sync)
6. Payout (Stripe Connect, optional)
7. Preview (full profile review)
8. Go Live (celebration + share)

**Recommendation:**

```
➕ BUILD ENTIRE FLOW from scratch

Coach onboarding is fundamentally different:
- Photo is REQUIRED (coaches are discoverable)
- Profile is their PRODUCT
- Longer flow is expected and necessary
- "Go Live" moment creates emotional investment
```

**Key differences from Talent:**

| Aspect | Talent | Coach |
|--------|--------|-------|
| Photo | Optional (prompted later) | Required upfront |
| Time | 60-90 seconds | 8-10 minutes |
| Goal | See job matches | Publish discoverable profile |
| End state | Job feed | "You're live!" celebration |

---

## Summary: Priority Implementation Order

### Phase 1: Core Flow Restructure (Talent)

1. **Modify Profile screen** — Keep photo/phone/pronouns as optional, add LinkedIn, move ethnicity to settings
2. **Modify Career Journey** — Split into Background (stage + experience + optional goals + optional work history) and Preferences
3. **Add Skills screen** — PathwayTag + CategoryTag (high impact, uses design system)
4. **Preferences → Home** — Go directly to job feed after completing onboarding

### Phase 2: Employer Enhancements

1. **Replace pathway dropdown** — Use PathwayTag multi-select
2. **Add Company Size step** — Card selector
3. **Add Hiring Goals screen** — Determines flow branching
4. **Add Quick Role setup** — With CategoryTag for category
5. **Modify Your Role screen** — Keep phone/photo as optional with clear labels

### Phase 3: Coach Onboarding (New Build)

1. Build entire flow from scratch per coach-onboarding-plan.md
2. Start with About (photo required) and Expertise (PathwayTag + CategoryTag)
3. Add Services and Availability
4. Implement Preview and Go Live celebration

---

## Field Summary: Required vs Optional vs Move

### Talent Onboarding

| Field | Status | Notes |
|-------|--------|-------|
| First name | Required | |
| Last name | Required | |
| Profile photo | 📍 Optional | "Helps you stand out to employers" |
| Pronouns | 📍 Optional | Quick to add, signals inclusivity |
| Phone | 📍 Optional | Some users prefer sharing upfront |
| LinkedIn URL | 📍 Optional | Add this field |
| Ethnicity | ❌ Move | To profile settings — sensitive demographic data |
| Career stage | Required | |
| Years of experience | Required | |
| Current role | 📍 Optional | |
| Goals text | 📍 Optional | Keep — users like sharing their "why" |
| Work experience | 📍 Optional | NEW — repeatable form for work history |
| Climate sectors (PathwayTag) | Required | NEW — core matching |
| Job functions (CategoryTag) | Required | NEW — core matching |
| Location | Required | Move to Preferences screen |
| Remote preference | Required | |
| Job types | Required | |
| Salary expectation | 📍 Optional | |

### Employer Onboarding

| Field | Status | Notes |
|-------|--------|-------|
| Company name | Required | Add autocomplete |
| Company logo | 📍 Optional | Encouraged |
| Website | 📍 Optional | |
| Description | 📍 Optional | |
| Company size | Required | NEW |
| Industry (PathwayTag) | Required | Replace dropdown with multi-select |
| First name | Required | |
| Last name | Required | |
| Job title | Required | |
| Phone | 📍 Optional | |
| LinkedIn URL | 📍 Optional | |
| Photo | 📍 Optional | "Candidates like seeing who they'll work with" |
| Hiring goals | Required | NEW |
| First role | 📍 Optional | NEW — skip available |
| Team invites | 📍 Optional | Already implemented |

---

## Data Migration Notes

If you have existing users with the old data structure:

```typescript
// Map old pathway dropdown value to new PathwayType array
const migratePathway = (oldPathway: string): PathwayType[] => {
  // If they had a single pathway selected, keep it
  if (isValidPathwayType(oldPathway)) {
    return [oldPathway as PathwayType];
  }
  return [];
};

// Demographics (ethnicity, pronouns) move to profile settings
// These should be optional and not blocking
```

---

## Component Reuse

Both flows can share these selector components:

| Component | Used In | Location |
|-----------|---------|----------|
| `PathwaySelector` | Talent Skills, Employer Industry, Coach Expertise | `@/components/onboarding/PathwaySelector` |
| `CategorySelector` | Talent Skills, Employer Quick Role, Coach Expertise | `@/components/onboarding/CategorySelector` |
| `CareerStageSelector` | Talent Background | `@/components/onboarding/CareerStageSelector` |
| `LocationInput` | Talent Preferences, Employer Quick Role | `@/components/onboarding/LocationInput` |

