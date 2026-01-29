# Interview Scheduler UX Improvements - Build Plan

## Overview

This document outlines UX improvements for the interview scheduling modal to reduce redundancy, improve clarity, and create a more intuitive scheduling experience.

**Current Issues:**
- Duplicate attendee information across multiple UI locations
- Confusing color coding that conflicts with common conventions
- Hidden critical instructions for core functionality
- Overloaded left panel mixing unrelated concerns
- Unclear timezone handling for distributed teams

---

## Phase 1: Reduce Redundancy

### 1.1 Consolidate Attendee Display

**Problem:** Attendees appear in both the left panel list AND as color-coded filter chips above the calendar, creating confusion about source of truth.

**Solution:**
- Left panel = attendee management (add/remove interviewers, see roles)
- Calendar chips = visibility toggles only (simplified styling, no role badges)

**Implementation:**
```
Left Panel (Attendee Management):
├── Shows full attendee details (avatar, name, role badge)
├── "X" button to remove
├── "+ Add interviewer" action
└── Drag to reorder (optional)

Calendar Legend (Visibility Toggles):
├── Simple colored dots + names only
├── Click to toggle calendar visibility
├── No role badges, no remove buttons
└── Checkbox or opacity change indicates hidden state
```

**Files to modify:**
- `src/components/scheduling/AttendeeList.tsx` (left panel)
- `src/components/scheduling/CalendarLegend.tsx` (new simplified component)
- `src/components/scheduling/SchedulingModal.tsx` (parent orchestration)

---

### 1.2 Remove "Show calendars" Button

**Problem:** Both "Show calendars" button and individual attendee chips toggle visibility—two different mental models for the same action.

**Solution:** Remove "Show calendars" button entirely. Individual chips provide more granular, intuitive control.

**Files to modify:**
- `src/components/scheduling/CalendarHeader.tsx`

---

### 1.3 Clarify Tab Purpose

**Problem:** "Find a Time" vs "Your Calendar" tabs are ambiguous. Both show calendars.

**Solution:** Rename and differentiate:

| Tab | New Name | Purpose |
|-----|----------|---------|
| Find a Time | **Availability View** | Overlaid schedules showing free/busy for all attendees |
| Your Calendar | **Individual Calendars** | Side-by-side or stacked individual calendars |

**Alternative:** Remove tabs entirely if "Find a Time" (availability overlay) is the primary use case. Add a toggle for "Show individual events" vs "Show availability only."

**Files to modify:**
- `src/components/scheduling/SchedulingModal.tsx`
- `src/components/scheduling/CalendarTabs.tsx`

---

## Phase 2: Calendar Color Palette

### 2.1 Dedicated Calendar Event Color Palette

**Problem:**
- Current colors (red, orange, green, yellow) clash with semantic meanings elsewhere in the app
- Green for events like "APAC Engineering Sync" reads as "available" when it's actually blocked time
- Need distinct attendee colors that don't conflict with UI patterns

**Solution:** Create a dedicated calendar color palette—muted, harmonious colors that:
- Are visually distinct from each other
- Don't carry semantic meaning (no red=error, green=success associations)
- Work well when events overlap
- Maintain sufficient contrast for readability

**New Calendar Color Palette:**

| Attendee | Background | Foreground | Border | Name |
|----------|------------|------------|--------|------|
| Person 1 | `#E8F4F2` | `#1D6B5C` | `#A8D5CC` | Sage |
| Person 2 | `#FDF2E9` | `#9A5B2F` | `#E8C9A8` | Terracotta |
| Person 3 | `#EEF0F8` | `#4A5490` | `#B8C0E0` | Slate |
| Person 4 | `#F5EEF8` | `#7A4A8C` | `#D4B8E0` | Orchid |
| Person 5 | `#FEF3F2` | `#A84D4D` | `#E8B8B8` | Rose |
| Person 6 | `#F0F6EE` | `#4A7A42` | `#B8D4B0` | Fern |
| Person 7 | `#FDF8E8` | `#8A7A2F` | `#E0D4A0` | Wheat |
| Person 8 | `#F2F4F8` | `#5A6A7A` | `#C0C8D4` | Steel |

**Tentative/Maybe events:** Same attendee color but with 50% opacity and dashed border

**Selected interview slots (existing - KEEP):** Solid blue cards already implemented
- Background: `--primitive-blue-400` (#408CFF light / #3369FF dark)
- Foreground: White
- Border: 4px left accent in `--primitive-blue-500`
- This styling works well and needs no changes

**Implementation:**
```css
/* Calendar attendee colors - dedicated palette */
--calendar-attendee-1-background: #E8F4F2;
--calendar-attendee-1-foreground: #1D6B5C;
--calendar-attendee-1-border: #A8D5CC;

--calendar-attendee-2-background: #FDF2E9;
--calendar-attendee-2-foreground: #9A5B2F;
--calendar-attendee-2-border: #E8C9A8;

--calendar-attendee-3-background: #EEF0F8;
--calendar-attendee-3-foreground: #4A5490;
--calendar-attendee-3-border: #B8C0E0;

--calendar-attendee-4-background: #F5EEF8;
--calendar-attendee-4-foreground: #7A4A8C;
--calendar-attendee-4-border: #D4B8E0;

--calendar-attendee-5-background: #FEF3F2;
--calendar-attendee-5-foreground: #A84D4D;
--calendar-attendee-5-border: #E8B8B8;

--calendar-attendee-6-background: #F0F6EE;
--calendar-attendee-6-foreground: #4A7A42;
--calendar-attendee-6-border: #B8D4B0;

--calendar-attendee-7-background: #FDF8E8;
--calendar-attendee-7-foreground: #8A7A2F;
--calendar-attendee-7-border: #E0D4A0;

--calendar-attendee-8-background: #F2F4F8;
--calendar-attendee-8-foreground: #5A6A7A;
--calendar-attendee-8-border: #C0C8D4;

/* Selected interview slot - EXISTING IMPLEMENTATION
   Already uses --primitive-blue-400 with white text
   No new tokens needed - current styling works well */

/* Tentative modifier */
--calendar-event-tentative-opacity: 0.5;
--calendar-event-tentative-border-style: dashed;
```

**Files to modify:**
- `src/app/globals.css` (add calendar palette tokens)
- `src/components/scheduling/CalendarEvent.tsx`
- `src/components/scheduling/CalendarLegend.tsx`

---

### 2.2 Keep Attendee Colors for Visual Distinction

**Rationale:** Attendee colors help users quickly identify whose calendar they're looking at, especially when events overlap or span similar times.

**Implementation details:**
- Each attendee assigned a color from the calendar palette (1-8, then cycle)
- Color shown in legend chips AND on their calendar events
- Consistent assignment across the modal session
- Events show full background color (not just left border) for strong visual grouping

**Files to modify:**
- `src/components/scheduling/CalendarEvent.tsx`
- `src/components/scheduling/CalendarLegend.tsx`
- `src/lib/calendar-colors.ts` (new utility for color assignment)

---

## Phase 3: Improve Discoverability

### 3.1 Make "Add Time Slot" Interaction Obvious

**Problem:** "Click to add 60 min slot" instruction is hidden in small text on the far right. Users don't understand how to propose times.

**Solution:** Focused discoverability improvements (no hover tooltip needed):

**A) Prominent inline instruction:**
Move the instruction from far-right corner to a more visible location—either:
- Above the calendar grid as a subtle banner
- Or integrated into the calendar header row

```tsx
<div className="flex items-center gap-2 px-3 py-2 bg-[var(--primitive-blue-50)] rounded-lg mb-3">
  <Info size={16} className="text-[var(--primitive-blue-600)]" />
  <span className="text-caption text-[var(--primitive-blue-700)]">
    Click on available time slots to propose times. The candidate will choose their preferred option.
  </span>
</div>
```

**B) Empty state when no slots selected:**
```tsx
// In PROPOSED TIMES section when 0/5
<div className="text-center py-4 text-foreground-muted">
  <CalendarPlus size={24} className="mx-auto mb-2 opacity-50" />
  <p className="text-caption">No times proposed yet</p>
  <p className="text-caption-sm">Click available slots in the calendar →</p>
</div>
```

**C) First-time coach mark (optional enhancement):**
```tsx
// Show on first use, dismiss permanently after first slot selection
<CoachMark
  target="calendar-grid"
  title="Click to propose times"
  description="Click any available slot to propose it to the candidate."
  dismissKey="scheduling-coach-mark"
/>
```

**Files to create/modify:**
- `src/components/scheduling/SchedulingInstructions.tsx` (new)
- `src/components/scheduling/ProposedTimesEmpty.tsx` (new)
- `src/components/scheduling/WeeklyCalendar.tsx`

---

### 3.2 Visual Feedback for Selected Slots

**Current implementation (KEEP):** The existing selected slot styling in `interview-scheduling-modal.tsx` (lines 872-913) is well-designed:

```tsx
// Existing implementation - solid blue card
<div className="
  absolute left-1 right-1 rounded-lg
  bg-[var(--primitive-blue-400)]
  shadow-sm cursor-pointer
  hover:bg-[var(--primitive-blue-500)]
  transition-colors group
  border-l-4 border-[var(--primitive-blue-500)]
">
  <p className="text-[11px] font-semibold text-white truncate">Interview Slot</p>
  <p className="text-[10px] text-white/90">{time range}</p>
  {/* Remove indicator on hover - only show if card is tall enough */}
  <div className="mt-auto opacity-0 group-hover:opacity-100 ...">
    <X size={10} /> Remove
  </div>
</div>
```

**What works well:**
- Solid blue background (`--primitive-blue-400`) stands out from attendee event colors
- 4px left border accent reinforces selection
- Hover state darkens to `--primitive-blue-500`
- White text with clear hierarchy (bold title, lighter time)
- Click-to-remove with hover indicator is intuitive
- Shadow provides depth separation from calendar grid

**No changes needed** - this styling already achieves the goal of making selected slots visually distinct.

**Minor enhancement (optional):** Add numbered badges if user selects multiple slots to help match left panel list order:

```tsx
<span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-[var(--primitive-blue-600)] text-white text-[10px] font-semibold flex items-center justify-center">
  {slotIndex + 1}
</span>
```

---

## Phase 4: Information Architecture

### 4.1 Reorganize Left Panel

**Problem:** Left panel mixes interview metadata, attendee management, time selection state, instructions, and internal notes—too many unrelated concerns.

**Solution:** Group into clear sections with visual hierarchy:

```
┌─────────────────────────────────────┐
│ INTERVIEW DETAILS                   │
│ ┌─────────────────────────────────┐ │
│ │ Senior Product Designer Interview│ │
│ │ ⏱ 1 hour  •  📹 Google Meet     │ │
│ │ 📅 Work Calendar                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ATTENDEES                      CST  │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Randy · Candidate            │ │
│ │ 👤 Diego · Interviewer      ✕   │ │
│ │ 👤 Oliver · Hiring Manager  ✕   │ │
│ │ 👤 Sarah · Interviewer      ✕   │ │
│ │ + Add interviewer               │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ PROPOSED TIMES                 1/5  │
│ ┌─────────────────────────────────┐ │
│ │ 1. Mon Jan 26, 9:00 AM      ✕   │ │
│ │                                 │ │
│ │ Click calendar to add more →    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ▼ ADDITIONAL OPTIONS                │
│   ┌───────────────────────────────┐ │
│   │ Instructions for candidate    │ │
│   │ ┌───────────────────────────┐ │ │
│   │ │ Agenda, preparation tips...│ │ │
│   │ └───────────────────────────┘ │ │
│   │                               │ │
│   │ Internal notes                │ │
│   │ ┌───────────────────────────┐ │ │
│   │ │ Notes visible to team only│ │ │
│   │ └───────────────────────────┘ │ │
│   └───────────────────────────────┘ │
└─────────────────────────────────────┘
│ [Cancel]  [Preview & Send →]        │
└─────────────────────────────────────┘
```

**Key changes:**
1. Interview details collapsed into compact header row
2. Clear section dividers with labels
3. "Proposed Times" promoted from buried "Selected Times"
4. Instructions/notes collapsed into "Additional Options" accordion
5. Timezone shown prominently in Attendees header

**Files to modify:**
- `src/components/scheduling/SchedulingModal.tsx`
- `src/components/scheduling/InterviewDetails.tsx` (new compact version)
- `src/components/scheduling/ProposedTimesList.tsx` (renamed from SelectedTimes)

---

### 4.2 Improve Timezone Handling

**Problem:** "CST" appears next to attendees but calendar times don't show timezone context. Risk of scheduling errors for distributed teams.

**Solution:**

**A) Show timezone in calendar header:**
```tsx
<div className="flex items-center justify-between">
  <h3>Jan 26 – 1, 2026</h3>
  <div className="flex items-center gap-2">
    <span className="text-caption text-foreground-muted">
      Times shown in CST
    </span>
    <Button variant="ghost" size="sm">
      <Globe size={14} className="mr-1" />
      Change
    </Button>
  </div>
</div>
```

**B) Timezone selector in modal:**
- Dropdown to switch displayed timezone
- Show attendee's local time on hover for events
- Warning badge if attendees span multiple timezones

**Files to modify:**
- `src/components/scheduling/CalendarHeader.tsx`
- `src/components/scheduling/TimezoneSelector.tsx` (new)
- `src/components/scheduling/CalendarEvent.tsx` (add local time tooltip)

---

## Phase 5: Button & Action Cleanup

### 5.1 Clarify "My calendar" Button

**Problem:** "My calendar" button purpose is unclear vs "Your Calendar" tab. Eye icon suggests visibility but styled as primary action.

**Solution:** Remove "My calendar" button. Its function is covered by:
- "Your Calendar" tab (if kept)
- Legend visibility toggles

If it serves a different purpose (e.g., adding to your own calendar), rename to be explicit:
- "Add to my calendar" (after scheduling)
- "Open in Google Calendar" (external link)

**Files to modify:**
- `src/components/scheduling/SchedulingHeader.tsx`

---

### 5.2 Improve "Suggest times" Button

**Current:** Yellow/gold button "✦ Suggest times" in header

**Improvement:**
- Make AI suggestion more integrated into the flow
- Show as contextual action when no slots are selected
- Or move to empty state of Proposed Times section

```tsx
// In empty state of Proposed Times
<div className="text-center py-4">
  <p className="text-caption text-foreground-muted mb-3">
    No times selected yet
  </p>
  <Button variant="secondary" size="sm">
    <Sparkle size={14} className="mr-1" />
    Suggest available times
  </Button>
  <p className="text-caption-sm text-foreground-muted mt-2">
    Or click the calendar to select manually
  </p>
</div>
```

**Files to modify:**
- `src/components/scheduling/ProposedTimesList.tsx`
- `src/components/scheduling/SchedulingHeader.tsx`

---

## Implementation Priority

### High Impact, Low Effort (Do First)
1. ✅ New calendar color palette (Phase 2.1) - muted, non-semantic colors
2. ✅ Improve empty state for proposed times (Phase 3.1B)
3. ✅ Remove "Show calendars" button (Phase 1.2)
4. ✅ Move instruction text to prominent location (Phase 3.1A)

### High Impact, Medium Effort
5. ✅ Reorganize left panel sections (Phase 4.1)
6. ✅ Add timezone to calendar header (Phase 4.2A)
7. ✅ Selected slot styling - ALREADY IMPLEMENTED (Phase 3.2) - no work needed

### Medium Impact, Low Effort
8. ✅ Consolidate attendee display (Phase 1.1)
9. ✅ Clarify/remove "My calendar" button (Phase 5.1)
10. ✅ Move "Suggest times" to empty state (Phase 5.2)

### Lower Priority / Future
11. ⏳ First-time coach marks (Phase 3.1C)
12. ⏳ Clarify tab purpose (Phase 1.3)
13. ⏳ Full timezone selector (Phase 4.2B)

---

## Component Inventory

### New Components to Create
| Component | Purpose |
|-----------|---------|
| `CalendarLegend.tsx` | Visibility toggles with attendee colors |
| `ProposedTimesEmpty.tsx` | Empty state with guidance when no slots selected |
| `SchedulingInstructions.tsx` | Prominent instruction banner above calendar |
| `TimezoneSelector.tsx` | Timezone picker dropdown |
| `InterviewDetailsCompact.tsx` | Collapsed interview metadata row |

### New Utilities to Create
| File | Purpose |
|------|---------|
| `src/lib/calendar-colors.ts` | Color assignment utility for attendees (cycles through 8 colors) |

### Components to Modify
| Component | Changes |
|-----------|---------|
| `SchedulingModal.tsx` | Layout restructure, section grouping |
| `CalendarEvent.tsx` | New attendee color palette, tentative styling |
| `WeeklyCalendar.tsx` | Selected slot display in blue |
| `CalendarHeader.tsx` | Remove "Show calendars", add timezone, move instructions |
| `AttendeeList.tsx` | Focus on management, remove toggle behavior |
| `SelectedTimesList.tsx` | Rename to ProposedTimesList, blue styling for slots |

---

## Design Tokens to Add

```css
/* Add to globals.css */

/* ========================================
   CALENDAR ATTENDEE COLOR PALETTE
   Muted, harmonious colors that don't
   conflict with semantic UI colors
   ======================================== */

/* Sage - Attendee 1 */
--calendar-attendee-1-background: #E8F4F2;
--calendar-attendee-1-foreground: #1D6B5C;
--calendar-attendee-1-border: #A8D5CC;

/* Terracotta - Attendee 2 */
--calendar-attendee-2-background: #FDF2E9;
--calendar-attendee-2-foreground: #9A5B2F;
--calendar-attendee-2-border: #E8C9A8;

/* Slate - Attendee 3 */
--calendar-attendee-3-background: #EEF0F8;
--calendar-attendee-3-foreground: #4A5490;
--calendar-attendee-3-border: #B8C0E0;

/* Orchid - Attendee 4 */
--calendar-attendee-4-background: #F5EEF8;
--calendar-attendee-4-foreground: #7A4A8C;
--calendar-attendee-4-border: #D4B8E0;

/* Rose - Attendee 5 */
--calendar-attendee-5-background: #FEF3F2;
--calendar-attendee-5-foreground: #A84D4D;
--calendar-attendee-5-border: #E8B8B8;

/* Fern - Attendee 6 */
--calendar-attendee-6-background: #F0F6EE;
--calendar-attendee-6-foreground: #4A7A42;
--calendar-attendee-6-border: #B8D4B0;

/* Wheat - Attendee 7 */
--calendar-attendee-7-background: #FDF8E8;
--calendar-attendee-7-foreground: #8A7A2F;
--calendar-attendee-7-border: #E0D4A0;

/* Steel - Attendee 8 */
--calendar-attendee-8-background: #F2F4F8;
--calendar-attendee-8-foreground: #5A6A7A;
--calendar-attendee-8-border: #C0C8D4;

/* ========================================
   SELECTED/PROPOSED INTERVIEW SLOTS
   Blue to stand out from attendee palette
   ======================================== */
--calendar-slot-selected-background: var(--primitive-blue-100);
--calendar-slot-selected-foreground: var(--primitive-blue-600);
--calendar-slot-selected-border: var(--primitive-blue-500);

/* ========================================
   CALENDAR EVENT MODIFIERS
   ======================================== */
--calendar-event-tentative-opacity: 0.5;

/* ========================================
   CALENDAR GRID
   ======================================== */
--calendar-grid-line: var(--primitive-neutral-200);
--calendar-time-label: var(--primitive-neutral-500);
--calendar-today-highlight: var(--primitive-blue-50);
--calendar-weekend-background: var(--primitive-neutral-50);
```

---

## Success Metrics

After implementation, measure:

1. **Time to first slot selection** - Should decrease as interaction becomes more discoverable
2. **Error rate** - Fewer timezone-related scheduling mistakes
3. **Completion rate** - More users successfully send scheduling requests
4. **Support tickets** - Fewer "how do I schedule?" questions

---

## Figma Design Updates Needed

Request updated designs for:
1. New calendar attendee color palette (8 muted, harmonious colors)
2. Blue styling for selected/proposed interview slots
3. Reorganized left panel with new section groupings
4. Empty state for Proposed Times section
5. Prominent instruction banner above calendar
6. Timezone indicator in calendar header
7. Tentative event styling (reduced opacity + dashed border)
