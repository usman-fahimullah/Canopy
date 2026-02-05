"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { Input, type InputProps } from "./input";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "INR";

export interface CurrencyInputProps extends Omit<
  InputProps,
  "type" | "value" | "onChange" | "leftAddon" | "rightAddon"
> {
  /** Raw numeric string value (e.g. "60000") */
  value: string;
  /** Callback when value changes - returns raw numeric string */
  onValueChange: (value: string) => void;
  /** Currency code for symbol and formatting (default: "USD") */
  currency?: CurrencyCode;
  /** Locale for number formatting (default: "en-US") */
  locale?: string;
  /** Enable math expressions like "50k * 2" (default: true) */
  allowCalculations?: boolean;
  /** Allow decimal values (default: false for whole numbers) */
  allowDecimals?: boolean;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Show clear button when field has value (default: false) */
  clearable?: boolean;
  /** Helper text displayed below input */
  helperText?: string;
}

export interface SalaryRangeInputProps {
  /** Current value as { min, max } object with raw numeric strings */
  value: { min: string; max: string };
  /** Callback when either value changes */
  onValueChange: (value: { min: string; max: string }) => void;
  /** Currency code (default: "USD") */
  currency?: CurrencyCode;
  /** Locale for formatting (default: "en-US") */
  locale?: string;
  /** Placeholder for minimum input (default: "e.g. 60k") */
  minPlaceholder?: string;
  /** Placeholder for maximum input (default: "e.g. 120k") */
  maxPlaceholder?: string;
  /** Show clear buttons on each input (default: false) */
  clearable?: boolean;
  /** Helper text displayed below inputs */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Currency Configuration
// ─────────────────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  CHF: "CHF",
  INR: "₹",
};

// ─────────────────────────────────────────────────────────────────────────────
// Parsing Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Expand shortcuts like "60k" → "60000", "1.5m" → "1500000", "2b" → "2000000000"
 */
function expandShortcuts(input: string): string {
  return input
    .replace(/(\d+\.?\d*)k/gi, (_, n) => String(parseFloat(n) * 1000))
    .replace(/(\d+\.?\d*)m/gi, (_, n) => String(parseFloat(n) * 1000000))
    .replace(/(\d+\.?\d*)b/gi, (_, n) => String(parseFloat(n) * 1000000000));
}

/**
 * Safely evaluate a math expression (only numbers and basic operators)
 */
function evaluateExpression(expr: string): number | null {
  // Remove currency symbols, commas, and whitespace
  let cleaned = expr.replace(/[$€£¥₹,\s]/g, "");

  // Expand shortcuts first
  cleaned = expandShortcuts(cleaned);

  // Only allow digits, decimal points, and math operators
  if (!cleaned || !/^[\d+\-*/().]+$/.test(cleaned)) {
    return null;
  }

  try {
    // Use Function constructor for safe math-only eval
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${cleaned})`)();
    return typeof result === "number" && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

/**
 * Parse currency input with shortcut and calculation support
 */
function parseCurrencyInput(input: string, allowCalculations: boolean): number | null {
  if (!input.trim()) return null;

  // If calculations are allowed, try to evaluate as expression
  if (allowCalculations) {
    const result = evaluateExpression(input);
    if (result !== null) return result;
  }

  // Otherwise, just expand shortcuts and parse as number
  const expanded = expandShortcuts(input.replace(/[$€£¥₹,\s]/g, ""));
  const num = parseFloat(expanded);
  return isNaN(num) ? null : num;
}

/**
 * Clamp value to min/max constraints
 */
function clampValue(value: number, min?: number, max?: number): number {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

/**
 * Format number as currency string for display
 */
function formatCurrencyDisplay(
  value: number,
  locale: string,
  currency: CurrencyCode,
  allowDecimals: boolean
): string {
  // Use Intl.NumberFormat for proper locale-aware formatting
  // But we'll show the value without the currency symbol (we show it as leftAddon)
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: allowDecimals ? 2 : 0,
    maximumFractionDigits: allowDecimals ? 2 : 0,
  }).format(value);
}

/**
 * Get currency symbol for a given currency code
 */
function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency] || "$";
}

// ─────────────────────────────────────────────────────────────────────────────
// CurrencyInput Component
// ─────────────────────────────────────────────────────────────────────────────

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onValueChange,
      currency = "USD",
      locale = "en-US",
      allowCalculations = true,
      allowDecimals = false,
      min,
      max,
      clearable = false,
      helperText,
      className,
      error,
      disabled,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    // Track whether we're focused (show raw input) or blurred (show formatted)
    const [isFocused, setIsFocused] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState("");

    // Format the value for display when not focused
    React.useEffect(() => {
      if (!isFocused && value) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          setDisplayValue(formatCurrencyDisplay(num, locale, currency, allowDecimals));
        } else {
          setDisplayValue(value);
        }
      } else if (!isFocused && !value) {
        setDisplayValue("");
      }
    }, [value, isFocused, locale, currency, allowDecimals]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Show raw value or expression when focused
      setDisplayValue(value);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      // Parse the input
      const parsed = parseCurrencyInput(displayValue, allowCalculations);

      if (parsed !== null) {
        // Clamp and round
        let finalValue = clampValue(parsed, min, max);
        if (!allowDecimals) {
          finalValue = Math.round(finalValue);
        }

        // Update the parent with raw numeric string
        onValueChange(String(finalValue));

        // Format for display
        setDisplayValue(formatCurrencyDisplay(finalValue, locale, currency, allowDecimals));
      } else if (displayValue.trim() === "") {
        // Empty input
        onValueChange("");
        setDisplayValue("");
      } else {
        // Invalid input - revert to previous valid value
        if (value) {
          const num = parseFloat(value);
          if (!isNaN(num)) {
            setDisplayValue(formatCurrencyDisplay(num, locale, currency, allowDecimals));
          }
        } else {
          setDisplayValue("");
        }
      }

      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    };

    const handleClear = () => {
      onValueChange("");
      setDisplayValue("");
    };

    const symbol = getCurrencySymbol(currency);

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Input
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={error}
          disabled={disabled}
          inputMode="text" // Allow letters for shortcuts like "k"
          leftAddon={
            <span className="text-lg font-medium text-[var(--primitive-neutral-600)]">
              {symbol}
            </span>
          }
          rightAddon={
            clearable && displayValue ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center rounded-full p-0.5 text-[var(--primitive-neutral-500)] transition-colors hover:bg-[var(--primitive-neutral-200)] hover:text-[var(--primitive-neutral-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
                aria-label="Clear value"
              >
                <X size={14} weight="bold" />
              </button>
            ) : undefined
          }
          {...props}
        />
        {helperText && (
          <p className="text-caption-sm text-[var(--foreground-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

// ─────────────────────────────────────────────────────────────────────────────
// SalaryRangeInput Component
// ─────────────────────────────────────────────────────────────────────────────

const SalaryRangeInput = React.forwardRef<HTMLDivElement, SalaryRangeInputProps>(
  (
    {
      value,
      onValueChange,
      currency = "USD",
      locale = "en-US",
      minPlaceholder = "e.g. 60k",
      maxPlaceholder = "e.g. 120k",
      clearable = false,
      helperText,
      error: externalError,
      disabled,
    },
    ref
  ) => {
    const [rangeError, setRangeError] = React.useState<string | null>(null);

    // Validate that min <= max when both have values
    const validateRange = React.useCallback((min: string, max: string) => {
      if (min && max) {
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);
        if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
          setRangeError("Minimum cannot exceed maximum");
          return false;
        }
      }
      setRangeError(null);
      return true;
    }, []);

    const handleMinChange = (newMin: string) => {
      onValueChange({ ...value, min: newMin });
      validateRange(newMin, value.max);
    };

    const handleMaxChange = (newMax: string) => {
      onValueChange({ ...value, max: newMax });
      validateRange(value.min, newMax);
    };

    const hasError = externalError || !!rangeError;

    return (
      <div ref={ref} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <CurrencyInput
              value={value.min}
              onValueChange={handleMinChange}
              currency={currency}
              locale={locale}
              placeholder={minPlaceholder}
              clearable={clearable}
              error={hasError}
              disabled={disabled}
            />
          </div>

          <span className="shrink-0 text-[var(--foreground-muted)]">—</span>

          <div className="flex-1">
            <CurrencyInput
              value={value.max}
              onValueChange={handleMaxChange}
              currency={currency}
              locale={locale}
              placeholder={maxPlaceholder}
              clearable={clearable}
              error={hasError}
              disabled={disabled}
            />
          </div>
        </div>

        {rangeError ? (
          <p className="text-caption-sm text-[var(--foreground-error)]">{rangeError}</p>
        ) : helperText ? (
          <p className="text-caption-sm text-[var(--foreground-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

SalaryRangeInput.displayName = "SalaryRangeInput";

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export { CurrencyInput, SalaryRangeInput };
