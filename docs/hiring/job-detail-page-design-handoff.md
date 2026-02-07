# Design Handoff: Job Detail Page

**Status:** Ready for Implementation
**Date:** February 2026
**Design System:** Trails Design System (Canopy)
**Route:** `src/app/jobs/search/[id]/page.tsx`
**Figma:** [Pathways MVP — Job Detail](https://www.figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=1425-24686)

---

## 1. Page Anatomy

```
┌───────────────────────────────────────────────────────────────────┐
│ PageHeader (sticky)                                                │
│ bg-[var(--background-default)]                                     │
│ ┌─────────────────────────────────────────────────────────────────┤
│ │ SearchBar: title + location + "Search Jobs"                     │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Job Header Bar                                                     │
│ border-b border-[var(--border-muted)]                              │
│ bg-[var(--background-default)] px-12 py-6                         │
│                                                                     │
│ [Avatar xs] Title        Company Name        [Badge]    [Apply] [Save]
└───────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬──────────────────────────────┐
│ Left Column: Job Description         │ Right Column: Sidebar        │
│ bg-[var(--background-subtle)]        │ bg-[var(--background-subtle)]│
│ px-12 py-6 flex-1                    │ w-[350px] shrink-0           │
│                                      │                              │
│ ┌──────────────────────────────────┐ │ ┌──────────────────────────┐ │
│ │ Job Description Card             │ │ │ Tab Bar (Underline)      │ │
│ │ border-[var(--border-neutral-*)] │ │ │ [Job Details] [Notes]    │ │
│ │ rounded-2xl p-6                  │ │ └──────────────────────────┘ │
│ │                                  │ │                              │
│ │ Prose HTML with typography       │ │ Tab Content: Details View   │
│ │ text-body, text-heading-sm       │ │ ┌──────────────────────────┐ │
│ │ text-body-strong                 │ │ │ Apply Before Card        │ │
│ │                                  │ │ └──────────────────────────┘ │
│ │                                  │ │ ┌──────────────────────────┐ │
│ │                                  │ │ │ Recruiter Card           │ │
│ │                                  │ │ └──────────────────────────┘ │
│ │                                  │ │ ┌──────────────────────────┐ │
│ │                                  │ │ │ Highlights Card          │ │
│ │                                  │ │ └──────────────────────────┘ │
│ │                                  │ │ ┌──────────────────────────┐ │
│ │                                  │ │ │ Role Overview Card       │ │
│ │                                  │ │ └──────────────────────────┘ │
│ │                                  │ │ ┌──────────────────────────┐ │
│ │                                  │ │ │ About Company Card       │ │
│ │                                  │ │ └──────────────────────────┘ │
│ │                                  │ │ ┌──────────────────────────┐ │
│ │                                  │ │ │ Explore More Jobs        │ │
│ │                                  │ │ │ [JobPostCard]            │ │
│ │                                  │ │ │ [JobPostCard]            │ │
│ │                                  │ │ │ [JobPostCard]            │ │
│ │                                  │ │ └──────────────────────────┘ │
│                                      │                              │
└──────────────────────────────────────┴──────────────────────────────┘

MOBILE (<768px):
┌──────────────────────────────┐
│ Job Header Bar (sticky top)  │
│ [Logo] Title [Apply] [Save]  │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Job Description (full width) │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Sidebar stacked below        │
│ [All cards vertical]         │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Sticky Bottom CTA Bar        │
│ [Apply Button] [Save Button] │
│ position: fixed z-[var(...)] │
│ bg-[var(--background-default)]
│ border-t border-[var(...)]   │
└──────────────────────────────┘
```

---

## 2. Component-by-Component Visual Specs

### a) Job Header Bar

**Container:**

```
border-b border-[var(--border-muted)]
bg-[var(--background-default)]
px-12 py-6
flex items-center justify-between gap-4
```

**Layout Structure:**

```tsx
<div className="border-b border-[var(--border-muted)] bg-[var(--background-default)] px-12 py-6">
  <div className="flex flex-1 items-center gap-4">
    <Avatar size="xs" src={organization.logo} name={organization.name} />
    <div className="flex flex-1 flex-col gap-1">
      <h1 className="text-heading-sm font-medium text-[var(--foreground-default)]">{job.title}</h1>
      <span className="text-body text-[var(--foreground-default)]">{organization.name}</span>
    </div>
    {organization.isBipocOwned && <Badge variant="feature">BIPOC Owned</Badge>}
  </div>

  <div className="flex shrink-0 items-center gap-3">
    <Button variant="primary" size="lg">
      Apply Now
    </Button>
    <SaveButton />
  </div>
</div>
```

**Responsive:**

- **Desktop (≥1024px):** Inline layout with flex gap-4
- **Tablet (768–1023px):** Same inline layout, tighter padding `px-8`
- **Mobile (<768px):** Removed from main flow, appears sticky at bottom

**Save Button States:**

- **Default (unsaved):** `variant="inverse" size="lg"` + `<BookmarkSimple size={20} />`
- **Hover (unsaved):** `bg-[var(--button-inverse-background-hover)]` (green-100)
- **Saved:** `variant="secondary"` + `bg-[var(--primitive-green-200)] text-[var(--primitive-green-700)]` + `<CheckCircle size={20} weight="fill" />`
- **Saving:** `disabled opacity-75` + pulse animation
- **Error:** Revert to previous state (unsaved or saved)

---

### b) Sidebar Tab Bar

**Component:** `TabsListUnderline` + `TabsTriggerUnderline`

```tsx
<Tabs defaultValue="details">
  <TabsListUnderline className="w-full border-b border-[var(--border-muted)]">
    <TabsTriggerUnderline value="details" className="flex-1">
      Job Details
    </TabsTriggerUnderline>
    <TabsTriggerUnderline value="notes" className="flex-1">
      Your Notes
    </TabsTriggerUnderline>
  </TabsListUnderline>

  <TabsContent value="details" className="mt-0 space-y-6" />
  <TabsContent value="notes" className="mt-4" />
</Tabs>
```

**States:**

- **Active:** Text bold + underline `border-b-2 border-[var(--foreground-default)]`
- **Inactive:** Normal weight, no underline
- **Hover:** Text color change to `var(--foreground-muted)`

---

### c) Apply Before Card

**Container:**

```
Card className="rounded-2xl border-[var(--primitive-neutral-200)]"
CardContent className="flex items-center justify-between px-6 py-4"
```

**Content Layout:**

```tsx
<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="flex items-center justify-between px-6 py-4">
    <div className="flex flex-col gap-1">
      <span className="text-sm font-bold text-[var(--foreground-default)]">Apply Before:</span>
      <span className="text-body text-[var(--foreground-default)]">{formatDate(job.closesAt)}</span>
    </div>
    {isClosingSoon(job.closesAt) && (
      <Badge variant="warning" className="shrink-0">
        Closing Soon
      </Badge>
    )}
  </CardContent>
</Card>
```

**Date Format:** `"February 25, 2026"`

**Badge Token Mapping:** `variant="warning"` → `bg-[var(--badge-warning-background)]` (orange-100) + `text-[var(--badge-warning-foreground)]` (orange-700)

**States:**

- **With date + closing soon:** Full display with warning badge
- **With date, not closing:** Text only, no badge
- **Without date (null):** Card hidden entirely
- **Past deadline:** "Application Closed" badge + Apply button disabled

---

### d) Recruiter Card

**Container:**

```
Card className="rounded-2xl border-[var(--primitive-neutral-200)]"
CardContent className="flex flex-col gap-4 p-6"
```

**Content Layout:**

```tsx
<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="flex flex-col gap-4 p-6">
    <div className="flex items-center gap-3">
      <Avatar size="lg" src={recruiter.avatarUrl} name={recruiter.name} className="shrink-0" />
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
      Contact
    </Button>
  </CardContent>
</Card>
```

**Avatar:** `size="lg"` = 64×64px, circular with auto-color from name hash

**Typography:**

- Name: `text-body font-normal text-[var(--foreground-default)]` (18px)
- Title: `text-sm text-[var(--foreground-subtle)]` (14px)

**Button States:**

- **Default:** `variant="tertiary"` → `bg-[var(--button-tertiary-background)]` (neutral-200)
- **Hover:** `bg-[var(--button-tertiary-background-hover)]` (neutral-300)
- **Focus:** `focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2`

**Hidden State:** Entire card removed from DOM when `recruiter === null`

---

### e) Highlights Card

**Card Header Pattern:**

```tsx
<div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-100)] px-6 py-4">
  <CalendarStar size={24} weight="duotone" className="text-[var(--foreground-default)]" />
  <span className="text-body font-bold text-[var(--foreground-default)]">Highlights</span>
</div>
```

**Row Structure:**

```tsx
<div className="flex items-center justify-between gap-2 border-b border-[var(--primitive-neutral-100)] px-6 py-4">
  <span className="text-sm text-[var(--foreground-default)]">Salary</span>
  <InfoTag label={formatSalary(min, max, currency)} />
</div>
```

**InfoTag Spec:**

- Background: `bg-[var(--tag-info-background)]` (neutral-200)
- Text: `text-sm text-[var(--tag-info-foreground)]` (neutral-700)
- Padding: `px-2 py-1`
- Border radius: `rounded-lg`

**Rows Included:**

| Row | Label                | Value                                    | Hidden If                                |
| --- | -------------------- | ---------------------------------------- | ---------------------------------------- |
| 1   | Salary               | InfoTag with `formatSalary()`            | salaryMin === null && salaryMax === null |
| 2   | Education            | InfoTag for each cert in `requiredCerts` | `requiredCerts.length === 0`             |
| 3   | Special Requirements | InfoTag with `impactDescription`         | `impactDescription === null`             |

**Date Format:** `"$120,000 - $150,000 USD"`
**Education:** `"Bachelor's Degree"`, `"Environmental Science Certificate"`
**Special Requirements:** Text from `job.impactDescription` (e.g., "Climate tech focus required")

---

### f) Role Overview Card

**Card Header Pattern:**

```tsx
<div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-100)] px-6 py-4">
  <Briefcase size={24} weight="duotone" className="text-[var(--foreground-default)]" />
  <span className="text-body font-bold text-[var(--foreground-default)]">Role Overview</span>
</div>
```

**Rows:**

```tsx
// Job Type Row
<div className="px-6 py-4 border-b border-[var(--primitive-neutral-100)] flex items-start justify-between gap-2">
  <span className="text-sm text-[var(--foreground-default)]">Job Type</span>
  <CategoryTag
    category={job.climateCategory}
    variant="Truncate"
    className="bg-[var(--tag-category-background)]"
  />
</div>

// Level Row
<div className="px-6 py-4 border-b border-[var(--primitive-neutral-100)] flex items-center justify-between gap-2">
  <span className="text-sm text-[var(--foreground-default)]">Level</span>
  <InfoTag label={getExperienceLevelLabel(job.experienceLevel)} />
</div>

// Location Row (split by comma)
<div className="px-6 py-4 border-b border-[var(--primitive-neutral-100)] flex items-start justify-between gap-2">
  <span className="text-sm text-[var(--foreground-default)]">Location</span>
  <div className="flex flex-wrap gap-2 justify-end">
    {job.location?.split(", ").map(part => (
      <InfoTag key={part} label={part} />
    ))}
  </div>
</div>

// Workplace Row
<div className="px-6 py-4 flex items-center justify-between gap-2">
  <span className="text-sm text-[var(--foreground-default)]">Workplace</span>
  <InfoTag label={getLocationTypeLabel(job.locationType)} />
</div>
```

**CategoryTag:** 15 categories max, maps `climateCategory` to defined job type, `bg-[var(--tag-category-background)]`

**InfoTag for all non-category values:** Same spec as Highlights card

**Row Separator:** `border-b border-[var(--primitive-neutral-100)]` (no separator on last row)

---

### g) About Company Card

**Container:**

```
Card className="rounded-2xl border-[var(--primitive-neutral-200)]"
CardContent className="flex flex-col gap-4 p-6"
```

**Content Layout:**

```tsx
<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="flex flex-col gap-4 p-6">
    <Avatar
      size="xl"
      src={organization.logo}
      name={organization.name}
      className="self-center rounded-2xl"
    />
    <div className="flex flex-col gap-2">
      <h3 className="text-body-strong font-bold text-[var(--foreground-default)]">
        {organization.name}
      </h3>
      <p className="line-clamp-3 text-sm text-[var(--foreground-muted)]">
        {organization.description}
      </p>
    </div>
    <Button
      variant="tertiary"
      className="w-full"
      onClick={() => (window.location.href = `/company/${organization.slug}`)}
    >
      Read More
    </Button>
  </CardContent>
</Card>
```

**Avatar:**

- Size: `size="xl"` = 96×96px
- Radius override: `rounded-2xl` (16px, square with large radius vs. circular default)

**Description:** `line-clamp-3` (max 3 lines, truncate with ellipsis)

**Button:** `variant="tertiary"` → `bg-[var(--button-tertiary-background)]` (neutral-200), `w-full`

---

### h) Job Description (Left Column)

**Container:**

```
Card className="flex-1 rounded-2xl border-[var(--primitive-neutral-200)]"
CardContent className="p-6"
```

**Prose Typography Overrides (Tailwind CSS):**

```css
.prose.prose-lg.max-w-none.text-[var(--foreground-default)] [&_h1] {
  @apply text-heading-sm font-bold tracking-tight;
}
[&_h2] {
  @apply text-heading-sm font-bold tracking-tight;
}
[&_h3] {
  @apply text-body-strong font-bold uppercase tracking-wide;
}
[&_p] {
  @apply text-body leading-relaxed;
}
[&_ul] {
  @apply space-y-1 pl-5;
}
[&_li] {
  @apply text-body leading-relaxed;
}
```

**Applied as JSX:**

```tsx
<Card className="flex-1 rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="prose prose-lg max-w-none p-6 text-[var(--foreground-default)] [&_h1]:text-heading-sm [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:text-heading-sm [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:text-body-strong [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_li]:text-body [&_li]:leading-relaxed [&_p]:text-body [&_p]:leading-relaxed [&_ul]:space-y-1 [&_ul]:pl-5">
    <div dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }} />
  </CardContent>
</Card>
```

**Typography Mapping:**

| Element | Classes                                              | Size | Line Height | Weight          |
| ------- | ---------------------------------------------------- | ---- | ----------- | --------------- |
| h1      | `text-heading-sm font-bold tracking-tight`           | 24px | 32px        | 700             |
| h2      | `text-heading-sm font-bold tracking-tight`           | 24px | 32px        | 700             |
| h3      | `text-body-strong font-bold uppercase tracking-wide` | 18px | 24px        | 700 + uppercase |
| p       | `text-body leading-relaxed`                          | 18px | 28px        | 400             |
| ul      | `space-y-1 pl-5`                                     | —    | —           | —               |
| li      | `text-body leading-relaxed`                          | 18px | 24px        | 400             |

---

### i) Explore More Jobs

**Section Container:**

```
bg-[var(--background-subtle)]
px-12 py-6
```

**Section Heading:**

```tsx
<h2 className="mb-4 text-body font-bold text-[var(--foreground-default)]">Explore More Jobs</h2>
```

**Job Cards Layout:**

```tsx
<div className="space-y-4">
  {similarJobs.map((job) => (
    <JobPostCard
      key={job.id}
      companyName={job.organization.name}
      companyLogo={job.organization.logo}
      jobTitle={job.title}
      pathway={job.climateCategory?.toLowerCase().replace(/\s+/g, "-")}
      status={getJobStatus({
        organization: job.organization,
        isBipocOwned: job.organization.isBipocOwned,
      })}
      tags={[getLocationTypeLabel(job.locationType), getEmploymentTypeLabel(job.employmentType)]}
      size="full"
      onViewJob={() => (window.location.href = `/jobs/search/${job.id}`)}
    />
  ))}
</div>
```

**Spacing:**

- Section gap: `space-y-4` (16px between cards)
- Card size: `size="full"` (full width)
- Height: Auto, card determines height

**Hidden:** Entire section removed if `similarJobs.length === 0`

---

### j) Notes Editor (Your Notes Tab)

**Container:**

```
Card className="rounded-2xl border-[var(--primitive-neutral-200)]"
CardContent className="p-6"
```

**Textarea Structure:**

```tsx
<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="flex flex-col gap-2 p-6">
    <label htmlFor="job-notes" className="sr-only">
      Your notes for this job
    </label>
    <Textarea
      id="job-notes"
      variant="default"
      value={notes}
      onChange={(e) => {
        setNotes(e.target.value);
        debouncedSave(e.target.value); // 1s debounce
      }}
      placeholder="Add your notes about this position..."
      className="min-h-[120px]"
    />

    {/* Save Status Indicators */}
    {saveStatus === "saving" && (
      <span className="text-caption text-[var(--foreground-subtle)]">Saving...</span>
    )}
    {saveStatus === "saved" && (
      <span className="text-caption text-[var(--foreground-brand)]">✓ Saved</span>
    )}
    {saveStatus === "error" && (
      <span className="text-caption text-[var(--foreground-error)]">Failed to save</span>
    )}
  </CardContent>
</Card>
```

**Textarea Props:**

- `variant="default"` (standard input styling)
- `min-h-[120px]` (minimum height, grows with content)
- `placeholder="Add your notes about this position..."`

**Save Status Styles:**

- **Saving:** `text-caption text-[var(--foreground-subtle)]` (gray-600)
- **Saved:** `text-caption text-[var(--foreground-brand)]` (green-700)
- **Error:** `text-caption text-[var(--foreground-error)]` (red-700)

**Auto-save Behavior:**

1. User types → 1s debounce starts
2. Auto-save calls `PATCH /api/jobs/{id}/notes` with `{ content: value }`
3. If job not saved, first calls `POST /api/jobs/{id}/save`
4. Shows "Saving..." state during request
5. Shows "Saved" on success with 3s auto-hide
6. Shows "Failed to save" on error with no auto-hide

---

## 3. Interactive States

### Save Button States

**Structure:**

```tsx
<button
  onClick={handleSaveToggle}
  aria-pressed={isSaved}
  className={cn(
    "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
    isSaved
      ? "bg-[var(--primitive-green-200)] text-[var(--primitive-green-700)]"
      : "bg-[var(--button-inverse-background)] text-[var(--foreground-default)] hover:bg-[var(--button-inverse-background-hover)]",
    isLoading && "cursor-not-allowed opacity-75"
  )}
  disabled={isLoading}
>
  {isSaved ? <CheckCircle size={20} weight="fill" /> : <BookmarkSimple size={20} />}
</button>
```

**State Matrix:**

| State   | Saved   | Icon                      | BG                                                   | Text                         | Cursor      |
| ------- | ------- | ------------------------- | ---------------------------------------------------- | ---------------------------- | ----------- |
| Default | No      | BookmarkSimple            | `var(--button-inverse-background)` (white)           | `var(--foreground-default)`  | pointer     |
| Hover   | No      | BookmarkSimple            | `var(--button-inverse-background-hover)` (green-100) | `var(--foreground-default)`  | pointer     |
| Pressed | No      | BookmarkSimple            | Same as hover                                        | Same as hover                | pointer     |
| Default | Yes     | CheckCircle fill          | `var(--primitive-green-200)`                         | `var(--primitive-green-700)` | pointer     |
| Hover   | Yes     | CheckCircle fill          | `var(--primitive-green-100)`                         | `var(--primitive-green-700)` | pointer     |
| Saving  | —       | Spinner or BookmarkSimple | Same as current                                      | opacity-75                   | not-allowed |
| Error   | Reverts | —                         | Reverts                                              | Reverts                      | Reverts     |

### Contact (Recruiter) Button States

| State   | Classes                     | BG                                                       | Text                        |
| ------- | --------------------------- | -------------------------------------------------------- | --------------------------- |
| Default | `variant="tertiary" w-full` | `var(--button-tertiary-background)` (neutral-200)        | `var(--foreground-default)` |
| Hover   | (auto via variant)          | `var(--button-tertiary-background-hover)` (neutral-300)  | `var(--foreground-default)` |
| Focus   | `focus-visible:ring-2`      | Same as default                                          | Same as default             |
| Active  | (auto)                      | `var(--button-tertiary-background-active)` (neutral-400) | `var(--foreground-default)` |

### Tab Trigger States

| State    | Text                               | Underline                                       | Weight              |
| -------- | ---------------------------------- | ----------------------------------------------- | ------------------- |
| Active   | `text-[var(--foreground-default)]` | `border-b-2 border-[var(--foreground-default)]` | `font-bold` (600)   |
| Inactive | `text-[var(--foreground-muted)]`   | None                                            | `font-normal` (400) |
| Hover    | `text-[var(--foreground-default)]` | None until active                               | `font-normal`       |

### Related Job Card States

| State   | Card                                                          | Shadow               |
| ------- | ------------------------------------------------------------- | -------------------- |
| Default | `shadow-[var(--shadow-card)]`                                 | Standard card shadow |
| Hover   | `shadow-[var(--shadow-card-hover)]` + `cursor-pointer`        | Elevated shadow      |
| Focus   | `focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2` | —                    |

---

## 4. Responsive Breakpoints

### Desktop (≥1024px)

**Layout:**

```
Two-column flex:
  display: flex
  gap: 6 (24px)
  px-12 (48px)
  py-6 (24px)

Left column:  flex-1
Right column: w-[350px] shrink-0
```

**Header:**

- Inline CTAs: `[Apply Now]` and `[Save]` buttons side-by-side
- Logo size: `xs` (24px)

**Sidebar Cards Stacking:**

- `space-y-6` (24px gap between cards)
- Card width: 100% of 350px container

### Tablet (768–1023px)

**Layout:**

```
Two-column flex:
  display: flex
  gap: 6 (24px)
  px-8 (32px)
  py-4 (16px)

Left column:  flex-1
Right column: w-[300px] shrink-0
```

**Changes:**

- Sidebar width narrowed to `w-[300px]`
- Padding reduced to `px-8 py-4`
- Same header layout (inline CTAs)

### Mobile (<768px)

**Layout:**

```
Single column flex-col:
  display: flex
  flex-direction: column
  gap: 4 (16px)
  px-4 (16px)
  py-4 (16px)
  pb-24 (account for sticky bar)
```

**Header:**

- Removed from normal flow
- Reappears as sticky bottom CTA bar (see below)

**Sidebar:**

- Stacks below description
- Full width (`w-full`)
- Same card spacing

**Sticky Bottom CTA Bar (Mobile Only):**

```tsx
<div className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] flex gap-3 border-t border-[var(--border-muted)] bg-[var(--background-default)] px-4 py-3 shadow-[var(--shadow-elevated)]">
  <Button variant="primary" size="lg" className="flex-1">
    Apply Now
  </Button>
  <SaveButton size="lg" />
</div>
```

**Specs:**

- `position: fixed`
- `bottom: 0 left: 0 right: 0`
- `z-index: var(--z-sticky)` (1020)
- `bg-[var(--background-default)]` (white)
- `border-t border-[var(--border-muted)]`
- `px-4 py-3` (16px horizontal, 12px vertical)
- `flex gap-3` (12px gap)
- `shadow-[var(--shadow-elevated)]` (elevated shadow for depth)
- Apply button: `flex-1` (grows to fill space)
- Save button: fixed width or shrink-0

**Body Adjustment:** Page content area `pb-24` to prevent content hidden behind bar

---

## 5. Spacing Reference Map

| Usage                       | Desktop                              | Tablet      | Mobile      | Tailwind Class           |
| --------------------------- | ------------------------------------ | ----------- | ----------- | ------------------------ |
| **Page Gutters**            | 48px                                 | 32px        | 16px        | `px-12 md:px-8 sm:px-4`  |
| **Page Vertical**           | 24px                                 | 16px        | 16px        | `py-6 md:py-4 sm:py-4`   |
| **Column Gap**              | 24px                                 | 24px        | 16px        | `gap-6 sm:gap-4`         |
| **Card Padding**            | 24px                                 | 24px        | 24px        | `p-6`                    |
| **Card Stacking**           | 24px                                 | 24px        | 16px        | `space-y-6 sm:space-y-4` |
| **Row Padding (h)**         | 24px                                 | 24px        | 24px        | `px-6`                   |
| **Row Padding (v)**         | 16px (4py, 0pt)                      | 16px        | 16px        | `py-4 pt-0` (first row)  |
| **Row Separator Gap**       | 12px bottom                          | 12px bottom | 12px bottom | `pb-3 border-b`          |
| **Inner Element Gap**       | 8px                                  | 8px         | 8px         | `gap-2`                  |
| **Inner Element Gap (Med)** | 12px                                 | 12px        | 12px        | `gap-3`                  |
| **Inner Element Gap (Lg)**  | 16px                                 | 16px        | 16px        | `gap-4`                  |
| **Header Logo Gap**         | 16px                                 | 16px        | 12px        | `gap-4 sm:gap-3`         |
| **Tab Content Gap**         | 0 (mt-0 for details, mt-4 for notes) | 0, 16px     | 0, 16px     | `mt-0 sm:mt-4`           |
| **Sticky Bar Padding**      | —                                    | —           | 12px (py-3) | `py-3`                   |
| **Sticky Bar Gap**          | —                                    | —           | 12px        | `gap-3`                  |

---

## 6. Typography Reference Map

| Usage                     | Classes                                                        | Tailwind Tokens | Size | Weight | Line Height |
| ------------------------- | -------------------------------------------------------------- | --------------- | ---- | ------ | ----------- |
| **Job Title (Header)**    | `text-heading-sm font-medium text-[var(--foreground-default)]` | —               | 24px | 500    | 32px        |
| **Company Name (Header)** | `text-body text-[var(--foreground-default)]`                   | —               | 18px | 400    | 24px        |
| **Card Headers**          | `text-body font-bold text-[var(--foreground-default)]`         | —               | 18px | 700    | 24px        |
| **Card Labels**           | `text-sm text-[var(--foreground-default)]`                     | —               | 14px | 400    | 20px        |
| **Card Labels Bold**      | `text-sm font-bold text-[var(--foreground-default)]`           | —               | 14px | 700    | 20px        |
| **Recruiter Name**        | `text-body font-normal text-[var(--foreground-default)]`       | —               | 18px | 400    | 24px        |
| **Recruiter Title**       | `text-sm text-[var(--foreground-subtle)]`                      | —               | 14px | 400    | 20px        |
| **Muted Text**            | `text-sm text-[var(--foreground-muted)]`                       | —               | 14px | 400    | 20px        |
| **Subtle Text**           | `text-sm text-[var(--foreground-subtle)]`                      | —               | 14px | 400    | 20px        |
| **Prose h1**              | `text-heading-sm font-bold tracking-tight`                     | —               | 24px | 700    | 32px        |
| **Prose h2**              | `text-heading-sm font-bold tracking-tight`                     | —               | 24px | 700    | 32px        |
| **Prose h3**              | `text-body-strong font-bold uppercase tracking-wide`           | —               | 18px | 700    | 24px        |
| **Prose p**               | `text-body leading-relaxed`                                    | —               | 18px | 400    | 28px        |
| **Prose li**              | `text-body leading-relaxed`                                    | —               | 18px | 400    | 24px        |
| **Section Heading**       | `text-body font-bold text-[var(--foreground-default)]`         | —               | 18px | 700    | 24px        |
| **Caption**               | `text-caption text-[var(--foreground-subtle)]`                 | —               | 14px | 400    | 20px        |
| **Save Status Saving**    | `text-caption text-[var(--foreground-subtle)]`                 | —               | 14px | 400    | 20px        |
| **Save Status Saved**     | `text-caption text-[var(--foreground-brand)]`                  | —               | 14px | 400    | 20px        |
| **Save Status Error**     | `text-caption text-[var(--foreground-error)]`                  | —               | 14px | 400    | 20px        |
| **Tab Trigger Active**    | `text-body font-bold`                                          | —               | 18px | 700    | 24px        |
| **Tab Trigger Inactive**  | `text-body font-normal`                                        | —               | 18px | 400    | 24px        |

---

## 7. Color Reference Map

**All colors use CSS variable tokens. Zero hardcoded hex values.**

### Backgrounds

| Element               | Token                                     | Value                 | Dark Mode     |
| --------------------- | ----------------------------------------- | --------------------- | ------------- |
| Page background       | `var(--background-subtle)`                | #FAF9F7 (neutral-100) | Auto-switches |
| Cards/Header          | `var(--background-default)`               | #FFFFFF               | Auto-switches |
| Button (saved)        | `var(--primitive-green-200)`              | #DCFAC8               | Auto-switches |
| Button inverse hover  | `var(--button-inverse-background-hover)`  | green-100             | Auto-switches |
| Button tertiary       | `var(--button-tertiary-background)`       | neutral-200           | Auto-switches |
| Button tertiary hover | `var(--button-tertiary-background-hover)` | neutral-300           | Auto-switches |
| InfoTag               | `var(--tag-info-background)`              | neutral-200           | Auto-switches |
| CategoryTag           | `var(--tag-category-background)`          | neutral-200           | Auto-switches |
| Badge warning         | `var(--badge-warning-background)`         | orange-100            | Auto-switches |

### Text Colors

| Element             | Token                             | Value                 |
| ------------------- | --------------------------------- | --------------------- |
| Primary text        | `var(--foreground-default)`       | #1F1D1C (neutral-800) |
| Secondary text      | `var(--foreground-muted)`         | #3D3A37 (neutral-700) |
| Tertiary text       | `var(--foreground-subtle)`        | #7A7671 (neutral-600) |
| Saved indicator     | `var(--foreground-brand)`         | green-700             |
| Error text          | `var(--foreground-error)`         | red-600               |
| Button (saved) text | `var(--primitive-green-700)`      | #0E5249               |
| Badge warning text  | `var(--badge-warning-foreground)` | orange-700            |

### Borders

| Element        | Token                          | Value                 |
| -------------- | ------------------------------ | --------------------- |
| Header bottom  | `var(--border-muted)`          | #E5DFD8 (neutral-300) |
| Card borders   | `var(--primitive-neutral-200)` | #F2EDE9               |
| Row separators | `var(--primitive-neutral-100)` | #FAF9F7 (neutral-100) |

### Focus/Interactive

| Element          | Token                     | Value    |
| ---------------- | ------------------------- | -------- |
| Focus ring       | `var(--ring-color)`       | blue-500 |
| Error focus ring | `var(--ring-color-error)` | red-500  |

---

## 8. Icon Reference

**All icons are Phosphor Icons. No other icon library.**

| Icon             | Import                         | Props                        | Usage                       |
| ---------------- | ------------------------------ | ---------------------------- | --------------------------- |
| `BookmarkSimple` | `from "@phosphor-icons/react"` | `size={20}`                  | Save button (unsaved state) |
| `CheckCircle`    | `from "@phosphor-icons/react"` | `size={20} weight="fill"`    | Save button (saved state)   |
| `CalendarStar`   | `from "@phosphor-icons/react"` | `size={24} weight="duotone"` | Highlights card header      |
| `Briefcase`      | `from "@phosphor-icons/react"` | `size={24} weight="duotone"` | Role Overview card header   |

---

## 9. Loading State Specs

**Background:** `bg-[var(--background-subtle)]`

### Header Skeleton

```tsx
<div className="flex items-center gap-4 border-b border-[var(--border-muted)] bg-[var(--background-default)] px-12 py-6">
  <Skeleton className="h-6 w-6 rounded-md" />
  <Skeleton className="h-8 w-80" />
  <Skeleton className="ml-auto h-6 w-40" />
  <Skeleton className="h-12 w-32 rounded-2xl" />
  <Skeleton className="h-12 w-12 rounded-2xl" />
</div>
```

### Left Column Skeleton

```tsx
<SkeletonCard className="min-h-[600px] flex-1 space-y-4 p-6">
  <Skeleton className="h-8 w-72" />
  <Skeleton className="h-6 w-full" />
  <Skeleton className="h-6 w-full" />
  <Skeleton className="h-6 w-1/2" />
</SkeletonCard>
```

### Right Column Skeletons (Sidebar)

```tsx
<div className="w-[350px] space-y-6">
  {/* Tab Bar */}
  <Skeleton className="h-10 w-full rounded-lg" />

  {/* Apply Before Card */}
  <SkeletonCard className="h-24" />

  {/* Recruiter Card */}
  <SkeletonCard className="h-32" />

  {/* Highlights Card */}
  <SkeletonCard className="h-48" />

  {/* Role Overview Card */}
  <SkeletonCard className="h-48" />

  {/* About Company Card */}
  <SkeletonCard className="h-32" />
</div>
```

### Notes Tab Skeleton

```tsx
<Card className="rounded-2xl border-[var(--primitive-neutral-200)]">
  <CardContent className="p-6">
    <Skeleton className="h-32 w-full rounded-lg" />
  </CardContent>
</Card>
```

---

## 10. Error State Specs

**Container:**

```tsx
<div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background-subtle)] px-12 py-24">
  <h1 className="mb-2 text-heading-sm font-medium text-[var(--foreground-default)]">
    This job may have been removed
  </h1>
  <p className="mb-6 text-body text-[var(--foreground-muted)]">
    The job listing you're looking for is no longer available.
  </p>
  <Button variant="primary" onClick={() => (window.location.href = "/jobs/search")}>
    Back to Job Search
  </Button>
</div>
```

**Heading:** `text-heading-sm font-medium text-[var(--foreground-default)]`

**Body:** `text-body text-[var(--foreground-muted)]`

**CTA:** `Button variant="primary"`

---

## 11. Implementation Checklist

### Component Architecture

- [ ] `JobHeader.tsx` — Job title, company, logo, badges, CTAs
- [ ] `SidebarTabBar.tsx` — Tab container with underline variant
- [ ] `ApplyBeforeCard.tsx` — Deadline + closing soon badge
- [ ] `RecruiterCard.tsx` — Avatar, name, title, contact button
- [ ] `HighlightsCard.tsx` — Compensation, education, special reqs
- [ ] `RoleOverviewCard.tsx` — Job type, level, location, workplace
- [ ] `AboutCompanyCard.tsx` — Logo, description, read more
- [ ] `JobDescription.tsx` — Prose HTML with typography overrides
- [ ] `ExploreMoreJobs.tsx` — Similar job cards
- [ ] `NotesEditor.tsx` — Textarea with auto-save
- [ ] `SaveButton.tsx` — Client component with optimistic UI

### Token Compliance

- [ ] No hardcoded hex colors — all use `var(--*)`
- [ ] No hardcoded spacing — use Tailwind scale
- [ ] Component tokens preferred over primitives
- [ ] Semantic tokens for general UI
- [ ] CSS variables for colors, spacing, shadows

### States & Responsiveness

- [ ] Loading state with skeleton
- [ ] Error state with retry CTA
- [ ] Empty state handling (no recruiter, no jobs)
- [ ] All interactive states (hover, focus, active, disabled)
- [ ] Dark mode verified
- [ ] Mobile (<768px) responsive
- [ ] Tablet (768–1023px) responsive
- [ ] Desktop (≥1024px) responsive
- [ ] Sticky bottom CTA bar on mobile

### Accessibility

- [ ] Save button has `aria-pressed`
- [ ] Closing soon badge has `aria-label`
- [ ] Notes textarea has associated `<label>`
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works (tab, enter, escape)
- [ ] Color is not sole indicator of state

### Data & API

- [ ] Recruiter data from Organization team members
- [ ] Save toggle calls `POST/DELETE /api/jobs/{id}/save`
- [ ] Notes auto-save calls `PATCH /api/jobs/{id}/notes`
- [ ] Similar jobs fetched from `GET /api/jobs/{id}`
- [ ] Job not saved before writing notes → auto-save job first

### Testing

- [ ] Unit tests for helper functions
- [ ] Component tests for interactions
- [ ] Integration test for save flow
- [ ] E2E test for happy path (load → save → notes)

---

## 12. Key Figma Reference Points

**Figma Design File:**

- **URL:** https://www.figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=1425-24686
- **Node ID:** 1425-24686
- **Designer:** (From PRD)
- **Last Updated:** February 2026

**Critical Design Decisions to Preserve:**

- Underline tab variant (NOT pill buttons)
- Duotone icon style for card headers
- Green-800 button (not bright green)
- Trailing InfoTag placement (right-aligned in rows)
- Sticky bottom CTA bar on mobile (not inline header)
- Line-clamp-3 on company description

---

## 13. Implementation Notes

### Prose Rendering

The job description uses `dangerouslySetInnerHTML` with `formatDescription()` helper. **Important:** Add DOMPurify sanitization before rendering to prevent XSS.

```tsx
import DOMPurify from "dompurify";

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(formatDescription(job.description)),
  }}
/>;
```

### Similar Jobs Algorithm

Multi-signal scoring: same pathway (3pts) + same locationType (2pts) + same experienceLevel (1pt) + same organization (1pt). Return top 3 by score, breaking ties by `publishedAt` (most recent first).

### Auto-save Debounce

Notes editor uses `useDebouncedCallback` with 1000ms (1s) debounce. If job not already saved, auto-save calls `POST /api/jobs/{id}/save` first, then `PATCH /api/jobs/{id}/notes`.

### Closed Applications

When `closesAt` is in the past, show "Application Closed" badge and disable Apply button. This is future work but mention in comments.

---

**This handoff is complete and ready for development. All components, tokens, and states are specified for pixel-perfect implementation.**
