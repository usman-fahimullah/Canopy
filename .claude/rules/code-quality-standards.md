# Code Quality Standards

---

## trigger: always

This rule establishes the production-readiness standards for the Canopy codebase. Every piece of code written must meet these quality gates before being considered complete.

Related rules: `pre-merge-checklist.md` for PR review process, `scale-first-engineering.md` for architecture patterns.

---

## Philosophy

> **Foundational rule:** `engineering-excellence.md` — Build it right the first time.

Clean, production-ready code is not an afterthought — it's built into every line we write. There is no "rough draft" phase of code that ships. Every commit should be something you'd be proud to walk another engineer through, line by line.

We don't write code that "works for now." We write code that works, period — under load, in error conditions, with malicious input, on slow networks, in dark mode, and six months from now when someone else has to maintain it.

We prioritize:

1. **Security First** — Authorization checks before business logic. No exceptions, no TODOs.
2. **Type Safety** — No `any` types, strict TypeScript enforcement. The type system is a gift, not an obstacle.
3. **Testability** — Code written with testing in mind. If it's hard to test, it's probably wrong.
4. **Observability** — Structured logging, not console statements. Production debugging is a first-class concern.
5. **User Experience** — Every state handled (loading, empty, error, success). Users notice the rough edges we skip.

---

## Mandatory Standards

### 1. Authorization on Every API Route

Every API route handler MUST validate authorization before processing requests.

```typescript
// ❌ WRONG - No authorization check
export async function POST(request: Request) {
  const data = await request.json();
  // Directly processing without auth check
  return Response.json(await createResource(data));
}

// ✅ CORRECT - Authorization validated first
export async function POST(request: Request) {
  const user = await getServerUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For admin routes, verify role
  const member = await prisma.organizationMember.findFirst({
    where: { accountId: user.id, role: { in: ["OWNER", "ADMIN"] } },
  });
  if (!member) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await request.json();
  return Response.json(await createResource(data, member.organizationId));
}
```

**Hard Rule:** Never leave `// TODO: add proper admin check` in code. Implement it or don't merge.

---

### 2. Input Validation with Zod

All API endpoints MUST validate input using Zod schemas before processing.

```typescript
// ❌ WRONG - No validation
export async function POST(request: Request) {
  const { email, name } = await request.json();
  // Trusting client input directly
}

// ✅ CORRECT - Zod validation
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(["MEMBER", "ADMIN"]).optional().default("MEMBER"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = CreateUserSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { email, name, role } = result.data;
  // Now safely use validated data
}
```

---

### 3. No Console Logging in Production Code

Replace all `console.log`, `console.error`, etc. with structured logging.

```typescript
// ❌ WRONG - Console logging
console.log("User created:", userId);
console.error("Failed to create user:", error);

// ✅ CORRECT - Structured logging (using lib/logger.ts)
import { logger } from "@/lib/logger";

logger.info("User created", { userId, organizationId });
logger.error("Failed to create user", { error: error.message, userId });
```

**Implementation:** Create `/src/lib/logger.ts` with appropriate log levels and context.

---

### 4. Multi-Tenant Data Scoping

Every database query MUST include organization scoping to prevent data leakage.

```typescript
// ❌ WRONG - Missing organization scope
const jobs = await prisma.job.findMany({
  where: { status: "ACTIVE" },
});

// ✅ CORRECT - Organization-scoped query
const jobs = await prisma.job.findMany({
  where: {
    organizationId: member.organizationId,
    status: "ACTIVE",
  },
});
```

**Exception:** Public endpoints (job listings, coach profiles) may omit org scoping but must be explicitly marked.

---

### 5. Complete UI States

Every data-fetching component MUST handle all states:

| State   | Required | Implementation                       |
| ------- | -------- | ------------------------------------ |
| Loading | Yes      | Skeleton or spinner while fetching   |
| Empty   | Yes      | Helpful message with action CTA      |
| Error   | Yes      | User-friendly message + retry option |
| Success | Yes      | Render the data                      |

```tsx
// ❌ WRONG - Only handles success state
function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then(setJobs);
  }, []);

  return jobs.map((job) => <JobCard key={job.id} {...job} />);
}

// ✅ CORRECT - All states handled
function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load jobs");
        return r.json();
      })
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <JobsListSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (jobs.length === 0) return <EmptyState title="No jobs yet" action={<CreateJobButton />} />;

  return jobs.map((job) => <JobCard key={job.id} {...job} />);
}
```

---

### 6. TypeScript Strict Compliance

Never bypass TypeScript safety:

```typescript
// ❌ FORBIDDEN - Using 'any'
const data: any = await response.json();
function handleEvent(event: any) {}

// ❌ FORBIDDEN - Non-null assertion without validation
const user = getUser()!;
const email = user.profile!.email!;

// ✅ CORRECT - Proper typing
interface ApiResponse<T> {
  data: T;
  error?: string;
}
const response: ApiResponse<User> = await response.json();

// ✅ CORRECT - Null checks
const user = getUser();
if (!user?.profile?.email) {
  throw new Error("User email required");
}
const email = user.profile.email;
```

---

### 7. Test Coverage Requirements

All new code MUST include tests:

| Code Type         | Required Tests    | Minimum Coverage         |
| ----------------- | ----------------- | ------------------------ |
| API Routes        | Integration tests | 100% of endpoints        |
| Utility Functions | Unit tests        | 80% line coverage        |
| UI Components     | Component tests   | Critical paths           |
| User Flows        | E2E tests         | Happy path + error cases |

```typescript
// Example: API route test
describe("POST /api/jobs", () => {
  it("requires authentication", async () => {
    const res = await POST(new Request("/api/jobs", { method: "POST" }));
    expect(res.status).toBe(401);
  });

  it("validates required fields", async () => {
    const res = await POST(
      authenticatedRequest({ title: "" }) // Missing required fields
    );
    expect(res.status).toBe(400);
  });

  it("creates job for authorized user", async () => {
    const res = await POST(authenticatedRequest({ title: "Engineer", description: "..." }));
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ title: "Engineer" });
  });
});
```

---

## Anti-Patterns (Hard Rules)

### Never Commit These

These are not guidelines. These are non-negotiable. Every one of these patterns represents a decision to ship something you know is wrong. That's not speed — it's debt with interest.

| Anti-Pattern                      | Why It's Blocked        | The Craftsman Fix                                                  |
| --------------------------------- | ----------------------- | ------------------------------------------------------------------ |
| `// TODO: add proper admin check` | Security vulnerability  | Write the auth check. It's 5 lines.                                |
| `console.log(...)`                | Information leakage     | Use the structured logger. That's why it exists.                   |
| `: any` type annotation           | Type safety bypass      | Define the interface. Future-you will be grateful.                 |
| `catch (e) { }` empty catch       | Silent failures         | Handle the error or let it propagate. Silence is never the answer. |
| Unvalidated request body          | Injection vulnerability | Add the Zod schema. Trusting input is not an option.               |
| Missing organizationId in queries | Data leakage            | Scope the query. Multi-tenancy is not optional.                    |
| No loading state on async UI      | Poor UX                 | Add the skeleton. Your users aren't on localhost.                  |

---

## Pre-Completion Checklist

Before marking any task complete, verify:

### Security

- [ ] Authorization check at route level
- [ ] Input validation with Zod schema
- [ ] Organization scoping on all queries
- [ ] No sensitive data in logs or responses

### Code Quality

- [ ] No `any` types
- [ ] No console.log statements
- [ ] All TODO comments resolved
- [ ] Error messages are user-friendly

### User Experience

- [ ] Loading state implemented
- [ ] Empty state with helpful CTA
- [ ] Error state with retry option
- [ ] Proper TypeScript types for all data

### Testing

- [ ] Unit tests for utility functions
- [ ] Integration tests for API routes
- [ ] Component tests for UI logic

---

## Related Infrastructure

### Recommended Logger Implementation

Create `/src/lib/logger.ts`:

```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  organizationId?: string;
  requestId?: string;
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === "production";

function log(level: LogLevel, message: string, context?: LogContext) {
  if (level === "debug" && isProduction) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  // In production, send to logging service
  // In development, pretty print
  if (isProduction) {
    console[level === "error" ? "error" : "log"](JSON.stringify(entry));
  } else {
    console[level](message, context);
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log("debug", msg, ctx),
  info: (msg: string, ctx?: LogContext) => log("info", msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log("warn", msg, ctx),
  error: (msg: string, ctx?: LogContext) => log("error", msg, ctx),
};
```

---

## Enforcement

These standards are enforced through:

1. **ESLint** - Blocks console.log, requires explicit types
2. **TypeScript** - Strict mode catches type issues
3. **Pre-commit hooks** - Husky runs lint and type-check
4. **Code review** - Reviewers use `pre-merge-checklist.md`
5. **CI Pipeline** - Tests must pass before merge

Violations should be caught at the earliest possible stage, ideally before code leaves the developer's machine.

**The best time to fix a quality issue is when you're writing the code. The second best time is never — because it means you wrote it right the first time.**
