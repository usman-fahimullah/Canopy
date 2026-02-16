# /lesson — Capture a Lesson Learned

Record a mistake, discovery, or pattern to prevent repeating it.

## Usage

```
/lesson [description of what happened and what to do differently]
```

## Process

1. **Parse the lesson** — Extract: what went wrong, root cause, fix/rule
2. **Append to lessons-learned.md** — Add a new row to the table in `.claude/rules/lessons-learned.md`
3. **Confirm** — Show the added entry

## Format

Add entries in this format to the Lessons table:

```markdown
| YYYY-MM-DD | What Went Wrong | Root Cause | Fix / Rule |
```

## Example

```
/lesson Dark mode broke on the settings page because I used bg-white instead of bg-[var(--background-default)]
```

Produces:

```
| 2026-02-15 | Dark mode broke on settings page | Used bg-white (hardcoded) instead of token | Always use --background-default for page backgrounds |
```

## Steps

1. Read the current `.claude/rules/lessons-learned.md`
2. Parse the user's description into the 3 columns
3. Get today's date
4. Append the new row to the table (create the table header if first entry)
5. Write the updated file
6. Confirm: "Lesson recorded. This will be loaded on every future prompt."
