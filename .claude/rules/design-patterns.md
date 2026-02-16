# Design Patterns — Canonical Examples

---

## trigger: always

When building UI, match these patterns exactly. They are the source of truth for "what good looks like" in Canopy. For full component study and precedent registry, load the `design-intelligence` rule (triggers on UI/component/page keywords).

---

## Gold Precedent Files

Study these BEFORE building. They define the Canopy aesthetic.

| Page Type      | Gold File                                              | Study For                                    |
| -------------- | ------------------------------------------------------ | -------------------------------------------- |
| Dashboard      | `src/app/canopy/dashboard/DashboardView.tsx`           | Spacing rhythm, token usage, card patterns   |
| List (server)  | `src/app/canopy/candidates/page.tsx`                   | Server component, URL state, error fallback  |
| List (client)  | `src/components/candidates/CandidatesView.tsx`         | All 4 states, bulk actions, filter bar       |
| Profile header | `src/components/candidates/CandidateProfileHeader.tsx` | Avatar, hover interactions, truncation, a11y |
| Detail section | `src/components/candidates/AboutSection.tsx`           | Semantic HTML, subcomponent extraction       |

## Spacing Rhythm

| Between               | Spacing        | Tailwind                    |
| --------------------- | -------------- | --------------------------- |
| Label → input         | 4-8px          | `gap-1` to `gap-2`          |
| Fields in form        | 16px           | `space-y-4`                 |
| Sections in card      | 24px + Divider | `space-y-6`                 |
| Cards in grid         | 16px           | `gap-4`                     |
| Page header → content | 24px           | `mb-6`                      |
| Major sections        | 32-48px        | `space-y-8` to `space-y-12` |

If all spacing is uniform `space-y-4`, hierarchy is broken. Vary it.

## Typography Rhythm

| Element         | Class              | Weight          | Color                |
| --------------- | ------------------ | --------------- | -------------------- |
| Page title      | `text-heading-sm`  | `font-bold`     | `foreground-default` |
| Section heading | `text-body-strong` | `font-semibold` | `foreground-default` |
| Body            | `text-body`        | `font-normal`   | `foreground-default` |
| Secondary       | `text-body-sm`     | `font-normal`   | `foreground-muted`   |
| Labels          | `text-caption`     | `font-medium`   | `foreground-default` |
| Metadata        | `text-caption`     | `font-normal`   | `foreground-subtle`  |

Every screen needs 3+ levels. Uniform text = broken hierarchy.

## Composition Snippet: Filter Bar

```tsx
<div className="flex flex-wrap items-center gap-4">
  <SearchInput placeholder="Search..." value={search} onChange={setSearch} className="w-64" />
  <Dropdown value={filter} onChange={setFilter} options={opts} placeholder="All" />
  {hasFilters && (
    <Button variant="ghost" size="sm" onClick={clear}>
      Clear
    </Button>
  )}
</div>
```

## Composition Snippet: All States

```tsx
if (isLoading) return <SkeletonRows count={5} />;
if (error)
  return (
    <EmptyState
      icon={<WarningCircle size={48} />}
      title="Something went wrong"
      action={<Button onClick={retry}>Try again</Button>}
    />
  );
if (data.length === 0)
  return (
    <EmptyState
      icon={<Plus size={48} />}
      title="No items yet"
      action={<Button>Create first</Button>}
    />
  );
return <DataTable columns={columns} data={data} />;
```
