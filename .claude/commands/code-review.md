# Code Review

Perform a comprehensive code quality review on the current changes or specified files.

## Usage

```
/code-review                    # Review all uncommitted changes
/code-review src/app/api/       # Review specific directory
/code-review --staged           # Review only staged changes
```

## Instructions

When this command is invoked, perform the following review process:

### Step 1: Identify Changes

First, identify what needs to be reviewed:

```bash
# If no arguments, check for uncommitted changes
git status
git diff --name-only

# If --staged flag, check staged changes
git diff --cached --name-only
```

### Step 2: Review Each File

For each changed file, check against the quality standards in `.claude/rules/code-quality-standards.md`:

#### For API Routes (*.ts in app/api/):

- [ ] **Authorization**: Is `getServerUser()` called and null-checked?
- [ ] **Role Validation**: Are admin/protected routes checking user roles?
- [ ] **Input Validation**: Is there a Zod schema with `safeParse`?
- [ ] **Org Scoping**: Do database queries include `organizationId`?
- [ ] **Error Handling**: Are errors caught and logged properly?
- [ ] **No Console**: Are there any `console.log` statements?

#### For Components (*.tsx):

- [ ] **Loading State**: Is there a loading skeleton/spinner?
- [ ] **Empty State**: Is there a helpful empty state with CTA?
- [ ] **Error State**: Is there error handling with retry?
- [ ] **TypeScript**: Are all props typed (no `any`)?
- [ ] **Accessibility**: Are interactive elements keyboard accessible?

#### For Utilities (*.ts in lib/):

- [ ] **Type Safety**: Are all parameters and returns typed?
- [ ] **Error Handling**: Are errors handled or propagated properly?
- [ ] **Testing**: Are there corresponding test files?

### Step 3: Check for Anti-Patterns

Search for forbidden patterns:

```bash
# Check for console statements
grep -rn "console\." --include="*.ts" --include="*.tsx" src/

# Check for 'any' types
grep -rn ": any" --include="*.ts" --include="*.tsx" src/

# Check for TODO comments
grep -rn "TODO" --include="*.ts" --include="*.tsx" src/

# Check for ts-ignore
grep -rn "@ts-ignore\|@ts-expect-error" --include="*.ts" --include="*.tsx" src/
```

### Step 4: Generate Report

Output a structured review report:

```markdown
## Code Review Report

### Summary
- Files reviewed: X
- Issues found: Y
- Severity: [PASS | NEEDS ATTENTION | BLOCKING]

### Security Issues (Blocking)
[List any auth, validation, or data scoping issues]

### Code Quality Issues
[List type safety, console logs, error handling issues]

### UX Issues
[List missing states, accessibility concerns]

### Recommendations
[Actionable suggestions for improvement]

### Checklist for Author
- [ ] Address blocking issues
- [ ] Fix code quality issues
- [ ] Consider UX improvements
- [ ] Run tests before re-requesting review
```

### Step 5: Offer Fixes

After presenting the report, offer to help fix issues:

- "Would you like me to fix the authorization issues?"
- "Should I add the missing loading states?"
- "Want me to replace console.log with structured logging?"

## Severity Levels

| Level | Criteria | Action |
| ----- | -------- | ------ |
| PASS | No issues found | Ready to merge |
| NEEDS ATTENTION | Minor issues, no security concerns | Fix before merge recommended |
| BLOCKING | Security issues or critical bugs | Must fix before merge |

## Example Output

```
## Code Review Report

### Summary
- Files reviewed: 5
- Issues found: 3
- Severity: BLOCKING

### Security Issues (Blocking)

1. **src/app/api/admin/users/route.ts:15**
   Missing authorization check - admin endpoint accessible without role verification

2. **src/app/api/jobs/[id]/route.ts:23**
   Database query missing organizationId scope - potential data leakage

### Code Quality Issues

1. **src/components/JobsList.tsx:45**
   Using console.log for debugging - replace with structured logger

### Recommendations

1. Add role check using OrganizationMember lookup
2. Add organizationId to the Prisma where clause
3. Replace console.log with logger.debug()

Would you like me to help fix these issues?
```
