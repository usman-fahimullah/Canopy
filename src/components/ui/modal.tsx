"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Close as CloseIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

/**
 * Modal component based on Trails Design System
 *
 * Figma Specs:
 * - Container: 640px width, white background (#FFFFFF), 24px border radius, 1px neutral-300 border (#E6DFD8)
 * - Header: padding 24px 24px 12px, gap 12px
 * - Close button: 40px, padding 10px, rounded 16px, bg neutral-200 (#F2EDE9), icon 20px primary-800 (#0A3D2C)
 * - Title: heading-md (36px/48px), weight 500, color neutral-800 (#1F1D1C)
 * - Content: padding 12px 24px 24px, gap 16px
 * - ContentBox: padding 48px 24px, gap 16px, bg neutral-100 (#FAF9F7), rounded 8px
 * - Footer: padding 24px, gap 12px, buttons right-aligned
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
      "fixed inset-0 z-50 bg-[var(--overlay-light,rgba(0,0,0,0.5))]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Hide the close button */
  hideCloseButton?: boolean;
  /** Size variant */
  size?: "default" | "lg" | "xl" | "full";
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, hideCloseButton = false, size = "default", ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50",
        "translate-x-[-50%] translate-y-[-50%]",
        "flex flex-col items-start",
        "bg-surface border border-border",
        "rounded-[24px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "duration-200",
        "focus:outline-none",
        // Size variants
        size === "default" && "w-[640px] max-w-[calc(100vw-2rem)]",
        size === "lg" && "w-[800px] max-w-[calc(100vw-2rem)]",
        size === "xl" && "w-[1024px] max-w-[calc(100vw-2rem)]",
        size === "full" && "w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
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
 * ModalHeader - Header section with close button and title
 * Figma: padding 24px 24px 12px, gap 12px
 */
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hideCloseButton?: boolean }
>(({ className, children, hideCloseButton = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col justify-center items-start w-full",
      "pt-6 px-6 pb-3",
      "gap-3",
      className
    )}
    {...props}
  >
    {/* Close button - top left per Figma design */}
    {!hideCloseButton && (
      <DialogPrimitive.Close
        className={cn(
          "flex items-center justify-center",
          "w-10 h-10 p-[10px]",
          "bg-background-muted hover:bg-background-emphasized",
          "rounded-[16px]",
          "text-foreground",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none"
        )}
        aria-label="Close"
      >
        <CloseIcon className="w-5 h-5" />
      </DialogPrimitive.Close>
    )}
    {children}
  </div>
));
ModalHeader.displayName = "ModalHeader";

/**
 * ModalTitle - Modal title text
 * Figma: heading-md (36px/48px), font-weight 500, color #1F1D1C
 */
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-heading-md font-medium text-foreground",
      "w-full",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * ModalDescription - Optional description text below title
 */
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-body text-foreground-muted w-full", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

/**
 * ModalBody - Content section
 * Figma: padding 12px 24px 24px, gap 16px
 */
const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-start w-full",
      "pt-3 px-6 pb-6",
      "gap-4",
      "bg-surface",
      className
    )}
    {...props}
  />
));
ModalBody.displayName = "ModalBody";

/**
 * ModalContentBox - The styled content container shown in the Figma design
 * Figma: padding 48px 24px, gap 16px, bg #FAF9F7, rounded 8px
 */
const ModalContentBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center",
      "w-full py-12 px-6",
      "gap-4",
      "bg-background-subtle rounded-lg",
      "text-center",
      className
    )}
    {...props}
  />
));
ModalContentBox.displayName = "ModalContentBox";

/**
 * ModalFooter - Footer section with buttons
 * Figma: padding 24px, gap 12px, buttons right-aligned
 */
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col justify-center items-start w-full",
      "p-6",
      className
    )}
    {...props}
  >
    <div className="flex flex-row justify-end items-center w-full gap-3">
      {props.children}
    </div>
  </div>
));
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
};
