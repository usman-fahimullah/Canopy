# No External Company References

---

## trigger: always

## Rule

Never reference external companies, competitors, or third-party brands in the codebase. This includes:

1. **Code comments** — No "inspired by [Company]" or "based on [Company] pattern"
2. **Documentation** — No competitor comparisons or mentions in CLAUDE.md or other docs
3. **Demo/placeholder data** — Use fictional company names instead of real companies
4. **Attribution links** — No external links to competitor products

## Our Company & Products

**Green Jobs Board** is the parent company — a climate recruitment platform with three products:

| Product              | Description           | Always acceptable to reference |
| -------------------- | --------------------- | ------------------------------ |
| **Green Jobs Board** | Job seeker platform   | Yes                            |
| **Canopy**           | ATS app for employers | Yes                            |
| **Candid**           | Career coaching app   | Yes                            |

These are our own products and should be referenced freely across the codebase.

## Other Approved References

- **Technical services** — Google Meet, Zoom, Cal.com, etc. when used as integration options (not as design inspiration)
- **Trails Design System** — Our internal design system name

## For Demo/Placeholder Data

Use fictional climate-focused company names instead of real companies:

| Instead of         | Use                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| Real company names | Solaris Energy Co., GreenLeaf Solar, Aurora Climate, Evergreen Tech, TerraWatt, Verdant Systems |

## Internal Domains

Our actual domain is `greenjobsboard.us`. Use these for mock emails in demo data:

- Use `@greenjobsboard.us` for platform-level mock emails
- Use `@canopy.greenjobsboard.us` for mock employer/ATS emails
- Use `@candid.greenjobsboard.us` for coaching-related mock emails

## Why This Matters

- Keeps the codebase brand-neutral and professional
- Avoids any implied endorsement or comparison
- Maintains clean intellectual property boundaries
- Ensures demo content is clearly fictional
