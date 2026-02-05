#!/bin/bash
# Post Tool Use Tracker Hook
# Tracks file changes for context management

# Get the tool input from stdin
INPUT=$(cat)

# Extract file path from the tool input
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Determine project directory
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
STATE_DIR="$PROJECT_DIR/.claude/hooks/state"

# Create state directory if it doesn't exist
mkdir -p "$STATE_DIR"

# Track the modified file
TRACKER_FILE="$STATE_DIR/modified-files.json"

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Determine file category based on path
CATEGORY="other"
case "$FILE_PATH" in
    *"/components/"*) CATEGORY="component" ;;
    *"/app/api/"*) CATEGORY="api" ;;
    *"/app/"*) CATEGORY="page" ;;
    *"/lib/"*) CATEGORY="lib" ;;
    *"/hooks/"*) CATEGORY="hook" ;;
    *"/types/"*) CATEGORY="types" ;;
    *"/styles/"*) CATEGORY="styles" ;;
    *"prisma/"*) CATEGORY="database" ;;
    *".test."*|*".spec."*) CATEGORY="test" ;;
esac

# Append to tracker (simple JSON lines format)
echo "{\"path\":\"$FILE_PATH\",\"category\":\"$CATEGORY\",\"timestamp\":\"$TIMESTAMP\"}" >> "$TRACKER_FILE"

# Keep only last 100 entries to prevent file bloat
if [ -f "$TRACKER_FILE" ]; then
    tail -100 "$TRACKER_FILE" > "$TRACKER_FILE.tmp" && mv "$TRACKER_FILE.tmp" "$TRACKER_FILE"
fi

exit 0
