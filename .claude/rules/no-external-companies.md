# No External Company References

---
trigger: always
---

## Rule

Never reference external companies, competitors, or third-party brands in the codebase. This includes:

1. **Code comments** — No "inspired by [Company]" or "based on [Company] pattern"
2. **Documentation** — No competitor comparisons or mentions in CLAUDE.md or other docs
3. **Demo/placeholder data** — Use fictional company names instead of real companies
4. **Attribution links** — No external links to competitor products

## Approved References

- **Green Jobs Board** — Our parent product, always acceptable
- **Canopy** — This product name
- **Technical services** — Google Meet, Zoom, etc. when used as integration options (not as design inspiration)

## For Demo/Placeholder Data

Use fictional climate-focused company names instead of real companies:

| Instead of | Use |
|------------|-----|
| Tesla Energy | Solaris Energy Co. |
| SunPower | GreenLeaf Solar |
| Real company names | Aurora Climate, Evergreen Tech, TerraWatt, Verdant Systems |

## Internal Domain

Use `@canopy.co` for mock email addresses in demo data.

## Why This Matters

- Keeps the codebase brand-neutral and professional
- Avoids any implied endorsement or comparison
- Maintains clean intellectual property boundaries
- Ensures demo content is clearly fictional
