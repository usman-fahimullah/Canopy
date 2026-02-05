# Complete Token Reference

Full token reference for Figma to code implementation.

---

## Color Primitives

| Scale       | 100     | 200     | 300     | 400     | 500     | 600     | 700     | 800     |
| ----------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| **Green**   | #EAFFE0 | #DCFAC8 | #BCEBB2 | #8EE07E | #5ECC70 | #3BA36F | #0E5249 | #0A3D2C |
| **Neutral** | #FAF9F7 | #F2EDE9 | #E5DFD8 | #CCC6C0 | #A39D96 | #7A7671 | #3D3A37 | #1F1D1C |
| **Blue**    | #E5F1FF | #CCE4FF | #99C9FF | #408CFF | #3369FF | #0D3EC7 | #00217A | #001652 |
| **Red**     | #FFEBF4 | #FFD6E9 | #FFADCE | #FF8599 | #FF5C5C | #E90000 | #AE0101 | #5C0000 |
| **Orange**  | #FFEDE0 | #FFDAC2 | #FFAD85 | #FF8547 | #F5580A | #B83D00 | #7A2900 | #521B00 |
| **Yellow**  | #FFF7D6 | #FFEFAD | #FFDA75 | #FFCE47 | #E5B225 | #B88A1D | #665510 | #3D330A |
| **Purple**  | #F7F2FF | #F1E0FF | #E2C2FF | #C285FF | #9C59FF | #5B1DB8 | #31007A | #1B0043 |

---

## Semantic Background Tokens

```css
/* App Backgrounds */
--background-default          /* #FFFFFF */
--background-subtle           /* neutral-100 */
--background-muted            /* neutral-200 */
--background-emphasized       /* neutral-300 */
--background-inverse          /* neutral-800 */

/* Brand */
--background-brand            /* green-600 */
--background-brand-subtle     /* green-100 */
--background-brand-emphasis   /* green-700 */

/* Status */
--background-success          /* green-100 */
--background-warning          /* orange-100 */
--background-error            /* red-100 */
--background-info             /* blue-100 */
```

---

## Semantic Foreground Tokens

```css
/* Text */
--foreground-default          /* neutral-800 */
--foreground-muted            /* neutral-700 */
--foreground-subtle           /* neutral-600 */
--foreground-disabled         /* neutral-500 */
--foreground-inverse          /* neutral-0 */

/* Brand */
--foreground-brand            /* green-700 */

/* Status */
--foreground-success          /* green-700 */
--foreground-warning          /* orange-700 */
--foreground-error            /* red-700 */
--foreground-info             /* blue-700 */
```

---

## Component Tokens

### Button

```css
/* Primary */
--button-primary-background        /* green-800 */
--button-primary-background-hover  /* green-700 */
--button-primary-foreground        /* blue-100 */

/* Secondary */
--button-secondary-background      /* blue-200 */
--button-secondary-foreground      /* green-800 */

/* Tertiary */
--button-tertiary-background       /* neutral-200 */
--button-tertiary-foreground       /* green-800 */

/* Destructive */
--button-destructive-background    /* red-500 */
--button-destructive-foreground    /* #FFFFFF */
```

### Input

```css
--input-background             /* neutral-100 */
--input-border                 /* neutral-200 */
--input-border-focus           /* green-500 */
--input-border-error           /* red-500 */
--input-foreground             /* neutral-800 */
--input-foreground-placeholder /* neutral-500 */
```

### Card

```css
--card-background          /* neutral-0 */
--card-background-hover    /* neutral-100 */
--card-border              /* neutral-300 */
```

---

## Typography

```css
/* Font */
--font-sans:
  "DM Sans", system-ui,
  sans-serif /* Scale */ --text-display: 4.5rem /* 72px */ --text-heading-lg: 3rem /* 48px */
    --text-heading-md: 2.25rem /* 36px */ --text-heading-sm: 1.5rem /* 24px */
    --text-body-strong: 1.125rem /* 18px bold */ --text-body: 1.125rem /* 18px */
    --text-body-sm: 1rem /* 16px */ --text-caption: 0.875rem /* 14px */ --text-caption-sm: 0.75rem
    /* 12px */;
```

---

## Spacing

```css
--space-1: 0.25rem /* 4px */ --space-2: 0.5rem /* 8px */ --space-3: 0.75rem /* 12px */
  --space-4: 1rem /* 16px */ --space-6: 1.5rem /* 24px */ --space-8: 2rem /* 32px */
  --space-12: 3rem /* 48px */ --space-16: 4rem /* 64px */;
```

---

## Border Radius

```css
--radius-sm: 0.25rem /* 4px */ --radius-md: 0.375rem /* 6px */ --radius-lg: 0.5rem /* 8px */
  --radius-xl: 0.75rem /* 12px */ --radius-full: 9999px /* Semantic */
  --radius-card: var(--radius-xl) --radius-button: var(--radius-lg) --radius-input: var(--radius-md);
```

---

## Shadows

```css
--shadow-card:
  0 1px 3px 0 rgb(0 0 0 / 0.07),
  0 2px 6px -1px rgb(0 0 0 / 0.08) --shadow-card-hover: 0 2px 4px 0 rgb(0 0 0 / 0.08),
  0 6px 16px -2px rgb(0 0 0 / 0.14) --shadow-dropdown: 0 2px 6px 0 rgb(0 0 0 / 0.08),
  0 10px 24px -4px rgb(0 0 0 / 0.18) --shadow-modal: 0 4px 10px 0 rgb(0 0 0 / 0.1),
  0 28px 64px -12px rgb(0 0 0 / 0.28);
```

---

## Motion

```css
/* Durations */
--duration-fast: 100ms --duration-normal: 150ms --duration-slow: 300ms /* Easing */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1) --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
```
