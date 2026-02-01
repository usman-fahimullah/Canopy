# Candid Visual Design Fixes

## The Core Problem

Looking at the screenshots, Candid pages feel **flat, sparse, and disconnected**. The root causes:

1. **No visual containment** — Content floats in white void
2. **No page structure** — Missing clear header/content/footer zones
3. **No depth hierarchy** — Everything is on the same visual plane
4. **Empty states feel cold** — Basic icons in empty space
5. **No visual rhythm** — Inconsistent spacing and density

---

## Universal Fix: Page Layout Pattern

### Before (Current)

```
┌─────────────────────────────────────────────┐
│  Sidebar  │            White Void           │
│           │                                 │
│           │    Title                        │
│           │    Subtitle                     │
│           │                                 │
│           │        Content floating...      │
│           │                                 │
│           │                                 │
│           │                                 │
└─────────────────────────────────────────────┘
```

### After (Fixed)

```
┌─────────────────────────────────────────────┐
│  Sidebar  │  ┌─────────────────────────┐    │
│           │  │  PAGE HEADER            │    │  ← Contained header zone
│           │  │  Title · Actions        │    │
│           │  └─────────────────────────┘    │
│           │  ┌─────────────────────────┐    │
│           │  │                         │    │  ← Main content card
│           │  │    Content in card      │    │
│           │  │                         │    │
│           │  └─────────────────────────┘    │
│           │                                 │
└─────────────────────────────────────────────┘
```

---

## Fix #1: Create a Page Container Component

Create `/src/app/candid/components/PageContainer.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

interface PageContentProps {
  children: React.ReactNode;
  variant?: "card" | "split" | "transparent";
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen pb-24 lg:pb-8", className)}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        "border-b border-[var(--border-default)] pb-6", // ← Add visual separation
        className
      )}
    >
      <div>
        <h1 className="text-foreground-default text-heading-md font-semibold">{title}</h1>
        {description && <p className="mt-1 text-body text-foreground-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function PageContent({ children, variant = "card", className }: PageContentProps) {
  const variants = {
    card: "bg-white rounded-xl shadow-sm border border-[var(--border-default)] p-6",
    split: "bg-white rounded-xl shadow-sm border border-[var(--border-default)] overflow-hidden",
    transparent: "",
  };

  return <div className={cn(variants[variant], className)}>{children}</div>;
}
```

---

## Fix #2: Enhance Empty States

The current empty states are just icons floating in space. Make them feel **warmer and more inviting**.

### Current Empty State

```
        ○
   No sessions found
   Book your first...
   [Button]
```

### Enhanced Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│           ┌───────────────┐             │
│           │   Warm icon   │   ← Larger, colored background
│           │   with tint   │
│           └───────────────┘             │
│                                         │
│        No sessions yet                  │   ← Friendlier copy
│                                         │
│    Start your journey by booking        │   ← Helpful guidance
│    a session with a climate coach       │
│                                         │
│         [ Browse Coaches ]              │   ← Clear action
│                                         │
└─────────────────────────────────────────┘
```

Update `EmptyState` or wrap it in Candid pages:

```tsx
// In pages, wrap empty state in a visual container
<div className="flex items-center justify-center py-16">
  <div className="max-w-sm text-center">
    {/* Icon with background */}
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primitive-green-100)] to-[var(--primitive-blue-100)]">
      <CalendarBlank size={36} className="text-[var(--primitive-green-700)]" />
    </div>

    {/* Friendlier title */}
    <h3 className="text-foreground-default mb-2 text-heading-sm font-semibold">No sessions yet</h3>

    {/* Helpful description */}
    <p className="mb-6 text-body text-foreground-muted">
      Start your journey by booking a session with an experienced climate professional
    </p>

    {/* Clear action */}
    <Button variant="primary">Browse Coaches</Button>
  </div>
</div>
```

---

## Fix #3: Sessions Page Layout

### Current Issues

- Title floats at top
- Error message is harsh red text
- Filter bar feels disconnected
- Empty state is inside a card that's too sparse

### Fixed Layout

```tsx
// sessions/page.tsx
return (
  <PageContainer>
    <PageHeader
      title="Sessions"
      description="Manage your coaching and mentoring sessions"
      actions={
        <Button variant="primary" leftIcon={<CalendarPlus size={18} />} asChild>
          <Link href="/candid/browse">Book a Session</Link>
        </Button>
      }
    />

    {/* Error Toast - not inline */}
    {error && <ErrorToast message={error} />}

    {/* Toolbar - contained */}
    <div className="mb-6 flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-white p-3">
      <div className="flex items-center gap-2">{/* filters */}</div>
      <div className="flex items-center gap-1">{/* view toggle */}</div>
    </div>

    {/* Content Card */}
    <PageContent variant="card">
      {filteredSessions.length === 0 ? <EnhancedEmptyState /> : <SessionsList />}
    </PageContent>
  </PageContainer>
);
```

---

## Fix #4: Messages Page Layout

### Current Issues

- Left panel has "Messages" title that looks disconnected
- The empty state on right is too minimal
- No visual hierarchy between list and content

### Fixed Layout

The Messages page already uses a Card wrapper, but needs:

1. **Better empty state in left panel**:

```tsx
{
  /* When no conversations */
}
<div className="flex h-full flex-col items-center justify-center p-8 text-center">
  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primitive-green-100)] to-[var(--primitive-blue-100)]">
    <ChatCircle size={28} className="text-[var(--primitive-green-700)]" />
  </div>
  <p className="text-foreground-default mb-1 text-body-strong">No conversations yet</p>
  <p className="mb-4 text-caption text-foreground-muted">Find a mentor to start chatting</p>
  <Button variant="primary" size="sm" asChild>
    <Link href="/candid/browse">Find a Mentor</Link>
  </Button>
</div>;
```

2. **Better right panel empty state**:

```tsx
{
  /* When no thread selected */
}
<div className="flex h-full flex-col items-center justify-center bg-[var(--background-subtle)] p-8 text-center">
  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
    <ChatCircle size={36} className="text-[var(--primitive-green-600)]" />
  </div>
  <h3 className="text-foreground-default mb-2 text-heading-sm font-semibold">
    Select a conversation
  </h3>
  <p className="max-w-xs text-body text-foreground-muted">
    Choose a conversation from the list to start messaging
  </p>
</div>;
```

---

## Fix #5: Browse Page Layout

### Current Issues

- Stats line "0 coaches • 0.0 avg rating" looks awkward
- Search bar floating
- Error state too basic

### Fixed Layout

```tsx
return (
  <PageContainer>
    <PageHeader
      title="Find a Coach"
      description="Connect with experienced climate professionals who can guide your career transition"
    />

    {/* Search & Filter Bar - Contained */}
    <div className="mb-6 rounded-xl border border-[var(--border-default)] bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Search by name, expertise, or sector..."
          className="lg:max-w-md"
        />
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Funnel />}>
            Filters
          </Button>
          <Select defaultValue="highest">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            {/* ... */}
          </Select>
        </div>
      </div>
    </div>

    {/* Results Header */}
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-heading-sm font-semibold">All Coaches</h2>
        <Badge variant="neutral">{coaches.length}</Badge>
      </div>
      <ViewToggle value={viewMode} onChange={setViewMode} />
    </div>

    {/* Results - in card */}
    <PageContent variant="card">
      {coaches.length === 0 ? <EnhancedEmptyState /> : <CoachGrid />}
    </PageContent>
  </PageContainer>
);
```

---

## Fix #6: Dashboard Page

### Current Issues

- "Good morning" + subtitle float at top
- Progress section has no container
- Right sidebar feels disconnected on large screens
- Too much white space below progress

### Fixed Layout

```tsx
return (
  <div className="flex min-h-screen">
    <div className="min-w-0 flex-1">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:mx-0 xl:px-10">
        {/* Hero Header - with subtle background */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[var(--primitive-green-50)] to-[var(--primitive-blue-50)] p-6 lg:p-8">
          <h1 className="text-foreground-default text-heading-md">{getGreeting()}!</h1>
          <p className="mt-1 text-body text-foreground-muted">
            Here's what's happening with your climate career journey
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="primary">Find a Coach</Button>
            <Button variant="secondary">My Sessions</Button>
          </div>
        </div>

        {/* Progress - in a card */}
        <section className="mb-8">
          <h2 className="text-foreground-default mb-4 text-heading-sm">My Progress</h2>
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">{/* Progress items */}</div>
          </div>
        </section>

        {/* ... rest */}
      </div>
    </div>

    {/* Sidebar - unchanged, but content area is now better structured */}
  </div>
);
```

---

## Fix #7: Global CSS Tokens to Add

Add to `globals.css`:

```css
:root {
  /* Candid-specific semantic tokens */
  --candid-page-bg: #faf9f7;
  --candid-card-bg: #ffffff;
  --candid-header-gradient-from: var(--primitive-green-50);
  --candid-header-gradient-to: var(--primitive-blue-50);
  --candid-empty-icon-bg: linear-gradient(
    135deg,
    var(--primitive-green-100),
    var(--primitive-blue-100)
  );

  /* Make sure these are defined */
  --candid-background-subtle: var(--primitive-green-50);
  --candid-foreground-brand: var(--primitive-green-800);
}
```

---

## Summary: The 7 Visual Fixes

| #   | Fix                         | Impact                                             |
| --- | --------------------------- | -------------------------------------------------- |
| 1   | **PageContainer component** | Consistent padding, max-width, structure           |
| 2   | **Enhanced empty states**   | Warmer icons, better copy, clearer CTAs            |
| 3   | **Sessions page structure** | Header separation, contained toolbar, card wrapper |
| 4   | **Messages page polish**    | Better empty states for both panels                |
| 5   | **Browse page structure**   | Contained search bar, proper results header        |
| 6   | **Dashboard hero section**  | Gradient background, contained progress section    |
| 7   | **CSS tokens**              | Define missing Candid-specific tokens              |

---

## Before / After Mental Model

### Before

- Pages = Title + floating content + white void
- Empty states = gray icon + text
- No visual hierarchy

### After

- Pages = Header zone + toolbar + content card
- Empty states = warm gradient icon + helpful text + clear action
- Clear depth hierarchy: background → card → content

---

## Implementation Priority

1. **P0**: Create PageContainer component and apply to Sessions, Browse
2. **P0**: Fix empty states across all pages
3. **P1**: Add dashboard hero gradient section
4. **P1**: Define missing CSS tokens
5. **P2**: Polish Messages page empty states
