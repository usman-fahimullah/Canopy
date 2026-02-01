# Candid UX Flows & Jobs To Be Done

## MVP Scope Summary

| Feature                      | MVP             | Future |
| ---------------------------- | --------------- | ------ |
| **Coaching (Saathe Studio)** | ✅              | ✅     |
| **Sessions booking**         | ✅              | ✅     |
| **Mentor Directory**         | ✅              | ✅     |
| **Mentor chats**             | ✅ Via Calendly | In-app |
| **1:1 Notes**                | ✅              | ✅     |
| **Action Items**             | ✅              | ✅     |
| **Documents**                | ✅              | ✅     |
| **Messages**                 | ✅              | ✅     |
| **Target Jobs (manual)**     | ✅              | ✅     |
| **Coach sees Target Jobs**   | ✅              | ✅     |
| **Green Jobs Board link**    | ❌              | ✅     |
| **Peer Community**           | ❌              | ✅     |
| **Events**                   | ❌              | ✅     |
| **Success Stories**          | ❌              | ✅     |

---

## Seeker Jobs To Be Done

### JTBD 1: "Help me figure out what climate career is right for me"

**Phase:** Discovery
**When:** New to climate, unsure of direction

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Finding My Path                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SIGN UP                                                     │
│     └── Land on Candid → Sign up                                │
│                                                                 │
│  2. ONBOARDING                                                  │
│     ├── Tell us about yourself (background, skills)             │
│     ├── What draws you to climate? (motivation)                 │
│     ├── Which sectors interest you? (exploration)               │
│     └── When do you want to transition? (timeline)              │
│                                                                 │
│  3. MEET YOUR COACH                                             │
│     ├── Introduced to Saathe Studio                             │
│     ├── Understand what coaching offers                         │
│     └── Book first session (discovery call)                     │
│                                                                 │
│  4. FIRST SESSION                                               │
│     ├── Coach learns your story                                 │
│     ├── Explore options together                                │
│     └── Get homework: sector research, self-reflection          │
│                                                                 │
│  5. BETWEEN SESSIONS                                            │
│     ├── Complete homework (action items)                        │
│     ├── Browse mentors in interesting sectors                   │
│     ├── Request mentor chats for insights                       │
│     └── Message coach with questions                            │
│                                                                 │
│  6. OUTCOME                                                     │
│     └── Clear target: role type + sector + target companies     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens:**

- Onboarding flow (5 steps)
- Dashboard with "Getting Started" checklist
- Saathe Studio card → Book Session
- Mentor directory → Request Chat
- Action Items list

---

### JTBD 2: "Help me get my materials ready to apply"

**Phase:** Preparation
**When:** Know what I want, need to package myself

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Getting Job-Ready                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SESSION: Resume Review                                      │
│     ├── Coach reviews current resume                            │
│     ├── Identifies gaps and opportunities                       │
│     └── Assigns homework: rewrite with climate framing          │
│                                                                 │
│  2. BETWEEN SESSIONS                                            │
│     ├── Action Item: Rewrite resume                             │
│     ├── Upload draft to Documents                               │
│     ├── Message coach for async feedback                        │
│     └── Iterate on feedback                                     │
│                                                                 │
│  3. SESSION: LinkedIn + Cover Letters                           │
│     ├── Review resume progress                                  │
│     ├── Discuss LinkedIn optimization                           │
│     └── Create cover letter templates                           │
│                                                                 │
│  4. SELF-GUIDED                                                 │
│     ├── Complete assigned courses                               │
│     ├── Build target company list                               │
│     └── Start saving jobs to Target Jobs                        │
│                                                                 │
│  5. OUTCOME                                                     │
│     └── Resume, LinkedIn, cover letters ready to send           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens:**

- 1:1 Notes (session history + feedback)
- Action Items (homework from coach)
- Documents (resume versions, cover letters)
- Target Jobs (start building list)
- Messages (async feedback loop)

---

### JTBD 3: "Help me find and apply for jobs"

**Phase:** Application
**When:** Ready to apply, need to find opportunities

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Job Search & Tracking                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. FIND JOBS (External)                                        │
│     ├── Browse greenjobsboard.us, LinkedIn, company sites       │
│     └── Find interesting opportunities                          │
│                                                                 │
│  2. ADD TO TARGET JOBS                                          │
│     ├── Add job to Target Jobs list in Candid                   │
│     ├── Enter: title, company, location, URL (optional)         │
│     └── Status: "Saved"                                         │
│                                                                 │
│  3. COACH REVIEWS                                               │
│     ├── Coach sees Target Jobs in mentee view                   │
│     ├── Adds notes: "Great fit" / "Stretch" / "Let's discuss"   │
│     └── Discusses strategy in session                           │
│                                                                 │
│  4. APPLY                                                       │
│     ├── Use materials from Documents                            │
│     ├── Submit application                                      │
│     └── Update status: "Applied"                                │
│                                                                 │
│  5. TRACK PROGRESS                                              │
│     ├── Update status: Applied → Interviewing → Offer/Rejected  │
│     └── Coach tracks progress, celebrates wins                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens:**

- Target Jobs (seeker's list with status)
- Add Job modal (title, company, URL)
- Coach view: Mentee → Target Jobs tab
- Coach notes on individual jobs

---

### JTBD 4: "Help me prepare for interviews and land offers"

**Phase:** Interview & Landing
**When:** Getting interviews, need to close

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Interview & Offer                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. INTERVIEW SCHEDULED                                         │
│     ├── Update job status: "Interviewing"                       │
│     ├── Message coach about upcoming interview                  │
│     └── Book prep session                                       │
│                                                                 │
│  2. SESSION: Interview Prep                                     │
│     ├── Role-specific preparation                               │
│     ├── Practice common questions                               │
│     ├── Discuss company research                                │
│     └── Mock interview (if time)                                │
│                                                                 │
│  3. POST-INTERVIEW                                              │
│     ├── Debrief with coach (async message)                      │
│     ├── What went well / what to improve                        │
│     └── Prep for next round if applicable                       │
│                                                                 │
│  4. OFFER RECEIVED                                              │
│     ├── Update status: "Offer"                                  │
│     ├── Book session for negotiation strategy                   │
│     └── Coach helps evaluate and negotiate                      │
│                                                                 │
│  5. OUTCOME                                                     │
│     └── Accept offer → Celebrate! 🎉                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens:**

- Target Jobs (status: Interviewing)
- Messages (quick debrief)
- Sessions (book prep session)
- 1:1 Notes (interview prep notes)

---

### JTBD 5: "Help me learn from people already in climate"

**Phase:** Any (ongoing)
**When:** Want industry insights, networking

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Mentor Connection                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. BROWSE MENTORS                                              │
│     ├── Go to Mentors page                                      │
│     ├── Filter by sector (Solar, EVs, etc.)                     │
│     ├── Filter by role (PM, Engineer, etc.)                     │
│     └── Read mentor bios                                        │
│                                                                 │
│  2. REQUEST CHAT                                                │
│     ├── Find interesting mentor                                 │
│     ├── Click "Request Chat"                                    │
│     └── → Opens mentor's Calendly (external)                    │
│                                                                 │
│  3. BOOK ON CALENDLY                                            │
│     ├── Select available time                                   │
│     ├── Add context: "What do you want to discuss?"             │
│     └── Confirm booking                                         │
│                                                                 │
│  4. HAVE CHAT                                                   │
│     ├── Join Zoom call (from Calendly)                          │
│     ├── 20-30 min informal conversation                         │
│     └── Ask questions, get insights                             │
│                                                                 │
│  5. FOLLOW UP                                                   │
│     ├── Send thank you (via LinkedIn/email)                     │
│     └── Keep in touch for future networking                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens:**

- Mentor Directory (browse, filter)
- Mentor Profile (bio, expertise, CTA)
- External: Calendly booking
- External: Zoom call

**Note:** For MVP, mentor interactions happen externally. No in-app scheduling or tracking.

---

## Mentor Jobs To Be Done

### JTBD: "Help me give back to the climate community"

**When:** Climate professional wants to help others transition

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Becoming a Mentor                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SIGN UP AS MENTOR                                           │
│     ├── "Become a Mentor" CTA                                   │
│     └── Create account (or switch role)                         │
│                                                                 │
│  2. ONBOARDING                                                  │
│     ├── Current role & company                                  │
│     ├── Climate sectors you work in                             │
│     ├── What can you help with?                                 │
│     ├── How many hours/month?                                   │
│     └── Connect Calendly link                                   │
│                                                                 │
│  3. CREATE PROFILE                                              │
│     ├── Photo                                                   │
│     ├── Bio (why you mentor)                                    │
│     └── Areas of expertise                                      │
│                                                                 │
│  4. GO LIVE                                                     │
│     ├── Profile visible in directory                            │
│     └── Seekers can request chats                               │
│                                                                 │
│  5. RECEIVE REQUESTS                                            │
│     ├── Seekers book via Calendly                               │
│     ├── Mentor gets Calendly notification                       │
│     └── Chat happens on Zoom                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens:**

- Mentor sign-up flow
- Mentor profile editor
- Mentor dashboard (optional for MVP — could just be profile)

---

## Coach (Saathe) Jobs To Be Done

### JTBD: "Help me support my mentees effectively"

**When:** Managing ongoing coaching relationships

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW: Coach Managing Mentees                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. VIEW MENTEE LIST                                            │
│     ├── See all active mentees                                  │
│     ├── Quick status: phase, last session, next session         │
│     └── Flag mentees needing attention                          │
│                                                                 │
│  2. PREP FOR SESSION                                            │
│     ├── View mentee profile & goals                             │
│     ├── Review 1:1 Notes from past sessions                     │
│     ├── Check Action Items status                               │
│     ├── Review Target Jobs list                                 │
│     └── Add coach notes on jobs                                 │
│                                                                 │
│  3. DURING SESSION                                              │
│     ├── Reference past notes                                    │
│     ├── Discuss progress on action items                        │
│     └── Take notes (saved to 1:1 Notes)                         │
│                                                                 │
│  4. POST SESSION                                                │
│     ├── Add session summary to 1:1 Notes                        │
│     ├── Assign new Action Items                                 │
│     ├── Recommend courses if relevant                           │
│     └── Add notes to Target Jobs                                │
│                                                                 │
│  5. BETWEEN SESSIONS                                            │
│     ├── Respond to async messages                               │
│     ├── Review uploaded documents                               │
│     └── Provide async feedback                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Screens (Coach View):**

- Mentee list / dashboard
- Mentee detail view
- 1:1 Notes (add/edit)
- Action Items (assign/review)
- Target Jobs (add coach notes)
- Messages (async support)

---

## Flow Diagram: Complete Seeker Journey

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  AWARENESS          ONBOARDING         DISCOVERY          PREPARATION       │
│                                                                              │
│  ┌─────────┐       ┌─────────┐        ┌─────────┐        ┌─────────┐        │
│  │ Hear    │       │ Sign up │        │ First   │        │ Resume  │        │
│  │ about   │──────►│ & tell  │───────►│ session │───────►│ LinkedIn│        │
│  │ Candid  │       │ us about│        │ with    │        │ Cover   │        │
│  │         │       │ yourself│        │ coach   │        │ letters │        │
│  └─────────┘       └─────────┘        └─────────┘        └─────────┘        │
│                          │                 │                  │              │
│                          ▼                 ▼                  ▼              │
│                    ┌──────────┐      ┌──────────┐       ┌──────────┐        │
│                    │ Getting  │      │ Homework │       │ Action   │        │
│                    │ Started  │      │ + Mentor │       │ Items +  │        │
│                    │ Checklist│      │ chats    │       │ Documents│        │
│                    └──────────┘      └──────────┘       └──────────┘        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  APPLICATION              INTERVIEW              OFFER                       │
│                                                                              │
│  ┌─────────┐             ┌─────────┐           ┌─────────┐                  │
│  │ Build   │             │ Prep    │           │ Evaluate│                  │
│  │ Target  │────────────►│ sessions│──────────►│ Negotiate│                 │
│  │ Jobs    │             │ Mock    │           │ Accept! │                  │
│  │ list    │             │ interviews│         │ 🎉      │                  │
│  └─────────┘             └─────────┘           └─────────┘                  │
│       │                       │                     │                        │
│       ▼                       ▼                     ▼                        │
│  ┌──────────┐           ┌──────────┐          ┌──────────┐                  │
│  │ Apply &  │           │ Update   │          │ Climate  │                  │
│  │ track    │           │ status   │          │ career   │                  │
│  │ status   │           │ debrief  │          │ launched!│                  │
│  └──────────┘           └──────────┘          └──────────┘                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Interaction Patterns

### 1. Coach is Always Present

The coach relationship is persistent, not transactional.

```
Dashboard
├── Your Coach card (always visible)
│   ├── Coach photo + name
│   ├── Latest message/feedback
│   ├── Next session time
│   └── [Message] [Book Session]
└── Rest of dashboard
```

### 2. Action Items Drive Progress

Homework creates momentum between sessions.

```
Action Items
├── From last session (Oct 15)
│   ├── ✅ Complete sector research
│   ├── ☐ Rewrite resume (due Oct 20)
│   └── ☐ Identify 5 companies (due Oct 20)
└── [View all action items]
```

### 3. Target Jobs = Shared Workspace

Both seeker and coach see and edit the job list.

```
Target Jobs
├── Seeker can:
│   ├── Add jobs
│   ├── Update status
│   └── Add notes
└── Coach can:
    ├── View list
    ├── Add notes ("Great fit!")
    └── Discuss in session
```

### 4. Messages = Async Coaching

Not just chat — contextual support between sessions.

```
Messages (with Coach)
├── Share document for review
├── Quick question
├── Job posting to discuss
├── Interview debrief
└── Coach responds within 24h
```

### 5. Mentors = Informal Insights

Separate from coaching — industry connections.

```
Mentors
├── Directory (browse, filter)
├── Request Chat → Calendly (external)
├── Chat happens on Zoom (external)
└── No tracking in Candid (MVP)
```

---

## Screen Inventory (MVP)

### Seeker Screens

| Screen           | Primary JTBD       | Key Components                            |
| ---------------- | ------------------ | ----------------------------------------- |
| **Dashboard**    | Overview           | Coach card, Action Items, Getting Started |
| **Onboarding**   | Sign up            | Multi-step form                           |
| **Sessions**     | Book/view sessions | Calendar, upcoming, past                  |
| **Mentors**      | Find mentors       | Directory, filters, profiles              |
| **Messages**     | Async coaching     | Thread with coach                         |
| **1:1 Notes**    | Session history    | Notes by session, coach feedback          |
| **Action Items** | Homework           | Task list with status                     |
| **Documents**    | Career toolkit     | File list by category                     |
| **Target Jobs**  | Job tracking       | Job list, status, coach notes             |
| **Profile**      | Settings           | Edit profile, goals                       |

### Mentor Screens

| Screen                | Primary JTBD   | Key Components                |
| --------------------- | -------------- | ----------------------------- |
| **Mentor Onboarding** | Sign up        | Multi-step form               |
| **Mentor Profile**    | Manage profile | Edit bio, expertise, Calendly |

### Coach Screens

| Screen                  | Primary JTBD     | Key Components                     |
| ----------------------- | ---------------- | ---------------------------------- |
| **Mentee List**         | Manage mentees   | List with status, quick actions    |
| **Mentee Detail**       | Prep for session | Profile, notes, action items, jobs |
| **Add Notes**           | Post-session     | Session notes editor               |
| **Assign Action Items** | Create homework  | Task creator                       |

---

## Navigation Structure

```
SEEKER NAV
├── Home (Dashboard)
├── Sessions
├── Mentors
├── Messages
├── ────────
├── Mentee Tools
│   ├── 1:1 Notes
│   ├── Action Items
│   ├── Documents
│   └── Target Jobs
├── ────────
├── Settings
└── Log out

MENTOR NAV
├── Dashboard
├── Profile
├── Settings
└── Log out

COACH NAV
├── Mentees
├── Messages
├── Settings
└── Log out
```

---

## State Transitions

### Seeker Journey State

```
NEW → ONBOARDING → DISCOVERY → PREPARATION → APPLICATION → INTERVIEWING → OFFER → PLACED

Tracked via:
├── Onboarding completion
├── Sessions completed
├── Action items completed
├── Target jobs status
└── Manual coach update (for now)
```

### Job Status State

```
SAVED → APPLIED → INTERVIEWING → OFFER / REJECTED

User updates manually in Target Jobs.
Coach sees status in mentee view.
```

### Action Item State

```
PENDING → COMPLETED

Assigned by coach after session.
Marked complete by seeker.
Coach can review.
```
