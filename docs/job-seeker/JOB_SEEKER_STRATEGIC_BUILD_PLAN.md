# Job Seeker Portal - Strategic Build Plan

**Date:** January 28, 2026
**Objective:** Prioritize Job Seeker Portal components based on existing assets, design availability, and impact

---

## Existing Component Audit

### ✅ Already Built & Documented

| Component                | Location                           | Status         | Notes                               |
| ------------------------ | ---------------------------------- | -------------- | ----------------------------------- |
| **Job Post Card**        | `/components/job-post-card`        | ✅ Complete    | THIS IS THE JOB CARD - ready to use |
| **Job Note Card**        | `/components/job-note-card`        | ✅ Complete    | Used in "Job Notes" section         |
| **Info Tag**             | `/components/ui/info-tag.tsx`      | ✅ Implemented | Needs docs only                     |
| **Pathway Tag**          | `/components/ui/pathway-tag.tsx`   | ✅ Implemented | Needs docs only                     |
| **Category Tag**         | `/components/ui/category-tag.tsx`  | ✅ Implemented | Needs docs only                     |
| **Avatar**               | `/components/avatar`               | ✅ Complete    | Used in profile header              |
| **Badge**                | `/components/badge`                | ✅ Complete    | Status indicators                   |
| **Segmented Controller** | `/components/segmented-controller` | ✅ Complete    | Tab navigation                      |
| **Card**                 | `/components/card`                 | ✅ Complete    | Base for custom cards               |
| **Button**               | `/components/buttons`              | ✅ Complete    | All button variants                 |

### ⚠️ Needs Documentation (Implementation Exists)

| Component    | File                  | Action Needed                              |
| ------------ | --------------------- | ------------------------------------------ |
| Info Tag     | `ui/info-tag.tsx`     | Create `/components/info-tag/page.tsx`     |
| Pathway Tag  | `ui/pathway-tag.tsx`  | Create `/components/pathway-tag/page.tsx`  |
| Category Tag | `ui/category-tag.tsx` | Create `/components/category-tag/page.tsx` |

### ❌ Not Built Yet

| Component            | Priority | Reason                                        |
| -------------------- | -------- | --------------------------------------------- |
| Collection Card      | **P0**   | Featured Collections - unique gradient design |
| Pathway Card         | **P1**   | Pathway browsing - simple icon card           |
| Goal Card            | **P1**   | Profile goals - progress tracking             |
| Work Experience Item | **P1**   | Profile timeline - company history            |
| Profile Header       | **P1**   | Profile page hero - complex layout            |
| File List Item       | **P2**   | Profile files - simple list component         |
| Editable Section     | **P2**   | Inline editing pattern                        |
| Cover Photo Upload   | **P2**   | Profile customization                         |

---

## Design Asset Inventory

### What Designs Do You Have?

Let me know which of these you have Figma designs for:

- [ ] Collection Card (gradient cards)
- [ ] Pathway Card (icon + label)
- [ ] Goal Card (progress tracking)
- [ ] Work Experience Item (timeline entry)
- [ ] Profile Header (cover + avatar + badges)
- [ ] File List Item
- [ ] Editable Section (inline edit)
- [ ] Cover Photo Upload

**Action:** Please share Figma links for the components you have designs for.

---

## Strategic Build Order

### Phase 1: Documentation for Existing Components (1 day)

**Impact:** High - Exposes already-working components
**Effort:** Low - Just documentation

1. **Info Tag** (`/components/info-tag/page.tsx`)
   - Already implemented with variants
   - Used for job metadata (Remote, Senior, Full-time)
   - **Effort:** 2 hours

2. **Pathway Tag** (`/components/pathway-tag/page.tsx`)
   - Icon-only pathway indicator
   - 14 pathway types supported
   - **Effort:** 2 hours

3. **Category Tag** (`/components/category-tag/page.tsx`)
   - Job category labels
   - Color-coded variants
   - **Effort:** 1 hour

**Deliverable:** 3 new documentation pages, updated navigation

---

### Phase 2: Quick Wins - Simple Components (2-3 days)

**Impact:** Medium - Unlocks Pathway browsing
**Effort:** Low - Straightforward implementations

4. **Pathway Card** (if design available)
   - Icon + pathway name + job count
   - Simple card layout
   - Hover states
   - **Effort:** 4 hours (build) + 2 hours (docs) = 6 hours

5. **File List Item**
   - File name, size, download button
   - Simple list component
   - **Effort:** 3 hours (build) + 2 hours (docs) = 5 hours

6. **Work Experience Item** (if design available)
   - Company logo + title + dates
   - Timeline/list layout
   - **Effort:** 4 hours (build) + 2 hours (docs) = 6 hours

**Deliverable:** 3 new components, fully documented

---

### Phase 3: Collection Card - High Impact (3-4 days)

**Impact:** Very High - Featured Collections is a key section
**Effort:** Medium - Gradient backgrounds, badge positioning

7. **Collection Card**
   - Large gradient background cards
   - Multiple badge support (e.g., "187 Jobs", sponsor logo)
   - Responsive image/gradient handling
   - Hover effects with shadow
   - **Components needed:**
     - Gradient token definitions
     - Badge positioning system
     - Responsive image handling
   - **Effort:**
     - Token setup: 2 hours
     - Component build: 6 hours
     - Documentation: 3 hours
     - **Total: 11 hours**

**Deliverable:** Collection Card component, token additions, full docs

---

### Phase 4: Profile Components (4-5 days)

**Impact:** High - Complete profile page
**Effort:** Medium-High - Complex layouts

8. **Profile Header** (if design available)
   - Cover photo upload/display
   - Avatar overlay
   - Name + location + badges
   - Edit/share actions
   - **Effort:** 8 hours (build) + 3 hours (docs) = 11 hours

9. **Goal Card** (if design available)
   - Icon + title + progress
   - View Goal action
   - Color-coded icons
   - **Effort:** 5 hours (build) + 2 hours (docs) = 7 hours

10. **Editable Section**
    - Inline text editing
    - Show/edit mode toggle
    - Save/cancel actions
    - **Effort:** 6 hours (build) + 3 hours (docs) = 9 hours

**Deliverable:** Profile page components, full docs

---

## Recommended Priority Order

Based on **impact vs. effort**, here's the strategic order:

### Week 1: Foundation (Days 1-2)

**Goal:** Make existing components visible and usable

✅ **Day 1-2:** Document Info Tag, Pathway Tag, Category Tag (5 hours)

- Immediate value - these already work
- Quick documentation wins
- Updates navigation/search

### Week 2: Featured Content (Days 3-6)

**Goal:** Enable Featured Collections and Pathway browsing

🎯 **Day 3-4:** Collection Card (11 hours)

- **High impact** - Featured Collections is a hero section
- Gradient tokens benefit other components
- Visually impressive

🎯 **Day 5-6:** Pathway Card (6 hours)

- Unlocks pathway browsing
- Simple implementation
- Good pairing with Collection Card

### Week 3: Profile Basics (Days 7-11)

**Goal:** Core profile functionality

📋 **Day 7-8:** Work Experience Item (6 hours)

- Timeline component
- Reusable pattern

📋 **Day 9:** File List Item (5 hours)

- Resume/document management
- Simple but necessary

📋 **Day 10-11:** Goal Card (7 hours)

- Progress tracking
- Engaging UX

### Week 4: Profile Polish (Days 12-15)

**Goal:** Complete profile page

🎨 **Day 12-13:** Profile Header (11 hours)

- Complex but impressive
- Cover photo + avatar pattern

🎨 **Day 14-15:** Editable Section (9 hours)

- Inline editing pattern
- Reusable for summary/skills

---

## Design Dependencies

To proceed efficiently, I need:

### Critical (Week 2)

- [ ] **Collection Card Figma link** - Gradient specs, badge positioning
- [ ] **Pathway Card Figma link** - Icon size, layout specs

### Important (Week 3-4)

- [ ] **Profile Header Figma link** - Cover/avatar overlap, badge layout
- [ ] **Goal Card Figma link** - Icon style, progress indicator
- [ ] **Work Experience Figma link** - Timeline/list layout
- [ ] **Editable Section Figma link** - Edit mode UI

### Nice to Have

- [ ] **File List Item Figma link** - Can infer from existing patterns

---

## Quick Decision Matrix

| Component           | Has Design? | Complexity | Impact    | Build First?      |
| ------------------- | ----------- | ---------- | --------- | ----------------- |
| Info Tag (docs)     | ✅ Exists   | Low        | High      | ⭐⭐⭐ YES        |
| Pathway Tag (docs)  | ✅ Exists   | Low        | High      | ⭐⭐⭐ YES        |
| Category Tag (docs) | ✅ Exists   | Low        | Medium    | ⭐⭐ YES          |
| Collection Card     | ?           | Medium     | Very High | ⭐⭐⭐ After docs |
| Pathway Card        | ?           | Low        | Medium    | ⭐⭐ Week 2       |
| Work Experience     | ?           | Low        | Medium    | ⭐⭐ Week 3       |
| Goal Card           | ?           | Medium     | Medium    | ⭐⭐ Week 3       |
| Profile Header      | ?           | High       | High      | ⭐ Week 4         |
| File List Item      | ?           | Low        | Low       | ⭐ Week 3         |
| Editable Section    | ?           | Medium     | Medium    | ⭐ Week 4         |

---

## Next Steps

### Immediate Action (Today)

1. **Confirm Collection Card design availability**
   - This is the highest-impact component
   - Need gradient specs, dimensions, badge positioning

2. **Share available Figma links**
   - Drop all Job Seeker Portal design links
   - I'll extract specs for each component

3. **Decide on Phase 1 start**
   - Should I start documenting Info Tag, Pathway Tag, Category Tag?
   - These give immediate value (5 hours of work)

### This Week Options

**Option A: Documentation First (Safe)**

- Day 1-2: Document existing components (Info, Pathway, Category tags)
- Day 3-4: Collection Card (if design ready)
- **Pro:** Quick wins, existing code works
- **Con:** No new functionality until Day 3

**Option B: Collection Card First (Impact)**

- Day 1-3: Collection Card (with design specs)
- Day 4: Document existing tags
- **Pro:** High-impact feature first
- **Con:** Need design specs immediately

**Option C: Parallel Track (Efficient)**

- Day 1: Document tags (5 hours) → You review
- Day 1-3: Collection Card (11 hours) → Implement in parallel
- **Pro:** Maximum velocity
- **Con:** Requires design specs for Collection Card

---

## Questions for You

1. **Which Figma designs do you have ready?**
   - Collection Card?
   - Pathway Card?
   - Profile Header?
   - Others?

2. **What's your preferred approach?**
   - Option A: Safe (docs first)
   - Option B: Impact (Collection Card first)
   - Option C: Parallel (both simultaneously)

3. **Timeline constraints?**
   - Do you need Job Seeker Portal by a specific date?
   - Can we build iteratively (1-2 components/week)?

4. **Review cadence?**
   - Should I batch work (e.g., 3 components → review)?
   - Or show progress after each component?

---

## Success Metrics

By end of each week:

- **Week 1:** 3 documented components, updated nav, 100% of existing tags visible
- **Week 2:** Collection Card + Pathway Card live, Featured sections functional
- **Week 3:** Profile timeline + files working, Goal tracking visible
- **Week 4:** Complete profile page, inline editing, 100% coverage

**Final Deliverable:** Fully functional Job Seeker Portal with all components documented and design-system-compliant.
