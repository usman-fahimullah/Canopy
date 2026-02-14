# Candidate Cycle Implementation Plan

**Product:** Canopy ATS
**Date:** February 13, 2026
**Status:** Planning

---

## 1. Executive Summary

Canopy's frontend component library and database schema are production-grade. The Prisma schema covers the full hiring lifecycle — applications, pipeline stages, scorecards, interviews, offers, email automation, and approval chains. The UI component library exports 200+ components including ATS-specific primitives (KanbanBoard, CandidateCard, Scorecard, MatchScore, InterviewSchedulingModal, etc.).

The gap is in the **orchestration layer** — the workflow logic that coordinates multi-step operations when candidates move through the pipeline. Most API routes, validators, and hooks already exist; they need to be audited, completed, and wired into a cohesive candidate cycle with proper side effects (emails, record creation, notifications).

This plan defines the full candidate lifecycle from application to hire, maps every stage to existing infrastructure, identifies what needs to be built, and sequences the work into three phases targeting a ~3-week delivery.

---

## 2. Current State Assessment

### What's Built

| Layer            | Coverage | Notes                                                                                                                                                                                        |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Database schema  | ~100%    | Application, Job, Score, Note, Interview, OfferRecord, EmailLog, ScheduledEmail, ApprovalRequest — all production-ready                                                                      |
| UI components    | ~90%     | 200+ components including all ATS primitives. Kanban, scorecards, match scores, interview scheduling modal, email composer, bulk actions toolbar                                             |
| Page structure   | ~80%     | Routes exist for candidates, roles, pipeline, review, calendar, messages, settings, analytics                                                                                                |
| Validators (Zod) | ~60%     | application.ts, interviews.ts, offer.ts, approvals.ts, email-templates.ts exist. Need audit for completeness                                                                                 |
| Hooks            | ~70%     | 16 hooks including use-application-updates, use-pipeline-toast. `queries/` directory has use-candidates-query, use-roles-query, use-analytics-query, use-team-query, use-notifications-query |
| API routes       | ~70%     | 60+ canopy routes exist at `/api/canopy/`. Stage transitions, bulk actions, notes, activity, emails — most CRUD is covered                                                                   |
| Service layer    | ~40%     | `src/lib/services/` exists with candidates.ts (full filtering/pagination), dashboard.ts, roles.ts, templates.ts                                                                              |
| Email automation | ~20%     | EmailLog + ScheduledEmail models exist. Template system partially built. Sending pipeline not wired                                                                                          |

### What Already Works

Verified by codebase audit:

- **Stage transitions** — `PATCH /api/canopy/roles/[id]/applications/[appId]` already handles stage changes with Zod validation, rejection reasons, and `createStageChangedNotification()`
- **Permission checks** — `canManagePipeline()` helper enforces role-based access
- **Candidate service** — `fetchCandidatesList()` in `src/lib/services/candidates.ts` has full filtering and pagination
- **Bulk operations** — `/api/canopy/applications/bulk/route.ts` exists
- **Notes & activity** — `/api/canopy/candidates/[id]/notes` and `/candidates/[id]/activity` routes exist
- **Email sending** — `/api/canopy/emails/send/route.ts` exists

### What's Missing

1. **Workflow orchestration** — Stage transitions work, but lack coordinated side effects (e.g., "move to offer stage" should also create OfferRecord + trigger email + log activity in one transaction)
2. **Email automation engine** — Manual sending works, but automated triggers on stage transitions are not wired
3. **Offer lifecycle** — OfferRecord model exists, but the full draft → approval → send → sign workflow isn't wired end-to-end
4. **Interview calendar sync** — InterviewSchedulingModal UI exists, but calendar provider integration (Nango) isn't connected
5. **Real-time updates** — Pipeline changes don't reflect across connected clients
6. **Scorecard aggregation** — Individual scores can be submitted, but team-level summary/aggregation logic is missing
7. **Components to create** — `CandidateComparisonSheet` and `ApprovalBanner` need building

---

## 3. The Candidate Cycle

### 3.1 Stage Flow

"Hired," "rejected," and "withdrawn" are **terminal outcomes**, not pipeline stages. The Kanban only shows active stages where work is happening. Terminal outcomes are triggered by actions (buttons, menus) from any stage and recorded as timestamp flags on the Application.

```
                    ┌──────────────┐
                    │   SOURCED    │  Manually added to pipeline
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
    Apply via       │   APPLIED    │  Application received
    career page ───►│              │  (auto: confirmation email)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  SCREENING   │  Resume review + knockout questions
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  INTERVIEW   │  One or more interview rounds
                    │              │  (auto: calendar invite)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  EVALUATION  │  Scorecards + blind team review
                    │              │  (auto: scorecard request)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    OFFER     │  Draft → approve → send → sign
                    └──────────────┘
                           │
                    ── offer signed ──► hiredAt timestamp set
                                        (candidate exits pipeline)

    Terminal outcomes (from ANY stage, via action button):
    ● Hired      → hiredAt timestamp, welcome email, close other apps
    ● Rejected   → rejectedAt + reason, queue rejection email
    ● Withdrawn  → withdrawnAt + reason, log only
```

### 3.2 Default Pipeline Stages

Jobs use a customizable pipeline stored as JSON in `Job.stages`. The Kanban renders only these active stages — terminal outcomes live outside the board.

**Full default (larger orgs):**

| Order | Stage ID     | Label      | Color Token           | Auto-Actions                          |
| ----- | ------------ | ---------- | --------------------- | ------------------------------------- |
| 0     | `sourced`    | Sourced    | `--stage-new-*`       | —                                     |
| 1     | `applied`    | Applied    | `--stage-applied-*`   | Confirmation email                    |
| 2     | `screening`  | Screening  | `--stage-screening-*` | Knockout question evaluation          |
| 3     | `interview`  | Interview  | `--stage-interview-*` | Calendar invite, scorecard assignment |
| 4     | `evaluation` | Evaluation | `--stage-interview-*` | Scorecard reminder after 48h          |
| 5     | `offer`      | Offer      | `--stage-offer-*`     | Approval request (if enabled)         |

**Simplified default (small orgs, ≤5 team members):**

| Order | Stage ID    | Label     | Color Token           | Auto-Actions       |
| ----- | ----------- | --------- | --------------------- | ------------------ |
| 0     | `applied`   | Applied   | `--stage-applied-*`   | Confirmation email |
| 1     | `interview` | Interview | `--stage-interview-*` | Calendar invite    |
| 2     | `offer`     | Offer     | `--stage-offer-*`     | —                  |

The simplified default skips sourced, screening, and evaluation — stages that assume a dedicated recruiter or review panel. Small orgs can always add them later.

Employers can rename stages, reorder them, and add custom stages between any two existing stages.

### 3.3 Terminal Outcomes

Terminal outcomes are not pipeline stages. They are actions that set timestamp flags and remove the candidate from the active Kanban.

| Outcome       | Trigger                                 | Fields Set                                    | Side Effects                                                       |
| ------------- | --------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| **Hired**     | Offer signed, or manual "Mark as hired" | `hiredAt`, `hiredBy`                          | Welcome email, optionally reject remaining candidates for same job |
| **Rejected**  | "Reject" action from any stage          | `rejectedAt`, `rejectedBy`, `rejectionReason` | Queue rejection email (configurable delay)                         |
| **Withdrawn** | "Mark as withdrawn" action              | `withdrawnAt`, `withdrawalReason`             | Activity log entry only                                            |

All three are reversible — a recruiter can "reopen" a rejected or withdrawn application, which clears the timestamp and places them back at their last active stage.

### 3.4 Stage Transition Rules

Each transition can trigger side effects. This is the **workflow orchestration** layer.

| From         | To           | Side Effects                                            |
| ------------ | ------------ | ------------------------------------------------------- |
| Any          | `applied`    | Send confirmation email                                 |
| `applied`    | `screening`  | Run knockout question evaluation                        |
| `screening`  | `interview`  | Prompt to schedule interview                            |
| Any          | `interview`  | Create Interview record if none exists                  |
| `interview`  | `evaluation` | Send scorecard request to assigned reviewers (if any)   |
| `evaluation` | `offer`      | Create OfferRecord (DRAFT), trigger approval if enabled |

### 3.5 Scorecard Model

Scorecards use an **org-wide defaults + per-job overrides** pattern.

**Organization level** — `Organization.defaultScorecardCriteria` (JSON):

```json
[
  {
    "id": "culture-fit",
    "name": "Cultural & Team Fit",
    "description": "Alignment with company values and team dynamics",
    "weight": 1
  },
  {
    "id": "communication",
    "name": "Collaboration & Communication",
    "description": "Clarity of thought, active listening, team orientation",
    "weight": 1
  },
  {
    "id": "problem-solving",
    "name": "Strategic Thinking & Problem-Solving",
    "description": "Analytical approach, creative solutions",
    "weight": 1
  }
]
```

**Job level** — `Job.scorecardCriteria` (JSON) for role-specific additions:

```json
[
  {
    "id": "product-exp",
    "name": "Strong Product Experience",
    "description": "Relevant design/product background",
    "weight": 1
  },
  {
    "id": "green-skills",
    "name": "Climate/Sustainability Knowledge",
    "description": "Understanding of sector-specific challenges",
    "weight": 1
  }
]
```

**Job level** — `Job.excludedDefaultCriteria` (JSON array of IDs to skip):

```json
["problem-solving"]
```

At review time, the scorecard merges org defaults (minus exclusions) + job-specific criteria. Each criterion gets a 1–5 star rating and an optional written comment. The `Score.responses` JSON stores `[{ criterionId, rating, comment }]`.

The `weight` field defaults to 1 (equal weighting) but allows employers to emphasize certain criteria in the aggregate calculation. `Score.overallRating` remains the reviewer's holistic 1–5 score, and `Score.recommendation` is their STRONG_YES → STRONG_NO decision.

### 3.6 Review Process

Reviews are **blind by default** — reviewers cannot see each other's scores until all assigned reviewers have submitted.

**Roles in the review flow:**

| Role               |  Submits Scorecard  | Sees Scores During Blind | Sees Scores After Blind | Makes Advance/Reject Decision | Assigns Reviewers |
| ------------------ | :-----------------: | :----------------------: | :---------------------: | :---------------------------: | :---------------: |
| **Admin**          |      Optional       |           Yes            |           Yes           |              Yes              |        Yes        |
| **Recruiter**      |  No (orchestrator)  |           Yes            |           Yes           |              Yes              |        Yes        |
| **Hiring Manager** |         Yes         |            No            |           Yes           |        Recommend only         |   Own jobs only   |
| **Member**         | Yes (when assigned) |            No            |           Yes           |              No               |        No         |
| **Viewer**         |         No          |            No            |           Yes           |              No               |        No         |

**Blind review flow:**

1. Candidate enters evaluation stage (or any stage with reviewer assignments)
2. Assigned reviewers receive notification with link to scorecard
3. Each reviewer fills out their scorecard independently — they see only their own responses
4. Recruiters and admins see all scores in real time (they're orchestrating, not evaluating) and see a progress tracker ("2 of 3 submitted")
5. Once all assigned reviewers have submitted, the blind lifts — everyone can see all scores
6. Recruiter views the aggregate (average per criterion, recommendation breakdown) and makes the advance/reject call

**Override rules:**

- Recruiter can force-unlock scores early if a reviewer is unresponsive
- Reviewers can be added or removed mid-cycle
- If only one reviewer is assigned, the blind period resolves immediately on submission

**Query-time logic:** When fetching scores for an application, check if all assigned reviewers have submitted. If yes, return all scores. If no, return only the requesting user's own score — unless the user is a Recruiter or Admin, in which case return all scores regardless.

### 3.7 Small Organization Defaults

The system gracefully degrades for small teams. The principle: **nothing blocks on a step that has zero participants.**

| Feature             | Large Org (6+ members)                     | Small Org (1–5 members)                                                           |
| ------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| Pipeline stages     | Full 6-stage default                       | Simplified 3-stage default (Applied → Interview → Offer)                          |
| Reviewer assignment | Formal assignment, blind review            | Optional — anyone on team can submit a scorecard without being assigned           |
| Blind review period | Active until all assigned reviewers submit | No blind period if no reviewers assigned; scorecard is just the person's notes    |
| Offer approval      | Configurable toggle (can require approval) | Off by default — offer goes straight from draft to send                           |
| Scorecard criteria  | Org defaults + job overrides               | Same system, but org defaults may be empty initially — job-level criteria suffice |
| Email automation    | Full stage-triggered emails                | Same system, but simplified defaults (confirmation + rejection only)              |

**Implementation rules:**

- If no reviewers are assigned to a job, the evaluation stage is a manual checkpoint — recruiter advances when ready
- If approvals are disabled (`Organization.requireOfferApproval = false`), moving to offer creates the draft directly without an ApprovalRequest
- Scorecard submission is always available to any team member, regardless of assignment — assignment only controls who gets notified and who the system waits on for the blind period
- Pipeline stage count is set during job creation based on a template; can be modified at any time

### 3.8 Interview Scheduling Workflow

Interview scheduling is the highest-friction part of the candidate cycle. The recruiter coordinates across candidate availability, interviewer calendars, time zones, meeting rooms, and video links — and a single reschedule repeats the entire process. This section defines the step-by-step recruiter experience.

#### Entry Points

A recruiter triggers interview scheduling from three places:

| Entry Point                        | Context                                     | Behavior                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kanban drag to Interview stage** | Pipeline view, moving a card                | Stage transition completes → toast nudge: **"Moved to Interview"** with [Schedule Interview] action button. Clicking opens InterviewSchedulingModal pre-filled with candidate + job. Toast auto-dismisses after 5s. No modal auto-open — recruiter may be triaging multiple candidates or may have already scheduled externally. |
| **"Schedule Interview" button**    | Candidate detail page, application timeline | Opens InterviewSchedulingModal pre-filled with candidate + job from the application context                                                                                                                                                                                                                                      |
| **Calendar empty slot click**      | Recruiter calendar view                     | Opens InterviewSchedulingModal with the clicked time slot pre-selected, recruiter fills in candidate + job                                                                                                                                                                                                                       |

All three entry points open the same `InterviewSchedulingModal` — the only difference is which fields arrive pre-populated.

#### The Scheduling Flow (Step by Step)

**Step 1: Interview Details**

The modal opens with a left panel (form) and right panel (calendar). The recruiter fills in:

- **Title** — Defaults to `"{Job Title} Interview"`. Editable for specificity (e.g., "Technical Screen — Senior Designer").
- **Duration** — Dropdown: 15, 30, 45, 60, 90, 120 minutes. Defaults to 30 min for phone screens, 60 min for others.
- **Interview type** — Dropdown mapped to video provider:
  - Google Meet → auto-generates meeting link
  - Zoom → auto-generates meeting link (if Zoom connected)
  - Microsoft Teams → auto-generates meeting link
  - In-person → shows location field instead

**Step 2: Add Interviewers**

- The **candidate** is always the first attendee (non-removable). Their email and timezone display automatically.
- The recruiter adds team members via `AddAttendeePopover` — searchable list of org members.
- Each attendee shows as an `AttendeeChip` with their name, role label, and timezone abbreviation.
- Minimum: 2 attendees (candidate + at least one interviewer). The recruiter themselves may or may not be an attendee.

**Step 3: Find Available Times**

The right panel has two tabs:

- **"Find a Time" tab** — `AvailabilityCalendar` showing a merged availability view for all attendees. Green blocks = everyone available. Conflicts shown per-person. The recruiter visually scans for open slots that work for the full group.
- **"Your Calendar" tab** — `YourCalendarView` showing only the recruiter's own events. Useful when the recruiter is also an interviewer.
- **Calendar overlay toggle** — Show/hide the recruiter's calendar events overlaid on the availability view for quick conflict checking.

**Step 4: Propose Time Slots**

- The recruiter clicks available slots on the calendar to propose times. Each selected slot appears as a `TimeSlotChip` showing date, time, and duration preview.
- **Maximum 5 proposed slots.** This gives the candidate options without overwhelming them.
- **AI suggestion shortcut** — "Suggest available times" button (`SuggestTimesButton`) analyzes all attendee calendars and proposes the next best available slots. Useful when coordinating across 3+ attendees with packed schedules.

**Step 5: Add Instructions & Notes**

- **Instructions** — Visible to the candidate in their confirmation email. Used for prep guidance, directions to the office, what to bring, who they'll meet.
- **Internal notes** — Visible only to the hiring team. Used for interview focus areas ("Dig into their portfolio case study"), logistics ("Conference room B, 3rd floor"), or context ("They asked to reschedule once already").

**Step 6: Preview & Send**

- `CandidatePreviewCard` shows a summary of everything before sending: candidate name, proposed times, attendees, instructions.
- The recruiter reviews and clicks **"Send Invite"**.

#### What Happens on Send

When the recruiter confirms, the system executes these operations:

```
1. Create Interview record in database
   └── status: SCHEDULED, applicationId, scheduledAt (first proposed time)

2. Create calendar event via Nango
   ├── Google Calendar or Outlook (based on interviewer's connected calendar)
   ├── Attendees: all interviewers + candidate email
   ├── Meeting link: auto-generated from video provider
   └── Event description: interview instructions

3. Send confirmation email to candidate
   ├── Subject: "Interview scheduled: {Job Title} at {Company}"
   ├── Body: proposed time(s), video link or location, instructions
   └── Calendar attachment (.ics) for candidates without calendar sync

4. Notify interviewers
   ├── In-app notification with interview details
   └── Calendar invite (via calendar event creation above)

5. Log activity
   └── "Interview scheduled" entry on candidate timeline with type, date, interviewers
```

Calendar sync is **best-effort** — if a calendar provider is down or a token is expired, the interview is still created in the database and the email is still sent. A warning appears in the activity log: "Calendar event could not be created — sync manually."

#### Multi-Proposal vs. Single-Confirmation

Two scheduling modes, selected implicitly by how many time slots the recruiter proposes:

| Slots Proposed | Mode                | Behavior                                                                                                                                                               |
| -------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 slot**     | Direct confirmation | Interview scheduled immediately at that time. Candidate receives confirmation email, calendar event created.                                                           |
| **2–5 slots**  | Candidate picks     | Candidate receives email with all proposed times. They click their preferred slot → interview is confirmed at that time, calendar event created, other slots released. |

For the candidate-picks mode, the system generates a unique booking link where the candidate selects their preferred time. Once selected, the Interview record is updated from the initial proposed time to the chosen time, and the calendar event is created at the confirmed time.

**Expiry:** Proposed slots expire 48 hours before the earliest slot. If the candidate hasn't picked, the recruiter gets a notification to follow up or reschedule.

#### Rescheduling

Rescheduling is triggered from the interview detail (in candidate timeline) or from the calendar view.

| Action                                     | System Behavior                                                                                                                                                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recruiter clicks "Reschedule"              | InterviewSchedulingModal re-opens with existing interview data pre-filled. Attendees, type, notes carry over. Time slots are cleared for re-selection.                                                                     |
| Recruiter selects new time(s) and confirms | Original calendar event is updated (or deleted and recreated). Candidate + interviewers receive "Interview rescheduled" email with new details. Activity log entry: "Interview rescheduled from {old time} to {new time}." |

The original Interview record is updated in-place (same ID), not deleted-and-recreated. This preserves the activity history chain.

#### Cancellation

| Action                              | System Behavior                                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recruiter clicks "Cancel Interview" | Confirmation prompt: "Cancel this interview with {Candidate Name}? This will notify all attendees."                                                                               |
| Recruiter confirms                  | Interview status → CANCELLED, `cancelledAt` timestamp set. Calendar event deleted via Nango. Cancellation email to candidate + interviewers. Activity log: "Interview cancelled." |
| Candidate no-shows                  | Recruiter marks status as NO_SHOW from interview detail. Activity logged. No email sent (recruiter follows up manually).                                                          |

#### Multiple Interview Rounds

A single application can have multiple Interview records — representing phone screen, technical interview, final round, etc. The candidate stays in the "Interview" pipeline stage for the duration of all rounds.

- Each round is an independent Interview record with its own type, attendees, and time.
- The candidate timeline shows all rounds chronologically.
- The recruiter advances to "Evaluation" when they've completed all intended rounds.
- There's no system-enforced round ordering — the recruiter decides when enough interviews have been conducted.

#### Small Organization Differences

For teams of 1–5 members, the scheduling flow simplifies naturally:

| Aspect                | Large Org                                        | Small Org                                            |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Attendees             | Multiple interviewers across departments         | Often just the recruiter + candidate (2 people)      |
| Availability checking | Critical — cross-referencing 3+ calendars        | Less critical — recruiter knows their own schedule   |
| AI time suggestions   | High value (complex multi-calendar coordination) | Lower value but still available                      |
| Interview type        | Often video with meeting link generation         | More likely in-person or simple phone call           |
| Rounds                | 2–4 rounds typical                               | 1–2 rounds typical                                   |
| Find a Time tab       | Primary workflow — merge view across attendees   | Less used — recruiter just checks their own calendar |

The same modal and API serve both cases. Small orgs don't see a degraded experience — they just naturally use fewer features (fewer attendees, fewer rounds, less availability complexity).

#### Calendar Connection Prerequisites

Interview scheduling works at three tiers depending on what the recruiter has connected:

| Tier           | Calendar Connected?               | Scheduling Experience                                                                                                           |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Full sync**  | Yes (Google or Outlook via Nango) | Availability overlay, auto-created calendar events, auto-generated meeting links                                                |
| **Email only** | No calendar, but email works      | Interview created in Canopy, .ics file attached to confirmation email, no calendar overlay (recruiter checks calendar manually) |
| **Manual**     | No calendar, no email configured  | Interview created in Canopy only. Recruiter handles communication and calendar manually. Activity log still tracks it.          |

The system should **nudge but never block.** If no calendar is connected, show a subtle prompt ("Connect your calendar for automatic scheduling") but let the recruiter proceed with manual scheduling. A recruiter who tracks interviews in Canopy without calendar sync is still better off than a recruiter using nothing.

---

## 4. Architecture

### 4.1 Service Layer Pattern

A service layer already exists at `src/lib/services/` with `candidates.ts`, `dashboard.ts`, `roles.ts`, and `templates.ts`. The plan is to **extend** this layer with workflow orchestration services that coordinate multi-step operations.

```
API Route (validation + auth)
    │
    ▼
Service Layer (business logic + side effects)
    │
    ├──► Prisma (data operations)
    ├──► Email Service (send/queue)
    ├──► Activity Logger (audit trail)
    └──► Notification Service (in-app, already exists)
```

**Existing services to extend:**

```
src/lib/services/
├── candidates.ts             # ✅ EXISTS — fetchCandidatesList with filtering/pagination
├── dashboard.ts              # ✅ EXISTS
├── roles.ts                  # ✅ EXISTS
├── templates.ts              # ✅ EXISTS
```

**New services to add:**

```
src/lib/services/
├── pipeline-service.ts       # Stage transitions + coordinated side effects
├── scoring-service.ts        # Scorecard submission + team aggregation
├── interview-service.ts      # Interview scheduling + calendar sync
├── offer-service.ts          # Offer lifecycle (draft → approved → signed)
├── email-automation.ts       # Automated email triggers on stage transitions
└── activity-service.ts       # Centralized activity logging
```

### 4.2 API Route Structure

All Canopy API routes live under `/api/canopy/`:

```
src/app/api/canopy/
├── candidates/
│   ├── route.ts              # GET (list/search), POST (create)
│   └── [id]/
│       ├── route.ts          # GET, PATCH, DELETE
│       ├── notes/route.ts    # GET, POST
│       └── activity/route.ts # GET
├── applications/
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts          # GET, PATCH
│       ├── stage/route.ts    # PATCH (move stage)
│       ├── scores/route.ts   # GET, POST
│       └── emails/route.ts   # GET (history)
├── jobs/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       ├── route.ts          # GET, PATCH, DELETE
│       ├── pipeline/route.ts # GET (kanban data)
│       ├── stages/route.ts   # PATCH (customize stages)
│       └── applications/route.ts  # GET (filtered by stage)
├── interviews/
│   ├── route.ts              # GET (list), POST (schedule)
│   └── [id]/route.ts         # GET, PATCH (reschedule/cancel)
├── offers/
│   ├── route.ts              # POST (create draft)
│   └── [id]/
│       ├── route.ts          # GET, PATCH
│       └── send/route.ts     # POST (send to candidate)
├── emails/
│   ├── send/route.ts         # POST (send email)
│   ├── bulk/route.ts         # POST (bulk email)
│   └── scheduled/route.ts    # GET, DELETE (manage queue)
└── approvals/
    └── [id]/route.ts         # PATCH (approve/reject)
```

### 4.3 Data Fetching Hooks

New hooks to add (using React Query pattern from existing `queries/` directory):

```
src/hooks/queries/
├── use-candidates.ts         # List/search candidates with filters
├── use-candidate.ts          # Single candidate with relations
├── use-applications.ts       # Applications for a job (pipeline view)
├── use-application.ts        # Single application with scores/notes
├── use-pipeline.ts           # Kanban data (applications grouped by stage)
├── use-scores.ts             # Scores for an application
├── use-interviews.ts         # Interviews (by job, by date range)
├── use-offers.ts             # Offers (by job, by status)
└── use-activity.ts           # Activity feed for candidate/application
```

---

## 5. Phase-by-Phase Build Plan

### Phase 1: Audit & Wire Existing Infrastructure (Week 1)

**Goal:** Map what exists, fill gaps, and wire existing UI to existing APIs with real data flowing end-to-end.

**Tasks:**

1. **Audit existing API routes** — Map every route in `/api/canopy/` against the lifecycle operations in this plan. Create a coverage matrix identifying: fully working, stubbed/partial, and missing routes.

2. **Extend existing services:**
   - Extend `candidates.ts` — Add `fetchCandidateById()` with full relations (applications, notes, activity)
   - Create `activity-service.ts` — Centralized activity logging (currently scattered across route handlers)

3. **Verify/complete core API routes** (many already exist — verify and fill gaps):
   - `GET /api/canopy/candidates` — ✅ Likely exists via existing service. Verify filters work.
   - `GET /api/canopy/candidates/[id]` — Verify full profile with applications, notes, activity
   - `GET /api/canopy/roles/[id]/pipeline` — Verify Kanban data shape (applications grouped by stage)
   - `GET /api/canopy/applications/[id]` — Verify detail with scores, notes

4. **Extend data-fetching hooks:**
   - `use-candidates-query.ts` ✅ EXISTS — verify it covers search, stage filter, source filter
   - Add `use-pipeline-query.ts` — Kanban data for a specific job
   - Add `use-application-query.ts` — Single application with all relations

5. **Wire existing pages to real data:**
   - `/canopy/candidates/page.tsx` → `use-candidates-query` hook (likely already wired)
   - `/canopy/roles/[id]/pipeline/page.tsx` → `use-pipeline-query` hook
   - `/canopy/candidates/[id]/page.tsx` → `use-candidate-query` hook

**Validation:** Candidates list loads real data. Pipeline Kanban renders applications by stage. Candidate detail shows profile information.

---

### Phase 2: Pipeline Orchestration (Week 1–2)

**Goal:** Extend existing stage transitions with coordinated side effects so moving a candidate triggers the right downstream actions.

**Context:** Stage transitions already work via `PATCH /api/canopy/roles/[id]/applications/[appId]` with Zod validation, `canManagePipeline()` checks, and `createStageChangedNotification()`. This phase adds the orchestration layer on top.

**Tasks:**

1. **Build pipeline orchestration service:**
   - `pipeline-service.ts` — Wraps existing stage transition with coordinated side effects
   - `moveToStage(applicationId, targetStage, options?)` method that:
     - Validates allowed transitions (from → to)
     - Executes the stage update (existing logic)
     - Triggers side effects based on target stage (see §3.3 transition rules)
     - Logs to activity feed via `activity-service.ts`
     - Returns updated application + list of side effects triggered

2. **Extend existing stage transition route:**
   - Add side effect execution to the existing PATCH handler
   - When moving to `interview` → prompt to schedule
   - When moving to `offer` → create OfferRecord draft + trigger approval
   - "Mark as hired" action → set `hiredAt`, send welcome email, optionally reject remaining candidates

3. **Wire Kanban drag-and-drop to orchestration:**
   - Connect `DndKanbanBoard` drag events to the extended API
   - Optimistic updates via `use-pipeline` hook (update UI immediately, sync with server)
   - Toast notifications via `use-pipeline-toast` hook (✅ already exists)
   - Undo support via `use-undo` hook (✅ already exists)

4. **Rejection/withdrawal flows:**
   - Extend existing rejection handling with configurable delay email
   - Rejection reason modal (prompt for reason + optional email)
   - Withdrawal logging with reason

5. **Bulk operations:**
   - Extend existing `/api/canopy/applications/bulk` route for stage transitions
   - Wire `BulkActionsToolbar` (✅ exists) to batch stage transitions

6. **Email automation (folded in from original Phase 5):**
   - `email-automation.ts` — Template rendering + sending via Resend
   - Template variable interpolation: `{{candidate.name}}`, `{{job.title}}`, `{{company.name}}`
   - Queue system for scheduled emails (`ScheduledEmail` model)
   - Triggered sends on stage transitions (defined in `Job.emailAutomation` JSON)
   - Wire `EmailComposer` (✅ exists) to send API
   - Wire `BulkEmailComposer` (✅ exists) to bulk API
   - Wire `ScheduledEmailQueue` (✅ exists) to scheduled emails

**Validation:** Drag candidate card between Kanban columns → stage updates → side effects fire → activity logged → toast shown. Moving to "offer" auto-creates OfferRecord. Moving to "rejected" queues rejection email automatically.

---

### Phase 3: Scoring, Interviews & Offers (Week 2–3)

**Goal:** The full evaluation-to-hire path — scorecards, interview scheduling, and offer management.

#### 3A. Scoring & Evaluation

1. **Build scoring service:**
   - `scoring-service.ts` — Submit score, aggregate scores for application, calculate recommendation summary
   - Enforce one score per reviewer per application (upsert pattern)
   - Calculate aggregate stats (average rating, recommendation breakdown)

2. **Build scoring API routes:**
   - `GET /api/canopy/applications/[id]/scores` — All scores for an application
   - `POST /api/canopy/applications/[id]/scores` — Submit/update scorecard
   - Response includes aggregate summary

3. **Wire scorecard UI:**
   - Connect `Scorecard` component to scoring API
   - Connect `StarRating` to score submission
   - Connect `RecommendationSelect` (STRONG_YES → STRONG_NO)
   - Connect `ScorecardSummary` to aggregated scores display

4. **Build review page:**
   - Wire `/canopy/roles/[id]/review/page.tsx` to display:
     - Candidate header (name, applied date, location)
     - Scorecard form (criteria ratings + written feedback)
     - Decision buttons (Strong No → Strong Yes)
     - Right panel showing other reviewers' scores
   - This maps directly to the Homerun reference screenshot

5. **Reviewer assignment:**
   - Use existing `JobAssignment` model to assign reviewers to jobs
   - When candidate enters evaluation stage, notify assigned reviewers
   - Track completion (who has/hasn't submitted a scorecard)

6. **Build scoring hooks:**
   - `use-scores.ts` — Fetch and submit scores
   - Real-time score updates (invalidate on submission)

#### 3B. Interview Scheduling (see §3.8 for full workflow design)

7. **Build interview service** (`interview-service.ts`):
   - `scheduleInterview()` — Create Interview record, trigger calendar event + emails (see §3.8 "What Happens on Send")
   - `rescheduleInterview()` — Update time, update/recreate calendar event, notify attendees
   - `cancelInterview()` — Set CANCELLED status, delete calendar event, send cancellation emails
   - `markNoShow()` — Set NO_SHOW status, log activity (no email)
   - Calendar sync via existing `src/lib/integrations/calendar.ts` (Nango — Google Calendar + Outlook)
   - Meeting link generation per video provider (Google Meet, Zoom, Teams)
   - Multi-proposal logic: single-slot = direct confirmation, multi-slot = candidate picks via booking link (see §3.8 "Multi-Proposal vs. Single-Confirmation")
   - Slot expiry: 48h before earliest proposed time → notify recruiter

8. **Build/verify interview API routes** (routes already exist, verify and extend):
   - `POST /api/canopy/interviews` — ✅ EXISTS. Verify it handles multi-proposal mode, meeting link generation, and .ics attachment.
   - `PATCH /api/canopy/interviews/[id]` — ✅ EXISTS. Verify reschedule updates calendar event, handles status transitions (SCHEDULED → COMPLETED, CANCELLED, NO_SHOW).
   - `GET /api/canopy/interviews` — ✅ EXISTS. Verify filters (applicationId, date range, status, interviewerId) and pagination.
   - NEW: `POST /api/canopy/interviews/[id]/confirm` — Candidate confirms a proposed time slot (from booking link). Updates Interview record + creates calendar event.

9. **Wire interview scheduling UI** (components already built, need data wiring):
   - Connect `InterviewSchedulingModal` to `POST /interviews` (form state → API call → optimistic update)
   - Connect `RecruiterCalendarView` to `GET /interviews` (date range filter, real interview data)
   - Connect `UpcomingInterviewsWidget` to dashboard data hook
   - Connect `AvailabilityCalendar` to `getCalendarAvailability()` from `src/lib/integrations/calendar.ts`
   - Wire `SuggestTimesButton` to availability analysis logic (find open slots across all attendees)
   - Wire calendar tier detection: check if recruiter has calendar connected → show appropriate experience (see §3.8 "Calendar Connection Prerequisites")
   - Wire stage transition nudge: when Kanban card drops on "Interview" stage → show toast with [Schedule Interview] action button (no auto-open modal)

#### 3C. Offer Lifecycle

10. **Build offer service:**
    - `offer-service.ts` — Create draft, submit for approval, send to candidate
    - Offer status machine: DRAFT → SENT → VIEWED → AWAITING_SIGNATURE → SIGNED / DECLINED
    - Approval workflow integration (create ApprovalRequest when moving to offer stage)

11. **Build offer API routes:**
    - `POST /api/canopy/offers` — Create offer draft (linked to application)
    - `PATCH /api/canopy/offers/[id]` — Update draft (salary, start date, letter content)
    - `POST /api/canopy/offers/[id]/send` — Send offer to candidate
    - `PATCH /api/canopy/offers/[id]/sign` — Record signature (webhook from signing provider)

12. **Build approval flow:**
    - `PATCH /api/canopy/approvals/[id]` — Approve or reject
    - Build `ApprovalBanner` component + wire to pending approvals
    - Notification to requester on approval/rejection

13. **Build associated hooks:**
    - `use-scores.ts`, `use-interviews.ts`, `use-offers.ts`

**Validation:** Open candidate review → fill out scorecard → submit → see aggregated team scores (blind lifts after all submit). Schedule interview from pipeline → calendar event created → candidate notified. Draft offer → submit for approval → approval granted → offer sent → candidate signs → `hiredAt` set, candidate exits pipeline.

---

## 6. Component Wiring Map

How existing UI components connect to the new data layer:

| Component                  | Data Source               | API Route                        | Hook                          |
| -------------------------- | ------------------------- | -------------------------------- | ----------------------------- |
| `CandidatesView`           | Candidate list            | `GET /candidates`                | `use-candidates`              |
| `CandidateCard`            | Application in pipeline   | `GET /jobs/[id]/pipeline`        | `use-pipeline`                |
| `CandidatePreviewSheet`    | Full candidate data       | `GET /candidates/[id]`           | `use-candidate`               |
| `CandidateComparisonSheet` | Multiple candidates       | `GET /candidates?ids=...`        | `use-candidates`              |
| `DndKanbanBoard`           | Pipeline data             | `GET /jobs/[id]/pipeline`        | `use-pipeline`                |
| Kanban drag event          | Stage transition          | `PATCH /applications/[id]/stage` | `use-pipeline` mutation       |
| `Scorecard`                | Score submission          | `POST /applications/[id]/scores` | `use-scores` mutation         |
| `ScorecardSummary`         | Aggregated scores         | `GET /applications/[id]/scores`  | `use-scores`                  |
| `InterviewSchedulingModal` | Interview creation (§3.8) | `POST /interviews`               | `use-interviews` mutation     |
| `AvailabilityCalendar`     | Attendee free/busy data   | `getCalendarAvailability()`      | inline via calendar service   |
| `SuggestTimesButton`       | AI slot analysis          | Attendee availability data       | `use-interviews`              |
| `AddAttendeePopover`       | Org team members          | `GET /team`                      | `use-team`                    |
| `RecruiterCalendarView`    | Interview list            | `GET /interviews`                | `use-interviews`              |
| `UpcomingInterviewsWidget` | Dashboard interviews      | `GET /interviews?upcoming=true`  | `use-interviews`              |
| `EmailComposer`            | Email sending             | `POST /emails/send`              | inline mutation               |
| `BulkActionsToolbar`       | Bulk operations           | `POST /applications/bulk/stage`  | `use-pipeline` mutation       |
| `ActivityFeed`             | Activity log              | `GET /candidates/[id]/activity`  | `use-activity`                |
| `ApprovalBanner`           | Pending approvals         | `GET /approvals?status=PENDING`  | `use-approvals`               |
| `DecisionPill`             | Recommendation            | `Score.recommendation`           | included in `use-scores`      |
| `DaysInStage`              | Stage duration            | `Application.updatedAt`          | computed client-side          |
| `StageBadge`               | Current stage             | `Application.stage`              | included in `use-application` |

---

## 7. Data Model Reference

### Key Relationships for the Candidate Cycle

```
Organization
  └── Job (many)
       ├── stages (JSON — customizable pipeline)
       ├── formConfig (JSON — application form fields)
       ├── emailAutomation (JSON — stage → email triggers)
       └── Application (many)
            ├── SeekerProfile (candidate)
            ├── stage (current pipeline position)
            ├── Score (many — one per reviewer)
            │    ├── responses (JSON — scorecard answers)
            │    ├── overallRating (1–5)
            │    └── recommendation (STRONG_YES → STRONG_NO)
            ├── Interview (many — per round)
            │    ├── type (PHONE / VIDEO / ONSITE)
            │    ├── status (SCHEDULED → COMPLETED → CANCELLED)
            │    └── calendarEventId (sync)
            ├── OfferRecord (one — if offer extended)
            │    ├── status (DRAFT → SENT → SIGNED)
            │    ├── salary, startDate, letterContent
            │    └── signingLink, signedAt
            ├── Note (many — team collaboration)
            └── EmailLog (many — communication audit)
```

### Pipeline Stage Machine

```
Application.stage is a string matching one of Job.stages[].id

Allowed stage transitions (active stages only):
  sourced    → applied, screening
  applied    → screening, interview
  screening  → interview
  interview  → evaluation
  evaluation → offer

Terminal outcomes (from any stage, via action):
  "Reject"          → sets rejectedAt, exits pipeline
  "Mark withdrawn"  → sets withdrawnAt, exits pipeline
  "Mark as hired"   → sets hiredAt, exits pipeline (typically from offer)
  "Reopen"          → clears terminal timestamp, returns to last active stage
```

---

## 8. Cross-Cutting Concerns

### Activity Logging

Every significant action creates an activity entry:

| Action              | Activity Type         | Data                                 |
| ------------------- | --------------------- | ------------------------------------ |
| Application created | `application.created` | source                               |
| Stage changed       | `stage.changed`       | fromStage, toStage, movedBy          |
| Score submitted     | `score.submitted`     | rating, recommendation, reviewerName |
| Interview scheduled | `interview.scheduled` | date, type, interviewers             |
| Interview completed | `interview.completed` | —                                    |
| Email sent          | `email.sent`          | subject, recipientEmail              |
| Offer created       | `offer.created`       | salary, startDate                    |
| Offer sent          | `offer.sent`          | —                                    |
| Offer signed        | `offer.signed`        | signedAt                             |
| Note added          | `note.added`          | authorName, mentions                 |
| Candidate rejected  | `candidate.rejected`  | reason, rejectedBy                   |

### Real-Time Updates

Pipeline views should update when other team members make changes:

- **Short-term:** Polling every 30s on pipeline page + optimistic updates for own actions
- **Long-term:** WebSocket/SSE for live updates (push stage changes, new scores, new applications)

### Permissions Matrix

| Action               | ADMIN | RECRUITER | HIRING_MANAGER | MEMBER | VIEWER |
| -------------------- | ----- | --------- | -------------- | ------ | ------ |
| View candidates      | Yes   | Yes       | Own jobs       | Yes    | Yes    |
| Move pipeline stages | Yes   | Yes       | Own jobs       | No     | No     |
| Submit scorecard     | Yes   | Yes       | Yes            | Yes    | No     |
| Schedule interview   | Yes   | Yes       | Own jobs       | No     | No     |
| Create/send offer    | Yes   | Yes       | No             | No     | No     |
| Approve offer        | Yes   | No        | Yes            | No     | No     |
| Send email           | Yes   | Yes       | Own jobs       | No     | No     |
| Bulk actions         | Yes   | Yes       | No             | No     | No     |
| Delete candidate     | Yes   | No        | No             | No     | No     |

---

## 9. Testing Strategy

### Per Phase

| Phase                                 | Test Type                                                                            | Coverage Target                 |
| ------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- |
| Phase 1: Core Data                    | Integration tests for every API route                                                | 100% of routes                  |
| Phase 2: Pipeline + Email             | Integration tests for stage transitions, side effects, email automation              | All transitions + edge cases    |
| Phase 3: Scoring, Interviews & Offers | Unit tests for score aggregation, integration tests for scheduling + offer lifecycle | Score math + full state machine |

### Critical Test Scenarios

1. **Multi-tenant isolation** — Candidate from Org A must never appear in Org B queries
2. **Concurrent stage moves** — Two users moving same candidate simultaneously
3. **Scorecard math** — Average ratings, recommendation breakdown with mixed inputs
4. **Offer state machine** — Every valid transition + rejection of invalid transitions
5. **Email template rendering** — Variable substitution with missing/null values
6. **Bulk operations** — Moving 50+ candidates in one operation
7. **Pipeline with 100+ candidates** — Performance under load (pagination, virtual scroll)

---

## 10. Dependencies & Risks

### External Dependencies

| Dependency | Purpose        | Risk               | Mitigation                               |
| ---------- | -------------- | ------------------ | ---------------------------------------- |
| Resend     | Email sending  | API downtime       | Queue + retry with ScheduledEmail        |
| Nango      | Calendar sync  | OAuth token expiry | Token refresh flow, graceful degradation |
| Clerk      | Authentication | —                  | Already integrated                       |

### Technical Risks

| Risk                          | Impact                                       | Mitigation                                                   |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| Pipeline performance at scale | Slow Kanban with 500+ candidates per job     | Virtual scroll, paginate by stage, only load visible columns |
| Email deliverability          | Rejection emails going to spam               | Proper SPF/DKIM, warm-up sending domain                      |
| Concurrent edits              | Two recruiters moving same candidate         | Optimistic locking with `updatedAt` check                    |
| Scoring inconsistency         | Different reviewers using different criteria | Standardized scorecard templates per job                     |

---

## 11. Success Metrics

After full implementation, these should be measurable:

| Metric                     | Target                                 | How to Measure                                  |
| -------------------------- | -------------------------------------- | ----------------------------------------------- |
| Time to hire               | Track and display in analytics         | `Application.createdAt` → `Application.hiredAt` |
| Pipeline velocity          | Candidates per stage per day           | Stage transition timestamps                     |
| Scorecard completion       | >80% of assigned reviewers submit      | `Score` count vs `JobAssignment` count          |
| Email engagement           | Open/click rates on automated emails   | EmailLog + tracking pixels                      |
| Stage bottleneck detection | Identify stages where candidates stall | `DaysInStage` aggregation                       |

---

## 12. Build Order Summary

With AI matching removed and Phases 3+4 consolidated, the plan compresses to 3 phases across ~3 weeks:

```
Week 1:    PHASE 1 — Audit & Wire
           Audit existing routes, fill gaps, wire UI to real data
           Extend services and hooks where needed

Week 1–2:  PHASE 2 — Pipeline Orchestration + Email Automation
           Add coordinated side effects to existing stage transitions
           Kanban wiring, bulk ops, rejection/withdrawal flows
           Email automation triggers on stage transitions

Week 2–3:  PHASE 3 — Scoring, Interviews & Offers
           Scorecard submission, team aggregation, review page
           Interview scheduling with calendar sync
           Offer lifecycle (draft → approved → signed)
```

Each phase is independently deployable. Phases 1–2 can overlap since most infrastructure exists. Phase 3 builds on the orchestration layer from Phase 2.
