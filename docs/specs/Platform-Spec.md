# Platform Specification

_Navigation Structure & User Journeys for Talent, Coach, and Employer_

---

# Part 1: Navigation Structure

---

## Header (All Roles)

```
[Logo] ——————————— [Notifications 🔔] [Profile/Account]
```

The notification center lives in the header and is consistent across all user types.

---

## Talent Navigation

```
- Home (ph-fill ph-house-simple)
- Jobs (ph-bold ph-magnifying-glass)
- Applications (ph-fill ph-table)
- Treehouse (custom tree SVG)
- Messages (ph-fill ph-chat-circle-dot)
- Profile (custom user SVG or profile image)

Recent Applications ▾
  ├─ [dynamic: 3-5 items]
  └─ ...

+ progressive: Coaching, Mentoring
```

### Talent Notifications

| Type                      | Trigger                                  | Priority | Email              |
| ------------------------- | ---------------------------------------- | -------- | ------------------ |
| Application status change | Viewed, shortlisted, rejected, interview | High     | If not seen in 1hr |
| New message               | Employer sends message                   | High     | If not seen in 1hr |
| Job alert                 | New match based on preferences           | Medium   | Digest or off      |
| Session reminder          | 24hr / 1hr before coaching               | Medium   | Always             |
| Learning nudge            | Course progress reminder                 | Low      | Weekly digest      |

---

## Coach Navigation

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

### Coach Notifications

| Type                          | Trigger                | Priority | Email              |
| ----------------------------- | ---------------------- | -------- | ------------------ |
| New message                   | Client sends message   | High     | If not seen in 1hr |
| Session booked                | Client books session   | High     | Always             |
| Session cancelled/rescheduled | Client changes session | High     | Always             |
| Upcoming reminder             | 24hr / 1hr before      | Medium   | Always             |
| Payment received              | Payout processed       | Low      | Always             |

---

## Employer Navigation

Navigation visibility varies by user type:

| Nav Item                           | Admin | Recruiter | Hiring Team |
| ---------------------------------- | ----- | --------- | ----------- |
| Home (ph-fill ph-house-simple)     | ✓     | ✓         | ✓ (scoped)  |
| Roles (ph-fill ph-briefcase-metal) | ✓     | ✓         | —           |
| Candidates (ph-bold ph-users)      | ✓     | ✓         | ✓ (scoped)  |
| Team (ph-bold ph-users-four)       | ✓     | —         | —           |
| Analytics (ph-fill ph-chart-donut) | ✓     | ✓         | —           |

```
Recent Postings ▾
  ├─ [dynamic: 3-5 items]
  └─ ...
```

**Note:** Messages are handled contextually within candidate records, not as a separate nav item.

### Employer Notifications

| Type            | Trigger                         | Priority | Email              |
| --------------- | ------------------------------- | -------- | ------------------ |
| New application | Candidate applies               | High     | If not seen in 1hr |
| New message     | Candidate replies               | High     | If not seen in 1hr |
| Job expiring    | 7 days / 3 days before          | Medium   | Always             |
| Team activity   | Colleague comments on candidate | Low      | Digest or off      |

---

## Notification Behavior (All Roles)

**Delivery Logic:**

- In-app: Always
- Email: Based on priority + user activity (active users get fewer emails)

**Interaction:**

- Quick actions on high-priority (Review, Reply, Archive)
- Click card → navigate to full context
- Mark as read on click

**User Preferences:**

- Toggle per notification type
- Channel control: In-app / Email / Both / Off
- Digest option for low-priority

---

## Recents Section Logic

- Show 5 items if viewport height + available nav space allows
- Show 3 items if constrained
- Collapse on mobile, expand on tap
- Default state: expanded
- Click → navigates directly to item

---

## Icon Reference

### Custom SVGs

**Treehouse (Talent/Learnings):**

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.25407 10.291L11.2638 4.79247C11.69 4.40252 12.3558 4.40252 12.782 4.79247L18.7917 10.291C19.5199 10.9573 19.0337 12.1442 18.0326 12.1442L15.8124 12.1442L21.1697 17.0086C22.1562 17.9043 21.4976 19.5 20.1413 19.5L3.85879 19.5C2.50258 19.5 1.84395 17.9043 2.83044 17.0086L8.18773 12.1442L6.01317 12.1442C5.01205 12.1442 4.52586 10.9573 5.25407 10.291Z" fill="black"/>
</svg>
```

**Profile (Talent):**

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.30621 8.05285C7.30621 5.26285 9.47019 3 12.1397 3C14.8092 3 16.9731 5.26071 16.9731 8.05285C16.9731 10.845 14.8092 13.1057 12.1397 13.1057C9.47019 13.1057 7.30621 10.8428 7.30621 8.05285Z" fill="black"/>
<path d="M3.80204 20.9999H20.1975C20.3091 21.0013 20.4198 20.9797 20.5227 20.9366C20.6256 20.8934 20.7185 20.8297 20.7955 20.7492C20.8699 20.6736 20.9264 20.5825 20.961 20.4824C20.9956 20.3823 21.0074 20.2758 20.9956 20.1707C20.9948 20.1657 20.9935 20.1565 20.9917 20.1435C20.9441 19.7992 20.5197 16.7334 18.6294 15.3707C18.006 14.9213 17.2567 14.6781 16.4872 14.6754C15.7177 14.6727 14.9667 14.9106 14.3402 15.3557C12.7376 16.32 11.1265 16.32 9.4228 15.3557C8.76457 14.8628 7.16417 14.2671 5.4132 15.3385C3.35892 16.5857 3.03626 19.8278 3.00184 20.1942C2.99436 20.2984 3.00972 20.403 3.04686 20.5007C3.08401 20.5984 3.14205 20.6868 3.21695 20.7599C3.29372 20.8365 3.38495 20.8971 3.48538 20.9383C3.58581 20.9795 3.69344 21.0004 3.80204 20.9999Z" fill="black"/>
</svg>
```

### Phosphor Icons Summary

| Context               | Icon Class                  |
| --------------------- | --------------------------- |
| Home (all)            | ph-fill ph-house-simple     |
| Jobs (talent)         | ph-bold ph-magnifying-glass |
| Applications (talent) | ph-fill ph-table            |
| Messages (all)        | ph-fill ph-chat-circle-dot  |
| Clients (coach)       | ph-bold ph-users            |
| Sessions (coach)      | ph-fill ph-calendar-dots    |
| Earnings (coach)      | ph-bold ph-chart-line       |
| Schedule (coach)      | ph-fill ph-clock            |
| Roles (employer)      | ph-fill ph-briefcase-metal  |
| Candidates (employer) | ph-bold ph-users            |
| Team (employer)       | ph-bold ph-users-four       |
| Analytics (employer)  | ph-fill ph-chart-donut      |

---

# Part 2: User Journeys

---

## Talent Journeys

**Primary goal:** Find and land the right job

### Core Journeys

| Journey                 | Steps                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Find a job**          | Home → Jobs → Search/filter → View job details → Save or Apply                   |
| **Apply to a job**      | Job details → Apply → Upload resume / answer questions → Submit → Confirmation   |
| **Track applications**  | Home → Applications → View status → See employer activity → Respond to requests  |
| **Respond to employer** | Notification → Message thread → Reply → Schedule interview (if applicable)       |
| **Upskill**             | Home → Treehouse → Browse courses → Start learning → Track progress              |
| **Get coaching**        | Treehouse / Progressive unlock → Browse coaches → Book session → Attend → Review |
| **Manage profile**      | Profile → Edit info → Upload resume → Set preferences → Save                     |

---

### Talent: Onboarding Flow

#### Phase 1: Get In (30 seconds)

| Step | Screen           | Elements                                          | Notes                                     |
| ---- | ---------------- | ------------------------------------------------- | ----------------------------------------- |
| 1.1  | **Sign up**      | Email/password OR social login (Google, LinkedIn) | LinkedIn = fastest, can pull profile data |
| 1.2  | **Verify email** | Inline code entry or magic link                   | Keep them in the flow                     |

#### Phase 2: Essentials Only (60-90 seconds)

| Step | Screen                         | Elements                                                                                           | Notes                      |
| ---- | ------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------- |
| 2.1  | **What's your name?**          | First name, Last name                                                                              | Simple start, low friction |
| 2.2  | **What roles interest you?**   | Tappable chips: [Product Manager] [Designer] [Engineer] [Marketing] [Sales] [Operations] [Other →] | Multi-select, max 3-5      |
| 2.3  | **Where do you want to work?** | Location search + toggles: [Remote ✓] [Hybrid] [On-site]                                           | Smart defaults based on IP |

**→ Transition screen:**

```
"Finding jobs for you..."
[Loading animation]
"127 roles match your interests"
[See your matches →]
```

#### Phase 3: First Value Moment

| Step | Screen                   | Elements                                                                    | Notes                      |
| ---- | ------------------------ | --------------------------------------------------------------------------- | -------------------------- |
| 3.1  | **Home (first landing)** | Personalized job feed, 3-5 cards visible                                    | They see value immediately |
| 3.2  | **Soft prompt overlay**  | "Complete your profile to get 3x more views" [Continue setup] [Browse jobs] | Non-blocking, their choice |

#### Phase 4: Progressive Profiling (optional, prompted later)

| Step | Trigger                 | Screen                       | Elements                                                      |
| ---- | ----------------------- | ---------------------------- | ------------------------------------------------------------- |
| 4.1  | Clicks "Apply"          | **Upload resume**            | Drag/drop or file select, OR "Build from scratch"             |
| 4.2  | Resume uploaded         | **Confirm parsed info**      | "We found this — look right?" [Edit] [Confirm]                |
| 4.3  | Views profile           | **Add photo**                | Upload + crop, "Profiles with photos get 3x more views"       |
| 4.4  | After first application | **Notification preferences** | Job alerts frequency, application updates, messages           |
| 4.5  | Browses Treehouse       | **Experience level**         | [Entry] [Mid] [Senior] [Executive] — unlocks relevant content |

#### Home Checklist (Persistent Widget)

```
Complete your profile
━━━━━━━━━━━━━━━━━━━━━ 40%

☑ Basic info
☑ Job preferences
☐ Upload resume — "2x more likely to get contacted"
☐ Add photo — "Stand out to employers"
☐ Notification preferences
```

Disappears at 100% or can be dismissed.

#### Flow Diagram

```
[Sign up] → [Verify] → [Name] → [Roles] → [Location]
                                              ↓
                              "127 jobs match!" → [HOME]
                                                    ↓
                                    ┌────────────────────────┐
                                    │ Checklist widget       │
                                    │ Contextual prompts     │
                                    │ when they try to apply │
                                    └────────────────────────┘
```

---

## Coach Journeys

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

### Coach: Onboarding Flow

#### Phase 1: Get In (30 seconds)

| Step | Screen           | Elements                   | Notes                                  |
| ---- | ---------------- | -------------------------- | -------------------------------------- |
| 1.1  | **Sign up**      | Email/password OR LinkedIn | LinkedIn pulls professional background |
| 1.2  | **Verify email** | Inline code or magic link  | Keep in flow                           |

#### Phase 2: Qualify + Build Profile (3-5 minutes)

| Step | Screen                     | Elements                                                                                                   | Notes                                              |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 2.1  | **What's your name?**      | First name, Last name                                                                                      |                                                    |
| 2.2  | **What type of coaching?** | Tappable chips: [Career] [Leadership] [Executive] [Interview Prep] [Resume Review] [Life/Wellness] [Other] | Multi-select                                       |
| 2.3  | **Your experience**        | Years coaching + professional background (brief text or LinkedIn import)                                   | Builds credibility                                 |
| 2.4  | **Certifications**         | Upload credentials (optional but highlighted if added)                                                     | Trust signal                                       |
| 2.5  | **Profile photo**          | Upload + crop                                                                                              | Required — clients need to see who they're booking |
| 2.6  | **Short bio**              | 2-3 sentences, "Tell clients about your approach"                                                          | With example templates                             |

#### Phase 3: Define Services (2-3 minutes)

| Step | Screen                 | Elements                                                                            | Notes               |
| ---- | ---------------------- | ----------------------------------------------------------------------------------- | ------------------- |
| 3.1  | **What do you offer?** | Suggested packages: [Single session] [3-session bundle] [Monthly retainer] [Custom] | Pre-built templates |
| 3.2  | **Set your rates**     | Price per session / package, "Coaches like you charge $75-150/hr"                   | Benchmark guidance  |
| 3.3  | **Session length**     | [30 min] [45 min] [60 min] [90 min]                                                 | Per service type    |

#### Phase 4: Availability (1-2 minutes)

| Step | Screen               | Elements                                   | Notes                         |
| ---- | -------------------- | ------------------------------------------ | ----------------------------- |
| 4.1  | **Set your hours**   | Weekly grid, tap to toggle available slots | Visual calendar UI            |
| 4.2  | **Connect calendar** | Google / Outlook sync (optional)           | Prevents double-booking       |
| 4.3  | **Buffer time**      | "Add 15 min between sessions?" [Yes] [No]  | Prevents back-to-back burnout |

#### Phase 5: Get Paid Setup

| Step | Screen            | Elements                      | Notes                                  |
| ---- | ----------------- | ----------------------------- | -------------------------------------- |
| 5.1  | **Payout method** | Connect Stripe / bank account | Can skip, prompted before first payout |

#### Phase 6: Go Live

| Step | Screen              | Elements                                                    | Notes                     |
| ---- | ------------------- | ----------------------------------------------------------- | ------------------------- |
| 6.1  | **Review profile**  | Preview how clients see you                                 | Last check before launch  |
| 6.2  | **Publish**         | [Go Live] button                                            | Profile now discoverable  |
| 6.3  | **Welcome to Home** | Dashboard with setup checklist, "Share your profile" prompt | First action = share link |

#### Home Checklist (Post-Onboarding)

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

#### Flow Diagram

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

## Employer Journeys

**Primary goal:** Hire the right people efficiently

### User Types

| Type            | Role                              | Access                                |
| --------------- | --------------------------------- | ------------------------------------- |
| **Admin**       | Company owner/HR lead             | Full access, manages team             |
| **Recruiter**   | Hiring operations                 | Creates roles, manages candidates     |
| **Hiring Team** | Department managers, interviewers | Reviews candidates for specific roles |

### Core Journeys by User Type

| Journey                   | Admin              | Recruiter             | Hiring Team            |
| ------------------------- | ------------------ | --------------------- | ---------------------- |
| **New user onboarding**   | Full company setup | Invited, profile only | Invited, minimal setup |
| **Create a role**         | ✓                  | ✓                     | —                      |
| **Review candidates**     | ✓                  | ✓                     | ✓ (scoped)             |
| **Message candidates**    | ✓                  | ✓                     | ✓                      |
| **Move through pipeline** | ✓                  | ✓                     | ✓ (feedback only)      |
| **Make hiring decision**  | ✓                  | ✓                     | — (recommends)         |
| **Manage team**           | ✓                  | —                     | —                      |
| **View analytics**        | ✓                  | ✓                     | —                      |

### Core Journey Details

| Journey                   | Steps                                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| **Create a role**         | Home → Roles → Create new → Job details → Requirements → Publish        |
| **Review candidates**     | Notification → Candidates → View profile → Review resume → Rate/comment |
| **Message candidate**     | Candidate profile → Message → Send → Track in thread                    |
| **Move candidate**        | Candidate card → Move to stage → Add notes → Notify team                |
| **Schedule interview**    | Candidate profile → Schedule → Pick time → Send invite                  |
| **Collaborate with team** | Candidate → Add comment → @mention colleague → Team notified            |
| **Hire candidate**        | Candidate → Mark as hired → Send offer (external) → Close role          |
| **Invite team members**   | Team → Invite → Set role (Recruiter/Hiring Team) → Send invite          |

---

### Employer: Onboarding Flows

#### Flow A: Admin (Company Setup)

**Phase 1: Get In (30 seconds)**

| Step | Screen           | Elements                          |
| ---- | ---------------- | --------------------------------- |
| 1.1  | **Sign up**      | Email/password OR Google/LinkedIn |
| 1.2  | **Verify email** | Inline code or magic link         |

**Phase 2: Company Setup (2-3 minutes)**

| Step | Screen               | Elements                                         | Notes                          |
| ---- | -------------------- | ------------------------------------------------ | ------------------------------ |
| 2.1  | **Your name + role** | Name, job title                                  | Who's setting this up          |
| 2.2  | **Company name**     | Text input + logo upload                         | Auto-search existing companies |
| 2.3  | **Company size**     | [1-10] [11-50] [51-200] [201-500] [500+]         | Segments experience            |
| 2.4  | **Industry**         | Tappable chips or dropdown                       |                                |
| 2.5  | **Hiring goals**     | [Single role] [Multiple roles] [Building a team] | Sets expectations              |

**Phase 3: First Role (optional, encouraged)**

| Step | Screen                    | Elements                              | Notes             |
| ---- | ------------------------- | ------------------------------------- | ----------------- |
| 3.1  | **Post your first role?** | [Yes, let's go] [Skip for now]        | Get to value fast |
| 3.2  | **Quick role setup**      | Job title, department, location, type | Minimal fields    |
| 3.3  | **Role created**          | Preview + [Publish] or [Save draft]   |                   |

**Phase 4: Invite Team (optional)**

| Step | Screen                | Elements                                              | Notes    |
| ---- | --------------------- | ----------------------------------------------------- | -------- |
| 4.1  | **Invite colleagues** | Email input + role selector (Recruiter / Hiring Team) | Can skip |

**Phase 5: Welcome to Home**

```
"You're all set!"
[View your role] [Invite team] [Explore dashboard]
```

#### Home Checklist (Admin, Post-Onboarding)

```
Get your first hire
━━━━━━━━━━━━━━━━━━━━━ 30%

☑ Company profile
☐ Post a role — "Start attracting candidates"
☐ Invite team — "Collaborate on hiring"
☐ Review first candidate
☐ Make first hire
```

---

#### Flow B: Recruiter (Invited)

| Step | Screen              | Elements                                | Notes            |
| ---- | ------------------- | --------------------------------------- | ---------------- |
| 1    | **Email invite**    | "You've been invited to join [Company]" | Click to accept  |
| 2    | **Create account**  | Email pre-filled, set password          |                  |
| 3    | **Your name**       | First, Last, Job title                  |                  |
| 4    | **Welcome to Home** | See existing roles, candidates          | Immediate access |

---

#### Flow C: Hiring Team (Invited)

| Step | Screen                    | Elements                                  | Notes         |
| ---- | ------------------------- | ----------------------------------------- | ------------- |
| 1    | **Email invite**          | "You've been invited to help hire [Role]" | Role-specific |
| 2    | **Create account**        | Email pre-filled, set password            |               |
| 3    | **Your name**             | First, Last                               | Minimal       |
| 4    | **Welcome to Candidates** | Goes straight to candidate review         | Scoped view   |

---

#### Flow Diagrams

**Admin:**

```
[Sign up] → [Verify] → [Name] → [Company] → [Size] → [Industry]
                                                         ↓
                              [Post first role?] → [Invite team?] → [HOME]
```

**Recruiter:**

```
[Email invite] → [Accept] → [Set password] → [Name] → [HOME]
```

**Hiring Team:**

```
[Email invite] → [Accept] → [Set password] → [Name] → [CANDIDATES]
```

---

### Hiring Flow (End-to-End)

```
[Create role] → [Publish] → [Candidates apply]
                                   ↓
              [Review] → [Shortlist] → [Interview] → [Offer] → [Hire]
                  ↓           ↓             ↓
              [Reject]    [Archive]    [Reject]
```

At each stage:

- Recruiter moves candidates
- Hiring Team adds feedback/scores
- Admin has full control

---

# Part 3: Onboarding Best Practices

---

## Principles

1. **Get to value fast** — Show results before asking for everything
2. **Progressive profiling** — Collect info when contextually relevant
3. **Smart defaults** — Tappable options > blank forms
4. **Show the payoff** — "Profiles with photos get 3x more views"
5. **Save state** — Let users leave and return
6. **Celebrate completion** — Acknowledge progress

## Checklist Widget Pattern

All roles get a persistent Home checklist that:

- Shows progress percentage
- Has actionable items with benefit copy
- Disappears at 100% or can be dismissed
- Re-surfaces for key incomplete items

## Email Triggers

| Trigger                             | Email                                                  |
| ----------------------------------- | ------------------------------------------------------ |
| Signed up, didn't finish onboarding | "Pick up where you left off" (24hr)                    |
| Profile incomplete after 3 days     | "Complete your profile to [benefit]"                   |
| No activity after 7 days            | "Here's what you're missing" with personalized content |
