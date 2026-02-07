import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* ============================================
           SEMANTIC TOKENS
           Intent-based naming matching globals.css
           ============================================ */

        // Backgrounds
        background: {
          DEFAULT: "var(--background-default)",
          subtle: "var(--background-subtle)",
          muted: "var(--background-muted)",
          emphasized: "var(--background-emphasized)",
          inverse: "var(--background-inverse)",
          // Brand
          brand: "var(--background-brand)",
          "brand-subtle": "var(--background-brand-subtle)",
          "brand-muted": "var(--background-brand-muted)",
          "brand-emphasis": "var(--background-brand-emphasis)",
          // Interactive
          "interactive-default": "var(--background-interactive-default)",
          "interactive-hover": "var(--background-interactive-hover)",
          "interactive-active": "var(--background-interactive-active)",
          "interactive-selected": "var(--background-interactive-selected)",
          "interactive-disabled": "var(--background-interactive-disabled)",
          // Status
          success: "var(--background-success)",
          "success-emphasis": "var(--background-success-emphasis)",
          warning: "var(--background-warning)",
          "warning-emphasis": "var(--background-warning-emphasis)",
          error: "var(--background-error)",
          "error-emphasis": "var(--background-error-emphasis)",
          info: "var(--background-info)",
          "info-emphasis": "var(--background-info-emphasis)",
        },

        // Foreground (Text & Icons)
        foreground: {
          DEFAULT: "var(--foreground-default)",
          muted: "var(--foreground-muted)",
          subtle: "var(--foreground-subtle)",
          disabled: "var(--foreground-disabled)",
          inverse: "var(--foreground-inverse)",
          "on-emphasis": "var(--foreground-on-emphasis)",
          // Brand
          brand: "var(--foreground-brand)",
          "brand-emphasis": "var(--foreground-brand-emphasis)",
          // Status
          success: "var(--foreground-success)",
          warning: "var(--foreground-warning)",
          error: "var(--foreground-error)",
          info: "var(--foreground-info)",
          // Links
          link: "var(--foreground-link)",
          "link-hover": "var(--foreground-link-hover)",
          "link-visited": "var(--foreground-link-visited)",
        },

        // Borders
        border: {
          DEFAULT: "var(--border-default)",
          muted: "var(--border-muted)",
          emphasis: "var(--border-emphasis)",
          strong: "var(--border-strong)",
          inverse: "var(--border-inverse)",
          disabled: "var(--border-disabled)",
          // Brand
          brand: "var(--border-brand)",
          "brand-emphasis": "var(--border-brand-emphasis)",
          // Interactive
          "interactive-default": "var(--border-interactive-default)",
          "interactive-hover": "var(--border-interactive-hover)",
          "interactive-focus": "var(--border-interactive-focus)",
          "interactive-active": "var(--border-interactive-active)",
          // Status
          success: "var(--border-success)",
          warning: "var(--border-warning)",
          error: "var(--border-error)",
          info: "var(--border-info)",
        },

        // Surfaces
        surface: {
          DEFAULT: "var(--surface-default)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
          sunken: "var(--surface-sunken)",
          inset: "var(--surface-inset)",
        },

        // Surface Level System (context-aware hover)
        "surface-hover": "var(--surface-hover)",
        "surface-active": "var(--surface-active)",

        /* ============================================
           COMPONENT TOKENS
           ============================================ */

        // Button
        button: {
          "primary-bg": "var(--button-primary-background)",
          "primary-bg-hover": "var(--button-primary-background-hover)",
          "primary-bg-active": "var(--button-primary-background-active)",
          "primary-fg": "var(--button-primary-foreground)",
          "secondary-bg": "var(--button-secondary-background)",
          "secondary-bg-hover": "var(--button-secondary-background-hover)",
          "secondary-bg-active": "var(--button-secondary-background-active)",
          "secondary-fg": "var(--button-secondary-foreground)",
          "outline-bg": "var(--button-outline-background)",
          "outline-bg-hover": "var(--button-outline-background-hover)",
          "outline-bg-active": "var(--button-outline-background-active)",
          "outline-fg": "var(--button-outline-foreground)",
          "outline-border": "var(--button-outline-border)",
          "ghost-bg": "var(--button-ghost-background)",
          "ghost-bg-hover": "var(--button-ghost-background-hover)",
          "ghost-bg-active": "var(--button-ghost-background-active)",
          "ghost-fg": "var(--button-ghost-foreground)",
          "destructive-bg": "var(--button-destructive-background)",
          "destructive-bg-hover": "var(--button-destructive-background-hover)",
          "destructive-bg-active": "var(--button-destructive-background-active)",
          "destructive-fg": "var(--button-destructive-foreground)",
          "disabled-bg": "var(--button-disabled-background)",
          "disabled-fg": "var(--button-disabled-foreground)",
        },

        // Input
        input: {
          bg: "var(--input-background)",
          "bg-hover": "var(--input-background-hover)",
          "bg-focus": "var(--input-background-focus)",
          "bg-disabled": "var(--input-background-disabled)",
          fg: "var(--input-foreground)",
          "fg-placeholder": "var(--input-foreground-placeholder)",
          border: "var(--input-border)",
          "border-hover": "var(--input-border-hover)",
          "border-focus": "var(--input-border-focus)",
          "border-error": "var(--input-border-error)",
          "border-success": "var(--input-border-success)",
        },

        // Card
        card: {
          bg: "var(--card-background)",
          "bg-hover": "var(--card-background-hover)",
          "bg-active": "var(--card-background-active)",
          "bg-selected": "var(--card-background-selected)",
          "bg-feature": "var(--card-background-feature)",
          fg: "var(--card-foreground)",
          "fg-muted": "var(--card-foreground-muted)",
          "fg-feature": "var(--card-foreground-feature)",
          "fg-feature-muted": "var(--card-foreground-feature-muted)",
          border: "var(--card-border)",
          "border-hover": "var(--card-border-hover)",
        },

        // Badge
        badge: {
          "neutral-bg": "var(--badge-neutral-background)",
          "neutral-fg": "var(--badge-neutral-foreground)",
          "neutral-border": "var(--badge-neutral-border)",
          "primary-bg": "var(--badge-primary-background)",
          "primary-fg": "var(--badge-primary-foreground)",
          "primary-border": "var(--badge-primary-border)",
          "success-bg": "var(--badge-success-background)",
          "success-fg": "var(--badge-success-foreground)",
          "success-border": "var(--badge-success-border)",
          "warning-bg": "var(--badge-warning-background)",
          "warning-fg": "var(--badge-warning-foreground)",
          "warning-border": "var(--badge-warning-border)",
          "error-bg": "var(--badge-error-background)",
          "error-fg": "var(--badge-error-foreground)",
          "error-border": "var(--badge-error-border)",
          "info-bg": "var(--badge-info-background)",
          "info-fg": "var(--badge-info-foreground)",
          "info-border": "var(--badge-info-border)",
          "accent-bg": "var(--badge-accent-background)",
          "accent-fg": "var(--badge-accent-foreground)",
          "accent-border": "var(--badge-accent-border)",
        },

        // Navigation
        nav: {
          bg: "var(--nav-background)",
          fg: "var(--nav-foreground)",
          "fg-muted": "var(--nav-foreground-muted)",
          "item-bg-hover": "var(--nav-item-background-hover)",
          "item-bg-active": "var(--nav-item-background-active)",
          "item-fg-active": "var(--nav-item-foreground-active)",
          border: "var(--nav-border)",
        },

        // Table
        table: {
          bg: "var(--table-background)",
          "bg-header": "var(--table-background-header)",
          "bg-row-hover": "var(--table-background-row-hover)",
          "bg-row-selected": "var(--table-background-row-selected)",
          "bg-row-stripe": "var(--table-background-row-stripe)",
          fg: "var(--table-foreground)",
          "fg-header": "var(--table-foreground-header)",
          border: "var(--table-border)",
          "border-header": "var(--table-border-header)",
        },

        // Tooltip
        tooltip: {
          bg: "var(--tooltip-background)",
          fg: "var(--tooltip-foreground)",
          border: "var(--tooltip-border)",
        },

        // Popover / Dropdown
        popover: {
          bg: "var(--popover-background)",
          fg: "var(--popover-foreground)",
          border: "var(--popover-border)",
          "item-bg-hover": "var(--popover-item-background-hover)",
          "item-bg-active": "var(--popover-item-background-active)",
          "item-bg-selected": "var(--popover-item-background-selected)",
          separator: "var(--popover-separator)",
        },

        // Modal / Dialog
        modal: {
          bg: "var(--modal-background)",
          fg: "var(--modal-foreground)",
          border: "var(--modal-border)",
          "header-bg": "var(--modal-header-background)",
          "footer-bg": "var(--modal-footer-background)",
        },

        // Toast
        toast: {
          bg: "var(--toast-background)",
          fg: "var(--toast-foreground)",
          border: "var(--toast-border)",
          "success-bg": "var(--toast-success-background)",
          "success-fg": "var(--toast-success-foreground)",
          "error-bg": "var(--toast-error-background)",
          "error-fg": "var(--toast-error-foreground)",
          "warning-bg": "var(--toast-warning-background)",
          "warning-fg": "var(--toast-warning-foreground)",
        },

        // Tabs
        tabs: {
          bg: "var(--tabs-background)",
          fg: "var(--tabs-foreground)",
          "fg-active": "var(--tabs-foreground-active)",
          border: "var(--tabs-border)",
          indicator: "var(--tabs-indicator)",
          "item-bg-hover": "var(--tabs-item-background-hover)",
        },

        // Switch
        switch: {
          bg: "var(--switch-background)",
          "bg-checked": "var(--switch-background-checked)",
          "bg-disabled": "var(--switch-background-disabled)",
          thumb: "var(--switch-thumb)",
          "thumb-disabled": "var(--switch-thumb-disabled)",
        },

        // Checkbox / Radio
        checkbox: {
          bg: "var(--checkbox-background)",
          "bg-checked": "var(--checkbox-background-checked)",
          "bg-disabled": "var(--checkbox-background-disabled)",
          border: "var(--checkbox-border)",
          "border-hover": "var(--checkbox-border-hover)",
          "border-checked": "var(--checkbox-border-checked)",
          fg: "var(--checkbox-foreground)",
          "fg-disabled": "var(--checkbox-foreground-disabled)",
        },

        // Slider
        slider: {
          "track-bg": "var(--slider-track-background)",
          "track-bg-active": "var(--slider-track-background-active)",
          "thumb-bg": "var(--slider-thumb-background)",
          "thumb-border": "var(--slider-thumb-border)",
        },

        // Progress
        progress: {
          bg: "var(--progress-background)",
          fg: "var(--progress-foreground)",
          "fg-success": "var(--progress-foreground-success)",
          "fg-warning": "var(--progress-foreground-warning)",
          "fg-error": "var(--progress-foreground-error)",
        },

        // Skeleton
        skeleton: {
          bg: "var(--skeleton-background)",
          shine: "var(--skeleton-shine)",
        },

        /* ============================================
           ATS-SPECIFIC COMPONENT TOKENS
           ============================================ */

        // Pipeline Stages
        stage: {
          "new-bg": "var(--stage-new-background)",
          "new-fg": "var(--stage-new-foreground)",
          "new-border": "var(--stage-new-border)",
          "applied-bg": "var(--stage-applied-background)",
          "applied-fg": "var(--stage-applied-foreground)",
          "applied-border": "var(--stage-applied-border)",
          "screening-bg": "var(--stage-screening-background)",
          "screening-fg": "var(--stage-screening-foreground)",
          "screening-border": "var(--stage-screening-border)",
          "interview-bg": "var(--stage-interview-background)",
          "interview-fg": "var(--stage-interview-foreground)",
          "interview-border": "var(--stage-interview-border)",
          "offer-bg": "var(--stage-offer-background)",
          "offer-fg": "var(--stage-offer-foreground)",
          "offer-border": "var(--stage-offer-border)",
          "hired-bg": "var(--stage-hired-background)",
          "hired-fg": "var(--stage-hired-foreground)",
          "hired-border": "var(--stage-hired-border)",
          "rejected-bg": "var(--stage-rejected-background)",
          "rejected-fg": "var(--stage-rejected-foreground)",
          "rejected-border": "var(--stage-rejected-border)",
          "withdrawn-bg": "var(--stage-withdrawn-background)",
          "withdrawn-fg": "var(--stage-withdrawn-foreground)",
          "withdrawn-border": "var(--stage-withdrawn-border)",
        },

        // Match Scores
        match: {
          "high-bg": "var(--match-high-background)",
          "high-fg": "var(--match-high-foreground)",
          "high-accent": "var(--match-high-accent)",
          "medium-bg": "var(--match-medium-background)",
          "medium-fg": "var(--match-medium-foreground)",
          "medium-accent": "var(--match-medium-accent)",
          "low-bg": "var(--match-low-background)",
          "low-fg": "var(--match-low-foreground)",
          "low-accent": "var(--match-low-accent)",
        },

        // Rating
        rating: {
          empty: "var(--rating-empty)",
          filled: "var(--rating-filled)",
          hover: "var(--rating-hover)",
        },

        // Kanban
        kanban: {
          "column-bg": "var(--kanban-column-background)",
          "column-border": "var(--kanban-column-border)",
          "card-bg": "var(--kanban-card-background)",
          "card-bg-hover": "var(--kanban-card-background-hover)",
          "card-bg-dragging": "var(--kanban-card-background-dragging)",
          "card-border": "var(--kanban-card-border)",
          "card-border-dragging": "var(--kanban-card-border-dragging)",
          "dropzone-bg": "var(--kanban-dropzone-background)",
          "dropzone-border": "var(--kanban-dropzone-border)",
        },

        /* ============================================
           LEGACY/PRIMITIVE COLOR SCALES
           For backwards compatibility
           ============================================ */

        // Primary (Green)
        primary: {
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          DEFAULT: "var(--color-primary-600)",
        },

        // Neutral
        neutral: {
          white: "var(--color-neutral-white)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          black: "var(--color-neutral-black)",
          DEFAULT: "var(--color-neutral-600)",
        },

        // Blue
        blue: {
          100: "var(--color-blue-100)",
          200: "var(--color-blue-200)",
          300: "var(--color-blue-300)",
          400: "var(--color-blue-400)",
          500: "var(--color-blue-500)",
          600: "var(--color-blue-600)",
          700: "var(--color-blue-700)",
          800: "var(--color-blue-800)",
          DEFAULT: "var(--color-blue-500)",
        },

        // Red
        red: {
          100: "var(--color-red-100)",
          200: "var(--color-red-200)",
          300: "var(--color-red-300)",
          400: "var(--color-red-400)",
          500: "var(--color-red-500)",
          600: "var(--color-red-600)",
          700: "var(--color-red-700)",
          800: "var(--color-red-800)",
          DEFAULT: "var(--color-red-600)",
        },

        // Orange
        orange: {
          100: "var(--color-orange-100)",
          200: "var(--color-orange-200)",
          300: "var(--color-orange-300)",
          400: "var(--color-orange-400)",
          500: "var(--color-orange-500)",
          600: "var(--color-orange-600)",
          700: "var(--color-orange-700)",
          800: "var(--color-orange-800)",
          DEFAULT: "var(--color-orange-500)",
        },

        // Yellow
        yellow: {
          100: "var(--color-yellow-100)",
          200: "var(--color-yellow-200)",
          300: "var(--color-yellow-300)",
          400: "var(--color-yellow-400)",
          500: "var(--color-yellow-500)",
          600: "var(--color-yellow-600)",
          700: "var(--color-yellow-700)",
          800: "var(--color-yellow-800)",
          DEFAULT: "var(--color-yellow-500)",
        },

        // Purple
        purple: {
          100: "var(--color-purple-100)",
          200: "var(--color-purple-200)",
          300: "var(--color-purple-300)",
          400: "var(--color-purple-400)",
          500: "var(--color-purple-500)",
          600: "var(--color-purple-600)",
          700: "var(--color-purple-700)",
          800: "var(--color-purple-800)",
          DEFAULT: "var(--color-purple-500)",
        },

        // Semantic shortcuts
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",

        // Focus ring
        ring: {
          DEFAULT: "var(--ring-color)",
          error: "var(--ring-color-error)",
          success: "var(--ring-color-success)",
          inverse: "var(--ring-color-inverse)",
        },

        // Selection
        selection: {
          bg: "var(--selection-background)",
          fg: "var(--selection-foreground)",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      fontSize: {
        display: [
          "var(--text-display)",
          { lineHeight: "var(--leading-display)", fontWeight: "500" },
        ],
        "heading-lg": [
          "var(--text-heading-lg)",
          { lineHeight: "var(--leading-heading-lg)", fontWeight: "500" },
        ],
        "heading-md": [
          "var(--text-heading-md)",
          { lineHeight: "var(--leading-heading-md)", fontWeight: "500" },
        ],
        "heading-sm": [
          "var(--text-heading-sm)",
          { lineHeight: "var(--leading-heading-sm)", fontWeight: "500" },
        ],
        "body-strong": [
          "var(--text-body-strong)",
          { lineHeight: "var(--leading-body-strong)", fontWeight: "700" },
        ],
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)", fontWeight: "400" }],
        "body-sm": [
          "var(--text-body-sm)",
          { lineHeight: "var(--leading-body-sm)", fontWeight: "400" },
        ],
        "caption-strong": [
          "var(--text-caption-strong)",
          { lineHeight: "var(--leading-caption-strong)", fontWeight: "700" },
        ],
        caption: [
          "var(--text-caption)",
          { lineHeight: "var(--leading-caption)", fontWeight: "400" },
        ],
        "caption-sm": [
          "var(--text-caption-sm)",
          { lineHeight: "var(--leading-caption-sm)", fontWeight: "400" },
        ],
      },

      fontWeight: {
        regular: "var(--font-regular)",
        normal: "var(--font-normal)",
        medium: "var(--font-medium)",
        semibold: "var(--font-semibold)",
        bold: "var(--font-bold)",
      },

      letterSpacing: {
        tighter: "var(--tracking-tighter)",
        tight: "var(--tracking-tight)",
        normal: "var(--tracking-normal)",
        wide: "var(--tracking-wide)",
      },

      spacing: {
        0: "var(--space-0)",
        "0.5": "var(--space-0-5)",
        1: "var(--space-1)",
        "1.5": "var(--space-1-5)",
        2: "var(--space-2)",
        "2.5": "var(--space-2-5)",
        3: "var(--space-3)",
        "3.5": "var(--space-3-5)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
        11: "var(--space-11)",
        12: "var(--space-12)",
        14: "var(--space-14)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        28: "var(--space-28)",
        32: "var(--space-32)",
        36: "var(--space-36)",
        40: "var(--space-40)",
      },

      borderRadius: {
        none: "var(--radius-none)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        DEFAULT: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
        // Semantic
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        badge: "var(--radius-badge)",
        chip: "var(--radius-chip)",
        avatar: "var(--radius-avatar)",
        tooltip: "var(--radius-tooltip)",
        popover: "var(--radius-popover)",
        modal: "var(--radius-modal)",
      },

      boxShadow: {
        none: "var(--shadow-none)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        DEFAULT: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
        // Component
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        elevated: "var(--shadow-elevated)",
        dropdown: "var(--shadow-dropdown)",
        tooltip: "var(--shadow-tooltip)",
        modal: "var(--shadow-modal)",
        button: "var(--shadow-button)",
        "button-active": "var(--shadow-button-active)",
        focus: "var(--shadow-focus)",
      },

      transitionDuration: {
        instant: "var(--duration-instant)",
        fastest: "var(--duration-fastest)",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        moderate: "var(--duration-moderate)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
        slowest: "var(--duration-slowest)",
      },

      transitionTimingFunction: {
        DEFAULT: "var(--ease-default)",
        linear: "var(--ease-linear)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        emphasized: "var(--ease-emphasized)",
        "emphasized-in": "var(--ease-emphasized-accelerate)",
        "emphasized-out": "var(--ease-emphasized-decelerate)",
        spring: "var(--ease-spring)",
        bounce: "var(--ease-bounce)",
        elastic: "var(--ease-elastic)",
      },

      zIndex: {
        behind: "var(--z-behind)",
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
        toast: "var(--z-toast)",
        max: "var(--z-max)",
      },

      opacity: {
        disabled: "var(--opacity-disabled)",
        muted: "var(--opacity-muted)",
        subtle: "var(--opacity-subtle)",
        backdrop: "var(--opacity-backdrop)",
        loading: "var(--opacity-loading)",
      },

      width: {
        sidebar: "var(--sidebar-width)",
        "sidebar-collapsed": "var(--sidebar-collapsed)",
      },

      height: {
        header: "var(--header-height)",
      },

      maxWidth: {
        content: "var(--max-content-width)",
        form: "var(--max-form-width)",
      },

      ringColor: {
        DEFAULT: "var(--ring-color)",
        error: "var(--ring-color-error)",
        success: "var(--ring-color-success)",
        inverse: "var(--ring-color-inverse)",
      },

      ringWidth: {
        DEFAULT: "var(--ring-width)",
      },

      ringOffsetWidth: {
        DEFAULT: "var(--ring-offset)",
      },

      ringOffsetColor: {
        DEFAULT: "var(--background-default)",
      },

      keyframes: {
        // Accordion / Collapsible
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "collapsible-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-collapsible-content-height)", opacity: "1" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },

        // Fade
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },

        // Scale (for modals, popovers)
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.96)" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.9)" },
        },

        // Slide (directional entrances)
        "slide-in-from-top": {
          from: { opacity: "0", transform: "translateY(calc(-1 * var(--motion-distance-md)))" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { opacity: "0", transform: "translateY(var(--motion-distance-md))" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { opacity: "0", transform: "translateX(calc(-1 * var(--motion-distance-md)))" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { opacity: "0", transform: "translateX(var(--motion-distance-md))" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-to-top": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(calc(-1 * var(--motion-distance-md)))" },
        },
        "slide-out-to-bottom": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(var(--motion-distance-md))" },
        },
        "slide-out-to-left": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(calc(-1 * var(--motion-distance-md)))" },
        },
        "slide-out-to-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(var(--motion-distance-md))" },
        },

        // Drawer animations (larger distance)
        "drawer-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "drawer-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "drawer-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "drawer-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "drawer-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "drawer-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },

        // Loading states
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        indeterminate: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },

        // Interactive feedback
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "press-in": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(0.97)" },
        },
        "press-out": {
          from: { transform: "scale(0.97)" },
          to: { transform: "scale(1)" },
        },

        // Attention / Notification
        ping: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "attention-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--primitive-green-400)" },
          "50%": { boxShadow: "0 0 0 8px transparent" },
        },

        // Tooltip / Popover
        "tooltip-in": {
          from: { opacity: "0", transform: "scale(0.96) translateY(2px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "tooltip-out": {
          from: { opacity: "1", transform: "scale(1) translateY(0)" },
          to: { opacity: "0", transform: "scale(0.96) translateY(2px)" },
        },

        // Modal specific
        "modal-in": {
          from: { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "modal-out": {
          from: { opacity: "1", transform: "scale(1) translateY(0)" },
          to: { opacity: "0", transform: "scale(0.95) translateY(10px)" },
        },
        "overlay-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "overlay-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },

      animation: {
        // Accordion / Collapsible
        "accordion-down":
          "accordion-down var(--duration-moderate) var(--ease-emphasized-decelerate)",
        "accordion-up": "accordion-up var(--duration-normal) var(--ease-emphasized-accelerate)",
        "collapsible-down":
          "collapsible-down var(--duration-moderate) var(--ease-emphasized-decelerate)",
        "collapsible-up": "collapsible-up var(--duration-normal) var(--ease-emphasized-accelerate)",

        // Fade
        "fade-in": "fade-in var(--duration-normal) var(--ease-out)",
        "fade-out": "fade-out var(--duration-fast) var(--ease-in)",
        "fade-in-slow": "fade-in var(--duration-slow) var(--ease-out)",

        // Scale
        "scale-in": "scale-in var(--duration-normal) var(--ease-out)",
        "scale-out": "scale-out var(--duration-fast) var(--ease-in)",
        "zoom-in": "zoom-in var(--duration-moderate) var(--ease-emphasized-decelerate)",
        "zoom-out": "zoom-out var(--duration-normal) var(--ease-emphasized-accelerate)",

        // Slide
        "slide-in-from-top": "slide-in-from-top var(--duration-normal) var(--ease-out)",
        "slide-in-from-bottom": "slide-in-from-bottom var(--duration-normal) var(--ease-out)",
        "slide-in-from-left": "slide-in-from-left var(--duration-normal) var(--ease-out)",
        "slide-in-from-right": "slide-in-from-right var(--duration-normal) var(--ease-out)",
        "slide-out-to-top": "slide-out-to-top var(--duration-fast) var(--ease-in)",
        "slide-out-to-bottom": "slide-out-to-bottom var(--duration-fast) var(--ease-in)",
        "slide-out-to-left": "slide-out-to-left var(--duration-fast) var(--ease-in)",
        "slide-out-to-right": "slide-out-to-right var(--duration-fast) var(--ease-in)",

        // Drawers
        "drawer-in-from-right":
          "drawer-in-from-right var(--duration-slow) var(--ease-emphasized-decelerate)",
        "drawer-out-to-right":
          "drawer-out-to-right var(--duration-moderate) var(--ease-emphasized-accelerate)",
        "drawer-in-from-left":
          "drawer-in-from-left var(--duration-slow) var(--ease-emphasized-decelerate)",
        "drawer-out-to-left":
          "drawer-out-to-left var(--duration-moderate) var(--ease-emphasized-accelerate)",
        "drawer-in-from-bottom":
          "drawer-in-from-bottom var(--duration-slow) var(--ease-emphasized-decelerate)",
        "drawer-out-to-bottom":
          "drawer-out-to-bottom var(--duration-moderate) var(--ease-emphasized-accelerate)",

        // Loading states
        spin: "spin 1s var(--ease-linear) infinite",
        "spin-slow": "spin 2s var(--ease-linear) infinite",
        pulse: "pulse 2s var(--ease-in-out) infinite",
        shimmer: "shimmer 1.5s var(--ease-in-out) infinite",
        indeterminate: "indeterminate 1.5s var(--ease-in-out) infinite",

        // Interactive feedback
        "bounce-subtle": "bounce-subtle 0.4s var(--ease-spring)",
        shake: "shake 0.4s var(--ease-default)",
        wiggle: "wiggle 0.3s var(--ease-default)",
        "press-in": "press-in var(--duration-fastest) var(--ease-out)",
        "press-out": "press-out var(--duration-fast) var(--ease-spring)",

        // Attention
        ping: "ping 1s var(--ease-out) infinite",
        "attention-pulse": "attention-pulse 2s var(--ease-in-out) infinite",

        // Tooltip / Popover
        "tooltip-in": "tooltip-in var(--duration-fast) var(--ease-out)",
        "tooltip-out": "tooltip-out var(--duration-fastest) var(--ease-in)",
        "popover-in": "scale-in var(--duration-normal) var(--ease-out)",
        "popover-out": "scale-out var(--duration-fast) var(--ease-in)",

        // Modal / Overlay
        "modal-in": "modal-in var(--duration-slow) var(--ease-emphasized-decelerate)",
        "modal-out": "modal-out var(--duration-moderate) var(--ease-emphasized-accelerate)",
        "overlay-in": "overlay-in var(--duration-moderate) var(--ease-out)",
        "overlay-out": "overlay-out var(--duration-fast) var(--ease-in)",

        // Dropdown
        "dropdown-in": "scale-in var(--duration-fast) var(--ease-out)",
        "dropdown-out": "scale-out var(--duration-fastest) var(--ease-in)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/typography"),

    // Surface Level System plugin
    // Generates .surface-level-{0,1,2,3} utilities that set
    // background + --surface-hover/active for context-aware hover
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".surface-level-0": {
          "background-color": "var(--primitive-neutral-0)",
          "--surface-bg": "var(--primitive-neutral-0)",
          "--surface-hover": "var(--primitive-neutral-100)",
          "--surface-active": "var(--primitive-neutral-200)",
          "--background-interactive-hover": "var(--primitive-neutral-100)",
          "--background-interactive-active": "var(--primitive-neutral-200)",
        },
        ".surface-level-1": {
          "background-color": "var(--primitive-neutral-100)",
          "--surface-bg": "var(--primitive-neutral-100)",
          "--surface-hover": "var(--primitive-neutral-200)",
          "--surface-active": "var(--primitive-neutral-300)",
          "--background-interactive-hover": "var(--primitive-neutral-200)",
          "--background-interactive-active": "var(--primitive-neutral-300)",
        },
        ".surface-level-2": {
          "background-color": "var(--primitive-neutral-200)",
          "--surface-bg": "var(--primitive-neutral-200)",
          "--surface-hover": "var(--primitive-neutral-300)",
          "--surface-active": "var(--primitive-neutral-400)",
          "--background-interactive-hover": "var(--primitive-neutral-300)",
          "--background-interactive-active": "var(--primitive-neutral-400)",
        },
        ".surface-level-3": {
          "background-color": "var(--primitive-neutral-300)",
          "--surface-bg": "var(--primitive-neutral-300)",
          "--surface-hover": "var(--primitive-neutral-400)",
          "--surface-active": "var(--primitive-neutral-500)",
          "--background-interactive-hover": "var(--primitive-neutral-400)",
          "--background-interactive-active": "var(--primitive-neutral-500)",
        },
      });
    }),
  ],
};

export default config;
