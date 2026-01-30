# Candid MVP Specification

> **Last Updated:** January 2026
> **Status:** MVP Scope Definition

---

## Overview

Candid is a climate career coaching platform that connects job seekers with expert coaching and relevant opportunities from Green Jobs Board.

### MVP Positioning

> "Candid pairs you with expert climate career coaching from Saathe Studio and connects you to opportunities on Green Jobs Board — your complete climate career launchpad."

---

## User Roles

### 1. Seekers (Primary Users)
People looking to transition into or advance within climate careers.

| Capability | MVP Status |
|------------|------------|
| Sign up & onboarding | ✅ Included |
| Book coaching sessions | ✅ With Saathe Studio |
| Browse mentors | ✅ Included |
| View job matches | ✅ From greenjobsboard.us |
| Track progress | ✅ Included |
| Message coach/mentors | ✅ Included |

### 2. Mentors (Community)
Climate professionals who offer guidance and advice to seekers.

| Capability | MVP Status |
|------------|------------|
| Sign up as mentor | ✅ Included |
| Set availability | ✅ Included |
| Accept mentee requests | ✅ Included |
| Conduct sessions | ✅ Included |

### 3. Coaches (Curated)
Professional career coaches — **not self-serve signup**.

| Capability | MVP Status |
|------------|------------|
| Self-serve signup | ❌ Descoped |
| Browse/search coaches | ❌ Descoped |
| Coach marketplace | ❌ Descoped |
| Saathe Studio integration | ✅ Single partner |
| Add coaches case-by-case | ✅ Admin process |

---

## MVP Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CANDID MVP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   SEEKERS   │     │   MENTORS   │     │   COACHING  │       │
│  │             │     │             │     │             │       │
│  │  Find jobs  │◄───►│  Give back  │     │   Saathe    │       │
│  │  Get coached│     │  to climate │     │   Studio    │       │
│  │  Connect    │     │  community  │     │   (partner) │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                   │                   │               │
│         └───────────────────┴───────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                         │
│                    │  Green Jobs     │                         │
│                    │  Board          │                         │
│                    │  greenjobsboard │                         │
│                    │  .us            │                         │
│                    └─────────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Saathe Studio Integration

### About Saathe Studio
- Founded by Radhika Bhatt
- 500+ successful climate career transitions
- Specializes in 1:1 coaching, resume reviews, job search strategy
- Established partnerships with Terra.do, Green Jobs Board, My Climate Journey

### How It Works in MVP

**Seeker Experience:**
1. Seeker completes onboarding (goals, background, target sectors)
2. Presented with Saathe Studio as coaching partner (not a marketplace)
3. Books session directly with Saathe Studio team
4. Sessions conducted via Candid platform
5. Progress tracked within Candid

**UI Approach:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🌱 YOUR COACHING PARTNER                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  [Saathe Studio Logo]                                   │   │
│  │                                                         │   │
│  │  SAATHE STUDIO                                          │   │
│  │  Climate Career Coaching Experts                        │   │
│  │                                                         │   │
│  │  "We help ambitious professionals find their place      │   │
│  │   in the climate solution space."                       │   │
│  │                                                         │   │
│  │  ✓ 500+ successful climate transitions                  │   │
│  │  ✓ Expert coaches specializing in Tech → Climate        │   │
│  │  ✓ Resume reviews, interview prep, job search strategy  │   │
│  │                                                         │   │
│  │  [Book Your First Session]                              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**No coach browsing** — Saathe Studio is presented as THE coaching partner, building credibility through their established reputation.

---

## Green Jobs Board Integration

### Source
- **URL:** greenjobsboard.us
- **Relationship:** Owned property (direct database access)

### Integration Points

| Touchpoint | Implementation |
|------------|----------------|
| Dashboard | "Jobs matching your goals" widget |
| Post-session | "Jobs to explore" based on session notes |
| Dedicated page | Full job search with filters |
| Bookmarking | Save jobs within Candid |
| Application tracking | Track: Saved → Applied → Interview → Offer |

### Job Matching Logic

For MVP, keep matching simple:

```
Match based on:
├── Target sectors (from onboarding)
├── Target role type (from onboarding)
├── Location preferences
└── Experience level

Future (post-MVP):
├── Skills discussed in coaching
├── Companies mentioned in sessions
└── Coach recommendations
```

### UI Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  💼 JOBS FOR YOU                           from greenjobsboard  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Based on your target: Product Manager - Clean Energy           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Product Lead - Grid Modernization        Aurora Solar  │   │
│  │  San Francisco, CA • $180-220K                          │   │
│  │  [View] [Save] [Discuss with Coach]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Senior PM - Energy Storage                  Stem, Inc  │   │
│  │  Remote • $160-200K                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [See all matches on Green Jobs Board →]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pages & Features

### Seeker Pages

| Page | MVP Status | Key Features |
|------|------------|--------------|
| **Dashboard** | ✅ | Progress, upcoming sessions, job matches, next actions |
| **Onboarding** | ✅ | Role selection, goals, sectors, background |
| **Sessions** | ✅ | Book with Saathe Studio, view upcoming/past |
| **Browse Mentors** | ✅ | Find and connect with climate mentors |
| **Messages** | ✅ | Chat with coach and mentors |
| **Jobs** | ✅ | Green Jobs Board integration |
| **Profile** | ✅ | Edit profile, goals, preferences |
| **Settings** | ✅ | Account settings |
| **Browse Coaches** | ❌ Descoped | Not needed for single-partner MVP |

### Mentor Pages

| Page | MVP Status | Key Features |
|------|------------|--------------|
| **Mentor Dashboard** | ✅ | Upcoming sessions, mentee requests |
| **Mentor Onboarding** | ✅ | Set up profile, expertise, availability |
| **Availability** | ✅ | Manage calendar/time slots |
| **Messages** | ✅ | Chat with mentees |

### Admin/Internal

| Page | MVP Status | Key Features |
|------|------------|--------------|
| **Add Coach** | ✅ | Manual process to add coaches case-by-case |
| **Coach Management** | ✅ | Manage Saathe Studio integration |

---

## Visual Design Fixes

Based on the UI audit, these fixes should be applied universally.

### 1. Page Container Pattern

Every page should use consistent containment:

```tsx
// components/PageContainer.tsx
export function PageContainer({
  children,
  title,
  subtitle,
  action
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        {title && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-gray-600">{subtitle}</p>
              )}
            </div>
            {action}
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
```

### 2. Card Containment

All content in cards, not floating:

```tsx
// Before: Content floats in white void
<div className="p-4">
  <h2>Sessions</h2>
  {sessions.map(...)}
</div>

// After: Content in contained cards
<Card>
  <CardHeader>
    <CardTitle>Sessions</CardTitle>
  </CardHeader>
  <CardContent>
    {sessions.map(...)}
  </CardContent>
</Card>
```

### 3. Empty States

Warm, guiding empty states:

```tsx
// components/EmptyState.tsx
export function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Warm gradient icon background */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-gray-600">{description}</p>

      {action}
    </div>
  );
}
```

**Example Usage:**
```tsx
<EmptyState
  icon="📅"
  title="No sessions yet"
  description="Book your first session with Saathe Studio to start your climate career journey."
  action={<Button>Book a Session</Button>}
/>
```

### 4. Consistent Spacing

```css
:root {
  --page-padding: 1.5rem;      /* 24px */
  --card-padding: 1.5rem;      /* 24px */
  --section-gap: 2rem;         /* 32px */
  --card-gap: 1rem;            /* 16px */
  --card-radius: 0.75rem;      /* 12px */
}
```

---

## UX Improvements (MVP Scope)

### 1. Getting Started Checklist

Show new seekers what to do first:

```
┌─────────────────────────────────────────────────────────────────┐
│  🚀 GET STARTED                                    2 of 5 done  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ Complete your profile                                       │
│  ✓ Set your climate career goals                               │
│  ○ Book your first coaching session                            │
│  ○ Browse mentors in your target sector                        │
│  ○ Save 3 jobs that interest you                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Contextual Next Actions

After key moments, show what's next:

| After... | Show... |
|----------|---------|
| Onboarding complete | "Book your first session with Saathe Studio" |
| Session booked | "Prepare for your session" checklist |
| Session complete | "Next steps from your session" |
| Job saved | "Discuss this role with your coach" |

### 3. Progress Visualization

Show climate career transition progress:

```
┌─────────────────────────────────────────────────────────────────┐
│  📈 YOUR PROGRESS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Climate Career Transition                                      │
│  ●━━━━━━━━●━━━━━━━━○━━━━━━━━○━━━━━━━━○                          │
│  Explore   Learn    Network   Apply    Land                     │
│            ↑                                                    │
│       YOU ARE HERE                                              │
│                                                                 │
│  🎯 This phase: Building climate sector knowledge               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Session Preparation

Before each session, prompt preparation:

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 PREPARE FOR TOMORROW'S SESSION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  With Saathe Studio • Tomorrow at 2:00 PM                       │
│                                                                 │
│  Reflection questions:                                          │
│  ○ What progress have you made since last session?              │
│  ○ What's your biggest challenge right now?                     │
│  ○ What do you want to focus on tomorrow?                       │
│                                                                 │
│  [Add Notes for Your Coach]                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Onboarding Flow (MVP)

### Seeker Onboarding

```
Step 1: Welcome
├── "Welcome to Candid"
├── Brief intro to climate career coaching
└── [Get Started]

Step 2: About You
├── Current role/background
├── Years of experience
└── Key skills

Step 3: Climate Goals
├── Target climate sectors (multi-select)
│   ├── Clean Energy
│   ├── Electric Vehicles
│   ├── Sustainable Agriculture
│   ├── Climate Tech
│   ├── Climate Policy
│   └── Other
├── Target role type
└── Timeline (when do you want to transition?)

Step 4: Preferences
├── Location preferences
├── Remote/hybrid/onsite
└── Salary expectations (optional)

Step 5: Meet Your Coach
├── Introduce Saathe Studio
├── Explain coaching process
└── [Book Your First Session]

Step 6: Complete
├── Dashboard tour (optional)
├── Getting started checklist
└── [Go to Dashboard]
```

### Mentor Onboarding

```
Step 1: Welcome
├── "Share your climate expertise"
├── Explain mentor role
└── [Become a Mentor]

Step 2: Your Background
├── Current role
├── Company
├── Climate sectors you work in
└── Years in climate

Step 3: Mentoring Focus
├── What can you help with?
│   ├── Breaking into climate
│   ├── Career advancement
│   ├── Specific sector knowledge
│   ├── Networking
│   └── Interview prep
└── How many hours/month?

Step 4: Availability
├── Set recurring availability
└── Connect calendar (optional)

Step 5: Profile
├── Photo
├── Bio
└── LinkedIn (optional)

Step 6: Complete
├── Profile review
└── [Publish Profile]
```

---

## Technical Notes

### Pages to Update

Based on existing codebase structure:

| Page | File | Changes Needed |
|------|------|----------------|
| Dashboard | `/src/app/candid/dashboard/page.tsx` | Add PageContainer, job widget, checklist |
| Sessions | `/src/app/candid/sessions/page.tsx` | Add PageContainer, fix empty state |
| Browse | `/src/app/candid/browse/page.tsx` | Rename to "Mentors", remove coach browse |
| Messages | `/src/app/candid/messages/page.tsx` | Add PageContainer, fix empty state |
| Onboarding | `/src/app/candid/onboarding/page.tsx` | Update flow for single-coach model |
| Profile | `/src/app/candid/profile/page.tsx` | Add PageContainer |
| Settings | `/src/app/candid/settings/page.tsx` | Add PageContainer |

### New Components Needed

```
/src/app/candid/components/
├── PageContainer.tsx      # Consistent page wrapper
├── EmptyState.tsx         # Warm empty states (may exist)
├── GettingStarted.tsx     # Checklist widget
├── JobMatches.tsx         # Green Jobs Board widget
├── SaatheStudioCard.tsx   # Coaching partner card
├── TransitionProgress.tsx # Progress visualization
└── SessionPrep.tsx        # Pre-session preparation
```

### API Endpoints Needed

```
GET  /api/jobs/matches          # Get matched jobs from Green Jobs Board
GET  /api/jobs/saved            # Get user's saved jobs
POST /api/jobs/save             # Save a job
GET  /api/progress              # Get user's transition progress
GET  /api/checklist             # Get getting started checklist status
POST /api/checklist/:item       # Mark checklist item complete
```

---

## Out of Scope (Post-MVP)

The following features are explicitly **not** in MVP:

1. **Coach marketplace** — Multiple coaches to browse/compare
2. **Coach self-serve signup** — Coaches added manually
3. **Multi-source job aggregation** — Only greenjobsboard.us
4. **Advanced job matching** — Keep matching simple for MVP
5. **Community features** — Groups, forums, peer connections
6. **Mobile app** — Web-first for MVP
7. **Power user features** — Command palette, keyboard shortcuts
8. **Analytics dashboard** — For seekers to see detailed stats
9. **Calendar sync** — Google/Outlook integration

---

## Success Metrics

### Primary Metrics
- Seekers signed up
- Sessions booked with Saathe Studio
- Session completion rate
- Jobs viewed/saved from Green Jobs Board

### Secondary Metrics
- Mentor sign-ups
- Mentor-mentee connections
- User retention (weekly active)
- Onboarding completion rate

### North Star
- **Climate career transitions** — Users who land climate jobs through Candid

---

## Launch Checklist

- [ ] Visual fixes applied to all pages
- [ ] Saathe Studio integration complete
- [ ] Green Jobs Board widget functional
- [ ] Seeker onboarding flow updated
- [ ] Mentor onboarding flow working
- [ ] Empty states replaced with warm versions
- [ ] Getting started checklist implemented
- [ ] Session booking with Saathe Studio works
- [ ] Messages between seeker/coach/mentor work
- [ ] Basic job matching from greenjobsboard.us

---

## Document History

| Date | Change |
|------|--------|
| Jan 2026 | Initial MVP spec created |
| — | Scoped to single coach (Saathe Studio) |
| — | Mentors included, coaches descoped |
| — | Job integration limited to greenjobsboard.us |
