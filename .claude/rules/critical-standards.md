# Critical Standards — Non-Negotiable Enforcement

---

## trigger: always

**This is the enforcement layer.** Every other rule explains _why_ and _how_. This rule says **STOP — verify these before you consider anything done.** No exceptions, no "I'll fix it later," no partial compliance. Every item here is a blocker.

---

## How to Use This Rule

After completing any task that touches UI, API, or data:

1. **Read the relevant section below** (UI, API, or Both)
2. **Check every item marked 🛑** — these are hard blockers
3. **If any 🛑 item fails, the task is NOT done** — fix it before moving on
4. **Items marked ⚠️ must be addressed** — they can be a fast follow-up only if explicitly agreed with the user
5. **Items marked 💡 are strong recommendations** — skip only with documented justification

---

## UI Tasks — The Non-Negotiables

### 🛑 BLOCKERS (Task fails if any are missing)

#### Components

- 🛑 **No raw `<button>` tags** — use `<Button>` from `@/components/ui`
- 🛑 **No raw `<input>` tags** — use `<Input>`, `<SearchInput>`, `<Textarea>`, etc.
- 🛑 **No raw `<select>` tags** — use `<Dropdown>` or `<Select>`
- 🛑 **No raw `<table>` tags** — use `<DataTable>` or `<Table>`
- 🛑 **No raw `<input type="checkbox">` tags** — use `<Checkbox>` or `<CheckboxWithLabel>`
- 🛑 **No custom modal/dialog divs** — use `<Modal>` or `<Dialog>`

#### Tokens & Styling

- 🛑 **Zero hardcoded hex colors** (`#XXXXXX`) — every color uses a CSS variable token
- 🛑 **No hardcoded pixel spacing** (`p-[24px]`, `gap-[16px]`) — use Tailwind scale (`p-6`, `gap-4`)
- 🛑 **No hardcoded border-radius** (`rounded-[16px]`) — use `--radius-*` tokens
- 🛑 **No shadow + border on the same element** — use one or the other, never both
- 🛑 **No className strings over ~150 characters** — extract to a design system component

#### Icons

- 🛑 **Only Phosphor Icons** — zero imports from `lucide-react`, `@heroicons`, or any other icon library

#### States (Every data-driven view must have ALL of these)

- 🛑 **Loading state exists** — skeleton that matches content shape, not a generic spinner
- 🛑 **Empty state exists** — helpful guidance + next-action CTA, not just "No data"
- 🛑 **Error state exists** — what went wrong + how to recover + retry option
- 🛑 **Populated state works with realistic data** — tested with long names (40+ chars), many items (50+), and maximum fields

#### Dark Mode

- 🛑 **All colors use tokens** — tokens auto-switch in dark mode; hardcoded values break it
- 🛑 **Visually verified in dark mode** — text is readable, contrast is maintained, nothing invisible

#### Accessibility

- 🛑 **Every interactive element has a visible focus state** — `focus-visible:ring-2 ring-[var(--ring-color)]`
- 🛑 **Every form input has a label** — either visible `<Label>` or `aria-label`
- 🛑 **Interactive elements are keyboard accessible** — Tab navigation works, Enter/Space activates

### ⚠️ REQUIRED (Must address — fast follow-up only with explicit agreement)

- ⚠️ **Hover states on every clickable element** — buttons, cards, rows, links all respond to hover
- ⚠️ **Typography uses scale classes** (`text-body`, `text-heading-sm`) — no custom font sizes (`text-[15px]`)
- ⚠️ **Token tier hierarchy followed** — component tokens > semantic tokens > primitive tokens (last resort)
- ⚠️ **Truncation follows standards** — `<TruncateText>` for single-line user content with tooltip; `min-w-0` in flex containers
- ⚠️ **Responsive at mobile viewport** — layout doesn't break at 768px

### 💡 RECOMMENDED (Skip only with documented justification)

- 💡 **Transitions communicate spatial relationships** — modals scale up, tabs fade, lists slide
- 💡 **Progressive disclosure** — complexity reveals in layers, not dumped upfront
- 💡 **Design system docs updated** if a component was created or modified

---

## API Tasks — The Non-Negotiables

### 🛑 BLOCKERS (Task fails if any are missing)

#### Security

- 🛑 **Authentication check at route level** — `getServerUser()` called and null-checked; returns 401 if missing
- 🛑 **Authorization verified** — role/permission check for protected operations; returns 403 if insufficient
- 🛑 **Organization scoping on EVERY query** — `where: { organizationId }` on all tenant-data queries. No exceptions.
- 🛑 **Input validated with Zod** — `schema.safeParse(body)` at the handler boundary; returns 400 with `result.error.flatten()` on failure

#### Error Handling

- 🛑 **Try/catch around all async operations** — no unhandled rejections bubble to the framework
- 🛑 **User-friendly error messages** — never expose internal error details, stack traces, or database errors
- 🛑 **Proper HTTP status codes** — 201 for creates, 204 for deletes, 400 for validation, 401 for auth, 403 for forbidden, 422 for business logic, 500 for server errors

#### Data

- 🛑 **No unbounded queries** — every `findMany` has a `take` limit
- 🛑 **No N+1 patterns** — no database queries inside loops; use `include` or batch queries
- 🛑 **Sensitive data never in responses** — no passwords, tokens, or internal IDs in API responses

### ⚠️ REQUIRED

- ⚠️ **No `any` types** — define proper interfaces for all data shapes
- ⚠️ **No `console.log`** — use structured logger (`@/lib/logger`)
- ⚠️ **All TODO comments resolved** — no `// TODO: add proper admin check` shipped
- ⚠️ **Consistent response shape** — `{ data, meta, error }` for all endpoints; `meta` includes pagination

### 💡 RECOMMENDED

- 💡 **Tests for new endpoints** — integration tests covering auth, validation, success, and error cases
- 💡 **Rate limiting on expensive operations** — AI calls, bulk exports, search
- 💡 **Transactions for multi-step writes** — `prisma.$transaction()` for cross-table mutations

---

## UX Tasks — The Non-Negotiables

### 🛑 BLOCKERS

- 🛑 **Every action gives visible feedback** — create shows toast + redirect, update shows toast, delete shows confirmation dialog THEN toast. No silent success.
- 🛑 **Destructive actions require confirmation** — delete, reject, archive show a dialog stating consequences before executing
- 🛑 **Forms preserve user work** — `beforeunload` warning when navigating away from dirty forms
- 🛑 **URL state for filters/tabs/pagination** — back button works, links are shareable; no local-only state for view configuration

### ⚠️ REQUIRED

- ⚠️ **Reversible actions offer undo** — archive, move, dismiss show toast with "Undo" action (5-second window)
- ⚠️ **Lists default to a useful sort** — newest first for activity, relevance for search, most recent for jobs
- ⚠️ **One primary action per section** — no more than one `variant="primary"` button visible at a time; rest are secondary/ghost/dropdown
- ⚠️ **Cross-screen state consistency** — if data changes on this screen, every other screen displaying that data reflects it

### 💡 RECOMMENDED

- 💡 **Optimistic updates for drag-and-drop** — Kanban moves update UI immediately, sync in background
- 💡 **Partial failure handling for bulk actions** — "8 of 10 succeeded" with details, not silent partial failure

---

## Design Judgment — Verifiable Checks

These replace subjective guidance with specific, checkable criteria:

### Visual Hierarchy (replaces "squint test")

- 🛑 **One dominant element per screen** — page title, hero metric, or primary content area is visually largest/boldest
- ⚠️ **Clear secondary layer** — supporting context (subtitles, metadata, secondary stats) uses `foreground-muted` or smaller type scale
- ⚠️ **Quiet tertiary layer** — meta information (timestamps, IDs, fine print) uses `foreground-subtle` or `text-caption-sm`
- ⚠️ **No more than 3 visual weights competing** — if you count >3 elements of equal prominence, hierarchy is broken

### Information Density

- ⚠️ **Scanning screens are dense and structured** — tables, boards, cards with data-forward layout
- ⚠️ **Reading screens have generous space** — long text has wide margins, clear section breaks
- ⚠️ **Action screens have clear CTAs** — forms and settings have obvious primary action + secondary escape

### Cognitive Load

- ⚠️ **5-7 max visible navigation items** — sidebar links grouped/collapsed if exceeding
- ⚠️ **5-7 max visible filter options** — "More filters" expansion for additional
- ⚠️ **2-3 max visible action buttons** — overflow menu for additional actions

---

## Cross-Cutting Concerns

These apply to EVERY task, regardless of type:

- 🛑 **No Lucide, Heroicons, or other icon libraries** — Phosphor only
- 🛑 **No external company references** — use fictional climate company names for demo data
- ⚠️ **Design system docs updated** if any component in `/src/components/ui/` was touched
- ⚠️ **Navigation config updated** in `/src/lib/design-system-nav.ts` if new component created
- 💡 **README or CLAUDE.md updated** if architectural patterns changed

---

## The Enforcement Protocol

**When completing any task:**

1. Scan the relevant section above (UI / API / UX / All)
2. Verify every 🛑 item — these are binary pass/fail
3. Address every ⚠️ item — fix now or explicitly flag for immediate follow-up
4. Consider every 💡 item — implement if time allows, document if skipping

**If you catch yourself thinking "this is good enough":** It's not. Check the list again. The items we skip are the items users notice.

**If you catch yourself thinking "I'll fix that later":** Fix it now. "Later" is how technical debt accumulates. Every 🛑 item exists because skipping it has caused real problems.

**If a checklist item doesn't apply** (e.g., "empty state" for a page that always has data): Document why it doesn't apply with a comment. The absence of the check should be intentional, not accidental.

---

## Quick Reference: Priority Levels

| Icon | Level           | Meaning                       | Action                                                       |
| ---- | --------------- | ----------------------------- | ------------------------------------------------------------ |
| 🛑   | **BLOCKER**     | Task is not done without this | Fix before marking complete                                  |
| ⚠️   | **REQUIRED**    | Must be addressed             | Fix now, or flag for immediate follow-up with user agreement |
| 💡   | **RECOMMENDED** | Strong best practice          | Implement if possible, document if skipping                  |
