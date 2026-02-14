---
name: design-review
description: Comprehensive design and UX audit for any page, component, or screen. Use when reviewing implementations for design quality, UX completeness, visual hierarchy, interaction quality, and product sense. Covers everything from token compliance to whether the screen actually works for real users.
---

# Design Review Skill

## Purpose

Audit any page, component, or screen against production-quality standards with explicit pass/fail criteria. This is not a subjective review — every check has a binary outcome. The review produces a severity-scored report that maps directly to the enforcement tiers used across all Canopy rules.

## When to Use

- Before merging any UI-facing PR
- When reviewing a newly built page or component
- When something "feels off" but you can't articulate why
- After implementing from a Figma design
- During periodic quality sweeps of existing screens

---

## Severity Tiers

Every finding is scored using the same enforcement system as `critical-standards.md`:

| Tier            | Icon | Meaning                                                       | Action Required                                    |
| --------------- | ---- | ------------------------------------------------------------- | -------------------------------------------------- |
| **BLOCKER**     | 🛑   | Screen cannot ship with this issue                            | Fix before marking task complete                   |
| **REQUIRED**    | ⚠️   | Must be addressed before or immediately after merge           | Fix now or explicitly flag for immediate follow-up |
| **RECOMMENDED** | 💡   | Strong best practice, skip only with documented justification | Implement if possible, document if skipping        |

---

## Step 0: Set Context (Required Before Proceeding)

Answer these four questions. If you cannot answer #4, that is already a 🛑 finding.

1. **What screen/component am I reviewing?** (file path, purpose)
2. **Who is the primary user?** (recruiter triaging, hiring manager checking in, admin configuring, first-time user)
3. **What is the primary task type?** (scanning, reading, acting, monitoring)
4. **What is the ONE question this screen answers?**

```
Context:
  Screen: ___
  User: ___
  Task type: ___
  Primary question: ___
```

---

## Step 1: Visual Hierarchy (6 Checks)

These replace the subjective "squint test" with verifiable criteria.

| #   | Check                                          | How to Verify                                                            | 🛑 Fail Criteria                                       | Tier |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ | ---- |
| 1.1 | **One dominant element exists**                | Name it: page title, hero stat, or primary content area                  | Cannot name it, or two elements compete for dominance  | 🛑   |
| 1.2 | **Secondary layer is muted**                   | All supporting text uses `foreground-muted` or smaller type scale        | Secondary text same size/weight/color as primary       | ⚠️   |
| 1.3 | **Tertiary layer is quiet**                    | Timestamps, IDs, fine print use `foreground-subtle` or `text-caption-sm` | Metadata as visually prominent as content              | ⚠️   |
| 1.4 | **Max one primary button per visible section** | Count `variant="primary"` buttons in viewport                            | More than one primary button visible without scrolling | 🛑   |
| 1.5 | **Typography creates 3+ levels**               | At least heading + body + caption used on the screen                     | Uniform text size throughout                           | ⚠️   |
| 1.6 | **Color usage restrained**                     | Max 1 brand color + neutrals + 1 status color per section                | More than 3 accent colors competing on one screen      | ⚠️   |

**🛑 STOP if checks 1.1 or 1.4 fail.** Broken hierarchy makes everything else irrelevant — fix these first.

---

## Step 2: Information Architecture (5 Checks)

| #   | Check                                           | How to Verify                                                                                           | Fail Criteria                                                           | Tier |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---- |
| 2.1 | **Primary question answered without scrolling** | The answer to Step 0 question #4 is visible in the first viewport                                       | User must scroll or click to find the primary information               | 🛑   |
| 2.2 | **Density matches task type**                   | Scanning = structured/dense, reading = generous margins, acting = clear CTA, monitoring = glanceable    | Using paragraph text on a scanning screen, or cramming a reading screen | ⚠️   |
| 2.3 | **Cognitive load within limits**                | Count: sidebar links ≤7, visible filters ≤7, action buttons ≤3, table columns ≤7, tabs ≤6               | Any count exceeds limit without overflow/grouping mechanism             | ⚠️   |
| 2.4 | **Progressive disclosure applied**              | Essential info at Level 1, supporting detail at Level 2 (hover/click), full depth at Level 3 (navigate) | Everything dumped at Level 1, or daily-use data buried at Level 3       | 💡   |
| 2.5 | **No decision paralysis**                       | One clearly primary action; others visually subordinate                                                 | 3+ equal-weight buttons competing for attention                         | ⚠️   |

---

## Step 3: Spatial Design (4 Checks)

| #   | Check                             | How to Verify                                                                                | Fail Criteria                                                       | Tier |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---- |
| 3.1 | **Spacing communicates grouping** | Related items: gap-1 to gap-2. Within groups: gap-3 to gap-4. Between groups: gap-6 to gap-8 | All spacing identical (`space-y-4` everywhere) — no visual grouping | ⚠️   |
| 3.2 | **Content has breathing room**    | Cards/panels have ≥p-5 internal padding; content not touching container edges                | Content cramped against edges, items crowd each other               | ⚠️   |
| 3.3 | **Flex layout safety**            | Every truncated element inside a flex container has `min-w-0` on its parent                  | `truncate` class present inside flex container without `min-w-0`    | 🛑   |
| 3.4 | **Spacing rhythm is predictable** | Tight within groups, generous between groups — consistent pattern                            | Erratic spacing with no discernible pattern                         | 💡   |

---

## Step 4: Interaction Quality (6 Checks)

| #   | Check                                             | How to Verify                                                                                                   | Fail Criteria                                                                                   | Tier |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---- |
| 4.1 | **Every interactive element has hover feedback**  | Buttons, cards, rows, links all respond visually on hover                                                       | Any clickable element has no hover response — users won't know they can click it                | 🛑   |
| 4.2 | **Every interactive element has focus state**     | Tab through the page — every element shows `focus-visible:ring-2 ring-[var(--ring-color)]`                      | Any interactive element has no visible focus indicator                                          | 🛑   |
| 4.3 | **Click/submit gives immediate feedback**         | Buttons show loading spinner for async actions; instant actions show visual change within 200ms                 | Clicking a button and nothing visible happens for >200ms                                        | 🛑   |
| 4.4 | **Loading uses content-shaped skeletons**         | Loading state renders skeletons matching the content shape (table skeleton for tables, card skeleton for cards) | Full-page spinner or generic loading indicator                                                  | 🛑   |
| 4.5 | **Transitions communicate spatial relationships** | Modals scale up, tabs fade, lists slide, toasts slide up                                                        | Content appears/disappears with no transition, or decorative transitions that don't communicate | 💡   |
| 4.6 | **Perceived performance optimized**               | Stale-while-revalidate for cached data; optimistic updates for toggles/moves                                    | Full page blocks while refetching data that was already displayed                               | 💡   |

---

## Step 5: UX Completeness — All States (5 Checks)

Every data-driven view MUST handle ALL five states. Missing any 🛑 state means the task is NOT done.

| #   | State               | Pass Criteria                                                                                                     | 🛑 Fail Criteria                                                          | Tier |
| --- | ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---- |
| 5.1 | **Loading**         | Content-shaped skeleton appears during data fetch                                                                 | No loading indicator, or a generic full-page spinner                      | 🛑   |
| 5.2 | **Empty**           | `<EmptyState>` with guidance text + CTA button ("No candidates yet. Post a job to start receiving applications.") | Just "No data" text, or nothing at all                                    | 🛑   |
| 5.3 | **Error**           | Message explaining what went wrong + how to recover + retry button                                                | No error handling, generic "Something went wrong", or exposed stack trace | 🛑   |
| 5.4 | **Populated**       | Renders correctly with realistic data — tested with long names (40+ chars), many items (50+), and maximum fields  | Only tested with placeholder data ("John Doe", 3 items)                   | ⚠️   |
| 5.5 | **Partial failure** | For bulk actions: "8 of 10 succeeded" with details for failures                                                   | Bulk action silently succeeds/fails with no per-item feedback             | 💡   |

**🛑 STOP if checks 5.1, 5.2, or 5.3 fail.** These are the most commonly skipped states and the ones users notice most.

---

## Step 6: User Journey — Cross-Screen Thinking (7 Checks)

| #   | Check                                        | Pass Criteria                                                                                                           | Fail Criteria                                                                        | Tier |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---- |
| 6.1 | **Every action gives visible feedback**      | Create → toast + redirect to created item. Update → toast. Delete → confirmation dialog THEN toast. No silent success.  | User clicks and nothing visually confirms the action                                 | 🛑   |
| 6.2 | **Destructive actions require confirmation** | Delete, reject, archive show dialog stating consequences BEFORE executing                                               | Instant delete/reject on click with no confirmation                                  | 🛑   |
| 6.3 | **Forms preserve user work**                 | `beforeunload` warning when navigating away from dirty forms                                                            | User loses data on accidental navigation                                             | 🛑   |
| 6.4 | **URL state for view configuration**         | Filters, tabs, pagination in URL — back button works, links are shareable                                               | Local-only state that disappears on back or page refresh                             | 🛑   |
| 6.5 | **Navigation returns to context**            | After editing/creating, user returns to meaningful location (created item, previous list position) — not a generic root | Save redirects to root list with no indication of what was just created              | ⚠️   |
| 6.6 | **Reversible actions offer undo**            | Archive, move, dismiss show toast with "Undo" action (5-second window)                                                  | Reversible action completes with no undo option                                      | ⚠️   |
| 6.7 | **State changes propagate**                  | Data changed on this screen is reflected on every other screen displaying that data                                     | Candidate stage changes on pipeline board but candidate profile badge doesn't update | ⚠️   |

---

## Step 7: Design System Compliance (8 Checks)

| #   | Check                                    | How to Verify                                                                                           | Fail Criteria                                                        | Tier |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---- |
| 7.1 | **No raw HTML when component exists**    | Grep for raw `<button>`, `<input>`, `<select>`, `<table>`, `<input type="checkbox">`, custom modal divs | Any raw HTML element used instead of design system component         | 🛑   |
| 7.2 | **Zero hardcoded hex colors**            | Grep for `#[0-9a-fA-F]{3,8}` in className strings                                                       | Any hardcoded hex color found                                        | 🛑   |
| 7.3 | **No hardcoded pixel spacing**           | Grep for `p-[`, `gap-[`, `m-[` with pixel values                                                        | Hardcoded px values instead of Tailwind scale                        | 🛑   |
| 7.4 | **Token tier hierarchy followed**        | Component tokens (`--button-*`, `--card-*`) used over semantic, semantic over primitive                 | Primitive token used when component/semantic token exists            | ⚠️   |
| 7.5 | **Only Phosphor Icons**                  | Grep imports for `lucide-react`, `@heroicons`, or other icon libraries                                  | Any non-Phosphor icon library imported                               | 🛑   |
| 7.6 | **Typography uses scale classes**        | All text uses `text-body`, `text-heading-sm`, `text-caption`, etc.                                      | Custom font sizes like `text-[15px]` or `text-[18px]`                | ⚠️   |
| 7.7 | **Shadow and border mutually exclusive** | No element has both `shadow-*` AND `border` classes                                                     | Shadow + border on the same element                                  | 🛑   |
| 7.8 | **Dark mode works**                      | All colors use tokens; visually verified in dark mode — text readable, contrast maintained              | Hardcoded colors break in dark mode; invisible text or lost contrast | 🛑   |

---

## Step 8: Scale Test (5 Checks)

Mentally (or actually) stress-test with extreme data:

| #   | Scenario             | Pass Criteria                                                                                                                             | Fail Criteria                                                             | Tier |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---- |
| 8.1 | **Long text**        | "Senior Director of Renewable Energy Strategy and Climate Policy" (64 chars) doesn't break layout; truncation + tooltip where appropriate | Text overflows container, breaks grid, or disappears                      | ⚠️   |
| 8.2 | **Many items**       | 200+ items: pagination or virtual scroll in place, filters work, sort is useful                                                           | No pagination, browser slows, or filters break with volume                | ⚠️   |
| 8.3 | **Many tags/skills** | 15 skills on a candidate card overflows gracefully — truncation + "and 8 more" pattern                                                    | Tags overflow container or push layout out of bounds                      | ⚠️   |
| 8.4 | **Minimal data**     | Candidate with no photo, no phone, no LinkedIn still looks intentional — not broken                                                       | Missing fields leave empty gaps, broken avatars, or misaligned layout     | ⚠️   |
| 8.5 | **Maximum data**     | Every field filled — nothing overflows, layout holds, no horizontal scroll                                                                | Content overflows, components collide, or page requires horizontal scroll | ⚠️   |

---

## Step 9: Accessibility Baseline (3 Checks)

| #   | Check                        | How to Verify                                                                        | Fail Criteria                                           | Tier |
| --- | ---------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- | ---- |
| 9.1 | **Keyboard navigable**       | Tab through the page — every interactive element is reachable, Enter/Space activates | Any interactive element unreachable by keyboard         | 🛑   |
| 9.2 | **All inputs have labels**   | Every form input has a visible `<Label>` or `aria-label`                             | Input with no associated label for screen readers       | 🛑   |
| 9.3 | **Color not sole indicator** | Status/state communicated by more than just color (icon, text, pattern)              | Color is the only way to distinguish success from error | ⚠️   |

---

## Grading

### How to Score

Count findings by tier:

| Grade | Criteria             | Meaning                                                        |
| ----- | -------------------- | -------------------------------------------------------------- |
| **A** | 0 🛑, 0-2 ⚠️, any 💡 | Ship-ready. Proud to show anyone.                              |
| **B** | 0 🛑, 3-5 ⚠️, any 💡 | Good — minor polish needed, can merge with tracked follow-ups. |
| **C** | 1-2 🛑 OR 6+ ⚠️      | Functional but needs meaningful improvements before shipping.  |
| **D** | 3-5 🛑               | Significant issues — not ready to ship. Return for rework.     |
| **F** | 6+ 🛑                | Fundamental problems — needs redesign, not fixes.              |

**Hard rule:** Any screen with even 1 🛑 finding cannot be graded above C. Fix all blockers first.

---

## Reporting Format

After completing all steps, produce this structured report:

```markdown
## Design Review: [Screen/Component Name]

**Path:** `src/app/...`
**Date:** [date]
**Grade:** [A/B/C/D/F] — [X] 🛑 blockers, [Y] ⚠️ required, [Z] 💡 recommended

### Context

- **User:** [who]
- **Task type:** [scanning/reading/acting/monitoring]
- **Primary question:** [what this screen answers]

### 🛑 Blockers (Must Fix Before Shipping)

| #   | Step         | Finding        | Fix            |
| --- | ------------ | -------------- | -------------- |
| 1   | [step.check] | [what's wrong] | [specific fix] |

### ⚠️ Required (Must Address)

| #   | Step         | Finding        | Fix                  |
| --- | ------------ | -------------- | -------------------- |
| 1   | [step.check] | [what's wrong] | [suggested approach] |

### 💡 Recommended (Should Address)

| #   | Step         | Finding        | Fix          |
| --- | ------------ | -------------- | ------------ |
| 1   | [step.check] | [what's wrong] | [suggestion] |

### What's Working Well

- [Strength 1]
- [Strength 2]
```

---

## Quick Audit (10-Point Abbreviated Version)

When time is short, run these 10 checks. Each maps to the full step it abbreviates:

| #   | Quick Check                                                       | Maps to      | Tier |
| --- | ----------------------------------------------------------------- | ------------ | ---- |
| 1   | Can you name the ONE dominant element?                            | Step 1 (1.1) | 🛑   |
| 2   | Is there exactly one primary button per section?                  | Step 1 (1.4) | 🛑   |
| 3   | Do all five states exist? (loading/empty/error/populated/partial) | Step 5       | 🛑   |
| 4   | Does every action give visible feedback? (no silent success)      | Step 6 (6.1) | 🛑   |
| 5   | Are destructive actions confirmed with consequences?              | Step 6 (6.2) | 🛑   |
| 6   | Does URL preserve view state? (back button works)                 | Step 6 (6.4) | 🛑   |
| 7   | Does every clickable element respond to hover?                    | Step 4 (4.1) | 🛑   |
| 8   | Zero hardcoded hex values in code?                                | Step 7 (7.2) | 🛑   |
| 9   | No raw HTML elements when design system component exists?         | Step 7 (7.1) | 🛑   |
| 10  | Would layout survive 64-char titles and 200+ items?               | Step 8       | ⚠️   |

**If 1 or more 🛑 checks fail → do the full review.**

---

## How This Skill Connects to Rules

This skill is the operational execution of the standards defined in:

| Rule                             | What This Skill Checks From It                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| `critical-standards.md`          | The master enforcement checklist — Steps 5, 6, 7 directly mirror its 🛑 items       |
| `engineering-excellence.md`      | The "why" — every check traces back to a principle                                  |
| `product-design-thinking.md`     | Steps 1-3 (hierarchy, IA, spatial design) — verifiable checks, not subjective       |
| `ux-thinking.md`                 | Steps 5-6 (all states, user journey) — the Five Questions and cross-screen thinking |
| `design-audit-standards.md`      | Step 7 (design system compliance) — token tiers, component usage, dark mode         |
| `design-first-implementation.md` | Step 7 (component mapping) — mandatory component usage table                        |
| `input-component-standards.md`   | Step 4 (interaction quality) — focus, hover, error patterns                         |
| `truncation-standards.md`        | Step 8 (scale test) — text overflow handling                                        |
| `code-quality-standards.md`      | Step 5 (state handling) — loading, empty, error requirements                        |

---

**This skill produces findings, not opinions. Every check is binary. Every finding has a severity. Every severity has an action.**
