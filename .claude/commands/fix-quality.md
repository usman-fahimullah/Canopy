# Fix Quality Issues

Automatically fix common code quality issues identified by /quality-scan or /code-review.

## Usage

```
/fix-quality console            # Replace console.log with logger
/fix-quality auth               # Add missing authorization checks
/fix-quality loading-states     # Add loading/error/empty states
/fix-quality validation         # Add Zod validation to API routes
/fix-quality all                # Fix all auto-fixable issues
```

## Instructions

### Console Log Replacement

When `console` argument is provided:

1. **Check if logger exists:**
   ```bash
   ls src/lib/logger.ts 2>/dev/null
   ```

2. **If logger doesn't exist, create it:**
   ```typescript
   // src/lib/logger.ts
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

     if (isProduction) {
       // In production, output structured JSON
       const output = JSON.stringify(entry);
       if (level === "error") {
         process.stderr.write(output + "\n");
       } else {
         process.stdout.write(output + "\n");
       }
     } else {
       // In development, pretty print
       const prefix = `[${level.toUpperCase()}]`;
       if (context && Object.keys(context).length > 0) {
         console[level === "error" ? "error" : "log"](prefix, message, context);
       } else {
         console[level === "error" ? "error" : "log"](prefix, message);
       }
     }
   }

   export const logger = {
     debug: (msg: string, ctx?: LogContext) => log("debug", msg, ctx),
     info: (msg: string, ctx?: LogContext) => log("info", msg, ctx),
     warn: (msg: string, ctx?: LogContext) => log("warn", msg, ctx),
     error: (msg: string, ctx?: LogContext) => log("error", msg, ctx),
   };
   ```

3. **Find and replace console statements:**
   ```bash
   grep -rln "console\." --include="*.ts" --include="*.tsx" src/
   ```

4. **For each file, apply transformations:**
   - `console.log("message")` → `logger.info("message")`
   - `console.error("error", error)` → `logger.error("error", { error: error.message })`
   - `console.warn("warning")` → `logger.warn("warning")`
   - `console.debug("debug")` → `logger.debug("debug")`

5. **Add import to each file:**
   ```typescript
   import { logger } from "@/lib/logger";
   ```

---

### Authorization Fixes

When `auth` argument is provided:

1. **Find routes without auth:**
   ```bash
   grep -L "getServerUser" src/app/api/**/route.ts
   ```

2. **For each route, add auth wrapper:**

   **Before:**
   ```typescript
   export async function POST(request: Request) {
     const body = await request.json();
     // ... logic
   }
   ```

   **After:**
   ```typescript
   import { getServerUser } from "@/lib/supabase/server";

   export async function POST(request: Request) {
     const user = await getServerUser();
     if (!user) {
       return Response.json({ error: "Unauthorized" }, { status: 401 });
     }

     const body = await request.json();
     // ... logic
   }
   ```

3. **For admin routes (in /api/admin/), add role check:**
   ```typescript
   import { getServerUser } from "@/lib/supabase/server";
   import { prisma } from "@/lib/db";

   export async function POST(request: Request) {
     const user = await getServerUser();
     if (!user) {
       return Response.json({ error: "Unauthorized" }, { status: 401 });
     }

     const member = await prisma.organizationMember.findFirst({
       where: {
         accountId: user.id,
         role: { in: ["OWNER", "ADMIN"] },
       },
     });

     if (!member) {
       return Response.json({ error: "Forbidden" }, { status: 403 });
     }

     const body = await request.json();
     // ... logic with member.organizationId
   }
   ```

---

### Loading States

When `loading-states` argument is provided:

1. **Find components with useEffect data fetching:**
   ```bash
   grep -rln "useEffect.*fetch\|useState.*\[\]" --include="*.tsx" src/
   ```

2. **For each component, ensure states exist:**

   **Check for:**
   - `isLoading` or `loading` state
   - `error` state
   - Conditional rendering for all states

3. **Add missing states:**

   **Before:**
   ```tsx
   function DataList() {
     const [data, setData] = useState([]);

     useEffect(() => {
       fetch("/api/data").then(r => r.json()).then(setData);
     }, []);

     return data.map(item => <Item key={item.id} {...item} />);
   }
   ```

   **After:**
   ```tsx
   function DataList() {
     const [data, setData] = useState<DataItem[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       fetch("/api/data")
         .then(r => {
           if (!r.ok) throw new Error("Failed to load data");
           return r.json();
         })
         .then(setData)
         .catch(e => setError(e.message))
         .finally(() => setIsLoading(false));
     }, []);

     if (isLoading) {
       return <DataListSkeleton />;
     }

     if (error) {
       return (
         <ErrorState
           message={error}
           onRetry={() => window.location.reload()}
         />
       );
     }

     if (data.length === 0) {
       return (
         <EmptyState
           title="No data yet"
           description="Get started by adding your first item."
           action={<Button>Add Item</Button>}
         />
       );
     }

     return data.map(item => <Item key={item.id} {...item} />);
   }
   ```

---

### Input Validation

When `validation` argument is provided:

1. **Find routes without Zod:**
   ```bash
   grep -L "z\." src/app/api/**/route.ts | head -20
   ```

2. **Analyze the request body usage to infer schema:**
   ```typescript
   // Look for patterns like:
   const { email, name, role } = await request.json();
   ```

3. **Generate appropriate Zod schema:**
   ```typescript
   import { z } from "zod";

   const RequestSchema = z.object({
     email: z.string().email(),
     name: z.string().min(1).max(100),
     role: z.enum(["MEMBER", "ADMIN"]).optional(),
   });

   export async function POST(request: Request) {
     const body = await request.json();
     const result = RequestSchema.safeParse(body);

     if (!result.success) {
       return Response.json(
         { error: "Validation failed", details: result.error.flatten() },
         { status: 400 }
       );
     }

     const { email, name, role } = result.data;
     // ... rest of logic
   }
   ```

---

## Safety Guidelines

1. **Always show changes before applying:**
   - Present a diff of proposed changes
   - Ask for confirmation before modifying files

2. **Create backup branch:**
   ```bash
   git checkout -b fix/quality-$(date +%Y%m%d)
   ```

3. **Run tests after fixes:**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test # if available
   ```

4. **Commit incrementally:**
   - Group related fixes into logical commits
   - Use descriptive commit messages

## Example Session

```
User: /fix-quality console

Claude: I found 47 console statements across 12 files. Here's the plan:

1. Create src/lib/logger.ts (logger utility)
2. Update 12 files to use logger instead of console

Files to modify:
- src/app/api/jobs/route.ts (5 console statements)
- src/app/api/coaches/route.ts (3 console statements)
- src/components/JobsList.tsx (2 console statements)
...

Should I proceed with these changes?

User: yes

Claude: Creating logger utility...
✓ Created src/lib/logger.ts

Updating src/app/api/jobs/route.ts...
✓ Replaced 5 console statements with logger calls

[...continues for each file...]

✓ All console statements replaced!

Running verification:
✓ pnpm lint - passed
✓ pnpm type-check - passed

Changes are ready. Run `git diff` to review, then commit when satisfied.
```
