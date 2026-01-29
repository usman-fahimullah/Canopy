# Quick Start: Using the Gradient System

**TL;DR:** Just pass pathways to `CollectionCard`. Gradient is automatic.

---

## 5-Second Quick Start

```tsx
import { CollectionCard } from "@/components/ui";

<CollectionCard
  title="My Collection"
  jobCount={100}
  pathways={["energy", "technology"]}
  href="/collections/my-collection"
/>
```

That's it! The gradient is automatically selected based on pathways.

---

## Common Use Cases

### 1. Basic Collection Card

```tsx
<CollectionCard
  title="Renewable Energy Jobs"
  jobCount={234}
  pathways={["energy", "technology"]}
  description="Build the clean energy future with solar, wind, and battery tech"
  href="/collections/renewable-energy"
/>
```

**Result:** Yellow gradient (green → yellow) because both pathways are yellow family.

---

### 2. Collection with Sponsor

```tsx
<CollectionCard
  title="Conservation & Research"
  jobCount={145}
  pathways={["conservation", "research"]}
  href="/collections/conservation"
  sponsor={{
    name: "3x5 World",
    logo: "/sponsors/3x5-world.png"
  }}
/>
```

**Result:** Blue gradient (green → blue) because both pathways are blue family.

---

### 3. Collection with Badges

```tsx
<CollectionCard
  title="Urban Development"
  jobCount={187}
  pathways={["construction", "urban-planning"]}
  href="/collections/urban"
  badges={[
    { label: "New", variant: "default" },
    { label: "Trending", variant: "accent" }
  ]}
/>
```

**Result:** Orange gradient (blue → orange) because both pathways are orange family.

---

### 4. Cross-Family Collection

```tsx
<CollectionCard
  title="Green Agriculture & Energy"
  jobCount={156}
  pathways={["agriculture", "energy"]}
  href="/collections/green-ag-energy"
/>
```

**Result:** Yellow gradient (green → yellow) because pathways are green + yellow families.

---

## Available Pathways

Copy-paste these exactly (case-sensitive):

```typescript
// Green family (5)
"agriculture"
"finance"
"forestry"
"transportation"
"waste-management"

// Blue family (4)
"conservation"
"research"
"sports"
"water"

// Orange family (4)
"construction"
"manufacturing"
"real-estate"
"urban-planning"

// Red family (3)
"education"
"medical"
"tourism"

// Yellow family (2)
"energy"
"technology"

// Purple family (3)
"arts-culture"
"media"
"policy"
```

---

## Gradient Selection Rules (Simplified)

### Rule 1: Same Family
If both pathways are from the same color family, use that family's gradient.

**Examples:**
- `["energy", "technology"]` → Both yellow → Yellow gradient
- `["conservation", "research"]` → Both blue → Blue gradient
- `["construction", "urban-planning"]` → Both orange → Orange gradient

### Rule 2: Different Families
If pathways are from different families, use a cross-family gradient.

**Examples:**
- `["agriculture", "energy"]` → Green + Yellow → Yellow gradient (green → yellow)
- `["construction", "water"]` → Orange + Blue → Orange gradient (blue → orange)
- `["education", "technology"]` → Red + Yellow → Yellow gradient (red → yellow)

### Rule 3: Order Doesn't Matter
Pathways are sorted alphabetically before gradient selection.

**Examples:**
- `["energy", "agriculture"]` = `["agriculture", "energy"]` → Same gradient
- `["water", "construction"]` = `["construction", "water"]` → Same gradient

---

## Using Gradients Directly (Advanced)

If you need a gradient outside of `CollectionCard`:

```tsx
import { getCollectionGradient } from "@/lib/gradient-utils";

const MyComponent = () => {
  const gradient = getCollectionGradient({
    pathways: ["agriculture", "energy"]
  });

  return (
    <div style={{ background: gradient }}>
      Custom component with gradient
    </div>
  );
};
```

---

## Grid Layout Example

```tsx
import { CollectionCard } from "@/components/ui";

const collections = [
  {
    title: "Renewable Energy",
    pathways: ["energy", "technology"],
    jobCount: 234,
  },
  {
    title: "Urban Development",
    pathways: ["construction", "urban-planning"],
    jobCount: 187,
  },
  {
    title: "Conservation Science",
    pathways: ["conservation", "research"],
    jobCount: 145,
  },
];

export function CollectionsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.title}
          title={collection.title}
          pathways={collection.pathways}
          jobCount={collection.jobCount}
          href={`/collections/${collection.title.toLowerCase().replace(/\s+/g, "-")}`}
        />
      ))}
    </div>
  );
}
```

---

## What You Get Automatically

✅ **Dynamic gradient** based on pathway combination
✅ **Correct gradient** regardless of pathway order
✅ **Semantic color mapping** (pathways match gradient families)
✅ **Type safety** (TypeScript autocomplete for pathways)
✅ **Accessible** (WCAG AA contrast on all gradients)
✅ **Responsive** (works on all screen sizes)
✅ **Dark mode ready** (all gradients use design tokens)

---

## What NOT to Do

❌ **Don't hardcode gradients**
```tsx
// BAD - Don't do this
<div style={{ background: "linear-gradient(135deg, #E5F1FF 0%, #0E5249 100%)" }}>
```

✅ **Use the system instead**
```tsx
// GOOD - Do this
<CollectionCard pathways={["conservation", "forestry"]} ... />
```

---

❌ **Don't skip pathways**
```tsx
// BAD - Collection card needs pathways
<CollectionCard
  title="My Collection"
  jobCount={100}
  pathways={[]}  // ❌ Empty pathways
  href="/..."
/>
```

✅ **Always provide at least one pathway**
```tsx
// GOOD
<CollectionCard
  title="My Collection"
  jobCount={100}
  pathways={["energy"]}  // ✅ At least one pathway
  href="/..."
/>
```

---

❌ **Don't use invalid pathway names**
```tsx
// BAD - "solar" is not a valid pathway
<CollectionCard pathways={["solar", "wind"]} ... />
```

✅ **Use valid pathway names**
```tsx
// GOOD - "energy" is valid
<CollectionCard pathways={["energy", "technology"]} ... />
```

---

## Testing Your Collections

### View Test Page
```bash
pnpm dev
# Visit: http://localhost:3000/test-collections
```

This page shows 16 example collections demonstrating:
- Same-family gradients
- Cross-family gradients
- Order normalization
- All 6 color families

### Test in Your App
1. Create a collection with pathways
2. Verify gradient matches expected family
3. Try reversing pathway order (should look identical)
4. Check text contrast (white text should be readable)

---

## Troubleshooting

### "My gradient doesn't look right"
- Check pathway names are spelled correctly (case-sensitive)
- Verify pathways are in the valid list (see "Available Pathways" above)
- Order doesn't matter, but family mapping does

### "Text is hard to read"
- All gradients use white text by default
- If you need dark text, you're using the wrong background
- Collection cards always use white text for accessibility

### "I want a custom gradient"
- Currently not supported in CollectionCard
- For custom gradients, create a custom component
- Or request a new gradient in the design system

---

## Next Steps

- **See all gradients**: `/GRADIENT_VISUAL_REFERENCE.md`
- **Learn the algorithm**: `/GRADIENT_MAPPING_STRATEGY.md`
- **Build collections**: `/COLLECTION_BUILDER_PLATFORM.md`
- **View implementation**: `/src/lib/gradient-utils.ts`
- **Test live**: `http://localhost:3000/test-collections`

---

## Need Help?

**Common Questions:**

**Q: How many pathways can I use?**
A: 1-3 recommended. System uses first 2 for gradient selection.

**Q: Can I use more than 3 pathways?**
A: Yes, but only first 2 affect gradient. Rest shown as tags.

**Q: What if I only have 1 pathway?**
A: Single pathway uses that family's same-family gradient.

**Q: Can I force a specific gradient?**
A: Not yet. System auto-generates based on pathways.

**Q: What if pathways are from 3+ families?**
A: System uses first 2 pathways (after alphabetical sort).

**Q: Are gradients responsive?**
A: Yes! Pure CSS, works on all screen sizes.

**Q: Do gradients work in dark mode?**
A: Yes! All gradients use design tokens that adapt.

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│ Collection Card Cheat Sheet             │
├─────────────────────────────────────────┤
│                                         │
│ Required Props:                         │
│  • title          (string)              │
│  • jobCount       (number)              │
│  • pathways       (PathwayType[])       │
│  • href           (string)              │
│                                         │
│ Optional Props:                         │
│  • description    (string)              │
│  • sponsor        (object)              │
│  • badges         (array)               │
│                                         │
│ Pathway Families:                       │
│  • Green:  agriculture, finance, ...    │
│  • Blue:   conservation, research, ...  │
│  • Orange: construction, urban-plan...  │
│  • Red:    education, medical, ...      │
│  • Yellow: energy, technology           │
│  • Purple: arts-culture, media, ...     │
│                                         │
│ Gradient Rules:                         │
│  1. Same family → Family gradient       │
│  2. Diff family → Cross-family grad.    │
│  3. Order normalized (alphabetical)     │
│                                         │
└─────────────────────────────────────────┘
```

---

**That's it! You're ready to create beautiful collection cards with automatic gradients.**
