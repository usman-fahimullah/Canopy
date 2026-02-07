import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Base client — used directly only for soft-delete operations (restore, cascade)
export const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}

// Models that support soft deletes
const SOFT_DELETE_MODELS = ["Application", "Review", "Session"];

// Extended client with automatic soft-delete filtering.
// All queries on Application, Review, Session automatically exclude
// records where deletedAt is not null.
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null } as any;
        }
        return query(args);
      },
      async findFirst({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null } as any;
        }
        return query(args);
      },
      async findUnique({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null } as any;
        }
        return query(args);
      },
      async count({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null } as any;
        }
        return query(args);
      },
      async groupBy({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          (args as any).where = { ...(args as any).where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});

// Alias for convenience
export const db = prisma;
