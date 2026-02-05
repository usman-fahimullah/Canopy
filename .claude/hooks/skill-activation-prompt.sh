#!/bin/bash
# Skill Activation Prompt Hook
# Runs on UserPromptSubmit to suggest relevant skills

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if tsx is available, fall back to npx tsx
if command -v tsx &> /dev/null; then
    tsx "$SCRIPT_DIR/skill-activation-prompt.ts"
elif command -v npx &> /dev/null; then
    npx --yes tsx "$SCRIPT_DIR/skill-activation-prompt.ts"
else
    # No TypeScript runner available, exit silently
    exit 0
fi
