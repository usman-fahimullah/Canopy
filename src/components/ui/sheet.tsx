"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Sheet component for slide-out panels
 *
 * Uses semantic tokens:
 * - surface-overlay for background
 * - border-default for border
 * - foreground-default for text
 */

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "bg-background-inverse/50 fixed inset-0 z-modal-backdrop",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  cn(
    "fixed z-modal gap-4 bg-surface-overlay p-6 shadow-xl",
    "transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500"
  ),
  {
    variants: {
      side: {
        top: cn(
          "inset-x-0 top-0 border-b border-border-default",
          "data-[state=closed]:slide-out-to-top",
          "data-[state=open]:slide-in-from-top"
        ),
        bottom: cn(
          "inset-x-0 bottom-0 border-t border-border-default",
          "data-[state=closed]:slide-out-to-bottom",
          "data-[state=open]:slide-in-from-bottom"
        ),
        left: cn(
          "inset-y-0 left-0 h-full w-3/4 border-r border-border-default sm:max-w-sm",
          "data-[state=closed]:slide-out-to-left",
          "data-[state=open]:slide-in-from-left"
        ),
        right: cn(
          "inset-y-0 right-0 h-full w-3/4 border-l border-border-default sm:max-w-sm",
          "data-[state=closed]:slide-out-to-right",
          "data-[state=open]:slide-in-from-right"
        ),
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "",
        "3xl": "",
        "4xl": "",
        "5xl": "",
        full: "",
      },
    },
    compoundVariants: [
      { side: "left", size: "sm", className: "sm:max-w-xs" },
      { side: "left", size: "md", className: "sm:max-w-sm" },
      { side: "left", size: "lg", className: "sm:max-w-md" },
      { side: "left", size: "xl", className: "sm:max-w-lg" },
      { side: "left", size: "2xl", className: "sm:max-w-2xl" },
      { side: "left", size: "3xl", className: "sm:max-w-3xl" },
      { side: "left", size: "4xl", className: "sm:max-w-4xl" },
      { side: "left", size: "5xl", className: "sm:max-w-5xl" },
      { side: "left", size: "full", className: "w-full max-w-none" },
      { side: "right", size: "sm", className: "sm:max-w-xs" },
      { side: "right", size: "md", className: "sm:max-w-sm" },
      { side: "right", size: "lg", className: "sm:max-w-md" },
      { side: "right", size: "xl", className: "sm:max-w-lg" },
      { side: "right", size: "2xl", className: "sm:max-w-2xl" },
      { side: "right", size: "3xl", className: "sm:max-w-3xl" },
      { side: "right", size: "4xl", className: "sm:max-w-4xl" },
      { side: "right", size: "5xl", className: "sm:max-w-5xl" },
      { side: "right", size: "full", className: "w-full max-w-none" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Hide the close button */
  hideClose?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side, size, className, children, hideClose = false, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side, size }), className)}
      {...props}
    >
      {children}
      {!hideClose && (
        <SheetPrimitive.Close
          className={cn(
            "absolute right-4 top-4 rounded-md p-1",
            "ring-offset-background-default opacity-70",
            "transition-opacity hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-border-interactive-focus focus:ring-offset-2",
            "disabled:pointer-events-none",
            "data-[state=open]:bg-background-muted"
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
));

SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);

SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-foreground-default text-heading-sm font-medium", className)}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-caption text-foreground-muted", className)}
    {...props}
  />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
