# Job Seeker Portal - Work Breakdown Plan

**Created:** February 4, 2026
**Priority:** Design Fidelity First
**Objective:** Complete the job seeker portal to match Figma designs exactly

---

## Current State Summary

### ✅ Pages Implemented (Functional)

| Page          | Route                 | Lines | Status                                          |
| ------------- | --------------------- | ----- | ----------------------------------------------- |
| Dashboard     | `/jobs/dashboard`     | 348   | Basic implementation                            |
| Profile       | `/jobs/profile`       | 283   | Basic implementation                            |
| Applications  | `/jobs/applications`  | 207   | Functional                                      |
| Job Search    | `/jobs/search`        | 287   | Functional with filters                         |
| Treehouse     | `/jobs/treehouse`     | 236   | Learning resources                              |
| Coaching      | `/jobs/coaching`      | 431   | Coach browsing & booking                        |
| Mentoring     | `/jobs/mentoring`     | 542   | Mentor matching                                 |
| Messages      | `/jobs/messages`      | 30    | Uses shared MessagesLayout                      |
| Notifications | `/jobs/notifications` | 179   | Functional                                      |
| Settings      | `/jobs/settings`      | 578   | Comprehensive (profile, notifications, privacy) |

### ⚠️ Design Gaps Identified

Based on the Talent-Spec.md and implementation plans, the following are NOT matching Figma designs:

1. **Explore Page** - Current search page lacks:
   - Pathways section (horizontal scroll of pathway cards)
   - Featured Collections (gradient cards)
   - Job Notes section
   - Proper Job Card component usage

2. **Profile Page** - Missing:
   - Cover photo with avatar overlay
   - Goal cards with progress tracking
   - Work experience timeline
   - Editable sections (inline editing)
   - Files section with download actions

3. **Home/Dashboard** - Needs:
   - Profile completion checklist widget
   - Recent applications sidebar
   - Personalized job feed

---

## Component Gap Analysis

### Already Built & Ready

| Component       | Location                             | Integration Status        |
| --------------- | ------------------------------------ | ------------------------- |
| Job Post Card   | `/components/ui/job-post-card.tsx`   | Exists but not integrated |
| Job Note Card   | `/components/ui/job-note-card.tsx`   | Exists but not integrated |
| Collection Card | `/components/ui/collection-card.tsx` | Exists but not integrated |
| Info Tag        | `/components/ui/info-tag.tsx`        | Implemented               |
| Pathway Tag     | `/components/ui/pathway-tag.tsx`     | Implemented               |
| Category Tag    | `/components/ui/category-tag.tsx`    | Implemented               |

### Missing Components (Need Creation)

| Component                       | Priority | Complexity | Est. Hours |
| ------------------------------- | -------- | ---------- | ---------- |
| **Pathway Card**                | P0       | Low        | 4          |
| **Profile Header**              | P0       | High       | 8          |
| **Goal Card**                   | P1       | Medium     | 5          |
| **Work Experience Item**        | P1       | Medium     | 4          |
| **File List Item**              | P2       | Low        | 3          |
| **Editable Section**            | P2       | Medium     | 6          |
| **Cover Photo Upload**          | P2       | Medium     | 5          |
| **Horizontal Scroll Container** | P1       | Low        | 3          |

---

## Work Breakdown Structure

### Phase 1: Component Creation (Days 1-5)

**Goal:** Build all missing design system components

#### Day 1-2: Foundation Components

| Task | Description                                                  | Est. |
| ---- | ------------------------------------------------------------ | ---- |
| 1.1  | Create `PathwayCard` component with icon, label, job count   | 4h   |
| 1.2  | Create `HorizontalScrollContainer` reusable wrapper          | 3h   |
| 1.3  | Document Info Tag, Pathway Tag, Category Tag (already built) | 2h   |

**Deliverables:** 2 new components, 3 documentation pages

#### Day 3-4: Profile Components

| Task | Description                                                           | Est. |
| ---- | --------------------------------------------------------------------- | ---- |
| 2.1  | Create `ProfileHeader` (cover photo, avatar overlay, badges, actions) | 8h   |
| 2.2  | Create `GoalCard` (icon, title, progress indicator, action button)    | 5h   |

**Deliverables:** 2 new components

#### Day 5: Profile Components (continued)

| Task | Description                                                        | Est. |
| ---- | ------------------------------------------------------------------ | ---- |
| 3.1  | Create `WorkExperienceItem` (company logo, title, dates, timeline) | 4h   |
| 3.2  | Create `FileListItem` (file name, type, download action)           | 3h   |

**Deliverables:** 2 new components

---

### Phase 2: Page Integration (Days 6-10)

**Goal:** Update pages to use design system components

#### Day 6-7: Explore Page Redesign

| Task | Description                                                  | Est. |
| ---- | ------------------------------------------------------------ | ---- |
| 4.1  | Redesign `/jobs/search` → Explore page with Pathways section | 4h   |
| 4.2  | Add Featured Collections grid using `CollectionCard`         | 4h   |
| 4.3  | Add Featured Jobs section using `JobPostCard`                | 3h   |
| 4.4  | Add Job Notes horizontal scroll using `JobNoteCard`          | 3h   |
| 4.5  | Add Saved Jobs section                                       | 2h   |

**Deliverables:** Complete Explore page matching Figma

#### Day 8-9: Profile Page Redesign

| Task | Description                                            | Est. |
| ---- | ------------------------------------------------------ | ---- |
| 5.1  | Integrate `ProfileHeader` with cover photo upload      | 4h   |
| 5.2  | Add Goals section using `GoalCard`                     | 3h   |
| 5.3  | Add Work Experience section using `WorkExperienceItem` | 3h   |
| 5.4  | Add Files section using `FileListItem`                 | 2h   |
| 5.5  | Implement editable Summary & Skills sections           | 4h   |

**Deliverables:** Complete Profile page matching Figma

#### Day 10: Dashboard Enhancement

| Task | Description                                | Est. |
| ---- | ------------------------------------------ | ---- |
| 6.1  | Add profile completion checklist widget    | 4h   |
| 6.2  | Enhance job feed with proper `JobPostCard` | 3h   |
| 6.3  | Add recent applications quick-access       | 2h   |

**Deliverables:** Enhanced Dashboard matching spec

---

### Phase 3: Polish & Documentation (Days 11-12)

**Goal:** Ensure design consistency and document all components

#### Day 11: Visual Polish

| Task | Description                                     | Est. |
| ---- | ----------------------------------------------- | ---- |
| 7.1  | Add gradient tokens for Collection Cards        | 2h   |
| 7.2  | Verify responsive behavior on all pages         | 3h   |
| 7.3  | Add loading skeletons matching component shapes | 3h   |

#### Day 12: Documentation

| Task | Description                                                 | Est. |
| ---- | ----------------------------------------------------------- | ---- |
| 8.1  | Create design system documentation pages for new components | 4h   |
| 8.2  | Update navigation in design system docs                     | 2h   |
| 8.3  | Create usage examples and props tables                      | 2h   |

---

## Component Specifications

### 1. Pathway Card

```tsx
interface PathwayCardProps {
  pathway: {
    id: string;
    name: string;
    icon: React.ComponentType;
    jobCount: number;
  };
  href: string;
}
```

**Visual Specs:**

- Size: 167px × 200px
- Icon: 104px × 104px centered
- Background: var(--card-background)
- Border radius: var(--radius-xl)
- Hover: shadow-card-hover

### 2. Profile Header

```tsx
interface ProfileHeaderProps {
  coverPhoto?: string;
  avatar: string;
  name: string;
  location?: string;
  badges?: {
    justGraduated?: boolean;
    organization?: string;
    github?: string;
    linkedin?: string;
  };
  isOwner?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
}
```

**Visual Specs:**

- Cover: Full width, 200px height
- Avatar: 96px, -48px overlap from cover
- Edit/Share buttons top right when isOwner

### 3. Goal Card

```tsx
interface GoalCardProps {
  icon: React.ComponentType;
  iconColor: string;
  title: string;
  progress: {
    completed: number;
    total: number;
  };
  onView?: () => void;
}
```

**Visual Specs:**

- Icon in 48px colored circle
- Progress: "1/75 Tasks" text format
- "View Goal" button

### 4. Work Experience Item

```tsx
interface WorkExperienceItemProps {
  company: {
    name: string;
    logo?: string;
  };
  title: string;
  employmentType: "Full Time" | "Part Time" | "Contract" | "Internship";
  startYear: number;
  endYear?: number | "Present";
}
```

**Visual Specs:**

- Company logo: 40px square
- Timeline connector on left
- Year range: "2021 - Present"

---

## API Dependencies

### Required Endpoints (Existing)

- `GET /api/jobs/matches` - Job matching with scores ✅
- `GET /api/jobs/saved` - Saved jobs ✅
- `POST /api/jobs/:id/save` - Toggle save job ✅
- `GET /api/profile` - User profile ✅
- `PATCH /api/profile` - Update profile ✅

### Required Endpoints (May Need Creation)

| Endpoint                    | Purpose                  | Priority    |
| --------------------------- | ------------------------ | ----------- |
| `GET /api/jobs/collections` | Featured collections     | P0          |
| `GET /api/jobs/pathways`    | Pathway categories       | P0          |
| `GET /api/jobs/notes`       | Job notes/articles       | P1          |
| `GET /api/goals`            | User goals with progress | P1          |
| `GET /api/experience`       | Work experience          | P1 (exists) |
| `POST /api/files/upload`    | Resume/file upload       | P2          |

---

## Success Criteria

### Design Fidelity Checklist

- [ ] Explore page matches Figma exactly
- [ ] Profile page matches Figma exactly
- [ ] All new components follow design system patterns
- [ ] Gradient tokens defined for collection cards
- [ ] Responsive at desktop (1440px), tablet (768px), mobile (375px)
- [ ] Dark mode support for all new components
- [ ] Loading states match component shapes (skeletons)

### Functional Checklist

- [ ] Can browse pathways and see filtered jobs
- [ ] Can view and interact with collection cards
- [ ] Can save/unsave jobs from any job card
- [ ] Can edit profile inline (summary, skills)
- [ ] Can upload and manage files
- [ ] Can track goals progress
- [ ] Can view work experience timeline

---

## Estimated Timeline

| Phase                | Duration    | Deliverables                             |
| -------------------- | ----------- | ---------------------------------------- |
| Phase 1: Components  | 5 days      | 7 new components, 3 docs                 |
| Phase 2: Integration | 5 days      | 3 redesigned pages                       |
| Phase 3: Polish      | 2 days      | Documentation, responsive, accessibility |
| **Total**            | **12 days** | Complete job seeker portal               |

---

## Next Steps

1. **Confirm Figma access** - Need links to exact Figma frames for pixel-perfect implementation
2. **Prioritize MVP** - Which pages are must-have for launch vs. nice-to-have?
3. **API review** - Confirm which endpoints exist vs. need creation
4. **Begin Phase 1** - Start with Pathway Card and Horizontal Scroll Container

---

## Questions for Clarification

1. Are there specific Figma links for each component we should reference?
2. Is there an existing pathways/collections API, or should we mock data initially?
3. What's the timeline pressure - can we take the full 12 days or need faster?
4. Should we prioritize Explore page or Profile page first?
