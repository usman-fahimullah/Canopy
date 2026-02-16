# Architectural Decisions

---

## trigger: always

Why we chose what we chose. Prevents re-debating settled decisions.

---

## Design System

| Decision         | Choice                          | Why                                                 | Not This                                    |
| ---------------- | ------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| Focus ring color | `blue-500`                      | Universal across all inputs, accessible             | Green (brand clash with checked states)     |
| Shadow vs border | Mutually exclusive              | Visual noise when combined                          | Both on same element                        |
| Icon library     | Phosphor only                   | Consistent weight system, full coverage             | Lucide (mixed weights), Heroicons (limited) |
| Card containers  | `<Card>` component, shadow only | Tokens handle dark mode automatically               | Raw div with border+shadow                  |
| Typography       | `DM Sans` + scale classes       | Warm, modern, distinct from Inter-based competitors | System fonts (generic feel)                 |

## Architecture

| Decision            | Choice                                        | Why                                          | Not This                                 |
| ------------------- | --------------------------------------------- | -------------------------------------------- | ---------------------------------------- |
| Routing             | Next.js App Router, Server Components default | Streaming, RSC, co-located data fetching     | Pages Router (legacy)                    |
| State in URL        | searchParams for filters/tabs/pagination      | Shareable links, back button works           | useState only (lost on refresh)          |
| Auth                | Clerk with org scoping                        | Multi-tenant, team invites, SSO ready        | NextAuth (more setup, less multi-tenant) |
| Career page builder | Craft.js                                      | JSON storage, custom blocks, no vendor lock  | WordPress/Webflow embeds                 |
| Kanban              | dnd-kit                                       | Accessible, keyboard support, React 18+      | react-beautiful-dnd (unmaintained)       |
| Validation          | Zod at API boundary                           | Type inference, composable, error formatting | Yup (weaker TS), manual validation       |

## Styling

| Decision      | Choice                                    | Why                                            | Not This                                            |
| ------------- | ----------------------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| Token system  | 3-tier (primitive → semantic → component) | Dark mode auto-switch, component isolation     | Flat tokens (no hierarchy, harder to maintain)      |
| Border colors | Warm alpha system (`border-alpha-*`)      | Composites on any surface, no dark mode issues | Explicit hex borders (break on colored backgrounds) |
| Spacing       | Tailwind scale only                       | Consistency, no arbitrary values               | `p-[24px]` (inconsistent, no scale)                 |
