# Candid Power User UX

## What Power Users Want

Power users are the opposite of new users. They:

- **Already know** where things are
- **Don't need** guidance or tooltips
- **Want speed** — fewer clicks, faster actions
- **Want depth** — advanced features, analytics, customization
- **Want control** — keyboard shortcuts, bulk actions, preferences

---

## Power User Personas

### Seeker Power User — "The Committed Transitioner"
- Has completed 5+ sessions
- Logs in multiple times per week
- Actively tracking goals and action items
- Wants to see progress over time
- May be working with multiple coaches

### Coach Power User — "The Active Mentor"
- Has 10+ active clients
- Conducts multiple sessions per week
- Needs efficient client management
- Wants analytics on their coaching
- Needs scheduling efficiency

---

## Power User Features

### 1. Command Palette (⌘K / Ctrl+K)

The #1 power user feature. A universal search/action bar that lets users do anything without navigating.

**Trigger:** `⌘K` (Mac) or `Ctrl+K` (Windows)

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Search or type a command...                             │
├─────────────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 📅  Book a session                              ⌘ B   │  │
│  │ 💬  Open messages                               ⌘ M   │  │
│  │ 🔍  Browse coaches                              ⌘ ⇧ B │  │
│  │ ⚙️  Open settings                               ⌘ ,   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  RECENT                                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 👤  Sarah Chen — Last session Jan 28                  │  │
│  │ 👤  Marcus Williams — Message draft                   │  │
│  │ 📋  Action: Apply to 3 solar companies                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Search capabilities:**
- Search coaches by name or expertise
- Search past session notes
- Search action items
- Jump to any page
- Execute common actions

**Implementation:**

```tsx
// hooks/useCommandPalette.ts
const commands = [
  { id: 'book', label: 'Book a session', shortcut: '⌘B', action: () => router.push('/candid/browse') },
  { id: 'messages', label: 'Open messages', shortcut: '⌘M', action: () => router.push('/candid/messages') },
  { id: 'sessions', label: 'View sessions', shortcut: '⌘S', action: () => router.push('/candid/sessions') },
  { id: 'settings', label: 'Open settings', shortcut: '⌘,', action: () => router.push('/candid/settings') },
];

// Listen for ⌘K
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(true);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

### 2. Keyboard Shortcuts

Power users hate reaching for the mouse. Add keyboard shortcuts for common actions.

**Global Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette |
| `⌘B` | Book a session |
| `⌘M` | Go to messages |
| `⌘S` | Go to sessions |
| `⌘,` | Open settings |
| `⌘/` | Show keyboard shortcuts |
| `Esc` | Close modal/panel |

**Page-Specific Shortcuts:**

**Browse page:**
| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `↑↓` | Navigate coaches |
| `Enter` | View selected coach |
| `B` | Book with selected coach |

**Messages:**
| Shortcut | Action |
|----------|--------|
| `↑↓` | Navigate conversations |
| `Enter` | Open conversation |
| `N` | New message |
| `⌘Enter` | Send message |

**Sessions:**
| Shortcut | Action |
|----------|--------|
| `↑↓` | Navigate sessions |
| `Enter` | View session details |
| `J` | Join session (if available) |

**Keyboard Shortcuts Help Modal:**

```
┌─────────────────────────────────────────────────────────────┐
│  ⌨️ Keyboard Shortcuts                               [Esc]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NAVIGATION                        ACTIONS                  │
│  ⌘ K    Command palette           ⌘ B    Book session      │
│  ⌘ M    Messages                  ⌘ Enter Send message     │
│  ⌘ S    Sessions                  Esc    Close modal       │
│  ⌘ ,    Settings                                           │
│                                                             │
│  BROWSE                            MESSAGES                 │
│  /      Focus search              ↑ ↓    Navigate threads  │
│  ↑ ↓    Navigate coaches          Enter  Open thread       │
│  Enter  View profile              N      New message       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Quick Actions on Hover

Power users want to act immediately without opening details pages.

**Coach Card Quick Actions:**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────┐                                                   │
│  │ 👩   │  Sarah Chen                           [Book] [💬] │
│  │      │  Clean Energy Expert · ⭐ 4.9                      │
│  └──────┘  "Helped me land my dream role..."                │
│                                      ↑                      │
│                            Hover to reveal actions          │
└─────────────────────────────────────────────────────────────┘
```

**Session Card Quick Actions:**

```
┌─────────────────────────────────────────────────────────────┐
│  Tomorrow at 2:00 PM                                        │
│  Sarah Chen · 45 min                                        │
│                                                             │
│  Hover: [Join] [Reschedule] [Message] [Cancel]              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Advanced Filtering & Saved Searches

Power users browsing coaches want precise filtering and the ability to save searches.

**Advanced Filters Panel:**

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Search coaches                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EXPERTISE                         AVAILABILITY             │
│  ☑ Clean Energy                   ○ Any time               │
│  ☑ Climate Tech                   ● This week              │
│  ☐ Policy                         ○ Next 2 weeks           │
│  ☐ Finance                                                  │
│                                                             │
│  RATING                            PRICE RANGE              │
│  ★★★★☆ 4.0+                       $50 ─────●───── $200     │
│                                                             │
│  SESSION TYPE                      EXPERIENCE               │
│  ☑ 1:1 Coaching                   ○ Any                    │
│  ☐ Resume Review                  ● 5+ years               │
│  ☐ Mock Interview                 ○ 10+ years              │
│                                                             │
│  [Clear All]                    [Save Search] [Apply]       │
└─────────────────────────────────────────────────────────────┘
```

**Saved Searches:**

```tsx
// User can save filter combinations
const savedSearches = [
  { name: "Clean energy experts", filters: { sectors: ['clean-energy'], rating: 4.5 } },
  { name: "Available this week", filters: { availability: 'this-week' } },
];

// Quick access dropdown
<Select>
  <SelectTrigger>Saved Searches</SelectTrigger>
  <SelectContent>
    {savedSearches.map(search => (
      <SelectItem key={search.name} onClick={() => applyFilters(search.filters)}>
        {search.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

### 5. Dashboard Customization

Let power users configure their dashboard to show what matters to them.

**Customizable Dashboard Widgets:**

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                    [⚙️ Customize] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ Drag to reorder ──────────────────────────────────────┐ │
│  │ ☑ Upcoming Sessions        [Collapse] [Remove] [≡]     │ │
│  │ ☑ Action Items             [Collapse] [Remove] [≡]     │ │
│  │ ☑ Progress                 [Collapse] [Remove] [≡]     │ │
│  │ ☐ Recommended Coaches      [Add]                       │ │
│  │ ☐ Recent Messages          [Add]                       │ │
│  │ ☐ Session Notes            [Add]                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  [Reset to Default]                              [Save]     │
└─────────────────────────────────────────────────────────────┘
```

**Collapsible Sections:**

Power users can collapse sections they don't need right now:

```
┌─────────────────────────────────────────────────────────────┐
│  ▼ Upcoming Sessions                              2 total   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Tomorrow 2:00 PM · Sarah Chen                        │  │
│  │  Friday 10:00 AM · Marcus Williams                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ▶ Action Items                                   3 pending │
│  (collapsed)                                                │
│                                                             │
│  ▶ Recommended Coaches                                      │
│  (collapsed)                                                │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Session Notes Search & History

Power users want to find past conversations and insights quickly.

**Session History with Search:**

```
┌─────────────────────────────────────────────────────────────┐
│  Session History                                            │
│  🔍 Search notes, action items, coaches...                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  JANUARY 2026                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Jan 28 · Sarah Chen                                   │  │
│  │ Topics: Resume optimization, solar industry           │  │
│  │ Action items: 3 (2 completed)                         │  │
│  │ [View Notes] [View Actions]                           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Jan 21 · Sarah Chen                                   │  │
│  │ Topics: Career goals, networking strategy             │  │
│  │ Action items: 2 (2 completed)                         │  │
│  │ [View Notes] [View Actions]                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  DECEMBER 2025                                              │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

**Full-Text Search Results:**

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 "solar companies"                           3 results   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Session with Sarah Chen · Jan 28                           │
│  "...Sarah recommended three [solar companies] to apply..." │
│  [View Session →]                                           │
│                                                             │
│  Action Item · Jan 28                                       │
│  "Apply to 3 [solar companies] Sarah recommended"           │
│  [View Action →]                                            │
│                                                             │
│  Session with Marcus · Jan 14                               │
│  "...transition from oil & gas to [solar companies]..."     │
│  [View Session →]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7. Analytics Dashboard

Power users want to understand their progress over time with data.

**Seeker Analytics:**

```
┌─────────────────────────────────────────────────────────────┐
│  Your Progress Analytics                       Last 90 days │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SESSION ACTIVITY                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │    ▁ ▂ ▅ █ ▇ ▃ ▂ ▅ ▇ █ ▃ ▁                           │  │
│  │   Nov      Dec      Jan                               │  │
│  └───────────────────────────────────────────────────────┘  │
│  Total: 12 sessions · Avg: 1/week · Streak: 4 weeks        │
│                                                             │
│  ACTION ITEMS                                               │
│  Completed: 18/24 (75%)                                     │
│  ████████████████░░░░░░                                     │
│                                                             │
│  GOALS PROGRESS                                             │
│  ┌─────────────────────────────────────────────┐            │
│  │ Land climate tech role      ████████░░ 80%  │            │
│  │ Build network               ██████░░░░ 60%  │            │
│  │ Update resume               ██████████ 100% │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  COACHES WORKED WITH                                        │
│  Sarah Chen (8 sessions) · Marcus Williams (4 sessions)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Coach Analytics:**

```
┌─────────────────────────────────────────────────────────────┐
│  Your Coaching Analytics                       Last 90 days │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  OVERVIEW                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    24      │  │   4.9★     │  │    12      │            │
│  │  Sessions  │  │   Rating   │  │  Clients   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                             │
│  CLIENT OUTCOMES                                            │
│  • 3 clients landed new roles this quarter                  │
│  • 85% action item completion rate                          │
│  • 100% return rate for 2nd session                         │
│                                                             │
│  AVAILABILITY UTILIZATION                                   │
│  Booked: 18/24 available slots (75%)                        │
│  ████████████████████░░░░░░                                 │
│                                                             │
│  TOP TOPICS DISCUSSED                                       │
│  Resume (8) · Interview prep (6) · Networking (5)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. Quick Rebook

Power users booking repeat sessions with the same coach shouldn't go through the full flow.

**Quick Rebook from Session Card:**

```
┌─────────────────────────────────────────────────────────────┐
│  Session Completed · Jan 28                                 │
│  Sarah Chen · 45 min                                        │
│                                                             │
│  [Quick Rebook ▾]                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Same time next week (Feb 4, 2:00 PM)                  │  │
│  │ Same time in 2 weeks (Feb 11, 2:00 PM)                │  │
│  │ Pick a different time...                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### 9. Bulk Actions

For coaches managing many clients, allow bulk operations.

**Bulk Message:**

```
┌─────────────────────────────────────────────────────────────┐
│  Your Clients                              [☐ Select All]   │
├─────────────────────────────────────────────────────────────┤
│  ☑ Jamie Wilson · Last session Jan 28                       │
│  ☑ Alex Thompson · Last session Jan 25                      │
│  ☐ Jordan Lee · Last session Jan 20                         │
│  ☑ Sam Parker · Last session Jan 18                         │
│                                                             │
│  3 selected                                                 │
│  [Send Bulk Message] [Export] [Cancel]                      │
└─────────────────────────────────────────────────────────────┘
```

---

### 10. Calendar Integration

Power users want Candid sessions in their main calendar.

**Calendar Sync Settings:**

```
┌─────────────────────────────────────────────────────────────┐
│  Calendar Integration                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CONNECTED CALENDARS                                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 📅 Google Calendar              Connected ✓  [Manage] │  │
│  │ 📅 Outlook                      Not connected [Connect]│  │
│  │ 📅 Apple Calendar               Not connected [Connect]│  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  SYNC SETTINGS                                              │
│  ☑ Add sessions to my calendar automatically                │
│  ☑ Include meeting link in calendar event                   │
│  ☑ Add 15-minute prep reminder before sessions              │
│  ☐ Block my calendar during sessions                        │
│                                                             │
│  [Save Preferences]                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1: Foundation (High Impact, Medium Effort)
1. **Command Palette** — Single biggest power user feature
2. **Keyboard Shortcuts** — Essential for efficiency
3. **Quick Actions on Hover** — Reduce clicks

### Phase 2: Efficiency (Medium Impact, Medium Effort)
4. **Quick Rebook** — Common action for repeat users
5. **Advanced Filtering** — Better coach discovery
6. **Collapsible Dashboard** — Personalization

### Phase 3: Depth (Medium Impact, High Effort)
7. **Session Notes Search** — Find past insights
8. **Analytics Dashboard** — Progress visualization
9. **Calendar Integration** — External tool sync

### Phase 4: Scale (For Coaches)
10. **Bulk Actions** — Manage many clients
11. **Client Analytics** — Track coaching impact

---

## Detecting Power Users

Automatically identify power users to offer advanced features:

```tsx
const isPowerUser = (user: User): boolean => {
  return (
    user.sessionsCompleted >= 5 ||
    user.loginCount >= 20 ||
    user.accountAge >= 60 // days
  );
};

// Progressively reveal features
if (isPowerUser(user)) {
  showKeyboardShortcutsHint();
  enableAdvancedFilters();
  showAnalyticsDashboard();
}
```

---

## Summary

| User Type | Needs | Key Features |
|-----------|-------|--------------|
| **New Users** | Guidance, clarity, next steps | Checklists, tooltips, simple flows |
| **Power Users** | Speed, efficiency, depth | Command palette, shortcuts, analytics |

The key is to **not force power user features on new users** (overwhelming) and **not hide them from power users** (frustrating).

Use progressive disclosure: start simple, reveal complexity as users grow.
