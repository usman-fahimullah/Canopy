# ListItem Component Specification

> **Status**: Revised Proposal
> **Figma Source**: [Trails Design System](https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System)
> **Pattern Reference**: `Timeline`, `TimelineItem` (composable primitives)

---

## Summary

After reviewing the existing design system (102 components), most Figma patterns are already covered:

| Figma Pattern    | Existing Component                             |
| ---------------- | ---------------------------------------------- |
| Activity items   | `ActivityFeed`, `ActivityItem`                 |
| Timeline/history | `Timeline`, `TimelineItem`                     |
| Candidate rows   | `CandidateCard` (compound)                     |
| Progress meters  | `ProgressMeterCircular`, `ProgressMeterLinear` |
| Avatar stacks    | `AvatarGroup`                                  |
| Status badges    | `Badge`, `StageBadge`                          |

**What's missing**: A simple, generic list row primitive for settings, navigation, and simple data rows.

---

## Design Philosophy

Follow the **Timeline pattern** — simple, composable primitives — not the CandidateCard pattern (domain-rich compound component).

**Guiding Principles:**

1. Minimal props, maximum composability
2. Slots for content, not configuration objects
3. CVA for variants
4. CSS variable tokens only (no hardcoded colors)
5. forwardRef on all components

---

## Component Architecture

```tsx
<List>
  <ListItem>
    <ListItemLeading>
      <Avatar />
    </ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Title</ListItemTitle>
      <ListItemDescription>Description</ListItemDescription>
    </ListItemContent>
    <ListItemTrailing>
      <Button size="sm">Action</Button>
    </ListItemTrailing>
  </ListItem>
</List>
```

### Why Composable?

```tsx
// ❌ Configuration-heavy (old approach)
<ListItem
  leadingContent={{ type: "avatar", src: "...", shape: "rounded" }}
  trailingContent={{ type: "button", label: "Apply", onClick: fn }}
  statusBadge={{ variant: "error", label: "Closing" }}
  avatarStack={{ avatars: [...], label: "40 Applicants" }}
/>

// ✅ Composable (new approach) - use existing components
<ListItem>
  <ListItemLeading>
    <Avatar src="..." shape="rounded" />
  </ListItemLeading>
  <ListItemContent>
    <Badge variant="error">Closing Soon</Badge>
    <ListItemTitle>Business Engagement Officer</ListItemTitle>
    <ListItemDescription>Capital Good Fund</ListItemDescription>
    <ListItemMeta>
      <span>Atlanta, GA</span>
      <AvatarGroup avatars={[...]} />
      <span>40 Applicants</span>
    </ListItemMeta>
  </ListItemContent>
  <ListItemTrailing>
    <Button variant="secondary" size="sm">View Job</Button>
  </ListItemTrailing>
</ListItem>
```

---

## Components

### List (Container)

```tsx
const listVariants = cva("flex flex-col", {
  variants: {
    divided: {
      true: "divide-y divide-[var(--border-muted)]",
      false: "",
    },
    spacing: {
      none: "gap-0",
      sm: "gap-1",
      md: "gap-2",
    },
  },
  defaultVariants: {
    divided: false,
    spacing: "none",
  },
});

interface ListProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listVariants> {
  children: React.ReactNode;
}
```

### ListItem (Row Container)

```tsx
const listItemVariants = cva("relative flex items-center gap-3 transition-colors", {
  variants: {
    size: {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-6 py-4",
    },
    interactive: {
      true: "cursor-pointer hover:bg-[var(--background-interactive-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-inset",
      false: "",
    },
    selected: {
      true: "bg-[var(--background-interactive-selected)]",
      false: "",
    },
    disabled: {
      true: "opacity-50 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    interactive: false,
    selected: false,
    disabled: false,
  },
});

interface ListItemProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listItemVariants> {
  /** Render as link */
  asChild?: boolean;
}
```

### ListItemLeading (Left Slot)

```tsx
const ListItemLeading = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
  )
);
```

### ListItemContent (Center Slot)

```tsx
const ListItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0 flex-1 space-y-0.5", className)} {...props} />
  )
);
```

### ListItemTitle

```tsx
const ListItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "truncate text-body-sm font-medium text-[var(--foreground-default)]",
        className
      )}
      {...props}
    />
  )
);
```

### ListItemDescription

```tsx
const ListItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("truncate text-caption text-[var(--foreground-muted)]", className)}
      {...props}
    />
  )
);
```

### ListItemMeta

```tsx
const ListItemMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-caption text-[var(--foreground-subtle)]",
        className
      )}
      {...props}
    />
  )
);
```

### ListItemTrailing (Right Slot)

```tsx
const ListItemTrailing = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-shrink-0 items-center gap-2", className)} {...props} />
  )
);
```

---

## Design Tokens

| Property              | Token                                    |
| --------------------- | ---------------------------------------- |
| Background (default)  | transparent                              |
| Background (hover)    | `var(--background-interactive-hover)`    |
| Background (selected) | `var(--background-interactive-selected)` |
| Text (title)          | `var(--foreground-default)`              |
| Text (description)    | `var(--foreground-muted)`                |
| Text (meta)           | `var(--foreground-subtle)`               |
| Border (divider)      | `var(--border-muted)`                    |
| Focus ring            | `var(--border-interactive-focus)`        |

---

## Usage Examples

### Simple Setting Row

```tsx
<List divided>
  <ListItem interactive onClick={handleClick}>
    <ListItemLeading>
      <Bell size={20} />
    </ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Notifications</ListItemTitle>
      <ListItemDescription>Manage notification preferences</ListItemDescription>
    </ListItemContent>
    <ListItemTrailing>
      <CaretRight size={16} className="text-[var(--foreground-subtle)]" />
    </ListItemTrailing>
  </ListItem>
</List>
```

### Job Listing (Reusing Existing Components)

```tsx
<List divided>
  <ListItem size="lg">
    <ListItemLeading>
      <Avatar src="/company.png" size="lg" shape="rounded" />
    </ListItemLeading>
    <ListItemContent>
      <div className="flex items-center gap-2">
        <Badge variant="error" size="sm">
          Closing Soon
        </Badge>
      </div>
      <ListItemTitle>Business Engagement Officer</ListItemTitle>
      <ListItemDescription>Capital Good Fund</ListItemDescription>
      <ListItemMeta>
        <span>Atlanta, GA</span>
        <span>·</span>
        <AvatarGroup avatars={applicants} size="xs" max={3} />
        <span>40 Applicants</span>
      </ListItemMeta>
    </ListItemContent>
    <ListItemTrailing>
      <Button variant="secondary" size="sm">
        View Job
      </Button>
    </ListItemTrailing>
  </ListItem>
</List>
```

### Selection List

```tsx
<List>
  {items.map((item) => (
    <ListItem
      key={item.id}
      interactive
      selected={selectedId === item.id}
      onClick={() => setSelectedId(item.id)}
    >
      <ListItemContent>
        <ListItemTitle>{item.name}</ListItemTitle>
      </ListItemContent>
      {selectedId === item.id && (
        <ListItemTrailing>
          <Check size={16} className="text-[var(--foreground-success)]" />
        </ListItemTrailing>
      )}
    </ListItem>
  ))}
</List>
```

### With Progress Indicator

```tsx
<ListItem size="lg">
  <ListItemLeading>
    <ProgressMeterCircular value={35} size="md" />
  </ListItemLeading>
  <ListItemContent>
    <ListItemTitle>Complete Interview Prep</ListItemTitle>
    <ListItemDescription>35% complete</ListItemDescription>
  </ListItemContent>
</ListItem>
```

---

## What This Component Does NOT Do

These use cases have **existing, better-suited components**:

| Use Case                          | Use Instead                      |
| --------------------------------- | -------------------------------- |
| Activity feeds with icons         | `ActivityFeed`, `ActivityItem`   |
| Timeline/history with connectors  | `Timeline`, `TimelineItem`       |
| Candidate cards with rich actions | `CandidateCard`                  |
| Data tables                       | `DataTable`, `EnhancedDataTable` |
| Navigation menus                  | Sidebar nav components           |
| Complex cards with media          | `Card` with custom content       |

---

## Exports

```typescript
// src/components/ui/list-item.tsx
export {
  List,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemTrailing,
};

// Types
export type { ListProps, ListItemProps };
```

---

## Accessibility

| Feature        | Implementation                       |
| -------------- | ------------------------------------ |
| Keyboard nav   | `Tab` to focus interactive items     |
| Activation     | `Enter`/`Space` on interactive items |
| Focus visible  | Ring using `focus-visible:ring-2`    |
| Disabled state | `aria-disabled` + visual treatment   |
| Selected state | `aria-selected` for selection lists  |

---

## Implementation Checklist

- [ ] Create `/src/components/ui/list-item.tsx`
- [ ] Export from `/src/components/ui/index.ts`
- [ ] Add to design system nav in `/src/lib/design-system-nav.ts`
- [ ] Create docs page at `/src/app/design-system/components/list-item/page.tsx`
- [ ] Verify dark mode works
- [ ] Run `pnpm build` to check types

---

## Comparison: Before vs After

| Aspect                     | Old Spec               | New Spec                          |
| -------------------------- | ---------------------- | --------------------------------- |
| Props count                | 20+                    | 4-5 per component                 |
| Config objects             | 5 discriminated unions | 0                                 |
| Lines of types             | ~150                   | ~30                               |
| Composability              | Low (all-in-one)       | High (slot-based)                 |
| Learning curve             | High                   | Low (follows Timeline pattern)    |
| Reuses existing components | No (reimplements)      | Yes (Avatar, Badge, Button, etc.) |
