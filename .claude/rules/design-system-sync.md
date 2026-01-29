# Design System Documentation Sync Rule

---
trigger: component, ui, create component, update component, new component, modify component
---

## Rule

**Whenever a UI component in `/src/components/ui/` is created or modified, the design system documentation MUST also be updated.**

This ensures the design system documentation stays in sync with the actual component implementation.

---

## Required Actions

### When Creating a New Component

1. **Create the component** in `/src/components/ui/[component-name].tsx`
2. **Export the component** from `/src/components/ui/index.ts`
3. **Add to navigation** in `/src/lib/design-system-nav.ts`:
   - Add to the appropriate category in `componentsNav`
   - Add to `searchIndex` with relevant keywords
4. **Create documentation page** at `/src/app/design-system/components/[component-name]/page.tsx`

### When Modifying an Existing Component

1. **Update the component** in `/src/components/ui/`
2. **Update documentation page** to reflect changes:
   - Update props tables if props changed
   - Add new examples for new features
   - Update "Basic Usage" if API changed

---

## Documentation Page Checklist

Every component documentation page should include:

| Section | Required | Description |
|---------|----------|-------------|
| Overview | ✅ | Component purpose, when to use/not use |
| Anatomy | ✅ | Component parts breakdown |
| Basic Usage | ✅ | Simplest working example with code |
| Variants | If applicable | All visual variants |
| Sizes | If applicable | All size options |
| States | If applicable | Interactive states (hover, focus, disabled) |
| Controlled Usage | For inputs | Example with React state |
| Props Tables | ✅ | Complete API documentation |
| Usage Guidelines | ✅ | Do's and Don'ts |
| Accessibility | ✅ | Keyboard, ARIA, screen reader info |
| Related Components | Recommended | Links to similar components |
| Real-World Examples | Recommended | Practical use cases |

---

## Navigation Config Structure

### Adding to `componentsNav`

```typescript
// In /src/lib/design-system-nav.ts

// Find the appropriate category (overlays, form-controls, data-display, etc.)
{
  id: "overlays",
  label: "Overlays",
  href: "/design-system/components/overlays",
  children: [
    // Add your component here in alphabetical order within the category
    { id: "component-name", label: "Component Name", href: "/design-system/components/component-name" },
  ],
}
```

### Adding to `searchIndex`

```typescript
// Add with relevant keywords for searchability
{
  id: "component-name",
  title: "Component Name",
  category: "Category",
  href: "/design-system/components/component-name",
  keywords: ["keyword1", "keyword2", "keyword3"]
},
```

---

## Props Documentation Guidelines

Props tables must match the actual component interface exactly:

```typescript
const componentProps = [
  {
    name: "propName",           // Exact prop name from interface
    type: '"option1" | "option2"', // Exact TypeScript type
    default: '"option1"',       // Default value (if any)
    required: true,             // Only if prop is required
    description: "Clear description of what this prop does",
  },
];
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component file | kebab-case | `coach-tip.tsx` |
| Component export | PascalCase | `CoachTip` |
| Documentation folder | kebab-case | `/components/coach-tip/` |
| Navigation ID | kebab-case | `"coach-tip"` |

---

## Verification Steps

Before completing the task, verify:

- [ ] Component is exported from `/src/components/ui/index.ts`
- [ ] Navigation config updated in `/src/lib/design-system-nav.ts`
- [ ] Documentation page created/updated
- [ ] Props table matches component interface
- [ ] `pnpm build` passes without errors
- [ ] Examples in documentation actually work

---

## Quick Reference: Common Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `form-controls` | User input components | Input, Select, Checkbox, Switch |
| `data-display` | Showing information | Badge, Avatar, Card, Toast |
| `overlays` | Popups and modals | Dialog, Modal, Tooltip, Popover |
| `navigation` | Moving between content | Tabs, Breadcrumbs, Pagination |
| `layout` | Structure and utility | Separator, Spinner, ScrollArea |
| `editors` | Text editing | Toolbar, RichTextEditor |
| `data` | Tables and charts | DataTable, Charts, FilterPanel |
| `ats` | ATS-specific | Kanban, CandidateCard, Scorecard |
