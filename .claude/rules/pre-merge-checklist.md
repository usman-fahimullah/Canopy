# Pre-Merge Checklist

---

## trigger: pr, pull request, review, merge, code review, ready for review

This rule defines the quality gates that must pass before any code is merged. Use this checklist when reviewing PRs or preparing your own code for review.

Related rules: `code-quality-standards.md` for detailed standards, `scale-first-engineering.md` for architecture patterns.

---

## Philosophy

> **Foundational rule:** `engineering-excellence.md` — Build it right the first time.

Every merge is a permanent commitment to production quality. Once code enters main, it becomes the standard — other code will be written to match it, for better or worse. This is why every merge must represent our best work, not our fastest work.

We treat code review as a collaborative quality assurance process, not a gatekeeping exercise. The goal is shipping code we're proud of — code that raises the floor, not lowers it.

---

## Quick Reference Checklist

Copy this checklist into PR descriptions:

```markdown
## Pre-Merge Checklist

### Security

- [ ] Auth check on all new/modified API routes
- [ ] Input validated with Zod schema
- [ ] Organization scoping on database queries
- [ ] No secrets or sensitive data exposed

### Code Quality

- [ ] No `any` types or type assertions without validation
- [ ] No console.log (use structured logger)
- [ ] All TODO comments addressed or tracked in issues
- [ ] Error handling with user-friendly messages

### Testing

- [ ] Tests added for new functionality
- [ ] Existing tests still pass
- [ ] Edge cases covered (empty, error, boundary)

### User Experience

- [ ] Loading states implemented
- [ ] Empty states with helpful CTAs
- [ ] Error states with recovery options
- [ ] Responsive design verified

### Documentation

- [ ] Code comments for complex logic
- [ ] API changes documented
- [ ] Design system docs updated (if component changes)
```

---

## Detailed Review Guide

### 1. Security Review

**Authorization Checks**

For every API route touched, verify:

| Check            | Look For                                      |
| ---------------- | --------------------------------------------- |
| Authentication   | `getServerUser()` called and null-checked     |
| Authorization    | Role/permission verified for protected routes |
| Org Scoping      | `organizationId` in all database queries      |
| Input Validation | Zod schema with `safeParse`                   |

**Red Flags to Block:**

```typescript
// 🚫 BLOCK: No auth check
export async function POST(req: Request) {
  const data = await req.json();
  return createSomething(data); // Who is creating this?
}

// 🚫 BLOCK: TODO for security
// TODO: add proper admin check
const isAdmin = true; // Placeholder

// 🚫 BLOCK: Missing org scope
const allJobs = await prisma.job.findMany(); // Leaks all orgs' data
```

---

### 2. Type Safety Review

**Forbidden Patterns:**

| Pattern                | Why Blocked          | Fix                     |
| ---------------------- | -------------------- | ----------------------- |
| `any`                  | Bypasses type system | Define proper interface |
| `as unknown as X`      | Dangerous cast       | Validate and narrow     |
| `!` non-null assertion | Runtime crash risk   | Check for null          |
| `@ts-ignore`           | Hides errors         | Fix the type issue      |
| `@ts-expect-error`     | Hides errors         | Fix the type issue      |

**Acceptable Exceptions:**

```typescript
// ✅ OK - Validated before assertion
const parsed = schema.safeParse(data);
if (parsed.success) {
  const validData = parsed.data; // Type is inferred correctly
}

// ✅ OK - Type guard narrows safely
function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "id" in obj;
}
```

---

### 3. Error Handling Review

**Required Error Handling:**

```typescript
// ✅ API Route Pattern
export async function POST(request: Request) {
  try {
    // ... logic
  } catch (error) {
    logger.error("Operation failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/api/resource",
    });
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
```

**Blocked Patterns:**

```typescript
// 🚫 BLOCK: Empty catch
catch (e) { }

// 🚫 BLOCK: Console logging errors
catch (e) { console.error(e); }

// 🚫 BLOCK: Exposing internal errors
catch (e) { return Response.json({ error: e.message }); }
```

---

### 4. UI/UX Review

**State Coverage Matrix:**

Every data-fetching component must handle:

| State   | Implementation         | Verified |
| ------- | ---------------------- | -------- |
| Loading | Skeleton or spinner    | [ ]      |
| Empty   | Message + action CTA   | [ ]      |
| Error   | Message + retry button | [ ]      |
| Success | Render data properly   | [ ]      |

**Accessibility Baseline:**

- [ ] Interactive elements are keyboard accessible
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator of state
- [ ] Focus states are visible

---

### 5. Testing Review

**Test Coverage Requirements:**

| Change Type          | Required Tests                                             |
| -------------------- | ---------------------------------------------------------- |
| New API route        | Integration test covering auth, validation, success, error |
| New utility function | Unit tests with edge cases                                 |
| New UI component     | Component test for critical interactions                   |
| Bug fix              | Regression test proving the fix                            |

**Test Quality Checks:**

- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests cover edge cases (null, empty, max values)
- [ ] Tests have descriptive names explaining the behavior

---

### 6. Performance Review

**Watch For:**

| Issue              | Check                                               |
| ------------------ | --------------------------------------------------- |
| N+1 queries        | Use `include` in Prisma instead of separate queries |
| Unbounded queries  | Ensure `take` limit on all `findMany`               |
| Missing pagination | List endpoints must support page/limit              |
| Large payloads     | Only return needed fields with `select`             |

```typescript
// ❌ N+1 Problem
const jobs = await prisma.job.findMany();
for (const job of jobs) {
  const org = await prisma.organization.findUnique({ where: { id: job.orgId } });
}

// ✅ Single query with include
const jobs = await prisma.job.findMany({
  include: { organization: true },
  take: 50, // Always limit
});
```

---

## Reviewer Responsibilities

### Before Approving

1. **Run the code locally** if UI changes are involved
2. **Check the test output** in CI
3. **Verify no regressions** in related functionality
4. **Confirm documentation** is updated if needed

### When Requesting Changes

- Be specific about what needs to change
- Explain why (link to this rule if needed)
- Offer suggestions, not just criticism
- Differentiate blockers from nice-to-haves

### Approval Criteria

- [ ] All checklist items verified
- [ ] CI pipeline passes (lint, type-check, tests)
- [ ] No unresolved conversations
- [ ] Changes match the PR description

---

## PR Description Template

```markdown
## Summary

[1-2 sentence description of what this PR does]

## Changes

- [Bullet points of specific changes]

## Testing

- [How was this tested?]
- [What scenarios were verified?]

## Screenshots (if UI changes)

[Before/after screenshots]

## Pre-Merge Checklist

[Copy checklist from above]
```

---

## Escalation Path

If you're unsure about approving:

1. **Ask questions** in PR comments
2. **Request a second reviewer** for complex changes
3. **Pair review** on security-sensitive code
4. **Flag to tech lead** if architectural concerns

Never approve if you have unresolved concerns. It's better to delay a merge than ship a bug. **Urgency is not an excuse for poor quality.** The time we "save" by merging questionable code is always paid back with interest — in bug reports, in regressions, in lost user trust.
