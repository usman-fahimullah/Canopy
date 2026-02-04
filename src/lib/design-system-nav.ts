// Centralized navigation configuration for the design system
// This is the single source of truth for all navigation items

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  href: string;
  items: NavItem[];
}

export const foundationsNav: NavItem[] = [
  {
    id: "colors",
    label: "Colors",
    href: "/design-system/foundations/colors",
    description: "Color palettes and semantic colors",
    children: [
      {
        id: "colors-primary",
        label: "Primary",
        href: "/design-system/foundations/colors#colors-primary",
      },
      {
        id: "colors-neutral",
        label: "Neutral",
        href: "/design-system/foundations/colors#colors-neutral",
      },
      {
        id: "colors-semantic",
        label: "Semantic",
        href: "/design-system/foundations/colors#colors-semantic",
      },
      {
        id: "colors-secondary",
        label: "Secondary",
        href: "/design-system/foundations/colors#colors-secondary",
      },
    ],
  },
  {
    id: "typography",
    label: "Typography",
    href: "/design-system/foundations/typography",
    description: "Type scale and font weights",
    children: [
      {
        id: "typography-scale",
        label: "Type Scale",
        href: "/design-system/foundations/typography#typography-scale",
      },
      {
        id: "typography-weights",
        label: "Weights",
        href: "/design-system/foundations/typography#typography-weights",
      },
    ],
  },
  {
    id: "spacing",
    label: "Spacing",
    href: "/design-system/foundations/spacing",
    description: "Spacing scale and usage",
  },
  {
    id: "shadows",
    label: "Shadows",
    href: "/design-system/foundations/shadows",
    description: "Elevation and shadow system",
  },
  {
    id: "borders",
    label: "Borders & Radius",
    href: "/design-system/foundations/borders",
    description: "Border radius tokens",
  },
  {
    id: "motion",
    label: "Motion",
    href: "/design-system/foundations/motion",
    description: "Animation and transition tokens",
  },
];

export const componentsNav: NavItem[] = [
  {
    id: "buttons",
    label: "Buttons",
    href: "/design-system/components/buttons",
    description: "Action triggers and CTAs",
  },
  {
    id: "form-controls",
    label: "Form Controls",
    href: "/design-system/components/form-controls",
    description: "Inputs, selects, and form elements",
    children: [
      { id: "input", label: "Input", href: "/design-system/components/input" },
      { id: "textarea", label: "Textarea", href: "/design-system/components/textarea" },
      { id: "dropdown", label: "Dropdown", href: "/design-system/components/dropdown" },
      { id: "checkbox", label: "Checkbox", href: "/design-system/components/checkbox" },
      { id: "radio-group", label: "Radio Group", href: "/design-system/components/radio-group" },
      { id: "switch", label: "Switch", href: "/design-system/components/switch" },
      { id: "slider", label: "Slider", href: "/design-system/components/slider" },
      {
        id: "segmented-controller",
        label: "Segmented Controller",
        href: "/design-system/components/segmented-controller",
      },
      { id: "search-input", label: "Search Input", href: "/design-system/components/search-input" },
      { id: "chip", label: "Chip", href: "/design-system/components/chip" },
      { id: "label", label: "Label", href: "/design-system/components/label" },
      { id: "combobox", label: "Combobox", href: "/design-system/components/combobox" },
      { id: "time-picker", label: "Time Picker", href: "/design-system/components/time-picker" },
      { id: "date-picker", label: "Date Picker", href: "/design-system/components/date-picker" },
      { id: "file-upload", label: "File Upload", href: "/design-system/components/file-upload" },
      {
        id: "mention-input",
        label: "Mention Input",
        href: "/design-system/components/mention-input",
      },
    ],
  },
  {
    id: "data-display",
    label: "Data Display",
    href: "/design-system/components/data-display",
    description: "Badges, avatars, cards, and indicators",
    children: [
      { id: "badge", label: "Badge", href: "/design-system/components/badge" },
      { id: "avatar", label: "Avatar", href: "/design-system/components/avatar" },
      { id: "card", label: "Card", href: "/design-system/components/card" },
      { id: "toast", label: "Toast", href: "/design-system/components/toast" },
      { id: "alert", label: "Alert", href: "/design-system/components/alert" },
      { id: "banner", label: "Banner", href: "/design-system/components/banner" },
      {
        id: "inline-message",
        label: "Inline Message",
        href: "/design-system/components/inline-message",
      },
      {
        id: "notification-badge",
        label: "Notification Badge",
        href: "/design-system/components/notification-badge",
      },
      { id: "progress", label: "Progress", href: "/design-system/components/progress" },
      {
        id: "progress-meter",
        label: "Progress Meter",
        href: "/design-system/components/progress-meter",
      },
      { id: "list-status", label: "List Status", href: "/design-system/components/list-status" },
      { id: "skeleton", label: "Skeleton", href: "/design-system/components/skeleton" },
      { id: "empty-state", label: "Empty State", href: "/design-system/components/empty-state" },
      { id: "stat-card", label: "Stat Card", href: "/design-system/components/stat-card" },
      { id: "timeline", label: "Timeline", href: "/design-system/components/timeline" },
    ],
  },
  {
    id: "overlays",
    label: "Overlays",
    href: "/design-system/components/overlays",
    description: "Dialogs, modals, and tooltips",
    children: [
      { id: "dialog", label: "Dialog", href: "/design-system/components/dialog" },
      { id: "modal", label: "Modal", href: "/design-system/components/modal" },
      { id: "tooltip", label: "Tooltip", href: "/design-system/components/tooltip" },
      { id: "coach-tip", label: "Coach Tip", href: "/design-system/components/coach-tip" },
      { id: "popover", label: "Popover", href: "/design-system/components/popover" },
      { id: "hover-card", label: "Hover Card", href: "/design-system/components/hover-card" },
      { id: "sheet", label: "Sheet", href: "/design-system/components/sheet" },
      { id: "context-menu", label: "Context Menu", href: "/design-system/components/context-menu" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    href: "/design-system/components/navigation",
    description: "Tabs, breadcrumbs, pagination, and menus",
    children: [
      { id: "tabs", label: "Tabs", href: "/design-system/components/tabs" },
      { id: "breadcrumbs", label: "Breadcrumbs", href: "/design-system/components/breadcrumbs" },
      { id: "pagination", label: "Pagination", href: "/design-system/components/pagination" },
      {
        id: "dropdown-menu",
        label: "Dropdown Menu",
        href: "/design-system/components/dropdown-menu",
      },
      { id: "command", label: "Command", href: "/design-system/components/command" },
      { id: "accordion", label: "Accordion", href: "/design-system/components/accordion" },
      { id: "collapsible", label: "Collapsible", href: "/design-system/components/collapsible" },
    ],
  },
  {
    id: "layout",
    label: "Layout & Utility",
    href: "/design-system/components/layout",
    description: "Separators, scroll areas, and structural elements",
    children: [
      { id: "separator", label: "Separator", href: "/design-system/components/separator" },
      { id: "scroll-area", label: "Scroll Area", href: "/design-system/components/scroll-area" },
      { id: "spinner", label: "Spinner", href: "/design-system/components/spinner" },
      { id: "form-section", label: "Form Section", href: "/design-system/components/form-section" },
      {
        id: "inline-editable-title",
        label: "Inline Editable Title",
        href: "/design-system/components/inline-editable-title",
      },
      {
        id: "character-counter",
        label: "Character Counter",
        href: "/design-system/components/character-counter",
      },
    ],
  },
  {
    id: "editors",
    label: "Editors",
    href: "/design-system/components/editors",
    description: "Rich text and specialized editors",
    children: [
      { id: "toolbar", label: "Toolbar", href: "/design-system/components/toolbar" },
      {
        id: "rich-text-editor",
        label: "Rich Text Editor",
        href: "/design-system/components/rich-text-editor",
      },
      {
        id: "email-composer",
        label: "Email Composer",
        href: "/design-system/components/email-composer",
      },
      {
        id: "job-description-toolbar",
        label: "Job Description Toolbar",
        href: "/design-system/components/job-description-toolbar",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Tables",
    href: "/design-system/components/data",
    description: "Tables, charts, and data visualization",
    children: [
      { id: "data-table", label: "Data Table", href: "/design-system/components/data-table" },
      { id: "charts", label: "Charts", href: "/design-system/components/charts" },
      { id: "filter-panel", label: "Filter Panel", href: "/design-system/components/filter-panel" },
      { id: "bulk-actions", label: "Bulk Actions", href: "/design-system/components/bulk-actions" },
    ],
  },
  {
    id: "ats",
    label: "ATS Components",
    href: "/design-system/components/ats",
    description: "Applicant tracking specific components",
    children: [
      { id: "kanban", label: "Kanban Board", href: "/design-system/components/kanban" },
      {
        id: "candidate-card",
        label: "Candidate Card",
        href: "/design-system/components/candidate-card",
      },
      {
        id: "job-post-card",
        label: "Job Post Card",
        href: "/design-system/components/job-post-card",
      },
      {
        id: "job-note-card",
        label: "Job Note Card",
        href: "/design-system/components/job-note-card",
      },
      { id: "company-card", label: "Company Card", href: "/design-system/components/company-card" },
      { id: "stage-badge", label: "Stage Badge", href: "/design-system/components/stage-badge" },
      { id: "scorecard", label: "Scorecard", href: "/design-system/components/scorecard" },
      { id: "match-score", label: "Match Score", href: "/design-system/components/match-score" },
      {
        id: "activity-feed",
        label: "Activity Feed",
        href: "/design-system/components/activity-feed",
      },
      { id: "pdf-viewer", label: "PDF Viewer", href: "/design-system/components/pdf-viewer" },
      { id: "scheduler", label: "Scheduler", href: "/design-system/components/scheduler" },
      { id: "calendar", label: "Calendar", href: "/design-system/components/calendar" },
      {
        id: "interview-scheduling-modal",
        label: "Interview Scheduling Modal",
        href: "/design-system/components/interview-scheduling-modal",
      },
      {
        id: "availability-calendar",
        label: "Availability Calendar",
        href: "/design-system/components/availability-calendar",
      },
      {
        id: "timezone-selector",
        label: "Timezone Selector",
        href: "/design-system/components/timezone-selector",
      },
      {
        id: "attendee-chip",
        label: "Attendee Chip",
        href: "/design-system/components/attendee-chip",
      },
      {
        id: "time-slot-chip",
        label: "Time Slot Chip",
        href: "/design-system/components/time-slot-chip",
      },
      {
        id: "benefits-selector",
        label: "Benefits Selector",
        href: "/design-system/components/benefits-selector",
      },
      {
        id: "role-template-card",
        label: "Role Template Card",
        href: "/design-system/components/role-template-card",
      },
    ],
  },
];

export const designSystemNav: NavSection[] = [
  {
    title: "Foundations",
    href: "/design-system/foundations",
    items: foundationsNav,
  },
  {
    title: "Components",
    href: "/design-system/components",
    items: componentsNav,
  },
];

// Flat list of all items for search
export const allNavItems: NavItem[] = [
  ...foundationsNav.flatMap((item) => [item, ...(item.children || [])]),
  ...componentsNav.flatMap((item) => [item, ...(item.children || [])]),
];

// Search index for the SearchModal
export interface SearchItem {
  id: string;
  title: string;
  category: string;
  href: string;
  keywords?: string[];
}

export const searchIndex: SearchItem[] = [
  // Foundations
  {
    id: "colors",
    title: "Colors",
    category: "Foundations",
    href: "/design-system/foundations/colors",
    keywords: ["palette", "theme", "brand"],
  },
  {
    id: "colors-primary",
    title: "Primary Colors",
    category: "Foundations",
    href: "/design-system/foundations/colors#colors-primary",
    keywords: ["green", "brand", "main"],
  },
  {
    id: "colors-neutral",
    title: "Neutral Colors",
    category: "Foundations",
    href: "/design-system/foundations/colors#colors-neutral",
    keywords: ["gray", "grey", "background"],
  },
  {
    id: "colors-semantic",
    title: "Semantic Colors",
    category: "Foundations",
    href: "/design-system/foundations/colors#colors-semantic",
    keywords: ["success", "error", "warning", "info"],
  },
  {
    id: "colors-secondary",
    title: "Secondary Colors",
    category: "Foundations",
    href: "/design-system/foundations/colors#colors-secondary",
    keywords: ["accent", "additional"],
  },
  {
    id: "typography",
    title: "Typography",
    category: "Foundations",
    href: "/design-system/foundations/typography",
    keywords: ["font", "text", "heading"],
  },
  {
    id: "typography-scale",
    title: "Type Scale",
    category: "Foundations",
    href: "/design-system/foundations/typography#typography-scale",
    keywords: ["size", "heading", "body"],
  },
  {
    id: "typography-weights",
    title: "Font Weights",
    category: "Foundations",
    href: "/design-system/foundations/typography#typography-weights",
    keywords: ["bold", "regular", "medium"],
  },
  {
    id: "spacing",
    title: "Spacing",
    category: "Foundations",
    href: "/design-system/foundations/spacing",
    keywords: ["margin", "padding", "gap"],
  },
  {
    id: "shadows",
    title: "Shadows",
    category: "Foundations",
    href: "/design-system/foundations/shadows",
    keywords: ["elevation", "depth", "drop shadow"],
  },
  {
    id: "borders",
    title: "Borders & Radius",
    category: "Foundations",
    href: "/design-system/foundations/borders",
    keywords: ["corner", "rounded", "border-radius"],
  },
  {
    id: "motion",
    title: "Motion",
    category: "Foundations",
    href: "/design-system/foundations/motion",
    keywords: ["animation", "transition", "duration", "easing"],
  },

  // Components - Buttons
  {
    id: "buttons",
    title: "Buttons",
    category: "Components",
    href: "/design-system/components/buttons",
    keywords: ["action", "cta", "click", "submit"],
  },

  // Components - Form Controls
  {
    id: "form-controls",
    title: "Form Controls",
    category: "Components",
    href: "/design-system/components/form-controls",
    keywords: ["input", "form", "field"],
  },
  {
    id: "input",
    title: "Input",
    category: "Form Controls",
    href: "/design-system/components/input",
    keywords: ["text", "field", "form", "textbox"],
  },
  {
    id: "textarea",
    title: "Textarea",
    category: "Form Controls",
    href: "/design-system/components/textarea",
    keywords: ["multiline", "text", "description"],
  },
  {
    id: "dropdown",
    title: "Dropdown",
    category: "Form Controls",
    href: "/design-system/components/dropdown",
    keywords: ["select", "picker", "choose", "scrollable"],
  },
  {
    id: "checkbox",
    title: "Checkbox",
    category: "Form Controls",
    href: "/design-system/components/checkbox",
    keywords: ["check", "toggle", "boolean"],
  },
  {
    id: "radio-group",
    title: "Radio Group",
    category: "Form Controls",
    href: "/design-system/components/radio-group",
    keywords: ["option", "single", "select", "radio"],
  },
  {
    id: "switch",
    title: "Switch",
    category: "Form Controls",
    href: "/design-system/components/switch",
    keywords: ["toggle", "on", "off"],
  },
  {
    id: "slider",
    title: "Slider",
    category: "Form Controls",
    href: "/design-system/components/slider",
    keywords: ["range", "value", "drag"],
  },
  {
    id: "segmented-controller",
    title: "Segmented Controller",
    category: "Form Controls",
    href: "/design-system/components/segmented-controller",
    keywords: ["tabs", "toggle", "options"],
  },
  {
    id: "search-input",
    title: "Search Input",
    category: "Form Controls",
    href: "/design-system/components/search-input",
    keywords: ["search", "find", "query"],
  },
  {
    id: "chip",
    title: "Chip",
    category: "Form Controls",
    href: "/design-system/components/chip",
    keywords: ["tag", "label", "filter", "chips"],
  },
  {
    id: "label",
    title: "Label",
    category: "Form Controls",
    href: "/design-system/components/label",
    keywords: ["form", "field", "accessibility"],
  },
  {
    id: "combobox",
    title: "Combobox",
    category: "Form Controls",
    href: "/design-system/components/combobox",
    keywords: ["autocomplete", "search", "select"],
  },
  {
    id: "time-picker",
    title: "Time Picker",
    category: "Form Controls",
    href: "/design-system/components/time-picker",
    keywords: ["time", "clock", "schedule"],
  },
  {
    id: "date-picker",
    title: "Date Picker",
    category: "Form Controls",
    href: "/design-system/components/date-picker",
    keywords: ["date", "calendar", "schedule"],
  },
  {
    id: "file-upload",
    title: "File Upload",
    category: "Form Controls",
    href: "/design-system/components/file-upload",
    keywords: ["file", "upload", "attach", "document"],
  },
  {
    id: "mention-input",
    title: "Mention Input",
    category: "Form Controls",
    href: "/design-system/components/mention-input",
    keywords: ["@mention", "tag", "user"],
  },

  // Components - Data Display
  {
    id: "data-display",
    title: "Data Display",
    category: "Components",
    href: "/design-system/components/data-display",
    keywords: ["show", "present", "visual"],
  },
  {
    id: "badge",
    title: "Badge",
    category: "Data Display",
    href: "/design-system/components/badge",
    keywords: ["status", "label", "tag", "indicator"],
  },
  {
    id: "avatar",
    title: "Avatar",
    category: "Data Display",
    href: "/design-system/components/avatar",
    keywords: ["user", "profile", "image", "photo"],
  },
  {
    id: "card",
    title: "Card",
    category: "Data Display",
    href: "/design-system/components/card",
    keywords: ["container", "box", "panel"],
  },
  {
    id: "toast",
    title: "Toast",
    category: "Data Display",
    href: "/design-system/components/toast",
    keywords: ["notification", "alert", "message", "snackbar"],
  },
  {
    id: "alert",
    title: "Alert",
    category: "Data Display",
    href: "/design-system/components/alert",
    keywords: ["warning", "error", "info", "message"],
  },
  {
    id: "banner",
    title: "Banner",
    category: "Data Display",
    href: "/design-system/components/banner",
    keywords: ["announcement", "notification", "site-wide", "promotion"],
  },
  {
    id: "inline-message",
    title: "Inline Message",
    category: "Data Display",
    href: "/design-system/components/inline-message",
    keywords: ["validation", "feedback", "form", "hint"],
  },
  {
    id: "notification-badge",
    title: "Notification Badge",
    category: "Data Display",
    href: "/design-system/components/notification-badge",
    keywords: ["count", "number", "alert", "indicator"],
  },
  {
    id: "progress",
    title: "Progress",
    category: "Data Display",
    href: "/design-system/components/progress",
    keywords: ["loading", "bar", "percentage"],
  },
  {
    id: "progress-meter",
    title: "Progress Meter",
    category: "Data Display",
    href: "/design-system/components/progress-meter",
    keywords: ["circular", "steps", "goal", "meter"],
  },
  {
    id: "list-status",
    title: "List Status",
    category: "Data Display",
    href: "/design-system/components/list-status",
    keywords: ["status", "indicator", "list", "item"],
  },
  {
    id: "skeleton",
    title: "Skeleton",
    category: "Data Display",
    href: "/design-system/components/skeleton",
    keywords: ["loading", "placeholder", "shimmer"],
  },
  {
    id: "empty-state",
    title: "Empty State",
    category: "Data Display",
    href: "/design-system/components/empty-state",
    keywords: ["zero", "no data", "placeholder"],
  },
  {
    id: "stat-card",
    title: "Stat Card",
    category: "Data Display",
    href: "/design-system/components/stat-card",
    keywords: ["metric", "number", "dashboard"],
  },
  {
    id: "timeline",
    title: "Timeline",
    category: "Data Display",
    href: "/design-system/components/timeline",
    keywords: ["history", "events", "activity"],
  },

  // Components - Overlays
  {
    id: "overlays",
    title: "Overlays",
    category: "Components",
    href: "/design-system/components/overlays",
    keywords: ["popup", "modal", "dialog"],
  },
  {
    id: "dialog",
    title: "Dialog",
    category: "Overlays",
    href: "/design-system/components/dialog",
    keywords: ["confirm", "alert", "prompt"],
  },
  {
    id: "modal",
    title: "Modal",
    category: "Overlays",
    href: "/design-system/components/modal",
    keywords: ["popup", "overlay", "panel"],
  },
  {
    id: "tooltip",
    title: "Tooltip",
    category: "Overlays",
    href: "/design-system/components/tooltip",
    keywords: ["hint", "help", "hover"],
  },
  {
    id: "coach-tip",
    title: "Coach Tip",
    category: "Overlays",
    href: "/design-system/components/coach-tip",
    keywords: ["onboarding", "tour", "walkthrough", "guide", "coachmark"],
  },
  {
    id: "popover",
    title: "Popover",
    category: "Overlays",
    href: "/design-system/components/popover",
    keywords: ["popup", "dropdown", "float"],
  },
  {
    id: "hover-card",
    title: "Hover Card",
    category: "Overlays",
    href: "/design-system/components/hover-card",
    keywords: ["preview", "hover", "popup"],
  },
  {
    id: "sheet",
    title: "Sheet",
    category: "Overlays",
    href: "/design-system/components/sheet",
    keywords: ["drawer", "panel", "slide"],
  },
  {
    id: "context-menu",
    title: "Context Menu",
    category: "Overlays",
    href: "/design-system/components/context-menu",
    keywords: ["right-click", "menu", "options"],
  },

  // Components - Navigation
  {
    id: "navigation",
    title: "Navigation",
    category: "Components",
    href: "/design-system/components/navigation",
    keywords: ["nav", "menu", "links"],
  },
  {
    id: "tabs",
    title: "Tabs",
    category: "Navigation",
    href: "/design-system/components/tabs",
    keywords: ["tab", "panel", "switch"],
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    category: "Navigation",
    href: "/design-system/components/breadcrumbs",
    keywords: ["path", "trail", "hierarchy"],
  },
  {
    id: "pagination",
    title: "Pagination",
    category: "Navigation",
    href: "/design-system/components/pagination",
    keywords: ["page", "next", "previous"],
  },
  {
    id: "dropdown-menu",
    title: "Dropdown Menu",
    category: "Navigation",
    href: "/design-system/components/dropdown-menu",
    keywords: ["menu", "context", "options"],
  },
  {
    id: "command",
    title: "Command",
    category: "Navigation",
    href: "/design-system/components/command",
    keywords: ["palette", "search", "shortcuts", "cmdk"],
  },
  {
    id: "accordion",
    title: "Accordion",
    category: "Navigation",
    href: "/design-system/components/accordion",
    keywords: ["expand", "collapse", "disclosure"],
  },
  {
    id: "collapsible",
    title: "Collapsible",
    category: "Navigation",
    href: "/design-system/components/collapsible",
    keywords: ["expand", "collapse", "toggle"],
  },

  // Components - Layout & Utility
  {
    id: "layout",
    title: "Layout & Utility",
    category: "Components",
    href: "/design-system/components/layout",
    keywords: ["structure", "utility"],
  },
  {
    id: "separator",
    title: "Separator",
    category: "Layout",
    href: "/design-system/components/separator",
    keywords: ["divider", "line", "hr"],
  },
  {
    id: "scroll-area",
    title: "Scroll Area",
    category: "Layout",
    href: "/design-system/components/scroll-area",
    keywords: ["scroll", "overflow", "scrollbar"],
  },
  {
    id: "spinner",
    title: "Spinner",
    category: "Layout",
    href: "/design-system/components/spinner",
    keywords: ["loading", "wait", "spin"],
  },
  {
    id: "form-section",
    title: "Form Section",
    category: "Layout",
    href: "/design-system/components/form-section",
    keywords: ["form", "group", "fieldset"],
  },
  {
    id: "inline-editable-title",
    title: "Inline Editable Title",
    category: "Layout",
    href: "/design-system/components/inline-editable-title",
    keywords: ["edit", "title", "header", "inline"],
  },
  {
    id: "character-counter",
    title: "Character Counter",
    category: "Layout",
    href: "/design-system/components/character-counter",
    keywords: ["count", "limit", "length", "text"],
  },

  // Components - Editors
  {
    id: "editors",
    title: "Editors",
    category: "Components",
    href: "/design-system/components/editors",
    keywords: ["text", "edit", "compose"],
  },
  {
    id: "toolbar",
    title: "Toolbar",
    category: "Editors",
    href: "/design-system/components/toolbar",
    keywords: ["action bar", "controls", "editor"],
  },
  {
    id: "rich-text-editor",
    title: "Rich Text Editor",
    category: "Editors",
    href: "/design-system/components/rich-text-editor",
    keywords: ["wysiwyg", "editor", "format"],
  },
  {
    id: "email-composer",
    title: "Email Composer",
    category: "Editors",
    href: "/design-system/components/email-composer",
    keywords: ["email", "template", "send"],
  },
  {
    id: "job-description-toolbar",
    title: "Job Description Toolbar",
    category: "Editors",
    href: "/design-system/components/job-description-toolbar",
    keywords: ["job", "description", "editor", "toolbar"],
  },

  // Components - Data & Tables
  {
    id: "data",
    title: "Data & Tables",
    category: "Components",
    href: "/design-system/components/data",
    keywords: ["table", "grid", "visualization"],
  },
  {
    id: "data-table",
    title: "Data Table",
    category: "Data",
    href: "/design-system/components/data-table",
    keywords: ["table", "grid", "list", "sort"],
  },
  {
    id: "charts",
    title: "Charts",
    category: "Data",
    href: "/design-system/components/charts",
    keywords: ["graph", "analytics", "visualization"],
  },
  {
    id: "filter-panel",
    title: "Filter Panel",
    category: "Data",
    href: "/design-system/components/filter-panel",
    keywords: ["filter", "search", "refine"],
  },
  {
    id: "bulk-actions",
    title: "Bulk Actions",
    category: "Data",
    href: "/design-system/components/bulk-actions",
    keywords: ["multi", "select", "batch"],
  },

  // Components - ATS
  {
    id: "ats",
    title: "ATS Components",
    category: "Components",
    href: "/design-system/components/ats",
    keywords: ["applicant", "tracking", "hiring"],
  },
  {
    id: "kanban",
    title: "Kanban Board",
    category: "ATS",
    href: "/design-system/components/kanban",
    keywords: ["board", "drag", "pipeline", "trello"],
  },
  {
    id: "candidate-card",
    title: "Candidate Card",
    category: "ATS",
    href: "/design-system/components/candidate-card",
    keywords: ["applicant", "profile", "person"],
  },
  {
    id: "job-post-card",
    title: "Job Post Card",
    category: "ATS",
    href: "/design-system/components/job-post-card",
    keywords: ["job", "listing", "posting", "role"],
  },
  {
    id: "job-note-card",
    title: "Job Note Card",
    category: "ATS",
    href: "/design-system/components/job-note-card",
    keywords: ["note", "comment", "feedback", "job"],
  },
  {
    id: "company-card",
    title: "Company Card",
    category: "ATS",
    href: "/design-system/components/company-card",
    keywords: ["company", "organization", "employer"],
  },
  {
    id: "stage-badge",
    title: "Stage Badge",
    category: "ATS",
    href: "/design-system/components/stage-badge",
    keywords: ["status", "pipeline", "progress"],
  },
  {
    id: "scorecard",
    title: "Scorecard",
    category: "ATS",
    href: "/design-system/components/scorecard",
    keywords: ["rating", "review", "evaluation"],
  },
  {
    id: "match-score",
    title: "Match Score",
    category: "ATS",
    href: "/design-system/components/match-score",
    keywords: ["ai", "match", "percentage", "fit"],
  },
  {
    id: "activity-feed",
    title: "Activity Feed",
    category: "ATS",
    href: "/design-system/components/activity-feed",
    keywords: ["log", "history", "events"],
  },
  {
    id: "pdf-viewer",
    title: "PDF Viewer",
    category: "ATS",
    href: "/design-system/components/pdf-viewer",
    keywords: ["document", "resume", "preview"],
  },
  {
    id: "scheduler",
    title: "Scheduler",
    category: "ATS",
    href: "/design-system/components/scheduler",
    keywords: ["calendar", "booking", "interview"],
  },
  {
    id: "calendar",
    title: "Calendar",
    category: "ATS",
    href: "/design-system/components/calendar",
    keywords: ["date", "schedule", "events"],
  },
  {
    id: "interview-scheduling-modal",
    title: "Interview Scheduling Modal",
    category: "ATS",
    href: "/design-system/components/interview-scheduling-modal",
    keywords: ["interview", "schedule", "modal", "candidate", "attendee", "calendar"],
  },
  {
    id: "availability-calendar",
    title: "Availability Calendar",
    category: "ATS",
    href: "/design-system/components/availability-calendar",
    keywords: ["availability", "calendar", "attendee", "drag", "time", "slot"],
  },
  {
    id: "timezone-selector",
    title: "Timezone Selector",
    category: "ATS",
    href: "/design-system/components/timezone-selector",
    keywords: ["timezone", "globe", "select", "region"],
  },
  {
    id: "attendee-chip",
    title: "Attendee Chip",
    category: "ATS",
    href: "/design-system/components/attendee-chip",
    keywords: ["attendee", "interviewer", "chip", "avatar", "role"],
  },
  {
    id: "time-slot-chip",
    title: "Time Slot Chip",
    category: "ATS",
    href: "/design-system/components/time-slot-chip",
    keywords: ["time", "slot", "chip", "range", "interview"],
  },
  {
    id: "benefits-selector",
    title: "Benefits Selector",
    category: "ATS",
    href: "/design-system/components/benefits-selector",
    keywords: ["benefits", "perks", "job", "selection"],
  },
  {
    id: "role-template-card",
    title: "Role Template Card",
    category: "ATS",
    href: "/design-system/components/role-template-card",
    keywords: ["template", "role", "job", "card"],
  },
];

// Helper to flatten navigation items (including children)
function flattenNavItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];

  const flatten = (navItems: NavItem[]) => {
    navItems.forEach((item) => {
      // Add the parent item if it has its own page (not just a category)
      if (!item.children || item.children.length === 0) {
        result.push(item);
      }
      // Add children
      if (item.children) {
        flatten(item.children);
      }
    });
  };

  flatten(items);
  return result;
}

// Helper to get prev/next navigation
export function getPrevNext(currentPath: string): { prev: NavItem | null; next: NavItem | null } {
  const flatList = [...flattenNavItems(foundationsNav), ...flattenNavItems(componentsNav)];

  const currentIndex = flatList.findIndex((item) => item.href === currentPath);

  return {
    prev: currentIndex > 0 ? flatList[currentIndex - 1] : null,
    next: currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null,
  };
}

// Helper to check if a path is active (including children)
export function isPathActive(itemHref: string, currentPath: string): boolean {
  // Exact match
  if (itemHref === currentPath) return true;

  // Check if current path starts with item href (for parent items)
  if (currentPath.startsWith(itemHref) && itemHref !== "/design-system") return true;

  return false;
}
