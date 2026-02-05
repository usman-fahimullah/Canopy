# Validation Patterns

Common Zod validation patterns for Canopy.

---

## Basic Schemas

```typescript
import { z } from "zod";

// String validations
const emailSchema = z.string().email();
const nameSchema = z.string().min(1).max(100);
const uuidSchema = z.string().uuid();
const urlSchema = z.string().url();

// Number validations
const ageSchema = z.number().int().positive().max(150);
const priceSchema = z.number().positive().multipleOf(0.01);

// Boolean
const activeSchema = z.boolean().default(true);

// Date
const dateSchema = z.coerce.date();
```

---

## Object Schemas

```typescript
// User creation
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(["admin", "user", "guest"]).default("user"),
});

// User update (all optional)
const updateUserSchema = createUserSchema.partial();

// Pagination
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Filters
const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
```

---

## Array Schemas

```typescript
// Array of strings
const tagsSchema = z.array(z.string()).min(1).max(10);

// Array of objects
const itemsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    quantity: z.number().int().positive(),
  })
);
```

---

## Union & Discriminated Unions

```typescript
// Simple union
const idSchema = z.union([z.string().uuid(), z.number().int().positive()]);

// Discriminated union
const notificationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    email: z.string().email(),
  }),
  z.object({
    type: z.literal("sms"),
    phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  }),
]);
```

---

## Custom Validations

```typescript
// Password with requirements
const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[a-z]/, "Must contain lowercase")
  .regex(/[0-9]/, "Must contain number");

// Slug
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// Phone number
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");
```

---

## API Route Usage

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Use safeParse for error handling
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.issues,
      },
      { status: 400 }
    );
  }

  // result.data is fully typed!
  const { email, name, role } = result.data;
}
```

---

## Query Parameter Validation

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = paginationSchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  if (!result.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const { page, limit } = result.data;
}
```
