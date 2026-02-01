# Coach Platform Specification

_Navigation, Journeys & Onboarding for Coaches_

---

## Navigation

### Header

```
[Logo] ——————————— [Notifications 🔔] [Profile/Account]
```

### Sidebar

```
- Home (ph-fill ph-house-simple)
- Clients (ph-bold ph-users)
- Sessions (ph-fill ph-calendar-dots)
- Earnings (ph-bold ph-chart-line)
- Schedule (ph-fill ph-clock)
- Messages (ph-fill ph-chat-circle-dot)

Recent Conversations ▾
  ├─ [dynamic: 3-5 items]
  └─ ...
```

### Icons

| Nav Item | Icon Class                 |
| -------- | -------------------------- |
| Home     | ph-fill ph-house-simple    |
| Clients  | ph-bold ph-users           |
| Sessions | ph-fill ph-calendar-dots   |
| Earnings | ph-bold ph-chart-line      |
| Schedule | ph-fill ph-clock           |
| Messages | ph-fill ph-chat-circle-dot |

---

## Notifications

| Type                          | Trigger                | Priority | Email              |
| ----------------------------- | ---------------------- | -------- | ------------------ |
| New message                   | Client sends message   | High     | If not seen in 1hr |
| Session booked                | Client books session   | High     | Always             |
| Session cancelled/rescheduled | Client changes session | High     | Always             |
| Upcoming reminder             | 24hr / 1hr before      | Medium   | Always             |
| Payment received              | Payout processed       | Low      | Always             |

### Notification Behavior

**Delivery Logic:**

- In-app: Always
- Email: Based on priority + user activity (active users get fewer emails)

**Interaction:**

- Quick actions on high-priority (Reply, View Session, Confirm)
- Click card → navigate to full context
- Mark as read on click

**User Preferences:**

- Toggle per notification type
- Channel control: In-app / Email / Both / Off
- Digest option for low-priority

---

## Recents Section

**Recent Conversations** — collapsible section below main nav

- Show 5 items if viewport height + available nav space allows
- Show 3 items if constrained
- Collapse on mobile, expand on tap
- Default state: expanded
- Click → navigates directly to conversation

---

## User Journeys

**Primary goal:** Build a coaching business — attract clients, deliver sessions, get paid

### Core Journeys

| Journey                 | Steps                                                                   |
| ----------------------- | ----------------------------------------------------------------------- |
| **Get discovered**      | Talent searches coaches → Views profile → Reads reviews → Sends inquiry |
| **Respond to inquiry**  | Notification → Messages → Reply → Convert to booking                    |
| **Manage availability** | Schedule → Set available hours → Block time off → Sync calendar         |
| **Conduct session**     | Session reminder → Join call → Deliver coaching → End session           |
| **Get paid**            | Session completed → Payment processed → View in Earnings → Withdraw     |
| **Build reputation**    | Session ends → Client leaves review → Review appears on profile         |
| **Manage clients**      | Clients → View history → See notes → Track progress                     |

---

## Onboarding Flow

### Phase 1: Get In (30 seconds)

| Step | Screen           | Elements                   | Notes                                  |
| ---- | ---------------- | -------------------------- | -------------------------------------- |
| 1.1  | **Sign up**      | Email/password OR LinkedIn | LinkedIn pulls professional background |
| 1.2  | **Verify email** | Inline code or magic link  | Keep in flow                           |

### Phase 2: Qualify + Build Profile (3-5 minutes)

| Step | Screen                     | Elements                                                                                                   | Notes                                              |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 2.1  | **What's your name?**      | First name, Last name                                                                                      |                                                    |
| 2.2  | **What type of coaching?** | Tappable chips: [Career] [Leadership] [Executive] [Interview Prep] [Resume Review] [Life/Wellness] [Other] | Multi-select                                       |
| 2.3  | **Your experience**        | Years coaching + professional background (brief text or LinkedIn import)                                   | Builds credibility                                 |
| 2.4  | **Certifications**         | Upload credentials (optional but highlighted if added)                                                     | Trust signal                                       |
| 2.5  | **Profile photo**          | Upload + crop                                                                                              | Required — clients need to see who they're booking |
| 2.6  | **Short bio**              | 2-3 sentences, "Tell clients about your approach"                                                          | With example templates                             |

### Phase 3: Define Services (2-3 minutes)

| Step | Screen                 | Elements                                                                            | Notes               |
| ---- | ---------------------- | ----------------------------------------------------------------------------------- | ------------------- |
| 3.1  | **What do you offer?** | Suggested packages: [Single session] [3-session bundle] [Monthly retainer] [Custom] | Pre-built templates |
| 3.2  | **Set your rates**     | Price per session / package, "Coaches like you charge $75-150/hr"                   | Benchmark guidance  |
| 3.3  | **Session length**     | [30 min] [45 min] [60 min] [90 min]                                                 | Per service type    |

### Phase 4: Availability (1-2 minutes)

| Step | Screen               | Elements                                   | Notes                         |
| ---- | -------------------- | ------------------------------------------ | ----------------------------- |
| 4.1  | **Set your hours**   | Weekly grid, tap to toggle available slots | Visual calendar UI            |
| 4.2  | **Connect calendar** | Google / Outlook sync (optional)           | Prevents double-booking       |
| 4.3  | **Buffer time**      | "Add 15 min between sessions?" [Yes] [No]  | Prevents back-to-back burnout |

### Phase 5: Get Paid Setup

| Step | Screen            | Elements                      | Notes                                  |
| ---- | ----------------- | ----------------------------- | -------------------------------------- |
| 5.1  | **Payout method** | Connect Stripe / bank account | Can skip, prompted before first payout |

### Phase 6: Go Live

| Step | Screen              | Elements                                                    | Notes                     |
| ---- | ------------------- | ----------------------------------------------------------- | ------------------------- |
| 6.1  | **Review profile**  | Preview how clients see you                                 | Last check before launch  |
| 6.2  | **Publish**         | [Go Live] button                                            | Profile now discoverable  |
| 6.3  | **Welcome to Home** | Dashboard with setup checklist, "Share your profile" prompt | First action = share link |

### Home Checklist (Post-Onboarding)

```
Get your first client
━━━━━━━━━━━━━━━━━━━━━ 60%

☑ Profile complete
☑ Services defined
☑ Availability set
☐ Connect payout — "Get paid after sessions"
☐ Share your profile — "Invite your network"
☐ First booking — "You're almost there!"
```

### Flow Diagram

```
[Sign up] → [Verify] → [Name] → [Coaching type] → [Experience]
                                                       ↓
[Photo] → [Bio] → [Services] → [Rates] → [Availability]
                                              ↓
                        [Payout setup] → [Preview] → [GO LIVE]
                                                        ↓
                                                     [HOME]
                                                        ↓
                                         ┌──────────────────────┐
                                         │ Checklist widget     │
                                         │ "Share your profile" │
                                         │ First booking goal   │
                                         └──────────────────────┘
```

---

## Re-engagement Emails

| Trigger                             | Email                                              |
| ----------------------------------- | -------------------------------------------------- |
| Signed up, didn't finish onboarding | "Pick up where you left off" (24hr)                |
| Profile incomplete after 3 days     | "Complete your profile to get discovered"          |
| No bookings after 7 days            | "Share your profile to get your first client"      |
| First booking received              | "Congrats! Here's how to prepare for your session" |
