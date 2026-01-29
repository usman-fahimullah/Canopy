# Implementation Checklist: Collection Builder Platform

**Use this checklist when implementing the Collection Builder described in COLLECTION_BUILDER_PLATFORM.md**

---

## Phase 1: Database & Backend (1-2 days)

### Database Schema
- [ ] Add `Collection` model to `prisma/schema.prisma`
- [ ] Add `CollectionStatus` enum (DRAFT, PUBLISHED, ARCHIVED)
- [ ] Add relations to `User` model (creator)
- [ ] Run migration: `pnpm db:push`
- [ ] Verify schema in Prisma Studio: `pnpm db:studio`

### Seed Data (Optional)
- [ ] Create seed script: `prisma/seed-collections.ts`
- [ ] Add 5-10 example collections
- [ ] Test with: `pnpm db:seed`

### API Routes - Collections CRUD
- [ ] `GET /api/collections` - List all collections
- [ ] `POST /api/collections` - Create new collection
- [ ] `GET /api/collections/[id]` - Get single collection
- [ ] `PATCH /api/collections/[id]` - Update collection
- [ ] `DELETE /api/collections/[id]` - Delete collection
- [ ] Add auth checks (Clerk session)
- [ ] Add validation (Zod schemas)

### API Routes - Collection Actions
- [ ] `PATCH /api/collections/[id]/publish` - Publish collection
- [ ] `PATCH /api/collections/[id]/archive` - Archive collection
- [ ] `POST /api/collections/count-jobs` - Real-time job count
- [ ] Add error handling
- [ ] Add rate limiting

### Validation Schemas
- [ ] Create `src/lib/validators/collection.ts`
- [ ] Define `CollectionCreateSchema`
- [ ] Define `CollectionUpdateSchema`
- [ ] Define `FilterCriteriaSchema`
- [ ] Export TypeScript types

---

## Phase 2: Admin UI - Collection List (1 day)

### Collection List Page
- [ ] Create `/src/app/(dashboard)/collections/page.tsx`
- [ ] Fetch collections from API
- [ ] Display in grid/list layout
- [ ] Show gradient preview (mini version)
- [ ] Show status badges (Published, Draft, Archived)
- [ ] Show job count, views, clicks

### Collection List Item Component
- [ ] Create `src/components/collections/collection-list-item.tsx`
- [ ] Show gradient preview (64px height)
- [ ] Show title, pathway tags, job count
- [ ] Show status indicator
- [ ] Add action menu (Edit, Publish, Archive, Delete)
- [ ] Add hover states

### Filters & Search
- [ ] Add search input (filter by title)
- [ ] Add status filter dropdown (All, Published, Draft, Archived)
- [ ] Add featured filter toggle
- [ ] Implement client-side filtering
- [ ] Add sort options (Recent, Title, Job Count)

### Bulk Actions
- [ ] Add checkbox selection
- [ ] Add "Select All" toggle
- [ ] Add bulk publish button
- [ ] Add bulk archive button
- [ ] Add bulk delete button (with confirmation)
- [ ] Show selection count

### Empty States
- [ ] Design empty state for no collections
- [ ] Add CTA button: "Create your first collection"
- [ ] Add illustration or icon

---

## Phase 3: Collection Editor - Step 1 (1 day)

### Editor Layout
- [ ] Create `/src/app/(dashboard)/collections/new/page.tsx`
- [ ] Create `/src/app/(dashboard)/collections/[id]/edit/page.tsx`
- [ ] Add multi-step wizard layout
- [ ] Add progress indicator (Step 1 of 4)
- [ ] Add navigation buttons (Back, Next, Save Draft)

### Basic Information Form
- [ ] Create `src/components/collections/basic-info-form.tsx`
- [ ] Add title input (required)
- [ ] Add slug input (auto-generated from title)
- [ ] Add slug validation (check uniqueness)
- [ ] Add description textarea (optional)
- [ ] Add character counters
- [ ] Add form validation (client-side)

### Auto-Slug Generation
- [ ] Implement slug generation from title
- [ ] Convert to lowercase
- [ ] Replace spaces with hyphens
- [ ] Remove special characters
- [ ] Add uniqueness check
- [ ] Allow manual editing

### Form State Management
- [ ] Use React Hook Form
- [ ] Add field-level validation
- [ ] Add form-level validation
- [ ] Preserve state across steps
- [ ] Auto-save draft (debounced)

---

## Phase 4: Collection Editor - Step 2 (1 day)

### Pathway Selector
- [ ] Create `src/components/collections/pathway-selector.tsx`
- [ ] Display all 21 pathways as checkboxes
- [ ] Group by color family (optional)
- [ ] Limit selection to 3 pathways
- [ ] Show selection count (1/3, 2/3, 3/3)
- [ ] Disable checkboxes when limit reached

### Live Gradient Preview
- [ ] Create `src/components/collections/gradient-preview.tsx`
- [ ] Show collection card preview
- [ ] Update gradient in real-time as pathways change
- [ ] Show gradient variant info (e.g., "gradient-yellow-100")
- [ ] Show gradient description (e.g., "Green → Yellow")
- [ ] Make preview match actual collection card size

### Pathway Info
- [ ] Show pathway descriptions on hover
- [ ] Show color family indicators
- [ ] Add pathway icons (optional)
- [ ] Show example jobs for each pathway

---

## Phase 5: Collection Editor - Step 3 (1-2 days)

### Job Filter Builder
- [ ] Create `src/components/collections/job-filter-builder.tsx`
- [ ] Add location type checkboxes (Onsite, Remote, Hybrid)
- [ ] Add employment type checkboxes (Full-time, Part-time, etc.)
- [ ] Add climate category multi-select
- [ ] Add green skills multi-select
- [ ] Add required certifications input

### Salary Range Input
- [ ] Create salary range slider or dual input
- [ ] Add currency selector (USD, EUR, GBP, etc.)
- [ ] Add validation (min < max)
- [ ] Format numbers with commas

### Special Filters
- [ ] Add "Include new jobs" checkbox
- [ ] Add "Include jobs closing soon" checkbox
- [ ] Add date range picker (optional)
- [ ] Add custom filters section

### Real-Time Job Count
- [ ] Create `src/hooks/use-job-count.ts`
- [ ] Debounce filter changes (500ms)
- [ ] Call `/api/collections/count-jobs` endpoint
- [ ] Show loading state
- [ ] Show error state
- [ ] Display job count prominently

### Advanced Mode
- [ ] Add JSON query editor (optional)
- [ ] Use Monaco Editor or CodeMirror
- [ ] Add syntax highlighting
- [ ] Add validation
- [ ] Show preview of generated query

### Filter Preview
- [ ] Show sample jobs matching criteria
- [ ] Display up to 5 jobs
- [ ] Add "View all matching jobs" link
- [ ] Show job titles, companies, pathways

---

## Phase 6: Collection Editor - Step 4 (1 day)

### Sponsor Form
- [ ] Create sponsor name input (optional)
- [ ] Add logo upload (drag-drop or file picker)
- [ ] Add logo URL input (alternative)
- [ ] Show logo preview
- [ ] Validate image format (PNG, JPG, SVG)
- [ ] Validate image size (max 500KB)

### Badges Builder
- [ ] Create badge input component
- [ ] Add "Add Badge" button
- [ ] Allow adding multiple badges
- [ ] Add badge label input
- [ ] Add badge variant selector (default/accent)
- [ ] Show badge preview
- [ ] Add remove button for each badge

### SEO Metadata
- [ ] Add meta title input (auto-fill from title)
- [ ] Add meta description textarea
- [ ] Add character count (160 chars recommended)
- [ ] Add Open Graph image upload
- [ ] Show preview of social card

### Visibility Options
- [ ] Add "Feature on homepage" toggle
- [ ] Add manual sort order input (optional)
- [ ] Add publish date picker (scheduled publishing)

### Final Actions
- [ ] Add "Save Draft" button
- [ ] Add "Publish" button
- [ ] Add "Preview" button (opens preview modal)
- [ ] Add confirmation dialogs
- [ ] Show success/error toasts

---

## Phase 7: Public Collections Page (1 day)

### Collections Index Page
- [ ] Create `/src/app/(public)/collections/page.tsx`
- [ ] Fetch published collections from API
- [ ] Display featured collections section
- [ ] Display all collections grid
- [ ] Add loading state (skeleton cards)
- [ ] Add error state

### Collection Grid Layout
- [ ] Use responsive grid (1 col mobile, 2 tablet, 3 desktop)
- [ ] Maintain 416px card height
- [ ] Add gap spacing (24px)
- [ ] Implement infinite scroll (optional)
- [ ] Add pagination (alternative)

### SEO Optimization
- [ ] Add page title & description
- [ ] Add Open Graph meta tags
- [ ] Add Twitter Card meta tags
- [ ] Generate sitemap for collections
- [ ] Add structured data (JSON-LD)

### Performance
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Set revalidation time (60 seconds)
- [ ] Add image optimization (Next.js Image)
- [ ] Lazy load images below fold

---

## Phase 8: Collection Detail Page (1 day)

### Collection Detail Layout
- [ ] Create `/src/app/(public)/collections/[slug]/page.tsx`
- [ ] Add hero section with gradient background
- [ ] Show collection title, description, pathways
- [ ] Show sponsor info (if present)
- [ ] Show badges (if present)

### Job Listings
- [ ] Fetch jobs matching collection criteria
- [ ] Display as list (JobPostCard components)
- [ ] Add filters (location, employment type, salary)
- [ ] Add sort options (Recent, Salary, Relevance)
- [ ] Implement pagination or infinite scroll

### Analytics Tracking
- [ ] Track page view (increment viewCount)
- [ ] Track job clicks (increment clickCount)
- [ ] Track time on page
- [ ] Track scroll depth
- [ ] Send events to analytics platform

### Related Collections
- [ ] Show "Similar collections" section
- [ ] Find collections with overlapping pathways
- [ ] Limit to 3-4 recommendations
- [ ] Display as horizontal scroll

---

## Phase 9: Analytics Dashboard (1-2 days)

### Analytics Page
- [ ] Create `/src/app/(dashboard)/collections/analytics/page.tsx`
- [ ] Add date range selector (Last 7, 30, 90 days)
- [ ] Show top performing collections table
- [ ] Show engagement trends chart (views/clicks over time)
- [ ] Show pathway popularity chart

### Metrics Cards
- [ ] Total collections count
- [ ] Total views count
- [ ] Total clicks count
- [ ] Average CTR
- [ ] Show trend indicators (↑ 12% vs last period)

### Collection Performance Table
- [ ] Show collection name, gradient preview
- [ ] Show views, clicks, CTR
- [ ] Show application count (if tracked)
- [ ] Add sort by each column
- [ ] Add export to CSV button

### Charts
- [ ] Use Recharts or Chart.js
- [ ] Line chart for views/clicks over time
- [ ] Bar chart for pathway popularity
- [ ] Pie chart for pathway distribution
- [ ] Add interactive tooltips

---

## Phase 10: Testing & Polish (1-2 days)

### Unit Tests
- [ ] Test gradient utility functions
- [ ] Test pathway-to-family mapping
- [ ] Test order normalization
- [ ] Test filter criteria validation
- [ ] Test slug generation

### Integration Tests
- [ ] Test collection CRUD endpoints
- [ ] Test job count endpoint
- [ ] Test publish/archive workflows
- [ ] Test real-time job count updates
- [ ] Test gradient preview updates

### E2E Tests (Optional)
- [ ] Test full collection creation flow
- [ ] Test pathway selection and preview
- [ ] Test job filtering and count
- [ ] Test publishing collection
- [ ] Test viewing published collection

### Visual Regression Tests (Optional)
- [ ] Snapshot collection cards with different gradients
- [ ] Snapshot all pathway combinations
- [ ] Snapshot editor steps
- [ ] Use Percy or Chromatic

### Manual Testing Checklist
- [ ] Create collection (all steps)
- [ ] Edit existing collection
- [ ] Publish collection
- [ ] Archive collection
- [ ] Delete collection
- [ ] View published collection (public)
- [ ] Apply to job from collection
- [ ] Check analytics updates
- [ ] Test on mobile devices
- [ ] Test in different browsers

### Accessibility Testing
- [ ] Run aXe DevTools scan
- [ ] Test keyboard navigation
- [ ] Test screen reader (NVDA/JAWS)
- [ ] Check color contrast (WCAG AA)
- [ ] Test with keyboard only
- [ ] Test focus indicators

### Performance Testing
- [ ] Lighthouse audit (score >90)
- [ ] Check bundle size
- [ ] Test with slow 3G network
- [ ] Check Time to Interactive (TTI)
- [ ] Optimize images
- [ ] Add loading states

---

## Phase 11: Documentation (1 day)

### User Documentation
- [ ] Write admin guide: "Creating Collections"
- [ ] Write admin guide: "Managing Collections"
- [ ] Create video tutorial (optional)
- [ ] Add tooltips in UI
- [ ] Create FAQ page

### Developer Documentation
- [ ] Document API endpoints (Swagger/OpenAPI)
- [ ] Document gradient system usage
- [ ] Add code examples
- [ ] Update README.md
- [ ] Add inline code comments

### Design System Documentation
- [ ] Create Collection Card component page
- [ ] Document all props with examples
- [ ] Show all gradient variations
- [ ] Add usage guidelines
- [ ] Add accessibility notes

---

## Phase 12: Launch Preparation (1 day)

### Seed Production Data
- [ ] Create 10-15 curated collections
- [ ] Review titles and descriptions
- [ ] Verify gradients look good
- [ ] Add sponsor logos (if applicable)
- [ ] Set featured flags

### Marketing Assets
- [ ] Create announcement blog post
- [ ] Design social media graphics
- [ ] Prepare email announcement
- [ ] Create demo video (optional)

### Monitoring & Alerts
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Plausible/PostHog)
- [ ] Add logging for key actions
- [ ] Set up uptime monitoring
- [ ] Configure alerts (Slack/email)

### Launch Checklist
- [ ] Deploy to staging environment
- [ ] QA testing on staging
- [ ] Load testing (if expecting high traffic)
- [ ] Database backup
- [ ] Deploy to production
- [ ] Smoke test on production
- [ ] Monitor error rates
- [ ] Monitor performance metrics

### Post-Launch
- [ ] Send announcement email
- [ ] Post on social media
- [ ] Update documentation site
- [ ] Monitor user feedback
- [ ] Iterate based on feedback

---

## Success Metrics (Track for 30 days)

### Engagement
- [ ] Collections created (target: 10+)
- [ ] Collections published (target: 5+)
- [ ] Collection views (target: 1,000+)
- [ ] Collection clicks (target: 300+)
- [ ] Average CTR (target: 30%+)

### Quality
- [ ] Collections with valid pathways (target: 100%)
- [ ] Collections with descriptions (target: 80%+)
- [ ] Featured collections (target: 3-5)
- [ ] Sponsored collections (target: 1+)

### User Satisfaction
- [ ] Admin feedback survey (target: 4/5 stars)
- [ ] Job seeker feedback (target: positive)
- [ ] No critical bugs reported
- [ ] Page load time <3s

---

## Future Enhancements (Backlog)

### Phase 2 Features
- [ ] A/B testing for gradients
- [ ] AI-generated collection descriptions
- [ ] Bulk import collections (CSV)
- [ ] Collection templates
- [ ] Duplicate collection feature
- [ ] Collection versioning/history

### Phase 3 Features
- [ ] Personalized collections per user
- [ ] Collection subscriptions (email alerts)
- [ ] Social sharing buttons
- [ ] Collection recommendations engine
- [ ] Seasonal collections (auto-create)
- [ ] Employer-curated collections

### Advanced Analytics
- [ ] Heatmaps for collection pages
- [ ] Funnel analysis (view → click → apply)
- [ ] Pathway affinity analysis
- [ ] Collection A/B testing
- [ ] Predictive job suggestions

---

## Notes & Tips

### Development Tips
- Use feature flags for gradual rollout
- Keep collection editor state in localStorage (auto-save drafts)
- Debounce real-time job count API calls (500ms)
- Cache job count results (60s)
- Use optimistic UI updates for publish/archive

### Common Pitfalls
- Don't fetch all jobs on every filter change (use count endpoint)
- Don't allow empty pathways array (requires at least 1)
- Don't forget to validate slug uniqueness
- Don't skip loading states (UX suffers)
- Don't forget mobile responsive design

### Performance Optimizations
- Use ISR for public collections page
- Lazy load collection cards below fold
- Optimize gradient preview (use CSS only, no canvas)
- Cache gradient calculations
- Use Next.js Image for sponsor logos

---

**Estimated Total Time: 10-14 days (2 weeks)**

**Priority Order:**
1. Database & API (Phase 1)
2. Collection Editor (Phases 3-6)
3. Public Pages (Phases 7-8)
4. Analytics (Phase 9)
5. Testing & Launch (Phases 10-12)
