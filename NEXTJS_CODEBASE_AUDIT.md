# Next.js Codebase Audit Report — Canopy ATS

**Date:** 2026-02-01
**Codebase:** Canopy (Climate ATS / Career Mentorship Platform)
**Framework:** Next.js 14.2.0 (App Router)
**Total Source Files:** ~480 TypeScript/TSX files
**Auditor:** Automated comprehensive audit

---

## Executive Summary

Canopy is a well-structured Next.js 14 App Router application with a comprehensive design system, multi-role architecture (Employer, Talent, Coach), and 91 UI components. The codebase demonstrates strong frontend patterns—proper server/client component boundaries, a thorough 3-tier design token system, and consistent layout conventions. However, it has **critical gaps in testing (zero tests), CI/CD (no pipeline), developer tooling (no linter/formatter config), and security hardening (XSS via dangerouslySetInnerHTML, missing input validation on API routes)**. The project also lacks a `next.config` file entirely, has 274 console.log statements across production code, and ships `lucide-react` despite the design system mandating Phosphor Icons exclusively.

---

## Scorecard

| # | Section | Score | Summary |
|---|---------|-------|---------|
| 1 | Architecture & Structure | 8/10 | Clean multi-role App Router design with proper route groups |
| 2 | Routing & Navigation | 7/10 | Good patterns but orphaned routes and missing root error boundaries |
| 3 | Data Fetching & Server/Client Boundary | 7/10 | Proper SC/CC split, but no Server Actions, no caching strategy |
| 4 | Performance | 6/10 | Good foundations, but lucide-react duplication, missing next/image, no cache directives |
| 5 | State Management | 8/10 | Appropriate URL + hook-based state, no unnecessary global state |
| 6 | TypeScript & Type Safety | 6/10 | 27 `any` types, minimal Zod validation (1 of 55 API routes) |
| 7 | Error Handling & Resilience | 5/10 | No root error boundary, inconsistent error handling across API routes |
| 8 | Security | 5/10 | Good auth, but XSS risk, missing CSRF, weak input validation |
| 9 | API Layer | 6/10 | 55 well-organized routes, but inconsistent validation and error responses |
| 10 | Styling & UI Consistency | 9/10 | Excellent 3-tier token system, 91 components, comprehensive dark mode |
| 11 | Testing | 1/10 | Zero tests, zero test configuration |
| 12 | DevEx & Code Quality | 3/10 | No ESLint config, no Prettier, no pre-commit hooks, 274 console.logs |
| 13 | Deployment & Infrastructure | 2/10 | No next.config, no CI/CD, no .env.example, no monitoring |
| 14 | Dependency Management | 6/10 | Clean deps, but lucide-react should be removed, lock file committed |

**Overall: 5.6/10** — Strong UI/design foundations, but critically lacking in testing, CI/CD, and production readiness.

---

## 1. Project Architecture & Structure

**Score: 8/10**

### What's Working Well

- **App Router with route groups** — Clean separation using `(onboarding)`, `employer/`, `talent/`, `coach/`, `design-system/`, and `admin/` directories
- **Multi-role architecture** — Each role (employer, talent, coach) has its own layout with `authorizeShell()` server-side guards (`src/lib/shell/authorize-shell.ts`)
- **Component organization** — Clear separation: `ui/` (91 primitives), `shell/` (layout), `design-system/` (docs), `messaging/`, `onboarding/`, `jobs/`
- **Consistent shell pattern** — All three shells use identical layout patterns with `ShellLayout` + role-specific `NavConfig`
- **API routes well-organized** — 55 routes following RESTful conventions under `src/app/api/`

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 High | Orphaned `/(onboarding)` route group | Complete duplicate of `/onboarding/` — 8 pages unreferenced by any link, auth redirect, or import. Active flow uses `/onboarding/` (referenced by `src/app/auth/redirect/page.tsx:41,50`). Should be deleted. |
| 🟡 Medium | No `next.config` file | Project has no `next.config.js`, `.mjs`, or `.ts`. Runs entirely on Next.js defaults. This means no image domain allowlisting, no custom headers, no security headers, no redirects. |
| 🟡 Medium | Multiple stale documentation files | Root contains 14 markdown strategy/wireframe files (`CANDID_MVP_SPEC.md`, `CANDID_UI_AUDIT.md`, etc.) and 3 HTML wireframe files. These add clutter to the repo root. |
| 🔵 Low | Test page in production routes | `src/app/test-collections/page.tsx` — test/demo page accessible in production |

---

## 2. Routing & Navigation

**Score: 7/10**

### What's Working Well

- **`next/link` used consistently** — No internal `<a>` tags found for navigation
- **Error/loading/not-found trifecta** — Implemented in all three main shells (employer, talent, coach) with consistent patterns
- **Middleware properly scoped** — `src/middleware.ts` delegates to Supabase session management with appropriate matcher excluding static assets

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔴 Critical | No root `error.tsx` | No global error boundary at `src/app/error.tsx`. Unhandled errors in routes outside the three shells (root page, design-system, onboarding, auth, admin, candid, demo) will show the default Next.js error page. |
| 🔴 Critical | No root `not-found.tsx` | No custom 404 page at `src/app/not-found.tsx`. Users hitting invalid URLs get the default Next.js 404. |
| 🟡 Medium | Missing error boundaries in sub-routes | `/(auth)`, `/(dashboard)`, `/admin`, `/candid`, `/demo`, `/design-system`, `/onboarding` — none have error.tsx or not-found.tsx |
| 🟡 Medium | Dual onboarding implementations | `/(onboarding)/` (parenthetical route group) and `/onboarding/` (direct) exist simultaneously with different approaches. Only `/onboarding/` is active. |

---

## 3. Data Fetching & Server/Client Boundary

**Score: 7/10**

### What's Working Well

- **Server Components by default** — Shell layouts (`employer/layout.tsx`, `talent/layout.tsx`, `coach/layout.tsx`) are all Server Components that call `authorizeShell()` before rendering
- **`"use client"` at appropriate levels** — ~344 client components, but all justified (interactive UI, form state, hooks)
- **Supabase auth on server** — `getServerUser()` pattern for secure server-side authentication
- **Prisma singleton** — `src/lib/db.ts` uses global singleton pattern with dev-mode caching

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 High | No Server Actions used anywhere | Zero files contain `"use server"`. All mutations go through API Route Handlers. Server Actions would reduce boilerplate for form submissions and provide automatic revalidation. |
| 🟠 High | No caching/revalidation strategy | No `export const revalidate`, no `next: { revalidate }`, no `revalidateTag`/`revalidatePath` across any of the 55 API routes. All endpoints are fully dynamic by default. Read-heavy endpoints like `/api/jobs` could benefit from ISR. |
| 🟡 Medium | No `Suspense` boundaries in shell layouts | Shell pages fetch data but don't wrap async content in `<Suspense>` with fallbacks (only found in 1 file: `src/app/candid/jobs/page.tsx:470`) |
| 🟡 Medium | No `generateStaticParams` usage | Zero instances found. Design system pages and public-facing content could be statically generated. |

---

## 4. Performance

**Score: 6/10**

### What's Working Well

- **Font optimization** — DM Sans loaded via `next/font/google` with `display: "swap"` (`src/app/layout.tsx:6-9`)
- **Event listener cleanup** — All 30+ `useEffect` hooks with listeners properly clean up (verified in all hooks files)
- **Dynamic imports** — `next/dynamic` used for ThemeToggle (`ssr: false`) and DndKanbanBoard
- **React.memo** — Applied strategically to data-table sub-components and time-picker columns
- **Tree-shakeable imports** — All 22 Radix UI packages use namespace imports (`import * as X`)
- **Proper dependency arrays** — 50+ `useEffect` hooks all have correct dependency arrays

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 High | `lucide-react` still in use (11 files) | CLAUDE.md mandates Phosphor Icons exclusively. Lucide adds unnecessary bundle weight. Files: `accordion.tsx`, `button.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `dialog.tsx`, `dropdown.tsx`, `empty-state.tsx`, `file-upload.tsx`, `sheet.tsx`, `stat-card.tsx` |
| 🟡 Medium | 6 `<img>` tags without `next/image` | `src/app/demo/recruiter-calendar/page.tsx:339`, `src/app/(onboarding)/employer/your-role/page.tsx:96`, `src/components/ui/email-composer.tsx:216`, `src/app/candid/jobs/page.tsx:207,284`, `src/components/ui/collection-card.tsx:167` |
| 🟡 Medium | No API response caching | All 55 API routes run as fully dynamic. `/api/jobs` (read-heavy, filter-based) would benefit from `revalidate = 300` |
| 🔵 Low | No `<link rel="preload">` hints | Critical fonts and above-fold assets could benefit from preloading |

---

## 5. State Management

**Score: 8/10**

### What's Working Well

- **No unnecessary global state** — No Redux, Zustand, or heavyweight state library. Appropriate for the app's complexity.
- **Hook-based state** — 14 custom hooks in `src/hooks/` cover auth, messaging, notifications, responsive breakpoints, and accessibility
- **Context used sparingly** — `SidebarContext` (`src/components/shell/sidebar-context.tsx`), `OnboardingFormProvider` (`src/components/onboarding/form-context.tsx`), `AuthProvider` — all correctly scoped
- **Server state separation** — API data fetched via route handlers, not mixed with UI state

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔵 Low | No SWR/React Query for client-side data | Several pages use `useState` + `useEffect` + `fetch()` for data loading. A library like SWR would provide caching, revalidation, and optimistic updates. Not critical but would improve UX for the coaching/messaging features. |

---

## 6. TypeScript & Type Safety

**Score: 6/10**

### What's Working Well

- **TypeScript throughout** — All 480 files are `.ts`/`.tsx`
- **Strict mode enabled** — `tsconfig.json` has `"strict": true`
- **Comprehensive design system types** — `src/types/design-system.ts` (300 lines) covers all token types
- **Component props well-typed** — Button, Input, and most UI components use proper interfaces extending HTML attributes
- **Utility functions fully typed** — `src/lib/utils.ts` has proper type guards and typed helpers

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 High | 27 `any` type usages | 22 `: any` and 5 `as any` across API routes, hooks, and dashboard pages. Worst offenders: `src/app/api/jobs/route.ts` (Prisma where clauses), `src/app/candid/dashboard/page.tsx` (6 instances in reduce/filter), `src/app/candid/profile/page.tsx` (`as any` casts) |
| 🟠 High | Only 1 of 55 API routes validates input with Zod | `src/app/api/onboarding/route.ts` is the only route using Zod schemas. All other POST/PATCH/DELETE routes accept unvalidated request bodies. Zod is a dependency but barely used. |
| 🟡 Medium | Unsafe catch blocks | `src/hooks/use-messages.ts:159` and `src/hooks/use-conversations.ts:92` use `catch (err: any)` instead of `catch (err: unknown)` |
| 🟡 Medium | Enum values passed as `as any` | `src/app/api/sessions/route.ts:39,54` and `src/app/api/coaches/apply/route.ts:160` cast status values with `as any` instead of using proper Prisma enum types |
| 🔵 Low | 1 `@ts-expect-error` | `src/components/ui/interview-scheduling-modal.tsx:1008` — documented, acceptable for CSS custom property |

---

## 7. Error Handling & Resilience

**Score: 5/10**

### What's Working Well

- **Role-specific error boundaries** — `employer/error.tsx`, `talent/error.tsx`, `coach/error.tsx` all follow consistent patterns with WarningCircle icons and retry buttons
- **API routes return proper status codes** — 401 for unauthenticated, 404 for not found, 500 for server errors

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔴 Critical | No root error boundary | `src/app/error.tsx` does not exist. Errors in root page, design-system, onboarding, auth, admin routes are unhandled. |
| 🔴 Critical | No root not-found page | `src/app/not-found.tsx` does not exist. |
| 🟠 High | Inconsistent API error handling | Several routes have unsafe patterns: `src/app/api/applications/route.ts:20` — `JSON.parse()` without try/catch will crash on invalid input |
| 🟡 Medium | No structured error response format | API routes return ad-hoc `{ error: "message" }` shapes. No standardized error envelope (e.g., `{ error: { code, message, details } }`) |
| 🟡 Medium | Empty state handling varies | Some pages handle empty data well, others show blank content without guidance |

---

## 8. Security

**Score: 5/10**

### What's Working Well

- **Supabase auth with cookie-based sessions** — Tokens managed server-side in HTTP-only cookies, not localStorage
- **Middleware session refresh** — Every request validates and refreshes the session (`src/lib/supabase/middleware.ts:62`)
- **Server-side authorization** — `authorizeShell()` checks role and profile existence before rendering protected routes
- **Secrets properly scoped** — Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are client-exposed
- **Stripe webhook signature verification** — `src/app/api/stripe/webhook/route.ts` validates signatures
- **Prisma ORM** — No raw SQL, all queries parameterized
- **Rate limiting implemented** — `src/lib/rate-limit.ts` with configurable sliding window

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔴 Critical | XSS via `dangerouslySetInnerHTML` | `src/app/candid/jobs/page.tsx:382` renders `job.description` from database as raw HTML. If descriptions contain user-generated content, this is exploitable. Also: `src/components/ui/email-composer.tsx:896` |
| 🔴 Critical | No `next.config` = no security headers | Without a `next.config.js`, there are no Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, or other security headers |
| 🟠 High | Missing input validation on most API routes | 54 of 55 API routes accept unvalidated input. `src/app/api/profile/route.ts:56-76` accepts any field in PATCH body without schema validation. |
| 🟠 High | No CSRF protection | No CSRF tokens for state-changing operations. Server Actions would provide this automatically, but aren't used. |
| 🟡 Medium | Open redirect risk | `src/lib/supabase/middleware.ts:74-75` passes `pathname` to login redirect without validation |
| 🟡 Medium | File upload not validated | `src/app/api/applications/route.ts:25-27` extracts files without checking type, size, or name |
| 🟡 Medium | No `.env.example` | New developers have no documentation of required environment variables |

---

## 9. API Layer (Route Handlers)

**Score: 6/10**

### What's Working Well

- **55 API routes** logically organized following RESTful patterns
- **Consistent auth checks** — Most routes call `getServerUser()` first
- **Prisma for all queries** — Safe from SQL injection, clean query patterns
- **Stripe integration** — Proper webhook handling with signature verification

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 High | Minimal input validation | Only `src/app/api/onboarding/route.ts` uses Zod. All other routes trust request body shape. |
| 🟠 High | No consistent response format | Routes mix `{ error: string }`, `{ message: string }`, and raw data responses |
| 🟡 Medium | Rate limiting defined but unclear usage | `src/lib/rate-limit.ts` exports limiters but usage across routes is not consistently applied |
| 🟡 Medium | Large route files | `src/app/api/onboarding/route.ts` is 599 lines. Business logic mixed with HTTP handling. |
| 🟡 Medium | Query parameter parsing unsafe | `src/app/api/jobs/route.ts:10-22` — `parseInt()` without bounds checking allows negative page numbers |
| 🔵 Low | 274 console.log/warn/error statements | Across 131 files including production API routes. Should use structured logging. |

---

## 10. Styling & UI Consistency

**Score: 9/10**

### What's Working Well

- **Comprehensive 3-tier token system** — Primitive → Semantic → Component tokens in `src/app/globals.css`, mirrored in `tailwind.config.ts`
- **91 UI components** — Full design system covering forms, overlays, navigation, data display, and ATS-specific components
- **Tailwind config exhaustive** — 940 lines mapping every CSS variable to Tailwind utilities for colors, spacing, typography, shadows, animations, border-radius, z-index
- **Dark mode** — Implemented via `darkMode: "class"` with documented color reference
- **Motion tokens** — Complete animation system with `prefers-reduced-motion` support
- **Component token coverage** — Button, Input, Card, Badge, Switch, Tabs, Modal, Toast, Tooltip, Popover, Kanban, Pipeline Stages, Match Scores all have dedicated token sets
- **Design system documentation app** — Full interactive documentation at `/design-system` with 40+ component pages
- **Accessibility** — Focus rings, keyboard navigation, ARIA attributes documented and implemented
- **Font loading** — DM Sans via `next/font/google` with CSS variable (`--font-sans`)

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟡 Medium | `lucide-react` icons in 11 UI components | Violates the Phosphor Icons mandate. Dual icon libraries increase bundle size. |
| 🔵 Low | Some hardcoded hex values in dark mode | CLAUDE.md documents this as intentional (`dark:bg-[#1A1A1A]`) but it creates a maintenance burden |

---

## 11. Testing

**Score: 1/10**

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔴 Critical | **Zero test files** | No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files exist anywhere in the codebase |
| 🔴 Critical | **No test framework configured** | No Jest, Vitest, Playwright, or Cypress configuration files. No test dependencies in `package.json`. |
| 🔴 Critical | **No test scripts** | `package.json` has no `test`, `test:unit`, `test:e2e`, or similar scripts |
| 🔴 Critical | **55 API routes untested** | All API routes including payment flows, auth callbacks, and data mutations have zero test coverage |
| 🔴 Critical | **91 UI components untested** | No component tests, no interaction tests, no accessibility tests |

### Recommendations

1. **Immediate:** Add Vitest + React Testing Library for unit/component tests
2. **Short-term:** Add Playwright for critical E2E flows (auth, onboarding, payment)
3. **Target:** 80% coverage on API routes, 60% on UI components

---

## 12. DevEx & Code Quality

**Score: 3/10**

### What's Working Well

- **TypeScript strict mode** — Catches many issues at compile time
- **Path aliases** — `@/*` configured in `tsconfig.json`
- **pnpm** — Fast, disk-efficient package manager with pinned version (`pnpm@10.28.1`)
- **Low TODO count** — Only 8 TODO/FIXME comments across the entire codebase
- **CLAUDE.md** — Comprehensive project documentation (though possibly stale in some areas)

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔴 Critical | No ESLint configuration | No `.eslintrc.*` file, no `eslintConfig` in package.json. `next lint` runs but with zero custom rules beyond Next.js defaults. |
| 🔴 Critical | No Prettier/formatter configuration | No `.prettierrc`, no formatting enforcement. Code style consistency relies entirely on individual developer habits. |
| 🔴 Critical | No pre-commit hooks | No Husky, no lint-staged. Nothing prevents committing broken or unformatted code. |
| 🟠 High | 274 console.log/warn/error statements | Across 131 files. Design system demo pages account for ~80 of these (acceptable), but API routes and hooks contain production console statements that should use structured logging. |
| 🟡 Medium | 14 strategy/wireframe files in repo root | `CANDID_MVP_SPEC.md`, `CANDID_UI_AUDIT.md`, `CANDID_VISUAL_FIXES.md`, etc. + 3 HTML wireframes. These should move to a `docs/` directory or wiki. |
| 🟡 Medium | No contribution guidelines | No `CONTRIBUTING.md`, no PR template, no issue templates |
| 🔵 Low | Dead code — orphaned `/(onboarding)` | 8 unused page files in `src/app/(onboarding)/` |

---

## 13. Deployment & Infrastructure

**Score: 2/10**

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🔴 Critical | No `next.config` file | Cannot configure image domains, security headers, redirects, rewrites, or any Next.js optimization. This is required for production deployment. |
| 🔴 Critical | No CI/CD pipeline | No `.github/workflows/`, no Gitlab CI, no build/test automation. Code is pushed directly without automated checks. |
| 🔴 Critical | No `.env.example` | New developers have no documentation of required environment variables (`DATABASE_URL`, `DIRECT_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, etc.) |
| 🟠 High | No error monitoring | No Sentry, LogRocket, or similar error tracking. Production errors go unnoticed. |
| 🟡 Medium | No Docker configuration | No `Dockerfile` or `docker-compose.yml` for local development standardization |
| 🟡 Medium | No `vercel.json` | If deploying to Vercel, no project configuration file exists |
| 🔵 Low | No preview deployment config | No branch preview setup documented |

---

## 14. Dependency Management

**Score: 6/10**

### What's Working Well

- **Lock file committed** — `pnpm-lock.yaml` is in the repository
- **pnpm version pinned** — `"packageManager": "pnpm@10.28.1"` in `package.json`
- **Dev deps properly separated** — Build tools, types, and linters in `devDependencies`
- **Modern dependency choices** — Radix UI, dnd-kit, TipTap, Recharts, Zod
- **`auto-install-peers=true`** — Configured in `.npmrc`

### Issues

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 High | `lucide-react` should be removed | Listed in dependencies (`"lucide-react": "^0.400.0"`) but CLAUDE.md mandates `@phosphor-icons/react` exclusively. Still imported in 11 files. |
| 🟡 Medium | `prisma` in dependencies (should be devDep) | `"prisma": "5.22.0"` is in `dependencies` instead of `devDependencies`. Only `@prisma/client` needs to be a production dependency. |
| 🟡 Medium | Next.js 14.2.0 is outdated | Current stable is significantly newer. Missing security patches and performance improvements. |
| 🔵 Low | Some Radix versions use `^` while framework is pinned | Minor inconsistency in versioning strategy |

---

## Critical Issues (Fix Immediately)

| # | Issue | File(s) | Fix |
|---|-------|---------|-----|
| 1 | **No root error boundary** | `src/app/error.tsx` (missing) | Create root `error.tsx` with "use client" directive, error message, and retry button |
| 2 | **No root not-found page** | `src/app/not-found.tsx` (missing) | Create branded 404 page |
| 3 | **XSS via dangerouslySetInnerHTML** | `src/app/candid/jobs/page.tsx:382`, `src/components/ui/email-composer.tsx:896` | Sanitize HTML with DOMPurify before rendering |
| 4 | **No `next.config`** | Project root | Create `next.config.js` with image domains, security headers (CSP, X-Frame-Options, HSTS), and allowed remote patterns |
| 5 | **Zero tests** | Entire codebase | Add Vitest + Testing Library, create test scripts, start with API route tests |
| 6 | **No CI/CD pipeline** | `.github/workflows/` (missing) | Create GitHub Actions workflow for lint, type-check, build, and test |
| 7 | **No ESLint config** | `.eslintrc.json` (missing) | Create ESLint config extending `next/core-web-vitals` with strict TypeScript rules |

---

## High Priority Issues

| # | Issue | File(s) | Fix |
|---|-------|---------|-----|
| 8 | Orphaned `/(onboarding)` routes | `src/app/(onboarding)/` | Delete entire directory (8 unused pages) |
| 9 | `lucide-react` still used (11 files) | `src/components/ui/{accordion,button,collapsible,command,context-menu,dialog,dropdown,empty-state,file-upload,sheet,stat-card}.tsx` | Replace with Phosphor Icons equivalents, then remove `lucide-react` from package.json |
| 10 | Missing input validation on 54 API routes | `src/app/api/*/route.ts` | Add Zod schemas for all POST/PATCH/DELETE request bodies |
| 11 | No CSRF protection | All mutation endpoints | Either adopt Server Actions (built-in CSRF) or add custom CSRF tokens |
| 12 | 27 `any` types | See TypeScript section | Replace with proper Prisma types, interfaces, and type narrowing |
| 13 | No `.env.example` | Project root | Create `.env.example` documenting all required variables |
| 14 | No Prettier config | Project root | Add `.prettierrc` and `prettier` as devDep |
| 15 | No pre-commit hooks | Project root | Add Husky + lint-staged for lint, format, and type-check |

---

## Improvement Opportunities

### Code Quality (🟡 Medium)
- Standardize API error response format across all 55 routes
- Add `Suspense` boundaries to shell pages with async data
- Replace `useState` + `useEffect` + `fetch()` with SWR for client data fetching
- Move 14 root markdown files to `docs/` directory
- Add structured logging to replace 274 console.log statements

### Performance (🟡 Medium)
- Add ISR caching to stable API endpoints (`/api/jobs`: `revalidate = 300`)
- Migrate 6 `<img>` tags to `next/image`
- Use `generateStaticParams` for design system pages
- Consider Server Actions for form submissions (reduce client JS)

### Developer Experience (🔵 Low)
- Add `CONTRIBUTING.md` and PR template
- Remove `test-collections/page.tsx` from production routes
- Add `@ts-strict` or `noUncheckedIndexedAccess` to tsconfig
- Move `prisma` CLI to devDependencies

---

## What's Working Well

1. **Design system is exceptional** — 91 components, 3-tier token architecture, comprehensive dark mode, motion tokens with reduced-motion support, interactive documentation app
2. **Multi-role architecture is clean** — Server-side authorization via `authorizeShell()`, role-specific layouts, shared `Account` model with multiple profiles
3. **Authentication is solid** — Supabase with cookie-based sessions, server-side validation, proper secret scoping
4. **Prisma schema is well-designed** — 1025 lines, proper relations, unique constraints, enum types, clean data model
5. **Server/client boundary is correct** — Server Components by default, `"use client"` only where genuinely needed
6. **Navigation patterns are consistent** — `next/link` everywhere, proper route groups, consistent shell layouts
7. **Hooks are well-written** — 14 hooks with proper cleanup, dependencies, and accessibility considerations
8. **Code is generally clean** — Only 8 TODO comments, minimal dead code (except orphaned onboarding)

---

## Recommended Action Plan

### Phase 1: Critical Fixes (This Week)
1. Create `src/app/error.tsx` (root error boundary)
2. Create `src/app/not-found.tsx` (custom 404)
3. Create `next.config.js` with security headers and image config
4. Add DOMPurify to sanitize `dangerouslySetInnerHTML` usage
5. Create `.env.example` with all required variables
6. Delete orphaned `src/app/(onboarding)/` directory

### Phase 2: Testing & CI Foundation (This Sprint)
7. Install Vitest + React Testing Library + MSW
8. Add `test` script to package.json
9. Write tests for 5 most critical API routes (auth, onboarding, jobs, sessions, payments)
10. Create GitHub Actions CI workflow (lint → type-check → build → test)
11. Add ESLint config (`next/core-web-vitals` + `@typescript-eslint/strict`)
12. Add Prettier config + Husky + lint-staged

### Phase 3: Hardening (This Quarter)
13. Add Zod validation to all 55 API routes
14. Replace lucide-react with Phosphor Icons in 11 files
15. Replace `any` types with proper types (27 instances)
16. Add CSRF protection (or adopt Server Actions)
17. Implement structured logging (replace console.log)
18. Add Sentry or similar error monitoring
19. Add API response caching/ISR where appropriate
20. Increase test coverage to 50%+ on API routes

### Phase 4: Optimization (Backlog)
21. Migrate `<img>` to `next/image` (6 instances)
22. Add `generateStaticParams` for static pages
23. Adopt SWR/React Query for client-side data fetching
24. Add Playwright E2E tests for critical user flows
25. Move strategy documents to `/docs` or wiki
26. Consider Server Actions for form mutations
27. Upgrade Next.js to latest stable

---

*Report generated from comprehensive static analysis of the Canopy codebase.*
