# Engineering Excellence

---

## trigger: always

**This is the foundational rule. It governs the spirit behind every other rule in this codebase.** The enforcement layer is `critical-standards.md` — that rule contains the specific, verifiable checks. This rule explains _why_ those checks exist.

All other rules — `critical-standards.md`, `product-design-thinking.md`, `ux-thinking.md`, `scale-first-engineering.md`, `code-quality-standards.md`, `design-first-implementation.md`, `design-audit-standards.md`, `pre-merge-checklist.md` — are expressions of this philosophy.

---

## The Standard

We are building Canopy to be the best ATS in the climate hiring space. Every line of code, every component, every interaction reflects that ambition.

**The question is never "does this work?" The question is "is this the best version of this we can build?"**

---

## The Four Principles

### 1. Build It Right the First Time

There is no "rough draft" phase. Every commit is production-quality. We don't ship things we'd need to come back and fix — because we won't come back, and the fix won't happen.

**Concrete meaning:**

- The auth check takes 5 lines. Write it now, not as a TODO.
- The Zod schema takes 10 lines. Define it now, not "when we harden the API."
- The empty state takes one component. Build it now, not "when we polish."
- The loading skeleton takes 3 lines. Add it now, not "if users complain."

### 2. Use the System, Don't Bypass It

The design system, token hierarchy, and component library represent hundreds of decisions already made. Using them is faster AND better than reinventing from scratch.

**Concrete meaning:**

- See `<button>` → replace with `<Button>`. Every time. No exceptions.
- See `#0A3D2C` → replace with `var(--button-primary-background)`. Every time.
- See `rounded-[16px]` → replace with `var(--radius-card)`. Every time.
- See `p-[24px]` → replace with `p-6`. Every time.

### 3. Handle Every State

Real users on real networks encounter every failure mode. If it can happen, we handle it. "That shouldn't happen" is not a UX strategy.

**Concrete meaning:**

- Every list: loading skeleton, empty state with CTA, error state with retry, populated state.
- Every mutation: success toast, error toast with recovery, loading indicator on the trigger.
- Every destructive action: confirmation dialog with consequences stated.
- Every form: dirty-state warning on navigation, field-level validation errors.

### 4. Think Beyond the Screen

A screen is a moment in a journey. It has a before, a during, and an after. If you only build the during, you're building a painting, not a product.

**Concrete meaning:**

- After creating something, redirect to the created item + show success toast. Don't dump the user on a generic list.
- Filters, tabs, and pagination go in the URL. The back button must work. Links must be shareable.
- When data changes on one screen, every other screen showing that data must reflect the change.
- Trace every state change through the entire app: pipeline move → candidate profile badge → job stats → dashboard summary → activity feed.

---

## The Compound Effect

Shortcuts compound. One hardcoded color becomes a dozen and dark mode breaks. One skipped loading state becomes a pattern and the app feels unpolished everywhere. One `any` type becomes a codebase where TypeScript's protections are meaningless.

**Every shortcut teaches the codebase that shortcuts are acceptable.** Every time you do it right, you raise the floor for everything that follows.

---

## When You're Tempted to Cut Corners

1. **Pause.** The urge to shortcut is a signal.
2. **Check `critical-standards.md`.** The non-negotiable checklist. Every 🛑 item is a hard blocker.
3. **Do the right thing anyway.** It almost never takes as long as you think.
4. **If you genuinely can't finish it properly** — flag it explicitly to the user. A documented known limitation is infinitely better than a hidden shortcut.

---

## How This Rule Interacts With Others

| Rule                             | What It Enforces                                                               |
| -------------------------------- | ------------------------------------------------------------------------------ |
| `critical-standards.md`          | **The enforcement layer** — non-negotiable checks with priority tiers (🛑⚠️💡) |
| `design-intelligence.md`         | **Design taste** — codebase precedent study + industry design principles (24)  |
| `product-design-thinking.md`     | Design judgment, visual hierarchy, interaction quality                         |
| `ux-thinking.md`                 | Full user journey, cross-screen thinking, all states                           |
| `scale-first-engineering.md`     | Multi-tenant architecture, pagination, query safety                            |
| `code-quality-standards.md`      | Auth, validation, logging, type safety                                         |
| `design-first-implementation.md` | Component-first workflow, token reconciliation                                 |
| `design-audit-standards.md`      | Token compliance, shadow/border rule, dark mode                                |
| `figma-implementation.md`        | Token reference (3-tier hierarchy lookup)                                      |
| `input-component-standards.md`   | Focus, hover, error patterns for all form controls                             |
| `truncation-standards.md`        | Text overflow handling, flex safety                                            |
| `pre-merge-checklist.md`         | PR review quality gates                                                        |
| `component-documentation.md`     | 12-section documentation standard                                              |
| `no-external-companies.md`       | Brand-neutral demo data                                                        |

---

## The Bottom Line

We are building a product that climate-focused employers will trust to manage their most important asset: their people. That trust is earned in the details — and verified against `critical-standards.md` before anything ships.

**Build it like it matters. Because it does.**
