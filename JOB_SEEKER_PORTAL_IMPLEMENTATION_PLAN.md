# Job Seeker Portal Implementation Plan

## Overview

Analysis of two Figma designs for the Canopy job seeker portal:
1. **Profile Page** (`node-id=1-2898`) - User profile with summary, skills, goals, experience, and files
2. **Explore Page** (`node-id=1-3204`) - Job discovery with pathways, collections, featured jobs, job notes, and saved jobs

---

## Design Analysis Summary

### Page 1: Profile Page (Grace Han Profile)

**Key Sections:**
1. **Header Navigation** - Tabs for Explore Jobs, Saved Jobs, Treehouse, Profile
2. **Hero Section** - Cover image with avatar overlay
3. **Profile Header** - Name, location, edit/share controls, badges
4. **Summary & Skills** - Editable text areas with inline editing
5. **Your Goals** - Goal cards with progress tracking and actions
6. **Work Experience** - Timeline of positions with company logos
7. **Your Files** - Document management with download actions
8. **Footer** - Branded tagline with gradient

**Component Inventory:**
- ✅ Avatar (exists)
- ✅ Badge (exists)
- ✅ Button (exists)
- ✅ Chip/Tag (exists)
- ✅ Card (exists)
- ❌ **Profile Header Component** (NEW - needs creation)
- ❌ **Goal Card** (NEW - needs creation)
- ❌ **Work Experience Timeline** (NEW - needs creation)
- ❌ **File List Item** (NEW - needs creation)
- ❌ **Editable Section** (NEW - inline edit pattern)
- ❌ **Cover Photo Upload** (NEW - needs creation)

### Page 2: Explore Page

**Key Sections:**
1. **Header Navigation** - Same as Profile (Segmented Controller pattern)
2. **Pathways Section** - Horizontal scroll of pathway cards
3. **Featured Collections** - Large gradient cards in grid
4. **Featured Jobs** - Job cards in 3-column grid
5. **Job Notes** - Note cards in horizontal scroll
6. **Your Saved Jobs** - Same job card layout as featured

**Component Inventory:**
- ✅ Badge (exists)
- ✅ Card (exists)
- ✅ Button (exists)
- ❌ **Pathway Card** (NEW - icon + label card)
- ❌ **Collection Card** (NEW - large gradient card with badges)
- ❌ **Job Card/Job Post** (NEW - critical component)
- ❌ **Job Note Card** (NEW - note card with author)
- ❌ **Info Tag** (NEW - small metadata tags)
- ❌ **Pathways Tag** (NEW - icon-only tag)
- ❌ **Horizontal Scroll Container** (NEW - pattern/component)

---

## Implementation Gaps

### 1. Missing Core Components (High Priority)

| Component | Used In | Complexity | Description |
|-----------|---------|------------|-------------|
| **Job Card** | Explore, Saved Jobs | High | Main job listing card with company, title, badges, tags, bookmark |
| **Collection Card** | Explore | Medium | Large gradient background card with title, description, badges |
| **Goal Card** | Profile | Medium | Goal item with icon, title, description, progress, actions |
| **Work Experience Item** | Profile | Medium | Timeline entry with company logo, title, dates |
| **Profile Header** | Profile | Medium | Name, location, badges, social links, edit/share actions |
| **Pathway Card** | Explore | Low | Simple icon card with label and job count |
| **Job Note Card** | Explore | Low | Note card with tag, title, author, bookmark |
| **File List Item** | Profile | Low | File name with download action |

### 2. Missing Utility Components

| Component | Purpose | Priority |
|-----------|---------|----------|
| **Editable Section** | Inline editing for profile sections | High |
| **Info Tag** | Small metadata tags (Remote, Senior, etc.) | High |
| **Pathways Tag** | Icon-only pathway indicator | Medium |
| **Cover Photo Upload** | Hero image upload/edit | Medium |
| **Horizontal Scroll Container** | Scrollable card containers | Medium |
| **Section Header with Action** | "Featured Jobs" + "Explore More" pattern | Low |

### 3. Missing Patterns/Features

| Pattern | Description | Components Needed |
|---------|-------------|-------------------|
| **Tab Navigation** | Segmented controller in header | SegmentedController (exists), update styling |
| **Grid Layouts** | 3-column job grid, 4-column collection grid | CSS Grid patterns |
| **Horizontal Scrolling** | Pathway cards, job notes | Scroll container component |
| **Inline Editing** | Edit summary/skills in place | Editable section wrapper |
| **File Upload/Download** | Resume, cover letter management | File input, download triggers |
| **Bookmark/Save** | Save jobs functionality | Bookmark icon button |
| **Social Sharing** | Share profile | Share modal/dropdown |

---

## Token/Design System Gaps

### Colors

**From Figma Analysis:**
- ✅ Green scale (primary) - matches existing tokens
- ✅ Blue scale (badges, tags) - matches existing tokens
- ✅ Neutral scale - matches existing tokens
- ❌ **Gradient backgrounds for collection cards** - Need gradient token definitions
- ❌ **Badge color variants** - Need "Just Graduated", "Featured", "Remote", "Hybrid", etc.

**Required New Tokens:**
```css
/* Collection Card Gradients */
--gradient-urban: linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 100%);
--gradient-planet: linear-gradient(135deg, #0A3D2C 0%, #408CFF 100%);
--gradient-game: linear-gradient(135deg, #5ECC70 0%, #3369FF 100%);
--gradient-knowledge: linear-gradient(135deg, #FF85C2 0%, #8E5ECC 100%);

/* Tag/Badge Variants */
--badge-featured-background: var(--primitive-blue-100);
--badge-featured-foreground: var(--primitive-blue-700);
--badge-graduated-background: var(--primitive-purple-100);
--badge-graduated-foreground: var(--primitive-purple-700);
```

### Typography

- ✅ All text sizes exist in token system
- ✅ Font weights covered
- ❌ **Specific line-height for job titles** - May need adjustment for multi-line truncation

### Spacing

- ✅ All spacing values exist
- ❌ **Grid gap for 3-column layout** - Should verify 16px gap matches design
- ❌ **Horizontal scroll padding** - Edge padding for scroll containers

---

## Component Documentation Status

### Already Documented
- ✅ Button
- ✅ Badge
- ✅ Avatar
- ✅ Card
- ✅ Input
- ✅ Textarea
- ✅ Checkbox
- ✅ Switch
- ✅ Tabs
- ✅ Segmented Controller
- ✅ Chip

### Need Documentation

| Component | Page Location | Priority |
|-----------|---------------|----------|
| Job Card | `/design-system/components/job-card` | **P0** |
| Collection Card | `/design-system/components/collection-card` | **P0** |
| Goal Card | `/design-system/components/goal-card` | P1 |
| Pathway Card | `/design-system/components/pathway-card` | P1 |
| Work Experience Item | `/design-system/components/work-experience-item` | P1 |
| Profile Header | `/design-system/components/profile-header` | P1 |
| Job Note Card | `/design-system/components/job-note-card` | P2 |
| File List Item | `/design-system/components/file-list-item` | P2 |
| Info Tag | `/design-system/components/info-tag` | P2 |
| Editable Section | `/design-system/patterns/editable-section` | P2 |

---

## Implementation Order (Recommended)

### Phase 1: Foundation Components (Week 1)
**Goal:** Core reusable components that both pages need

1. **Info Tag** - Small metadata tags (Remote, Senior, etc.)
   - Variants: location, employment type, seniority, pathway icon
   - Read Figma specs for exact sizing/colors

2. **Pathways Tag** - Icon-only pathway indicator
   - Uses Phosphor icons from pathway taxonomy
   - Minimal styling, mostly icon display

3. **Horizontal Scroll Container** - Reusable scroll wrapper
   - Touch-friendly horizontal scrolling
   - Optional scroll indicators
   - Snap-to-grid behavior

### Phase 2: Job Discovery (Week 2)
**Goal:** Complete Explore page functionality

4. **Pathway Card**
   - Icon, label, job count
   - Hover/active states
   - Link to filtered job results

5. **Collection Card**
   - Large gradient card
   - Multiple badge support
   - Sponsor attribution
   - Hover effects with shadow

6. **Job Card** ⭐ CRITICAL
   - Company logo/avatar
   - Job title (multi-line support)
   - Location badge
   - Info tags (remote, hybrid, etc.)
   - Pathway tag
   - Bookmark button
   - "Featured" badge (conditional)
   - Hover state with elevated shadow

7. **Job Note Card**
   - Tag (Meeting Notes, Make Your Story, etc.)
   - Title
   - Author avatar + name
   - Bookmark action
   - Color-coded tags

### Phase 3: Profile Components (Week 3)
**Goal:** Complete Profile page functionality

8. **Profile Header**
   - Cover photo (with upload on hover)
   - Avatar (large, overlapping cover)
   - Name + "Just Graduated" badge
   - Location + contact link
   - Social badges (organization, GitHub, LinkedIn, phone, email)
   - Edit/Share actions

9. **Editable Section**
   - Show/edit mode toggle
   - Inline text editing
   - Save/cancel actions
   - Used for Summary and Skills sections

10. **Goal Card**
    - Icon (colored circle background)
    - Goal title
    - Progress indicator (e.g., "1/75 Tasks")
    - "View Goal" action button
    - Add goal placeholder card

11. **Work Experience Item**
    - Company logo (square/circular)
    - Position title
    - Company name + employment type
    - Date range (year format)
    - Optional: description/bullets (not in mock)

12. **File List Item**
    - File name
    - File type/size (if available)
    - Download PDF action
    - Upload files action button

### Phase 4: Polish & Documentation (Week 4)

13. **Documentation**
    - Document all 10 new components
    - Add to design system nav
    - Create usage examples
    - Accessibility notes

14. **Patterns Documentation**
    - Grid layouts (3-column, 4-column)
    - Horizontal scroll pattern
    - Inline editing pattern
    - File management pattern

15. **Integration**
    - Create actual pages: `/app/(seeker)/profile` and `/app/(seeker)/explore`
    - Connect to mock data
    - Responsive behavior
    - Loading states

---

## Component Specifications (High-Level)

### Job Card

```tsx
interface JobCardProps {
  company: {
    name: string;
    logo?: string;
  };
  title: string;
  location?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  locationType?: 'Remote' | 'Hybrid' | 'Onsite';
  seniority?: string; // "Senior", "Junior", "Mid-level"
  pathway?: {
    id: string;
    icon: string;
  };
  isFeatured?: boolean;
  isGraduatedRole?: boolean; // "Just Graduated" badge
  isSaved?: boolean;
  onSave?: () => void;
  href: string;
}
```

**Visual Specs (from Figma):**
- Size: 437.33px width × 200px height
- Padding: 16px all sides
- Border radius: var(--radius-xl) (12px)
- Background: var(--card-background)
- Border: 1px solid var(--border-muted)
- Hover: shadow-card-hover, border-brand

### Collection Card

```tsx
interface CollectionCardProps {
  title: string;
  description?: string;
  jobCount: number;
  sponsor?: {
    name: string;
    logo: string;
  };
  badges?: Array<{ label: string; icon?: string }>;
  gradient: 'urban' | 'planet' | 'game' | 'knowledge' | string;
  href: string;
}
```

**Visual Specs:**
- Size: 350px width × 416px height
- Padding: 24px
- Border radius: var(--radius-2xl) (16px)
- Gradient backgrounds (see token section)
- Badges at bottom with icons

### Pathway Card

```tsx
interface PathwayCardProps {
  pathway: {
    id: string;
    name: string;
    icon: React.ComponentType; // Phosphor icon
    jobCount: number;
  };
  href: string;
}
```

**Visual Specs:**
- Size: 167px × 200px
- Icon: 104px × 104px (spot illustration or Phosphor icon)
- Text: heading-sm for name, caption for count
- Background: var(--card-background)

### Profile Header

```tsx
interface ProfileHeaderProps {
  coverPhoto?: string;
  avatar: string;
  name: string;
  location?: string;
  contactLink?: string;
  badges: {
    justGraduated?: boolean;
    organization?: string;
    github?: string;
    linkedin?: string;
    phone?: string;
    email?: string;
  };
  onEdit?: () => void;
  onShare?: () => void;
  isOwner?: boolean; // Show edit controls
}
```

---

## Data Structure Requirements

### Job Data Shape

```typescript
interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  location?: string;
  locationType?: 'Remote' | 'Hybrid' | 'Onsite';
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  seniority?: string;
  pathway?: {
    id: string;
    name: string;
    icon: string;
  };
  tags?: string[]; // Additional metadata
  isFeatured?: boolean;
  isGraduatedRole?: boolean;
  postedAt: Date;
  closesAt?: Date;
  description: string;
  // ... additional fields
}
```

### Collection Data Shape

```typescript
interface Collection {
  id: string;
  title: string;
  description?: string;
  jobCount: number;
  sponsor?: {
    name: string;
    logo: string;
  };
  gradient: string;
  badges: Array<{
    label: string;
    icon?: string;
  }>;
  jobs: Job[]; // Or job IDs
}
```

### User Profile Data Shape

```typescript
interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  location?: string;
  contactEmail?: string;
  isGraduated?: boolean;

  summary?: string;
  skills: Array<{
    name: string;
    endorsed?: boolean;
  }>;

  goals: Array<{
    id: string;
    title: string;
    icon: string;
    color: string;
    progress: {
      completed: number;
      total: number;
    };
  }>;

  experience: Array<{
    id: string;
    company: {
      name: string;
      logo?: string;
    };
    title: string;
    employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;

  files: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  socialLinks: {
    github?: string;
    linkedin?: string;
    phone?: string;
    website?: string;
  };
}
```

---

## Responsive Considerations

### Breakpoints

| Screen Size | Layout Changes |
|-------------|----------------|
| **Desktop (1440px)** | 3-column job grid, 4-column collections |
| **Tablet (768-1023px)** | 2-column job grid, 2-column collections, horizontal scrolls remain |
| **Mobile (< 768px)** | 1-column stacked, all horizontal scrolls, collapsible sections |

### Component Adaptations

- **Job Card** - Full width on mobile, maintain aspect ratio
- **Collection Card** - Stack vertically on mobile
- **Pathway Cards** - Always horizontal scroll (don't stack)
- **Profile Header** - Stack avatar below cover on mobile
- **Navigation** - Convert to mobile hamburger menu

---

## Accessibility Requirements

### Job Card
- Semantic `<article>` wrapper
- Heading hierarchy (h3 for job title)
- Bookmark button with aria-label
- Keyboard navigable
- Focus visible styles

### Collection Card
- Semantic `<section>` wrapper
- Alt text for sponsor logos
- Proper color contrast on gradient backgrounds
- Keyboard navigable links

### Profile Header
- Proper heading hierarchy (h1 for name)
- Alt text for avatar and cover photo
- Badge icons with aria-labels
- Edit/share actions keyboard accessible

### General
- All interactive elements keyboard accessible
- Focus indicators visible
- Color contrast WCAG AA compliant
- Screen reader friendly labels
- Reduced motion support for animations

---

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Extract exact Figma specs** - Use Figma MCP to get precise measurements, colors, spacing
3. **Create token updates** - Add missing gradients and badge variants
4. **Build Phase 1 components** - Start with Info Tag and Pathways Tag
5. **Iterate with user feedback** - Show progress, adjust as needed

---

## Questions for Clarification

1. **Navigation**: Should the tab navigation (Explore Jobs, Saved Jobs, Treehouse, Profile) be a global component or page-specific?
2. **Pathways**: What is the complete list of pathways with their icons? (Agriculture, Conservation, Energy, etc.)
3. **Collections**: Are collection gradients predefined, or can users create custom collections?
4. **Profile Editing**: Should summary/skills editing be modal-based or inline?
5. **File Upload**: What file types are allowed? Size limits?
6. **Job Notes**: Are these user-created notes or curated content?
7. **Goals Integration**: Does this integrate with an external goal-tracking system?
8. **Data Source**: Mock data initially, or connect to existing GJB API?

