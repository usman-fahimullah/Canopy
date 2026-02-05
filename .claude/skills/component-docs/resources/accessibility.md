# Accessibility Documentation Requirements

Every component must document these accessibility aspects.

---

## Required Documentation

| Requirement        | Description                                      |
| ------------------ | ------------------------------------------------ |
| **Keyboard**       | How to navigate and interact using keyboard only |
| **Focus**          | Visible focus indicator styling                  |
| **Screen Readers** | What is announced and when                       |
| **ARIA**           | Roles, states, and properties used               |
| **Color Contrast** | WCAG compliance level                            |
| **Motion**         | Respects `prefers-reduced-motion`                |

---

## AccessibilityInfo Component Usage

```tsx
<AccessibilityInfo
  notes={[
    "**Keyboard**: Focusable with Tab, activated with Enter or Space",
    "**Focus indicator**: Visible focus ring using green-500",
    "**Screen readers**: Announces button label and state (disabled, loading)",
    "**ARIA**: Uses `aria-disabled` and `aria-busy` for state communication",
    "**Color contrast**: Meets WCAG AA standards (4.5:1 ratio)",
    "**Motion**: Respects prefers-reduced-motion for animations",
  ]}
/>
```

---

## Common ARIA Attributes

### Buttons

- `aria-disabled="true"` - When disabled
- `aria-busy="true"` - When loading
- `aria-pressed="true"` - For toggle buttons

### Inputs

- `aria-invalid="true"` - When validation fails
- `aria-describedby="error-id"` - Points to error message
- `aria-required="true"` - For required fields

### Dialogs

- `role="dialog"` - Dialog container
- `aria-modal="true"` - Prevents interaction outside
- `aria-labelledby="title-id"` - Points to dialog title

### Menus

- `role="menu"` - Menu container
- `role="menuitem"` - Menu items
- `aria-expanded="true"` - When open

---

## Keyboard Navigation Patterns

### Single Interactive Element

- **Tab**: Move focus to/from element
- **Enter/Space**: Activate

### Menu/Dropdown

- **Tab**: Move focus to trigger
- **Enter/Space/ArrowDown**: Open menu
- **ArrowUp/ArrowDown**: Navigate items
- **Enter/Space**: Select item
- **Escape**: Close menu

### Modal/Dialog

- **Tab**: Cycle through focusable elements (trapped)
- **Escape**: Close dialog
- **Enter**: Submit (if form)

---

## Color Contrast Requirements

| Element            | WCAG Level | Ratio |
| ------------------ | ---------- | ----- |
| Normal text        | AA         | 4.5:1 |
| Large text (18px+) | AA         | 3:1   |
| UI components      | AA         | 3:1   |
| Enhanced           | AAA        | 7:1   |

All Canopy design tokens meet WCAG AA standards.
