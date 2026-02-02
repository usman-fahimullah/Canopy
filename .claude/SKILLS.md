# Canopy Claude Skills & Commands Reference

Quick reference for all available Claude Code commands and rules.

---

## 🚀 Commands (Slash Commands)

### Code Quality

| Command | Usage | Description |
|---------|-------|-------------|
| `/code-review` | `/code-review` | Review uncommitted changes for code quality issues |
| `/code-review --staged` | Review only staged changes | |
| `/quality-scan` | `/quality-scan` | Full codebase audit with health score |
| `/quality-scan --security` | Security-focused scan only | |
| `/quality-scan --quick` | Fast scan, critical issues only | |
| `/fix-quality console` | Replace console.log → logger | |
| `/fix-quality auth` | Add missing authorization checks | |
| `/fix-quality validation` | Add Zod validation to API routes | |
| `/fix-quality loading-states` | Add loading/error/empty states | |
| `/fix-quality all` | Fix all auto-fixable issues | |

### Design System

| Command | Usage | Description |
|---------|-------|-------------|
| `/design-review` | `/design-review` | Review UI changes for design compliance |
| `/design-review --staged` | Review only staged UI changes | |
| `/design-scan` | `/design-scan` | Full design system audit with score |
| `/design-scan --tokens` | Token usage analysis only | |
| `/design-scan --components` | Component adoption analysis only | |
| `/fix-design icons` | Migrate Lucide/Heroicons → Phosphor | |
| `/fix-design colors` | Convert hardcoded colors → tokens | |
| `/fix-design spacing` | Convert px values → Tailwind scale | |
| `/fix-design buttons` | Replace raw `<button>` → `<Button>` | |
| `/fix-design inputs` | Replace raw `<input>` → design system | |
| `/fix-design all` | Fix all design issues | |

### Figma Implementation

| Command | Usage | Description |
|---------|-------|-------------|
| `/figma-implement <url>` | Guided implementation from Figma | |
| `/figma-implement <url> --component` | New UI component | |
| `/figma-implement <url> --page` | New page/route | |
| `/figma-verify <url> <path>` | Verify implementation matches Figma | |

---

## 📋 Rules (Auto-Applied)

### Always Active (`trigger: always`)

| Rule | Purpose |
|------|---------|
| `code-quality-standards` | Security, type safety, logging, testing standards |
| `design-audit-standards` | Component usage, tokens, icons, typography |
| `design-first-implementation` | Figma → code workflow, component mapping |
| `scale-first-engineering` | Multi-tenant architecture patterns |
| `no-external-companies` | Brand guidelines, no competitor references |

### Triggered by Context

| Rule | Triggers | Purpose |
|------|----------|---------|
| `pre-merge-checklist` | `pr, review, merge` | PR review checklist |
| `figma-verification-standards` | `figma, design, implement` | Figma verification process |
| `figma-implementation` | `figma, design` | Token reference guide |
| `component-documentation` | `component, ui, create` | Component docs template |
| `design-system-sync` | `component, ui, update` | Keep docs in sync |

---

## ⚡ Quick Workflows

### Starting a New Feature

```bash
# 1. If implementing from Figma
/figma-implement <figma-url>

# 2. Code quality is enforced via rules (automatic)

# 3. Before committing, verify
/code-review
/design-review
```

### Before Creating a PR

```bash
# 1. Full quality check
/quality-scan
/design-scan

# 2. Fix any issues
/fix-quality all
/fix-design all

# 3. Final review
/code-review --staged
```

### Implementing a Figma Design

```bash
# 1. Start guided implementation
/figma-implement https://figma.com/design/xxx?node-id=yyy

# 2. After implementing, verify
/figma-verify https://figma.com/design/xxx?node-id=yyy src/components/MyComponent.tsx
```

### Periodic Codebase Audit

```bash
# Full audit
/quality-scan
/design-scan

# Review the reports and prioritize fixes
```

---

## 🎯 Key Standards Summary

### Code Quality (from `code-quality-standards`)

| Standard | Requirement |
|----------|-------------|
| Authorization | Every API route must check auth |
| Validation | Zod schemas on all inputs |
| Logging | Use `logger.*` not `console.*` |
| Types | No `any`, strict TypeScript |
| States | Loading, empty, error on all data fetching |
| Testing | Tests required for new features |

### Design System (from `design-audit-standards`)

| Standard | Requirement |
|----------|-------------|
| Components | Use `<Button>` not `<button>` |
| Colors | Use tokens not hex values |
| Spacing | Use Tailwind scale not `[Xpx]` |
| Typography | Use scale classes not custom sizes |
| Icons | Phosphor only, no Lucide/Heroicons |
| Dark Mode | All colors via tokens |

### Figma Implementation (from `figma-verification-standards`)

| Standard | Requirement |
|----------|-------------|
| Extract | Use MCP tools to get design data |
| Map | Match Figma layers to components |
| Tokens | Map all values to CSS tokens |
| States | Implement all Figma states |
| Variants | Implement all Figma variants |
| Verify | Run `/figma-verify` before done |
| Document | Add `@figma` link in code |

---

## 📁 File Locations

```
.claude/
├── commands/           # Slash commands
│   ├── code-review.md
│   ├── design-review.md
│   ├── design-scan.md
│   ├── figma-implement.md
│   ├── figma-verify.md
│   ├── fix-design.md
│   ├── fix-quality.md
│   └── quality-scan.md
│
├── rules/              # Auto-applied rules
│   ├── code-quality-standards.md
│   ├── component-documentation.md
│   ├── design-audit-standards.md
│   ├── design-first-implementation.md
│   ├── design-system-sync.md
│   ├── figma-implementation.md
│   ├── figma-verification-standards.md
│   ├── no-external-companies.md
│   ├── pre-merge-checklist.md
│   └── scale-first-engineering.md
│
├── settings.local.json  # Permissions
└── SKILLS.md            # This file
```

---

## 🔧 Useful Aliases

You can reference these in conversations:

| Say This | Claude Understands |
|----------|-------------------|
| "review my code" | Runs code quality checks |
| "check the design" | Runs design compliance checks |
| "implement from Figma" | Triggers Figma implementation workflow |
| "prepare for PR" | Runs pre-merge checklist |
| "audit the codebase" | Runs full quality + design scans |

---

## 📊 Health Scores

Both `/quality-scan` and `/design-scan` output health scores:

### Code Quality Score (out of 100)
- Security: 25 pts
- Type Safety: 25 pts
- Code Quality: 25 pts
- Test Coverage: 25 pts

### Design System Score (out of 100)
- Component Adoption: 25 pts
- Token Compliance: 25 pts
- Icon Library: 25 pts
- Typography: 25 pts

---

## 🆘 Troubleshooting

### Command not working?
- Check `.claude/commands/` for the file
- Ensure command name matches filename

### Rule not triggering?
- Check the `trigger:` line in the rule file
- Rules trigger on keywords in your message

### Figma MCP not connecting?
- Ensure Figma desktop app is open
- Check that the file is accessible
- Verify MCP permissions in `settings.local.json`

---

*Last updated: February 2026*
