# Quality Scan

Run a comprehensive quality scan across the entire codebase to identify technical debt and quality issues.

## Usage

```
/quality-scan                   # Full codebase scan
/quality-scan --security        # Security-focused scan only
/quality-scan --quick           # Quick scan (anti-patterns only)
```

## Instructions

When this command is invoked, perform a systematic scan of the codebase:

### Phase 1: Security Audit

Scan all API routes for security issues:

```bash
# Find all API route files
find src/app/api -name "route.ts" -type f

# For each route, check for auth patterns
grep -L "getServerUser" src/app/api/**/route.ts 2>/dev/null

# Check for TODO comments in auth context
grep -rn "TODO.*admin\|TODO.*auth\|TODO.*permission" src/app/api/
```

**Report Format:**

```markdown
## Security Audit

### Endpoints Without Authentication (CRITICAL)
| File | Endpoint | Issue |
| ---- | -------- | ----- |
[List any routes missing getServerUser]

### Endpoints With Auth TODOs (HIGH)
| File | Line | TODO Text |
| ---- | ---- | --------- |
[List routes with security TODOs]

### Database Queries Missing Org Scope (HIGH)
| File | Line | Query |
| ---- | ---- | ----- |
[List findMany/findFirst without organizationId]
```

### Phase 2: Type Safety Scan

Check for TypeScript anti-patterns:

```bash
# Count 'any' usages
grep -rn ": any" --include="*.ts" --include="*.tsx" src/ | wc -l

# List files with 'any'
grep -rln ": any" --include="*.ts" --include="*.tsx" src/

# Check for ts-ignore/ts-expect-error
grep -rn "@ts-ignore\|@ts-expect-error" --include="*.ts" --include="*.tsx" src/

# Check for non-null assertions
grep -rn "!\." --include="*.ts" --include="*.tsx" src/
```

**Report Format:**

```markdown
## Type Safety Audit

### 'any' Type Usage
- Total occurrences: X
- Files affected: Y

| File | Line | Context |
| ---- | ---- | ------- |
[Top 10 files with most 'any' usage]

### TypeScript Bypasses
| File | Line | Type | Context |
| ---- | ---- | ---- | ------- |
[List @ts-ignore, @ts-expect-error occurrences]
```

### Phase 3: Code Quality Scan

Check for general quality issues:

```bash
# Console statements
grep -rn "console\." --include="*.ts" --include="*.tsx" src/ | wc -l

# Empty catch blocks
grep -rn "catch.*{.*}" --include="*.ts" --include="*.tsx" src/

# TODO/FIXME/HACK comments
grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" src/
```

**Report Format:**

```markdown
## Code Quality Audit

### Console Logging
- Total occurrences: X
- Breakdown:
  - console.log: A
  - console.error: B
  - console.warn: C

### Technical Debt (TODOs)
| Priority | Count | Category |
| -------- | ----- | -------- |
| Critical | X | Security-related TODOs |
| High | Y | Feature-incomplete TODOs |
| Medium | Z | Enhancement TODOs |
```

### Phase 4: Testing Coverage

Check testing infrastructure:

```bash
# Check for test files
find src -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" | wc -l

# Check for testing libraries
grep -l "vitest\|jest\|@testing-library" package.json

# Check test scripts
grep "test" package.json
```

**Report Format:**

```markdown
## Testing Audit

### Test Infrastructure
- Test framework: [Installed | NOT INSTALLED]
- Test files found: X
- Test coverage: [Available | NOT CONFIGURED]

### Coverage Gaps
| Area | Files | Test Files | Coverage |
| ---- | ----- | ---------- | -------- |
| API Routes | X | Y | Z% |
| Components | X | Y | Z% |
| Utilities | X | Y | Z% |
```

### Phase 5: Summary Dashboard

Generate an executive summary:

```markdown
## Quality Scan Summary

### Overall Health Score: X/100

| Category | Score | Status |
| -------- | ----- | ------ |
| Security | X/25 | [PASS/WARN/FAIL] |
| Type Safety | X/25 | [PASS/WARN/FAIL] |
| Code Quality | X/25 | [PASS/WARN/FAIL] |
| Test Coverage | X/25 | [PASS/WARN/FAIL] |

### Critical Issues (Must Fix)
1. [List blocking issues]

### High Priority (Should Fix)
1. [List high priority issues]

### Technical Debt Summary
- Total TODOs: X
- Console statements: Y
- Type safety violations: Z

### Recommended Next Steps
1. [Prioritized action items]
```

## Scoring Guide

| Category | Full Score (25) | Partial Score | Zero Score |
| -------- | --------------- | ------------- | ---------- |
| Security | All routes have auth, no TODOs | Some gaps, no critical | Missing auth on admin routes |
| Type Safety | No 'any', no bypasses | <10 'any' usages | >50 'any' usages |
| Code Quality | No console, no TODOs | <20 console, <10 TODOs | >100 console statements |
| Test Coverage | >80% coverage | 40-80% coverage | No tests |
