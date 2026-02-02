# Fix Design Issues

Automatically fix common design system compliance issues identified by /design-scan or /design-review.

## Usage

```
/fix-design icons               # Replace wrong icon libraries with Phosphor
/fix-design colors              # Convert hardcoded colors to tokens
/fix-design spacing             # Convert hardcoded spacing to Tailwind scale
/fix-design buttons             # Replace raw <button> with <Button>
/fix-design inputs              # Replace raw <input> with design system inputs
/fix-design all                 # Fix all auto-fixable issues
```

## Instructions

### Icon Library Migration

When `icons` argument is provided:

1. **Find files with wrong icon imports:**
   ```bash
   grep -rl 'lucide-react\|@heroicons\|react-icons' --include='*.tsx' src/
   ```

2. **For each file, identify icons used:**
   ```bash
   # Extract icon names from imports
   grep -E "import \{.*\} from ['\"]lucide-react['\"]" src/path/file.tsx
   ```

3. **Map to Phosphor equivalents:**

   | Lucide/Heroicons | Phosphor Equivalent |
   | ---------------- | ------------------- |
   | `Search` | `MagnifyingGlass` |
   | `X`, `XMark` | `X` |
   | `Check` | `Check` |
   | `ChevronDown` | `CaretDown` |
   | `ChevronRight` | `CaretRight` |
   | `ChevronLeft` | `CaretLeft` |
   | `ChevronUp` | `CaretUp` |
   | `Plus` | `Plus` |
   | `Minus` | `Minus` |
   | `Trash`, `Trash2` | `Trash` |
   | `Edit`, `Pencil` | `PencilSimple` |
   | `Eye` | `Eye` |
   | `EyeOff` | `EyeSlash` |
   | `Mail` | `Envelope` |
   | `Phone` | `Phone` |
   | `User` | `User` |
   | `Users` | `Users` |
   | `Settings`, `Cog` | `Gear` |
   | `Home` | `House` |
   | `Calendar` | `Calendar` |
   | `Clock` | `Clock` |
   | `MapPin`, `Location` | `MapPin` |
   | `Link` | `Link` |
   | `ExternalLink` | `ArrowSquareOut` |
   | `Download` | `DownloadSimple` |
   | `Upload` | `UploadSimple` |
   | `Copy` | `Copy` |
   | `Filter` | `Funnel` |
   | `Sort` | `SortAscending` |
   | `MoreHorizontal` | `DotsThree` |
   | `MoreVertical` | `DotsThreeVertical` |
   | `ArrowLeft` | `ArrowLeft` |
   | `ArrowRight` | `ArrowRight` |
   | `ArrowUp` | `ArrowUp` |
   | `ArrowDown` | `ArrowDown` |
   | `Loader`, `Spinner` | `CircleNotch` |
   | `AlertCircle` | `WarningCircle` |
   | `AlertTriangle` | `Warning` |
   | `Info` | `Info` |
   | `CheckCircle` | `CheckCircle` |
   | `XCircle` | `XCircle` |
   | `Star` | `Star` |
   | `Heart` | `Heart` |
   | `Bookmark` | `BookmarkSimple` |
   | `Bell` | `Bell` |
   | `Send` | `PaperPlaneTilt` |
   | `MessageCircle` | `ChatCircle` |
   | `File` | `File` |
   | `Folder` | `Folder` |
   | `Image` | `Image` |
   | `Video` | `Video` |
   | `Mic` | `Microphone` |
   | `Volume` | `SpeakerHigh` |
   | `VolumeX` | `SpeakerSlash` |
   | `Maximize` | `ArrowsOut` |
   | `Minimize` | `ArrowsIn` |
   | `RefreshCw` | `ArrowsClockwise` |
   | `RotateCw` | `ArrowClockwise` |
   | `Zap` | `Lightning` |
   | `Sun` | `Sun` |
   | `Moon` | `Moon` |
   | `Menu` | `List` |
   | `Grid` | `SquaresFour` |
   | `List` | `ListBullets` |
   | `Layout` | `Layout` |

4. **Transform imports:**

   **Before:**
   ```tsx
   import { Search, X, ChevronDown } from "lucide-react";
   ```

   **After:**
   ```tsx
   import { MagnifyingGlass, X, CaretDown } from "@phosphor-icons/react";
   ```

5. **Update icon usage in JSX:**

   **Before:**
   ```tsx
   <Search className="h-4 w-4" />
   ```

   **After:**
   ```tsx
   <MagnifyingGlass size={16} />
   ```

   Note: Phosphor uses `size` prop instead of className for sizing.

---

### Color Token Conversion

When `colors` argument is provided:

1. **Find hardcoded colors:**
   ```bash
   grep -rnE '#[0-9A-Fa-f]{3,8}' --include='*.tsx' src/
   ```

2. **Map to appropriate tokens:**

   | Hardcoded | Token | Context |
   | --------- | ----- | ------- |
   | `#0A3D2C` | `--button-primary-background` | Primary buttons |
   | `#0E5249` | `--button-primary-background-hover` | Primary button hover |
   | `#CCE4FF` | `--button-secondary-background` | Secondary buttons |
   | `#FFFFFF` | `--background-default` | Page backgrounds |
   | `#FAF9F7` | `--background-subtle` | Card backgrounds |
   | `#1F1D1C` | `--foreground-default` | Primary text |
   | `#7A7671` | `--foreground-muted` | Secondary text |
   | `#A39D96` | `--foreground-subtle` | Tertiary text |
   | `#DC2626`, `#E90000` | `--foreground-error` | Error text |
   | `#16A34A`, `#3BA36F` | `--foreground-success` | Success text |
   | `#CA8A04`, `#B88A1D` | `--foreground-warning` | Warning text |
   | `#2563EB`, `#3369FF` | `--foreground-link` | Links |
   | `#E5DFD8` | `--border-default` | Default borders |
   | `#CCC6C0` | `--border-muted` | Muted borders |

3. **Transform:**

   **Before:**
   ```tsx
   <div className="bg-[#FAF9F7] text-[#1F1D1C] border-[#E5DFD8]">
   ```

   **After:**
   ```tsx
   <div className="bg-[var(--background-subtle)] text-[var(--foreground-default)] border-[var(--border-default)]">
   ```

---

### Spacing Conversion

When `spacing` argument is provided:

1. **Find hardcoded spacing:**
   ```bash
   grep -rnE '\[([\d]+)px\]' --include='*.tsx' src/
   ```

2. **Map to Tailwind scale:**

   | Pixels | Tailwind | Token |
   | ------ | -------- | ----- |
   | 4px | `1` | `--space-1` |
   | 8px | `2` | `--space-2` |
   | 12px | `3` | `--space-3` |
   | 16px | `4` | `--space-4` |
   | 20px | `5` | `--space-5` |
   | 24px | `6` | `--space-6` |
   | 32px | `8` | `--space-8` |
   | 40px | `10` | `--space-10` |
   | 48px | `12` | `--space-12` |
   | 64px | `16` | `--space-16` |

3. **Transform:**

   **Before:**
   ```tsx
   <div className="p-[24px] gap-[16px] mt-[32px]">
   ```

   **After:**
   ```tsx
   <div className="p-6 gap-4 mt-8">
   ```

4. **For border-radius:**

   | Pixels | Token |
   | ------ | ----- |
   | 4px | `--radius-sm` |
   | 6px | `--radius-md` |
   | 8px | `--radius-lg` |
   | 12px | `--radius-xl` / `--radius-card` |
   | 16px | `--radius-2xl` |
   | 24px | `--radius-3xl` |

   **Before:**
   ```tsx
   <div className="rounded-[16px]">
   ```

   **After:**
   ```tsx
   <div className="rounded-[var(--radius-2xl)]">
   ```

---

### Button Replacement

When `buttons` argument is provided:

1. **Find raw buttons:**
   ```bash
   grep -rn '<button' --include='*.tsx' src/
   ```

2. **Analyze each button's styling to determine variant:**

   | If it has... | Use variant |
   | ------------ | ----------- |
   | Green/dark background | `primary` |
   | Blue/light background | `secondary` |
   | Gray/neutral background | `tertiary` |
   | Red/destructive styling | `destructive` |
   | No background (text only) | `ghost` |
   | Border with no fill | `outline` |

3. **Transform:**

   **Before:**
   ```tsx
   <button
     className="rounded-lg bg-[#0A3D2C] px-4 py-2 text-white hover:bg-[#0E5249] disabled:opacity-50"
     onClick={handleClick}
     disabled={isLoading}
   >
     {isLoading ? "Loading..." : "Submit"}
   </button>
   ```

   **After:**
   ```tsx
   <Button
     variant="primary"
     onClick={handleClick}
     disabled={isLoading}
   >
     {isLoading ? "Loading..." : "Submit"}
   </Button>
   ```

4. **Add import if needed:**
   ```tsx
   import { Button } from "@/components/ui";
   ```

---

### Input Replacement

When `inputs` argument is provided:

1. **Find raw inputs:**
   ```bash
   grep -rn '<input' --include='*.tsx' src/
   ```

2. **Determine input type and map to component:**

   | Input type | Use Component |
   | ---------- | ------------- |
   | `type="text"` | `<Input>` |
   | `type="search"` | `<SearchInput>` |
   | `type="email"` | `<Input type="email">` |
   | `type="password"` | `<Input type="password">` |
   | `type="number"` | `<Input type="number">` |
   | `type="checkbox"` | `<Checkbox>` or `<CheckboxWithLabel>` |
   | `type="radio"` | `<RadioGroup>` |
   | Search with icon | `<SearchInput>` |
   | Input with error | `<InputWithMessage>` |

3. **Transform:**

   **Before:**
   ```tsx
   <input
     type="text"
     className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
     placeholder="Enter name"
     value={name}
     onChange={(e) => setName(e.target.value)}
   />
   ```

   **After:**
   ```tsx
   <Input
     placeholder="Enter name"
     value={name}
     onChange={(e) => setName(e.target.value)}
   />
   ```

---

## Safety Guidelines

1. **Always show changes before applying:**
   - Present a diff of proposed changes
   - Ask for confirmation before modifying files

2. **Create backup branch:**
   ```bash
   git checkout -b fix/design-$(date +%Y%m%d)
   ```

3. **Run verification after fixes:**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
   ```

4. **Verify dark mode:**
   - After color token changes, check both light and dark themes
   - Flag any visual regressions

5. **Commit incrementally:**
   - Group related fixes (e.g., all icon migrations together)
   - Use descriptive commit messages

## Example Session

```
User: /fix-design icons

Claude: I found 12 files using non-Phosphor icon libraries:

Lucide React (8 files):
- src/components/Header.tsx (Search, Menu, X)
- src/app/jobs/page.tsx (Filter, ChevronDown)
- src/components/Sidebar.tsx (Home, Settings, User)
...

Heroicons (4 files):
- src/components/Alert.tsx (ExclamationCircle)
...

Proposed changes:
1. Replace lucide-react imports with @phosphor-icons/react
2. Update icon names to Phosphor equivalents
3. Change className sizing to size prop

Example transformation (Header.tsx):
```diff
- import { Search, Menu, X } from "lucide-react";
+ import { MagnifyingGlass, List, X } from "@phosphor-icons/react";

- <Search className="h-5 w-5" />
+ <MagnifyingGlass size={20} />
```

Should I proceed with these changes?

User: yes

Claude: ✓ Updated src/components/Header.tsx
✓ Updated src/app/jobs/page.tsx
...

Running verification:
✓ pnpm lint - passed
✓ pnpm type-check - passed

All icon migrations complete!
```
