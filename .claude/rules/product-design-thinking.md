# Product Design Thinking

---

## trigger: component, page, screen, layout, build, implement, design, frontend, view, dashboard, list, detail, card, table, modal, form, hierarchy, spacing, interaction

This rule turns design judgment into verifiable checks. It's the bridge between "follow the design system" and "build something users actually want to use." Non-negotiable enforcement items are in `critical-standards.md` — this rule explains the design reasoning behind them and adds the checks that require judgment.

Related rules: `engineering-excellence.md` for foundational philosophy, `critical-standards.md` for hard enforcement, `ux-thinking.md` for user journey thinking, `design-first-implementation.md` for component workflow, `design-audit-standards.md` for compliance.

---

## Visual Hierarchy — Verifiable Checks

Every screen tells a story. Hierarchy controls the reading order. If everything is equally prominent, the user's eye bounces without an anchor.

### The Hierarchy Test (Do This, Not "Squint")

Before marking any screen done, verify these specific items:

| #   | Check                                          | How to Verify                                                                   | Fail Criteria                                         |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | **One dominant element exists**                | Identify it by name: page title, hero stat, or primary content area             | Can't name it, or two elements compete for dominance  |
| 2   | **Secondary layer uses muted styling**         | All supporting text uses `foreground-muted` or smaller type scale than dominant | Secondary text uses same size/weight/color as primary |
| 3   | **Tertiary layer is quiet**                    | Timestamps, IDs, fine print use `foreground-subtle` or `text-caption-sm`        | Metadata is as visually prominent as content          |
| 4   | **Max one primary button per visible section** | Count `variant="primary"` buttons in viewport                                   | >1 primary button visible without scrolling           |
| 5   | **Typography creates 3+ levels**               | At least heading + body + caption used on the screen                            | Uniform text size throughout                          |
| 6   | **Color usage is restrained**                  | Max: 1 brand color + neutrals + 1 status color per section                      | >3 accent colors competing on one screen              |

**If items 1, 4, or 6 fail, STOP and fix before continuing.** Broken hierarchy makes everything else irrelevant.

### Tools for Establishing Hierarchy

| Tool          | How It Creates Emphasis              | Example in Canopy                                                                            |
| ------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Size**      | Larger = more important              | `text-heading-sm` for card title > `text-body` for description > `text-caption` for metadata |
| **Weight**    | Bolder = more important              | `font-bold` on labels, `font-normal` on values                                               |
| **Color**     | Higher contrast = more important     | `foreground-default` > `foreground-muted` > `foreground-subtle`                              |
| **Space**     | More surrounding space = focal point | Hero section `py-16` vs data rows `py-3`                                                     |
| **Position**  | Top-left (LTR) = first read          | Key metrics at top of page, actions at bottom                                                |
| **Isolation** | Surrounded by whitespace = focal     | Single CTA button with generous margin                                                       |

### Common Hierarchy Failures — Specific Fixes

| Symptom                     | Specific Fix                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Everything bold**         | Reserve `font-bold` for labels and key data only. Body text uses `font-normal`. Section headers use `font-semibold`.        |
| **Rainbow of colors**       | Pick ONE accent from `--primitive-green-*` or `--primitive-blue-*`. Status colors only for status. Everything else neutral. |
| **Wall of identical cards** | Vary card prominence: featured cards are larger or have visual distinction. Or switch to a table for scanning.              |
| **Dense action bars**       | ONE `variant="primary"`. ONE `variant="secondary"`. Everything else in a `<DropdownMenu>`.                                  |
| **Uniform text sizes**      | Apply the scale: `text-heading-sm` → `text-body` → `text-caption` → `text-caption-sm`. Minimum 3 levels per screen.         |

---

## Information Architecture — Hard Rules

### Every Screen Answers ONE Question

Before building, write down the answer. If you can't, the screen needs a redesign, not code.

| Screen            | Primary Question                      | The Dominant Element                 |
| ----------------- | ------------------------------------- | ------------------------------------ |
| Dashboard         | "What needs my attention right now?"  | Action items / pending tasks count   |
| Job detail        | "What's the status of this role?"     | Pipeline overview with stage counts  |
| Pipeline view     | "Who's at what stage?"                | Kanban board                         |
| Candidate profile | "Is this person right for this role?" | Match score + key qualifications     |
| Settings          | "How do I change X?"                  | Settings form for the active section |

**STOP if you can't name the primary question.** A screen that doesn't answer one clear question is a collection of components, not a design.

### Density Must Match the Task

| Task Type                                   | Required Density                                 | Fail If...                                                  |
| ------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| **Scanning** (lists, tables, boards)        | High density, structured, data-forward           | Using paragraph text or generous spacing on a list view     |
| **Reading** (descriptions, cover letters)   | Low density, generous margins, clear line length | Cramming long text into a narrow column or dense layout     |
| **Acting** (forms, settings, stage moves)   | Moderate, with ONE clear CTA                     | Having 4+ equal-weight buttons or no obvious primary action |
| **Monitoring** (dashboard, pipeline health) | Glanceable metrics, at-a-glance stats            | Requiring reading/scrolling to understand current state     |

### Progressive Disclosure — 3 Levels

```
Level 1 (visible immediately): Essential info — the answer to the screen's primary question
Level 2 (hover or one click):  Supporting detail — description preview, match score, quick actions
Level 3 (navigation required): Full depth — complete history, all notes, detailed analytics
```

**Test:** If a first-time user feels overwhelmed → too much at Level 1. If a power user clicks 3+ times for daily data → too much at Level 3.

---

## Spatial Design — Verifiable Spacing Rules

### Spacing Communicates Grouping (Gestalt Proximity)

| Between                            | Tailwind Spacing     | Purpose                       |
| ---------------------------------- | -------------------- | ----------------------------- |
| **Related items** (label + value)  | `gap-1` to `gap-2`   | Tight = same thought          |
| **Items in a group** (form fields) | `gap-3` to `gap-4`   | Breathing room within section |
| **Groups / sections**              | `gap-6` to `gap-8`   | Clear section break           |
| **Major sections**                 | `gap-10` to `gap-16` | New context entirely          |

**STOP if all spacing is identical.** Equal spacing (`space-y-4` everywhere) means no grouping. Users can't tell what's related to what.

### Breathing Room Test

Cards and panels must have sufficient internal padding. Verify:

```tsx
// ❌ FAIL — content touching edges, items undifferentiated
<Card className="p-3">
  <h3>Title</h3>
  <p>Description</p>
  <Badge>Active</Badge>
  <Button>View</Button>
</Card>

// ✅ PASS — clear internal structure
<Card className="p-5">
  <div className="space-y-3">
    <div className="flex items-start justify-between">
      <h3 className="text-heading-sm">Title</h3>
      <Badge>Active</Badge>
    </div>
    <p className="text-body text-[var(--foreground-muted)]">Description</p>
  </div>
  <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
    <Button>View</Button>
  </div>
</Card>
```

---

## Cognitive Load — Hard Limits

These are not guidelines. They are limits. Exceeding them means the UI needs restructuring.

| Element                     | Max Visible | When Exceeded, Do This                              |
| --------------------------- | ----------- | --------------------------------------------------- |
| **Sidebar links**           | 7           | Group into collapsible categories                   |
| **Filter options**          | 7           | "More filters" expansion or filter drawer           |
| **Action buttons**          | 3           | Overflow into `<DropdownMenu>`                      |
| **Table columns**           | 7           | Column picker, or hide less-used columns by default |
| **Form fields per section** | 6           | Break into steps or collapsible sections            |
| **Tabs**                    | 6           | Overflow scroll or dropdown                         |

### Decision Paralysis — The Fix

```tsx
// ❌ FAIL — 5 equal-weight buttons = user freezes
<div className="flex gap-2">
  <Button variant="primary">Approve</Button>
  <Button variant="primary">Schedule</Button>
  <Button variant="primary">Message</Button>
  <Button variant="primary">Move</Button>
  <Button variant="primary">Share</Button>
</div>

// ✅ PASS — clear hierarchy: 1 primary, 1 secondary, rest in overflow
<div className="flex items-center gap-2">
  <Button variant="primary">Move to Interview</Button>
  <Button variant="secondary">Schedule</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon"><DotsThree size={20} /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Message</DropdownMenuItem>
      <DropdownMenuItem>Share</DropdownMenuItem>
      <DropdownMenuItem>Approve</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

---

## Interaction Quality — Specific Requirements

### Perceived Performance

| Technique                  | When Required                         | Implementation                                                                      |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| **Skeleton screens**       | Every page load and data fetch        | Skeleton matches content shape (table skeleton for tables, card skeleton for cards) |
| **Inline loading**         | Every button that triggers async work | `<Button loading>` — spinner inside the button, NOT a full-page blocker             |
| **Optimistic updates**     | Toggles, drag-and-drop, favorites     | Update UI immediately, sync in background, roll back on failure                     |
| **Stale-while-revalidate** | Any cached/refetchable data           | Show previous data immediately, refresh silently, fade indicator during refresh     |

```tsx
// ❌ FAIL — blocks entire page
if (isLoading) return <FullPageSpinner />;

// ✅ PASS — shows stale data with refresh indicator
return (
  <>
    <DataTable data={data} className={isRefreshing ? "opacity-80" : ""} />
    {isRefreshing && <ProgressBar className="absolute top-0" />}
  </>
);
```

### Hover and Click Feedback

Every interactive element MUST have both hover and click feedback:

| Element             | Required Hover                                                  | Required Click Feedback                           |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------- |
| **Button**          | Color shift via `--*-background-hover` token                    | Loading spinner for async, scale-down for instant |
| **Clickable card**  | Shadow elevation `shadow-card-hover` + cursor pointer           | Background color shift                            |
| **Clickable row**   | Background tint `background-interactive-hover` + cursor pointer | Background darkens                                |
| **Toggle / Switch** | Container color shift                                           | Thumb slides with spring ease                     |
| **Input**           | Border `--input-border-hover`                                   | Focus ring `--ring-color`                         |
| **Link**            | Underline or color shift                                        | Standard web convention                           |

**STOP if any interactive element has no hover response.** Users won't know they can click it.

### Meaningful Transitions

| Movement             | What It Communicates      | Use For                                    |
| -------------------- | ------------------------- | ------------------------------------------ |
| **Slide left/right** | Navigation depth (in/out) | List → detail → edit                       |
| **Fade**             | Content replacement       | Tab switching, filter changes              |
| **Scale up**         | Focus / zoom in           | Opening modal, expanding card              |
| **Slide up**         | New content arriving      | Toasts, bottom sheets, new items           |
| **Collapse**         | Content removed           | Dismissing notification, closing accordion |

---

## Red Flags — STOP and Fix

When you encounter any of these during implementation, **stop coding and redesign:**

| Red Flag                                             | What It Means                               | The Fix                                            |
| ---------------------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| Adding a tooltip to explain a button                 | The button label is unclear                 | Rewrite the label to be self-explanatory           |
| Hiding important info behind "Show more"             | Wrong hierarchy — primary content is buried | Restructure to put important info at Level 1       |
| >3 accent colors on one screen                       | Visual noise                                | Simplify: brand color + neutral + one status color |
| The page needs a "Help" link to explain itself       | The layout isn't self-explanatory           | Redesign the layout, not the documentation         |
| Scrolling past 3 screenfuls of content               | Too much on one page                        | Break into tabs, steps, or collapsible sections    |
| Every element feels equally important                | No hierarchy                                | Apply the hierarchy test (6 checks above)          |
| The page looks completely different from other pages | Consistency broken                          | Align patterns with existing screens               |

---

## Pre-Build Design Checklist

### 🛑 Blockers (Fix before continuing)

- [ ] 🛑 Can name the ONE primary question this screen answers
- [ ] 🛑 One dominant element is identifiable
- [ ] 🛑 Max one `variant="primary"` button per visible section
- [ ] 🛑 Every interactive element has hover feedback
- [ ] 🛑 Loading uses content-shaped skeletons, not generic spinners

### ⚠️ Required (Must address)

- [ ] ⚠️ Typography creates 3+ hierarchy levels (heading → body → caption)
- [ ] ⚠️ Spacing communicates grouping (tight within groups, loose between)
- [ ] ⚠️ No more than 7 sidebar links / filters / table columns visible
- [ ] ⚠️ No more than 3 action buttons visible (rest in overflow menu)
- [ ] ⚠️ Density matches task type (scanning / reading / acting / monitoring)
- [ ] ⚠️ Color restrained: 1 brand + neutrals + 1 status color per section

### 💡 Recommended

- [ ] 💡 Progressive disclosure applied (3 levels)
- [ ] 💡 Transitions communicate spatial relationships
- [ ] 💡 Content has breathing room — not crammed to edges
- [ ] 💡 Patterns consistent with how similar screens work elsewhere
