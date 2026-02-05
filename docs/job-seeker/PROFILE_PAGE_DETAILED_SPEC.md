# Profile Page - Detailed Implementation Specification

**Based on Figma Analysis - February 4, 2026**

---

## Page Overview

The Profile page has two main states:

1. **Empty state** - New user with prompts to add content
2. **Filled state** - User with complete profile data

---

## 1. Profile Header Section

### Cover Image

- **Preset system** - NOT custom upload. 6 preset options:
  - 3 gradient backgrounds (yellow-teal, purple-pink, soft pastel)
  - 3 illustrated scenes (spring forest, autumn forest, moonlit forest)
- **Dimensions**: Full width, approximately 160-180px height
- **Edit button**: Top right corner, "Edit Background" button
- **Share button**: Top right, "+ Share" or share icon

### Avatar

- **Size**: ~80px diameter
- **Position**: Overlapping cover image bottom edge
- **Edit button**: Small pencil icon button overlaid on avatar
- **Default state**: Purple circle with generic user icon
- **Filled state**: User's uploaded photo

### User Info

- **Name**: Large heading (text-heading-md, font-bold)
- **Badge**: "🌱 Just Graduated" - green badge inline with name
- **Location**: "San Francisco, CA, United States" with bullet separator
- **Contact link**: "Contact Info" in teal, clickable

### Social Links Row

- **Empty state**: "+ Add Your Socials" button
- **Filled state**: Row of chips/buttons
  - Username chip: "@thegracefulhan" (dark background, white text)
  - Icon buttons: LinkedIn, Facebook, Threads, Link icon
  - Add more: "+" button at end

---

## 2. Content Sections

### Summary & Skills Cards (Side by Side)

**Empty State Layout:**

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Add a summary about yourself │  │ Add your skills             │
│ Tell your career story...    │  │ Quickly add relevant skills │
│                              │  │                             │
│ [Write Your Story]           │  │ [Add Skills]                │
│              [illustration]  │  │              [illustration] │
└─────────────────────────────┘  └─────────────────────────────┘
```

**Filled State Layout:**

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Your Summary    ✏️ Edit...  │  │ Skills          ✏️ Edit... │
│ ─────────────────────────── │  │ ─────────────────────────── │
│ Grace Han is a financial    │  │ [Financial modeling] [Risk] │
│ analyst based in San        │  │ [Excel] [GIS] [Python]...   │
│ Francisco...                │  │                             │
└─────────────────────────────┘  └─────────────────────────────┘
```

**Card styling:**

- Background: White or light card background
- Border: 1px subtle border
- Border radius: 16px (rounded-2xl)
- Padding: 24px
- Edit link: Teal color, right-aligned in header

---

### Your Goals Section

**Section Header:**

- Icon: 🎯 (or target emoji)
- Title: "Your Goals"
- Count badge: "3" in subtle pill
- Action: "Add new goal" link (teal, right-aligned)

**Empty State:**

- Illustration (pencil with speech bubble)
- "What are your goals?"
- Description text
- "Add Goal" button (outlined)

**Filled State - Goal Row Items:**

```
┌──────────────────────────────────────────────────────────────┐
│ [🟢] Learn to scan and negotiate an offer letter             │
│      12% Ready                                [View Goal]    │
├──────────────────────────────────────────────────────────────┤
│ [🔵] Making sure to message my network for potential roles   │
│      75% Ready                                [View Goal]    │
├──────────────────────────────────────────────────────────────┤
│ [🟠] Improving my job interviews                             │
│      25% Ready                                [View Goal]    │
├──────────────────────────────────────────────────────────────┤
│ [+] Add another goal                                         │
└──────────────────────────────────────────────────────────────┘
```

**Goal Row Component:**

- Icon: Colored circle with category icon (green, teal, orange, etc.)
- Title: Goal title text (body size, medium weight)
- Progress: "X% Ready" in muted text
- Action: "View Goal" button (outlined)

**Goal Categories & Colors:**
| Category | Background Tint | Progress Bar | Icon |
|----------|-----------------|--------------|------|
| Networking | Blue (#E0F2FE) | Blue | 🌐 |
| Interviewing | Orange (#FFF7ED) | Orange | 💬 |
| Organization | Purple (#F3E8FF) | Purple | 📁 |
| Compensation | Green (#ECFDF5) | Green | 💰 |

---

### Your Work Experience Section

**Section Header:**

- Icon: 💼 briefcase
- Title: "Your Work Experience"
- Count badge: "3"
- Action: "Edit your experience" link (teal) OR "Add your experience"

**Empty State:**

- Illustration (clipboard with document)
- "Tell us about your experiences."
- Description text
- "Add Experiences" button

**Filled State - Experience Row:**

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO] Climate Policy Intern (Financial Focus)    2021-2023 │
│        Climate Power • Full Time                             │
├──────────────────────────────────────────────────────────────┤
│ [G]    Research Assistant – Climate Economics     2021-2023 │
│        Grist • Hybrid                                        │
├──────────────────────────────────────────────────────────────┤
│ [🌍]   Impact Investing Intern                    2021-2023 │
│        Earth Advantage • Hybrid                              │
├──────────────────────────────────────────────────────────────┤
│ [+] Add your experience                                      │
└──────────────────────────────────────────────────────────────┘
```

**Experience Row Component:**

- Logo: 40px square, rounded (company logo or letter initial)
- Title: Position title (body, medium weight)
- Company: "Company Name • Employment Type" (caption, muted)
- Dates: Year range right-aligned (caption, muted)

---

### Your Files Section

**Section Header:**

- Icon: 📁 folder
- Title: "Your Files"
- Count badge: "2"
- Action: "Upload your files" link with upload icon

**Empty State:**

- Illustration (document with lines)
- "Nothing here yet."
- Description text
- "Upload Files" button

**Filled State - File Row:**

```
┌──────────────────────────────────────────────────────────────┐
│ Resume.pdf                              [⬇️ Download PDF]   │
├──────────────────────────────────────────────────────────────┤
│ Cover_Letter.pdf                        [⬇️ Download PDF]   │
└──────────────────────────────────────────────────────────────┘
```

---

### Footer

- Text: "Building your climate career since 2024"
- Gradient text: Green to coral/pink
- Centered
- Light green background section

---

## 3. Modal Specifications

### Modal Base Styling

- Background: White
- Border radius: 24px (rounded-3xl)
- Close button: Top left, light blue circular background with X
- Title: Teal color (#0D9488), heading-lg or heading-xl
- Primary button: Dark green (#166534), rounded-lg
- Secondary/Cancel: Text button, teal or dark color
- Input backgrounds: Cream/beige (#FAF9F6 or similar)

---

### 3.1 Change Cover Image Modal

**Content:**

- Title: "Change Cover Image"
- Description: "Express yourself with a cover image that describes your personality best! We have 6 styles available with more coming soon!"
- Grid: 2x3 of cover options
- Selected state: Blue border with checkmark icon

**Actions:**

- Cancel (text)
- Save Background (primary)

---

### 3.2 Add Your Photo Modal

**Content:**

- Title: "Add your photo"
- Description: "Add your profile photo to help others recognize you! Take or upload a photo of yourself."
- Constraint text: "Max file size is #kB. File types supported (.PNG and .JPG)"
- Upload area: Large circle with camera icon, centered

**Actions:**

- Cancel (text)
- Save profile photo (primary)

---

### 3.3 Edit Contact Info Modal

**Content:**

- Title: "Edit your contact info"
- Sections:
  1. **Contact Information** (teal subheader)
     - Email Address (read-only, with info tooltip)
     - Phone Number (input)
  2. **Where are you based?** (teal subheader)
     - City, State, Country (3 inputs in row)
  3. **When is your birthday?** (teal subheader)
     - Date input (mm/dd/yyyy)

**Actions:**

- Cancel (text)
- Save Your Changes (primary)

---

### 3.4 Add Your Socials Modal

**Content:**

- Title: "Add Your Socials"
- List of inputs with icons:
  - LinkedIn URL
  - Instagram URL
  - Threads URL
  - Facebook URL
  - Bluesky URL
  - X URL
  - Personal Website URL

**Input styling:**

- Icon on left inside input
- Cream background
- Full width

**Actions:**

- Cancel (text)
- Save Your Changes (primary)

---

### 3.5 Write Your Bio Modal

**Content:**

- Title: "Write Your Bio"
- Description: "Write about your years of experience, industry, achievements or skills within the climate space. This space is dedicated for you to tell everyone your story."
- Textarea:
  - Label: "Write your bio here"
  - Character counter: "239/250" (bottom right)
  - Max: 250 characters

**Actions:**

- Cancel (text)
- Save Your Summary (primary)

---

### 3.6 Add Skills Modal

**Content:**

- Title: "Add skills"
- Input: "Write a skill" with current value
- Helper: "Type in a skill and press enter and we'll add it below!"
- Chips below: Dark chips with X close button
  - Format: "Skill Name ✕"

**Actions:**

- Cancel (text)
- Add Skill (primary)

---

### 3.7 Create Goal Modal (Two-Panel)

**Layout:** Side-by-side panels

**Left Panel (White):**

- Header: X close button, "Create Goal" text
- Title input: Large text with dashed underline (editable)
- Description textarea: With character count (79/250)
- Category dropdown: Select category (Networking, Interviewing, etc.)
- Full-width "Create goal" button (primary)
- "Cancel" link

**Right Panel (Cream):**

- Header: "Your Task list" + "+ Add task" link
- Empty state with illustration
- Or list of task checkboxes

---

### 3.8 Goal Detail Modal (Two-Panel with Category Theming)

**Layout:** Side-by-side panels with colored background tint

**Background tint colors:**

- Networking: Light blue
- Interviewing: Light orange
- Organization: Light purple
- Compensation: Light green

**Header:**

- X close button
- Category pill with icon and dropdown
- Prev/Next arrows for navigation

**Left Panel (White card):**

- Title: Large teal text with dashed underline
- "Goal Description" section with edit icon
- Description text
- "Goal Progress" section
- Progress bar (colored by category)
- "X% Complete" text

**Right Panel (Cream card):**

- "Your Task list" header + "+ Add Task"
- Checkbox list of tasks
- Completed tasks: checked, struck through
- Inline input for adding new task
- "Complete Goal" button (disabled until 100%)

---

### 3.9 Add Experience Modal

**Content:**

- Title: "Add your experience"
- Fields:
  - Position Title (input)
  - Company Name (input)
  - Employment Type (dropdown)
  - "Current role" toggle switch
  - Start Month / Start Year (two inputs)
  - End Month / End Year (two inputs, disabled if current)

**Actions:**

- Cancel (text)
- Save Position (primary)

---

### 3.10 Edit Experience Modal (List View)

**Content:**

- Title: "Edit your experience"
- List of experience items:
  - Company logo (40px)
  - Title (truncated if long)
  - Company • Type
  - Date range OR "Current Role"
  - Edit icon button
  - Delete icon button (red tint)

**Actions:**

- Cancel (text)
- "+ Add Experiences" (outlined button)

---

### 3.11 Upload Files Modal

**Content:**

- Title: "Upload your files"
- Description: "Add your resume and cover letter to your profile. Max File Size: 1MB. File type: .PDF only."
- Sections:
  1. **Resume**
     - Status: "None Uploaded" or filename
     - "Upload File" button
  2. **Cover Letter**
     - Status: "None Uploaded" or filename
     - "Upload File" button

**Actions:**

- Cancel (text)
- Save to Profile (primary)

---

## 4. Component Inventory

### New Components to Build

| Component             | Complexity | Priority |
| --------------------- | ---------- | -------- |
| `ProfileHeader`       | High       | P0       |
| `CoverImagePicker`    | Medium     | P0       |
| `SocialLinksRow`      | Medium     | P1       |
| `GoalListItem`        | Medium     | P0       |
| `GoalDetailModal`     | High       | P1       |
| `ExperienceListItem`  | Low        | P0       |
| `FileListItem`        | Low        | P1       |
| `ProfileEmptyCard`    | Low        | P1       |
| `ProfileModal` (base) | Medium     | P0       |

### Existing Components to Reuse

| Component    | Location          | Usage                  |
| ------------ | ----------------- | ---------------------- |
| Avatar       | `ui/avatar.tsx`   | Profile photo          |
| Badge        | `ui/badge.tsx`    | "Just Graduated" badge |
| Button       | `ui/button.tsx`   | All buttons            |
| Modal/Dialog | `ui/modal.tsx`    | All modals             |
| Input        | `ui/input.tsx`    | Form fields            |
| Textarea     | `ui/textarea.tsx` | Bio, descriptions      |
| Switch       | `ui/switch.tsx`   | "Current role" toggle  |
| Chip         | `ui/chip.tsx`     | Skills, social links   |
| Progress     | `ui/progress.tsx` | Goal progress bars     |
| Checkbox     | `ui/checkbox.tsx` | Task items             |

---

## 5. Implementation Phases

### Phase 1: Core Profile Structure (3 days)

1. ProfileHeader component with cover presets
2. Basic page layout (empty + filled states)
3. Summary/Skills cards

### Phase 2: Goals System (3 days)

1. GoalListItem component
2. Create Goal modal
3. Goal Detail modal with tasks
4. Category theming system

### Phase 3: Experience & Files (2 days)

1. ExperienceListItem component
2. Add/Edit Experience modals
3. FileListItem component
4. Upload Files modal

### Phase 4: Modals & Polish (2 days)

1. All remaining modals
2. Empty state illustrations
3. Responsive behavior
4. Loading states

**Total: 10 days**

---

## 6. API Requirements

### Endpoints Needed

```typescript
// Cover image
PATCH /api/profile/cover { coverId: string }

// Photo upload
POST /api/profile/photo (multipart/form-data)

// Contact info
PATCH /api/profile/contact { phone, city, state, country, birthday }

// Social links
PATCH /api/profile/socials { linkedin, instagram, threads, facebook, bluesky, x, website }

// Bio/Summary
PATCH /api/profile/summary { summary: string }

// Skills
PATCH /api/profile/skills { skills: string[] }

// Goals
GET /api/goals
POST /api/goals { title, description, category }
PATCH /api/goals/:id { title, description, category }
DELETE /api/goals/:id

// Goal tasks
GET /api/goals/:id/tasks
POST /api/goals/:id/tasks { title }
PATCH /api/goals/:id/tasks/:taskId { completed }
DELETE /api/goals/:id/tasks/:taskId

// Experience
GET /api/experience
POST /api/experience { title, company, type, current, startMonth, startYear, endMonth, endYear }
PATCH /api/experience/:id
DELETE /api/experience/:id

// Files
GET /api/files
POST /api/files/upload (multipart/form-data, type: 'resume' | 'cover_letter')
DELETE /api/files/:id
```

---

## 7. Design Tokens Required

```css
/* Cover preset backgrounds */
--cover-gradient-1: linear-gradient(135deg, #fef9c3, #99f6e4);
--cover-gradient-2: linear-gradient(135deg, #ddd6fe, #fda4af);
--cover-gradient-3: linear-gradient(135deg, #fef3c7, #fecaca, #d9f99d);

/* Goal category colors */
--goal-networking-bg: #e0f2fe;
--goal-networking-progress: #0ea5e9;
--goal-interviewing-bg: #fff7ed;
--goal-interviewing-progress: #f97316;
--goal-organization-bg: #f3e8ff;
--goal-organization-progress: #a855f7;
--goal-compensation-bg: #ecfdf5;
--goal-compensation-progress: #10b981;

/* Modal input background */
--input-cream: #faf9f6;
```

---

## 8. Open Questions

1. **Cover images**: Are the illustrated covers SVG assets or raster images?
2. **Goal icons**: What icon set is used for goal category icons?
3. **Company logos**: Do we fetch from a logo API or use letter fallbacks?
4. **File storage**: Where are uploaded files stored (S3, Uploadthing)?
5. **Birthday**: Is this actually used? Seems unusual for a job platform.
