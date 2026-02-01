# Design-First Implementation

---

## trigger: always

## Philosophy

Every screen in Canopy is built from the Trails Design System. The
design system exists to prevent one-off implementations. When a
Figma design arrives, the job is NOT to visually approximate it with
raw HTML and Tailwind — the job is to decompose it into existing
design system components and assemble them correctly.

Visual shortcuts that "look right" but bypass the design system
create unmaintainable code, break dark mode, miss accessibility,
and drift from the source of truth.

---

## Mandatory Workflow: Figma → Components → Code

### Phase 1: Read the Full Design (Before Writing Any Code)

1. **Fetch the complete design context** using Figma MCP tools
   - `get_design_context` for the node
   - `get_screenshot` for visual reference
   - `get_variable_defs` for any Figma variables
2. **Study every element** — Don't skim. Identify:
   - Every text element (size, weight, color, hierarchy)
   - Every interactive element (buttons, inputs, dropdowns, toggles)
   - Every container (cards, sections, panels)
   - Every data display (badges, avatars, stats, tags)
   - Spacing between elements (gaps, padding, margins)
   - States shown or implied (hover, active, disabled, empty, loading, error)
3. **Document what you see** — Before code, write a brief decomposition:
   ```
   Header: page title (text-heading-sm) + subtitle (text-body, foreground-muted)
   Stats row: 4x StatCard components
   Filter bar: SearchInput + SegmentedController (3 options) + Button (secondary)
   Content: Card containing DataTable with 6 columns
   Empty state: EmptyStateNoResults component
   ```

### Phase 2: Map to Existing Components

**Before writing ANY JSX, scan `/src/components/ui/index.ts` and
identify which existing components match each element in the design.**

#### Mandatory Component Mapping

| If you see in Figma...       | You MUST use...                                | NEVER use...                                   |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Any clickable action         | `<Button>` with correct variant                | Raw `<button>` with inline styles              |
| Text input field             | `<Input>` or `<InputWithMessage>`              | Raw `<input>`                                  |
| Search field                 | `<SearchInput>` or `<SearchBar>`               | Raw `<input type="text">` with search icon     |
| Dropdown / select            | `<Dropdown>` (or `<Select>` alias)             | Raw `<select>` or custom dropdown div          |
| Toggle / filter tabs         | `<SegmentedController>`                        | Row of raw `<button>` with conditional classes |
| Checkbox                     | `<Checkbox>` or `<CheckboxWithLabel>`          | Raw `<input type="checkbox">`                  |
| Radio buttons                | `<RadioGroup>` / `<RadioGroupCard>`            | Raw `<input type="radio">`                     |
| Toggle switch                | `<Switch>` or `<SwitchWithLabel>`              | Custom toggle div                              |
| Container with border/shadow | `<Card>` with appropriate variant              | `<div className="rounded-[16px] border...">`   |
| Stat / metric display        | `<StatCard>` or `<MiniStat>`                   | Custom div with number + label                 |
| Status indicator             | `<Badge>` or `<StageBadge>`                    | Colored span with inline styles                |
| User photo/initials          | `<Avatar>` or `<AvatarGroup>`                  | Custom rounded div with image                  |
| Data table                   | `<DataTable>` or `<EnhancedDataTable>`         | Manual `<table>` or mapped divs                |
| Tag / chip                   | `<Chip>` / `<CategoryTag>` / `<PathwayTag>`    | Custom styled span                             |
| Modal / dialog               | `<Modal>` or `<Dialog>`                        | Custom overlay div                             |
| Tooltip                      | `<SimpleTooltip>` or `<Tooltip>`               | Title attribute or custom hover div            |
| Loading state                | `<Spinner>` or `<Skeleton>`                    | Custom animation div                           |
| Empty state                  | `<EmptyState>` variants                        | Custom "no data" message                       |
| Progress indicator           | `<Progress>` or `<ProgressMeter*>`             | Custom width-percentage div                    |
| Alert / notification         | `<Alert>`, `<Banner>`, or `<InlineMessage>`    | Custom colored div                             |
| Date picker                  | `<DatePicker>` / `<DateRangePicker>`           | Raw `<input type="date">`                      |
| Time picker                  | `<TimePicker>` / `<DateTimePicker>`            | Raw `<input type="time">`                      |
| File upload area             | `<FileUpload>`                                 | Custom dropzone div                            |
| Rich text editor             | `<RichTextEditor>`                             | Raw contentEditable div                        |
| Breadcrumb navigation        | `<Breadcrumbs>`                                | Manual slash-separated links                   |
| Pagination controls          | `<Pagination>` or `<SimplePagination>`         | Custom prev/next buttons                       |
| Tab navigation               | `<Tabs>` with appropriate variant              | Custom tab buttons                             |
| Accordion / collapsible      | `<Accordion>` or `<Collapsible>`               | Custom show/hide div                           |
| Popover                      | `<Popover>`                                    | Custom absolute-positioned div                 |
| Slide-over panel             | `<Sheet>`                                      | Custom fixed-position div                      |
| Form layout                  | `<FormCard>` / `<FormSection>` / `<FormField>` | Manual form container divs                     |
| Activity / timeline          | `<ActivityFeed>` / `<Timeline>`                | Custom list of events                          |
| Candidate display            | `<CandidateCard>`                              | Custom candidate div                           |
| Pipeline stages              | `<KanbanBoard>` / `<DndKanbanBoard>`           | Custom drag-and-drop                           |
| Score display                | `<Scorecard>` / `<StarRating>`                 | Custom star icons                              |
| Match score                  | `<MatchScore>` / `<MatchScoreBadge>`           | Custom percentage display                      |
| Context menu                 | `<ContextMenu>` or `<DropdownMenu>`            | Custom right-click handler                     |
| Command palette              | `<Command>` / `<CommandDialog>`                | Custom search modal                            |
| Hover preview                | `<HoverCard>`                                  | Custom mouseenter handler                      |
| Inline edit                  | `<InlineEditableTitle>`                        | Custom contentEditable span                    |

If a design element has no matching component, **stop and ask the
user** before implementing a one-off. It may warrant a new design
system component.

### Phase 3: Token Reconciliation

After identifying components, map remaining raw values to tokens.
Follow the **3-tier hierarchy** (see `figma-implementation.md` for
the full token reference):

```
TIER 3: Component tokens  →  --button-primary-background (preferred)
TIER 2: Semantic tokens    →  --background-brand
TIER 1: Primitive tokens   →  --primitive-green-600 (last resort)
```

**Banned patterns:**

```tsx
// ❌ Hardcoded hex
className = "bg-[#0A3D2C]";

// ❌ Hardcoded pixel values for spacing
className = "p-[24px] gap-[16px]";
// ✅ Use Tailwind spacing scale or token reference
className = "p-6 gap-4";

// ❌ Hardcoded border-radius
className = "rounded-[16px]";
// ✅ Use semantic radius
className = "rounded-[var(--radius-card)]";

// ❌ Primitive token when component token exists
className = "bg-[var(--primitive-green-800)]";
// ✅ Component token
className = "bg-[var(--button-primary-background)]";

// ❌ Inline shadow values
className = "shadow-[0_4px_6px_rgba(0,0,0,0.1)]";
// ✅ Shadow token
className = "shadow-[var(--shadow-card)]";
```

### Phase 4: Build with Proper Structure

1. **Import from design system** — Always `import { X } from "@/components/ui"`
2. **Compose, don't recreate** — Assemble pages from component primitives
3. **Handle all states** — Every view needs: loading, empty, error, populated
4. **Implement responsive behavior** — Follow the design's responsive intent
5. **Use Phosphor Icons only** — Never Lucide, Heroicons, or other libraries

### Phase 5: Visual Verification

After building, compare the implementation against Figma:

- [ ] Every element maps to its design system component equivalent
- [ ] Typography hierarchy matches (heading-lg, heading-sm, body, caption)
- [ ] Spacing matches design (use token values, not arbitrary px)
- [ ] Colors use correct token tier (component > semantic > primitive)
- [ ] Interactive states are implemented (hover, focus, disabled)
- [ ] Dark mode renders correctly (tokens auto-switch)
- [ ] Empty/loading/error states exist
- [ ] Responsive breakpoints match design intent

---

## Anti-Patterns (Hard Rules)

### 1. No Raw HTML When a Component Exists

```tsx
// ❌ NEVER — raw button with inline styling
<button
  className={`rounded-[16px] px-4 py-2 text-caption font-bold transition-colors ${
    isActive
      ? "bg-[var(--primitive-green-800)] text-[var(--primitive-blue-100)]"
      : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)]"
  }`}
>
  Filter
</button>

// ✅ ALWAYS — design system component
<Button variant={isActive ? "primary" : "tertiary"} size="sm">
  Filter
</Button>

// ✅ BETTER — if it's a set of filter toggles
<SegmentedController
  options={[
    { value: "all", label: "All" },
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
  ]}
  value={activeFilter}
  onChange={setActiveFilter}
/>
```

### 2. No Repeated Container Patterns

```tsx
// ❌ NEVER — manual card styling repeated across pages
<div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-4">
  {children}
</div>

// ✅ ALWAYS — Card component
<Card>
  <CardContent>{children}</CardContent>
</Card>
```

### 3. No Giant Inline ClassNames

If a className string exceeds ~100 characters, it almost certainly
should be a component or use component-level tokens. Stop and check.

```tsx
// ❌ RED FLAG — 200+ char className means you're re-implementing a component
<input
  className="w-full rounded-[16px] border border-[var(--primitive-neutral-300)] bg-white py-3 pl-12 pr-4 text-body text-[var(--foreground-default)] placeholder:text-[var(--foreground-subtle)] outline-none transition-colors focus:border-[var(--primitive-green-500)] focus:ring-2 focus:ring-[var(--primitive-green-500)]/20"
/>

// ✅ CORRECT — design system component handles all of this
<SearchInput placeholder="Search jobs..." />
```

### 4. No Primitive Tokens When Higher-Tier Tokens Exist

```tsx
// ❌ Using primitive for a button background
className = "bg-[var(--primitive-green-800)]";

// ✅ Using the component token designed for this
className = "bg-[var(--button-primary-background)]";

// ❌ Using primitive for error text
className = "text-[var(--primitive-red-700)]";

// ✅ Using semantic token
className = "text-[var(--foreground-error)]";
```

### 5. No Skipping States

Every data-driven view must implement ALL of these states:

```tsx
// ✅ CORRECT — all states handled
function JobsList({ jobs, isLoading, error }) {
  if (isLoading) return <SkeletonRows count={5} />;
  if (error) return <EmptyStateError onRetry={refetch} />;
  if (jobs.length === 0) return <EmptyStateNoJobs />;
  return <DataTable data={jobs} columns={columns} />;
}

// ❌ WRONG — only handles happy path
function JobsList({ jobs }) {
  return (
    <div>
      {jobs.map((job) => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

---

## When the Design Doesn't Match Existing Components

If a Figma element genuinely has no design system equivalent:

1. **Ask first**: "This design includes [element]. I don't see a matching
   component in the design system. Should I create a new reusable
   component or use a one-off?"
2. **If creating new**: Follow the component creation workflow
   (`component-documentation.md` + `design-system-sync.md`)
3. **If one-off**: Document clearly with a comment explaining why
   ```tsx
   {/* One-off: Promo banner gradient — no design system component exists yet */}
   <div className="bg-gradient-to-r from-[var(--primitive-green-700)] to-[var(--primitive-blue-600)]">
   ```

---

## Pre-Commit Checklist

Before considering any design implementation complete:

- [ ] **No raw `<button>` tags** — all use `<Button>` or `buttonVariants()`
- [ ] **No raw `<input>` tags** — all use `<Input>`, `<SearchInput>`, etc.
- [ ] **No raw `<select>` tags** — all use `<Dropdown>` / `<Select>`
- [ ] **No raw `<table>` tags** — all use `<DataTable>` or `<Table>` components
- [ ] **No repeated card containers** — all use `<Card>` component
- [ ] **No filter button rows** — use `<SegmentedController>` or `<Tabs>`
- [ ] **No custom stat displays** — use `<StatCard>` or `<MiniStat>`
- [ ] **No className > ~100 chars** — extract to component or use tokens
- [ ] **No hardcoded hex values** — all colors reference CSS variables
- [ ] **No hardcoded px for spacing** — uses Tailwind scale or `--space-*`
- [ ] **No hardcoded border-radius** — uses `--radius-*` tokens
- [ ] **No hardcoded shadows** — uses `--shadow-*` tokens
- [ ] **All states implemented** — loading, empty, error, populated
- [ ] **Dark mode verified** — tokens auto-switch; check visually
- [ ] **Responsive verified** — works at mobile viewport
- [ ] **Phosphor Icons only** — no Lucide, Heroicons, or other libraries
- [ ] **Imports from `@/components/ui`** — not from individual files
