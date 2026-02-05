# Profile Page - Revised Implementation Plan

**Updated:** February 4, 2026
**After Design System Audit**

---

## Existing Components We Can Reuse

| Component               | File                        | Matches Figma? | Notes                                                                                          |
| ----------------------- | --------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| **ProgressMeter**       | `progress-meter.tsx`        | ✅ YES         | Has goal types: `interviewing`, `networking`, `compensation`, `organization` with exact colors |
| **Chip**                | `chip.tsx`                  | ✅ YES         | Removable chips with X button, multiple color variants                                         |
| **Avatar**              | `avatar.tsx`                | ✅ YES         | Sizes xs-2xl, circle/square, initials fallback, status badges                                  |
| **FileUpload**          | `file-upload.tsx`           | ✅ YES         | Drag/drop, progress states                                                                     |
| **EmptyState**          | `empty-state.tsx`           | ⚠️ Partial     | Has icons but not the custom illustrations from Figma                                          |
| **Modal**               | `modal.tsx`                 | ✅ YES         | Full modal system with header/body/footer                                                      |
| **InlineEditableTitle** | `inline-editable-title.tsx` | ✅ YES         | Click to edit, Enter/Escape                                                                    |
| **CharacterCounter**    | `character-counter.tsx`     | ✅ YES         | Shows X/250 format                                                                             |
| **Timeline**            | `timeline.tsx`              | ⚠️ Partial     | Basic timeline, may need styling tweaks for experience                                         |
| **Button**              | `button.tsx`                | ✅ YES         | All button variants                                                                            |
| **Input**               | `input.tsx`                 | ✅ YES         | Form inputs                                                                                    |
| **Textarea**            | `textarea.tsx`              | ✅ YES         | Bio editing                                                                                    |
| **Switch**              | `switch.tsx`                | ✅ YES         | "Current role" toggle                                                                          |
| **Checkbox**            | `checkbox.tsx`              | ✅ YES         | Task checkboxes                                                                                |

---

## Components That Need Creation

| Component              | Complexity | Why New?                                                |
| ---------------------- | ---------- | ------------------------------------------------------- |
| **ProfileHeader**      | Medium     | Cover image + avatar overlap layout is unique           |
| **CoverImagePicker**   | Low        | 6 preset images in a grid selector                      |
| **SocialLinkChip**     | Low        | Dark chips with social icons (variant of Chip)          |
| **GoalListItem**       | Low        | Row layout combining ProgressMeter + text + button      |
| **ExperienceListItem** | Low        | Row with company logo, styled differently than Timeline |

---

## Revised Work Breakdown

### What Actually Needs Building

| Task                                                    | Est. Hours | Dependencies                   |
| ------------------------------------------------------- | ---------- | ------------------------------ |
| **ProfileHeader** - Cover + avatar overlap layout       | 4h         | Avatar                         |
| **CoverImagePicker** - Modal with 6 preset grid         | 2h         | Modal                          |
| **SocialLinkChip** - Dark icon chips                    | 1h         | Chip (variant)                 |
| **GoalListItem** - Row with progress                    | 2h         | ProgressMeter                  |
| **ExperienceListItem** - Row with logo                  | 2h         | Avatar (square)                |
| **Profile Page Assembly** - Wire up all components      | 4h         | All above                      |
| **Modal Content Forms** - Bio, Skills, Contact, Socials | 4h         | Modal, Input, Chip             |
| **Goal Create/Detail Modals** - Two-panel layout        | 6h         | Modal, Checkbox, ProgressMeter |
| **Experience Add/Edit Modals**                          | 3h         | Modal, Input, Switch           |
| **API Integration** - Connect to endpoints              | 4h         | All above                      |

**Total: ~32 hours (4-5 days)**

---

## Simplified Component Architecture

```
ProfilePage
├── ProfileHeader (NEW)
│   ├── CoverImage (presets, click to change)
│   ├── Avatar (EXISTING - size="xl")
│   ├── Name + Badge
│   ├── Location
│   └── SocialLinkChips (NEW - variant of Chip)
│
├── SummaryCard
│   ├── Text display OR
│   └── EmptyState (EXISTING) + Modal trigger
│
├── SkillsCard
│   ├── ChipGroup (EXISTING Chip with removable)
│   └── Modal for editing
│
├── GoalsSection
│   ├── GoalListItem (NEW)
│   │   ├── ProgressMeter circular icon (EXISTING)
│   │   ├── Title + "X% Ready"
│   │   └── "View Goal" button
│   └── EmptyState (EXISTING)
│
├── ExperienceSection
│   ├── ExperienceListItem (NEW)
│   │   ├── Avatar square (EXISTING - shape="square")
│   │   ├── Title + Company
│   │   └── Date range
│   └── EmptyState (EXISTING)
│
├── FilesSection
│   ├── FileRow (simple, not full FileUpload)
│   └── EmptyState (EXISTING)
│
└── Footer
```

---

## What's Simplified

### Before (Original Plan): 31+ hours for 6 new components

### After (Revised): ~32 hours but much simpler

**Key Simplifications:**

1. **Goals** - Reuse `ProgressMeter` which already has the goal types and colors
2. **Skills** - Reuse `Chip` component with `removable` prop
3. **Avatar** - Already has `shape="square"` for company logos
4. **Character Counter** - Already built for bio textarea
5. **Modal** - Full system exists, just need content forms
6. **Timeline** - Can be adapted for experience section

---

## Implementation Priority

### Day 1-2: Core Profile Structure

1. ProfileHeader component (cover + avatar overlap)
2. CoverImagePicker modal (6 presets)
3. Basic page layout with sections

### Day 3: Goals System

1. GoalListItem using existing ProgressMeter
2. Create Goal modal (two-panel)
3. Goal Detail modal

### Day 4: Experience & Files

1. ExperienceListItem using Avatar square
2. Experience modals
3. Files section (simple rows)

### Day 5: Modals & Polish

1. Bio, Skills, Contact, Socials modals
2. Empty states with illustrations
3. Responsive testing

---

## Assets Needed

### Cover Images (6 presets)

Need to export from Figma or create:

1. Gradient: Yellow → Teal
2. Gradient: Purple → Pink
3. Gradient: Soft pastel rainbow
4. Illustration: Spring forest
5. Illustration: Autumn forest
6. Illustration: Moonlit forest

### Empty State Illustrations

The Figma shows custom illustrations (pencil, clipboard, document). Options:

1. Export SVGs from Figma
2. Use existing EmptyState icons as fallback
3. Create simple illustrations

---

## Questions Resolved

| Question           | Answer                         |
| ------------------ | ------------------------------ |
| Goal colors?       | ✅ Already in ProgressMeter    |
| Chip removable?    | ✅ Chip has `removable` prop   |
| Company logos?     | ✅ Avatar has `shape="square"` |
| Inline editing?    | ✅ InlineEditableTitle exists  |
| Character counter? | ✅ CharacterCounter exists     |
