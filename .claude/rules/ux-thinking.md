# UX Thinking

---

## trigger: feature, page, screen, flow, journey, user, build, implement, form, empty state, error, loading, navigation, create, delete, action, confirmation

Every feature is built with the full user journey in mind — not just the screen in front of us. A screen that works in isolation but confuses users in context is a failed screen. Non-negotiable enforcement items are in `critical-standards.md` — this rule explains the user journey reasoning and adds the journey-level checks.

Related rules: `engineering-excellence.md` for foundational philosophy, `critical-standards.md` for hard enforcement, `product-design-thinking.md` for visual hierarchy and interaction quality, `design-first-implementation.md` for component usage, `code-quality-standards.md` for state handling.

---

## The Five Questions — Answer Before Building

If you can't answer all five, you don't understand the feature well enough to build it. **STOP and answer them first.**

### 1. Who is the user, and what are they trying to accomplish?

Not "a recruiter" — **which** recruiter, in **what** situation?

| User Archetype                      | Context                                    | What They Need                                   |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| Recruiter triaging new applications | Monday morning, 30 new apps overnight      | Quick scan, batch actions, sort by relevance     |
| Hiring manager checking in          | Weekly check, limited ATS experience       | Clear status overview, minimal clicks to insight |
| Recruiter scheduling interviews     | Mid-pipeline, coordinating multiple people | Calendar visibility, conflict awareness          |
| First-time user setting up          | Just signed up, no data yet                | Guided setup, smart defaults, clear next steps   |
| Admin managing team settings        | Occasional, needs to be efficient          | Findable settings, clear consequences of changes |

**The implementation changes based on the answer.** Power users get density + keyboard shortcuts. Occasional visitors get progressive disclosure + clear wayfinding.

### 2. Where did the user come from, and where do they go next?

```
BEFORE → What was the user doing right before this screen?
DURING → What's the primary action? What's secondary?
AFTER  → Where do they go when the primary action completes?
         What confirmation do they need?
         How do they get back if they made a mistake?
```

**🛑 STOP if "AFTER" is unclear.** A "Create Job" form that saves but dumps the user back on a generic list with no feedback is a broken experience. Always: redirect to the created item + success toast.

### 3. What happens when things go wrong?

Every failure mode below MUST be handled. Not "should." MUST.

| Failure Mode               | Required Implementation                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Empty state**            | `<EmptyState>` with guidance + CTA: "No candidates yet. Post a job to start receiving applications."        |
| **Error state**            | Error message + what to do: "Couldn't load candidates. Check your connection and try again." + retry button |
| **Partial failure**        | Per-item result: "Moved 8 of 10 candidates. 2 failed — [View details]"                                      |
| **Slow response** (>500ms) | Content-shaped skeleton — NOT a full-page spinner                                                           |
| **Permission denied**      | Explanation: "You need Admin access to change pipeline stages. [Request access]"                            |
| **Validation error**       | Inline, field-level errors. NOT a generic banner at the top. Scroll to first error.                         |
| **Destructive action**     | Confirmation dialog stating consequences BEFORE executing                                                   |

**"That shouldn't happen" is not a UX strategy.** If a user can encounter it, we handle it.

### 4. What happens at scale?

| Scenario         | What to Verify                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| **Long text**    | "Senior Director of Renewable Energy Strategy and Climate Policy" (64 chars) doesn't break layout |
| **Many items**   | 200+ candidates: pagination or virtual scroll in place, filters work, sort is useful              |
| **Many tags**    | 15 skills on a candidate card overflows gracefully (truncation + "and 8 more")                    |
| **Minimal data** | Candidate with no photo, no phone, no LinkedIn still looks intentional, not broken                |
| **Maximum data** | Every field filled: nothing overflows, layout holds                                               |

**🛑 Test with realistic data, not placeholder data.** "John Doe" with 3 skills is NOT a valid test.

### 5. Does the user know what just happened?

Every action needs feedback. No exceptions.

| Action Type            | Required Feedback                                                                 |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Create**             | Toast: "Job posted" + redirect to the created item                                |
| **Update**             | Toast: "Pipeline stage updated"                                                   |
| **Delete**             | Confirmation dialog → Toast: "Candidate removed. [Undo]"                          |
| **Bulk action**        | Progress: "Moving 12 candidates..." → Summary: "12 candidates moved to Interview" |
| **Background process** | Indicator: "Matching candidates..." → Result: "Found 8 matches [View results]"    |
| **Error**              | Explanation: "Couldn't save changes. Your edits are preserved — try again."       |
| **No-op**              | Acknowledgment: "No candidates match your filters. [Clear filters]"               |

**🛑 Silent success is indistinguishable from silent failure.** If nothing changes visually after clicking, users click again. And again.

---

## Cross-Screen Thinking — Mandatory

### Trace Every State Change

When implementing ANY state change, trace its ripple across every screen that displays that data:

```
User moves candidate from "Screening" to "Interview"
├── Pipeline board: Card moves to new column ✓ (obvious)
├── Candidate profile: Stage badge updates ✓ (often missed)
├── Job detail stats: "In Interview" count increments (often missed)
├── Dashboard: Pipeline summary updates (often missed)
├── Email: Candidate receives stage-change notification (often missed)
├── Activity feed: "Moved to Interview by Sarah" entry (often missed)
└── Analytics: Stage conversion metrics update (often missed)
```

**The enforcement:** When implementing any state change, grep the codebase for every place that data is displayed. Verify the update propagates. If you find screens that reference the changed data but don't update, fix them or file an issue.

### Navigation Must Be Predictable

| Requirement                | Implementation                                                     | Fail Criteria                            |
| -------------------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| 🛑 **Back button works**   | Filters, tabs, pagination in URL state                             | Local-only state that disappears on back |
| 🛑 **Links are shareable** | Any view a user might share has a URL that recreates it            | Filter state lost when copying URL       |
| ⚠️ **Breadcrumbs orient**  | Deep pages show path: Dashboard → Jobs → Solar Engineer → Pipeline | No breadcrumb on detail pages            |
| 🛑 **Return to context**   | After editing, return to where the user was, not a generic list    | Save redirects to root list              |
| 🛑 **Preserve work**       | `beforeunload` warning on dirty forms                              | User loses data on accidental navigation |

### Consistent Patterns Across Screens

The same action MUST work the same way everywhere. Inconsistency makes the product feel broken.

| Pattern                    | Must Be Identical Across                                                 |
| -------------------------- | ------------------------------------------------------------------------ |
| **Delete flow**            | Jobs, candidates, notes, team members — same confirmation dialog pattern |
| **Filter pattern**         | Jobs list, candidates list, applications list — same filter UI           |
| **Empty states**           | Every list view — same `<EmptyState>` component pattern                  |
| **Bulk actions**           | Select → Action bar → Confirmation → Result — same flow                  |
| **Status changes**         | Pipeline moves, job publishing, candidate updates — same toast pattern   |
| **Success/error feedback** | Every mutation — same toast component and placement                      |

---

## Mandatory UX Patterns — Code Examples

### 1. Destructive Actions Require Confirmation (🛑 BLOCKER)

```tsx
// ❌ FAIL — instant delete on click
<Button onClick={() => deleteCandidate(id)}>Delete</Button>

// ✅ PASS — confirmation with consequences
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Candidate</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete {candidate.name}?</AlertDialogTitle>
    <AlertDialogDescription>
      This will permanently remove the candidate and all their
      application history. This action cannot be undone.
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Delete permanently
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 2. Reversible Actions Offer Undo (⚠️ REQUIRED)

```tsx
// ✅ PASS — optimistic action with undo
function handleArchive(candidateId: string) {
  archiveCandidate(candidateId); // Optimistic
  toast({
    title: "Candidate archived",
    action: <ToastAction onClick={() => unarchiveCandidate(candidateId)}>Undo</ToastAction>,
    duration: 5000,
  });
}
```

### 3. Forms Preserve User Work (🛑 BLOCKER)

```tsx
// ✅ PASS — unsaved changes warning
const [isDirty, setIsDirty] = useState(false);

useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isDirty]);
```

### 4. Empty States Guide the User (🛑 BLOCKER)

```tsx
// ❌ FAIL — unhelpful
<div className="text-center text-foreground-muted">No candidates found.</div>

// ✅ PASS — helpful with next action
<EmptyState
  icon={<UserPlus size={48} />}
  title="No candidates yet"
  description="Candidates will appear here when they apply to your jobs, or you can add them manually."
  action={
    <div className="flex gap-3">
      <Button variant="primary">Add a candidate</Button>
      <Button variant="secondary">Import from CSV</Button>
    </div>
  }
/>
```

### 5. Loading States Match Content Shape (🛑 BLOCKER)

```tsx
// ❌ FAIL — generic spinner
<div className="flex items-center justify-center h-64"><Spinner /></div>

// ✅ PASS — content-shaped skeleton
<div className="space-y-3">
  <Skeleton className="h-10 w-full" />  {/* Table header */}
  <Skeleton className="h-14 w-full" />  {/* Row */}
  <Skeleton className="h-14 w-full" />  {/* Row */}
  <Skeleton className="h-14 w-full" />  {/* Row */}
</div>
```

---

## Anti-Patterns — How to Detect and Fix

### The Isolation Trap

```
❌ Build the "Edit Job" form
   → Where does the user go after saving? (unknown)
   → What if they cancel? (unknown)
   → What if validation fails? (unknown)
   → Does the jobs list reflect changes? (not considered)

✅ Build the "Edit Job" experience
   → Save → redirect to job detail + success toast
   → Cancel → return to job detail + dirty warning if changed
   → Validation → inline field errors + scroll to first error
   → Jobs list → shows updated title/status immediately
```

**Detection:** If you're building a page without knowing what happens after the primary action, you're in the Isolation Trap.

### The Happy Path Trap

```
❌ User creates a job → show the job page
   (What if API fails? Session expired? Offline? Duplicate title?)

✅ Handle every outcome:
   → Success: redirect + toast
   → Validation: inline errors + scroll to first
   → Duplicate: "Job exists. [View existing]"
   → Network: "Couldn't save. Draft preserved. [Retry]"
   → Auth expired: redirect to login, preserve form state
```

**Detection:** If your component only has a success rendering path, you're in the Happy Path Trap.

### The Developer Data Trap

```
❌ Testing with "Test Job" (10 chars), "John Doe" (8 chars), 3 skills

✅ Testing with:
   → "Senior Director of Renewable Energy Strategy and Climate Policy" (64 chars)
   → "Dr. Maria Fernandez-Gutierrez de la Cruz" (41 chars)
   → 15 skills, 6 certifications, 300-word cover letter
   → Candidate with zero optional fields filled
```

**Detection:** If all your test data fits neatly in every container, you haven't tested at scale.

### The Silent Action Trap

```
❌ User clicks "Save" → nothing visible happens

✅ User clicks "Save":
   → Button shows loading spinner immediately
   → Success: toast "Changes saved" + button returns to normal
   → Failure: toast "Couldn't save — try again" + button shows retry
```

**Detection:** If you can click a button and nothing visible changes for >200ms, you're in the Silent Action Trap.

---

## Pre-Build UX Checklist

### 🛑 Blockers

- [ ] 🛑 Can answer all Five Questions for this feature
- [ ] 🛑 Empty state exists with guidance + CTA
- [ ] 🛑 Loading state uses content-shaped skeletons
- [ ] 🛑 Error state shows what went wrong + how to recover
- [ ] 🛑 Every action gives visible feedback (no silent success)
- [ ] 🛑 Destructive actions have confirmation dialog with consequences
- [ ] 🛑 Forms warn on navigation with unsaved changes
- [ ] 🛑 URL state for filters/tabs/pagination (back button works)

### ⚠️ Required

- [ ] ⚠️ Reversible actions offer undo via toast
- [ ] ⚠️ Tested with realistic data (long names, many items, minimal data, maximum data)
- [ ] ⚠️ State changes propagate to all screens that display the affected data
- [ ] ⚠️ Navigation after action returns user to meaningful context
- [ ] ⚠️ Delete/filter/empty-state patterns match how they work elsewhere in the product

### 💡 Recommended

- [ ] 💡 Partial failure handled for bulk actions ("8 of 10 succeeded")
- [ ] 💡 Optimistic updates for toggle/move/favorite actions
- [ ] 💡 First-time user experience considered (no data, no context)
