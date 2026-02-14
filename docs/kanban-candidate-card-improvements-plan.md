# Kanban & Candidate Card Improvements — Implementation Plan

## Context & What Exists Today

The current Kanban board (`kanban.tsx`, `kanban-dnd.tsx`, `kanban-state.tsx`) and Candidate card (`candidate-card.tsx`) are well-built. They use design system tokens, support dark mode, have accessibility attributes, and the DnD integration uses `@dnd-kit` with custom collision detection, optimistic updates via `useKanbanState`, and undo support via `usePipelineToast`. The bulk actions infrastructure (`useSelection`, `BulkActionsToolbar`, `SelectableItem`, `atsBulkActions`) already exists and is production-ready.

This plan doesn't rebuild what's there — it layers targeted improvements onto solid foundations.

---

## Improvement 1: Card Information Architecture

### The Problem

`CandidateKanbanHeader` packs name, match score, star rating, and applied date into a single line using bullet separators. At the 280px minimum column width, a name like "Dr. Maria Fernandez-Gutierrez" (34 chars) competes with three metadata items for the same horizontal space. The metadata wraps unpredictably, and there's no visual hierarchy between "how well does this person match?" (match score — the most important signal during triage) and "when did they apply?" (applied date — secondary context).

The rest of the card is a flat vertical stack: header → tags → reviewers. There's no visual grouping that says "these things are about fit" vs "these things are about process status."

### Design Reasoning

Recruiters scanning a Kanban column are doing one of two things: triaging (deciding who to advance) or monitoring (checking on in-progress candidates). Both tasks are scan-heavy — the eye moves top-to-bottom across 5-15 cards per column. The card needs to support both tasks with clear visual zones.

We restructure the card into three zones, each answering a different question:

**Zone 1 — Identity (who is this?):** Avatar + name. Full width, no competition with metadata. Name is the anchor the eye returns to. This is the only "heading-level" text on the card.

**Zone 2 — Fitness signals (should I look closer?):** A horizontal strip of compact indicators: match score badge, days in stage, review progress dots. These are the "dashboard gauges" — you read them at a glance without processing sentences. We use `MatchScoreBadge` (already exists, replaces the deprecated inline score), `DaysInStage` in compact mode (already has warning/critical thresholds), and a new `ReviewerDots` micro-component (colored dots instead of the full `CandidateReviewers` section, which is too heavy for a kanban card).

**Zone 3 — Context (what kind of candidate?):** Tags/skills. These are the "flavor" — they help differentiate two 85%-match candidates. Kept at the bottom because they're useful after Zone 2 passes the "worth a closer look" test.

### What Changes

**File: `candidate-card.tsx`**

- New sub-component: `CandidateKanbanCard` — a composed card that implements the three-zone layout. This doesn't replace the flexible sub-component API; it's a convenience composition for the kanban context.
- New micro-component: `ReviewerDots` — a row of 4-6 tiny colored circles (green = yes, red = no, yellow = maybe, gray = pending) that convey review progress in ~20px of vertical space vs the current ~60px for collapsed `CandidateReviewers`.
- `CandidateKanbanHeader` simplified: remove matchScore, rating, and appliedDate props. It becomes purely identity (avatar + name). The metadata moves to Zone 2.

**Design decisions:**

- Zone 2 uses `gap-3` (12px) between indicators — enough to parse as separate items but tight enough to read as a single "status strip."
- Match score uses `MatchScoreBadge` (pill format) instead of inline text. The pill format creates a visual anchor point — the eye learns to look for the colored pill.
- Days in stage only appears when ≥ 3 days (below that, it's noise). Warning (7d) and critical (14d) thresholds remain.
- ReviewerDots caps at 6 dots. Beyond that, show "6+" with a tooltip listing all reviewers. This prevents the dot row from becoming its own layout problem.
- The full `CandidateReviewers` collapsible section remains available for expanded/detail contexts — ReviewerDots is kanban-only.

---

## Improvement 2: Drag-and-Drop Polish

### The Problem

The drag overlay uses `rotate-3 scale-105 opacity-90` — which is a reasonable start, but the drop experience lacks physicality. When you release a card:

1. The card snaps into place with a 200ms ease (`cubic-bezier(0.18, 0.67, 0.6, 1.22)`). This is fast but doesn't have a settling feel.
2. The origin position shows the card at `opacity: 0.5` (ghost). This creates a visual ambiguity — is that card still there or not?
3. The column highlight on drag-over is a background color change. It's subtle to the point of being missable.
4. The drop placeholder is a dashed border rectangle at a fixed 72px height. It doesn't match the card being dragged, so the "where will this land" signal is abstract rather than concrete.

### Design Reasoning

Drag-and-drop is a direct manipulation metaphor. The brain expects physics: things have weight, they cast shadows when lifted, they leave a visible gap when picked up, and they settle with a slight bounce when placed. Each of these signals reduces cognitive load — the user doesn't have to think about what happened, they can see and feel it.

The current implementation handles the mechanical side (collision detection, cross-column moves, optimistic updates) correctly. What's missing is the perceptual side — making the drag feel like moving a physical object.

### What Changes

**File: `kanban-dnd.tsx`**

**Drag overlay improvements:**

- Change from `opacity-90` to `opacity-95` — the card should look almost real, not ghostly
- Add `shadow-elevated` (already exists in token system) — the lifted card casts a deeper shadow than resting cards
- Keep `rotate-3 scale-105` — the slight rotation gives physicality without being distracting
- Add `pointer-events-none` to prevent interaction with the overlay card

**Ghost card at origin:**

- Change from `opacity: 0.5` to a skeleton-like placeholder: keep the card's dimensions but replace content with a subtle pulsing background. This says "something was here and is coming back" rather than "is this card disabled?"
- Implementation: when `isDragging` is true, apply `opacity-0` to the actual card content and show a `bg-[var(--background-muted)] animate-pulse rounded-xl` placeholder at the same dimensions. Since the SortableCard wrapper maintains layout, this keeps the column structure stable.

**Column drop target feedback:**

- Replace the background color change with a more visible signal: `ring-2 ring-[var(--border-brand)] ring-inset` on the column content area + the existing background tint. The ring provides a crisp boundary that's visible even when the column is full of cards.
- Add a subtle `transition-all duration-150` to the column so the highlight animates in smoothly.

**Drop animation:**

- Increase duration from 200ms to 250ms and use `--ease-spring` (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`) — the slight overshoot creates a "settling" feel that signals completion.

**Drop placeholder:**

- Replace the fixed 72px dashed rectangle with a dynamic placeholder that matches the approximate height of a card in that column. Use `h-[80px]` as the standard (matching compact card height) with `bg-[var(--background-brand-subtle)] border-2 border-dashed border-[var(--border-brand)] rounded-xl` — this makes the landing zone visually connected to the brand color used in the column highlight.

**Reduced motion:**

- All of these enhancements are already covered by the global `prefers-reduced-motion: reduce` rule in globals.css which sets all durations to 0ms and disables animations. No additional work needed.

---

## Improvement 3: Quick Actions on Cards

### The Problem

Currently, to advance or reject a candidate, a recruiter must either drag the card (which is good for single moves but poor for batch processing) or navigate to the candidate's full profile. During Monday morning triage — scanning 20-30 new applications — every extra click adds up. The `CandidateActions` sub-component exists but it's a generic container; there's no built-in quick action pattern for the kanban context.

### Design Reasoning

Quick actions on cards serve the "acting" task type (per `product-design-thinking.md`): moderate density, ONE clear CTA. The key constraint is that kanban cards are narrow (280px min) and already have content. We can't add a permanent action bar — it would consume too much vertical space and create visual noise across 50+ cards.

The pattern that balances discoverability with density: **hover-revealed action row at the card's bottom edge.** This is a well-established pattern in email clients (Gmail's hover actions on email rows) and project management tools. It works because:

1. Users in scanning mode don't need actions — they're reading. Actions appear only when the pointer signals intent (hovering on a specific card).
2. The actions occupy space that's already reserved (the card's padding area), so they don't push other cards down.
3. Two primary actions + overflow menu respects the "max 3 visible actions" rule from `product-design-thinking.md`.

### What Changes

**File: `candidate-card.tsx`**

New sub-component: `CandidateQuickActions`

```
Props:
- onAdvance?: () => void       // Move to next stage
- onReject?: () => void        // Move to rejected
- onMore?: () => void          // Open full action menu
- nextStageName?: string       // Label for advance button (e.g., "→ Interview")
- className?: string
```

**Visual behavior:**

- Hidden by default, appears on card hover via `opacity-0 group-hover:opacity-100 transition-opacity duration-150`
- Renders at the bottom of the card, overlaying the bottom padding area
- Uses a subtle gradient backdrop (`bg-gradient-to-t from-[var(--card-background)] via-[var(--card-background)] to-transparent`) so it doesn't look like it's floating over content
- Two buttons: "→ {nextStageName}" (primary, compact) + "✕ Reject" (ghost, compact) + "•••" (ghost, icon-only, opens DropdownMenu)
- Buttons use `size="sm"` from the Button component
- The advance button uses `variant="primary"` — it's the ONE primary action per the hierarchy rules
- The reject button uses `variant="ghost"` with `text-[var(--foreground-error)]` on hover — destructive but not prominent
- The overflow menu contains: "Schedule Interview", "Send Email", "Add Note", "Add Tag", separator, "Archive"

**Integration with existing systems:**

- `onAdvance` triggers the same `useKanbanState.handleItemsChange` that drag-and-drop uses, ensuring optimistic updates + automatic revert on error
- `onReject` uses the same path but with a confirmation step (since it's destructive) — `usePipelineToast.showToast` with an undo callback
- The advance action reads the next stage from the job's `stages` JSON field, so the button label is contextually correct ("→ Interview" when in Screening, "→ Offer" when in Interview)

**Why not a context menu (right-click)?**
Right-click menus are invisible — there's no affordance telling the user they exist. Quick actions on hover have progressive discoverability: you learn they exist the first time you hover, then they become muscle memory. Context menus are useful as a power-user supplement but shouldn't be the primary interaction path for core workflow actions.

**Why not always-visible actions?**
With 10 cards per column and 5-7 columns, always-visible action buttons on every card would add 50-70 button instances to the DOM, create visual noise, and increase each card's height by ~36px (button height + spacing). The hover pattern keeps the board clean during scanning and reveals actions during interaction.

---

## Improvement 4: Column Health Indicators

### The Problem

Column headers show a title, icon, and count badge. The count tells you "how many" but not "how are they doing." A column with 12 candidates where 3 have been sitting for 14+ days looks identical to one where all 12 arrived today. The recruiter has to scan every card's `DaysInStage` indicator to spot bottlenecks.

### Design Reasoning

Pipeline management is a monitoring task (per `product-design-thinking.md`): glanceable metrics, at-a-glance stats. The column header is prime real estate for this — it's the first thing you see, and it's always visible even when scrolling through cards.

The insight is that `DaysInStage` already has warning (7d) and critical (14d) thresholds built in. We're not adding new logic — we're surfacing existing per-card signals at the column level.

### What Changes

**File: `kanban.tsx`**

New sub-component: `KanbanColumnHealthBar`

```
Props:
- items: { daysInStage: number }[]
- warningThreshold?: number    // default: 7
- criticalThreshold?: number   // default: 14
- newThreshold?: number        // default: 1 (days to count as "new")
```

**Visual design:**

- A single line of text below the column header, above the cards area
- Format: `"3 new · 2 waiting >7d"` or `"5 need attention"` when critical count > 0
- Uses `text-caption-sm` (12px) and `text-foreground-subtle` for normal counts
- Warning counts use `text-[var(--primitive-orange-600)]`
- Critical counts use `text-[var(--primitive-red-600)]` with a Warning icon (matching DaysInStage's pattern)
- Entire line disappears if all candidates are <3 days (nothing to report)

**Design decisions:**

- One line, not a multi-row dashboard. The column header should remain compact — if it takes more space than a card, the hierarchy is wrong.
- "New" means applied within 24 hours. This is the most actionable signal during triage — "these are the ones you haven't seen yet."
- "Waiting >7d" and "Need attention (>14d)" use the same thresholds as `DaysInStage` for consistency. The user learns one set of thresholds.
- We don't show percentages or progress bars — that level of detail belongs on the analytics page, not the working board.
- The health bar is optional via a prop (`showHealth?: boolean` on `KanbanColumn`). Teams that don't want the extra information can disable it.

---

## Improvement 5: Kanban Bulk Selection

### The Problem

`CandidateCard` has `selectable` and `onSelectionChange` props. `useSelection` and `BulkActionsToolbar` with `atsBulkActions` exist and are fully built. But there's no wiring between the Kanban board and this selection system. The board and the bulk actions toolbar exist as independent components that have never been composed together.

### Design Reasoning

Bulk operations on a Kanban board serve a different use case than bulk operations on a table. In a table, you select rows to act on a filtered subset. On a board, you select cards to do one of two things:

1. **Cross-column batch move:** "Move these 5 from Screening to Interview" — faster than 5 individual drags
2. **Same-column batch action:** "Reject these 3 candidates from Applied" — faster than 3 individual quick-action clicks

The selection UX needs to work with the existing DnD. Shift-click for range selection doesn't make sense on a board (cards span multiple columns). Instead: click-to-toggle individual cards, with a "select all in column" shortcut in each column header.

### What Changes

**File: New — `kanban-selection.tsx`** (or extend `kanban-dnd.tsx`)

New wrapper component: `SelectableKanbanBoard`

This composes `DndKanbanBoard` + `useSelection` + `BulkActionsToolbar`:

```
Props:
- ...all DndKanbanBoardProps
- selectable?: boolean           // Enable selection mode
- bulkActions?: BulkAction[]     // Actions for the toolbar
- onBulkAction?: (actionId: string, selectedIds: string[]) => void
```

**Behavior:**

- When `selectable` is true, each card renders with `selectable={true}` and `showDragHandle={true}`
- Clicking the checkbox toggles selection (existing CandidateCard behavior)
- Clicking the card body still opens the candidate (selection is checkbox-only to avoid conflicts with card click and drag)
- Each column header gets a "select all in column" checkbox via `columnHeaderActions`
- When selectedCount > 0, `BulkActionsToolbar` appears at the bottom in `position="fixed"` mode
- Uses existing `atsBulkActions.moveToStage()`, `atsBulkActions.reject()`, `atsBulkActions.email()`, etc.

**DnD + Selection interaction:**

- Dragging a selected card drags ALL selected cards (multi-drag). The drag overlay shows a stacked card visual (top card visible + a count badge "3 candidates")
- This uses dnd-kit's built-in mechanism: in `handleDragEnd`, if the dragged card was selected and `selectedIds.size > 1`, move all selected items to the target column
- If the dragged card was NOT selected, only that card moves (preserving single-drag behavior)

**Design decisions:**

- Checkbox-only selection (not whole-card click) because the card already has three click targets: card body (open profile), drag handle (drag), and quick actions (advance/reject). Adding a fourth meaning to the same surface would create ambiguity.
- The toolbar uses `position="fixed"` (sticky to bottom of viewport) because the kanban board scrolls horizontally — an inline toolbar above the board would scroll away.
- Multi-drag shows a stacked visual (not a count-only overlay) because the stacked cards reinforce "you're moving multiple things" in a way that a number alone doesn't.

---

## Improvement 6: Keyboard Navigation

### The Problem

Cards have `tabIndex={0}` and focus rings, but Tab-based navigation through 50+ cards across 5 columns is impractical. There's no arrow-key navigation within or across columns, and no keyboard shortcut for common actions (advance, reject, open).

### Design Reasoning

Keyboard navigation on a board isn't about replacing the mouse — it's about keeping flow state for power users who process candidates quickly. The mental model: arrow keys are spatial (move through the board), letter keys are actions (do something to the focused card).

This follows the WAI-ARIA grid pattern: the board is a grid, columns are column groups, cards are cells. Arrow keys navigate the grid, Enter activates the focused cell.

### What Changes

**File: `kanban-dnd.tsx`** (extend the DndContext wrapper)

New hook: `useKanbanKeyboard`

```
Inputs:
- columns: KanbanColumnData[]
- items: KanbanItem[]
- onAdvance?: (itemId: string) => void
- onReject?: (itemId: string) => void
- onOpen?: (itemId: string) => void
```

**Key bindings:**

- `↑` / `↓` — Move focus between cards within a column
- `←` / `→` — Move focus between columns (landing on the same vertical position or the last card if the new column is shorter)
- `Enter` — Open the focused candidate's profile (`onOpen`)
- `m` — Open a "Move to stage" dropdown anchored to the focused card (uses `DropdownMenu`)
- `x` — Reject the focused candidate (with confirmation via `usePipelineToast`)
- `e` — Advance to next stage
- `Escape` — Clear focus / close any open dropdown

**Implementation:**

- A single `onKeyDown` handler on the `KanbanBoard` container
- Maintains `focusedCardId` and `focusedColumnId` in state
- On arrow key, calculates the next card/column and calls `.focus()` on the target DOM element (found via `data-card-id` attribute)
- Visual: focused card gets `shadow-[var(--shadow-focus)]` (the standard focus ring from the token system)
- All keyboard shortcuts are discoverable via a `?` key that opens a small shortcut reference popover

**Design decisions:**

- We use `onKeyDown` on the board container rather than individual card `onKeyDown` handlers. This keeps the keyboard logic centralized and avoids 50+ individual listeners.
- The `m` key opens a dropdown rather than immediately moving — because the user needs to choose a target stage. The dropdown uses the same stage list as `atsBulkActions.moveToStage()`.
- We don't add `Shift+↑/↓` for multi-select because keyboard multi-select on a 2D board is cognitively complex. Bulk actions on keyboard users are better served by "select all in column" (`Ctrl+A` when a column is focused) + toolbar actions.

---

## Improvement 7: Virtual Scrolling for Column Content

### The Problem

Each column renders all its cards. At 50+ candidates per stage (realistic for a popular "Applied" column on a well-known climate company), this means 200+ card components in the DOM simultaneously. React rendering slows down, and vertical scrolling within columns gets janky.

### Design Reasoning

`@tanstack/react-virtual` is already installed (v3.13.18). Virtualizing the card list inside each column means only the visible cards (plus a small buffer) are in the DOM. This is a performance optimization that the user never sees directly — they just notice that the board doesn't lag.

The challenge with virtualizing inside a DnD context is that dnd-kit needs to know the positions of all sortable items for collision detection. When items are virtualized (not in the DOM), their positions aren't available. The solution: virtualize the rendering but keep the sortable context aware of all items via their IDs. Since dnd-kit's `SortableContext` already accepts an array of IDs (not DOM elements), this works — the virtualized items that are off-screen won't have drag handles, but they maintain their sort order.

### What Changes

**File: `kanban-dnd.tsx`** (modify `DroppableColumn`)

- Wrap the card list in a `useVirtualizer` from `@tanstack/react-virtual`
- The parent container (column content area) provides the scroll element
- Each card estimates at 100px height (overestimate is fine — the virtualizer adjusts dynamically)
- Overscan of 3 items ensures smooth scrolling
- The `SortableContext` still receives all item IDs for the column — only the rendering is virtualized

**Threshold:** Virtualization only activates when a column has > 20 items. Below that, the DOM overhead isn't meaningful and the simpler non-virtualized rendering avoids complexity.

**Design decisions:**

- We use a static estimate of 100px per card rather than measuring. Card heights vary slightly (tags may wrap, reviewers may expand), but the virtualizer's `measureElement` callback handles dynamic sizing after initial render. The estimate just needs to be close enough for the initial layout.
- Overscan of 3 (not 1 or 5) balances between "cards pop in visibly" (too little overscan) and "too many DOM nodes" (too much overscan). 3 means roughly one screenful of buffer above and below.
- We don't virtualize columns horizontally — there are at most 7-8 columns, which is trivial for the DOM.

---

## Improvement 8: Candidate Hover Preview

### The Problem

To learn more about a candidate than what the kanban card shows, you must navigate away from the board to the candidate's full profile. This breaks the recruiter's spatial context — they lose their place in the pipeline while reading a profile, then have to re-orient when they return.

### Design Reasoning

There's a middle ground between "card summary" and "full profile page" — a preview panel that shows more detail without leaving the board. Two patterns exist in the codebase:

1. **HoverCard** — lightweight, appears on hover, dismisses on mouse-out. Good for quick peeks but frustrating if you need to read or interact with the content (moving the mouse dismisses it).
2. **Sheet** — slide-over panel, stays open until explicitly closed. Good for detailed views but heavier — it overlays part of the board.

For the kanban context, **Sheet (right side, size="md")** is the right choice. A HoverCard would be dismissed too easily when the recruiter moves to click an action. A Sheet stays open, shows the candidate detail, and the board remains visible (and functional) on the left.

### What Changes

**File: New — `candidate-preview-sheet.tsx`** (or extend `candidate-preview-card.tsx`)

New component: `CandidatePreviewSheet`

```
Props:
- candidateId: string | null    // null = closed
- onClose: () => void
- onAdvance?: (id: string) => void
- onReject?: (id: string) => void
```

**Content layout (using existing sub-components):**

- `SheetHeader`: Name + avatar (CandidateHeader) + stage badge (StageBadge)
- Match score section: `MatchScore` with `MatchScoreBreakdown` (already exists)
- Skills & certifications: `CandidateSkills` with full list (no maxVisible truncation)
- Notes section: Most recent 3 notes with "View all" link
- Activity timeline: Recent activity items
- Reviewer scorecards: Full `CandidateReviewers` in expanded mode
- `SheetFooter`: Action buttons — "Advance", "Reject", "Open Full Profile"

**Trigger:**

- Click on a card in the Kanban board opens the preview sheet instead of navigating to the full profile page
- `Enter` key on a focused card also opens the sheet
- "Open Full Profile" button in the sheet footer navigates to the full page

**Design decisions:**

- Sheet size `"md"` (448px) — wide enough to show meaningful content but narrow enough that 3-4 kanban columns remain visible. The recruiter can see the candidate detail AND the pipeline simultaneously.
- The sheet is on the right side (default) because the Kanban board scrolls left-to-right. A right-side sheet aligns with the "deeper content is to the right" spatial metaphor.
- We don't fetch additional data on sheet open if the card already has the data. The sheet just presents existing data in more detail. If we need more data (notes, full activity), that's a lazy fetch inside the sheet.
- The sheet doesn't replace the full profile page — it's a complement. Some tasks (editing candidate info, uploading documents, writing long notes) need the full page. The sheet is for read-heavy triage.

---

## Improvement 9: Visual Differentiation Between Cards

### The Problem

All cards in a column look identical structurally. When scanning 15 cards, the eye needs to find "which ones need attention" and "which ones are new." Currently, this requires reading each card's metadata.

### Design Reasoning

Pre-attentive visual processing — the brain's ability to spot differences before conscious reading — is our fastest tool. Color, position, and shape are processed in ~200ms. Text takes ~500ms+ per item. Adding subtle visual signals that leverage pre-attentive processing would let recruiters spot important cards without reading them.

The key constraint: these signals must be subtle enough not to create visual noise across 50 cards, but distinct enough to be useful. Thick colored borders, background colors, or large icons would turn the board into a rainbow. We need whisper-level signals.

### What Changes

**File: `candidate-card.tsx`**

**Match score accent line:**

- A 3px-wide left border on the card, colored by match score: `border-l-[3px]` with:
  - High (≥75): `border-l-[var(--match-high-accent)]` (green-600)
  - Medium (50-74): `border-l-[var(--match-medium-accent)]` (yellow-500)
  - Low (<50): `border-l-[var(--match-low-accent)]` (orange-500)
  - No score: no border (default)
- This creates a "heat map" effect when scanning a column — you can instantly see the distribution of match quality without reading numbers.

**New candidate indicator:**

- For candidates who entered the current stage within 24 hours, a small `NotificationBadge` (already exists, `variant="dot"`) appears in the top-right corner of the card.
- This leverages an existing component and provides the "these are the ones you haven't seen" signal during morning triage.
- The dot disappears after the candidate has been in the stage for >24 hours, keeping the board clean over time.

**Unread activity indicator:**

- If there are notes or activity the current user hasn't seen, a tiny blue dot appears next to the candidate's name (similar to email unread indicators).
- Uses `NotificationBadge variant="dot"` with blue-500 color.
- This requires a `lastSeenAt` field per user-candidate pair (data model consideration — flagged as future work if the field doesn't exist).

**Design decisions:**

- Left border accent (not top, bottom, or background tint) because: left borders are visible in vertical scanning (the eye sweeps down the left edge), they don't increase card height, and they work in both light and dark mode. Top/bottom borders would be hidden by the card's rounded corners. Background tints would fight with the selected state.
- 3px width is the minimum visible for a colored line at arm's length on a standard display. 2px is too thin (especially for yellow-on-white), 4px starts feeling heavy.
- The accent line is opt-in via a prop (`matchScore?: number` on `CandidateCard`). Cards without a match score have no accent line, avoiding the "every card has a gray bar" problem.
- We do NOT add visual differentiation for "has scheduled interview" or "reviewer consensus" — those signals are already in the card content (CandidateActivity and ReviewerDots). Adding more pre-attentive signals creates noise. The accent line (fit quality) and new dot (recency) are the two most actionable signals during triage.

---

## Implementation Order

The improvements have dependencies. This order minimizes rework:

### Phase 1: Card Internals (No board changes)

1. **Card Information Architecture** — restructure zones, build ReviewerDots, simplify KanbanHeader
2. **Visual Differentiation** — match score accent line, new candidate dot
3. **Quick Actions** — hover-revealed action row

These three changes are all within `candidate-card.tsx` and don't touch the board.

### Phase 2: Board Enhancements

4. **Drag-and-Drop Polish** — overlay, ghost, drop animation, placeholder
5. **Column Health Indicators** — KanbanColumnHealthBar
6. **Candidate Hover Preview** — Sheet integration

These change `kanban.tsx` and `kanban-dnd.tsx` and add a new sheet component.

### Phase 3: Power Features

7. **Bulk Selection** — SelectableKanbanBoard, multi-drag
8. **Keyboard Navigation** — useKanbanKeyboard hook
9. **Virtual Scrolling** — Conditional virtualization in columns

These are the most complex changes and build on everything above.

---

## Files Touched

| File                                                       | Changes                                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/components/ui/candidate-card.tsx`                     | New sub-components (ReviewerDots, CandidateQuickActions, CandidateKanbanCard), accent line, new indicator |
| `src/components/ui/kanban.tsx`                             | KanbanColumnHealthBar, showHealth prop on KanbanColumn                                                    |
| `src/components/ui/kanban-dnd.tsx`                         | Drag overlay polish, ghost card, drop animation, placeholder, keyboard hook, virtualization               |
| `src/components/ui/kanban-selection.tsx`                   | New file — SelectableKanbanBoard composition                                                              |
| `src/components/ui/candidate-preview-sheet.tsx`            | New file — Sheet-based preview                                                                            |
| `src/components/ui/index.ts`                               | Export new components                                                                                     |
| `src/lib/design-system-nav.ts`                             | Update navigation config for new components                                                               |
| `src/app/design-system/components/kanban/page.tsx`         | Update docs with new features                                                                             |
| `src/app/design-system/components/candidate-card/page.tsx` | Update docs with new sub-components                                                                       |

---

## What This Plan Does NOT Include

- **Framer Motion or new animation libraries** — CSS animations + existing tokens are sufficient. Adding a library for polish contradicts the lean stack philosophy.
- **Real-time collaboration** — Multiple recruiters viewing the same board with live cursor/card positions. This is a separate architectural concern (WebSockets, conflict resolution).
- **AI-driven card ordering** — Automatically sorting cards by match score or urgency within columns. This is an AI feature, not a UI improvement.
- **Mobile drag-and-drop** — Touch-based DnD on mobile is a separate effort. The current `PointerSensor` handles touch events but the UX needs dedicated mobile work.
- **Analytics integration** — Column health indicators show real-time status, not historical trends. Analytics (conversion rates, time-in-stage distributions) belong on the analytics page.
