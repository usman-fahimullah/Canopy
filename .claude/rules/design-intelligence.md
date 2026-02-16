# Design Intelligence — Learn Before You Build

---

## trigger: component, page, screen, layout, build, implement, design, frontend, view, dashboard, list, detail, card, table, modal, sidebar, header, form, kanban, pipeline

Before building any UI, Claude must study the existing codebase to understand how Canopy looks, feels, and works. Checklists catch mistakes after the fact — this rule prevents them by building design intuition from actual precedent.

**The principle:** A new screen should look like it was designed by the same person who designed every other screen. If it doesn't, something is wrong — and no amount of token compliance will fix it.

**The external standard:** When internal precedent doesn't cover a situation, 24 industry design principles (distilled from leading design systems) provide the quality floor. Internal patterns first, industry principles to fill gaps.

Related rules: `engineering-excellence.md` for philosophy, `critical-standards.md` for enforcement, `product-design-thinking.md` for visual hierarchy checks, `design-first-implementation.md` for component mapping workflow.

---

## The Mandate: Study Before Building

**Before writing ANY JSX for a new screen, Claude must:**

1. **Identify the page type** — What kind of screen is this?
2. **Find the closest existing precedent** — What existing page is most similar?
3. **Read that precedent file** — Study its composition, not just glance at it
4. **Read the relevant UI components** — Understand how they're built, not just their API
5. **Match the patterns** — Build from the same composition approach

**🛑 If you skip this and build from scratch, the result WILL look different from the rest of the app.** That inconsistency is a design failure.

---

## Quality-Rated Precedent Registry

Not all existing pages are equal. Some are gold standard — study and copy them. Others have rough edges — learn from them but don't replicate their shortcuts. **Always use GOLD pages as your reference, even if a ROUGH page is closer to what you're building.**

### 🏆 GOLD — Exemplary Precedent (Study and Copy These)

| File                                                   | Page Type      | Why It's Gold                                                                                                                                                                                              | Study For                                                              |
| ------------------------------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/app/canopy/dashboard/DashboardView.tsx`           | Dashboard      | Zero raw HTML. Comprehensive token usage. Sophisticated spacing rhythm (gap-6 major, gap-3 items, space-y-3 vertical). 3-level typography hierarchy. Proper card patterns (shadow-card, no shadow+border). | Spacing rhythm, token usage, section composition, card patterns        |
| `src/app/canopy/candidates/page.tsx`                   | List (server)  | All filters in URL searchParams (shareable, back-button safe). Auth + fetch + error fallback pattern. Promise.all for parallel queries. Graceful EmptyStateError fallback.                                 | Server component pattern, URL state, error handling                    |
| `src/components/candidates/CandidatesView.tsx`         | List (client)  | All 4 states (loading skeleton, empty with CTA, error with retry, populated). Bulk action bar with "8 of 10" partial success. TruncateText with min-w-0 safety. Design system components exclusively.      | Complex state management, bulk actions, filter bar pattern, all states |
| `src/components/candidates/CandidateProfileHeader.tsx` | Profile header | Semantic tokens throughout. Avatar with hover-reveal edit button (opacity-0→100). min-w-0 truncation safety. Phosphor icons correct weight/size. aria-label on interactive elements.                       | Profile layout, hover interactions, truncation safety, accessibility   |
| `src/components/candidates/AboutSection.tsx`           | Detail section | Semantic HTML (dl/dt/dd). InfoRow subcomponent extraction. @figma link in code. Border-only containers (no shadow+border). Conditional rendering for optional fields.                                      | Section composition, subcomponent extraction, semantic HTML            |

### ✅ GOOD — Solid Implementation (Use if closer to your need, but check against GOLD patterns)

| File                                       | Page Type           | What's Good                                                                                                             | What's Rough                                                                                                 |
| ------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/app/canopy/roles/RolesView.tsx`       | List with substates | Multiple substates well-handled (empty hero, template promo, populated). Responsive grid. Good subcomponent extraction. | Some primitive tokens where semantic would be better (primitive-blue-100). Icon sizes slightly inconsistent. |
| `src/app/canopy/settings/company/page.tsx` | Settings/form       | Dual mode (view/edit) handled cleanly. FormCard/FormSection/FormField pattern. Toast feedback. Skeleton loading.        | Some sections could tighten spacing. Definition list labels could use text-body.                             |

### 🚩 ROUGH — Do NOT Use as Precedent (Has patterns to avoid)

| File                                          | What's Wrong                                                                       | Lesson to Learn                                                                                   |
| --------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/components/candidates/ActivityPanel.tsx` | 21-line lazy wrapper. No state handling. No loading/empty/error. No documentation. | Every component needs all states, even thin wrappers. If a wrapper adds no value, consolidate it. |
| Any file with hardcoded hex colors            | Breaks dark mode, drifts from design system                                        | Always check: does this file use tokens or hardcode values? Don't copy the hardcoded ones.        |
| Any file with uniform `space-y-4` everywhere  | No visual grouping, flat hierarchy                                                 | Spacing should vary: tight within groups, loose between groups. Uniform spacing = no design.      |

### How to Use This Registry

```
1. Identify your page type (list, dashboard, detail, settings, form)
2. Find the GOLD precedent for that type (table above)
3. READ the GOLD file — not skim, READ the JSX structure
4. If no GOLD exists for your exact type, use the closest GOLD + check GOOD pages
5. NEVER use ROUGH pages as precedent — even if they're closer to what you're building
6. When in doubt, match DashboardView.tsx — it demonstrates every pattern well
```

---

## Page Type Reference Library

Every screen in Canopy falls into one of these types. Before building, identify which type and study its precedent.

### Type 1: List Page (Scanning)

**Precedent:** `src/app/canopy/candidates/page.tsx` + `CandidatesView`

**Composition pattern:**

```
Server Component (auth + data fetch + URL params)
  └─ Client View Component
       ├─ Page Header (title + primary action button)
       ├─ Filter Bar (SearchInput + Dropdown filters + clear button)
       ├─ Data Display (DataTable or card grid)
       │   ├─ Loading: Skeleton rows matching table shape
       │   ├─ Empty: EmptyState with guidance + CTA
       │   ├─ Error: ErrorState with retry
       │   └─ Populated: DataTable with columns
       ├─ Pagination (SimplePagination or Pagination)
       └─ Detail Sheet (Sheet overlay for preview, keeps list visible)
```

**What to match:**

- URL params for ALL view state (skip, take, search, filters, sort)
- Server Component fetches → passes `initialData` to client
- Filter bar is a horizontal flex row with consistent gap-4
- Primary action (create) is top-right
- Detail opens as Sheet overlay, not a separate page

### Type 2: Dashboard Page (Monitoring)

**Precedent:** `src/app/canopy/dashboard/page.tsx` + `DashboardView`

**Composition pattern:**

```
Server Component (auth + data fetch)
  └─ Client View Component
       ├─ Hero Section (greeting + primary metrics)
       ├─ Stat Cards Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
       ├─ Action Items Section (urgent tasks, pending reviews)
       └─ Activity Feed (recent changes, timeline)
```

**What to match:**

- Stats use `StatCard` or `MiniStat` components — never custom divs
- Metrics are glanceable — large number + label + trend indicator
- Card grid uses responsive breakpoints consistently
- Color usage restrained — neutrals + one accent for alerts

### Type 3: Detail Page (Reading + Acting)

**Precedent:** `src/components/candidates/CandidatePreviewSheet.tsx`

**Composition pattern:**

```
Sheet or Page Container
  ├─ Profile Header (avatar + name + key metadata)
  ├─ Tab Navigation (profile, documents, activity, etc.)
  ├─ Tab Content
  │   ├─ Sections grouped by Cards
  │   ├─ Each section: heading + content + optional actions
  │   └─ Related data in sidebar or secondary tabs
  ├─ Action Bar (primary action + dropdown for secondary)
  └─ Modals for secondary workflows (scheduling, offers, etc.)
```

**What to match:**

- Section-based organization — each Card handles one concern
- Dividers between sections within a Card
- Tab navigation for switching between aspects
- Actions contained in dropdown menus (not scattered buttons)
- Sub-components per section to keep files manageable

### Type 4: Settings Page (Acting)

**Precedent:** `src/app/canopy/settings/`

**Composition pattern:**

```
Settings Layout (sidebar nav + content)
  ├─ Settings Sidebar (category links)
  └─ Settings Content
       ├─ Page Title + Description
       ├─ Form Sections (Card wrapped)
       │   ├─ Section Heading (text-heading-sm)
       │   ├─ Form Fields (space-y-4 within section)
       │   ├─ Divider between sections
       │   └─ Save Button at bottom of card
       └─ Danger Zone (destructive actions, separated)
```

**What to match:**

- One primary save action per form section
- Field labels always above inputs (not inline)
- Destructive actions in their own card at bottom, visually separated
- Tab or sidebar navigation between setting categories

### Type 5: Form/Create Page (Acting)

**Composition pattern:**

```
Page Container (max-width constrained)
  ├─ Page Header (title + cancel link)
  ├─ Form Card
  │   ├─ Section 1 Heading + Fields (space-y-4)
  │   ├─ Divider
  │   ├─ Section 2 Heading + Fields
  │   └─ Footer (primary save + secondary cancel)
  └─ beforeunload warning on dirty state
```

**What to match:**

- Max-width container for readability (not full-width)
- Clear section breaks with headings
- Primary action (save) right-aligned in footer
- Cancel returns to previous context, not root
- Dirty form warning on navigation

---

## Component Study Protocol

When building a screen that uses a specific component, **read the component source file first** — not just the documentation.

### What to Look For in Component Source

| What to Study            | Why                                                    | Where to Find                                |
| ------------------------ | ------------------------------------------------------ | -------------------------------------------- |
| **Available variants**   | So you pick the right one, not the closest             | CVA `variants` object or prop type           |
| **Default props**        | So your usage matches the intended defaults            | Destructuring defaults in function signature |
| **Internal composition** | So you understand what the component renders           | The JSX return                               |
| **ClassName patterns**   | So you see what tokens are used                        | The Tailwind classes applied                 |
| **Available sizes**      | So you don't use an unsupported size                   | CVA `size` variants                          |
| **State handling**       | So you know what states it handles vs. what you handle | Loading, error, disabled props               |

### Priority Components to Study

Before building any screen, scan these files to refresh your understanding:

| Component     | File                                 | Study For                                       |
| ------------- | ------------------------------------ | ----------------------------------------------- |
| `Button`      | `src/components/ui/button.tsx`       | Variant names, sizes, loading state             |
| `Card`        | `src/components/ui/card.tsx`         | Sub-components (Header, Content, Footer, Title) |
| `DataTable`   | `src/components/ui/data-table.tsx`   | Column definition pattern, sorting, selection   |
| `Input`       | `src/components/ui/input.tsx`        | Error state, size variants, prefix/suffix slots |
| `SearchInput` | `src/components/ui/search-input.tsx` | Built-in debounce, clear button                 |
| `Dropdown`    | `src/components/ui/dropdown.tsx`     | Item structure, multi-select, search            |
| `Sheet`       | `src/components/ui/sheet.tsx`        | Side, size, close behavior                      |
| `EmptyState`  | `src/components/ui/empty-state.tsx`  | Icon, title, description, action slots          |
| `Badge`       | `src/components/ui/badge.tsx`        | Variant → status color mapping                  |
| `Tabs`        | `src/components/ui/tabs.tsx`         | Pill vs underline variant, controlled usage     |
| `Skeleton`    | `src/components/ui/skeleton.tsx`     | How to shape loading states                     |
| `Avatar`      | `src/components/ui/avatar.tsx`       | Fallback behavior, sizes, group usage           |

---

## Composition Patterns — The Recurring Structures

These patterns repeat across the codebase. When you see a similar need, use the same structure — don't invent a new one.

### Pattern: Filter Bar

```tsx
<div className="flex flex-wrap items-center gap-4">
  <SearchInput placeholder="Search..." value={search} onChange={setSearch} className="w-64" />
  <Dropdown
    value={statusFilter}
    onChange={setStatusFilter}
    options={statusOptions}
    placeholder="All statuses"
  />
  <Dropdown value={sortBy} onChange={setSortBy} options={sortOptions} placeholder="Sort by" />
  {hasActiveFilters && (
    <Button variant="ghost" size="sm" onClick={clearFilters}>
      Clear filters
    </Button>
  )}
</div>
```

### Pattern: Page Header with Actions

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">{title}</h1>
    <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">{description}</p>
  </div>
  <Button variant="primary">
    <Plus size={20} className="mr-2" />
    {actionLabel}
  </Button>
</div>
```

### Pattern: Stat Cards Row

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatCard
    label="Total Candidates"
    value={stats.totalCandidates}
    trend={stats.candidateTrend}
    icon={<Users size={20} />}
  />
  {/* more StatCards */}
</div>
```

### Pattern: Content with All States

```tsx
{
  isLoading && (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

{
  error && (
    <EmptyState
      icon={<WarningCircle size={48} />}
      title="Something went wrong"
      description={error.message}
      action={<Button onClick={retry}>Try again</Button>}
    />
  );
}

{
  !isLoading && !error && data.length === 0 && (
    <EmptyState
      icon={<UserPlus size={48} />}
      title="No candidates yet"
      description="Candidates will appear here when they apply to your jobs."
      action={<Button>Post a job</Button>}
    />
  );
}

{
  !isLoading && !error && data.length > 0 && <DataTable columns={columns} data={data} />;
}
```

### Pattern: Section within Card

```tsx
<Card>
  <CardContent className="p-6">
    <div className="space-y-6">
      {/* Section 1 */}
      <div>
        <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
          Section Title
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">Section description</p>
        <div className="mt-4 space-y-4">{/* Fields or content */}</div>
      </div>

      <Divider />

      {/* Section 2 */}
      <div>
        <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
          Another Section
        </h3>
        {/* ... */}
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Spacing Rhythm — The Canopy Way

The codebase has a consistent spacing rhythm. Match it, don't guess.

| Relationship               | Spacing        | Tailwind                    | Example                                 |
| -------------------------- | -------------- | --------------------------- | --------------------------------------- |
| Label to input             | 4-8px          | `gap-1` to `gap-2`          | Label directly above Input              |
| Fields within form section | 16px           | `space-y-4`                 | Input to Input in a form                |
| Sections within a card     | 24px + Divider | `space-y-6` + `<Divider />` | "General" section to "Advanced" section |
| Cards in a grid            | 16px           | `gap-4`                     | StatCard to StatCard                    |
| Page header to content     | 24px           | `mb-6`                      | Title row to filter bar                 |
| Filter bar to data         | 24px           | `mb-6` or `mt-6`            | Filter row to DataTable                 |
| Major page sections        | 32-48px        | `space-y-8` to `space-y-12` | Stats grid to activity feed             |

**🛑 If all your spacing is `space-y-4`, you're not grouping.** Vary the spacing to communicate what's related to what.

---

## Typography Rhythm — The Canopy Way

| Element             | Class              | Weight          | Color                |
| ------------------- | ------------------ | --------------- | -------------------- |
| Page title          | `text-heading-sm`  | `font-bold`     | `foreground-default` |
| Section heading     | `text-body-strong` | `font-semibold` | `foreground-default` |
| Section description | `text-body-sm`     | `font-normal`   | `foreground-muted`   |
| Body text           | `text-body`        | `font-normal`   | `foreground-default` |
| Secondary text      | `text-body-sm`     | `font-normal`   | `foreground-muted`   |
| Labels              | `text-caption`     | `font-medium`   | `foreground-default` |
| Metadata            | `text-caption`     | `font-normal`   | `foreground-subtle`  |
| Fine print          | `text-caption-sm`  | `font-normal`   | `foreground-subtle`  |

**Rule of three:** Every screen should use at least 3 levels from this hierarchy. If all text is the same size and color, the hierarchy is broken.

---

## Icon Conventions

| Context                            | Size  | Weight               | Example                                   |
| ---------------------------------- | ----- | -------------------- | ----------------------------------------- |
| Inline with text (buttons, labels) | 16-20 | `regular`            | `<Plus size={20} />`                      |
| Table cell actions                 | 20    | `regular`            | `<PencilSimple size={20} />`              |
| Empty state illustrations          | 48    | `regular` or `light` | `<UserPlus size={48} />`                  |
| Navigation                         | 20-24 | `regular`            | `<House size={24} />`                     |
| Status indicators                  | 16    | `fill`               | `<CheckCircle size={16} weight="fill" />` |

---

## The Design Intelligence Workflow

When building a new screen, follow this exact sequence:

```
1. IDENTIFY page type (list / dashboard / detail / settings / form)
2. FIND the closest existing precedent in the codebase
3. READ the precedent file — understand its composition
4. LIST the UI components you'll need
5. READ each component's source file (not just docs)
6. COMPOSE the new screen using the same patterns
7. VERIFY spacing, typography, and color match the precedent
8. CHECK all states (loading, empty, error, populated)
```

**The test:** Put your new screen side-by-side with its precedent. If they look like they were designed by different people, go back to step 3.

---

## Anti-Patterns — Signs You Didn't Study

| What You Built                                         | What It Should Be                                   | The Problem                              |
| ------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------- |
| Custom card div with `rounded-xl border shadow-sm p-6` | `<Card><CardContent>`                               | You didn't read the Card component       |
| Button row with 4 equal-weight buttons                 | 1 primary + 1 secondary + dropdown overflow         | You didn't study the action bar pattern  |
| Full-page spinner while loading                        | Skeleton rows matching content shape                | You didn't study the loading pattern     |
| Custom filter row with styled `<select>` elements      | `<SearchInput>` + `<Dropdown>` components           | You didn't check the filter bar pattern  |
| `space-y-4` everywhere                                 | Varying spacing rhythm (tight/medium/loose)         | You didn't study the spacing conventions |
| All text same size                                     | 3+ hierarchy levels (heading/body/caption)          | You didn't study the typography rhythm   |
| Detail page as full new route                          | Sheet overlay keeping list visible                  | You didn't study the detail pattern      |
| Hardcoded responsive breakpoints                       | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern | You didn't study the responsive pattern  |

---

## Industry Design Principles

These principles are distilled from leading design systems and products. They represent the standard Canopy holds itself to — not as aspirational goals, but as the baseline quality floor. When internal precedent doesn't cover a situation, these principles fill the gap.

### Category 1: Foundational Components

These apply to every interactive element, regardless of where it appears.

| #   | Principle                        | What It Means                                                                            | Implementation                                                                                                                                                                                       | Anti-Pattern                                                                                                                                  |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Minimum Touch Target**         | Every interactive element must be at least 44×44px                                       | Buttons: `min-h-[44px] min-w-[44px]`. Icon buttons: use `size="icon"` variant (40px + padding). Clickable table rows: `h-14` minimum.                                                                | Tiny 24px icon button with no padding. Checkbox without label click area.                                                                     |
| 2   | **Visible Focus Management**     | Every focusable element has a visible, high-contrast focus ring                          | `focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2`. Never `focus:ring-0` or `outline-none` without replacement. WCAG AA requires 3:1 contrast ratio on focus indicators.                  | `outline-none` with no replacement. Border-only focus (not visible enough on colored backgrounds).                                            |
| 3   | **State Layer Consistency**      | Hover, active, and selected states use the same visual treatment system-wide             | Hover: background shift via `--*-hover` tokens. Active: deeper shift via `--*-active` tokens. Selected: brand tint via `--*-selected` tokens. All states stack predictably.                          | Hover changes border on buttons but background on cards. Selected state uses a different color system than hover.                             |
| 4   | **Button Hierarchy**             | One primary action per visible section; hierarchy communicated through variant, not size | Primary (`variant="primary"`): one per section. Secondary (`variant="secondary"`): supporting actions. Tertiary/Ghost: minor actions. Overflow: `<DropdownMenu>` for 4+ actions.                     | Three primary buttons in one toolbar. Using button size instead of variant to communicate importance.                                         |
| 5   | **Semantic Token Layering**      | Colors come from the token tier closest to their purpose                                 | Button backgrounds use `--button-*-background`. General surfaces use `--background-*`. Raw primitives (`--primitive-green-600`) only with documented justification.                                  | Using `--primitive-green-800` for a button background when `--button-primary-background` exists.                                              |
| 6   | **Content-Shaped Loading**       | Skeleton screens mirror the shape of the content they replace                            | Table loading: skeleton rows matching column widths. Card loading: skeleton matching card proportions. Profile loading: avatar circle + text rectangles. Never a centered spinner for content areas. | Full-page `<Spinner />` for a table view. Generic gray rectangles that don't match content shape.                                             |
| 7   | **Composition Over Inheritance** | Components compose via slots and children, not deep prop trees                           | Use `children` for content slots. Use render props or compound components (Card + CardHeader + CardContent) for structure. `asChild` pattern for element polymorphism.                               | Component with 15+ props trying to handle every variation. Boolean props for every visual variation (`showIcon`, `showBorder`, `showShadow`). |
| 8   | **Disabled State Convention**    | Disabled elements look inactive without losing context                                   | `opacity-50 cursor-not-allowed pointer-events-none`. Maintain layout position — disabled elements don't disappear. Provide tooltip explaining why disabled when possible.                            | Hiding disabled buttons entirely (user can't discover the feature). Using a different color for disabled instead of opacity.                  |

### Category 2: Platform Generic

These apply to layout, navigation, and information architecture across all screens.

| #   | Principle                              | What It Means                                                                     | Implementation                                                                                                                                                                                          | Anti-Pattern                                                                                                               |
| --- | -------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 9   | **Typography Scale Creates Hierarchy** | Every screen uses at least 3 levels from the type scale to communicate importance | Page title: `text-heading-sm font-bold`. Section heading: `text-body-strong font-semibold`. Body: `text-body`. Metadata: `text-caption foreground-subtle`. Minimum 3 levels per screen.                 | All text at `text-body` size. Using bold for emphasis instead of type scale.                                               |
| 10  | **Optimal Reading Width**              | Long-form text is constrained to 45-75 characters per line                        | Descriptions, cover letters, notes: `max-w-prose` (65ch). Form fields: `max-w-md` to `max-w-lg`. Full-width only for tables and grids.                                                                  | Job description text spanning 1200px on a wide monitor. Form fields stretching to full container width.                    |
| 11  | **Primary Question First**             | Every screen answers one question; that answer is the dominant visual element     | Dashboard → "What needs attention?" → action items count is largest element. Pipeline → "Who's at what stage?" → kanban board dominates. Candidate → "Right for this role?" → match score is prominent. | Dashboard where every card is the same size and weight. Detail page where the most important info requires scrolling.      |
| 12  | **Density Matches Task**               | Scanning tasks are dense; reading tasks have space; action tasks have clear CTAs  | Tables/lists: tight rows (h-12 to h-14), data-forward. Descriptions/bios: generous padding, limited width. Forms: clear field grouping, one CTA.                                                        | Spacious card layout for a list of 200 candidates. Dense table for a single job description.                               |
| 13  | **Progressive Disclosure**             | Complexity reveals in layers; most users never need layer 3                       | Level 1 (visible): essential info answering the screen's primary question. Level 2 (hover/click): supporting detail, quick actions. Level 3 (navigation): full depth, all history.                      | Showing all 15 candidate fields on the list view card. Requiring 3 clicks to see the candidate's name.                     |
| 14  | **Keyboard Navigation First**          | Every workflow can be completed without a mouse                                   | Tab order follows visual order. Enter/Space activates. Escape closes/cancels. Arrow keys navigate within component groups. Focus trap in modals. Skip links for repeated navigation.                    | Modal without focus trap. Drag-and-drop without keyboard alternative. Custom dropdown that can't be navigated with arrows. |
| 15  | **Navigation Item Limits**             | Sidebar and tab bars have cognitive load limits                                   | Sidebar: max 7 top-level items; group into collapsible categories beyond that. Tabs: max 6; overflow scroll for more. Filter options: max 7 visible; "More filters" for additional.                     | 12 ungrouped sidebar links. 9 tabs in a single row.                                                                        |
| 16  | **Filter UI Conventions**              | Filters are discoverable, clearable, and show active count                        | Horizontal row with `<SearchInput>` + `<Dropdown>` filters. Active filter count badge. "Clear all" button when any filter is active. URL state for all filters (shareable, back-button safe).           | Filters hidden behind a toggle. No way to clear all filters at once. Filter state lost on page refresh.                    |

### Category 3: Feature-Specific (ATS/Recruitment)

These apply to patterns unique to applicant tracking, recruitment, and talent management workflows.

| #   | Principle                   | What It Means                                                                    | Implementation                                                                                                                                                                                                                | Anti-Pattern                                                                                                  |
| --- | --------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 17  | **Kanban Drag-and-Drop**    | Pipeline boards use larger hit areas, visual feedback, and keyboard alternatives | Drag handles: visible on hover, min 44px hit area. Drop zones: highlighted during drag with dashed border. Keyboard: select card → arrow to move → Enter to drop. Optimistic UI: card moves immediately, syncs in background. | Cards that can only be moved by mouse. No visual indication of valid drop zones. Card disappears during drag. |
| 18  | **Card Elevation Rule**     | Cards use shadow OR border for container treatment, never both                   | Elevated cards (floating, draggable): `shadow-card`, no border. Inline containers (form sections, table cells): `border border-[var(--border-default)]`, no shadow. Never combine shadow + border on the same element.        | `border border-gray-200 shadow-sm` on the same card. Kanban cards with both border and shadow.                |
| 19  | **Profile Detail Tabs**     | Detail views use tabbed sections to prevent information overload                 | Candidate/Job profile: tab navigation (Overview, Documents, Activity, Notes). Each tab owns one concern. Tab content loads independently (Suspense per tab). Active tab persists in URL.                                      | Single scrolling page with all candidate data. Tabs that reload the entire page. Tab state lost on refresh.   |
| 20  | **Activity Timeline**       | Status changes, notes, and communications appear in chronological order          | Newest first (reverse chronological). Left-aligned timeline with right-aligned timestamps. Icon per event type (note, stage move, email, score). Grouped by date. Expandable entries for long content.                        | Unsorted list of events. Activity mixed into other sections. No visual distinction between event types.       |
| 21  | **Candidate/Contact Cards** | List view cards show a quick snapshot; detail provides full profile              | Card shows: avatar + name + current stage + key metadata (location, match score). TruncateText for all text fields. Click opens Sheet overlay (keeps list visible). Card hover: subtle elevation increase.                    | Card showing every field. Card requiring scroll. Click navigates away from list (loses context).              |
| 22  | **Multi-Step Forms**        | Complex creation flows (job posting, onboarding) use stepped progression         | Progress indicator showing current step and total. One concern per step (basics, requirements, pipeline, review). Back/Next navigation with dirty-state preservation. Final step: review all inputs before submit.            | Single scrolling form with 20+ fields. Steps without progress indicator. No way to go back to previous step.  |
| 23  | **Dashboard Metrics**       | Top 3-5 KPIs are glanceable; details available on drill-down                     | StatCard grid (2-4 cards): large number + label + trend arrow. Clicking a stat navigates to the filtered list. Color only for status (green=good, red=attention). Secondary metrics below in smaller cards or table.          | 10+ stat cards all the same size. Metrics without trend context. Click does nothing.                          |
| 24  | **Contextual Empty States** | Empty states differ based on WHY the content is empty                            | No data yet: guidance + primary CTA ("Post your first job"). Filtered to zero: "No results match your filters" + clear button. Error: what went wrong + retry. Permission: what access is needed + how to get it.             | Same "No data" message for all empty states. Empty state without CTA.                                         |

### How to Apply These Principles

```
1. Study the principle BEFORE building — not after as a review
2. Internal precedent takes priority — if a GOLD precedent exists, match it
3. Industry principles fill gaps — when no precedent covers the situation
4. If a principle conflicts with existing codebase patterns, flag it
   (the codebase may need updating, or the principle may not apply)
5. Principles 1-8 (Foundational) are ALWAYS applicable
6. Principles 9-16 (Platform) apply to every screen
7. Principles 17-24 (Feature) apply when building ATS-specific features
```

---

## Pre-Build Verification

Before writing the first line of JSX:

- [ ] 🛑 Identified page type and found existing precedent
- [ ] 🛑 Read the precedent file (not just glanced)
- [ ] 🛑 Listed all UI components needed and verified they exist
- [ ] 🛑 Read source files for any unfamiliar components
- [ ] ⚠️ Spacing matches codebase conventions (varying rhythm, not uniform)
- [ ] ⚠️ Typography uses 3+ hierarchy levels from the scale
- [ ] ⚠️ Color restrained to tokens only (foreground-default/muted/subtle)
- [ ] 💡 Composition matches the precedent pattern for this page type
- [ ] 💡 New screen could be mistaken for an existing screen's sibling
