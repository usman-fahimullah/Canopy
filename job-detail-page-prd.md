# PRD: Job Detail Page

**Status:** Final
**Author:** Usman
**Date:** February 5, 2026
**Stack:** Next.js 14.2 (App Router) + Tailwind CSS 3.4 + Trails Design System
**Figma:** [Pathways MVP — Job Detail](https://www.figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=1425-24686)

---

## 1. Overview

The Job Detail Page is the primary destination for candidates viewing a specific job listing. It surfaces all relevant information about a role — description, qualifications, compensation, recruiter contact, and company context — in a scannable two-column layout. The page also provides actions to apply, save, and explore related opportunities.

This PRD covers everything inside the main content area. The app shell (side navigation, global header) is already built and out of scope.

---

## 2. Current Implementation

A working implementation already exists at `src/app/jobs/search/[id]/page.tsx` (~790 lines, single `"use client"` file). This PRD documents the target spec and identifies gaps between what's built and what the design requires.

### 2.1 What's Already Built

| Area                                      | Status      | Notes                                                                 |
| ----------------------------------------- | ----------- | --------------------------------------------------------------------- |
| Route & data fetching                     | Done        | Client-side fetch via `useEffect` → `GET /api/jobs/{id}`              |
| Job header (title, company, badges, CTAs) | Done        | Uses `Avatar(xs)`, `Badge(accent)`, `Button(primary/inverse)`         |
| Save toggle with optimistic UI            | Done        | `POST/DELETE /api/jobs/{id}/save` with rollback on error              |
| Skeleton loading state                    | Done        | `JobDetailSkeleton` with `Skeleton` + `SkeletonCard`                  |
| Error / 404 state                         | Done        | Message + "Back to Job Search" CTA                                    |
| Two-column layout                         | Done        | `flex gap-6`, left `flex-1`, right `w-[350px] shrink-0`               |
| Tabs (Job Details / Your Notes)           | Done        | `Tabs` + `TabsList` + `TabsTrigger` (pill variant)                    |
| Apply Before card                         | Done        | `Card` + `Badge(warning)` for "Closing Soon"                          |
| Recruiter card                            | Partial     | Hardcoded placeholder — no real recruiter data from API               |
| Highlights card                           | Done        | Uses `InfoTag` for salary + `CalendarStar` icon header                |
| Role Overview card                        | Done        | Uses `InfoTag` + `CategoryTag` + `Briefcase` icon header              |
| About Company card                        | Done        | `Avatar(xl)` + truncated description + "Read More" `Button(tertiary)` |
| Explore More Jobs                         | Done        | Uses `JobPostCard(size="full")` for similar jobs                      |
| Job description rendering                 | Done        | `dangerouslySetInnerHTML` with `formatDescription()` helper           |
| Your Notes tab                            | Partial     | Read-only display of `savedNotes`; no edit/save UI                    |
| Responsive / mobile                       | Not started | No mobile breakpoints, no sticky CTA bar                              |
| Search bar in header                      | Done        | `PageHeader` + `SearchBar` component                                  |

### 2.2 Gap Analysis — What Needs Work

| Gap                           | Priority | Description                                                                                                                                                    |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Notes editor                  | High     | Currently read-only text. Needs `Textarea` with auto-save (debounce + `PATCH /api/jobs/{id}/notes`)                                                            |
| Recruiter card with real data | High     | Hardcoded "Recruiter" placeholder. API needs to return recruiter from Organization team members (name, title, avatar, email)                                   |
| Responsive layout             | High     | No mobile breakpoints. Need single-column stacking below `md` (768px), sticky CTA bar on mobile                                                                |
| Tab variant mismatch          | Medium   | Currently uses pill-style `TabsList`. Design shows underline variant — switch to `TabsListUnderline` + `TabsTriggerUnderline`                                  |
| Description sanitization      | Medium   | Uses `dangerouslySetInnerHTML` without explicit sanitization. Add server-side HTML sanitization                                                                |
| Apply Now destination         | Medium   | Button currently has no `onClick`. Needs routing to the employer-created application form for this job                                                         |
| `aria-pressed` on Save        | Low      | Missing accessibility attribute on save toggle                                                                                                                 |
| Badge variant bug             | Low      | BIPOC badge uses `variant="accent"` which doesn't exist in the `Badge` component. Falls back to unstyled. Switch to `variant="feature"` or `variant="default"` |
| Component extraction          | Low      | All sidebar components are inline in the page file. Should be extracted to separate files for reuse/testing                                                    |

---

## 3. Goals

- Give candidates all the information they need to decide whether to apply, without leaving the page
- Make the apply and save actions persistently accessible
- Surface structured metadata (compensation, location, education, job type) separately from prose descriptions so users can quickly triage fit
- Provide a path to the recruiter and to related jobs to keep engagement high
- Support a "Your Notes" tab for candidates to capture personal notes against a listing

---

## 4. Page Layout

```
┌─────────────────────────────────────────────────────┐
│  PageHeader (sticky)                                 │
│  [SearchBar: title + location + "Search Jobs"]       │
├─────────────────────────────────────────────────────┤
│                   Job Header Bar                     │
│  [Avatar] Title  Company  Badge    [Apply Now] [Save]│
├────────────────────────────┬────────────────────────┤
│                            │  Tab Bar               │
│                            │  [Job Details | Notes]  │
│   Job Description          │                        │
│   (Card with prose)        │  Apply Before Card     │
│                            │  Recruiter Card        │
│                            │  Highlights Card       │
│                            │  Role Overview Card    │
│                            │  About Company Card    │
│                            │  Explore More Jobs     │
├────────────────────────────┴────────────────────────┤
```

**Container:** `bg-[var(--background-subtle)]` (neutral-100) for the two-column area. Job header sits on `bg-[var(--background-default)]` (white) with `border-b border-[var(--border-muted)]`.

**Responsive behavior:**

| Breakpoint        | Behavior                                                                        | Tailwind                              |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| `≥ 1024px` (lg)   | Two-column: left `flex-1`, right `w-[350px] shrink-0`                           | `flex gap-6 px-12 py-6`               |
| `768–1023px` (md) | Two-column with narrower sidebar `w-[300px]`                                    | `md:w-[300px]`                        |
| `< 768px` (sm)    | Single column — sidebar stacks below description. CTAs become sticky bottom bar | `flex-col`, `fixed bottom-0` for CTAs |

---

## 5. Data Model

### 5.1 `JobDetail` (existing — from codebase)

```typescript
interface JobDetail {
  id: string;
  title: string;
  slug: string;
  description: string; // HTML or plain text body
  location: string | null; // e.g. "Montpelier, VT"
  locationType: string; // "REMOTE" | "HYBRID" | "ONSITE"
  employmentType: string; // "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string; // e.g. "USD"
  climateCategory: string | null; // e.g. "Marketing & Design"
  impactDescription: string | null; // compensation note / stipend info
  greenSkills: string[];
  requiredCerts: string[]; // education requirements
  experienceLevel: string | null; // "ENTRY" | "INTERMEDIATE" | "SENIOR" | "EXECUTIVE"
  isFeatured: boolean;
  publishedAt: string | null;
  closesAt: string | null; // ISO 8601 deadline
  organization: Organization;
  pathway: Pathway | null;
  isSaved: boolean; // current user's save state
  savedNotes: string | null; // user's personal notes
}
```

### 5.2 Supporting Types (existing)

```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isBipocOwned?: boolean;
  isWomenOwned?: boolean;
  isVeteranOwned?: boolean;
  description?: string | null;
}

interface Pathway {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
}

interface SimilarJob {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  climateCategory: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    isBipocOwned?: boolean;
  };
  pathway: Pathway | null;
}
```

### 5.3 Recruiter Data (from Organization team members)

The recruiter is sourced from the Organization's team members. The `JobDetail` API response should be extended to include a recruiter field.

```typescript
interface Recruiter {
  id: string;
  name: string;
  title: string;
  avatarUrl: string | null;
  email: string; // required — used for mailto: contact link
}
```

**Data source:** The `Organization` model's team member relation. The API should resolve the recruiter by either:

- A `recruiterId` foreign key on the `Job` model pointing to an `OrganizationMember`, or
- A designated "recruiter" role on the Organization's team, falling back to the org owner

The `JobDetail` API response should be extended: `recruiter: Recruiter | null`.

---

## 6. Component Breakdown — Design System Mapping

### 6.1 Design System Components Used

| DS Component                                        | Import Path          | Used For                                                                                                                                         |
| --------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                                            | `@/components/ui`    | Apply Now (primary, lg), Save toggle (inverse/secondary, lg), Contact Recruiter (tertiary), Read More (tertiary), Back to Search (primary)       |
| `Badge`                                             | `@/components/ui`    | "BIPOC Owned" (currently `variant="accent"` — **bug**, should be `variant="feature"` or `variant="default"`), "Closing Soon" (variant=`warning`) |
| `Card` + `CardContent`                              | `@/components/ui`    | All sidebar cards, job description container                                                                                                     |
| `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` | `@/components/ui`    | Job Details / Your Notes tabs                                                                                                                    |
| `Avatar`                                            | `@/components/ui`    | Company logo (size=`xs` in header, `xl` in About card), Recruiter avatar (size=`lg`)                                                             |
| `Skeleton` + `SkeletonCard`                         | `@/components/ui`    | Loading state                                                                                                                                    |
| `InfoTag`                                           | `@/components/ui`    | Salary display, experience level, location pills, workplace type                                                                                 |
| `CategoryTag`                                       | `@/components/ui`    | Job type display (climate category with icon)                                                                                                    |
| `JobPostCard`                                       | `@/components/ui`    | Similar/related job cards (size=`full`)                                                                                                          |
| `Textarea`                                          | `@/components/ui`    | Notes editor (Your Notes tab)                                                                                                                    |
| `SearchBar`                                         | `@/components/ui`    | Page header search                                                                                                                               |
| `PageHeader`                                        | `@/components/shell` | Sticky top header                                                                                                                                |

### 6.2 Phosphor Icons Used

| Icon             | Import                  | Usage                                          |
| ---------------- | ----------------------- | ---------------------------------------------- |
| `BookmarkSimple` | `@phosphor-icons/react` | Save button (default state)                    |
| `CheckCircle`    | `@phosphor-icons/react` | Save button (saved state, `weight="fill"`)     |
| `CalendarStar`   | `@phosphor-icons/react` | Highlights card header (`weight="duotone"`)    |
| `Briefcase`      | `@phosphor-icons/react` | Role Overview card header (`weight="duotone"`) |
| `MapPin`         | `@phosphor-icons/react` | Location display (available, not yet used)     |
| `Buildings`      | `@phosphor-icons/react` | Company reference (available)                  |
| `House`          | `@phosphor-icons/react` | Workplace reference (available)                |

### 6.3 Helper Functions (existing — `src/lib/jobs/helpers.ts`)

| Function                                 | Purpose                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `getLocationTypeLabel(locationType)`     | Maps `"REMOTE"` → `"Remote"`, `"HYBRID"` → `"Hybrid"`, `"ONSITE"` → `"Onsite"`           |
| `getEmploymentTypeLabel(employmentType)` | Maps `"FULL_TIME"` → `"Full-Time"`, etc.                                                 |
| `getJobStatus(job)`                      | Returns `JobPostStatus`: `"bipoc-owned"` / `"featured"` / `"closing-soon"` / `"default"` |

### 6.4 Inline Helpers (in page file)

| Function                           | Purpose                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `formatSalary(min, max, currency)` | Formats salary range with `Intl.NumberFormat`                                                  |
| `formatDate(dateStr)`              | Formats ISO date to "February 25, 2026"                                                        |
| `isClosingSoon(closesAt)`          | Returns `true` if deadline is within 14 days                                                   |
| `getExperienceLevelLabel(level)`   | Maps `"SENIOR"` → `"Senior or Executive"`, etc.                                                |
| `formatDescription(description)`   | Converts plain text to HTML (bullets, headers, paragraphs). Passes through existing HTML as-is |

---

## 7. Component Specs (with token references)

### 7.1 Job Header Bar

**Container:** `border-b border-[var(--border-muted)] bg-[var(--background-default)] px-12 py-6`

| Element      | DS Component | Props/Tokens                                                                                                                                                                                                              |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Company Logo | `<Avatar>`   | `size="xs"` (24px), `src={organization.logo}`, `name={organization.name}`                                                                                                                                                 |
| Job Title    | `<h1>`       | `text-heading-sm font-medium text-[var(--foreground-default)]`                                                                                                                                                            |
| Company Name | `<span>`     | `text-body text-[var(--foreground-default)]`                                                                                                                                                                              |
| BIPOC Badge  | `<Badge>`    | Currently uses `variant="accent"` which **does not exist** in the Badge component. Should use `variant="feature"` (info-styled, bold) or `variant="default"` (primary/green). This is a bug in the current implementation |
| Apply Now    | `<Button>`   | `variant="primary" size="lg"` — green-800 bg, white text, rounded-2xl. Routes to the employer-created application form for this job                                                                                       |
| Save toggle  | `<Button>`   | Unsaved: `variant="inverse" size="lg"`. Saved: `variant="secondary"` with override `bg-[var(--primitive-green-200)] text-[var(--primitive-green-700)]`                                                                    |

**Save button icons:**

- Default: `<BookmarkSimple size={20} />`
- Saved: `<CheckCircle size={20} weight="fill" />`

### 7.2 Sidebar Tab Bar

**Current:** `<Tabs>` with pill-style `<TabsList>` + `<TabsTrigger>`
**Target (per design):** Switch to underline variant using `<TabsListUnderline>` + `<TabsTriggerUnderline>`

```tsx
<Tabs defaultValue="details">
  <TabsListUnderline className="w-full">
    <TabsTriggerUnderline value="details" className="flex-1">
      Job Details
    </TabsTriggerUnderline>
    <TabsTriggerUnderline value="notes" className="flex-1">
      Your Notes
    </TabsTriggerUnderline>
  </TabsListUnderline>
  <TabsContent value="details" className="mt-0" />
  <TabsContent value="notes" className="mt-4">
    {/* NotesEditor component */}
  </TabsContent>
</Tabs>
```

**Your Notes tab — needs implementation:**

Notes is a simple scratchpad. When a user starts writing, the job is also implicitly saved (if not already). This tab will eventually link to a dedicated "Saved Job" detail page where users can view all notes and documents associated with a saved job.

```tsx
// NotesEditor.tsx (new client component)
function NotesEditor({ jobId, initialNotes, isSaved, onSaveJob }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Auto-save with 1s debounce
  const debouncedSave = useDebouncedCallback(async (value: string) => {
    setSaveStatus("saving");
    // If job isn't saved yet, save it first
    if (!isSaved) {
      await fetch(`/api/jobs/${jobId}/save`, { method: "POST" });
      onSaveJob(); // update parent state
    }
    const res = await fetch(`/api/jobs/${jobId}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ content: value }),
    });
    setSaveStatus(res.ok ? "saved" : "error");
  }, 1000);

  return (
    <Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
      <CardContent className="p-6">
        <label className="sr-only" htmlFor="job-notes">
          Your notes
        </label>
        <Textarea
          id="job-notes"
          variant="default"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            debouncedSave(e.target.value);
          }}
          placeholder="Add your notes about this position..."
          className="min-h-[120px]"
        />
        {saveStatus === "saving" && (
          <span className="mt-2 text-caption text-[var(--foreground-subtle)]">Saving...</span>
        )}
        {saveStatus === "saved" && (
          <span className="mt-2 text-caption text-[var(--foreground-brand)]">Saved</span>
        )}
        {saveStatus === "error" && (
          <span className="mt-2 text-caption text-[var(--foreground-error)]">Failed to save</span>
        )}
      </CardContent>
    </Card>
  );
}
```

**Key behaviors:**

- Plain text scratchpad (no rich text)
- Auto-saves on 1s debounce after typing
- **Writing notes auto-saves the job** — if the job isn't already saved, `POST /api/jobs/{id}/save` is called before saving notes
- Shows save status indicator ("Saving...", "Saved", "Failed to save")
- Will eventually link to a dedicated saved job detail page for viewing all notes and attached documents

### 7.3 Apply Before Card

**Container:** `<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">`

```tsx
<CardContent className="flex items-center justify-between px-6 py-4">
  <div className="flex flex-col gap-1">
    <span className="text-sm font-bold text-[var(--foreground-default)]">Apply Before:</span>
    <span className="text-body text-[var(--foreground-default)]">{formatDate(closesAt)}</span>
  </div>
  {isClosingSoon(closesAt) && (
    <Badge variant="warning" className="shrink-0">
      Closing Soon
    </Badge>
  )}
</CardContent>
```

**Badge token mapping:** `variant="warning"` → `bg-[var(--badge-warning-background)]` (orange-100) + `text-[var(--badge-warning-foreground)]` (orange-700)

### 7.4 Recruiter Card

**Current:** Hardcoded placeholder. **Needs:** Real recruiter data sourced from Organization team members.

```tsx
<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="flex flex-col gap-4 p-6">
    <div className="flex items-center gap-3">
      <Avatar size="lg" src={recruiter.avatarUrl} name={recruiter.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body font-normal text-[var(--foreground-default)]">
          {recruiter.name}
        </span>
        <span className="truncate text-sm text-[var(--foreground-subtle)]">{recruiter.title}</span>
      </div>
    </div>
    <Button
      variant="tertiary"
      className="w-full"
      onClick={() =>
        (window.location.href = `mailto:${recruiter.email}?subject=${encodeURIComponent(`Re: ${job.title}`)}`)
      }
    >
      Contact (Recruiter)
    </Button>
  </CardContent>
</Card>
```

**Avatar:** `size="lg"` = 64×64px, circular, with auto-color from name hash.
**Button:** `variant="tertiary"` → `bg-[var(--button-tertiary-background)]` (neutral-200).
**Contact action:** Opens `mailto:` link with pre-filled subject line referencing the job title. Future iteration may add in-app messaging.

### 7.5 Highlights Card

**Card header pattern:** Icon + bold label inside card, no `CardHeader` sub-component used.

```tsx
<div className="flex items-center gap-2 px-6 py-4">
  <CalendarStar size={24} weight="duotone" />
  <span className="text-body font-bold text-[var(--foreground-default)]">Highlights</span>
</div>
```

**Rows:** Each row uses `border-b border-[var(--primitive-neutral-100)]` as separator, with `flex items-center justify-between`.
**Value tags:** `<InfoTag>` — cream background (`var(--tag-info-background)`), `rounded-lg`, `text-sm`, `px-2 py-1`.

### 7.6 Role Overview Card

Same card header pattern with `<Briefcase>` icon. Rows use `<InfoTag>` and `<CategoryTag>`.

**Job Type row:** `<CategoryTag category={...} variant="Truncate" />` — maps `climateCategory` to one of 15 defined `JobCategoryType` values.

**Location row:** Splits `job.location` by comma, renders each part as a separate `<InfoTag>`.

### 7.7 About Company Card

```tsx
<Avatar size="xl" src={organization.logo} name={organization.name} className="rounded-2xl" />
```

**Avatar:** `size="xl"` = 96×96px, overridden to `rounded-2xl` (square with large radius).
**Description:** `line-clamp-3` for truncation.
**CTA:** `<Button variant="tertiary" className="w-full">Read More</Button>`.

### 7.8 Job Description (Left Column)

**Container:** `<Card className="flex-1 rounded-2xl border-[var(--primitive-neutral-200)]">`

**Prose styling (Tailwind prose overrides):**

```css
.prose.prose-lg.max-w-none.text-[var(--foreground-default)]
  [&_h1]: text-heading-sm font-bold tracking-tight
  [&_h2]: text-heading-sm font-bold tracking-tight
  [&_h3]: text-body-strong font-bold uppercase tracking-wide
  [&_p]:  text-body leading-relaxed
  [&_ul]: space-y-1 pl-5
  [&_li]: text-body leading-relaxed
```

**Typography token mapping:**

| Element         | Token Class        | Size                                           |
| --------------- | ------------------ | ---------------------------------------------- |
| h1/h2           | `text-heading-sm`  | 24px / 32px line-height                        |
| h3 (subsection) | `text-body-strong` | 18px / 24px line-height, 700 weight, uppercase |
| Body            | `text-body`        | 18px / 24px line-height                        |
| Bullets         | `text-body`        | 18px, `pl-5` indent                            |

### 7.9 Explore More Jobs

Uses existing `<JobPostCard>` component:

```tsx
<JobPostCard
  companyName={job.organization.name}
  companyLogo={job.organization.logo}
  jobTitle={job.title}
  pathway={job.climateCategory?.toLowerCase().replace(/\s+/g, "-") as PathwayType}
  status={getJobStatus({
    organization: job.organization,
    isBipocOwned: job.organization.isBipocOwned,
  })}
  tags={[getLocationTypeLabel(job.locationType), getEmploymentTypeLabel(job.employmentType)]}
  size="full"
  onViewJob={() => (window.location.href = `/jobs/search/${job.id}`)}
/>
```

**`size="full"`** → full-width card, auto-height.
**`status`** drives badge display: `"bipoc-owned"` shows BIPOC badge overlay.

---

## 8. Design Token Quick Reference

### Colors Used on This Page

| Token                         | Value                 | Usage                                  |
| ----------------------------- | --------------------- | -------------------------------------- |
| `--background-default`        | #FFFFFF (neutral-0)   | Header bar, cards                      |
| `--background-subtle`         | #FAF9F7 (neutral-100) | Page background behind two-column area |
| `--foreground-default`        | #1F1D1C (neutral-800) | Primary text                           |
| `--foreground-muted`          | #3D3A37 (neutral-700) | Secondary text                         |
| `--foreground-subtle`         | #7A7671 (neutral-600) | Tertiary text (recruiter title)        |
| `--border-muted`              | #E5DFD8 (neutral-300) | Header bottom border                   |
| `--primitive-neutral-200`     | #F2EDE9               | Card borders                           |
| `--primitive-neutral-100`     | #FAF9F7               | Row separators inside cards            |
| `--primitive-green-200`       | #DCFAC8               | Saved button background                |
| `--primitive-green-700`       | #0E5249               | Saved button text                      |
| `--button-primary-background` | #0A3D2C (green-800)   | Apply Now button                       |
| `--tag-info-background`       | neutral-200           | InfoTag background                     |
| `--tag-category-background`   | neutral-200           | CategoryTag background                 |
| `--badge-warning-background`  | orange-100            | Closing Soon badge                     |

### Typography

| Class               | Size | Weight | Line Height |
| ------------------- | ---- | ------ | ----------- |
| `text-heading-sm`   | 24px | —      | 32px        |
| `text-body`         | 18px | 400    | 24px        |
| `text-body-strong`  | 18px | 700    | 24px        |
| `text-sm`           | 14px | 400    | 20px        |
| `text-sm font-bold` | 14px | 700    | 20px        |

### Spacing

| Usage                 | Value                        |
| --------------------- | ---------------------------- |
| Page padding          | `px-12` (48px) `py-6` (24px) |
| Column gap            | `gap-6` (24px)               |
| Card internal padding | `p-6` (24px)                 |
| Card stack spacing    | `space-y-6` (24px)           |
| Sidebar width         | `w-[350px]`                  |

### Radius

| Element               | Radius                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Cards                 | `rounded-2xl` (16px)                                                                      |
| Buttons               | `rounded-2xl` (16px) — inherited from `buttonVariants`                                    |
| Badges                | `rounded-full` (9999px)                                                                   |
| InfoTag / CategoryTag | `rounded-lg` (8px)                                                                        |
| Avatar                | `rounded-full` (circle) or `rounded-2xl` (square override for company logo in About card) |

---

## 9. API Endpoints

| Method   | Endpoint               | Status             | Purpose                                                                                                                                                    |
| -------- | ---------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/jobs/{id}`       | Exists             | Returns `{ job: JobDetail, similarJobs: SimilarJob[] }`. Needs extension: add `recruiter` field from org team members                                      |
| `POST`   | `/api/jobs/{id}/save`  | Exists             | Save job to user's saved list                                                                                                                              |
| `DELETE` | `/api/jobs/{id}/save`  | Exists             | Unsave job                                                                                                                                                 |
| `PATCH`  | `/api/jobs/{id}/notes` | **Needs creation** | Update user's notes. Body: `{ content: string }`. Writes to `SavedJob.notes`. If no `SavedJob` record exists, auto-creates one (saving the job implicitly) |

**Prisma models involved:**

- `Job` — core listing data
- `SavedJob` — join table between `SeekerProfile` and `Job`, includes `notes: String?`
- `Organization` — company data, includes team member relations
- `OrganizationMember` (or equivalent) — team member with name, title, avatar, email. Recruiter is resolved from this relation

### 9.1 Similar Jobs Algorithm (Multi-Signal Scoring)

The `GET /api/jobs/{id}` endpoint returns `similarJobs` using a multi-signal scoring approach. For each candidate job, compute a relevance score:

| Signal                 | Points | Description                                                        |
| ---------------------- | ------ | ------------------------------------------------------------------ |
| Same pathway           | 3      | Job shares the same `pathway` (e.g. both are "Marketing & Design") |
| Same `locationType`    | 2      | Both are Remote, or both are Onsite, etc.                          |
| Same `experienceLevel` | 1      | Both target Senior, or both target Entry, etc.                     |
| Same organization      | 1      | Different role at the same company                                 |

**Query logic:**

1. Exclude the current job from candidates
2. Only include published, non-expired jobs (`publishedAt IS NOT NULL AND (closesAt IS NULL OR closesAt > NOW())`)
3. Score each candidate job by summing matching signals
4. Return top 3 by score, breaking ties by `publishedAt` (most recent first)

**Implementation note:** This can be done as a single Prisma query with `orderBy` and computed scoring, or as a two-step process: fetch candidates with at least one signal match, then score and sort in application code.

---

## 10. Route & File Structure

**Current route:** `src/app/jobs/search/[id]/page.tsx` (single `"use client"` file, ~790 lines)

**Proposed refactor:**

```
src/app/jobs/search/[id]/
  page.tsx              // Main layout, data fetching, state management
  loading.tsx           // Skeleton (extract existing JobDetailSkeleton)
  error.tsx             // Error boundary
  components/
    JobHeader.tsx        // Title, company, badges, CTAs
    JobDescription.tsx   // Left column prose rendering
    SidebarTabs.tsx      // Tab container
    ApplyBeforeCard.tsx  // Deadline + closing soon badge
    RecruiterCard.tsx    // Avatar, name, title, contact CTA
    HighlightsCard.tsx   // Compensation, education, special requirements
    RoleOverviewCard.tsx // Job type, level, location, workplace
    AboutCompanyCard.tsx // Company logo, description, read more
    ExploreMoreJobs.tsx  // Similar job cards
    SaveButton.tsx       // Client component — save toggle with optimistic UI
    NotesEditor.tsx      // Client component — textarea with auto-save
```

---

## 11. Loading & Error States

### 11.1 Skeleton (existing `JobDetailSkeleton`)

Already implemented with:

- Header: `Skeleton` bars for title (h-8 w-80), company (h-6 w-40), badge (h-8 w-28 rounded-full), buttons (h-12 w-32 rounded-2xl)
- Left column: `SkeletonCard` with text placeholders (min-h-[600px])
- Right column: 4 stacked `SkeletonCard` components (h-24, h-32, h-48, h-48)

### 11.2 Error State (existing)

- 404 / error: centered layout with `text-heading-sm` heading, `text-body` description, `Button(primary)` "Back to Job Search" linking to `/jobs/search`

### 11.3 Empty States

| Component       | Empty State                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Recruiter card  | Hidden entirely when `recruiter` is null                                                                                                                           |
| Highlights card | Shows "Not specified" for missing salary. Hides education row if `requiredCerts` is empty                                                                          |
| Apply Before    | Shows "Not specified" when `closesAt` is null (consider hiding card entirely)                                                                                      |
| Related Jobs    | Section hidden when `similarJobs.length === 0`                                                                                                                     |
| Your Notes      | Editable textarea with placeholder: `"Add your notes about this position..."`. Writing auto-saves the job. No login-gate messaging needed since notes require auth |

---

## 12. Accessibility

- Job title is `h1` (`text-heading-sm`), description uses `h2`/`h3` via prose rendering — proper heading hierarchy
- All buttons inherit `focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2` from `buttonVariants`
- **Needed:** Save button should add `aria-pressed={isSaved}` to communicate toggle state
- Tab bar uses Radix `Tabs` primitive which handles `role="tablist"`, `role="tab"`, `role="tabpanel"` and arrow key navigation automatically
- Closing Soon badge: add `aria-label="Application closing soon"` (not just color to convey urgency)
- `Avatar` components include `alt` text via `name` prop fallback
- **Needed:** Related job cards should add `aria-label` including job title and company name
- Notes `Textarea` needs associated `<label>` element

---

## 13. Edge Cases

| Case                            | Handling                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| Extremely long job title        | Currently no truncation. **Add** `line-clamp-2` on mobile, `line-clamp-1` on desktop              |
| `closesAt` is in the past       | `isClosingSoon()` returns false (correct). **Add** "Application Closed" badge + disable Apply Now |
| Salary is null/null             | `formatSalary` returns `"Not specified"` — renders in `InfoTag`                                   |
| `description` contains raw HTML | `formatDescription()` passes through HTML as-is. **Add** DOMPurify sanitization                   |
| `description` is plain text     | `formatDescription()` converts bullets, ALL CAPS headers, and paragraphs to HTML                  |
| User is not logged in           | Save triggers API call that will 401. **Add** redirect to login or show login modal               |
| Location string has no comma    | Single `InfoTag` rendered (location splitting handles this)                                       |
| No similar jobs returned        | "Explore More Jobs" section hidden entirely                                                       |
| Company has no logo             | `Avatar` falls back to initials from `name` prop with auto-generated color                        |

---

## 14. Acceptance Criteria

### Job Header

- [ ] Displays job title, company name, company logo (`Avatar xs`), and badges (`Badge` — fix variant to `feature` or `default`)
- [ ] Apply Now button routes to the employer-created application form (`/apply/{jobId}`)
- [ ] Save button toggles with optimistic UI using `POST/DELETE /api/jobs/{id}/save`
- [ ] Save button shows `aria-pressed` state
- [ ] On mobile (`< 768px`), CTAs become sticky bottom bar

### Sidebar — Job Details Tab

- [ ] Tabs use underline variant (`TabsListUnderline` + `TabsTriggerUnderline`)
- [ ] Apply Before card shows formatted date and `Badge(warning)` "Closing Soon" when within 14 days
- [ ] Recruiter card shows real data from Organization team members (avatar, name, title, `mailto:` contact button)
- [ ] Highlights card renders salary via `InfoTag`, education certs via `InfoTag`
- [ ] Role Overview card renders job type via `CategoryTag`, other fields via `InfoTag`
- [ ] About Company card shows `Avatar(xl)` logo, truncated description (`line-clamp-3`), "Read More" button

### Sidebar — Your Notes Tab

- [ ] Plain text `Textarea` with `placeholder="Add your notes about this position..."`
- [ ] Auto-saves on 1s debounce via `PATCH /api/jobs/{id}/notes`
- [ ] Writing notes auto-saves the job (calls `POST /api/jobs/{id}/save` if not already saved)
- [ ] Shows save status indicator ("Saving...", "Saved", "Failed to save")
- [ ] Persists across page reloads
- [ ] Includes accessible `<label>` for the textarea

### Job Description

- [ ] Renders HTML with Tailwind prose overrides matching token typography
- [ ] `h2` → `text-heading-sm`, `h3` → `text-body-strong uppercase`, `p/li` → `text-body`
- [ ] HTML is sanitized before rendering

### Explore More Jobs

- [ ] Renders `JobPostCard(size="full")` for each similar job
- [ ] Each card navigates to `/jobs/search/{id}`
- [ ] Cards show company name, logo, title, pathway, location/employment type tags

### Responsive

- [ ] Two-column layout at `≥ 1024px` (`flex gap-6`)
- [ ] Single-column stacked layout below `768px`
- [ ] Sticky CTA bar on mobile

### Loading & Error

- [ ] `JobDetailSkeleton` shows on initial load
- [ ] 404 shows "This job may have been removed" with "Back to Job Search" CTA
- [ ] Failed save reverts optimistic update silently (current) or shows toast (target)

---

## 15. Out of Scope

- Side navigation / app shell (already built — `ShellLayout`, `ShellSidebar`)
- Search bar functionality (handled by `SearchBar` + `PageHeader` components, already integrated)
- Application flow / form (exists at `src/app/(public)/apply/[jobId]/page.tsx`)
- In-app messaging system (separate PRD; Contact button can use `mailto:` fallback)
- Company profile page (separate PRD; linked from About card)
- Authentication flows (separate system; this page gates save/notes behind login)

---

## 16. Decisions Log

All open questions have been resolved:

1. ~~**Apply Now destination**~~ → **Resolved.** Routes to the employer-created application form for this job. The form is dynamically generated by employers via the ATS (`/apply/{jobId}`).

2. ~~**Contact Recruiter**~~ → **Resolved.** `mailto:` link for v1. Opens the user's email client with a pre-filled subject line referencing the job title. In-app messaging (`src/components/messaging/`) may be connected in a future iteration.

3. ~~**Related Jobs algorithm**~~ → **Resolved.** Multi-signal scoring: same pathway (3pts) + same locationType (2pts) + same experienceLevel (1pt) + same organization (1pt). Return top 3 by score. See Section 9.1 for full spec.

4. ~~**Notes feature scope**~~ → **Resolved.** Plain text scratchpad via `Textarea`. Writing notes auto-saves the job if not already saved. A dedicated "Saved Job" detail page will eventually show all notes and documents associated with a saved job, and the Notes tab will link there.

5. ~~**Badge system**~~ → **Resolved.** Organization model supports `isBipocOwned`, `isWomenOwned`, `isVeteranOwned`. Currently only `isBipocOwned` is rendered. Can extend to show multiple badges.

6. ~~**Recruiter data source**~~ → **Resolved.** Recruiter comes from the Organization's team members. The API resolves the recruiter from the `OrganizationMember` relation — either via a `recruiterId` FK on the Job model or by a designated "recruiter" role on the org's team.
