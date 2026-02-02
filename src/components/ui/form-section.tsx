"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FormSection component for consistent form layouts
 *
 * Based on Figma design specs from "Manage Roles - Job Post":
 * - White background card with 1px border (#e5dfd8)
 * - 16px border radius
 * - 24px padding
 * - 24px gap between sections
 *
 * Usage:
 * <FormCard>
 *   <FormSection title="Role Information">
 *     <FormField label="Job Title" required>
 *       <Input placeholder="Enter job title" />
 *     </FormField>
 *   </FormSection>
 * </FormCard>
 */

// ============================================
// FormCard - Outer container for form sections
// ============================================
export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Figma: white bg, 1px border #e5dfd8, 16px radius, 24px padding
        "bg-[var(--card-background)] border border-[var(--primitive-neutral-200)] rounded-2xl p-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  )
);
FormCard.displayName = "FormCard";

// ============================================
// FormSection - Section within a form card
// ============================================
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title (optional) */
  title?: string;
  /** Section description (optional) */
  description?: string;
  children: React.ReactNode;
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {title && (
        <h2 className="text-lg font-medium text-[var(--foreground-default)] py-2">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-[var(--primitive-neutral-500)] -mt-4">
          {description}
        </p>
      )}
      {children}
    </div>
  )
);
FormSection.displayName = "FormSection";

// ============================================
// FormField - Individual form field with label
// ============================================
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Help text below the label */
  helpText?: string;
  /** Error message */
  error?: string;
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, required, helpText, error, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-col gap-1">
        {/* Figma: 18px font, black text, 24px line height */}
        <label className="text-lg text-[var(--foreground-default)] leading-6">
          {label}
          {required && "*"}
        </label>
        {helpText && (
          // Figma: 14px font, #7a7671 text
          <p className="text-sm text-[var(--primitive-neutral-500)]">
            {helpText}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p className="text-sm text-[var(--primitive-red-600)]">
          {error}
        </p>
      )}
    </div>
  )
);
FormField.displayName = "FormField";

// ============================================
// FormTitleInput - Dashed underline title input
// ============================================
export interface FormTitleInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Additional class names */
  className?: string;
}

const FormTitleInput = React.forwardRef<HTMLInputElement, FormTitleInputProps>(
  ({ placeholder = "Untitled Role", required, value, onChange, className, ...props }, ref) => (
    <div
      className={cn(
        // Figma: dashed bottom border 2px, 24px font
        "border-b-2 border-dashed border-[var(--primitive-neutral-400)] pb-3 pt-2",
        "focus-within:border-[var(--primitive-green-500)]",
        "transition-colors duration-150",
        className
      )}
    >
      <div className="flex items-baseline gap-1">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent outline-none",
            "text-2xl font-semibold leading-8",
            // Text color: filled = black, placeholder = neutral-400
            "text-[var(--primitive-green-900)]",
            "placeholder:text-[var(--primitive-neutral-400)] placeholder:font-medium"
          )}
          {...props}
        />
        {required && (
          <span className="text-[var(--primitive-red-500)] text-2xl font-semibold">*</span>
        )}
      </div>
    </div>
  )
);
FormTitleInput.displayName = "FormTitleInput";

// ============================================
// FormRow - Horizontal layout for fields
// ============================================
export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (2 or 3) */
  columns?: 2 | 3;
  children: React.ReactNode;
}

const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ className, columns = 2, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid gap-6",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
FormRow.displayName = "FormRow";

export {
  FormCard,
  FormSection,
  FormField,
  FormTitleInput,
  FormRow,
};
