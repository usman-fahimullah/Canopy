# Candid UI Audit Report

**Platform**: Candid — Career Coaching & Mentorship Platform
**Audit Date**: January 30, 2026
**Audit Type**: Comprehensive UI/UX Review

---

## Executive Summary

Candid is a career coaching platform within the Canopy ecosystem that connects job seekers with mentors and coaches for climate-focused career development. This audit evaluates Candid's current UI against industry best practices from leading platforms like BetterUp, CoachHub, and Torch.

**Overall Grade: B+** — Strong foundation with room for polish

### Key Findings

| Category | Score | Summary |
|----------|-------|---------|
| Information Architecture | A- | Clear user flows, logical page structure |
| Visual Consistency | B | Good patterns, some token inconsistencies |
| Component Usage | B+ | Proper use of design system, minor gaps |
| Accessibility | C+ | Needs keyboard nav and ARIA improvements |
| Mobile Experience | B+ | Responsive design works, minor refinements needed |
| Trust Signals | B- | Missing prominent reviews and verification badges |

---

## 1. Architecture & User Flows

### Current Page Structure

| Page | Route | Purpose | Status |
|------|-------|---------|--------|
| Onboarding | `/candid/onboarding` | Multi-step account setup wizard | ✅ Well implemented |
| Dashboard | `/candid/dashboard` | Personalized home with sessions & progress | ✅ Good structure |
| Browse | `/candid/browse` | Coach discovery and filtering | ✅ Works well |
| Coach Profile | `/candid/coach/[id]` | Detailed coach information | ⚠️ Needs trust signals |
| Messages | `/candid/messages` | Conversation management | ⚠️ Missing features |
| Sessions | `/candid/sessions` | Session scheduling and calendar | ✅ Functional |
| Profile | `/candid/profile` | User profile view | ✅ Good layout |
| Settings | `/candid/settings` | Account preferences | ✅ Well organized |
| Coach Dashboard | `/candid/coach-dashboard` | Coach-specific view | ✅ Role-appropriate |

### User Flow Analysis

**Strengths:**
- Clear role-based onboarding (seekers vs. mentors/coaches)
- Logical progression from browse → profile → booking
- Good separation of concerns between pages

**Gaps vs. Industry Best Practices:**
- No "first session" guidance or preparation flow
- Missing post-session feedback loop
- No goal-setting wizard integrated into onboarding

---

## 2. Design System & Token Usage

### Tokens Used Correctly ✅

```tsx
// Primary brand colors
--primitive-green-800  // Used extensively for dark green
--primitive-green-600  // Accent color
--primitive-blue-200   // Secondary backgrounds

// Semantic tokens
--border-default
--background-subtle
--shadow-card
--shadow-card-hover
```

### Critical Token Issues ❌

#### 2.1 Hardcoded Colors (P0 — Must Fix)

**Location**: `browse/page.tsx`, `coach/[id]/page.tsx`
```tsx
// Current (hardcoded)
className="text-[#F59E0B]"  // Star ratings

// Should be
className="text-[var(--rating-star)]"
```

**Fix**: Add to `globals.css`:
```css
:root {
  --rating-star: #F59E0B;
}
```

#### 2.2 Undefined Tokens (P0 — Must Fix)

These tokens are used but not defined:

| Token | Used In | Suggested Definition |
|-------|---------|---------------------|
| `--candid-dark` | Multiple components | `var(--primitive-green-800)` |
| `--candid-nav-border` | CandidSidebar | `var(--border-default)` |
| `--candid-nav-item-active` | CandidSidebar | `var(--primitive-green-100)` |
| `--candid-nav-item-hover` | CandidNav | `var(--primitive-neutral-100)` |
| `--candid-background-subtle` | Messages | `var(--background-subtle)` |
| `--candid-foreground-brand` | Various | `var(--primitive-green-800)` |

#### 2.3 Inconsistent Card Styling (P1)

```tsx
// Pattern 1: Correct
className="rounded-card bg-white p-6 shadow-card"

// Pattern 2: Inconsistent radius
className="rounded-xl bg-white p-6 shadow-card"

// Pattern 3: Missing shadow on colored backgrounds
className="rounded-card bg-[var(--primitive-blue-200)] p-5"
```

**Recommendation**: Standardize to:
```tsx
// Standard card
className="rounded-card bg-[var(--surface-default)] p-6 shadow-card"

// Colored card (maintain shadow for depth)
className="rounded-card bg-[var(--surface-brand-subtle)] p-6 shadow-card"
```

---

## 3. Component Analysis

### Components Working Well ✅

| Component | Usage | Notes |
|-----------|-------|-------|
| `Button` | Extensive | All variants used appropriately |
| `Avatar` | Consistent | Multiple sizes working (sm, default, lg, xl, 2xl) |
| `Input` | Onboarding, Settings | Works with proper labels |
| `Chip` | Sector filters, Tags | Good visual hierarchy |
| `EmptyState` | Multiple pages | Consistent empty patterns |
| `Spinner` | Loading states | Proper loading feedback |

### Components Needing Attention ⚠️

#### 3.1 CoachCard Variants

**Current variants**: `default`, `compact`, `featured`

**Issues found**:
- Featured variant uses correct token but inconsistent avatar sizing
- Chip color variants (`yellow`, `neutral`, `primary`) used loosely

**Recommendation**: Document when to use each variant:
```tsx
// default: Standard coach listing in grid
// compact: Sidebar recommendations, horizontal lists
// featured: Hero section, promotional placements
```

#### 3.2 Input Sizing Inconsistency

```tsx
// Onboarding uses
inputSize="lg"

// Settings uses
inputSize="sm"

// Should follow context guidelines:
// lg: Primary forms, onboarding, prominent actions
// md: Standard forms, settings, filters
// sm: Inline edits, compact layouts, tables
```

#### 3.3 Missing Toast Notifications

No toast/notification system visible in the codebase. This is essential for:
- Booking confirmations
- Message sent confirmations
- Error feedback
- Session reminders

**Recommendation**: Implement toast system for user feedback.

---

## 4. Page-by-Page Audit

### 4.1 Onboarding (`/candid/onboarding`)

**Strengths:**
- Beautiful step progression with animations
- Role-based conditional steps
- Good visual hierarchy

**Issues:**

| Issue | Severity | Fix |
|-------|----------|-----|
| 47 Phosphor icons imported (bundle bloat) | P1 | Use dynamic imports |
| Progress bar uses `--primitive-green-800` directly | P2 | Use semantic token |
| Step indicator uses hardcoded widths | P2 | Use spacing tokens |

**Industry Gap**: Missing goal-setting integration (CoachHub and BetterUp include goal definition in onboarding)

---

### 4.2 Browse (`/candid/browse`)

**Strengths:**
- Good search + filter combination
- View mode toggle (grid/list)
- Featured coaches section

**Issues:**

| Issue | Severity | Fix |
|-------|----------|-----|
| Hardcoded `#F59E0B` for star ratings | P0 | Use token |
| No search debouncing (fires on every keystroke) | P1 | Add 300ms debounce |
| Filter badge uses inline styles | P2 | Use Chip component |

**Industry Gap**: Missing trust signals in coach cards

**Recommendation**: Add to CoachCard:
```tsx
// Add verification badge
<Badge variant="success" size="sm">Verified</Badge>

// Show review count with rating
<span className="text-sm text-muted">({reviewCount} reviews)</span>

// Response time indicator
<span className="text-sm">Usually responds in 24h</span>
```

---

### 4.3 Coach Profile (`/candid/coach/[id]`)

**Strengths:**
- Good information layout
- Clear booking CTA
- Availability display

**Critical Missing Elements** (vs. BetterUp, CoachHub):

| Missing Element | Priority | Reason |
|-----------------|----------|--------|
| Client testimonials/reviews | P0 | Trust signal — 50% of users assess trust based on this |
| Verification badges | P0 | Credential validation |
| Response time guarantee | P1 | Sets expectations |
| Session modality options | P1 | Video, phone, async |
| Client outcomes/case studies | P2 | Demonstrates value |

**Recommendation**: Add testimonials section:
```tsx
<section className="space-y-4">
  <h3 className="text-heading-sm">What clients say</h3>
  <div className="space-y-3">
    {testimonials.map((t) => (
      <Card key={t.id}>
        <div className="flex gap-3">
          <Avatar src={t.avatar} size="sm" />
          <div>
            <p className="text-body">{t.content}</p>
            <p className="text-sm text-muted mt-1">— {t.name}, {t.role}</p>
          </div>
        </div>
      </Card>
    ))}
  </div>
</section>
```

---

### 4.4 Messages (`/candid/messages`)

**Strengths:**
- Split panel layout works well
- Message grouping by sender
- Search functionality

**Issues:**

| Issue | Severity | Fix |
|-------|----------|-----|
| Uses undefined `--candid-background-subtle` | P0 | Define token |
| Own/other message colors hardcoded | P1 | Use semantic tokens |
| No typing indicators | P1 | Add typing state |
| No read receipts | P2 | Add delivery status |
| No attachment preview | P2 | Show file thumbnails |

**Industry Best Practice** (from research):
- Position input field at bottom (✅ done correctly)
- Show typing indicators (❌ missing)
- Include delivery receipts (❌ missing)
- Thread conversations for context (⚠️ partial)

---

### 4.5 Dashboard (`/candid/dashboard`)

**Strengths:**
- Good greeting system
- Session grouping by date
- Progress visualization

**Issues:**

| Issue | Severity | Fix |
|-------|----------|-----|
| Upcoming sessions hidden on xl viewport | P1 | Fix responsive layout |
| Progress circles use magic strings | P2 | Create enum |
| No horizontal scroll hint on coach carousel | P2 | Add fade/arrow |

**Industry Gap**: Missing key dashboard elements

**Recommendation**: Add these sections:
```
┌─────────────────────────────────────────────┐
│ Quick Actions                               │
│ [Book Session] [Message Coach] [Update Goals]│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Your Goals Progress                         │
│ ████████░░░░░░░░ 3/5 complete              │
│ Next milestone: Complete career assessment  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Session Notes & Action Items                │
│ From your last session:                     │
│ • Update resume with new project            │
│ • Research 3 target companies               │
└─────────────────────────────────────────────┘
```

---

### 4.6 Sessions (`/candid/sessions`)

**Strengths:**
- List and calendar views available
- Filter by status
- Clear session cards

**Issues:**

| Issue | Severity | Fix |
|-------|----------|-----|
| Calendar view too basic | P1 | Enhance with proper library |
| Status colors hardcoded in calendar dots | P1 | Use status tokens |
| No pre-session preparation prompts | P2 | Add "Prepare" action |

---

### 4.7 Settings (`/candid/settings`)

**Strengths:**
- Clear tab structure
- Form fields organized
- Good notification preferences layout

**Issues:**

| Issue | Severity | Fix |
|-------|----------|-----|
| Bio field disabled without visual indication | P2 | Add disabled styling |
| Input size ("sm") differs from onboarding ("lg") | P2 | Standardize |

---

## 5. Accessibility Audit

### Critical Issues (P0)

| Issue | Impact | Fix |
|-------|--------|-----|
| Star rating color `#F59E0B` may fail contrast | WCAG AA fail | Test and adjust |
| Some icon-only buttons lack labels | Screen readers | Add `aria-label` |
| Focus indicators not visible on all elements | Keyboard nav | Add focus styles |

### Keyboard Navigation Gaps

```tsx
// Modal should support Escape to close
// Add to BookingModal.tsx:
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

### Screen Reader Improvements

```tsx
// Add to star ratings
<span className="sr-only">{rating} out of 5 stars</span>

// Add to avatar initials
<Avatar aria-label={`${user.name}'s profile picture`} />
```

---

## 6. Mobile Experience

### Working Well ✅
- Bottom navigation functional
- Mobile menu sheet works
- Responsive grid layouts

### Improvements Needed ⚠️

| Issue | Fix |
|-------|-----|
| Featured coaches horizontal scroll lacks visual hint | Add fade gradient at edges |
| Messages panel shows 2-column on tablet | Consider single column on smaller tablets |
| Touch targets on some icons too small | Ensure minimum 44x44px |

---

## 7. Trust & Credibility Gap Analysis

### Currently Present ✅
- Coach profile photos
- Specialization tags
- Availability indicators

### Missing (Industry Standard) ❌

| Element | Priority | Implementation |
|---------|----------|----------------|
| Star ratings on browse cards | P0 | Add to CoachCard |
| Review count display | P0 | Show "(X reviews)" |
| Verification badges | P0 | Add certified coach indicator |
| Response time guarantee | P1 | "Usually responds in 24h" |
| Session completion rate | P1 | "98% sessions completed" |
| Client testimonials | P1 | Quotes from past clients |
| Credentials display | P1 | Certifications, affiliations |
| "Featured Coach" badges | P2 | Highlight top performers |

---

## 8. Performance Considerations

### Bundle Size Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| 47 icons imported in onboarding | +~50KB | Dynamic imports |
| No image optimization | Slow loads | Use Next.js Image |
| Search on keystroke | Excessive API calls | Debounce 300ms |

### Recommended Optimizations

```tsx
// Dynamic icon import
const PhUserCircle = dynamic(() =>
  import('@phosphor-icons/react').then(mod => mod.UserCircle)
);

// Image optimization
import Image from 'next/image';
<Image
  src={coach.photoUrl}
  alt={coach.name}
  width={80}
  height={80}
  className="rounded-full"
/>

// Search debouncing
import { useDebouncedCallback } from 'use-debounce';
const debouncedSearch = useDebouncedCallback(
  (value) => searchCoaches(value),
  300
);
```

---

## 9. Priority Action Items

### P0 — Must Fix (This Sprint)

1. **Define missing CSS tokens** in `globals.css`
   - `--candid-dark`, `--candid-nav-*`, `--rating-star`

2. **Replace hardcoded colors**
   - Star ratings: `#F59E0B` → `var(--rating-star)`
   - Message bubbles: Use semantic tokens

3. **Add trust signals to coach browse/profile**
   - Star ratings with review count
   - Verification badges

### P1 — Should Fix (Next 2 Sprints)

1. **Add search debouncing** to browse page

2. **Implement toast notification system** for user feedback

3. **Add typing indicators and read receipts** to messages

4. **Fix dashboard responsive issue** (upcoming sessions hidden on xl)

5. **Add keyboard navigation** (Escape to close modals)

6. **Add testimonials section** to coach profiles

### P2 — Nice to Have (Backlog)

1. Optimize icon imports with dynamic loading

2. Add skeleton loading states for perceived performance

3. Implement session preparation prompts

4. Add goal-setting wizard to onboarding

5. Create component documentation for Candid-specific components

---

## 10. Comparison: Candid vs. Industry Leaders

| Feature | Candid | BetterUp | CoachHub | Torch |
|---------|--------|----------|----------|-------|
| Coach Discovery | ✅ | ✅ | ✅ | ✅ |
| Verification Badges | ❌ | ✅ | ✅ | ✅ |
| Client Reviews | ❌ | ✅ | ✅ | ⚠️ |
| Goal Tracking | ⚠️ | ✅ | ✅ | ✅ |
| Session Notes | ❌ | ✅ | ✅ | ✅ |
| Pre-Session Prep | ❌ | ✅ | ✅ | ⚠️ |
| Progress Dashboard | ✅ | ✅ | ✅ | ✅ |
| Mobile App | ⚠️ | ✅ | ✅ | ✅ |
| Async Messaging | ✅ | ✅ | ✅ | ✅ |
| Typing Indicators | ❌ | ✅ | ⚠️ | ⚠️ |

**Legend**: ✅ Present | ⚠️ Partial | ❌ Missing

---

## Conclusion

Candid has a **solid foundation** with well-structured user flows, good responsive design, and proper use of the design system. The main areas for improvement are:

1. **Trust & Credibility** — Add reviews, ratings, and verification badges to build user confidence in coaches

2. **Design Token Consistency** — Define missing tokens and replace hardcoded values

3. **Communication Features** — Enhance messaging with typing indicators and read receipts

4. **Accessibility** — Improve keyboard navigation and screen reader support

With focused effort on the P0 and P1 items, Candid can move from a B+ to an A- grade and compete effectively with established coaching platforms.

---

*Audit conducted using industry best practices from BetterUp, CoachHub, Torch, and Bravely, combined with WCAG accessibility guidelines and modern SaaS UI/UX standards.*
