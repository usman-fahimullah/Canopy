# Trails Icon Mapping to Phosphor Icons

This document maps Trails's custom icon names to their Phosphor equivalents.
All icons are sourced from [Phosphor Icons](https://phosphoricons.com/).

## Weight Reference
- **Fill** - Solid filled icons
- **Bold** - Thicker strokes (2px)
- **Regular** - Standard weight (1.5px)

---

## Renamed Icons (Domain-Specific)

These icons have been renamed for climate/ATS domain context:

| Trails Name | Phosphor Name | Weight | Use Case |
|-------------|---------------|--------|----------|
| Agriculture | Carrot | Fill | Climate sector - farming/agriculture |
| Energy | Lightning | Fill | Climate sector - renewable energy |
| Brief-case | Briefcase | Fill | Jobs/careers |
| Metal Briefcase | BriefcaseMetal | Fill | Jobs/careers variant |
| Profile | User | Fill | User profiles |
| Settings | Gear | Fill | Settings/preferences |
| Search | MagnifyingGlass | Bold | Search functionality |
| Filter | Funnel | Fill | Filtering content |
| Mail | Envelope | Fill | Email/messaging |
| Home | House | Fill | Home/dashboard |
| Edit | Pencil | Bold | Edit actions |
| Close | X | Bold | Close/dismiss |
| Close-fill | XCircle | Fill | Close with emphasis |
| Document | File | Fill | Documents/files |
| Notification | Bell | Fill | Notifications |
| Menu | List | Bold | Menu/navigation |
| Menu-Dots | DotsThree | Bold | More options (horizontal) |
| Menu-Dots-Vertical | DotsThreeVertical | Bold | More options (vertical) |
| Eye-hidden | EyeSlash | Fill | Hide/show toggle |
| Send | PaperPlaneRight | Fill | Send action |
| Reply | ArrowBendUpLeft | Bold | Reply action |
| Countdown | Timer | Fill | Countdown/timer |
| Critical | WarningOctagon | Fill | Critical alerts |
| Verified | SealCheck | Fill | Verification badge |

---

## Direct Matches (Same Name)

These icons use the same name as Phosphor:

### Arrows
| Icon | Weight |
|------|--------|
| ArrowUp, ArrowDown, ArrowLeft, ArrowRight | Bold |
| ArrowCircleUp, ArrowCircleDown, etc. | Fill |
| ArrowArcLeft, ArrowArcRight | Bold |
| ArrowSquareOut | Bold |
| ArrowUUpLeft, ArrowUUpRight | Bold |
| ArrowsDownUp, ArrowsLeftRight | Bold |
| ArrowClockwise | Bold |
| ArrowLineDown | Bold |
| CaretUp, CaretDown, CaretLeft, CaretRight | Fill |
| CaretUpDown | Fill |

### Actions
| Icon | Weight |
|------|--------|
| Plus | Bold |
| Plus-fill | Fill |
| Minus | Bold |
| Check | Bold |
| CheckCircle | Fill |
| Checks | Bold |
| Copy | Fill |
| Trash | Fill |
| Download | Bold |
| Upload | Bold |
| Export | Bold |
| Link | Bold |
| LinkSimple | Bold |

### Objects
| Icon | Weight |
|------|--------|
| Bookmark | Fill |
| Heart | Fill |
| HeartOutline | Regular |
| Star | Fill |
| Calendar | Fill |
| CalendarDots | Fill |
| Clock | Fill |
| Timer | Fill |
| Eye | Fill |
| Lock | Fill |
| LockOpen | Fill |
| Shield | Fill |
| ShieldCheckered | Fill |
| ShieldPlus | Fill |
| ShieldStar | Fill |
| Key | Fill |
| Tag | Fill |
| Flag | Fill |
| Gift | Fill |

### Communication
| Icon | Weight |
|------|--------|
| Envelope | Fill |
| ChatBubble (Chat) | Fill |
| Megaphone | Fill |
| Broadcast | Fill |

### Climate/Industry
| Icon | Weight |
|------|--------|
| Tree | Fill |
| Wind | Fill |
| Globe | Fill |
| Mountains | Fill |
| Drop | Fill |
| Sun | Fill |
| Fish | Fill |
| Atom | Fill |

### Buildings & Places
| Icon | Weight |
|------|--------|
| Building | Fill |
| House | Fill |
| Bank | Fill |
| Warehouse | Fill |
| Bridge | Fill |
| Barricade | Fill |

### People & Work
| Icon | Weight |
|------|--------|
| Users | Fill |
| GraduationCap | Fill |
| Briefcase | Fill |
| Certificate | Fill |
| Handshake | Fill |
| Scales | Fill |
| Gavel | Fill |

### Data & Charts
| Icon | Weight |
|------|--------|
| ChartBar | Fill |
| ChartBarHorizontal | Fill |
| ChartDonut | Fill |
| ChartLine | Bold |
| GridFour | Fill |
| Kanban | Fill |
| Stack | Fill |

### Status & Feedback
| Icon | Weight |
|------|--------|
| Info | Fill |
| Warning | Fill |
| Circle | Fill |
| CircleDashed | Bold |
| ThumbsUp | Fill |
| ThumbsDown | Fill |
| Smiley variants | Fill |

### Text Formatting
| Icon | Weight |
|------|--------|
| TextAlignLeft | Bold |
| TextAlignCenter | Bold |
| TextAlignRight | Bold |
| TextB | Bold |
| TextItalic | Bold |
| TextStrikethrough | Bold |
| TextUnderline | Bold |
| ListBullets | Bold |
| ListNumbers | Bold |
| ListChecks | Bold |

### Files
| Icon | Weight |
|------|--------|
| File | Fill |
| FileDoc | Fill |
| FilePdf | Fill |
| FileJpg | Fill |
| FilePng | Fill |
| FolderNotch | Fill |
| Clipboard | Fill |
| Note | Fill |
| NotePencil | Fill |
| Notebook | Fill |
| Notepad | Fill |
| Books | Fill |

### Social Media Logos
| Icon | Phosphor Name | Weight |
|------|---------------|--------|
| Discord | DiscordLogo | Fill |
| Facebook | FacebookLogo | Fill |
| Instagram | InstagramLogo | Fill |
| LinkedIn | LinkedinLogo | Fill |
| Threads | ThreadsLogo | Fill |
| Twitter | TwitterLogo | Fill |
| Bluesky | (custom) | Fill |
| x-logo | XLogo | Fill |

### Devices & Tech
| Icon | Weight |
|------|--------|
| DesktopTower | Fill |
| Television | Fill |
| Camera | Fill |
| Printer | Fill |
| Robot | Fill |
| Circuitry | Fill |
| Network | Fill |

### Miscellaneous
| Icon | Weight |
|------|--------|
| Binoculars | Fill |
| Flask | Fill |
| FirstAidKit | Fill |
| Palette | Fill |
| PiggyBank | Fill |
| Popcorn | Fill |
| Confetti | Fill |
| Basketball | Fill |
| Train | Fill |
| Car | Fill |
| Hourglass | Fill |
| Nut | Fill |
| Wrench | Fill |
| Target | Fill |
| Tabs | Fill |
| SidebarSimple | Bold |
| SignOut | Bold |

---

## Custom Icons (Not in Phosphor)

These icons are custom to Trails and don't have Phosphor equivalents:

| Icon | Purpose |
|------|---------|
| Pathways Plus | Green Jobs Board brand icon |
| Treehouse | Custom climate/nature icon |
| No-Icon | Empty/placeholder state |
| poppy | Custom botanical icon |
| Symbol | Custom symbol |
| Calendar-1, Camera-1, Megaphone-1, Shield-1 | Variants |

---

## Usage in Code

```tsx
// Import from custom icons
import { Agriculture, Energy, Search } from "@/components/Icons";

// Or use Phosphor React directly for additional icons
import { Carrot, Lightning, MagnifyingGlass } from "@phosphor-icons/react";
```

## Icon Sizing

| Context | Size | Tailwind |
|---------|------|----------|
| Button (default) | 16px | `h-4 w-4` |
| Button (large) | 20px | `h-5 w-5` |
| Standalone | 24px | `h-6 w-6` |
| Large display | 32px | `h-8 w-8` |
