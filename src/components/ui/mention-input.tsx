"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Command as CommandPrimitive } from "cmdk";
import { Popover, PopoverContent, PopoverAnchor } from "./popover";
import {
  At,
  CircleNotch,
  Users,
  CheckCircle,
  WarningOctagon,
  Bell,
  CaretUp,
  CaretDown,
  KeyReturn,
} from "@phosphor-icons/react";

/* ============================================
   Mention Input Variants (CVA)
   ============================================ */
const mentionInputVariants = cva(
  [
    "flex items-center w-full",
    "bg-[var(--input-background)]",
    "border border-solid",
    "overflow-hidden",
    "transition-all duration-fast",
  ],
  {
    variants: {
      state: {
        default: "border-[var(--input-border)] hover:border-[var(--input-border-hover)]",
        hover: "border-[var(--input-border-hover)]",
        focused: "border-[var(--primitive-green-600)]",
        typing: "border-[var(--primitive-green-600)]",
        error: "border-[var(--primitive-red-600)]",
        focusedError: "border-[var(--primitive-red-600)]",
      },
      size: {
        default: "h-14 px-4 gap-3 rounded-2xl",
        compact: "h-12 px-3 gap-2 rounded-xl",
        sm: "h-10 px-3 gap-2 rounded-lg",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

const mentionTextareaVariants = cva(
  [
    "w-full",
    "bg-[var(--input-background)]",
    "border border-solid",
    "overflow-hidden",
    "transition-all duration-fast",
  ],
  {
    variants: {
      state: {
        default: "border-[var(--input-border)] hover:border-[var(--input-border-hover)]",
        hover: "border-[var(--input-border-hover)]",
        focused: "border-[var(--primitive-green-600)]",
        typing: "border-[var(--primitive-green-600)]",
        error: "border-[var(--primitive-red-600)]",
        focusedError: "border-[var(--primitive-red-600)]",
      },
      size: {
        default: "rounded-2xl",
        compact: "rounded-xl",
        sm: "rounded-lg",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

/* ============================================
   Mention Input Types
   ============================================ */
export interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  /** Optional role/title for display */
  role?: string;
}

export interface MentionData {
  id: string;
  display: string;
  /** Index in the text where mention starts */
  startIndex: number;
  /** Index in the text where mention ends */
  endIndex: number;
}

export interface MentionInputProps extends VariantProps<typeof mentionInputVariants> {
  value: string;
  onChange: (value: string) => void;
  mentions: MentionData[];
  onMentionsChange: (mentions: MentionData[]) => void;
  users: MentionUser[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Character that triggers mention popup */
  trigger?: string;
  /** Min characters to search */
  minChars?: number;
  /** Async user search */
  onSearch?: (query: string) => Promise<MentionUser[]>;
  /** Max rows for textarea */
  maxRows?: number;
  /** Callback when user submits (e.g., presses Enter) */
  onSubmit?: () => void;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Size variant */
  size?: "default" | "compact" | "sm";
  /** Maximum character count */
  maxLength?: number;
  /** Show character count */
  showCharCount?: boolean;
  /** Aria label for accessibility */
  "aria-label"?: string;
}

export interface MentionTextareaProps extends MentionInputProps {
  rows?: number;
  /** Show footer toolbar with hints */
  showFooter?: boolean;
}

/* ============================================
   Mention Highlight Component
   ============================================ */
export interface MentionHighlightProps {
  text: string;
  mentions: MentionData[];
  className?: string;
  /** Show mini avatars in mention chips */
  showAvatars?: boolean;
  /** User data for avatar lookup */
  users?: MentionUser[];
  /** Variant style for mention chips */
  variant?: "default" | "pill" | "subtle";
  /** Click handler for mention chips */
  onMentionClick?: (mention: MentionData) => void;
}

const MentionHighlight: React.FC<MentionHighlightProps> = ({
  text,
  mentions,
  className,
  showAvatars = false,
  users = [],
  variant = "default",
  onMentionClick,
}) => {
  if (mentions.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Sort mentions by start index
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex);

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "pill":
        return cn(
          "inline-flex items-center gap-1",
          "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
          "px-2 py-0.5 rounded-full",
          "font-medium text-sm",
          "border border-[var(--border-brand)]/30",
          "transition-all duration-fast",
          onMentionClick &&
            "cursor-pointer hover:bg-[var(--background-brand-muted)] hover:scale-[1.02]"
        );
      case "subtle":
        return cn(
          "text-[var(--foreground-brand)] font-medium",
          "transition-colors duration-fast",
          onMentionClick && "cursor-pointer hover:underline"
        );
      default:
        return cn(
          "inline-flex items-center gap-1",
          "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
          "px-1.5 py-0.5 rounded-md",
          "font-medium",
          "transition-all duration-fast",
          onMentionClick && "cursor-pointer hover:bg-[var(--background-brand-muted)]"
        );
    }
  };

  sortedMentions.forEach((mention, i) => {
    // Add text before mention
    if (mention.startIndex > lastIndex) {
      parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, mention.startIndex)}</span>);
    }

    // Find user for avatar
    const user = users.find((u) => u.id === mention.id);

    // Add mention chip
    parts.push(
      <span
        key={`mention-${mention.id}-${i}`}
        className={getVariantStyles()}
        onClick={() => onMentionClick?.(mention)}
        role={onMentionClick ? "button" : undefined}
        tabIndex={onMentionClick ? 0 : undefined}
      >
        {showAvatars && user && (
          <Avatar src={user.avatar} name={mention.display} size="xs" className="h-4 w-4" />
        )}
        <span>@{mention.display}</span>
      </span>
    );

    lastIndex = mention.endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return <span className={className}>{parts}</span>;
};

/* ============================================
   Mention Suggestion List
   ============================================ */
export interface MentionSuggestionListProps {
  users: MentionUser[];
  query: string;
  onSelect: (user: MentionUser) => void;
  loading?: boolean;
  /** Already mentioned user IDs (to show checkmark) */
  mentionedIds?: string[];
  /** Header text */
  header?: string;
  /** Show keyboard hints */
  showKeyboardHints?: boolean;
}

const MentionSuggestionList: React.FC<MentionSuggestionListProps> = ({
  users,
  query,
  onSelect,
  loading = false,
  mentionedIds = [],
  header = "Team Members",
  showKeyboardHints = true,
}) => {
  const filteredUsers = React.useMemo(() => {
    if (!query) return users;
    const lowerQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email?.toLowerCase().includes(lowerQuery) ||
        user.role?.toLowerCase().includes(lowerQuery)
    );
  }, [users, query]);

  if (loading) {
    return (
      <div className="flex animate-fade-in flex-col items-center justify-center gap-3 py-8">
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-[var(--background-brand-subtle)]" />
          <CircleNotch className="absolute inset-0 h-12 w-12 animate-spin text-[var(--foreground-brand)]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--foreground-default)]">Searching team...</p>
          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">Type more to refine</p>
        </div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="animate-fade-in py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-muted)]">
          <Users className="h-6 w-6 text-[var(--foreground-muted)]" weight="duotone" />
        </div>
        <p className="mb-1 text-sm font-medium text-[var(--foreground-default)]">
          No matches found
        </p>
        <p className="text-xs text-[var(--foreground-muted)]">
          Try a different name or check spelling
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
          {header}
        </span>
        <span className="text-xs text-[var(--foreground-subtle)]">
          {filteredUsers.length} found
        </span>
      </div>

      {/* User List */}
      <CommandPrimitive.List className="max-h-64 overflow-auto p-1.5">
        {filteredUsers.map((user, index) => {
          const isAlreadyMentioned = mentionedIds.includes(user.id);

          return (
            <CommandPrimitive.Item
              key={user.id}
              value={user.name}
              onSelect={() => onSelect(user)}
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                "data-[selected=true]:bg-[var(--background-interactive-selected)]",
                "transition-all duration-fast",
                "hover:scale-[1.01]",
                "animate-slide-in-right"
              )}
              style={{ animationDelay: `${index * 25}ms` }}
            >
              <div className="relative">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="sm"
                  className={cn(
                    "transition-all duration-fast",
                    "ring-2 ring-transparent",
                    "group-data-[selected=true]:ring-[var(--border-brand)]"
                  )}
                />
                {isAlreadyMentioned && (
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--background-default)]">
                    <CheckCircle className="h-3 w-3 text-[var(--foreground-brand)]" weight="fill" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--foreground-default)]">{user.name}</p>
                <p className="truncate text-xs text-[var(--foreground-muted)]">
                  {user.role || user.email}
                </p>
              </div>
              {isAlreadyMentioned && (
                <span className="rounded bg-[var(--background-muted)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-subtle)]">
                  mentioned
                </span>
              )}
            </CommandPrimitive.Item>
          );
        })}
      </CommandPrimitive.List>

      {/* Keyboard Hints Footer */}
      {showKeyboardHints && (
        <div className="flex items-center justify-center gap-4 border-t border-[var(--border-muted)] bg-[var(--background-subtle)] px-3 py-2">
          <div className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]">
            <div className="flex gap-0.5">
              <kbd className="rounded border border-[var(--border-muted)] bg-[var(--background-default)] px-1 py-0.5 font-mono text-[9px]">
                <CaretUp size={8} />
              </kbd>
              <kbd className="rounded border border-[var(--border-muted)] bg-[var(--background-default)] px-1 py-0.5 font-mono text-[9px]">
                <CaretDown size={8} />
              </kbd>
            </div>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]">
            <kbd className="rounded border border-[var(--border-muted)] bg-[var(--background-default)] px-1.5 py-0.5 font-mono text-[9px]">
              <KeyReturn size={10} />
            </kbd>
            <span>select</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]">
            <kbd className="rounded border border-[var(--border-muted)] bg-[var(--background-default)] px-1.5 py-0.5 font-mono text-[9px]">
              esc
            </kbd>
            <span>close</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================
   Mention Input Component
   ============================================ */
const MentionInput = React.forwardRef<HTMLInputElement, MentionInputProps>(
  (
    {
      value,
      onChange,
      mentions,
      onMentionsChange,
      users,
      placeholder = "Type @ to mention someone...",
      disabled = false,
      className,
      trigger = "@",
      minChars = 0,
      onSearch,
      onSubmit,
      error = false,
      errorMessage,
      size = "default",
      maxLength,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [suggestionQuery, setSuggestionQuery] = React.useState("");
    const [triggerIndex, setTriggerIndex] = React.useState(-1);
    const [searchResults, setSearchResults] = React.useState<MentionUser[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const hasValue = value && value.length > 0;

    // Determine visual state
    const getState = (): "default" | "hover" | "focused" | "typing" | "error" | "focusedError" => {
      if (error && isFocused) return "focusedError";
      if (error) return "error";
      if (isFocused && hasValue) return "typing";
      if (isFocused) return "focused";
      return "default";
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Respect maxLength
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      const cursorPos = e.target.selectionStart || 0;

      onChange(newValue);

      // Check for trigger character
      const textBeforeCursor = newValue.slice(0, cursorPos);
      const lastTriggerIndex = textBeforeCursor.lastIndexOf(trigger);

      if (lastTriggerIndex !== -1) {
        const textAfterTrigger = textBeforeCursor.slice(lastTriggerIndex + 1);
        // Check if there's a space after the trigger (meaning the mention is complete)
        if (!textAfterTrigger.includes(" ")) {
          setTriggerIndex(lastTriggerIndex);
          setSuggestionQuery(textAfterTrigger);

          if (textAfterTrigger.length >= minChars) {
            setShowSuggestions(true);

            if (onSearch) {
              setLoading(true);
              try {
                const results = await onSearch(textAfterTrigger);
                setSearchResults(results);
              } finally {
                setLoading(false);
              }
            }
          }
          return;
        }
      }

      setShowSuggestions(false);
      setTriggerIndex(-1);
      setSuggestionQuery("");
    };

    const handleSelectUser = (user: MentionUser) => {
      if (triggerIndex === -1) return;

      const beforeMention = value.slice(0, triggerIndex);
      const afterMention = value.slice(triggerIndex + trigger.length + suggestionQuery.length);
      const mentionText = `${trigger}${user.name}`;
      const newValue = `${beforeMention}${mentionText} ${afterMention}`;

      // Update mentions
      const newMention: MentionData = {
        id: user.id,
        display: user.name,
        startIndex: triggerIndex,
        endIndex: triggerIndex + mentionText.length,
      };

      // Adjust existing mentions that come after this one
      const adjustedMentions = mentions.map((m) => {
        if (m.startIndex > triggerIndex) {
          const offset = mentionText.length + 1 - (trigger.length + suggestionQuery.length);
          return {
            ...m,
            startIndex: m.startIndex + offset,
            endIndex: m.endIndex + offset,
          };
        }
        return m;
      });

      onChange(newValue);
      onMentionsChange([...adjustedMentions, newMention]);
      setShowSuggestions(false);
      setTriggerIndex(-1);
      setSuggestionQuery("");

      // Focus back on input
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
      if (e.key === "Enter" && !showSuggestions) {
        e.preventDefault();
        onSubmit?.();
      }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const displayUsers = onSearch ? searchResults : users;
    const state = getState();

    // Icon size based on component size
    const iconSize = size === "sm" ? 16 : size === "compact" ? 20 : 24;

    return (
      <div className="w-full">
        <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
          <PopoverAnchor asChild>
            <div
              className={cn(mentionInputVariants({ state, size }), className)}
              onClick={() => inputRef.current?.focus()}
            >
              {/* @ Icon */}
              <At
                size={iconSize}
                weight="bold"
                className={cn(
                  "shrink-0 transition-colors duration-fast",
                  isFocused ? "text-[var(--foreground-brand)]" : "text-[var(--foreground-muted)]",
                  error && "text-[var(--primitive-red-600)]"
                )}
              />

              {/* Cursor indicator when focused without value */}
              {isFocused && !hasValue && (
                <div className="flex h-[21px] w-0 items-center justify-center">
                  <div
                    className={cn(
                      "h-full w-[1px] animate-pulse",
                      error ? "bg-[var(--primitive-red-600)]" : "bg-[var(--primitive-green-600)]"
                    )}
                  />
                </div>
              )}

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                aria-label={ariaLabel}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={errorMessage ? "mention-error" : undefined}
                className={cn(
                  "min-w-0 flex-1 bg-transparent outline-none",
                  "font-medium leading-6 tracking-[-0.36px]",
                  "placeholder:text-[var(--foreground-muted)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  size === "sm" ? "text-sm" : "text-lg",
                  hasValue ? "text-[var(--primitive-green-800)]" : "text-[var(--foreground-muted)]"
                )}
              />

              {/* Error Icon */}
              {error && (
                <WarningOctagon
                  size={iconSize}
                  weight="fill"
                  className="shrink-0 text-[var(--primitive-red-600)]"
                />
              )}
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="w-72 p-0 shadow-[2px_4px_16px_0px_rgba(31,29,28,0.12)]"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandPrimitive className="flex flex-col overflow-hidden rounded-xl bg-[var(--background-default)]">
              <MentionSuggestionList
                users={displayUsers}
                query={suggestionQuery}
                onSelect={handleSelectUser}
                loading={loading}
                mentionedIds={mentions.map((m) => m.id)}
              />
            </CommandPrimitive>
          </PopoverContent>
        </Popover>

        {/* Error Message */}
        {error && errorMessage && (
          <p id="mention-error" className="mt-1.5 text-sm text-[var(--primitive-red-600)]">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
MentionInput.displayName = "MentionInput";

/* ============================================
   Mention Textarea Component
   ============================================ */
const MentionTextarea = React.forwardRef<HTMLTextAreaElement, MentionTextareaProps>(
  (
    {
      value,
      onChange,
      mentions,
      onMentionsChange,
      users,
      placeholder = "Add a note... Type @ to mention someone",
      disabled = false,
      className,
      trigger = "@",
      minChars = 0,
      onSearch,
      maxRows = 10,
      rows = 3,
      onSubmit,
      error = false,
      errorMessage,
      size = "default",
      maxLength,
      showCharCount = false,
      showFooter = true,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [suggestionQuery, setSuggestionQuery] = React.useState("");
    const [triggerIndex, setTriggerIndex] = React.useState(-1);
    const [searchResults, setSearchResults] = React.useState<MentionUser[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    const hasValue = value && value.length > 0;

    // Determine visual state
    const getState = (): "default" | "hover" | "focused" | "typing" | "error" | "focusedError" => {
      if (error && isFocused) return "focusedError";
      if (error) return "error";
      if (isFocused && hasValue) return "typing";
      if (isFocused) return "focused";
      return "default";
    };

    // Auto-resize textarea
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const maxHeight = lineHeight * maxRows;
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
      }
    }, [value, maxRows]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // Respect maxLength
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      const cursorPos = e.target.selectionStart || 0;

      onChange(newValue);

      // Check for trigger character
      const textBeforeCursor = newValue.slice(0, cursorPos);
      const lastTriggerIndex = textBeforeCursor.lastIndexOf(trigger);

      if (lastTriggerIndex !== -1) {
        const textAfterTrigger = textBeforeCursor.slice(lastTriggerIndex + 1);
        // Check if there's a space or newline after the trigger
        if (!textAfterTrigger.includes(" ") && !textAfterTrigger.includes("\n")) {
          setTriggerIndex(lastTriggerIndex);
          setSuggestionQuery(textAfterTrigger);

          if (textAfterTrigger.length >= minChars) {
            setShowSuggestions(true);

            if (onSearch) {
              setLoading(true);
              try {
                const results = await onSearch(textAfterTrigger);
                setSearchResults(results);
              } finally {
                setLoading(false);
              }
            }
          }
          return;
        }
      }

      setShowSuggestions(false);
      setTriggerIndex(-1);
      setSuggestionQuery("");
    };

    const handleSelectUser = (user: MentionUser) => {
      if (triggerIndex === -1) return;

      const beforeMention = value.slice(0, triggerIndex);
      const afterMention = value.slice(triggerIndex + trigger.length + suggestionQuery.length);
      const mentionText = `${trigger}${user.name}`;
      const newValue = `${beforeMention}${mentionText} ${afterMention}`;

      // Update mentions
      const newMention: MentionData = {
        id: user.id,
        display: user.name,
        startIndex: triggerIndex,
        endIndex: triggerIndex + mentionText.length,
      };

      // Adjust existing mentions that come after this one
      const adjustedMentions = mentions.map((m) => {
        if (m.startIndex > triggerIndex) {
          const offset = mentionText.length + 1 - (trigger.length + suggestionQuery.length);
          return {
            ...m,
            startIndex: m.startIndex + offset,
            endIndex: m.endIndex + offset,
          };
        }
        return m;
      });

      onChange(newValue);
      onMentionsChange([...adjustedMentions, newMention]);
      setShowSuggestions(false);
      setTriggerIndex(-1);
      setSuggestionQuery("");

      // Focus back on textarea
      textareaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
      // Submit on Cmd/Ctrl + Enter
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !showSuggestions) {
        e.preventDefault();
        onSubmit?.();
      }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const displayUsers = onSearch ? searchResults : users;
    const state = getState();

    return (
      <div className="w-full">
        <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
          <PopoverAnchor asChild>
            <div
              className={cn(mentionTextareaVariants({ state, size }), "flex flex-col", className)}
            >
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                aria-label={ariaLabel}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={errorMessage ? "textarea-error" : undefined}
                className={cn(
                  "w-full resize-none px-4 py-3 text-lg font-medium leading-6 tracking-[-0.36px]",
                  "bg-transparent outline-none",
                  "placeholder:text-[var(--foreground-muted)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  hasValue ? "text-[var(--primitive-green-800)]" : "text-[var(--foreground-muted)]"
                )}
              />

              {/* Footer Toolbar */}
              {showFooter && (
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-2",
                    "border-[var(--border-muted)]/50 border-t",
                    "bg-[var(--background-subtle)]/50",
                    "transition-opacity duration-fast",
                    isFocused ? "opacity-100" : "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <At size={14} weight="bold" />
                    <span>Type @ to mention</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                    {showCharCount && (
                      <span
                        className={cn(
                          maxLength && value.length >= maxLength * 0.9
                            ? "text-[var(--foreground-warning)]"
                            : ""
                        )}
                      >
                        {value.length}
                        {maxLength && ` / ${maxLength}`}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <kbd className="rounded border border-[var(--border-muted)] bg-[var(--background-default)] px-1.5 py-0.5 font-mono text-[10px]">
                        ⌘
                      </kbd>
                      <kbd className="rounded border border-[var(--border-muted)] bg-[var(--background-default)] px-1.5 py-0.5 font-mono text-[10px]">
                        ↵
                      </kbd>
                      <span className="ml-1">submit</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="w-72 p-0 shadow-[2px_4px_16px_0px_rgba(31,29,28,0.12)]"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandPrimitive className="flex flex-col overflow-hidden rounded-xl bg-[var(--background-default)]">
              <MentionSuggestionList
                users={displayUsers}
                query={suggestionQuery}
                onSelect={handleSelectUser}
                loading={loading}
                mentionedIds={mentions.map((m) => m.id)}
              />
            </CommandPrimitive>
          </PopoverContent>
        </Popover>

        {/* Error Message */}
        {error && errorMessage && (
          <p id="textarea-error" className="mt-1.5 text-sm text-[var(--primitive-red-600)]">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
MentionTextarea.displayName = "MentionTextarea";

/* ============================================
   Note Input with Mentions
   (Convenience wrapper for ATS notes)
   ============================================ */
export interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  mentions: MentionData[];
  onMentionsChange: (mentions: MentionData[]) => void;
  users: MentionUser[];
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  /** Show notification preview when users are mentioned */
  showNotificationPreview?: boolean;
  /** Button text */
  submitLabel?: string;
  /** Loading button text */
  loadingLabel?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Maximum character count */
  maxLength?: number;
  /** Async user search */
  onSearch?: (query: string) => Promise<MentionUser[]>;
}

const NoteInput: React.FC<NoteInputProps> = ({
  value,
  onChange,
  mentions,
  onMentionsChange,
  users,
  onSubmit,
  placeholder = "Add a note... Type @ to mention a team member",
  disabled = false,
  loading = false,
  className,
  showNotificationPreview = true,
  submitLabel = "Add Note",
  loadingLabel = "Saving...",
  error = false,
  errorMessage,
  maxLength,
  onSearch,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-muted)] bg-[var(--background-subtle)] p-1",
        "transition-all duration-fast",
        "focus-within:border-[var(--primitive-green-600)]",
        error && "border-[var(--primitive-red-600)]",
        className
      )}
    >
      {/* Textarea */}
      <MentionTextarea
        value={value}
        onChange={onChange}
        mentions={mentions}
        onMentionsChange={onMentionsChange}
        users={users}
        placeholder={placeholder}
        disabled={disabled || loading}
        onSubmit={onSubmit}
        rows={3}
        maxRows={8}
        showFooter={false}
        error={error}
        maxLength={maxLength}
        onSearch={onSearch}
        className="rounded-xl border-0 bg-transparent"
      />

      {/* Footer with notification preview and submit button */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2",
          "border-[var(--border-muted)]/50 border-t"
        )}
      >
        {/* Left side: Notification preview or hints */}
        <div className="flex items-center gap-2">
          {showNotificationPreview && mentions.length > 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-brand)]">
              <Bell size={14} weight="fill" />
              <span>{mentions.length} will be notified</span>
              {/* Mini avatar stack */}
              <div className="ml-1 flex -space-x-1.5">
                {mentions.slice(0, 3).map((mention, index) => {
                  const user = users.find((u) => u.id === mention.id);
                  return (
                    <Avatar
                      key={mention.id}
                      src={user?.avatar}
                      name={mention.display}
                      size="xs"
                      className={cn(
                        "h-5 w-5 ring-2 ring-[var(--background-subtle)]",
                        index > 0 && "-ml-1.5"
                      )}
                    />
                  );
                })}
                {mentions.length > 3 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--background-muted)] text-[9px] font-medium text-[var(--foreground-muted)] ring-2 ring-[var(--background-subtle)]">
                    +{mentions.length - 3}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <At size={14} />
              <span>Type @ to mention</span>
            </div>
          )}
        </div>

        {/* Right side: Character count and submit button */}
        <div className="flex items-center gap-3">
          {maxLength && (
            <span
              className={cn(
                "text-xs text-[var(--foreground-muted)]",
                value.length >= maxLength * 0.9 && "text-[var(--foreground-warning)]",
                value.length >= maxLength && "text-[var(--foreground-error)]"
              )}
            >
              {value.length}/{maxLength}
            </span>
          )}
          <Button
            onClick={onSubmit}
            disabled={disabled || loading || !value.trim()}
            loading={loading}
            size="sm"
            className="transition-all duration-fast hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="px-3 pb-2 text-sm text-[var(--primitive-red-600)]">{errorMessage}</p>
      )}
    </div>
  );
};

/* ============================================
   Exports
   ============================================ */
export {
  MentionInput,
  MentionTextarea,
  MentionHighlight,
  MentionSuggestionList,
  NoteInput,
  mentionInputVariants,
  mentionTextareaVariants,
};
