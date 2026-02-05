# Profile Page Redesign Plan

**Date:** February 4, 2026
**Figma:** `node-id=28-25292`
**Priority:** Design Fidelity
**Status:** Planning (No build yet)

---

## Current vs. Target Comparison

### Current Implementation (`/jobs/profile/page.tsx`)

| Section          | Current State                               | Design Match                           |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **Header**       | PageHeader with "Edit Profile" button       | ❌ Missing cover photo, avatar overlap |
| **Profile Card** | Avatar (initials), name, headline, location | ⚠️ Partial - no cover, no badges       |
| **About**        | Text block with edit button                 | ⚠️ Partial - not inline editable       |
| **Skills**       | Chip list with green skills subsection      | ⚠️ Partial - not inline editable       |
| **Preferences**  | 3-column grid (location, salary, sectors)   | ❌ Not in Figma design                 |
| **Experience**   | Simple text showing years                   | ❌ No timeline, no company entries     |
| **Goals**        | Not implemented                             | ❌ Missing entirely                    |
| **Files**        | Not implemented                             | ❌ Missing entirely                    |
| **Footer**       | Not implemented                             | ❌ Missing branded tagline             |

### Target Design (From Figma Spec)

```
┌─────────────────────────────────────────────────────────┐
│  [Cover Photo - full width, ~200px height]              │
│                                                         │
│     ┌──────┐                                            │
│     │Avatar│  Name              [Edit] [Share]          │
│     │ 96px │  "Just Graduated" badge                    │
│     └──────┘  📍 Location  •  contact link              │
│               [Org] [GitHub] [LinkedIn] [📞] [📧]       │
├─────────────────────────────────────────────────────────┤
│  Summary                                    [✏️ Edit]   │
│  ───────────────────────────────────────────────────── │
│  Lorem ipsum dolor sit amet, consectetur adipiscing... │
├─────────────────────────────────────────────────────────┤
│  Skills                                     [✏️ Edit]   │
│  ───────────────────────────────────────────────────── │
│  [React] [TypeScript] [Node.js] [AWS] [+3 more]        │
├─────────────────────────────────────────────────────────┤
│  Your Goals                                 [+ Add]     │
│  ───────────────────────────────────────────────────── │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ 🎯 Goal │  │ 📚 Goal │  │ ➕ Add  │                 │
│  │ 1/75    │  │ 3/10    │  │  Goal   │                 │
│  │ Tasks   │  │ Tasks   │  │         │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
├─────────────────────────────────────────────────────────┤
│  Work Experience                                        │
│  ───────────────────────────────────────────────────── │
│  ○─── [Logo] Position Title                            │
│  │         Company Name • Full Time                    │
│  │         2021 - Present                              │
│  │                                                     │
│  ○─── [Logo] Previous Position                         │
│            Company Name • Contract                     │
│            2019 - 2021                                 │
├─────────────────────────────────────────────────────────┤
│  Your Files                                 [+ Upload]  │
│  ───────────────────────────────────────────────────── │
│  📄 Resume_2024.pdf                    [Download PDF]  │
│  📄 Cover_Letter.pdf                   [Download PDF]  │
├─────────────────────────────────────────────────────────┤
│           🌱 Green Jobs Board                          │
└─────────────────────────────────────────────────────────┘
```

---

## Gap Analysis

### Components to Create

| Component              | Complexity | Dependencies                        | Est. Hours |
| ---------------------- | ---------- | ----------------------------------- | ---------- |
| **ProfileHeader**      | High       | Avatar, Badge, Button, Cover upload | 8h         |
| **GoalCard**           | Medium     | Card, Progress indicator            | 5h         |
| **WorkExperienceItem** | Medium     | Avatar (company logo), Timeline CSS | 4h         |
| **FileListItem**       | Low        | Button                              | 3h         |
| **EditableSection**    | Medium     | Input, Textarea, state management   | 6h         |
| **CoverPhotoUpload**   | Medium     | File input, image preview           | 5h         |

**Total New Components:** 6
**Total Estimated Hours:** 31h

### Existing Components to Reuse

| Component | Location        | Usage                           |
| --------- | --------------- | ------------------------------- |
| Avatar    | `ui/avatar.tsx` | Profile photo, company logos    |
| Badge     | `ui/badge.tsx`  | "Just Graduated", social badges |
| Button    | `ui/button.tsx` | Edit, Share, Download actions   |
| Card      | `ui/card.tsx`   | Section containers              |
| Chip      | `ui/chip.tsx`   | Skills display                  |

---

## Detailed Component Specifications

### 1. ProfileHeader

**Purpose:** Hero section with cover photo, avatar overlay, name, badges, and actions

**Props Interface:**

```typescript
interface ProfileHeaderProps {
  // Cover
  coverPhoto?: string;
  onCoverChange?: (file: File) => void;

  // Avatar
  avatar?: string;
  name: string;

  // Info
  location?: string;
  contactLink?: string;

  // Badges
  badges?: {
    justGraduated?: boolean;
    organization?: string;
    github?: string;
    linkedin?: string;
    phone?: string;
    email?: string;
  };

  // Actions (only shown if isOwner)
  isOwner?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
}
```

**Visual Requirements:**

- Cover: Full width, 200px height, gradient fallback if no image
- Avatar: 96px diameter, positioned -48px from bottom of cover (overlap)
- Name: `text-heading-md`, `font-bold`
- Location: With MapPin icon, `text-caption`
- Badges: Social icons as small circular buttons
- Edit/Share: Top right, only when `isOwner=true`

**States:**

- Default (viewing)
- Hover on cover (shows "Change cover" overlay when isOwner)
- Loading (skeleton)

---

### 2. GoalCard

**Purpose:** Display a goal with icon, title, progress, and action

**Props Interface:**

```typescript
interface GoalCardProps {
  id: string;
  icon: React.ComponentType<{ size?: number; weight?: string }>;
  iconColor: string; // CSS color value
  iconBackground: string; // CSS color value
  title: string;
  progress: {
    completed: number;
    total: number;
    label?: string; // e.g., "Tasks", "Courses", "Steps"
  };
  onView?: () => void;
}
```

**Visual Requirements:**

- Size: ~160px × 180px
- Icon: 48px circle with colored background
- Title: `text-body-sm`, `font-medium`, max 2 lines
- Progress: `text-caption`, format "1/75 Tasks"
- Action: "View Goal" text button

**Variant: Add Goal Card**

```typescript
interface AddGoalCardProps {
  onAdd: () => void;
}
```

- Dashed border
- Plus icon centered
- "Add Goal" text

---

### 3. WorkExperienceItem

**Purpose:** Timeline entry for work history

**Props Interface:**

```typescript
interface WorkExperienceItemProps {
  company: {
    name: string;
    logo?: string;
  };
  title: string;
  employmentType: "Full Time" | "Part Time" | "Contract" | "Internship";
  startYear: number;
  endYear?: number; // undefined = "Present"
  isLast?: boolean; // Controls timeline connector
}
```

**Visual Requirements:**

- Timeline: Vertical line on left with circle nodes
- Company logo: 40px square, rounded-lg, fallback to initials
- Title: `text-body`, `font-medium`
- Company + type: `text-caption`, muted color
- Years: `text-caption`, muted, format "2021 - Present"

---

### 4. FileListItem

**Purpose:** Display an uploaded file with download action

**Props Interface:**

```typescript
interface FileListItemProps {
  id: string;
  name: string;
  type?: string; // e.g., "pdf", "docx"
  size?: string; // e.g., "2.4 MB"
  url: string;
  onDownload?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}
```

**Visual Requirements:**

- Icon: File type icon (PDF, DOC, etc.)
- Name: `text-body-sm`, truncate if too long
- Size: `text-caption`, muted (optional)
- Action: "Download PDF" button (tertiary)
- Delete: Only shown when `isOwner=true`, requires confirmation

---

### 5. EditableSection

**Purpose:** Wrapper that toggles between view and edit modes

**Props Interface:**

```typescript
interface EditableSectionProps {
  title: string;
  isOwner?: boolean;

  // View mode
  children: React.ReactNode;

  // Edit mode
  editContent: React.ReactNode;

  // State
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}
```

**Visual Requirements:**

- Title with edit icon button (when isOwner)
- Smooth transition between view/edit states
- Save/Cancel buttons in edit mode
- Loading state during save

---

### 6. CoverPhotoUpload

**Purpose:** Upload and preview cover photo

**Props Interface:**

```typescript
interface CoverPhotoUploadProps {
  currentPhoto?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => void;
  isUploading?: boolean;
  error?: string;

  // Constraints
  maxSizeMB?: number; // default 5
  acceptedTypes?: string[]; // default ['image/jpeg', 'image/png', 'image/webp']
}
```

**Visual Requirements:**

- Overlay appears on hover
- Drag & drop support
- Progress indicator during upload
- Error state with message

---

## Page Structure Plan

```tsx
// /jobs/profile/page.tsx (redesigned)

export default function ProfilePage() {
  return (
    <div>
      {/* 1. Profile Header - Full width, no padding */}
      <ProfileHeader
        coverPhoto={profile.coverPhoto}
        avatar={profile.avatar}
        name={profile.name}
        location={profile.location}
        badges={{ ... }}
        isOwner={isOwner}
        onEdit={handleEdit}
        onShare={handleShare}
      />

      {/* 2. Content sections with padding */}
      <div className="space-y-6 px-8 py-6 lg:px-12">

        {/* Summary */}
        <EditableSection
          title="Summary"
          isOwner={isOwner}
          editContent={<Textarea value={summary} onChange={...} />}
        >
          <p>{profile.summary}</p>
        </EditableSection>

        {/* Skills */}
        <EditableSection
          title="Skills"
          isOwner={isOwner}
          editContent={<SkillsEditor skills={skills} onChange={...} />}
        >
          <ChipGroup chips={profile.skills} />
        </EditableSection>

        {/* Goals */}
        <section>
          <SectionHeader title="Your Goals" action={<AddButton />} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {goals.map(goal => <GoalCard key={goal.id} {...goal} />)}
            <AddGoalCard onAdd={handleAddGoal} />
          </div>
        </section>

        {/* Work Experience */}
        <section>
          <SectionHeader title="Work Experience" />
          <div className="space-y-0">
            {experience.map((exp, i) => (
              <WorkExperienceItem
                key={exp.id}
                {...exp}
                isLast={i === experience.length - 1}
              />
            ))}
          </div>
        </section>

        {/* Files */}
        <section>
          <SectionHeader title="Your Files" action={<UploadButton />} />
          <div className="space-y-2">
            {files.map(file => <FileListItem key={file.id} {...file} />)}
          </div>
        </section>

      </div>

      {/* 3. Footer */}
      <footer className="mt-8 py-6 text-center">
        <GreenJobsBoardLogo />
      </footer>
    </div>
  );
}
```

---

## Data Requirements

### API Endpoints Needed

| Endpoint                 | Method | Purpose               | Status                |
| ------------------------ | ------ | --------------------- | --------------------- |
| `GET /api/profile`       | GET    | Fetch profile data    | ✅ Exists             |
| `PATCH /api/profile`     | PATCH  | Update profile        | ✅ Exists             |
| `GET /api/experience`    | GET    | Fetch work experience | ✅ Exists             |
| `POST /api/experience`   | POST   | Add experience        | ✅ Exists             |
| `GET /api/goals`         | GET    | Fetch user goals      | ✅ Exists             |
| `POST /api/goals`        | POST   | Create goal           | ✅ Exists             |
| `POST /api/files/upload` | POST   | Upload file           | ❓ Needs verification |
| `GET /api/files`         | GET    | List user files       | ❓ Needs verification |

### Data Shape Updates

Current profile shape may need expansion:

```typescript
interface ProfileData {
  // Existing
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;

  // May need to add
  coverPhoto?: string;
  summary?: string;

  // Relations
  goals?: Goal[];
  experience?: WorkExperience[];
  files?: UserFile[];
}
```

---

## Implementation Order

### Phase 1: Component Creation (4 days)

| Day | Tasks                          | Deliverables                          |
| --- | ------------------------------ | ------------------------------------- |
| 1   | ProfileHeader component        | ProfileHeader.tsx                     |
| 2   | GoalCard + AddGoalCard         | GoalCard.tsx                          |
| 3   | WorkExperienceItem             | WorkExperienceItem.tsx                |
| 4   | FileListItem + EditableSection | FileListItem.tsx, EditableSection.tsx |

### Phase 2: Page Integration (2 days)

| Day | Tasks                               | Deliverables     |
| --- | ----------------------------------- | ---------------- |
| 5   | Rewrite profile page structure      | Updated page.tsx |
| 6   | Wire up API calls, state management | Functional page  |

### Phase 3: Polish (1 day)

| Day | Tasks                                      | Deliverables     |
| --- | ------------------------------------------ | ---------------- |
| 7   | Loading states, error handling, responsive | Production-ready |

**Total: 7 days**

---

## Open Questions

1. **Cover photo storage:** Where are cover photos stored? Uploadthing? S3?
2. **Goals API:** Does `/api/goals` return progress data (completed/total)?
3. **Files API:** Is there an existing file upload endpoint?
4. **Edit flow:** Should edits auto-save or require explicit save?
5. **Share functionality:** What does "Share" do? Copy link? Social share?

---

## Success Criteria

- [ ] Profile page matches Figma design pixel-for-pixel
- [ ] Cover photo upload works
- [ ] Avatar displays correctly with fallback to initials
- [ ] All badges render (graduated, social links)
- [ ] Summary is inline-editable
- [ ] Skills are inline-editable
- [ ] Goals display with progress
- [ ] Work experience shows as timeline
- [ ] Files can be downloaded
- [ ] Responsive at 1440px, 768px, 375px
- [ ] Dark mode supported
- [ ] Loading skeletons match component shapes

---

## Next Steps

1. **Review this plan** - Confirm scope and priorities
2. **Clarify open questions** - API endpoints, storage
3. **Begin Phase 1** - Start with ProfileHeader component
