# Employer Onboarding Redesign — Dev Handoff PRD

**Product:** Green Jobs Board (Canopy)
**Author:** Usman
**Date:** February 5, 2026
**Status:** Ready for implementation

---

## Summary

Redesign the employer onboarding flow from 6 steps to 3 steps, improving completion rates by reducing friction. Each step gets a dedicated illustration and a cleaner layout that separates company identity from personal profile setup.

**Current flow (6 steps):** Company → Size & Industry → Your Role → Hiring Goals → First Role → Invite Team

**New flow (3 steps):** Build Your Company Workspace → What Do You Do at {Company} → Build Your Team

**Steps removed entirely:** Size & Industry, Hiring Goals, First Role. These can be prompted post-onboarding via the dashboard or re-engagement emails.

---

## Step 1 — Build Your Company Workspace

**Route:** `/onboarding/canopy/company`
**Illustration:** `/illustrations/employer-onboarding-companyworkspace.png`
**Title:** "Build your company workspace"
**Subtitle:** "Fill in some details about your company workspace"

### Form fields

| Field               | Type                       | Required | Placeholder                         | Notes                                                              |
| ------------------- | -------------------------- | -------- | ----------------------------------- | ------------------------------------------------------------------ |
| Company Name        | Text input                 | Yes      | "Enter the name of your company"    | Inline with logo upload button                                     |
| Upload company logo | File upload button         | No       | —                                   | Camera icon, opens file picker. Accepts png/jpg/svg                |
| Company description | Textarea                   | No       | "Write a brief company description" | 250 character limit with live counter (bottom-right)               |
| Company website     | Text input with globe icon | No       | "Company URL"                       | Side-by-side with Company Location                                 |
| Company Location    | Text input with pin icon   | No       | "Enter your location"               | Side-by-side with Company website                                  |
| Company Pathway     | Dropdown select            | No       | "Select a pathway"                  | Single select with chevron. Options TBD from existing pathway list |

### Validation

Continue is enabled when `companyName.trim().length > 0`. All other fields are optional.

### API call

POST `/api/onboarding` with `action: "complete-profile"`. This step also persists `firstName` and `lastName` from the auth signup (already captured during registration — no longer collected here).

### Navigation

- **Back:** `← Change account type` pill button in header → `/onboarding`
- **Continue:** Bottom-right → navigates to Step 2

### Key change from current

The current Step 1 collects first name, last name, LinkedIn URL, and bio alongside company info. The redesign moves all personal/professional fields to Step 2 and adds Company Pathway (previously in the Size & Industry step).

---

## Step 2 — What Do You Do at {Company Name}

**Route:** `/onboarding/canopy/your-role`
**Illustration:** `/illustrations/employer-onboarding-whatdoyoudo.png`
**Title:** "What do you do at {Company Name}" — dynamically interpolates from Step 1
**Subtitle:** "Set up your profile for this workspace."

### Form fields

| Field                     | Type               | Required | Placeholder                       | Notes                                                                                                                      |
| ------------------------- | ------------------ | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Job Title                 | Text input         | Yes      | "What is your job title?"         | Maps to existing `userTitle` field                                                                                         |
| Phone Number              | Text input (tel)   | No       | "Enter your phone number"         | Labeled "(Optional)". Maps to `baseProfile.phone`                                                                          |
| LinkedIn URL              | Text input         | No       | "Enter your LinkedIn profile URL" | Under section header "Connect your LinkedIn Profile to Green Jobs Board". Maps to `baseProfile.linkedinUrl`                |
| Upload your profile photo | File upload button | No       | —                                 | Camera icon. Under copy "Add a photo to help build trust with potential applicants". Maps to `baseProfile.profilePhotoUrl` |

### Validation

Continue is enabled when `userTitle.trim().length > 0`.

### Navigation

- **Back:** Circle icon button (bottom-left) → Step 1
- **Continue:** Bottom-right → navigates to Step 3

### Key change from current

The current "Your Role" step only collects job title and shows a benefits info card. The redesign absorbs phone, LinkedIn, and profile photo (previously in Step 1) and removes the benefits card. The title changes from "Your role" to the more personal "What do you do at {Company Name}".

---

## Step 3 — Build Your Team

**Route:** `/onboarding/canopy/invite-team`
**Illustration:** `/illustrations/employer-onboarding-Build your team.png`
**Title:** "Build Your Team"
**Subtitle:** "Work together to create roles, manage your candidate funnel, and hire new people to your company."

### Layout

A horizontal divider separates the subtitle from the "Send Invites" section below.

### Form fields

| Element       | Type              | Notes                                                                                               |
| ------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| Email input   | Text input        | Placeholder "Enter teammates email address". Paired with + Add button                               |
| + Add button  | Button            | Adds the email to the member list below. Validates email format before adding                       |
| Member list   | Card list         | Each row: avatar circle (first letter, dark green bg) + email + role dropdown + trash delete button |
| Role dropdown | Select per member | Options: "Reviewer", "Recruiter", "Hiring Team". Default: "Reviewer"                                |
| Delete button | Icon button       | Trash icon, removes member from list                                                                |

### Empty state

When no members have been added, show centered muted text: "No team members added yet."

### Validation

No minimum required — users can skip invites entirely.

### Navigation

- **Back:** Circle icon button (bottom-left) → Step 2
- **Continue Without Inviting:** Secondary button (bottom-right) → completes onboarding without sending invites
- **Invite {N} People and Continue:** Primary button (bottom-right) → sends invites, then completes onboarding. Dynamic label: "Invite 1 Person and Continue" / "Invite 2 People and Continue" etc. Only visible when members list is non-empty

### API call

POST `/api/onboarding` with `action: "complete-role"`, `shell: "employer"`. Payload includes all employer data collected across all 3 steps plus `teamInvites` array. This is the only step that triggers the full completion flow (creates Organization, OrganizationMember, sends invite emails).

### Role mapping

The designs use "Reviewer" as the default display label. Map to existing backend roles:

| Display label          | Backend value | Permissions                                                    |
| ---------------------- | ------------- | -------------------------------------------------------------- |
| Recruiter              | `"RECRUITER"` | Can post roles, manage candidates, view analytics              |
| Reviewer / Hiring Team | `"MEMBER"`    | Can view candidates assigned to their roles and leave feedback |

### Key change from current

The current invite step uses a static form with "Add another person" to add rows. The redesign uses a separate input + "Add" button pattern with a scrollable member list, trash delete icons, and a dynamic CTA label. Role options are expanded to include "Reviewer" as the default.

---

## Data Model Changes

### EmployerFormData — updated interface

```typescript
export interface EmployerFormData {
  // Step 1 — Company workspace
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  companyLocation: string;
  companyPathway: string; // NEW — replaces industries[]
  companyLogoFile: string | null; // NEW — logo upload URL

  // Step 2 — Your role (moved from base profile)
  userTitle: string;

  // Step 3 — Team invites
  teamInvites: TeamInviteEntry[];

  // REMOVED fields (no longer collected during onboarding)
  // companySize: string | null;
  // industries: string[];
  // hiringGoal: HiringGoal | null;
  // firstRole: EmployerFirstRole | null;
}
```

### BaseProfileData — fields now set in Step 2

```typescript
// These fields are SET during Step 2 of employer onboarding:
// - phone (new to this step)
// - linkedinUrl (moved from Step 1)
// - profilePhotoUrl (new to this step)
```

### TeamInviteEntry — add display role

```typescript
export interface TeamInviteEntry {
  email: string;
  role: "RECRUITER" | "MEMBER";
  displayRole?: string; // "Reviewer" | "Recruiter" | "Hiring Team" — UI only
}
```

---

## Step Configuration Changes

### Current EMPLOYER_STEPS (remove)

```typescript
// DELETE these step configs:
// { id: "size-industry", ... }
// { id: "hiring-goals", ... }
// { id: "first-role", ... }
```

### New EMPLOYER_STEPS

```typescript
export const EMPLOYER_STEPS: StepConfig[] = [
  {
    id: "company",
    path: "company",
    title: "Build your company workspace",
    subtitle: "Fill in some details about your company workspace",
  },
  {
    id: "your-role",
    path: "your-role",
    title: "What do you do at {companyName}",
    subtitle: "Set up your profile for this workspace.",
  },
  {
    id: "invite-team",
    path: "invite-team",
    title: "Build Your Team",
    subtitle:
      "Work together to create roles, manage your candidate funnel, and hire new people to your company.",
  },
];
```

### EmployerOnboardingStep type

```typescript
export type EmployerOnboardingStep = "company" | "your-role" | "invite-team";
```

---

## Routing Changes

### Pages to keep (modify)

| File                                             | Changes                                                                                                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/onboarding/canopy/company/page.tsx`     | Remove first/last name and bio fields. Add logo upload, pathway dropdown. Update layout to match design                                                   |
| `src/app/onboarding/canopy/your-role/page.tsx`   | Add phone, LinkedIn, profile photo fields. Remove benefits info card. Update title to use dynamic company name                                            |
| `src/app/onboarding/canopy/invite-team/page.tsx` | Redesign with email input + Add button pattern. Add role dropdown per member. Update CTAs to "Continue Without Inviting" / "Invite N People and Continue" |

### Pages to delete

| File                                               | Reason       |
| -------------------------------------------------- | ------------ |
| `src/app/onboarding/canopy/size-industry/page.tsx` | Step removed |
| `src/app/onboarding/canopy/hiring-goals/page.tsx`  | Step removed |
| `src/app/onboarding/canopy/first-role/page.tsx`    | Step removed |

### Navigation flow

```
/onboarding (shell select) → /onboarding/canopy/company → /onboarding/canopy/your-role → /onboarding/canopy/invite-team → /onboarding/complete
```

No conditional routing — all 3 steps are always shown in sequence.

---

## API Changes

### Zod validation schema updates

Remove validation for removed fields:

```typescript
// REMOVE from employerFields:
// companySize, industries, hiringGoal, firstRole

// ADD to employerFields:
companyPathway: z.string().max(100).optional(),
companyLogoFile: z.string().url().max(500).optional().nullable(),
```

### Completion handler

The `"complete-role"` action handler should no longer expect or process `firstRole` data. The Job creation logic (currently triggered by `firstRole`) should be removed from the onboarding flow.

---

## Component Changes

### OnboardingShell

Update `totalSteps` from 6 to 3. The `rightPanel` prop already supports illustrations — pass the correct image for each step.

### StepNavigation

Step 3 needs two action buttons in the footer:

- Secondary: "Continue Without Inviting" — triggers completion without invites
- Primary: "Invite {N} People and Continue" — dynamic label, triggers completion with invites

The current `skipLabel` / `onSkip` pattern can be reused for the secondary button, but the label needs to be "Continue Without Inviting" rather than "Skip for now".

### Illustration integration

Each step page passes its illustration to `OnboardingShell.rightPanel`:

```tsx
import Image from "next/image";

<OnboardingShell
  rightPanel={
    <Image
      src="/illustrations/employer-onboarding-companyworkspace.png"
      alt="Team rowing a boat together"
      width={500}
      height={500}
      className="w-full max-w-md"
    />
  }
  // ...
/>;
```

---

## Files to Modify — Checklist

### Must change

- [ ] `src/lib/onboarding/types.ts` — Update `EmployerOnboardingStep`, `EMPLOYER_STEPS`, remove `HiringGoal` and `EmployerFirstRole` types
- [ ] `src/components/onboarding/form-context.tsx` — Update `EmployerFormData` interface, add `companyPathway` and `companyLogoFile`, remove `companySize`, `industries`, `hiringGoal`, `firstRole`. Update `INITIAL_EMPLOYER`
- [ ] `src/app/onboarding/canopy/company/page.tsx` — Redesign with new fields and layout
- [ ] `src/app/onboarding/canopy/your-role/page.tsx` — Add profile fields, dynamic title, remove benefits card
- [ ] `src/app/onboarding/canopy/invite-team/page.tsx` — Redesign with new invite UX
- [ ] `src/app/api/onboarding/route.ts` — Update Zod schema, remove firstRole/Job creation logic

### Must delete

- [ ] `src/app/onboarding/canopy/size-industry/page.tsx`
- [ ] `src/app/onboarding/canopy/hiring-goals/page.tsx`
- [ ] `src/app/onboarding/canopy/first-role/page.tsx`

### May need updates

- [ ] `src/components/onboarding/onboarding-shell.tsx` — Verify totalSteps is passed correctly from pages
- [ ] `src/components/onboarding/step-navigation.tsx` — May need layout update for dual-CTA footer on Step 3
- [ ] `src/app/onboarding/complete/page.tsx` — Verify completion copy still makes sense without first role
- [ ] Any helper functions in `types.ts` that reference removed steps (`getOnboardingRedirect`, `advanceOnboardingStep`)
- [ ] Re-engagement email templates — update triggers since "Post your first role" is no longer part of onboarding

---

## Design Reference

### Colors

| Token                     | Value     | Usage                                  |
| ------------------------- | --------- | -------------------------------------- |
| `--primitive-green-800`   | `#0a3d2c` | Primary buttons, headings, header text |
| `--primitive-neutral-100` | —         | Input backgrounds                      |
| `--primitive-neutral-200` | —         | Input borders, dividers                |
| `--primitive-blue-500`    | `#3369ff` | Input focus ring                       |

### Typography

| Element          | Style                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Step title       | Serif font (Playfair Display / Georgia), ~38px, dark green, bold |
| Step subtitle    | Sans-serif, 16px, gray-500                                       |
| Form labels      | Sans-serif, 14px, font-weight 600, dark green                    |
| Input text       | Sans-serif, 16px                                                 |
| Placeholder text | Sans-serif, 16px, gray-400                                       |

### Layout

Two-panel layout: left panel (max-width ~640px) contains form content with 48px horizontal padding. Right panel fills remaining space and centers the illustration. Right panel is hidden on screens below the `lg` breakpoint.

### Illustrations

| Step | File                                       | Description                                                                                   |
| ---- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1    | `employer-onboarding-companyworkspace.png` | Captain standing at the bow of a rowboat with crew members rowing — represents leading a team |
| 2    | `employer-onboarding-whatdoyoudo.png`      | Person working at a desk with a cat and plant — represents setting up your workspace          |
| 3    | `employer-onboarding-Build your team.png`  | Two people high-fiving with celebration sparkles — represents collaboration                   |

---

## Out of Scope

These items are intentionally excluded from the onboarding redesign and should be addressed separately:

- **Company size collection** — Move to organization settings or dashboard prompt
- **Industry/sector selection** — Move to organization settings or first role posting
- **Hiring goals** — Infer from user behavior or prompt in-product
- **First role posting** — Prompt via dashboard empty state or re-engagement email (24hr trigger)
- **Email verification** — Already handled during signup, not part of this flow
- **Onboarding analytics/tracking events** — Should be updated to reflect new 3-step funnel but is a separate ticket
