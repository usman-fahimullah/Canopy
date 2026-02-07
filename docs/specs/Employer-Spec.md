# Employer Platform Specification

_Navigation, Journeys & Onboarding for Employers_

---

## User Types

| Type            | Role                              | Access                                |
| --------------- | --------------------------------- | ------------------------------------- |
| **Admin**       | Company owner/HR lead             | Full access, manages team             |
| **Recruiter**   | Hiring operations                 | Creates roles, manages candidates     |
| **Hiring Team** | Department managers, interviewers | Reviews candidates for specific roles |

---

## Navigation

### Header

```
[Logo] ——————————— [Notifications 🔔] [Profile/Account]
```

### Sidebar (varies by user type)

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

### Icons

| Nav Item   | Icon Class                 |
| ---------- | -------------------------- |
| Home       | ph-fill ph-house-simple    |
| Roles      | ph-fill ph-briefcase-metal |
| Candidates | ph-bold ph-users           |
| Team       | ph-bold ph-users-four      |
| Analytics  | ph-fill ph-chart-donut     |

---

## Notifications

| Type            | Trigger                         | Priority | Email              |
| --------------- | ------------------------------- | -------- | ------------------ |
| New application | Candidate applies               | High     | If not seen in 1hr |
| New message     | Candidate replies               | High     | If not seen in 1hr |
| Job expiring    | 7 days / 3 days before          | Medium   | Always             |
| Team activity   | Colleague comments on candidate | Low      | Digest or off      |

### Notification Behavior

**Delivery Logic:**

- In-app: Always
- Email: Based on priority + user activity (active users get fewer emails)

**Interaction:**

- Quick actions on high-priority (Review, Reply, Extend)
- Click card → navigate to full context
- Mark as read on click

**User Preferences:**

- Toggle per notification type
- Channel control: In-app / Email / Both / Off
- Digest option for low-priority

---

## Recents Section

**Recent Postings** — collapsible section below main nav

- Show 5 items if viewport height + available nav space allows
- Show 3 items if constrained
- Collapse on mobile, expand on tap
- Default state: expanded
- Click → navigates directly to role

---

## User Journeys

**Primary goal:** Hire the right people efficiently

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

## Onboarding Flows

### Flow A: Admin (Company Setup)

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

**Home Checklist (Admin, Post-Onboarding)**

```
Get your first hire
━━━━━━━━━━━━━━━━━━━━━ 30%

☑ Company profile
☐ Post a role — "Start attracting candidates"
☐ Invite team — "Collaborate on hiring"
☐ Review first candidate
☐ Make first hire
```

**Flow Diagram:**

```
[Sign up] → [Verify] → [Name] → [Company] → [Size] → [Industry]
                                                         ↓
                              [Post first role?] → [Invite team?] → [HOME]
```

---

### Flow B: Recruiter (Invited)

| Step | Screen              | Elements                                | Notes            |
| ---- | ------------------- | --------------------------------------- | ---------------- |
| 1    | **Email invite**    | "You've been invited to join [Company]" | Click to accept  |
| 2    | **Create account**  | Email pre-filled, set password          |                  |
| 3    | **Your name**       | First, Last, Job title                  |                  |
| 4    | **Welcome to Home** | See existing roles, candidates          | Immediate access |

**Flow Diagram:**

```
[Email invite] → [Accept] → [Set password] → [Name] → [HOME]
```

---

### Flow C: Hiring Team (Invited)

| Step | Screen                    | Elements                                  | Notes         |
| ---- | ------------------------- | ----------------------------------------- | ------------- |
| 1    | **Email invite**          | "You've been invited to help hire [Role]" | Role-specific |
| 2    | **Create account**        | Email pre-filled, set password            |               |
| 3    | **Your name**             | First, Last                               | Minimal       |
| 4    | **Welcome to Candidates** | Goes straight to candidate review         | Scoped view   |

**Flow Diagram:**

```
[Email invite] → [Accept] → [Set password] → [Name] → [CANDIDATES]
```

---

## Re-engagement Emails

| Trigger                                 | Email                                         |
| --------------------------------------- | --------------------------------------------- |
| Signed up, didn't post role             | "Post your first role to start hiring" (24hr) |
| Role posted, no candidates after 3 days | "Boost visibility for [Role]"                 |
| Candidates waiting review > 48hr        | "You have X candidates waiting for review"    |
| No team invited after 7 days            | "Invite your team to collaborate on hiring"   |
