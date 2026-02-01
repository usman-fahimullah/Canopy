# Candid UX Improvements

## The Core Problem: "Users Feel Lost"

When users feel lost, it means the app doesn't answer three critical questions at every moment:

1. **Where am I?** — Context and orientation
2. **What can I do here?** — Available actions
3. **What should I do next?** — Guided path forward

---

## UX Audit Findings

### Current State Analysis

| Page       | Where am I?    | What can I do?   | What should I do next?      |
| ---------- | -------------- | ---------------- | --------------------------- |
| Onboarding | ✅ Clear steps | ✅ Clear actions | ✅ Clear progression        |
| Dashboard  | ⚠️ Okay        | ❌ Unclear       | ❌ No guidance              |
| Browse     | ✅ Clear       | ⚠️ Search/filter | ❌ No guidance on selection |
| Sessions   | ✅ Clear       | ⚠️ Book/view     | ❌ No guidance              |
| Messages   | ✅ Clear       | ❌ Feels empty   | ❌ No next step             |

**Key insight**: Onboarding is well-designed, but once users hit the dashboard, guidance disappears.

---

## UX Improvement #1: Getting Started Checklist

### Problem

After onboarding, users land on a dashboard with vague "My Progress" circles that show 0/8 sessions, 0/3 milestones, etc. This doesn't tell them **what to do**.

### Solution

Add a **Getting Started checklist** that appears for new users until completed.

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 Get Started with Candid                          2/5 ✓ │
├─────────────────────────────────────────────────────────────┤
│  ✅ Complete your profile                                   │
│  ✅ Set your career goals                                   │
│  ○  Browse coaches and find a match         [Browse Now →]  │
│  ○  Book your first session                                 │
│  ○  Complete your first session                             │
└─────────────────────────────────────────────────────────────┘
```

### Implementation

```tsx
// components/GettingStartedChecklist.tsx
interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  action?: {
    label: string;
    href: string;
  };
}

export function GettingStartedChecklist({ items, onDismiss }: Props) {
  const completedCount = items.filter((i) => i.completed).length;
  const allComplete = completedCount === items.length;

  if (allComplete) return null; // Auto-hide when complete

  return (
    <Card className="mb-6 border-l-4 border-l-[var(--primitive-green-600)]">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket size={20} className="text-[var(--primitive-green-700)]" />
            <h3 className="font-semibold">Get Started with Candid</h3>
          </div>
          <span className="text-muted text-sm">
            {completedCount}/{items.length}
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <Circle className="text-gray-300" />
                )}
                <span className={item.completed ? "text-muted line-through" : ""}>
                  {item.label}
                </span>
              </div>
              {!item.completed && item.action && (
                <Button variant="link" size="sm" asChild>
                  <Link href={item.action.href}>{item.action.label} →</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
```

---

## UX Improvement #2: Contextual Next Actions

### Problem

Every page has actions, but users don't know which action is most important right now.

### Solution

Add **contextual prompts** that suggest the single most important next action based on user state.

### Examples

**Dashboard (no sessions booked):**

```
┌─────────────────────────────────────────────────────────────┐
│  💡 Suggested next step                                     │
│                                                             │
│  You haven't booked any sessions yet. Finding a coach       │
│  is the first step to accelerating your climate career.     │
│                                                             │
│  [Browse Coaches →]                                         │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard (session booked, upcoming):**

```
┌─────────────────────────────────────────────────────────────┐
│  📅 Your next session is tomorrow at 2:00 PM                │
│                                                             │
│  Prepare by reviewing your goals and writing down           │
│  3 questions you'd like to discuss with Sarah.              │
│                                                             │
│  [Prepare for Session →]          [View Session Details]    │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard (session completed, no review):**

```
┌─────────────────────────────────────────────────────────────┐
│  ⭐ How was your session with Marcus?                       │
│                                                             │
│  Your feedback helps other seekers find great coaches       │
│  and helps Marcus improve their coaching.                   │
│                                                             │
│  [Leave Review →]                            [Skip for now] │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Logic

```tsx
function getNextAction(userData: UserData): NextAction {
  // Priority order
  if (!userData.hasCompletedProfile) {
    return {
      type: "complete_profile",
      title: "Complete your profile",
      description: "Add a photo and bio so coaches know who you are",
      action: { label: "Complete Profile", href: "/candid/profile/edit" },
    };
  }

  if (userData.goals.length === 0) {
    return {
      type: "set_goals",
      title: "Set your career goals",
      description: "Help coaches understand what you're working towards",
      action: { label: "Set Goals", href: "/candid/settings/goals" },
    };
  }

  if (userData.sessionsBooked === 0) {
    return {
      type: "find_coach",
      title: "Find your first coach",
      description: "Browse climate professionals who can guide your journey",
      action: { label: "Browse Coaches", href: "/candid/browse" },
    };
  }

  const upcomingSession = userData.sessions.find((s) => s.status === "upcoming");
  if (upcomingSession && isWithin24Hours(upcomingSession.scheduledAt)) {
    return {
      type: "prepare_session",
      title: `Prepare for your session with ${upcomingSession.coach.firstName}`,
      description: "Review your goals and prepare questions",
      action: { label: "Prepare", href: `/candid/sessions/${upcomingSession.id}/prepare` },
    };
  }

  const needsReview = userData.sessions.find((s) => s.status === "completed" && !s.hasReview);
  if (needsReview) {
    return {
      type: "leave_review",
      title: `How was your session with ${needsReview.coach.firstName}?`,
      description: "Your feedback helps the community",
      action: { label: "Leave Review", href: `/candid/sessions/${needsReview.id}/review` },
    };
  }

  // Default: encourage booking another session
  return {
    type: "book_more",
    title: "Keep the momentum going",
    description: "Regular sessions lead to better outcomes",
    action: { label: "Book Session", href: "/candid/browse" },
  };
}
```

---

## UX Improvement #3: Coach Selection Guidance

### Problem

Users browse coaches but don't know how to choose the right one.

### Solution

Add **coach matching guidance** and **comparison tools**.

### Improvements

**1. Add "Why this coach?" section to profiles:**

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 Why Sarah might be a good fit                           │
├─────────────────────────────────────────────────────────────┤
│  • Expertise in Clean Energy matches your interests         │
│  • Has helped 12 people transition from traditional energy  │
│  • Responds within 24 hours                                 │
│  • 4.9★ rating from 23 reviews                              │
└─────────────────────────────────────────────────────────────┘
```

**2. Add filters that matter:**

```
Instead of just "Highest Rated", add:
- "Best match for your goals"
- "Most responsive"
- "Available this week"
- "Similar background to you"
```

**3. Add "Compare" feature:**
Allow users to compare 2-3 coaches side-by-side before booking.

---

## UX Improvement #4: Session Preparation Flow

### Problem

Users book sessions but show up unprepared, leading to less valuable conversations.

### Solution

Add a **session preparation flow** that triggers before each session.

### Pre-Session Flow

**24 hours before session — Email/notification:**

```
Your session with Sarah is tomorrow at 2:00 PM

📋 Prepare for a great session:
   1. Review your goals
   2. Write down 2-3 questions
   3. Think about recent wins or challenges

[Prepare Now →]
```

**In-app preparation page:**

```
┌─────────────────────────────────────────────────────────────┐
│  Prepare for your session with Sarah                        │
│  Tomorrow at 2:00 PM · 45 minutes                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 Your goals to discuss:                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ □ Land a role in climate tech                         │  │
│  │ □ Build a climate-focused network                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ❓ Questions for Sarah:                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ What's the best way to break into solar?              │  │
│  │                                                       │  │
│  │ [+ Add another question]                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  📝 Notes (coach will see these before the session):        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ I've been applying to solar companies but not         │  │
│  │ getting responses. Would love advice on my resume...  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [Save Preparation]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## UX Improvement #5: Post-Session Action Items

### Problem

Sessions happen, but there's no structured way to capture and track action items.

### Solution

Add **post-session action items** that both coach and seeker can add.

### Post-Session Flow

**Immediately after session ends:**

```
┌─────────────────────────────────────────────────────────────┐
│  Session Complete! 🎉                                       │
│  Great conversation with Sarah                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 Action items from this session:                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ □ Update resume with solar-specific keywords          │  │
│  │ □ Apply to 3 companies Sarah recommended              │  │
│  │ □ Connect with Marcus on LinkedIn (intro from Sarah)  │  │
│  │                                                       │  │
│  │ [+ Add action item]                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  📅 Next session:                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ○ Same time next week (recommended)                   │  │
│  │ ○ In 2 weeks                                          │  │
│  │ ○ I'll book later                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [Complete & Leave Review]                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Integration

Show action items on dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Your Action Items                              2/4 done │
├─────────────────────────────────────────────────────────────┤
│  ✅ Update resume with solar-specific keywords              │
│  ✅ Connect with Marcus on LinkedIn                         │
│  □  Apply to 3 companies Sarah recommended     [Due: Jan 5] │
│  □  Prepare questions for next session         [Due: Jan 7] │
└─────────────────────────────────────────────────────────────┘
```

---

## UX Improvement #6: Progress That Motivates

### Problem

Current progress shows "0/8 sessions, 2/5 actions" but doesn't explain why these numbers matter or what they lead to.

### Solution

Replace abstract metrics with **meaningful milestones** tied to outcomes.

### Before (Current)

```
My Progress
[○] Sessions: 0/8
[○] Actions: 2/5
[○] Skills: 1/4
[○] Milestones: 0/3
```

### After (Improved)

```
┌─────────────────────────────────────────────────────────────┐
│  Your Journey to Climate Tech                               │
│  ━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│            ↑                                                │
│       You are here                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Milestone 1: Foundation                                 │
│     Created profile, set goals, chose sectors              │
│                                                             │
│  🔄 Milestone 2: First Connection (in progress)             │
│     Book and complete your first coaching session           │
│     Progress: 0/1 sessions                                  │
│     [Book a Session →]                                      │
│                                                             │
│  ○  Milestone 3: Building Momentum                          │
│     Complete 3 sessions and work on action items            │
│                                                             │
│  ○  Milestone 4: Ready to Apply                             │
│     Resume reviewed, target companies identified            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## UX Improvement #7: Empty States That Guide

### Problem

Empty states say "No X found" but don't help users understand what to do.

### Solution

Make every empty state a **teaching moment** with clear next steps.

### Examples

**Sessions (empty):**

```
Before: "No sessions found. Book your first session to get started."

After:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         [Warm illustration of coaching session]             │
│                                                             │
│              Start Your Coaching Journey                    │
│                                                             │
│     Regular sessions with a coach help you:                 │
│     • Get personalized career guidance                      │
│     • Build accountability for your goals                   │
│     • Access insider knowledge and connections              │
│                                                             │
│     Most seekers book their first session within            │
│     48 hours of signing up.                                 │
│                                                             │
│               [Find Your First Coach →]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Messages (empty):**

```
Before: "No conversations yet. Find a mentor to start chatting."

After:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         [Warm illustration of messaging]                    │
│                                                             │
│              Connect with Your Coach                        │
│                                                             │
│     Messages appear here after you book a session.          │
│     You can use messaging to:                               │
│     • Ask quick questions between sessions                  │
│     • Share resources and updates                           │
│     • Coordinate scheduling                                 │
│                                                             │
│               [Browse Coaches →]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## UX Improvement #8: Contextual Help

### Problem

Users don't know what features exist or how to use them effectively.

### Solution

Add **contextual tooltips** and **feature discovery** moments.

### Implementation

**1. First-time feature tooltips:**

```tsx
// Show tooltip on first visit to a page
<Tooltip
  open={isFirstVisit("browse_page")}
  content={
    <div>
      <strong>Pro tip:</strong> Use "Best match" filter to see coaches whose expertise matches your
      goals.
    </div>
  }
>
  <Select>...</Select>
</Tooltip>
```

**2. "Did you know?" moments:**

```
After completing a session:
┌─────────────────────────────────────────────────────────────┐
│  💡 Did you know?                                           │
│                                                             │
│  You can message Sarah between sessions for quick           │
│  questions. Most coaches respond within 24 hours.           │
│                                                             │
│  [Message Sarah →]                          [Got it]        │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1: Foundation (Week 1-2)

1. ✅ Getting Started Checklist
2. ✅ Contextual Next Actions on Dashboard
3. ✅ Improved Empty States

### Phase 2: Session Flow (Week 3-4)

4. Session Preparation Page
5. Post-Session Action Items
6. Action Items on Dashboard

### Phase 3: Discovery & Progress (Week 5-6)

7. Coach Matching Guidance
8. Milestone-based Progress
9. Contextual Tooltips

---

## Measuring Success

Track these metrics to validate UX improvements:

| Metric                                | Current | Target   |
| ------------------------------------- | ------- | -------- |
| Time to first session booked          | ? days  | < 3 days |
| Session completion rate               | ? %     | > 90%    |
| Return rate after first session       | ? %     | > 70%    |
| User-reported "confusion" in feedback | ?       | < 10%    |
| Getting Started checklist completion  | N/A     | > 80%    |

---

## Summary

The core fix for "users feel lost" is to **always answer three questions**:

1. **Where am I?** → Clear page context and navigation
2. **What can I do?** → Visible, relevant actions
3. **What should I do next?** → Contextual guidance based on user state

Every page should have a clear "north star action" that guides users toward their goals.
