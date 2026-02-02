"use client";

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";
import { extractOtpFromPaste } from "@/lib/auth/otp-utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

/**
 * 6-digit OTP input component with auto-focus between digits
 */
export function OtpInput({
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Convert value string to array of digits
  const digits = value.padEnd(6, "").slice(0, 6).split("");

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow single digit
    const digit = newValue.replace(/\D/g, "").slice(-1);

    // Build new value
    const newDigits = [...digits];
    newDigits[index] = digit;
    const newOtp = newDigits.join("");

    onChange(newOtp);

    // Auto-focus next input if digit entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input if current is empty
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();

      // Clear the previous digit
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      onChange(newDigits.join(""));
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const extracted = extractOtpFromPaste(pastedText);

    if (extracted) {
      onChange(extracted);
      // Focus last input after paste
      inputRefs.current[5]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select the content on focus for easy replacement
    e.target.select();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {/* First 3 digits */}
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of 6`}
            className={cn(
              "h-12 w-10 rounded-lg border-2 text-center text-xl font-semibold transition-all sm:h-14 sm:w-12 sm:text-2xl",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              error
                ? "border-[var(--primitive-red-500)] focus:border-[var(--primitive-red-500)] focus:ring-[var(--primitive-red-500)]"
                : "border-[var(--primitive-neutral-300)] focus:border-[var(--primitive-green-600)] focus:ring-[var(--primitive-green-600)]",
              disabled && "cursor-not-allowed bg-[var(--primitive-neutral-100)] opacity-50"
            )}
          />
        ))}
      </div>

      {/* Separator */}
      <span className="text-2xl text-[var(--primitive-neutral-400)]">-</span>

      {/* Last 3 digits */}
      <div className="flex gap-2">
        {[3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of 6`}
            className={cn(
              "h-12 w-10 rounded-lg border-2 text-center text-xl font-semibold transition-all sm:h-14 sm:w-12 sm:text-2xl",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              error
                ? "border-[var(--primitive-red-500)] focus:border-[var(--primitive-red-500)] focus:ring-[var(--primitive-red-500)]"
                : "border-[var(--primitive-neutral-300)] focus:border-[var(--primitive-green-600)] focus:ring-[var(--primitive-green-600)]",
              disabled && "cursor-not-allowed bg-[var(--primitive-neutral-100)] opacity-50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
