# Claude Workflow Modernization Recommendations

**Analysis Date:** February 4, 2026
**Based on:** Claude Code Infrastructure Showcase (6 months production-tested patterns)

---

## Executive Summary

Your current setup has strong foundations (commands, rules, design system skill) but is missing **the breakthrough feature**: auto-activating skills. The showcase repository solved the #1 problem with Claude Code - skills don't activate automatically. Here's how to modernize your workflow.

### Current State vs Target State

| Aspect               | Your Current Setup         | Target (Showcase Patterns)            |
| -------------------- | -------------------------- | ------------------------------------- |
| **Skills**           | 1 skill (frontend-design)  | Modular skills with auto-activation   |
| **Hooks**            | None                       | 2 essential hooks for auto-activation |
| **skill-rules.json** | Missing                    | Central trigger configuration         |
| **Rules**            | 10 rules (some >500 lines) | Convert to modular skills             |
| **Agents**           | None                       | Specialized agents for complex tasks  |
| **500-line rule**    | Not followed               | All skills <500 lines                 |

---

## Priority 1: Add Auto-Activation Hooks (15 min)

**This is THE most important improvement.** Without hooks, your skills and rules sit dormant until you remember to use them.

### What You Need

1. **skill-activation-prompt hook** (UserPromptSubmit)
   - Analyzes every user prompt
   - Matches against skill-rules.json triggers
   - Automatically suggests relevant skills

2. **post-tool-use-tracker hook** (PostToolUse)
   - Tracks file changes
   - Maintains context across sessions
   - Auto-detects project structure

### Implementation

Create `.claude/hooks/` directory and add:

```bash
.claude/
├── hooks/
│   ├── skill-activation-prompt.sh
│   ├── skill-activation-prompt.ts
│   ├── post-tool-use-tracker.sh
│   ├── package.json
│   └── tsconfig.json
```

Update `.claude/settings.local.json` to add:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-tool-use-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Priority 2: Create skill-rules.json (10 min)

This is the configuration that tells hooks when to activate skills.

### Recommended Structure

```json
{
  "version": "1.0",
  "description": "Skill activation triggers for Canopy",
  "skills": {
    "frontend-design": {
      "type": "guardrail",
      "enforcement": "suggest",
      "priority": "high",
      "description": "Frontend design patterns and aesthetics",
      "promptTriggers": {
        "keywords": [
          "component",
          "UI",
          "design",
          "layout",
          "styling",
          "page",
          "interface",
          "visual",
          "aesthetic",
          "frontend"
        ],
        "intentPatterns": [
          "(create|build|design|make).*?(component|page|UI|interface)",
          "(style|design|layout).*?(component|page)"
        ]
      },
      "fileTriggers": {
        "pathPatterns": ["src/components/**/*.tsx", "src/app/**/*.tsx"],
        "contentPatterns": ["className=", "tailwind", "<Button", "<Card"]
      }
    },
    "code-quality": {
      "type": "guardrail",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": [
          "api",
          "route",
          "endpoint",
          "validation",
          "auth",
          "security",
          "logging",
          "error handling"
        ],
        "intentPatterns": [
          "(create|add|implement).*?(api|route|endpoint)",
          "(fix|add).*?(validation|auth|security)"
        ]
      },
      "fileTriggers": {
        "pathPatterns": ["src/app/api/**/*.ts"]
      }
    },
    "design-system": {
      "type": "guardrail",
      "enforcement": "block",
      "priority": "high",
      "promptTriggers": {
        "keywords": [
          "icon",
          "button",
          "color",
          "token",
          "spacing",
          "design system",
          "component library"
        ]
      },
      "fileTriggers": {
        "pathPatterns": ["src/components/**/*.tsx"],
        "contentPatterns": ["Lucide", "Heroicons", "#[0-9a-fA-F]{6}"]
      },
      "blockMessage": "⚠️ Design System Check Required\n\nBefore editing UI code:\n1. Use Phosphor icons only (not Lucide/Heroicons)\n2. Use design tokens (not hardcoded colors)\n3. Use Tailwind spacing scale\n\nUse Skill tool: 'design-system' to review patterns"
    }
  }
}
```

---

## Priority 3: Restructure Rules → Skills (30 min)

Your rules are powerful but some exceed 500 lines. The showcase recommends converting large rules into modular skills.

### Rules to Convert to Skills

| Current Rule                 | Lines | Recommendation                                              |
| ---------------------------- | ----- | ----------------------------------------------------------- |
| `component-documentation.md` | 631   | **Convert to skill** - Split into SKILL.md + resource files |
| `figma-implementation.md`    | 467   | **Convert to skill** - Split into SKILL.md + resource files |
| `code-quality-standards.md`  | 364   | Keep as rule OR convert to skill                            |
| `design-audit-standards.md`  | 334   | Keep as rule OR convert to skill                            |

### Suggested Skill Structure

```
.claude/skills/
├── skill-rules.json              # Activation configuration
├── frontend-design/              # Already exists (move from src/.claude)
│   ├── SKILL.md
│   └── reference/
├── component-docs/               # Convert from rule
│   ├── SKILL.md                  # <500 lines, overview
│   └── resources/
│       ├── templates.md          # Component templates
│       ├── storybook-guide.md    # Storybook patterns
│       └── accessibility.md      # A11y requirements
├── figma-workflow/               # Convert from rule
│   ├── SKILL.md
│   └── resources/
│       ├── token-mapping.md
│       ├── component-mapping.md
│       └── verification.md
├── code-quality/                 # Convert from rule
│   ├── SKILL.md
│   └── resources/
│       ├── validation-patterns.md
│       ├── auth-patterns.md
│       └── error-handling.md
└── design-system/                # Convert from rule
    ├── SKILL.md
    └── resources/
        ├── tokens.md
        ├── components.md
        └── icons.md
```

### Example Conversion: component-documentation → component-docs skill

**SKILL.md** (keep under 500 lines):

```markdown
---
name: component-docs
description: Component documentation standards including templates,
Storybook patterns, and accessibility requirements. Use when creating
new components, updating component docs, or reviewing documentation.
---

# Component Documentation Skill

## Purpose

Ensure consistent, comprehensive documentation for all UI components.

## Quick Reference

[High-level checklist and key points]

## Resource Files

- [templates.md](resources/templates.md) - Documentation templates
- [storybook-guide.md](resources/storybook-guide.md) - Storybook patterns
- [accessibility.md](resources/accessibility.md) - A11y requirements
```

---

## Priority 4: Add Specialized Agents (20 min)

Agents handle complex multi-step tasks autonomously. Copy these from the showcase:

### Recommended Agents

| Agent                        | Purpose                        | Your Use Case               |
| ---------------------------- | ------------------------------ | --------------------------- |
| `code-architecture-reviewer` | Review code for best practices | After implementing features |
| `frontend-error-fixer`       | Debug frontend issues          | React/Next.js debugging     |
| `documentation-architect`    | Generate comprehensive docs    | Component documentation     |
| `refactor-planner`           | Create refactoring strategies  | Codebase improvements       |

### Implementation

```
.claude/agents/
├── code-architecture-reviewer.md
├── frontend-error-fixer.md
├── documentation-architect.md
└── refactor-planner.md
```

Agents are standalone - just copy the `.md` files and use immediately!

---

## Priority 5: Move frontend-design Skill (5 min)

Your frontend-design skill is in `src/.claude/skills/`. Move it to the standard location:

```bash
# Move to standard location
mv src/.claude/skills/frontend-design .claude/skills/
```

Update any path references and add to skill-rules.json.

---

## Summary: Implementation Checklist

### Phase 1: Core Auto-Activation (25 min)

- [ ] Create `.claude/hooks/` directory
- [ ] Copy skill-activation-prompt hook files
- [ ] Copy post-tool-use-tracker hook
- [ ] Install hook dependencies (npm install)
- [ ] Update settings.local.json with hook config
- [ ] Create skill-rules.json with triggers

### Phase 2: Skill Migration (30 min)

- [ ] Move frontend-design to `.claude/skills/`
- [ ] Convert component-documentation rule → skill
- [ ] Convert figma-implementation rule → skill
- [ ] Update skill-rules.json with new skills

### Phase 3: Add Agents (20 min)

- [ ] Copy code-architecture-reviewer agent
- [ ] Copy frontend-error-fixer agent
- [ ] Copy documentation-architect agent
- [ ] Test agent activation

### Phase 4: Validation (10 min)

- [ ] Test skill auto-activation by editing UI file
- [ ] Test prompt-based activation with keywords
- [ ] Verify hooks are executable
- [ ] Validate JSON syntax in all config files

---

## Key Patterns from Showcase

### 1. The 500-Line Rule

Keep SKILL.md files under 500 lines. Use resource files for details.

### 2. Progressive Disclosure

```
skill/
├── SKILL.md           # Overview, <500 lines
└── resources/
    ├── topic-1.md     # Deep dive, <500 lines each
    └── topic-2.md
```

### 3. Enforcement Levels

- **block**: Must use skill before proceeding (guardrails)
- **suggest**: Appears as recommendation
- **warn**: Advisory only

### 4. Skip Conditions

Allow users to bypass when appropriate:

```json
"skipConditions": {
  "sessionSkillUsed": true,
  "fileMarkers": ["@skip-validation"],
  "envOverride": "SKIP_DESIGN_CHECK"
}
```

---

## What This Solves

### Before (Your Current State)

- Skills don't activate automatically
- Have to remember which command/rule to use
- Large files hit context limits
- No agents for complex tasks

### After (With These Changes)

- Skills suggest themselves based on context
- Hooks trigger skills at the right time
- Modular skills stay under context limits
- Agents streamline complex tasks
- Consistent patterns via guardrails

---

## Next Steps

1. **Start small**: Implement Priority 1 (hooks) first
2. **Test early**: Verify auto-activation works before proceeding
3. **Iterate**: Add skills and agents incrementally
4. **Customize**: Adjust triggers based on your actual workflow

Would you like me to help implement any of these changes?
