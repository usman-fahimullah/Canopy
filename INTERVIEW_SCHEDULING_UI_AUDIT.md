# Interview Scheduling UI/UX Audit Report

**Platform:** Canopy ATS - Interview Scheduling Feature
**Auditor:** Senior Product Designer Analysis
**Date:** January 25, 2026
**Components Reviewed:**
- `InterviewSchedulingModal` (interview-scheduling-modal.tsx)
- `Scheduler` components (scheduler.tsx)
- `TimePicker` family (time-picker.tsx)
- Demo page (demo/interview-scheduling/page.tsx)

---

## Executive Summary

The interview scheduling feature in Canopy ATS demonstrates **solid foundational architecture** with a thoughtful two-panel modal design and comprehensive component ecosystem. However, the implementation reveals several **critical consistency issues**, **accessibility gaps**, and **interaction design oversights** that diminish the premium feel expected of an ATS competing with Homerun. The color system shows hardcoded values that contradict the established token system, and multiple interaction patterns lack proper state feedback.

**Overall Assessment:** 6.5/10 — Functional but lacks polish expected for a design-forward ATS

### Key Findings Summary

| Priority | Issue Count | Impact Area |
|----------|-------------|-------------|
| P0 - Critical | 4 | Accessibility, Token violations |
| P1 - High | 8 | Interaction feedback, Consistency |
| P2 - Medium | 12 | Visual polish, UX friction |
| P3 - Low | 6 | Enhancement opportunities |

---

## Part 1: First Impressions Audit (5-Second Test)

### InterviewSchedulingModal

| Aspect | Rating | Notes |
|--------|--------|-------|
| Visual hierarchy | 3/5 | Left panel clear, but calendar grid feels visually noisy |
| Brand coherence | 4/5 | Uses green palette, but hardcoded greens break consistency |
| Emotional resonance | **Overwhelming** | Too much information density, especially in availability grid |
| Cognitive load | **High** | User must process 7+ days × 18+ time slots simultaneously |

**First Impression:** *"Functional but dense — feels more like a spreadsheet than a scheduling tool"*

**Primary focal point:** The availability calendar dominates, but the green/yellow/gray heatmap lacks clear visual hierarchy.

**Hierarchy issues:**
- Left panel header competes with form fields for attention
- "Insert template" button feels lost in the title row
- Selected time slots have no dedicated summary area — they're buried in the calendar

### TimeSlotPicker (Calendly-style)

| Aspect | Rating | Notes |
|--------|--------|-------|
| Visual hierarchy | 4/5 | Clear two-panel split |
| Brand coherence | 4/5 | Good use of brand colors, primary-600 prominent |
| Emotional resonance | **Professional, approachable** | Clean Calendly-like feel |
| Cognitive load | **Low-Medium** | Clear progressive disclosure |

**First Impression:** *"This is the better scheduling experience — why isn't this the primary paradigm?"*

---

## Part 2: Visual Design Audit

### 2.1 Typography Assessment

| Element | Current State | Issue Severity | Recommendation |
|---------|---------------|----------------|----------------|
| Modal header | `text-xl font-semibold` | Minor | Consider `text-heading-sm` (24px) for modal titles per design system |
| Form labels | Icons only, no explicit labels | **Major** | Add visible labels for accessibility; icons alone are insufficient |
| Calendar day headers | `text-xs` + `text-sm` stacked | Minor | Date format `d/M` is non-standard — use `d` only for day headers |
| Time slot labels | `text-xs` for times | None | Appropriate sizing |
| Button text | Mixed `text-sm` and default | Minor | Standardize on design system text-body-sm (16px) |

**Typography Checklist:**
- [ ] Type scale follows consistent ratio — **PARTIAL** (mixes text-xs, text-sm, text-base arbitrarily)
- [x] Line heights appropriate for context
- [x] Maximum line length controlled
- [x] Font weights used purposefully
- [ ] Sufficient contrast between hierarchy levels — **ISSUE** in calendar header area

### 2.2 Color System Assessment — CRITICAL ISSUES

#### Hardcoded Colors Violating Token System

**File: interview-scheduling-modal.tsx**

| Line | Hardcoded Value | Should Be | Severity |
|------|-----------------|-----------|----------|
| 448 | `bg-[#D8F3DC]` | `bg-[var(--background-success)]` or token | **P0** |
| 449 | `bg-[#B7E4C7]` (hover) | Should use token with opacity | **P0** |
| 450 | `bg-[#FEF3C7]` | `bg-[var(--background-warning)]` | **P0** |
| 451 | `bg-[#FDE68A]` (hover) | Should use token | **P0** |
| 525 | `bg-[#D8F3DC]` | Token reference | **P0** |
| 529 | `bg-[#FEF3C7]` | Token reference | **P0** |

**Impact:** These hardcoded greens and yellows:
1. Won't adapt to dark mode
2. Clash with the established primitive-green palette (not even close matches)
3. Make the design system meaningless in this component

**Recommended Token Mapping:**
```css
/* Availability colors should be added to token system */
--availability-free: var(--primitive-green-100);       /* #EAFFE0 not #D8F3DC */
--availability-free-hover: var(--primitive-green-200); /* #DCFAC8 not #B7E4C7 */
--availability-partial: var(--primitive-yellow-100);   /* #FFF7D6 not #FEF3C7 */
--availability-partial-hover: var(--primitive-yellow-200);
--availability-busy: var(--background-muted);
```

**File: scheduler.tsx**

| Line | Issue | Severity |
|------|-------|----------|
| 203-206 | `defaultEventColors` uses Tailwind class names, not CSS variables | P1 |
| 304 | `hover:bg-neutral-100 dark:hover:bg-neutral-800` — bypasses design system | P1 |
| 443, 452 | Same neutral class bypass pattern | P1 |
| 1263-1264 | Custom toggle uses hardcoded `bg-primary-600`, `bg-neutral-300` | P2 |

### 2.3 Spacing & Layout Assessment

**Spacing System Analysis:**
- Base unit: **Inconsistent** — mixes 4px and 8px base
- Component internal padding: `p-4`, `p-6`, `px-3 py-2` — **reasonably consistent**
- Component external margins: `gap-2`, `gap-3`, `gap-4` — **inconsistent within same components**

**Specific Issues:**

| Component | Issue | Location |
|-----------|-------|----------|
| AttendeeChip | `gap-2` inside, parent uses `gap-2` — creates visual collision | Line 206 |
| AvailabilityCalendar | `min-w-[700px]` hardcoded — doesn't use spacing tokens | Line 540 |
| Time column | `w-16` hardcoded — should be `--space-16` or similar | Line 542 |
| AddAttendeePopover | `w-72` hardcoded — arbitrary width | Line 758 |

**Layout Patterns:**

| Aspect | Evaluation |
|--------|------------|
| Grid system | **Two-column split** works well (440px fixed left, flex right) |
| Responsive behavior | **Missing** — no mobile breakpoints, fixed widths everywhere |
| White space | **Inconsistent** — left panel feels cramped, right panel is dense |
| Content density | **Too dense** in calendar grid; **appropriate** in form panel |

### 2.4 Iconography Assessment

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| Icon style | **Phosphor icons** — consistent ✓ | Maintain |
| Icon sizing | Mixed `size={16}`, `size={20}`, class `h-4 w-4` | Standardize on one approach |
| Icon stroke weight | Uses `weight="bold"` for interaction icons | Good practice ✓ |
| Icon + text alignment | `items-center gap-2` pattern | Consistent ✓ |

**Issue:** GoogleLogo and MicrosoftOutlookLogo icons imported but `MicrosoftOutlookLogo` doesn't exist in Phosphor — this would cause a runtime error or show nothing.

---

## Part 3: Interaction Design Audit

### 3.1 Component State Inventory

#### InterviewSchedulingModal - State Coverage

| State | Implemented | Quality |
|-------|-------------|---------|
| Default | ✓ | Good |
| Hover | Partial | Calendar slots have hover, form fields rely on Input defaults |
| Active/Pressed | Missing | No active state on calendar slots |
| Focus (keyboard) | Partial | Calendar slots have focus ring, but navigating is awkward |
| Disabled | Partial | Past/busy slots styled, but no cursor feedback |
| Loading | Partial | `calendarStatus === "loading"` shows pulse, but no skeleton |
| Error | Minimal | `calendarStatus === "error"` border only — no message |

#### TimeSlotChip - State Coverage

| State | Implemented | Notes |
|-------|-------------|-------|
| Default | ✓ | Brand-subtle background |
| Hover | Missing | No hover state defined |
| Focus | Missing | Remove button has focus ring, chip itself doesn't |
| Selected | N/A | Chip represents selection |

#### AttendeeChip - State Coverage

| State | Implemented | Notes |
|-------|-------------|-------|
| Default | ✓ | Card-like appearance |
| Hover | ✓ | Card hover, but only for non-candidates |
| Loading | ✓ | Pulse animation for calendar loading |
| Error | ✓ | Warning border |
| Focus | Missing | Chip is not focusable |

### 3.2 Microinteractions Assessment

| Interaction | Current Behavior | Quality | Enhancement |
|-------------|-----------------|---------|-------------|
| Calendar slot click | Immediate state change, checkmark appears | 2/5 | Add scale-down on active, subtle bounce on select |
| Slot deselection | Instant removal | 2/5 | Add fade-out transition |
| Week navigation | Instant re-render | 3/5 | Add horizontal slide animation |
| Add attendee popover | Appears instantly | 3/5 | Add subtle scale-up entrance |
| Internal notes expand | Uses Radix Collapsible | 4/5 | Works well, could use smoother easing |
| Time slot selection (TimePicker) | 220ms delay with scale animation | 4/5 | Good — `justSelected` pattern is solid |

**Microinteraction Checklist:**
- [ ] Feedback is immediate (under 100ms) — **FAIL** on week navigation
- [x] Animations have purpose
- [ ] Duration appropriate — **Mixed** (some instant, some have delays)
- [ ] Easing feels natural — **Missing** in calendar interactions
- [ ] Respects reduced-motion — **NOT IMPLEMENTED** in any component

### 3.3 Critical Interaction Issues

#### P1: Slot Selection Has No Tactile Feedback

**Current:** Click → checkmark appears instantly
**Expected:** Click → visual compression (scale-down) → checkmark fade-in with subtle bounce

```tsx
// Current (line 606-618)
<button ... onClick={() => handleSlotClick(...)}>
  {selected && <Check size={14} weight="bold" className="mx-auto" />}
</button>

// Should have active state and animation
className={cn(
  ...,
  "active:scale-95 active:bg-[var(--background-brand-muted)]",
  selected && "animate-in zoom-in-95 duration-200"
)}
```

#### P1: No Visual Indication of Max Slots Reached

When 5 slots are selected, remaining available slots should show a disabled visual state with a tooltip explaining "Maximum slots reached." Currently, they just don't respond to clicks — silent failure.

#### P1: Calendar Keyboard Navigation is Incomplete

**Current State:**
- Individual slots have `focus:ring-1 focus:ring-inset`
- No `tabIndex` management for efficient keyboard navigation
- Arrow keys don't move between slots
- No "selected slots" summary for screen readers

**Expected:**
- Tab into calendar focuses first available slot
- Arrow keys move between slots (grid navigation)
- Escape returns focus to form panel
- Screen reader announces "X of Y slots selected"

#### P2: Attendee Search Popover Closes on Any Click

**Issue:** Clicking the search input's clear button or scrolling closes the popover because the backdrop captures all clicks.

**Fix:** Use Radix Popover or implement proper click-outside detection that excludes popover contents.

---

## Part 4: User Experience Audit

### 4.1 Information Architecture Issues

#### Navigation Assessment

| Aspect | Evaluation |
|--------|------------|
| Primary navigation clarity | **Clear** — Two distinct panels |
| Label accuracy | **Poor** — No explicit labels on form fields, icon-only |
| Depth of navigation | **Flat** — Good |
| Breadcrumbs/Wayfinding | **Missing** — No indication of multi-step flow |
| Search functionality | **Good** — Attendee search works well |

#### Content Organization Issues

1. **"Insert template" button is orphaned** — It's floating next to the title input with no context about what templates exist or do.

2. **Date/Time selection is confusing:**
   - Three separate dropdowns (Date, Time, Duration) but the Time dropdown is not connected to the calendar
   - Users might change the Time dropdown thinking it selects a slot, but it doesn't
   - **Recommendation:** Remove standalone time dropdown; selection happens via calendar

3. **No summary of selected slots:**
   - Selected slots only appear as checkmarks on the calendar
   - User has to visually scan to see what they've chosen
   - **Recommendation:** Add a "Selected Times" section in the left panel showing TimeSlotChips

4. **Calendar selection field at bottom is mysterious:**
   - "Events: (diego@homerun.co)" — what is this selecting?
   - No explanation of which calendar the invite will be created on

### 4.2 User Flow Analysis

#### Flow: Recruiter Schedules Interview

```
Entry: Click "Schedule Interview" button on candidate card
Goal: Select 3-5 time slots and send to candidate

Current Steps:
1. Modal opens with candidate pre-filled ✓
2. Edit title if needed ✓
3. Adjust duration dropdown ✓
4. Select video provider ✓
5. Add/remove interviewers ✓
6. Navigate to correct week on calendar
7. Scan for green (available) slots
8. Click individual slots (no bulk selection)
9. Repeat steps 6-8 until 3-5 slots selected
10. Write instructions (optional)
11. Click "Next: Preview"
12. ??? (Preview flow not implemented)

Pain Points:
- Step 6-8 require excessive clicking for common use case
- No "suggest times" AI feature despite being an AI-enabled product
- No indication of candidate's timezone when viewing calendar
- "Next: Preview" button is disabled with no explanation why
```

**Drop-off Risks:**
- Calendar feels like work — users might abandon for simpler tools
- Confusion between form Time dropdown and calendar selection
- No progress indicator for multi-step flow

### 4.3 Accessibility Audit — CRITICAL GAPS

| Criterion | Status | Issues | Fix Priority |
|-----------|--------|--------|--------------|
| Color contrast (AA) | **FAIL** | Yellow partial availability against white bg is ~2.8:1 | P0 |
| Keyboard navigation | **PARTIAL** | Calendar grid not keyboard-navigable | P0 |
| Focus indicators | **PASS** | Ring-based focus visible | — |
| Screen reader compat | **FAIL** | No ARIA live regions for dynamic content | P0 |
| Alt text for images | N/A | No images | — |
| Form labels | **FAIL** | Icon-only labels don't announce field purpose | P0 |
| Error identification | **FAIL** | Calendar errors show only border change | P1 |
| Resize/Zoom support | **FAIL** | Fixed widths break at zoom | P1 |
| Motion control | **FAIL** | No prefers-reduced-motion support | P1 |

**Specific Accessibility Violations:**

1. **Form fields lack visible labels:**
   ```tsx
   // Current (line 971-984)
   <div className="flex items-center gap-3">
     <TextT size={20} /> {/* Icon only! */}
     <Input value={title} ... />
   </div>

   // Should have:
   <Label htmlFor="event-title" className="sr-only">Event title</Label>
   <Input id="event-title" aria-label="Event title" ... />
   ```

2. **Calendar grid not announced:**
   - No `role="grid"` or `role="gridcell"`
   - No `aria-label` on calendar region
   - Selected slots not announced

3. **Dynamic updates not announced:**
   - When attendee calendar loads, no announcement
   - When slot is selected, no confirmation
   - Need `aria-live="polite"` regions

---

## Part 5: Consistency & Design System Health

### 5.1 Pattern Consistency Matrix

| Pattern | Variations Found | Should Be | Priority |
|---------|-----------------|-----------|----------|
| Button variants | 3 (`outline`, `ghost`, undefined) | Use design system variants | Medium |
| Card layouts | Custom `bg-[var(--card-background)]` | Use `<Card>` component | Medium |
| Form patterns | Icon + Input inline | Label + Input + Help text | High |
| Spacing values | `gap-2`, `gap-3`, `gap-4`, `gap-5` arbitrary | Define clear spacing rules | Medium |
| Border radii | `rounded-lg`, `rounded-xl`, `rounded-3xl`, `rounded-full` mixed | Standardize per component type | Low |
| Shadow styles | `shadow-sm`, `shadow-lg`, custom | Use --shadow-* tokens | Low |

### 5.2 Design Debt Inventory

| Issue | Location | Impact | Effort |
|-------|----------|--------|--------|
| Hardcoded availability colors | Lines 448-458 | High | Low |
| No responsive design | Entire modal | High | High |
| Accessibility violations | Multiple | High | Medium |
| Inconsistent icon sizing | Throughout | Medium | Low |
| No loading skeleton | Calendar panel | Medium | Medium |
| Preview flow not implemented | handlePreview callback | Medium | High |
| Keyboard navigation | Calendar grid | High | High |
| No AI suggestions | Flow design | Medium | High |

---

## Part 6: Competitive Analysis

### Benchmarks Reviewed

| Platform | Relevance | Key Takeaway |
|----------|-----------|--------------|
| Calendly | High | Simpler slot selection, clear timezone handling |
| Cal.com | High | Open-source, similar multi-slot paradigm done better |
| Homerun | Direct | Smoother animations, clearer visual hierarchy |
| GoodTime | High | AI-powered scheduling suggestions |
| Greenhouse | Medium | Enterprise patterns, but dated UI |

### Gaps vs. Competition

1. **Calendly/Cal.com:** Their time slot pickers show available times in a clean list, not a dense grid. Users don't need to "find" availability — it's presented.

2. **Homerun:** Uses progressive disclosure — start with date, then show times. Canopy's current modal shows everything at once.

3. **GoodTime:** AI suggests optimal times based on attendee availability. Canopy claims to be "AI-enabled" but has no AI in scheduling.

---

## Part 7: Prioritized Recommendations

### P0 - Critical (Fix Immediately)

1. **Replace hardcoded availability colors with tokens**
   - Create `--availability-free`, `--availability-partial` tokens
   - Add dark mode variants
   - Effort: 1-2 hours

2. **Add form field labels for accessibility**
   - Add `<Label>` components with sr-only class if visual labels unwanted
   - Add `aria-label` to all form controls
   - Effort: 2-3 hours

3. **Fix color contrast on partial availability**
   - Yellow background needs darker tint or different approach
   - Consider icon or pattern overlay instead of color alone
   - Effort: 1 hour

4. **Add ARIA live regions for dynamic content**
   - Announce slot selections: "Thursday 2pm selected. 3 of 5 slots chosen."
   - Announce attendee calendar status changes
   - Effort: 2-3 hours

### P1 - High Priority (This Sprint)

5. **Add selected slots summary to left panel**
   - Display TimeSlotChips in a dedicated section
   - Remove confusion between form time dropdown and calendar
   - Effort: 3-4 hours

6. **Implement keyboard navigation for calendar grid**
   - Arrow keys to navigate
   - Enter/Space to select
   - Escape to exit grid
   - Effort: 4-6 hours

7. **Add microinteraction feedback to slot selection**
   - Active state compression
   - Selection animation
   - Effort: 2-3 hours

8. **Add explanation for disabled "Next: Preview" button**
   - Show tooltip: "Select at least 1 time slot"
   - Effort: 30 minutes

9. **Fix AddAttendeePopover click handling**
   - Use Radix Popover properly
   - Effort: 1-2 hours

10. **Add prefers-reduced-motion support**
    - Wrap animations in media query check
    - Effort: 1-2 hours

11. **Implement responsive design for mobile**
    - Stack panels vertically on small screens
    - Effort: 4-6 hours

12. **Add loading skeleton for calendar panel**
    - Show skeleton while attendee calendars load
    - Effort: 2-3 hours

### P2 - Medium Priority (This Quarter)

13. **Remove or connect standalone Time dropdown**
14. **Add AI-powered time suggestions**
15. **Implement calendar week slide animation**
16. **Add attendee timezone visualization on calendar**
17. **Create proper Preview step with email preview**
18. **Add bulk slot selection (e.g., "select all morning slots")**
19. **Standardize spacing values**
20. **Add confirmation modal for discarding changes**

### P3 - Low Priority (Backlog)

21. **Add interview templates system**
22. **Calendar sharing preferences**
23. **Recurring interview patterns**
24. **Integration with actual calendar APIs**
25. **Dark mode testing pass**
26. **Animation library upgrade (Framer Motion)**

---

## Part 8: Implementation Roadmap

### Week 1: Accessibility & Token Fixes (P0)
- [ ] Token system updates for availability colors
- [ ] Form label accessibility
- [ ] Color contrast fixes
- [ ] ARIA live regions

### Week 2: Interaction Polish (P1 partial)
- [ ] Selected slots summary UI
- [ ] Microinteraction animations
- [ ] Disabled button explanations
- [ ] Popover click handling fix

### Week 3: Keyboard & Responsive (P1 complete)
- [ ] Calendar keyboard navigation
- [ ] Responsive breakpoints
- [ ] Reduced motion support
- [ ] Loading skeletons

### Week 4: UX Refinement (P2 start)
- [ ] Form simplification
- [ ] Preview step implementation
- [ ] Week navigation animation

---

## Appendix A: Component Code References

| Issue | File | Line(s) |
|-------|------|---------|
| Hardcoded green | interview-scheduling-modal.tsx | 448-449 |
| Hardcoded yellow | interview-scheduling-modal.tsx | 450-451, 529 |
| Missing form labels | interview-scheduling-modal.tsx | 971-1141 |
| Non-keyboard calendar | interview-scheduling-modal.tsx | 600-626 |
| MicrosoftOutlookLogo import | interview-scheduling-modal.tsx | 61 |
| No ARIA regions | interview-scheduling-modal.tsx | 933-1182 |

## Appendix B: Token Additions Needed

```css
/* Add to globals.css under COMPONENT TOKENS */

/* --- AVAILABILITY CALENDAR --- */
--availability-free-background: var(--primitive-green-100);
--availability-free-background-hover: var(--primitive-green-200);
--availability-free-foreground: var(--primitive-green-700);

--availability-partial-background: var(--primitive-yellow-200); /* Darker for contrast */
--availability-partial-background-hover: var(--primitive-yellow-300);
--availability-partial-foreground: var(--primitive-yellow-700);

--availability-busy-background: var(--background-muted);
--availability-busy-foreground: var(--foreground-disabled);

--availability-past-background: var(--background-subtle);
--availability-past-foreground: var(--foreground-disabled);

--availability-selected-background: var(--background-brand);
--availability-selected-foreground: var(--foreground-on-emphasis);
```

---

**Report Generated:** January 25, 2026
**Methodology:** Manual code review, component analysis, competitive benchmarking
**Next Review:** After P0/P1 fixes implemented
