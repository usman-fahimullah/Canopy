# Scale-First Engineering

---

## trigger: always

## Philosophy

> **Foundational rule:** `engineering-excellence.md` — Build it right the first time.

Canopy is a multi-tenant SaaS product. Every implementation decision
should consider the 100-organization case, not the 1-organization case.
Prefer the architecturally sound solution over the quick patch.

**This rule overrides any default guidance to "avoid over-engineering"
or "keep things minimal." Canopy is building for production scale.**

A feature that works for one organization but collapses at ten is not
a feature — it's a demo. We don't ship demos. We ship software that
works under real-world pressure, because that's what our users are
trusting us to build. The extra five minutes to add pagination, scope
a query, or validate an input is not overhead — it's the job.

---

## Decision Framework

Before implementing, ask: "Will this approach still work cleanly when
there are 100 orgs, 10K jobs, and 100K candidates?" If the answer is
no, choose the path that does — even if it takes more code now.

### Prefer | Over

------------------------------------------|------------------------------------------
Server Components with streaming | Client-side fetching for list pages
Database-level pagination + filtering | Loading all records and filtering in JS
Prisma `select` with only needed fields | `findMany` returning full models
Indexed queries with `where` clauses | Fetching all + `Array.filter`
`Promise.all` for independent queries | Sequential awaits
Reusable service functions in `/lib/` | Inline query logic in route handlers
Zod validation at API boundaries | Trusting input shapes
Proper error boundaries per route | Single top-level catch-all
Multi-tenant `where` clauses on every query | Assuming single-tenant context
Connection pooling (Prisma + pgbouncer) | Default connection behavior

---

## Database & Query Rules

1. **Always scope by organizationId** — Every query that touches
   tenant data must include `where: { organizationId }`. No exceptions.
2. **Paginate by default** — Any list endpoint must accept `skip`/`take`
   or cursor-based pagination. Never return unbounded result sets.
3. **Select only what you need** — Use Prisma `select` or `include`
   with specific fields. Don't load full relation trees.
4. **Add indexes for filter/sort columns** — If a column appears in
   `where` or `orderBy`, it needs a database index.
5. **Use transactions for multi-step writes** — `prisma.$transaction()`
   for any operation that touches multiple tables.
6. **No N+1 queries** — If you're querying inside a loop, restructure
   to use `include`, `in`, or a join. Use Prisma's `include` for
   related data rather than fetching in a map/forEach.

---

## API & Route Handler Rules

1. **Validate all inputs with Zod** — Parse request bodies, query
   params, and route params at the handler boundary. Use schemas from
   `/src/lib/validators/`.
2. **Return consistent response shapes** — `{ data, meta, error }`
   pattern for all endpoints. `meta` includes pagination info.
3. **Use proper HTTP status codes** — 201 for creates, 204 for
   deletes, 422 for validation errors. Not 200 for everything.
4. **Rate-limit expensive operations** — AI calls, bulk exports,
   and search endpoints need rate limiting from day one.
5. **Handle errors at the boundary** — Every route handler should
   have structured error handling. Don't let unhandled rejections
   bubble to the framework.

```typescript
// ✅ CORRECT — structured API handler
export async function GET(req: NextRequest) {
  try {
    const { organizationId } = await getAuth(req);
    const params = searchParamsSchema.parse(Object.fromEntries(req.nextUrl.searchParams));

    const [data, total] = await Promise.all([
      prisma.job.findMany({
        where: { organizationId, status: params.status },
        select: { id: true, title: true, status: true, createdAt: true },
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count({ where: { organizationId, status: params.status } }),
    ]);

    return NextResponse.json({
      data,
      meta: { total, skip: params.skip, take: params.take },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ❌ WRONG — no validation, no pagination, no error handling
export async function GET(req: NextRequest) {
  const jobs = await prisma.job.findMany();
  return NextResponse.json(jobs);
}
```

---

## Component & Frontend Rules

1. **Separate data fetching from presentation** — Server Components
   fetch data, Client Components render interactivity. Don't mix.
2. **Use `Suspense` boundaries** — Wrap async Server Components so
   partial loading is possible. Provide skeleton fallbacks.
3. **Memoize expensive computations** — `useMemo` for derived state,
   `useCallback` for handlers passed as props to lists.
4. **Virtualize long lists** — Any list that could exceed ~50 items
   should use virtualization (e.g., `@tanstack/react-virtual`).
5. **Debounce user input** — Search fields, filters, and auto-save
   must debounce (300ms minimum).
6. **Use design system components** — Never bypass the component
   library. See `design-first-implementation.md` for details.

```typescript
// ✅ CORRECT — Server Component fetches, Client Component renders
// app/jobs/page.tsx (Server Component)
export default async function JobsPage({ searchParams }) {
  const params = jobsSearchSchema.parse(searchParams);
  const { data, meta } = await getJobs(params);
  return (
    <Suspense fallback={<JobsListSkeleton />}>
      <JobsList initialData={data} meta={meta} />
    </Suspense>
  );
}

// ❌ WRONG — Client Component doing its own fetching
'use client';
export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(setJobs);
  }, []);
  return <div>{jobs.map(...)}</div>;
}
```

---

## State Management Rules

1. **URL state for filters/pagination** — Use `searchParams` so views
   are shareable and the back button works correctly.
2. **Server state via React Query or SWR** — Don't hand-roll caching
   for API data. Let a library handle revalidation and stale data.
3. **Local state stays local** — `useState` for UI-only state
   (modals open, form dirty state). Don't lift prematurely.
4. **Optimistic updates for drag-and-drop** — Kanban board moves
   should update the UI immediately, then sync with the server.

---

## Error Handling Rules

1. **Every page needs an error boundary** — Use Next.js `error.tsx`
   files at appropriate route segment levels.
2. **Every async operation needs error handling** — Server Actions,
   API calls, and database queries must handle failures.
3. **Show actionable error messages** — Not "Something went wrong."
   Instead: "Failed to move candidate. Check your connection and try again."
4. **Loading states are mandatory** — Every data-dependent view needs
   a loading state. Use `<Suspense>` with `<Skeleton>` fallbacks.
5. **Empty states are mandatory** — Every list view needs an empty
   state component. Use `<EmptyState>` variants from the design system.

---

## What This Does NOT Mean

Craftsmanship is not over-engineering. Know the difference:

- Don't add abstraction layers for things with one usage.
  Wait for the second or third use case, then extract.
- Don't add caching infrastructure before there's a measured
  performance problem. But DO write code that's cache-friendly.
- Don't build admin tooling or config systems speculatively.
  But DO use environment variables and constants that make
  future configuration straightforward.
- Don't add speculative features nobody asked for.
  But DO build requested features in a way that scales.

**The line:** Build what's asked for, build it to last, and don't
build what isn't asked for. Quality is doing the right things right —
not doing unnecessary things.

---

## Review Checklist

Before completing any feature, every item must pass. No exceptions, no "I'll fix it later":

- [ ] Queries are scoped by `organizationId`
- [ ] Lists are paginated (no unbounded result sets)
- [ ] Inputs are validated with Zod at API boundaries
- [ ] No N+1 query patterns (no queries inside loops)
- [ ] Server Components used where possible
- [ ] Error states handled (not just happy path)
- [ ] Loading states exist (Suspense or Skeleton)
- [ ] Empty states exist (EmptyState component)
- [ ] URL state used for filters/pagination
- [ ] Would this work with 10x the current data volume?

**If you can't check every box, the feature is not done.** A partially-complete feature with technical debt is worse than a well-built feature that took longer. We build it right or we don't ship it.
