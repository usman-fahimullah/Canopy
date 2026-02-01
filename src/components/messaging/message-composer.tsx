"use client";

import { useCallback, useRef } from "react";
import {
  Plus,
  CalendarDots,
  Smiley,
  ArrowCircleUp,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";

export interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  placeholder?: string;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  sending,
  placeholder = "Write a message",
}: MessageComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[var(--primitive-neutral-100)] p-6">
      {/* Textarea */}
      <textarea
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={handleTextareaInput}
        onKeyDown={handleKeyDown}
        rows={1}
        className="w-full resize-none bg-transparent text-lg text-[var(--primitive-green-800)] placeholder:text-[var(--primitive-green-800)] outline-none"
        aria-label={placeholder}
      />

      {/* Actions Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="flex items-center justify-center rounded-2xl bg-[var(--primitive-neutral-200)] p-3 transition-colors hover:bg-[var(--primitive-neutral-300)]"
            aria-label="Attach file"
          >
            <Plus
              size={24}
              className="text-[var(--primitive-green-800)]"
            />
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded-2xl bg-[var(--primitive-neutral-200)] p-3 transition-colors hover:bg-[var(--primitive-neutral-300)]"
            aria-label="Schedule"
          >
            <CalendarDots
              size={24}
              className="text-[var(--primitive-green-800)]"
            />
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded-2xl bg-[var(--primitive-neutral-200)] p-3 transition-colors hover:bg-[var(--primitive-neutral-300)]"
            aria-label="Emoji"
          >
            <Smiley
              size={24}
              className="text-[var(--primitive-green-800)]"
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="flex items-center justify-center rounded-2xl bg-[var(--primitive-blue-200)] p-3 transition-colors hover:bg-[var(--primitive-blue-300)] disabled:opacity-50"
          aria-label="Send message"
        >
          {sending ? (
            <Spinner size="sm" />
          ) : (
            <ArrowCircleUp
              size={24}
              weight="fill"
              className="text-[var(--primitive-blue-700)]"
            />
          )}
        </button>
      </div>
    </div>
  );
}
