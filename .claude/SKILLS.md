# Canopy Claude Skills & Commands Reference

Quick reference for all available Claude Code commands, skills, agents, and rules.

---

## 🎯 NEW: Auto-Activating Skills

Skills now **automatically suggest themselves** based on your prompts and the files you're working with. This is powered by the hook system.

### How It Works

1. You ask a question or start working on code
2. The skill-activation-prompt hook analyzes your request
3. Relevant skills are suggested automatically
4. You get consistent, high-quality guidance

### Available Skills

| Skill             | Triggers On                     | Purpose                           |
| ----------------- | ------------------------------- | --------------------------------- |
| `frontend-design` | UI, design, components, styling | Creative frontend design patterns |
| `component-docs`  | documentation, storybook, props | Component documentation standards |
| `figma-workflow`  | figma, design spec, implement   | Figma to code implementation      |
| `code-quality`    | api, validation, auth, logging  | Code quality standards            |
| `design-system`   | icons, tokens, buttons, inputs  | Design system compliance          |

---

## 🤖 Specialized Agents

Use agents for complex multi-step tasks:

| Agent                        | Purpose                        | When to Use                    |
| ---------------------------- | ------------------------------ | ------------------------------ |
| `code-architecture-reviewer` | Review code for best practices | After implementing features    |
| `frontend-error-fixer`       | Debug React/TS errors          | When encountering build errors |
| `documentation-architect`    | Generate comprehensive docs    | For new features/components    |
| `refactor-planner`           | Plan refactoring strategies    | Before major restructuring     |

---

## 🚀 Commands (Slash Commands)

### Code Quality

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `/code-review`          | Review uncommitted changes            |
| `/code-review --staged` | Review only staged changes            |
| `/quality-scan`         | Full codebase audit with health score |
| `/fix-quality all`      | Fix all auto-fixable issues           |

### Design System

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `/design-review`  | Review UI changes for design compliance |
| `/design-scan`    | Full design system audit                |
| `/fix-design all` | Auto-fix design issues                  |

### Figma Implementation

| Command                      | Description                          |
| ---------------------------- | ------------------------------------ |
| `/figma-implement <url>`     | Guided implementation from Figma     |
| `/figma-verify <url> <path>` | Verify implementation matches design |

---

## 📋 Rules (Auto-Applied)

### Always Active

| Rule                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `code-quality-standards`      | Security, type safety, logging standards |
| `design-audit-standards`      | Component usage, tokens, icons           |
| `design-first-implementation` | Figma → code workflow                    |
| `scale-first-engineering`     | Multi-tenant architecture                |
| `no-external-companies`       | Brand guidelines                         |

### Triggered by Context

| Rule                           | Triggers                 |
| ------------------------------ | ------------------------ |
| `pre-merge-checklist`          | pr, review, merge        |
| `figma-verification-standards` | figma, design, implement |
| `component-documentation`      | component, ui, create    |
| `design-system-sync`           | component, ui, update    |

---

## ⚡ Quick Workflows

### Starting a New Feature

```bash
# 1. If implementing from Figma
/figma-implement <figma-url>

# 2. Skills auto-activate based on your work

# 3. Before committing
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

---

## 🎯 Key Standards Summary

### Code Quality

- Authorization on every API route
- Zod validation on all inputs
- Use `logger` not `console`
- No `any` types - strict TypeScript
- Loading/empty/error states on data fetching

### Design System

- Phosphor icons only (not Lucide/Heroicons)
- Design tokens (not hardcoded colors)
- Tailwind spacing scale (not arbitrary pixels)
- Design system components (`<Button>` not `<button>`)

---

## 📁 File Structure

```
.claude/
├── hooks/                 # Auto-activation hooks (NEW)
│   ├── skill-activation-prompt.sh
│   ├── skill-activation-prompt.ts
│   └── post-tool-use-tracker.sh
│
├── skills/                # Modular skills (<500 lines each)
│   ├── skill-rules.json   # Activation configuration
│   ├── frontend-design/
│   ├── component-docs/
│   ├── figma-workflow/
│   ├── code-quality/
│   └── design-system/
│
├── agents/                # Specialized agents (NEW)
│   ├── code-architecture-reviewer.md
│   ├── frontend-error-fixer.md
│   ├── documentation-architect.md
│   └── refactor-planner.md
│
├── commands/              # Slash commands
│   ├── code-review.md
│   ├── design-review.md
│   └── ...
│
├── rules/                 # Auto-applied rules
│   ├── code-quality-standards.md
│   ├── design-audit-standards.md
│   └── ...
│
├── settings.local.json    # Permissions & hooks config
└── SKILLS.md              # This file
```

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

### Skills not suggesting?

- Check hooks are executable: `ls -la .claude/hooks/*.sh`
- Verify skill-rules.json is valid JSON
- Check settings.local.json has hooks configured

### Command not working?

- Check `.claude/commands/` for the file
- Ensure command name matches filename

### Rule not triggering?

- Check the `trigger:` line in the rule file
- Rules trigger on keywords in your message

---

_Last updated: February 2026_
_Modernized with auto-activation hooks, modular skills, and specialized agents_
