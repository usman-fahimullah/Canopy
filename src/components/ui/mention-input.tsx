"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Command as CommandPrimitive } from "cmdk";
import { Popover, PopoverContent, PopoverAnchor } from "./popover";
import { At, CircleNotch } from "@phosphor-icons/react";

/* ============================================
   Mention Input Types
   ============================================ */
export interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface MentionData {
  id: string;
  display: string;
  /** Index in the text where mention starts */
  startIndex: number;
  /** Index in the text where mention ends */
  endIndex: number;
}

export interface MentionInputProps {
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
}

export interface MentionTextareaProps extends MentionInputProps {
  rows?: number;
}

/* ============================================
   Mention Highlight Component
   ============================================ */
interface MentionHighlightProps {
  text: string;
  mentions: MentionData[];
  className?: string;
}

const MentionHighlight: React.FC<MentionHighlightProps> = ({
  text,
  mentions,
  className,
}) => {
  if (mentions.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Sort mentions by start index
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex);

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedMentions.forEach((mention, i) => {
    // Add text before mention
    if (mention.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${i}`}>{text.slice(lastIndex, mention.startIndex)}</span>
      );
    }

    // Add mention
    parts.push(
      <span
        key={`mention-${mention.id}`}
        className="bg-background-brand-subtle text-foreground-brand px-1 rounded font-medium transition-colors duration-fast hover:bg-background-brand-subtle/80"
      >
        @{mention.display}
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
interface MentionSuggestionListProps {
  users: MentionUser[];
  query: string;
  onSelect: (user: MentionUser) => void;
  loading?: boolean;
}

const MentionSuggestionList: React.FC<MentionSuggestionListProps> = ({
  users,
  query,
  onSelect,
  loading = false,
}) => {
  const filteredUsers = React.useMemo(() => {
    if (!query) return users;
    const lowerQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email?.toLowerCase().includes(lowerQuery)
    );
  }, [users, query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2 animate-fade-in">
        <div className="h-8 w-8 rounded-full bg-background-brand-subtle flex items-center justify-center">
          <CircleNotch className="h-4 w-4 animate-spin text-foreground-brand" />
        </div>
        <span className="text-xs text-foreground-muted">Searching team...</span>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="py-6 text-center animate-fade-in">
        <div className="h-10 w-10 rounded-full bg-background-muted flex items-center justify-center mx-auto mb-2">
          <At className="h-5 w-5 text-foreground-muted" />
        </div>
        <p className="text-sm text-foreground-muted">No users found</p>
        <p className="text-xs text-foreground-disabled mt-1">Try a different name</p>
      </div>
    );
  }

  return (
    <CommandPrimitive.List className="max-h-48 overflow-auto p-1">
      {filteredUsers.map((user, index) => (
        <CommandPrimitive.Item
          key={user.id}
          value={user.name}
          onSelect={() => onSelect(user)}
          className={cn(
            "flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer",
            "data-[selected=true]:bg-popover-item-background-hover",
            "transition-all duration-fast",
            "animate-slide-in-right"
          )}
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <Avatar src={user.avatar} name={user.name} size="sm" className="transition-transform duration-fast group-hover:scale-105" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            {user.email && (
              <p className="text-xs text-foreground-muted truncate">
                {user.email}
              </p>
            )}
          </div>
        </CommandPrimitive.Item>
      ))}
    </CommandPrimitive.List>
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
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [suggestionQuery, setSuggestionQuery] = React.useState("");
    const [triggerIndex, setTriggerIndex] = React.useState(-1);
    const [searchResults, setSearchResults] = React.useState<MentionUser[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
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
      const afterMention = value.slice(
        triggerIndex + trigger.length + suggestionQuery.length
      );
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
          const offset =
            mentionText.length + 1 - (trigger.length + suggestionQuery.length);
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

    const displayUsers = onSearch ? searchResults : users;

    return (
      <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
        <PopoverAnchor asChild>
          <div className={cn("relative group", className)}>
            <At className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted transition-colors duration-fast group-focus-within:text-foreground-brand" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full h-10 pl-9 pr-3 py-2 text-sm rounded-lg",
                "bg-input-background border border-input-border",
                "hover:bg-input-background-hover hover:border-input-border-hover",
                "focus:outline-none focus:ring-2 focus:ring-ring-color focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-fast"
              )}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-64 p-0 animate-scale-in"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <CommandPrimitive className="flex flex-col overflow-hidden rounded-lg bg-popover-background">
            <MentionSuggestionList
              users={displayUsers}
              query={suggestionQuery}
              onSelect={handleSelectUser}
              loading={loading}
            />
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
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
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [suggestionQuery, setSuggestionQuery] = React.useState("");
    const [triggerIndex, setTriggerIndex] = React.useState(-1);
    const [searchResults, setSearchResults] = React.useState<MentionUser[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [popoverPosition, setPopoverPosition] = React.useState({ top: 0, left: 0 });

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

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
            // Calculate popover position based on cursor
            const textarea = textareaRef.current;
            if (textarea) {
              // Rough estimation of cursor position
              const rect = textarea.getBoundingClientRect();
              setPopoverPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
              });
            }

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
      const afterMention = value.slice(
        triggerIndex + trigger.length + suggestionQuery.length
      );
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
          const offset =
            mentionText.length + 1 - (trigger.length + suggestionQuery.length);
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

    const displayUsers = onSearch ? searchResults : users;

    return (
      <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
        <PopoverAnchor asChild>
          <div className={cn("relative group", className)}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                "w-full px-3 py-2 text-sm rounded-lg resize-none",
                "bg-input-background border border-input-border",
                "hover:bg-input-background-hover hover:border-input-border-hover",
                "focus:outline-none focus:ring-2 focus:ring-ring-color focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-fast"
              )}
            />
            <div className="absolute bottom-2 right-2 text-xs text-foreground-subtle transition-opacity duration-fast opacity-50 group-focus-within:opacity-100">
              ⌘Enter to submit
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-64 p-0 animate-scale-in"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <CommandPrimitive className="flex flex-col overflow-hidden rounded-lg bg-popover-background">
            <MentionSuggestionList
              users={displayUsers}
              query={suggestionQuery}
              onSelect={handleSelectUser}
              loading={loading}
            />
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    );
  }
);
MentionTextarea.displayName = "MentionTextarea";

/* ============================================
   Note Input with Mentions
   (Convenience wrapper for ATS notes)
   ============================================ */
interface NoteInputProps {
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
}) => {
  return (
    <div className={cn("space-y-2", className)}>
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
      />
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={disabled || loading || !value.trim()}
          loading={loading}
          className="transition-all duration-fast hover:scale-105 active:scale-95"
        >
          {loading ? "Saving..." : "Add Note"}
        </Button>
      </div>
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
};
