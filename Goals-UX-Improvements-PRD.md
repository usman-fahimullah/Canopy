# Goals System UX Improvements

**Product Requirements Document**

Canopy Job Seeker Portal • February 2026

---

## 1. Overview

This PRD outlines UX improvements to the Goals system in the Canopy job seeker portal. The goals feature helps job seekers set, track, and achieve career objectives through structured task management.

**Objectives:**

- Increase goal creation rate among new users
- Improve goal completion rates through better UX
- Create deeper integration between goals and job search activities
- Drive engagement through motivation and accountability features

---

## 2. Features

### 2.1 Target Dates

|              |                |
| ------------ | -------------- |
| **Priority** | High           |
| **Effort**   | Low (1-2 days) |

**Description:**

Allow users to set a target completion date when creating or editing a goal. This creates urgency and enables future reminder functionality.

**User Stories:**

- As a job seeker, I want to set a target date for my goal so I have a deadline to work toward
- As a job seeker, I want to see how much time I have left to complete my goal

**Acceptance Criteria:**

- [ ] Date picker appears in Create Goal modal below category dropdown
- [ ] Date picker appears in Goal Detail modal (editable)
- [ ] Target date is optional (can be left blank)
- [ ] Past dates cannot be selected
- [ ] Goal list item shows "Due [date]" or "Due in X days" when date is set
- [ ] Overdue goals show "Overdue" badge in red

**Design Notes:** Use existing DatePicker component. Place below category in left panel. Show relative time ("5 days left") in goal detail header.

---

### 2.2 Browse Templates

|              |                   |
| ------------ | ----------------- |
| **Priority** | High              |
| **Effort**   | Medium (3-5 days) |

**Description:**

Add a "Browse Templates" link next to "Add new goal" that opens a modal with pre-built goal templates. Selecting a template pre-fills the Create Goal form.

**User Stories:**

- As a new job seeker, I want to see recommended goals so I know where to start
- As a job seeker, I want to quickly create a goal from a template without starting from scratch

**Acceptance Criteria:**

- [ ] "Browse Templates" link appears next to "Add new goal" in section header
- [ ] Clicking opens Browse Templates modal
- [ ] Templates can be filtered by category (Networking, Interviewing, Compensation, Organization)
- [ ] Each template shows: title, description, category, number of tasks, estimated time
- [ ] "Preview Tasks" expands to show task list
- [ ] "Use Template" opens Create Goal modal with pre-filled title, description, category, and tasks
- [ ] User can edit any pre-filled content before saving

**Initial Templates:**

1. Expand Professional Network (Networking, 5 tasks)
2. Prepare for Interviews (Interviewing, 5 tasks)
3. Research Salary Expectations (Compensation, 5 tasks)
4. Organize Job Search (Organization, 4 tasks)
5. Update Resume (Organization, 5 tasks)
6. Build Portfolio Project (Organization, 5 tasks)
7. Company Research Deep Dive (Organization, 5 tasks)
8. Job Search Wellness Plan (Organization, 5 tasks)

---

### 2.3 Completion Celebration

|              |             |
| ------------ | ----------- |
| **Priority** | Medium      |
| **Effort**   | Low (1 day) |

**Description:**

Enhance the goal completion experience with a celebratory animation and optional sharing. Creates positive reinforcement for completing goals.

**User Stories:**

- As a job seeker, I want to feel celebrated when I complete a goal

**Acceptance Criteria:**

- [ ] Confetti animation plays when "Complete Goal" is confirmed
- [ ] Celebration modal shows: "Goal Completed!" with confetti icon
- [ ] Modal includes congratulatory message
- [ ] "Close" button returns to profile/goals list

---

### 2.4 Dashboard Goals Widget

|              |                   |
| ------------ | ----------------- |
| **Priority** | High              |
| **Effort**   | Medium (2-3 days) |

**Description:**

Display active goals on the home dashboard with quick progress visibility. Keeps goals top-of-mind and enables quick task completion without navigating to profile.

**User Stories:**

- As a job seeker, I want to see my goals on my dashboard so I remember to work on them
- As a job seeker, I want to quickly check off a task without leaving the dashboard

**Acceptance Criteria:**

- [ ] Goals widget appears on home dashboard
- [ ] Shows top 3 active goals (sorted by: due date, then progress)
- [ ] Each goal shows: title, category icon, progress percentage, next uncompleted task
- [ ] Checkbox allows completing next task inline
- [ ] Click on goal opens Goal Detail modal
- [ ] "View all goals" link navigates to profile goals section
- [ ] Empty state prompts "Set your first goal" with link to create

---

### 2.5 Link Goals to Applications

|              |                   |
| ------------ | ----------------- |
| **Priority** | High              |
| **Effort**   | Medium (3-4 days) |

**Description:**

Allow goals to be linked to specific job applications. For example, "Prepare for Google interview" linked to the Google application. Shows related goals on application detail page.

**User Stories:**

- As a job seeker, I want to create a goal specifically for an application
- As a job seeker, I want to see my prep goals when viewing an application

**Acceptance Criteria:**

- [ ] Create Goal modal has optional "Link to Application" dropdown
- [ ] Dropdown shows recent applications (last 30 days)
- [ ] Goal Detail modal shows linked application (if any)
- [ ] Application detail page shows "Related Goals" section
- [ ] Can link/unlink from both Goal Detail and Application Detail

---

### 2.6 Goal Journal/Notes

|              |                |
| ------------ | -------------- |
| **Priority** | Medium         |
| **Effort**   | Low (1-2 days) |

**Description:**

Add a notes/journal section to Goal Detail modal where users can record reflections, learnings, and progress updates.

**User Stories:**

- As a job seeker, I want to take notes as I work toward my goal
- As a job seeker, I want to reflect on what I learned when completing a goal

**Acceptance Criteria:**

- [ ] "Notes" section appears below Goal Description in detail modal
- [ ] Expandable/collapsible textarea
- [ ] Auto-saves on blur
- [ ] Character limit: 1000
- [ ] On goal completion, prompt: "What did you learn?"

---

### 2.7 Streaks

|              |                |
| ------------ | -------------- |
| **Priority** | Medium         |
| **Effort**   | Low (1-2 days) |

**Description:**

Track consecutive days of goal activity and display streak count to encourage consistent progress.

**User Stories:**

- As a job seeker, I want to see my streak so I stay motivated
- As a job seeker, I want to be encouraged when I maintain a streak

**Acceptance Criteria:**

- [ ] Streak counter appears in Goals section header or dashboard widget
- [ ] Shows flame icon with number (e.g., "🔥 5 day streak")
- [ ] Streak increments when user completes at least one task in a day
- [ ] Streak resets after 24 hours of no activity
- [ ] Milestone celebrations at 7, 14, 30 days

---

### 2.8 Task Resources

|              |                   |
| ------------ | ----------------- |
| **Priority** | Low               |
| **Effort**   | Medium (2-3 days) |

**Description:**

Allow users to attach links and resources to individual tasks. Helpful for storing reference materials alongside action items.

**User Stories:**

- As a job seeker, I want to save helpful links with my tasks

**Acceptance Criteria:**

- [ ] Tasks can have 0-3 resource links attached
- [ ] "Add link" appears on hover/focus of task item
- [ ] Resources show as small link icons below task text
- [ ] Clicking opens link in new tab

---

### 2.9 Reminders

|              |                   |
| ------------ | ----------------- |
| **Priority** | Medium            |
| **Effort**   | Medium (3-4 days) |

**Description:**

Send notifications when goals are approaching due dates or have been inactive. Helps users stay accountable.

**User Stories:**

- As a job seeker, I want to be reminded about goals I haven't touched
- As a job seeker, I want to be notified when a goal is due soon

**Acceptance Criteria:**

- [ ] In-app notification: "Goal due in 3 days: [title]"
- [ ] In-app notification: "You haven't updated [title] in 5 days"
- [ ] Notifications link directly to Goal Detail modal
- [ ] Reminder preferences in user settings (on/off)
- [ ] Email digest option (weekly summary)

---

### 2.10 Weekly Progress Summary

|              |                   |
| ------------ | ----------------- |
| **Priority** | Medium            |
| **Effort**   | Medium (2-3 days) |

**Description:**

Show users a summary of their weekly goal progress. Provides reflection opportunity and positive reinforcement.

**User Stories:**

- As a job seeker, I want to see what I accomplished this week

**Acceptance Criteria:**

- [ ] Weekly summary card appears on dashboard (Monday mornings)
- [ ] Shows: tasks completed, goals completed, streak maintained
- [ ] Encouraging message based on activity level
- [ ] Dismissible with "Got it" button

---

## 3. Implementation Priority

Recommended implementation order based on impact and dependencies:

| Phase | Feature                | Priority | Effort | Dependencies                |
| ----- | ---------------------- | -------- | ------ | --------------------------- |
| 1     | Target Dates           | High     | Low    | None                        |
| 1     | Browse Templates       | High     | Medium | None                        |
| 1     | Completion Celebration | Medium   | Low    | None                        |
| 2     | Dashboard Widget       | High     | Medium | None                        |
| 2     | Goal Journal/Notes     | Medium   | Low    | None                        |
| 2     | Streaks                | Medium   | Low    | None                        |
| 3     | Link to Applications   | High     | Medium | Applications API            |
| 3     | Reminders              | Medium   | Medium | Target Dates, Notifications |
| 3     | Weekly Summary         | Medium   | Medium | Streaks                     |
| 4     | Task Resources         | Low      | Medium | None                        |

---

## 4. Success Metrics

- **Goal creation rate:** % of users who create at least one goal within first 7 days
- **Goal completion rate:** % of goals marked complete (target: >40%)
- **Template adoption:** % of new goals created from templates
- **Weekly active goal users:** Users who complete at least 1 task per week
- **Average streak length:** Mean consecutive days of goal activity

---

## 5. Open Questions

1. Should templates be editable by admins/coaches, or hardcoded?
2. Should coaches be able to assign goals to job seekers?
3. What notification channels should reminders use? (In-app only vs email)
4. Should we track time spent on goals/tasks?
5. Should completed goals be archived or remain visible?
