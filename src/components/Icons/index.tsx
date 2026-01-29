"use client";

import { forwardRef, SVGProps } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Re-export Phosphor Icons with Trails naming conventions
// All icons use Fill weight by default as per ICON_MAPPING.md
// ============================================

// Arrows - Bold weight
export {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowCircleUp,
  ArrowCircleDown,
  ArrowCircleLeft,
  ArrowCircleRight,
  ArrowArcLeft,
  ArrowArcRight,
  ArrowSquareOut,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowsDownUp,
  ArrowsLeftRight,
  ArrowClockwise,
  ArrowLineDown,
  ArrowBendUpLeft,
} from "@phosphor-icons/react";

// Carets - Fill weight
export {
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUpDown,
} from "@phosphor-icons/react";

// Actions - Mixed weights
export {
  Plus,
  Minus,
  Check,
  CheckCircle,
  Checks,
  Copy,
  Trash,
  Download,
  Upload,
  Export,
  Link,
  LinkSimple,
  X,
  XCircle,
} from "@phosphor-icons/react";

// Objects - Fill weight
export {
  Bookmark,
  BookmarkSimple,
  Heart,
  Star,
  Calendar,
  CalendarDots,
  Clock,
  Timer,
  Eye,
  EyeSlash,
  Lock,
  LockOpen,
  Shield,
  ShieldCheckered,
  ShieldPlus,
  ShieldStar,
  Key,
  Tag,
  Flag,
  Gift,
  Envelope,
  EnvelopeSimple,
  Chat,
  Megaphone,
  Broadcast,
  Phone,
  PencilSimple,
  Archive,
  ChartLineUp,
} from "@phosphor-icons/react";

// Climate/Industry - Fill weight
export {
  Tree,
  Leaf,
  Plant,
  Wind,
  Globe,
  GlobeHemisphereWest,
  Mountains,
  Drop,
  Sun,
  Fish,
  Atom,
  Lightning,
  Carrot,
  Recycle,
  SolarPanel,
  BatteryCharging,
  BatteryFull,
} from "@phosphor-icons/react";

// Buildings & Places - Fill weight
export {
  Building,
  House,
  Bank,
  Warehouse,
  Bridge,
  Barricade,
} from "@phosphor-icons/react";

// People & Work - Fill weight
export {
  User,
  Users,
  GraduationCap,
  Briefcase,
  BriefcaseMetal,
  Certificate,
  Handshake,
  Scales,
  Gavel,
} from "@phosphor-icons/react";

// Data & Charts - Fill weight
export {
  ChartBar,
  ChartBarHorizontal,
  ChartDonut,
  ChartLine,
  GridFour,
  Kanban,
  Stack,
} from "@phosphor-icons/react";

// Status & Feedback - Fill weight
export {
  Info,
  Warning,
  WarningOctagon,
  Circle,
  CircleDashed,
  ThumbsUp,
  ThumbsDown,
  Smiley,
  SmileySad,
  SmileyMeh,
  SealCheck,
} from "@phosphor-icons/react";

// Text Formatting - Bold weight
export {
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
  TextHOne,
  TextHTwo,
  TextHThree,
  TextIndent,
  TextOutdent,
  TextSubscript,
  TextSuperscript,
  ListBullets,
  ListNumbers,
  ListChecks,
  ListDashes,
  Quotes,
  Code,
  CodeBlock,
  Table,
  Image,
  LineSegment,
  At,
  ArrowsOut,
} from "@phosphor-icons/react";

// Files - Fill weight
export {
  File,
  FileDoc,
  FilePdf,
  FileJpg,
  FilePng,
  Folder,
  FolderOpen,
  FolderSimple,
  Clipboard,
  Note,
  NotePencil,
  Notebook,
  Notepad,
  Books,
} from "@phosphor-icons/react";

// Alias for backward compatibility
import { Folder as PhFolder } from "@phosphor-icons/react";
export const FolderNotch = PhFolder;

// Social Media Logos - Fill weight
export {
  DiscordLogo,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  ThreadsLogo,
  TwitterLogo,
  XLogo,
} from "@phosphor-icons/react";

// Devices & Tech - Fill weight
export {
  DesktopTower,
  Television,
  Camera,
  Printer,
  Robot,
  Circuitry,
  Network,
} from "@phosphor-icons/react";

// Navigation - Mixed weights
export {
  MagnifyingGlass,
  Funnel,
  Gear,
  List,
  DotsThree,
  DotsThreeVertical,
  PaperPlaneRight,
  Bell,
  Pencil,
  SidebarSimple,
  SignOut,
  Tabs,
} from "@phosphor-icons/react";

// Miscellaneous - Fill weight
export {
  Binoculars,
  Flask,
  FirstAidKit,
  Palette,
  PiggyBank,
  Popcorn,
  Confetti,
  Basketball,
  Train,
  Car,
  Hourglass,
  Nut,
  Wrench,
  Target,
  ArrowCounterClockwise,
  MapPin,
  ShareNetwork,
  Question,
} from "@phosphor-icons/react";

// Alias for Share
import { ShareNetwork as PhShareNetwork } from "@phosphor-icons/react";
export const Share = PhShareNetwork;

// ============================================
// Renamed exports for Trails domain naming
// These provide aliases matching the ICON_MAPPING.md
// ============================================

// Import individual icons for renaming
import {
  Carrot as PhCarrot,
  Lightning as PhLightning,
  Briefcase as PhBriefcase,
  BriefcaseMetal as PhBriefcaseMetal,
  User as PhUser,
  Gear as PhGear,
  MagnifyingGlass as PhMagnifyingGlass,
  Funnel as PhFunnel,
  Envelope as PhEnvelope,
  House as PhHouse,
  Pencil as PhPencil,
  X as PhX,
  XCircle as PhXCircle,
  File as PhFile,
  Bell as PhBell,
  List as PhList,
  DotsThree as PhDotsThree,
  DotsThreeVertical as PhDotsThreeVertical,
  EyeSlash as PhEyeSlash,
  PaperPlaneRight as PhPaperPlaneRight,
  ArrowBendUpLeft as PhArrowBendUpLeft,
  Timer as PhTimer,
  WarningOctagon as PhWarningOctagon,
  SealCheck as PhSealCheck,
  ArrowUp as PhArrowUp,
  ArrowDown as PhArrowDown,
  ArrowLeft as PhArrowLeft,
  ArrowRight as PhArrowRight,
  CaretUp as PhCaretUp,
  CaretDown as PhCaretDown,
  CaretLeft as PhCaretLeft,
  CaretRight as PhCaretRight,
  TextB as PhTextB,
  TextItalic as PhTextItalic,
  TextUnderline as PhTextUnderline,
  TextStrikethrough as PhTextStrikethrough,
  TextAlignLeft as PhTextAlignLeft,
  TextAlignCenter as PhTextAlignCenter,
  TextAlignRight as PhTextAlignRight,
  ListBullets as PhListBullets,
  ListNumbers as PhListNumbers,
  ListDashes as PhListDashes,
  ArrowCounterClockwise as PhArrowCounterClockwise,
  ArrowClockwise as PhArrowClockwise,
  ArrowArcLeft as PhArrowArcLeft,
  ArrowArcRight as PhArrowArcRight,
  // Additional toolbar icons
  TextHOne as PhTextHOne,
  TextHTwo as PhTextHTwo,
  TextHThree as PhTextHThree,
  TextIndent as PhTextIndent,
  TextOutdent as PhTextOutdent,
  TextSubscript as PhTextSubscript,
  TextSuperscript as PhTextSuperscript,
  Quotes as PhQuotes,
  Code as PhCode,
  CodeBlock as PhCodeBlock,
  Table as PhTable,
  Image as PhImage,
  LineSegment as PhLineSegment,
  At as PhAt,
  ArrowsOut as PhArrowsOut,
} from "@phosphor-icons/react";

// Domain-specific aliases
export const Agriculture = PhCarrot;
export const Energy = PhLightning;
export const MetalBriefcase = PhBriefcaseMetal;
export const Profile = PhUser;
export const Settings = PhGear;
export const Search = PhMagnifyingGlass;
export const Filter = PhFunnel;
export const Mail = PhEnvelope;
export const Home = PhHouse;
export const Edit = PhPencil;
export const Close = PhX;
export const CloseFill = PhXCircle;
export const Document = PhFile;
export const Notification = PhBell;
export const Menu = PhList;
export const MenuDots = PhDotsThree;
export const MenuDotsVertical = PhDotsThreeVertical;
export const EyeHidden = PhEyeSlash;
export const Send = PhPaperPlaneRight;
export const Reply = PhArrowBendUpLeft;
export const Countdown = PhTimer;
export const Critical = PhWarningOctagon;
export const Verified = PhSealCheck;

// Chevron aliases (from Caret)
export const ChevronUp = PhCaretUp;
export const ChevronDown = PhCaretDown;
export const ChevronLeft = PhCaretLeft;
export const ChevronRight = PhCaretRight;

// More/MoreHorizontal/MoreVertical aliases
export const MoreHorizontal = PhDotsThree;
export const MoreVertical = PhDotsThreeVertical;

// Toolbar icon aliases - Text formatting
export const Bold = PhTextB;
export const Italic = PhTextItalic;
export const Underline = PhTextUnderline;
export const Strikethrough = PhTextStrikethrough;
export const AlignLeft = PhTextAlignLeft;
export const AlignCenter = PhTextAlignCenter;
export const AlignRight = PhTextAlignRight;
export const ListBullet = PhListBullets;
export const ListNumbered = PhListNumbers;
export const ListDash = PhListDashes;
export const Undo = PhArrowArcLeft;
export const Redo = PhArrowArcRight;

// Toolbar icon aliases - Headings
export const Heading1 = PhTextHOne;
export const Heading2 = PhTextHTwo;
export const Heading3 = PhTextHThree;

// Toolbar icon aliases - Advanced formatting
export const Indent = PhTextIndent;
export const Outdent = PhTextOutdent;
export const Subscript = PhTextSubscript;
export const Superscript = PhTextSuperscript;
export const Quote = PhQuotes;
export const InlineCode = PhCode;
export const CodeBlockIcon = PhCodeBlock;

// Toolbar icon aliases - Insert actions
export const InsertTable = PhTable;
export const InsertImage = PhImage;
export const HorizontalRule = PhLineSegment;
export const Mention = PhAt;
export const Fullscreen = PhArrowsOut;

// External link alias
import { ArrowSquareOut as PhArrowSquareOut } from "@phosphor-icons/react";
export const ExternalLink = PhArrowSquareOut;

// Heart outline alias
import { Heart as PhHeart } from "@phosphor-icons/react";
export const HeartOutline = PhHeart; // Use regular weight for outline effect

// ============================================
// Icon props type for custom icons
// ============================================
export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size - defaults to 24 */
  size?: number | string;
  /** Additional class names */
  className?: string;
}

// ============================================
// Custom Icons (Not in Phosphor)
// These are custom to Trails and don't have Phosphor equivalents
// ============================================

/**
 * Base Icon wrapper component for custom SVG icons
 */
const createIcon = (path: React.ReactNode, displayName: string) => {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, className, ...props }, ref) => (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        {...props}
      >
        {path}
      </svg>
    )
  );
  Icon.displayName = displayName;
  return Icon;
};

// Pathways Plus - Custom Green Jobs Board brand icon
export const PathwaysPlus = createIcon(
  <>
    <path
      d="M11.9999 21.8182C17.4235 21.8182 21.8181 17.4236 21.8181 12C21.8181 6.57647 17.4235 2.18182 11.9999 2.18182C6.57642 2.18182 2.18176 6.57647 2.18176 12C2.18176 17.4236 6.57642 21.8182 11.9999 21.8182Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 8.18182V15.8182"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.18176 12H15.8181"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>,
  "PathwaysPlus"
);

// Treehouse - Custom climate/nature icon
export const Treehouse = createIcon(
  <>
    <path
      d="M12 2L3 9V22H9V16H15V22H21V9L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M9 22V18C9 16.8954 9.89543 16 11 16H13C14.1046 16 15 16.8954 15 18V22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </>,
  "Treehouse"
);

// NoIcon - Empty/placeholder state
export const NoIcon = createIcon(
  <path
    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
    fill="currentColor"
    fillOpacity="0.3"
  />,
  "NoIcon"
);

// Poppy - Custom botanical icon
export const Poppy = createIcon(
  <>
    <path
      d="M12 21C12 21 12 15 12 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 12C14.5 9.5 17 8 17 5.5C17 3.5 15.5 2 13 2C11 2 10 3 10 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M12 12C9.5 9.5 7 8 7 5.5C7 3.5 8.5 2 11 2C13 2 14 3 14 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse cx="12" cy="12" rx="3" ry="2" fill="currentColor" />
  </>,
  "Poppy"
);

// Symbol - Custom symbol icon
export const Symbol = createIcon(
  <>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>,
  "Symbol"
);

// Bluesky - Custom social media icon (not in Phosphor)
export const Bluesky = createIcon(
  <path
    d="M12 2.25C9.04 2.25 6.5 4.24 4.75 6.5C4 7.42 3.25 8.67 2.5 10.17C2.17 10.83 2.5 11.67 3.17 12C4 12.5 4.83 12.17 5.33 11.5C5.67 11 6 10.5 6.33 10.17C6.67 11 6.83 12 6.5 13.17C6 15 6.5 16.5 8 17.5C9.5 18.5 11 18.5 12 17.5C13 18.5 14.5 18.5 16 17.5C17.5 16.5 18 15 17.5 13.17C17.17 12 17.33 11 17.67 10.17C18 10.5 18.33 11 18.67 11.5C19.17 12.17 20 12.5 20.83 12C21.5 11.67 21.83 10.83 21.5 10.17C20.75 8.67 20 7.42 19.25 6.5C17.5 4.24 14.96 2.25 12 2.25Z"
    fill="currentColor"
  />,
  "Bluesky"
);

// Diamond icons for badges
export const Diamond = createIcon(
  <path
    d="M12 2L2 12L12 22L22 12L12 2ZM12 4.83L19.17 12L12 19.17L4.83 12L12 4.83Z"
    fill="currentColor"
  />,
  "Diamond"
);

export const DiamondFilled = createIcon(
  <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" />,
  "DiamondFilled"
);

// Warning Diamond - diamond shape with exclamation mark inside (for Warning badge)
export const WarningDiamond = createIcon(
  <>
    <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" />
    <path d="M11 8H13V13H11V8ZM11 15H13V17H11V15Z" fill="white" />
  </>,
  "WarningDiamond"
);

// InfoCircle alias
import { Info as PhInfo } from "@phosphor-icons/react";
export const InfoCircle = PhInfo;

// AlertTriangle alias for Warning
export const AlertTriangle = PhWarningOctagon;
