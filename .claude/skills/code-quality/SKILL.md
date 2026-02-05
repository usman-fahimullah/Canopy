---
name: code-quality
description: Code quality standards for Canopy. Use when creating API routes, endpoints, implementing validation, authorization, error handling, logging, or working with TypeScript. Covers security, type safety, testing, and best practices.
---

# Code Quality Skill

## Purpose

Ensure consistent code quality across the Canopy codebase with standards for security, type safety, logging, testing, and best practices.

## When to Use This Skill

Automatically activates when:

- Creating or modifying API routes
- Implementing validation (Zod)
- Adding authorization checks
- Setting up error handling
- Working with logging
- Writing TypeScript code

---

## Core Standards

### 1. Authorization - Every Route Must Check Auth

```typescript
// ✅ CORRECT
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... rest of handler
}

// ❌ WRONG - No auth check
export async function GET() {
  const data = await prisma.user.findMany();
  return NextResponse.json(data);
}
```

### 2. Validation - Zod Schemas on All Inputs

```typescript
// ✅ CORRECT
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.issues },
      { status: 400 }
    );
  }
  // Use result.data (typed!)
}

// ❌ WRONG - No validation
export async function POST(request: NextRequest) {
  const { email, name } = await request.json();
  // Using unvalidated input
}
```

### 3. Logging - Use logger, Not console

```typescript
// ✅ CORRECT
import { logger } from "@/lib/logger";

logger.info("User created", { userId: user.id });
logger.error("Failed to create user", { error, email });

// ❌ WRONG
console.log("User created");
console.error("Error:", error);
```

### 4. Type Safety - No `any`

```typescript
// ✅ CORRECT
interface User {
  id: string;
  email: string;
  name: string;
}

function processUser(user: User) { ... }

// ❌ WRONG
function processUser(user: any) { ... }
```

### 5. Loading States - All Data Fetching Needs States

```tsx
// ✅ CORRECT
function UserList() {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.length) return <EmptyState />;

  return <List items={data} />;
}

// ❌ WRONG - No loading/error/empty states
function UserList() {
  const { data } = useQuery(...);
  return <List items={data} />;
}
```

### 6. Error Handling - Proper Try/Catch

```typescript
// ✅ CORRECT
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Failed to fetch data", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ❌ WRONG - No error handling
export async function GET() {
  const data = await fetchData(); // Could throw!
  return NextResponse.json(data);
}
```

---

## API Route Template

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  // Define your schema
});

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate input
    const body = await request.json();
    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }

    // 3. Business logic
    const data = await prisma.resource.create({
      data: result.data,
    });

    // 4. Log success
    logger.info("Resource created", { id: data.id, userId: session.user.id });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error("Failed to create resource", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## Quick Checklist

Before committing API code:

- [ ] Auth check at start of handler
- [ ] Zod validation on all inputs
- [ ] Using `logger` not `console`
- [ ] No `any` types
- [ ] Try/catch with proper error responses
- [ ] Loading/error/empty states in UI
- [ ] TypeScript strict mode passes
- [ ] Tests for new functionality

---

## Resource Files

### [validation-patterns.md](resources/validation-patterns.md)

Common Zod schemas and validation patterns.

### [error-handling.md](resources/error-handling.md)

Error handling patterns and custom error classes.

### [testing-guide.md](resources/testing-guide.md)

Testing patterns for API routes and components.

---

## Related Commands

- `/code-review` - Review uncommitted changes
- `/quality-scan` - Full codebase audit
- `/fix-quality all` - Auto-fix issues

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 200 lines ✅
**Progressive Disclosure**: 3 resource files ✅
