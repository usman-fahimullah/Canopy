# Navigation Structure Specification

_Platform Navigation for Talent, Coach, and Employer Roles_

---

## Header (All Roles)

```
[Logo] ——————————— [Notifications 🔔] [Profile/Account]
```

The notification center lives in the header and is consistent across all user types.

---

## Talent Navigation

```
- Dashboard (House)
- Jobs (MagnifyingGlass)
- Applications (ClipboardText)
- Learnings (BookOpen → custom icon)
- Messages (ChatCircle)
- Profile (User)

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
- Dashboard (House)
- Clients (Users)
- Sessions (CalendarDots)
- Earnings (ChartLine)
- Schedule (Clock)
- Messages (ChatCircle)

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

| Nav Item             | Admin | Recruiter | Hiring Team |
| -------------------- | ----- | --------- | ----------- |
| Dashboard (House)    | ✓     | ✓         | ✓ (scoped)  |
| Jobs (Briefcase)     | ✓     | ✓         | —           |
| Candidates (Users)   | ✓     | ✓         | ✓ (scoped)  |
| Team (UsersFour)     | ✓     | —         | —           |
| Analytics (ChartBar) | ✓     | ✓         | —           |

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
