"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * Modal component based on Trails Design System
 *
 * Default layout (standard pattern):
 * - Header: icon badge + title + close button in a flex row, border-b
 * - Body: content area with px-8 py-4
 * - Footer: right-aligned buttons with border-t
 *
 * Feature layout (variant="feature" on ModalHeader):
 * - Header: close button above title, heading-md title
 * - Body: same as default
 * - Footer: same as default
 * - ContentBox: centered content container with subtle background
 */

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-modal-backdrop bg-[var(--overlay-light,rgba(0,0,0,0.5))]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Hide the close button */
  hideCloseButton?: boolean;
  /** Size variant */
  size?: "default" | "md" | "lg" | "xl" | "full";
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, size = "default", ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-modal",
        "translate-x-[-50%] translate-y-[-50%]",
        "flex flex-col items-start",
        "bg-[var(--modal-background,var(--background-default))]",
        "border border-[var(--modal-border,var(--border-muted))]",
        "rounded-[var(--radius-modal)]",
        "shadow-[var(--shadow-modal)]",
        "overflow-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "duration-200",
        "focus:outline-none",
        // Size variants
        size === "default" && "w-[640px] max-w-[calc(100vw-2rem)]",
        size === "md" && "w-[720px] max-w-[calc(100vw-2rem)]",
        size === "lg" && "w-[800px] max-w-[calc(100vw-2rem)]",
        size === "xl" && "w-[1024px] max-w-[calc(100vw-2rem)]",
        size === "full" && "h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

/**
 * ModalIconBadge — Colored icon badge for the modal header.
 *
 * Usage:
 *   <ModalHeader icon={<User weight="regular" className="h-6 w-6" />}
 *                iconBg="bg-[var(--primitive-blue-200)]">
 *
 * Or standalone:
 *   <ModalIconBadge className="bg-[var(--primitive-blue-200)]">
 *     <User weight="regular" className="h-6 w-6" />
 *   </ModalIconBadge>
 */
const ModalIconBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("shrink-0 rounded-lg p-1", className)} {...props} />
  )
);
ModalIconBadge.displayName = "ModalIconBadge";

/**
 * ModalHeader — Header section with icon, title, and close button.
 *
 * Default variant: flex row with optional icon badge + title + close button, border-b
 * Feature variant: close button above title, no border (legacy style for feature moments)
 */
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Icon element rendered inside a ModalIconBadge */
    icon?: React.ReactNode;
    /** Background class for the icon badge, e.g. "bg-[var(--primitive-blue-200)]" */
    iconBg?: string;
    /** Header layout variant */
    variant?: "default" | "feature";
    /** Hide the close button */
    hideCloseButton?: boolean;
  }
>(
  (
    { className, children, icon, iconBg, variant = "default", hideCloseButton = false, ...props },
    ref
  ) => {
    if (variant === "feature") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex w-full flex-col items-start justify-center",
            "px-6 pb-3 pt-6",
            "gap-3",
            className
          )}
          {...props}
        >
          {!hideCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                "flex items-center justify-center",
                "h-10 w-10 p-[10px]",
                "bg-background-muted hover:bg-background-emphasized",
                "rounded-[16px]",
                "text-foreground",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                "disabled:pointer-events-none"
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          )}
          {children}
        </div>
      );
    }

    // Default variant: icon + title + close in a row with border-b
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center gap-3",
          "border-b border-[var(--modal-border,var(--border-muted))]",
          "px-8 py-4",
          className
        )}
        {...props}
      >
        {icon && <ModalIconBadge className={iconBg}>{icon}</ModalIconBadge>}
        <div className="min-w-0 flex-1">{children}</div>
        {!hideCloseButton && (
          <DialogPrimitive.Close asChild>
            <Button
              variant="tertiary"
              size="icon"
              className="shrink-0 rounded-2xl"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogPrimitive.Close>
        )}
      </div>
    );
  }
);
ModalHeader.displayName = "ModalHeader";

/**
 * ModalTitle — Modal title text.
 *
 * Default: text-body font-medium (standard modals)
 * Large: text-heading-md font-medium (feature moments)
 */
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
    /** Title size variant */
    variant?: "default" | "large";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      variant === "default" && "text-body font-medium text-foreground",
      variant === "large" && "text-heading-md font-medium text-foreground",
      "w-full",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * ModalDescription — Optional description text below title
 */
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("w-full text-body text-foreground-muted", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

/**
 * ModalBody — Content section
 */
const ModalBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex w-full flex-col items-start", "px-8 py-4", "gap-4", className)}
      {...props}
    />
  )
);
ModalBody.displayName = "ModalBody";

/**
 * ModalContentBox — Styled content container for feature moments.
 * Centered content with subtle background.
 */
const ModalContentBox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center",
        "w-full px-6 py-12",
        "gap-4",
        "rounded-lg bg-background-subtle",
        "text-center",
        className
      )}
      {...props}
    />
  )
);
ModalContentBox.displayName = "ModalContentBox";

/**
 * ModalFooter — Footer section with right-aligned buttons and top border.
 */
const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-center justify-end",
        "border-t border-[var(--modal-border,var(--border-muted))]",
        "px-8 py-4",
        "gap-3",
        className
      )}
      {...props}
    />
  )
);
ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalContentBox,
  ModalIconBadge,
};
