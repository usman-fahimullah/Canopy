# Collection Builder Platform for Canopy

**Status:** Design Proposal
**Date:** 2025-01-28
**Context:** After implementing dynamic gradient system for collection cards

---

## Overview

The Collection Builder Platform allows admins to create, manage, and publish job collections that are displayed on the Job Seeker Portal. Collections are curated groupings of jobs based on pathways, industries, or themes.

**Key Features:**

- Visual collection editor with live gradient preview
- Pathway-based filtering to select jobs
- Automatic gradient generation based on pathway selection
- SEO-friendly slugs and metadata
- Publish/draft workflow
- Analytics and performance tracking

---

## Database Schema

### Collections Table

```prisma
model Collection {
  id          String   @id @default(cuid())
  slug        String   @unique

  // Content
  title       String
  description String?  @db.Text

  // Pathways (determines gradient)
  pathways    String[] // Array of PathwayType values

  // Job filtering criteria
  filterCriteria Json   // Flexible JSON for complex filters

  // Metadata
  status      CollectionStatus @default(DRAFT)
  featured    Boolean  @default(false)
  order       Int      @default(0) // For manual sorting

  // Sponsor (optional)
  sponsorName String?
  sponsorLogo String?

  // Badges (optional)
  badges      Json?    // Array of { label: string, variant: "default" | "accent" }

  // SEO
  metaTitle       String?
  metaDescription String?
  ogImage         String?

  // Analytics
  viewCount       Int     @default(0)
  clickCount      Int     @default(0)

  // Timestamps
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  createdBy   String

  // Relations
  creator     User      @relation(fields: [createdBy], references: [id])

  @@index([status, publishedAt])
  @@index([featured, order])
}

enum CollectionStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### Filter Criteria Schema

The `filterCriteria` JSON field stores flexible filtering rules:

```typescript
interface CollectionFilterCriteria {
  // Pathway-based (primary)
  pathways?: PathwayType[];

  // Additional filters
  locationTypes?: LocationType[];
  employmentTypes?: EmploymentType[];

  // Climate-specific
  climateCategories?: string[];
  greenSkills?: string[];
  requiredCerts?: string[];

  // Salary range
  salaryMin?: number;
  salaryMax?: number;

  // Job status
  includeClosingSoon?: boolean; // Jobs closing in < 7 days
  includeNew?: boolean; // Jobs posted in last 7 days

  // Custom query (advanced)
  customQuery?: {
    field: string;
    operator: "equals" | "contains" | "in" | "gte" | "lte";
    value: any;
  }[];
}
```

**Example:**

```json
{
  "pathways": ["energy", "technology"],
  "locationTypes": ["REMOTE", "HYBRID"],
  "employmentTypes": ["FULL_TIME"],
  "climateCategories": ["Renewable Energy"],
  "includeNew": true
}
```

---

## User Interface

### Collection List Page (`/dashboard/collections`)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│ Collections                           [+ New]        │
├─────────────────────────────────────────────────────┤
│ 🔍 Search                [Status ▾] [Featured ▾]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Gradient]  Renewable Energy Jobs                  │
│              234 jobs • Energy, Technology           │
│              Published • 1,234 views                 │
│              ⋮                                       │
│                                                      │
│  [Gradient]  Urban Dwellers                         │
│              187 jobs • Urban Planning, Construction │
│              Draft • Last edited 2 hours ago         │
│              ⋮                                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Features:**

- Visual preview of gradient
- Quick stats (job count, views, clicks)
- Status badges (Published, Draft, Archived)
- Bulk actions (publish, archive, delete)
- Drag-to-reorder for manual sorting

---

### Collection Editor (`/dashboard/collections/new` or `/dashboard/collections/[id]/edit`)

**Step 1: Basic Information**

```
┌─────────────────────────────────────────────────────┐
│ Create Collection                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Title *                                             │
│  ┌─────────────────────────────────────────┐        │
│  │ Renewable Energy Jobs                   │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  Slug (URL)                                          │
│  ┌─────────────────────────────────────────┐        │
│  │ renewable-energy-jobs                   │        │
│  └─────────────────────────────────────────┘        │
│  greenjobsboard.org/collections/renewable-energy... │
│                                                      │
│  Description (optional)                              │
│  ┌─────────────────────────────────────────┐        │
│  │ Build the clean energy future...        │        │
│  │                                         │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│                              [Cancel] [Next: Jobs]  │
└─────────────────────────────────────────────────────┘
```

**Step 2: Select Pathways (Determines Gradient)**

```
┌─────────────────────────────────────────────────────┐
│ Select Pathways                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Choose 1-3 pathways that define this collection.   │
│  The gradient will be automatically generated.       │
│                                                      │
│  ┌──────────────────────────────────────────┐       │
│  │ [✓] Energy        [ ] Agriculture        │       │
│  │ [✓] Technology    [ ] Finance            │       │
│  │ [ ] Conservation  [ ] Forestry           │       │
│  │ [ ] Research      [ ] Transportation     │       │
│  │ [ ] Sports        [ ] Waste Management   │       │
│  │ [ ] Water         [ ] Construction       │       │
│  │ [ ] Manufacturing [ ] Real Estate        │       │
│  │ [ ] Urban Planning [ ] Education         │       │
│  │ [ ] Medical       [ ] Tourism            │       │
│  │ [ ] Arts & Culture [ ] Media             │       │
│  │ [ ] Policy                               │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│  Preview                                             │
│  ┌──────────────────────────────────────────┐       │
│  │  [Gradient Preview Card]                 │       │
│  │  Renewable Energy Jobs                   │       │
│  │  Energy • Technology                     │       │
│  │                                          │       │
│  │  Using gradient: yellow-100              │       │
│  │  (Green → Yellow)                        │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│                    [Back] [Next: Filter Jobs]        │
└─────────────────────────────────────────────────────┘
```

**Key Features:**

- Multi-select pathway checkboxes (limit 3)
- Live gradient preview updates as pathways are selected
- Shows which gradient variant will be used
- Visual feedback for gradient family logic

**Step 3: Filter Jobs**

```
┌─────────────────────────────────────────────────────┐
│ Filter Jobs                                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Jobs matching your criteria: 234                   │
│                                                      │
│  Primary Filters                                     │
│  ┌──────────────────────────────────────────┐       │
│  │ Pathways (selected above):               │       │
│  │ Energy, Technology                       │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│  Location Type                                       │
│  [ ] On-site  [✓] Remote  [✓] Hybrid               │
│                                                      │
│  Employment Type                                     │
│  [✓] Full-time  [ ] Part-time  [ ] Contract         │
│  [ ] Internship                                      │
│                                                      │
│  Climate Categories (optional)                       │
│  ┌──────────────────────────────────────────┐       │
│  │ [✓] Renewable Energy                     │       │
│  │ [ ] Circular Economy                     │       │
│  │ [ ] Carbon Reduction                     │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│  Salary Range (optional)                             │
│  ┌─────────┐  to  ┌─────────┐                       │
│  │ $60,000 │      │ $120,000│                       │
│  └─────────┘      └─────────┘                       │
│                                                      │
│  Special Filters                                     │
│  [✓] Include new jobs (last 7 days)                 │
│  [ ] Include jobs closing soon (< 7 days)            │
│                                                      │
│  Advanced (JSON Query Editor)                        │
│  [Expand ▾]                                          │
│                                                      │
│                    [Back] [Next: Options]            │
└─────────────────────────────────────────────────────┘
```

**Key Features:**

- Real-time job count updates as filters change
- Visual filter builder (no code required)
- Advanced mode for custom JSON queries
- Preview of matching jobs

**Step 4: Options & Metadata**

```
┌─────────────────────────────────────────────────────┐
│ Options & Metadata                                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Sponsor (optional)                                  │
│  ┌─────────────────────────────────────────┐        │
│  │ Sponsor Name                            │        │
│  │ ┌─────────────────────────────────────┐ │        │
│  │ │ 3x5 World                           │ │        │
│  │ └─────────────────────────────────────┘ │        │
│  │                                         │        │
│  │ Logo                                    │        │
│  │ [Upload Image]   [or]  [Use URL]       │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  Badges (optional)                                   │
│  ┌─────────────────────────────────────────┐        │
│  │ [ Add Badge ]                           │        │
│  │                                         │        │
│  │ ┌──────────────┐  ┌──────────────┐     │        │
│  │ │ New          │  │ Featured     │     │        │
│  │ │ [default ▾]  │  │ [accent ▾]   │  X  │        │
│  │ └──────────────┘  └──────────────┘     │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  SEO                                                 │
│  ┌─────────────────────────────────────────┐        │
│  │ Meta Title                              │        │
│  │ ┌─────────────────────────────────────┐ │        │
│  │ │ Renewable Energy Jobs | Green...    │ │        │
│  │ └─────────────────────────────────────┘ │        │
│  │                                         │        │
│  │ Meta Description                        │        │
│  │ ┌─────────────────────────────────────┐ │        │
│  │ │ Find 234 renewable energy jobs...   │ │        │
│  │ └─────────────────────────────────────┘ │        │
│  │                                         │        │
│  │ Open Graph Image                        │        │
│  │ [Upload Image]                          │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  Visibility                                          │
│  [ ] Feature this collection on homepage             │
│                                                      │
│                    [Back] [Save Draft] [Publish]    │
└─────────────────────────────────────────────────────┘
```

**Key Features:**

- Optional sponsor branding
- Custom badges for highlighting
- SEO metadata for better discoverability
- Feature flag for homepage promotion

---

## Implementation Components

### 1. Collection List Component

```typescript
// src/components/collections/collection-list.tsx

interface CollectionListProps {
  collections: Collection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}

export function CollectionList({ collections, ... }: CollectionListProps) {
  return (
    <div className="space-y-4">
      {collections.map((collection) => (
        <CollectionListItem
          key={collection.id}
          collection={collection}
          gradient={getCollectionGradient({ pathways: collection.pathways })}
          onEdit={() => onEdit(collection.id)}
          // ... other handlers
        />
      ))}
    </div>
  );
}
```

### 2. Pathway Selector Component

```typescript
// src/components/collections/pathway-selector.tsx

interface PathwaySelectorProps {
  selected: PathwayType[];
  onChange: (pathways: PathwayType[]) => void;
  maxSelection?: number;
}

export function PathwaySelector({
  selected,
  onChange,
  maxSelection = 3
}: PathwaySelectorProps) {
  const gradient = getCollectionGradient({ pathways: selected });

  return (
    <div className="space-y-6">
      {/* Pathway checkboxes */}
      <PathwayCheckboxGrid
        selected={selected}
        onChange={onChange}
        maxSelection={maxSelection}
      />

      {/* Live preview */}
      <GradientPreview
        pathways={selected}
        gradient={gradient}
      />
    </div>
  );
}
```

### 3. Job Filter Builder

```typescript
// src/components/collections/job-filter-builder.tsx

interface JobFilterBuilderProps {
  criteria: CollectionFilterCriteria;
  onChange: (criteria: CollectionFilterCriteria) => void;
  jobCount: number; // Real-time count of matching jobs
}

export function JobFilterBuilder({
  criteria,
  onChange,
  jobCount
}: JobFilterBuilderProps) {
  return (
    <div className="space-y-6">
      {/* Job count indicator */}
      <div className="text-body-strong">
        Jobs matching your criteria: {jobCount}
      </div>

      {/* Location type checkboxes */}
      <FilterSection title="Location Type">
        <CheckboxGroup
          options={["ONSITE", "REMOTE", "HYBRID"]}
          selected={criteria.locationTypes || []}
          onChange={(types) => onChange({ ...criteria, locationTypes: types })}
        />
      </FilterSection>

      {/* Employment type checkboxes */}
      <FilterSection title="Employment Type">
        <CheckboxGroup
          options={["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]}
          selected={criteria.employmentTypes || []}
          onChange={(types) => onChange({ ...criteria, employmentTypes: types })}
        />
      </FilterSection>

      {/* Climate categories */}
      <FilterSection title="Climate Categories">
        <MultiSelect
          options={CLIMATE_CATEGORIES}
          selected={criteria.climateCategories || []}
          onChange={(cats) => onChange({ ...criteria, climateCategories: cats })}
        />
      </FilterSection>

      {/* Salary range */}
      <FilterSection title="Salary Range">
        <SalaryRangeInput
          min={criteria.salaryMin}
          max={criteria.salaryMax}
          onChange={(min, max) => onChange({ ...criteria, salaryMin: min, salaryMax: max })}
        />
      </FilterSection>

      {/* Special filters */}
      <FilterSection title="Special Filters">
        <Checkbox
          checked={criteria.includeNew}
          onChange={(checked) => onChange({ ...criteria, includeNew: checked })}
          label="Include new jobs (last 7 days)"
        />
        <Checkbox
          checked={criteria.includeClosingSoon}
          onChange={(checked) => onChange({ ...criteria, includeClosingSoon: checked })}
          label="Include jobs closing soon (< 7 days)"
        />
      </FilterSection>

      {/* Advanced JSON editor */}
      <Collapsible trigger="Advanced (JSON Query Editor)">
        <JsonEditor
          value={criteria.customQuery || []}
          onChange={(query) => onChange({ ...criteria, customQuery: query })}
        />
      </Collapsible>
    </div>
  );
}
```

### 4. Gradient Preview Component

```typescript
// src/components/collections/gradient-preview.tsx

interface GradientPreviewProps {
  pathways: PathwayType[];
  gradient: string;
}

export function GradientPreview({ pathways, gradient }: GradientPreviewProps) {
  const family1 = getPathwayFamily(pathways[0]);
  const family2 = pathways[1] ? getPathwayFamily(pathways[1]) : null;

  // Determine gradient variant info
  const gradientInfo = family2 && family1 !== family2
    ? `Dual-family: ${family1} → ${family2}`
    : `Same-family: ${family1}`;

  return (
    <div className="space-y-3">
      <Label>Preview</Label>
      <div
        className="h-48 rounded-2xl p-6 flex flex-col justify-between"
        style={{ background: gradient }}
      >
        <div>
          <h3 className="text-heading-sm font-bold text-[var(--primitive-neutral-0)]">
            Collection Preview
          </h3>
          <div className="flex gap-2 mt-2">
            {pathways.map((pathway) => (
              <PathwayTag
                key={pathway}
                pathway={pathway}
                className="bg-[var(--primitive-neutral-0)]/20 backdrop-blur-sm"
              />
            ))}
          </div>
        </div>
        <div className="text-caption text-[var(--primitive-neutral-0)]/80">
          {gradientInfo}
        </div>
      </div>
      <div className="text-caption text-[var(--foreground-muted)]">
        Using gradient: <code className="bg-[var(--background-muted)] px-1 rounded">{gradient}</code>
      </div>
    </div>
  );
}
```

---

## API Routes

### 1. Get Collections

```typescript
// GET /api/collections
// Query params: status, featured, limit, offset

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured") === "true";

  const collections = await prisma.collection.findMany({
    where: {
      ...(status && { status }),
      ...(featured && { featured: true }),
    },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
    include: {
      creator: {
        select: { name: true, email: true },
      },
    },
  });

  return Response.json(collections);
}
```

### 2. Create Collection

```typescript
// POST /api/collections

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { title, slug, pathways, filterCriteria, ...rest } = body;

  // Validate slug uniqueness
  const existing = await prisma.collection.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Slug already exists" }, { status: 400 });
  }

  const collection = await prisma.collection.create({
    data: {
      title,
      slug,
      pathways,
      filterCriteria,
      createdBy: session.user.id,
      ...rest,
    },
  });

  return Response.json(collection);
}
```

### 3. Get Job Count (Real-time filtering)

```typescript
// POST /api/collections/count-jobs
// Body: { filterCriteria: CollectionFilterCriteria }

export async function POST(request: Request) {
  const { filterCriteria } = await request.json();

  const count = await prisma.job.count({
    where: buildJobWhereClause(filterCriteria),
  });

  return Response.json({ count });
}

function buildJobWhereClause(criteria: CollectionFilterCriteria) {
  return {
    status: "PUBLISHED",
    ...(criteria.pathways && {
      greenSkills: {
        hasSome: criteria.pathways,
      },
    }),
    ...(criteria.locationTypes && {
      locationType: {
        in: criteria.locationTypes,
      },
    }),
    ...(criteria.employmentTypes && {
      employmentType: {
        in: criteria.employmentTypes,
      },
    }),
    ...(criteria.salaryMin && {
      salaryMin: {
        gte: criteria.salaryMin,
      },
    }),
    ...(criteria.salaryMax && {
      salaryMax: {
        lte: criteria.salaryMax,
      },
    }),
    ...(criteria.includeNew && {
      publishedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    }),
    ...(criteria.includeClosingSoon && {
      closesAt: {
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      },
    }),
    // Handle custom queries
    ...(criteria.customQuery && buildCustomQueryClause(criteria.customQuery)),
  };
}
```

### 4. Publish Collection

```typescript
// PATCH /api/collections/[id]/publish

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const collection = await prisma.collection.update({
    where: { id: params.id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return Response.json(collection);
}
```

---

## Job Seeker Portal Integration

### Public Collections Page

```typescript
// src/app/(public)/collections/page.tsx

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { featured: "desc" },
      { order: "asc" },
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-heading-lg font-bold mb-8">
          Explore Climate Job Collections
        </h1>

        {/* Featured collections */}
        <section className="mb-12">
          <h2 className="text-heading-md font-bold mb-6">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections
              .filter((c) => c.featured)
              .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  {...collection}
                  href={`/collections/${collection.slug}`}
                />
              ))}
          </div>
        </section>

        {/* All collections */}
        <section>
          <h2 className="text-heading-md font-bold mb-6">All Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections
              .filter((c) => !c.featured)
              .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  {...collection}
                  href={`/collections/${collection.slug}`}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

### Collection Detail Page

```typescript
// src/app/(public)/collections/[slug]/page.tsx

export default async function CollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
  });

  if (!collection) {
    notFound();
  }

  // Get jobs matching collection criteria
  const jobs = await prisma.job.findMany({
    where: buildJobWhereClause(collection.filterCriteria),
    orderBy: { publishedAt: "desc" },
  });

  // Track view count
  await prisma.collection.update({
    where: { id: collection.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-[var(--background-default)]">
      {/* Hero section with gradient */}
      <div
        className="h-64 flex items-center justify-center"
        style={{
          background: getCollectionGradient({ pathways: collection.pathways }),
        }}
      >
        <div className="text-center">
          <h1 className="text-heading-lg font-bold text-[var(--primitive-neutral-0)] mb-4">
            {collection.title}
          </h1>
          <p className="text-body text-[var(--primitive-neutral-0)]/90">
            {jobs.length} jobs
          </p>
          <div className="flex gap-2 justify-center mt-4">
            {collection.pathways.map((pathway) => (
              <PathwayTag
                key={pathway}
                pathway={pathway}
                className="bg-[var(--primitive-neutral-0)]/20 backdrop-blur-sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Job listings */}
      <div className="max-w-7xl mx-auto py-12 px-8">
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobPostCard
              key={job.id}
              {...job}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Analytics & Insights

### Collection Performance Dashboard

```
┌─────────────────────────────────────────────────────┐
│ Collection Analytics                                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Top Performing Collections (Last 30 Days)          │
│  ┌──────────────────────────────────────────┐       │
│  │ 1. Renewable Energy Jobs                 │       │
│  │    1,234 views • 456 clicks • 37% CTR    │       │
│  │    📊 ████████████░░░░░░                 │       │
│  │                                          │       │
│  │ 2. Urban Dwellers                        │       │
│  │    987 views • 321 clicks • 33% CTR      │       │
│  │    📊 ████████░░░░░░░░░░                 │       │
│  │                                          │       │
│  │ 3. Climate Education                     │       │
│  │    654 views • 198 clicks • 30% CTR      │       │
│  │    📊 ██████░░░░░░░░░░░░                 │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│  Engagement Trends                                   │
│  [Line chart: Views & Clicks over time]              │
│                                                      │
│  Pathway Popularity                                  │
│  [Bar chart: Most clicked pathways]                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Metrics Tracked:**

- Views (collection card impressions)
- Clicks (collection card clicks)
- CTR (click-through rate)
- Job applications from collection
- Time on collection detail page
- Pathway popularity

---

## Future Enhancements

### Phase 2

- **A/B Testing**: Test different gradient mappings
- **Personalized Collections**: Collections based on user profile/behavior
- **Seasonal Collections**: "Summer Internships", "Remote Winter Jobs"
- **Employer-Curated**: Allow employers to create their own collections
- **Collection Tags**: Categorize collections (Featured, New, Trending, etc.)

### Phase 3

- **AI-Generated Collections**: Auto-create collections based on job trends
- **Smart Recommendations**: "Collections you might like"
- **Email Digests**: Weekly collection highlights
- **Collection Subscriptions**: Get notified of new jobs in collection
- **Social Sharing**: Share collection cards on social media

---

## Next Steps

1. **Database Migration**: Add `Collection` model to Prisma schema
2. **Implement CRUD APIs**: Create collection management endpoints
3. **Build Collection Editor**: Multi-step wizard UI
4. **Integrate with Job Seeker Portal**: Public collections page
5. **Add Analytics Tracking**: View/click events
6. **Launch with Curated Collections**: Seed initial collections

---

## Success Metrics

**Launch Goals (30 days):**

- 10 published collections
- 1,000+ collection views
- 30% CTR from collection to job detail
- 5% application rate from collection traffic

**Growth Goals (90 days):**

- 25 published collections
- 10,000+ collection views
- 100+ applications from collection traffic
- 3+ sponsored collections
