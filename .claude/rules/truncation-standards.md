# Truncation Standards

---

## trigger: truncate, truncation, line-clamp, ellipsis, overflow, text overflow, long text, clamp

This rule defines how text truncation works across all Canopy products (Green Jobs Board, Canopy ATS, Candid). Every truncated element must follow these conventions to ensure consistency, accessibility (tooltip on hidden content), and correct flex layout behavior.

Related rules: `design-audit-standards.md` for general design compliance, `design-first-implementation.md` for component-first workflow.

---

## Core Decisions

| Decision                   | Standard                         | Rationale                                                                  |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| **Single-line truncation** | Tailwind `truncate` class        | One utility, not the longhand trio                                         |
| **Multi-line truncation**  | Tailwind `line-clamp-N`          | Built-in, responsive-friendly                                              |
| **Tooltip on single-line** | Required for user-generated text | Hidden content must be discoverable                                        |
| **Tooltip on multi-line**  | Not required                     | Most content is still visible                                              |
| **Flex layout safety**     | `min-w-0` on the flex parent     | Without it, `truncate` has no effect                                       |
| **Preferred component**    | `<TruncateText>` for single-line | Pairs truncation + tooltip automatically                                   |
| **Server-side truncation** | Avoid for rendered text          | Use CSS truncation; JS `truncate()` only for meta (OG tags, API responses) |

---

## Content Type Conventions

These conventions apply everywhere the content type appears — ATS, job seeker portal, and Candid.

| Content Type                 | Method                           | Lines | Tooltip? | Context                             |
| ---------------------------- | -------------------------------- | ----- | -------- | ----------------------------------- |
| **Job title** (card/list)    | `line-clamp-2`                   | 2     | No       | Cards, list items                   |
| **Job title** (table/navbar) | `<TruncateText>`                 | 1     | Yes      | Table cells, navigation             |
| **Company name**             | `<TruncateText>`                 | 1     | Yes      | Always single-line                  |
| **Person name**              | `<TruncateText>`                 | 1     | Yes      | Always with tooltip                 |
| **Email / URL**              | `<TruncateText>`                 | 1     | Yes      | Always with tooltip                 |
| **Description / bio**        | `line-clamp-3`                   | 3     | No       | Cards, preview panels               |
| **Note content**             | Size-based clamp                 | 2/3/4 | No       | Follows `job-note-card.tsx` pattern |
| **Category tags**            | `CategoryTag variant="truncate"` | 1     | Built-in | Tables: 140px, cards: 100px         |
| **Chip text**                | Built-in `truncate`              | 1     | No       | Handled internally by Chip          |
| **Activity text**            | Expandable clamp                 | 2→all | No       | `line-clamp-2` with expand toggle   |

---

## Component: `<TruncateText>`

Use `<TruncateText>` for any single-line truncated user-generated text. It pairs the `truncate` class with a `SimpleTooltip` automatically.

```tsx
import { TruncateText } from "@/components/ui";

// Basic — single-line with tooltip
<TruncateText>Long company name that might overflow</TruncateText>

// Multi-line — no tooltip, just clamping
<TruncateText lines={3}>Long description text...</TruncateText>

// With custom styling
<TruncateText className="text-caption text-foreground-muted">user@email.com</TruncateText>
```

**When to use `<TruncateText>` vs raw `truncate` class:**

| Scenario                                                                              | Use                                |
| ------------------------------------------------------------------------------------- | ---------------------------------- |
| Names, emails, URLs, company names                                                    | `<TruncateText>`                   |
| Inside a component that already handles truncation (ListItemTitle, Chip, CategoryTag) | Raw `truncate` (already built-in)  |
| Multi-line clamping (descriptions, bios)                                              | `line-clamp-N` directly            |
| Static UI labels that never overflow                                                  | Raw `truncate` (no tooltip needed) |

---

## Mandatory Patterns

### 1. Flex Layout Safety

Every truncated element inside a flex container MUST have `min-w-0` on its parent:

```tsx
// ❌ WRONG — truncate has no effect in flex without min-w-0
<div className="flex items-center gap-2">
  <span className="truncate">{name}</span>
</div>

// ✅ CORRECT — min-w-0 allows flex child to shrink below content size
<div className="flex min-w-0 items-center gap-2">
  <span className="truncate">{name}</span>
</div>

// ✅ ALSO CORRECT — min-w-0 + flex-1 on the truncating wrapper
<div className="flex items-center gap-2">
  <div className="min-w-0 flex-1">
    <TruncateText>{name}</TruncateText>
  </div>
  <Badge>Active</Badge>
</div>
```

### 2. Table Cell Truncation

Table cells with truncated text must have a constrained width:

```tsx
// ✅ CORRECT — max-width constrains the truncation
<td className="max-w-[200px]">
  <TruncateText>{job.title}</TruncateText>
</td>

// ✅ ALSO CORRECT — DataTable column definition with size
{ accessorKey: "title", header: "Title", size: 200 }
```

### 3. Responsive Truncation

When text should only truncate at smaller viewpoints:

```tsx
// ✅ CORRECT — responsive max-width
<h1 className="xl:truncate-none max-w-[200px] truncate md:max-w-[300px] xl:max-w-none">{title}</h1>
```

---

## Banned Patterns

| Pattern                                           | Why                                         | Fix                              |
| ------------------------------------------------- | ------------------------------------------- | -------------------------------- |
| `text-ellipsis overflow-hidden whitespace-nowrap` | Longhand for `truncate`                     | Use `truncate` class             |
| `truncate` without `min-w-0` in flex              | Truncation won't work                       | Add `min-w-0` to flex parent     |
| Single-line truncated name/email without tooltip  | User can't discover full value              | Use `<TruncateText>`             |
| JS `truncate()` for client-rendered text          | CSS is better — responsive, no layout shift | Use `truncate` or `line-clamp-N` |
| `line-clamp-1`                                    | Equivalent to `truncate` but heavier        | Use `truncate` class             |
| Custom `style={{ maxWidth }}` for truncation      | Inconsistent, not responsive                | Use Tailwind `max-w-[...]`       |

---

## Existing Components with Built-in Truncation

These components already handle truncation internally. Do NOT add extra truncation classes:

| Component                        | File               | Behavior                      |
| -------------------------------- | ------------------ | ----------------------------- |
| `ListItemTitle`                  | `list-item.tsx`    | Single-line `truncate`        |
| `ListItemDescription`            | `list-item.tsx`    | Single-line `truncate`        |
| `Chip`                           | `chip.tsx`         | Content span has `truncate`   |
| `CategoryTag variant="truncate"` | `category-tag.tsx` | Truncate with `maxWidth` prop |
| `PathwayTag`                     | `pathway-tag.tsx`  | Uses truncation classes       |

---

## Checklist for Text Display

Before completing any UI task that displays text:

- [ ] Long text has appropriate truncation method from conventions table
- [ ] Single-line truncated user content uses `<TruncateText>` (tooltip included)
- [ ] Flex containers with truncated children have `min-w-0`
- [ ] Table columns with truncated text have a `max-w-[...]` or `size` constraint
- [ ] No `line-clamp-1` used (use `truncate` instead)
- [ ] No longhand `text-ellipsis overflow-hidden whitespace-nowrap` (use `truncate`)
- [ ] Existing components with built-in truncation are not double-truncated
- [ ] Multi-line clamp matches conventions (descriptions: 3, titles: 2, notes: size-based)
