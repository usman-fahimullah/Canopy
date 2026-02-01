# Talent Platform Specification

_Navigation, Journeys & Onboarding for Job Seekers_

---

## Navigation

### Header

```
[Logo] ——————————— [Notifications 🔔] [Profile/Account]
```

### Sidebar

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

### Icons

| Nav Item     | Icon Class                       |
| ------------ | -------------------------------- |
| Home         | ph-fill ph-house-simple          |
| Jobs         | ph-bold ph-magnifying-glass      |
| Applications | ph-fill ph-table                 |
| Treehouse    | custom tree SVG                  |
| Messages     | ph-fill ph-chat-circle-dot       |
| Profile      | custom user SVG or profile image |

**Treehouse SVG:**

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.25407 10.291L11.2638 4.79247C11.69 4.40252 12.3558 4.40252 12.782 4.79247L18.7917 10.291C19.5199 10.9573 19.0337 12.1442 18.0326 12.1442L15.8124 12.1442L21.1697 17.0086C22.1562 17.9043 21.4976 19.5 20.1413 19.5L3.85879 19.5C2.50258 19.5 1.84395 17.9043 2.83044 17.0086L8.18773 12.1442L6.01317 12.1442C5.01205 12.1442 4.52586 10.9573 5.25407 10.291Z" fill="black"/>
</svg>
```

**Profile SVG:**

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.30621 8.05285C7.30621 5.26285 9.47019 3 12.1397 3C14.8092 3 16.9731 5.26071 16.9731 8.05285C16.9731 10.845 14.8092 13.1057 12.1397 13.1057C9.47019 13.1057 7.30621 10.8428 7.30621 8.05285Z" fill="black"/>
<path d="M3.80204 20.9999H20.1975C20.3091 21.0013 20.4198 20.9797 20.5227 20.9366C20.6256 20.8934 20.7185 20.8297 20.7955 20.7492C20.8699 20.6736 20.9264 20.5825 20.961 20.4824C20.9956 20.3823 21.0074 20.2758 20.9956 20.1707C20.9948 20.1657 20.9935 20.1565 20.9917 20.1435C20.9441 19.7992 20.5197 16.7334 18.6294 15.3707C18.006 14.9213 17.2567 14.6781 16.4872 14.6754C15.7177 14.6727 14.9667 14.9106 14.3402 15.3557C12.7376 16.32 11.1265 16.32 9.4228 15.3557C8.76457 14.8628 7.16417 14.2671 5.4132 15.3385C3.35892 16.5857 3.03626 19.8278 3.00184 20.1942C2.99436 20.2984 3.00972 20.403 3.04686 20.5007C3.08401 20.5984 3.14205 20.6868 3.21695 20.7599C3.29372 20.8365 3.38495 20.8971 3.48538 20.9383C3.58581 20.9795 3.69344 21.0004 3.80204 20.9999Z" fill="black"/>
</svg>
```

---

## Notifications

| Type                      | Trigger                                  | Priority | Email              |
| ------------------------- | ---------------------------------------- | -------- | ------------------ |
| Application status change | Viewed, shortlisted, rejected, interview | High     | If not seen in 1hr |
| New message               | Employer sends message                   | High     | If not seen in 1hr |
| Job alert                 | New match based on preferences           | Medium   | Digest or off      |
| Session reminder          | 24hr / 1hr before coaching               | Medium   | Always             |
| Learning nudge            | Course progress reminder                 | Low      | Weekly digest      |

### Notification Behavior

**Delivery Logic:**

- In-app: Always
- Email: Based on priority + user activity (active users get fewer emails)

**Interaction:**

- Quick actions on high-priority (View, Reply, Archive)
- Click card → navigate to full context
- Mark as read on click

**User Preferences:**

- Toggle per notification type
- Channel control: In-app / Email / Both / Off
- Digest option for low-priority

---

## Recents Section

**Recent Applications** — collapsible section below main nav

- Show 5 items if viewport height + available nav space allows
- Show 3 items if constrained
- Collapse on mobile, expand on tap
- Default state: expanded
- Click → navigates directly to application

---

## User Journeys

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

## Onboarding Flow

### Phase 1: Get In (30 seconds)

| Step | Screen           | Elements                                          | Notes                                     |
| ---- | ---------------- | ------------------------------------------------- | ----------------------------------------- |
| 1.1  | **Sign up**      | Email/password OR social login (Google, LinkedIn) | LinkedIn = fastest, can pull profile data |
| 1.2  | **Verify email** | Inline code entry or magic link                   | Keep them in the flow                     |

### Phase 2: Essentials Only (60-90 seconds)

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

### Phase 3: First Value Moment

| Step | Screen                   | Elements                                                                    | Notes                      |
| ---- | ------------------------ | --------------------------------------------------------------------------- | -------------------------- |
| 3.1  | **Home (first landing)** | Personalized job feed, 3-5 cards visible                                    | They see value immediately |
| 3.2  | **Soft prompt overlay**  | "Complete your profile to get 3x more views" [Continue setup] [Browse jobs] | Non-blocking, their choice |

### Phase 4: Progressive Profiling (optional, prompted later)

| Step | Trigger                 | Screen                       | Elements                                                      |
| ---- | ----------------------- | ---------------------------- | ------------------------------------------------------------- |
| 4.1  | Clicks "Apply"          | **Upload resume**            | Drag/drop or file select, OR "Build from scratch"             |
| 4.2  | Resume uploaded         | **Confirm parsed info**      | "We found this — look right?" [Edit] [Confirm]                |
| 4.3  | Views profile           | **Add photo**                | Upload + crop, "Profiles with photos get 3x more views"       |
| 4.4  | After first application | **Notification preferences** | Job alerts frequency, application updates, messages           |
| 4.5  | Browses Treehouse       | **Experience level**         | [Entry] [Mid] [Senior] [Executive] — unlocks relevant content |

### Home Checklist (Persistent Widget)

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

### Flow Diagram

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

## Re-engagement Emails

| Trigger                             | Email                                  |
| ----------------------------------- | -------------------------------------- |
| Signed up, didn't finish onboarding | "Pick up where you left off" (24hr)    |
| Profile incomplete after 3 days     | "Complete your profile to get noticed" |
| No activity after 7 days            | "X new jobs match your interests"      |
