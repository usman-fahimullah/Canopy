---
name: component-docs
description: Component documentation standards for Canopy design system. Use when creating UI components, updating component docs, adding Storybook stories, or documenting props. Covers required sections, templates, accessibility documentation, and verification checklists.
---

# Component Documentation Skill

## Purpose

Ensure consistent, comprehensive documentation for all UI components in the Canopy design system. Every component must have proper documentation to enable team members to use components correctly.

## When to Use This Skill

Automatically activates when:

- Creating new UI components
- Updating existing component documentation
- Adding Storybook stories
- Documenting component props and variants
- Reviewing component documentation

---

## Quick Reference: Required Sections

Every component documentation page **MUST** include these 12 sections:

| #   | Section                 | Required           | Description                                             |
| --- | ----------------------- | ------------------ | ------------------------------------------------------- |
| 1   | **Overview**            | ✅                 | Purpose, when to use, when NOT to use                   |
| 2   | **Anatomy**             | ✅                 | Visual breakdown of component parts                     |
| 3   | **Basic Usage**         | ✅                 | Simplest working example with code                      |
| 4   | **Variants**            | ✅                 | All visual variants with labels                         |
| 5   | **Sizes**               | ✅ (if applicable) | All size options side-by-side                           |
| 6   | **States**              | ✅                 | Default, hover, focus, active, disabled, loading, error |
| 7   | **Controlled Usage**    | ✅ (for inputs)    | Example with React state                                |
| 8   | **Props Table**         | ✅                 | Complete API documentation                              |
| 9   | **Do's and Don'ts**     | ✅                 | Visual examples of correct/incorrect usage              |
| 10  | **Accessibility**       | ✅                 | Keyboard, ARIA, screen reader info                      |
| 11  | **Related Components**  | Recommended        | Links to similar components                             |
| 12  | **Real-World Examples** | Recommended        | 2-3 practical use cases                                 |

---

## Pre-Implementation Checklist

### Before Writing Code

1. **Check if component exists:**

   ```bash
   grep -r "ComponentName" src/components/ui/
   ls src/app/design-system/components/
   ```

2. **If exists:** Read implementation, understand props/variants, ASK before changes
3. **If new:** Confirm with user, check for similar components to extend

### Verify User Intent

**ALWAYS ask before committing:**

- "I'm about to [create/modify] the [ComponentName] component. Should I proceed?"
- For significant changes: "This change affects [X] existing usages. Are you sure?"

---

## Core Rules

### 1. Read Component Source First

Before documenting, read the actual component file to understand:

- Exact prop names and types from interface
- Default values from destructuring
- Available variants/sizes from CVA
- Re-exported sub-components

### 2. Use Design Tokens (Never Hardcode)

```tsx
// ✅ CORRECT
className = "bg-[var(--button-primary-background)] text-[var(--primitive-green-800)]";

// ❌ WRONG
className = "bg-[#0A3D2C] text-[#072924]";
```

### 3. Verify Exports

Check `/src/components/ui/index.ts`:

- Component is exported
- Sub-components exported (DialogTrigger, DialogContent, etc.)
- Helper types/constants exported

### 4. Update Navigation

Add to `/src/lib/design-system-nav.ts`:

- Add to `navigationConfig` in appropriate category
- Add to `searchIndex` for searchability

---

## Documentation Location

Create page at: `/src/app/design-system/components/[component-name]/page.tsx`

---

## Verification Checklist

Before committing:

- [ ] Verified if component exists
- [ ] Asked user for confirmation
- [ ] Read component source file
- [ ] Props match interface exactly
- [ ] All colors use CSS variables
- [ ] Component exported from UI index
- [ ] **All 12 sections included**
- [ ] **All variants shown**
- [ ] **All states shown**
- [ ] **Do's/Don'ts have visual examples**
- [ ] **Accessibility section complete**
- [ ] Code examples are copy-paste ready
- [ ] Run `pnpm build` - no type errors
- [ ] Navigation config updated

---

## Resource Files

For detailed information:

### [templates.md](resources/templates.md)

Complete documentation page template with all 12 sections, ready to copy and customize.

### [accessibility.md](resources/accessibility.md)

Accessibility documentation requirements: keyboard navigation, focus indicators, screen readers, ARIA attributes, color contrast.

### [common-mistakes.md](resources/common-mistakes.md)

Common mistakes to avoid: prop mismatches, missing imports, hardcoded colors, incomplete documentation.

---

## Related Skills

- **design-system** - Token usage and component library standards
- **figma-workflow** - Implementing designs from Figma

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 150 lines ✅
**Progressive Disclosure**: 3 resource files ✅
