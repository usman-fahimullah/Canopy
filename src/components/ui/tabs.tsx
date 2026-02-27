"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-background-muted p-1 text-foreground-muted",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-body-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-foreground-subtle hover:text-foreground dark:text-foreground-muted",
      "data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

/**
 * Underline variant - tabs with underline indicator instead of pill background
 */
const TabsListUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start gap-4 border-b border-border",
      className
    )}
    {...props}
  />
));
TabsListUnderline.displayName = "TabsListUnderline";

const TabsTriggerUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-1 pb-3 text-body-sm font-medium transition-all",
      "-mb-px border-b-2 border-transparent",
      "text-foreground-subtle hover:text-foreground dark:text-foreground-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:border-[var(--primitive-blue-500)] data-[state=active]:text-[var(--primitive-blue-700)] dark:data-[state=active]:text-[var(--primitive-blue-400)]",
      className
    )}
    {...props}
  />
));
TabsTriggerUnderline.displayName = "TabsTriggerUnderline";

/**
 * Animated Underline Tabs - with smooth sliding indicator
 */
interface TabsListAnimatedProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** Active tab value for indicator positioning */
  activeValue?: string;
}

const TabsListAnimated = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListAnimatedProps
>(({ className, activeValue, children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (!listRef.current || !activeValue) return;

    const activeTab = listRef.current.querySelector(`[data-state="active"]`) as HTMLElement;
    if (activeTab) {
      setIndicatorStyle({
        width: activeTab.offsetWidth,
        transform: `translateX(${activeTab.offsetLeft}px)`,
      });
    }
  }, [activeValue]);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        // Handle both refs
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
        (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "relative inline-flex h-10 items-center justify-start gap-4 border-b border-border",
        className
      )}
      {...props}
    >
      {children}
      {/* Animated indicator */}
      <span
        className="absolute bottom-0 h-0.5 bg-[var(--primitive-blue-500)] transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
    </TabsPrimitive.List>
  );
});
TabsListAnimated.displayName = "TabsListAnimated";

const TabsTriggerAnimated = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 pb-3 text-body-sm font-medium transition-colors",
      "text-foreground-subtle hover:text-foreground dark:text-foreground-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-[var(--primitive-blue-700)] dark:data-[state=active]:text-[var(--primitive-blue-400)]",
      className
    )}
    {...props}
  />
));
TabsTriggerAnimated.displayName = "TabsTriggerAnimated";

/**
 * Vertical Tabs - for sidebar-style navigation
 */
const TabsListVertical = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("flex flex-col space-y-1", className)} {...props} />
));
TabsListVertical.displayName = "TabsListVertical";

const TabsTriggerVertical = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex items-center justify-start whitespace-nowrap rounded-lg px-3 py-2 text-body-sm font-medium transition-all",
      "text-foreground-subtle hover:bg-background-muted hover:text-foreground dark:text-foreground-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "dark:data-[state=active]:bg-[var(--primitive-blue-500)]/15 data-[state=active]:bg-[var(--primitive-blue-100)] data-[state=active]:text-[var(--primitive-blue-700)] dark:data-[state=active]:text-[var(--primitive-blue-400)]",
      className
    )}
    {...props}
  />
));
TabsTriggerVertical.displayName = "TabsTriggerVertical";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListUnderline,
  TabsTriggerUnderline,
  TabsListAnimated,
  TabsTriggerAnimated,
  TabsListVertical,
  TabsTriggerVertical,
};
