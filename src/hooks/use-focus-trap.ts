"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
  );
}

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  enabled?: boolean;
  /** Return focus to trigger element on unmount */
  returnFocus?: boolean;
  /** Initial element to focus (selector or element) */
  initialFocus?: string | HTMLElement | null;
}

/**
 * Hook to trap focus within a container
 *
 * Usage:
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   const containerRef = useFocusTrap<HTMLDivElement>({ enabled: isOpen });
 *   return isOpen ? <div ref={containerRef}>{children}</div> : null;
 * }
 * ```
 *
 * @param options - Focus trap configuration
 * @returns React ref to attach to container element
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions = {}
) {
  const { enabled = true, returnFocus = true, initialFocus = null } = options;
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store the previously focused element when trap is enabled
  useEffect(() => {
    if (enabled && returnFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [enabled, returnFocus]);

  // Focus the initial element when trap is enabled
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let elementToFocus: HTMLElement | null = null;

    if (initialFocus) {
      if (typeof initialFocus === "string") {
        elementToFocus = container.querySelector<HTMLElement>(initialFocus);
      } else {
        elementToFocus = initialFocus;
      }
    }

    if (!elementToFocus) {
      const focusable = getFocusableElements(container);
      elementToFocus = focusable[0] || container;
    }

    // Delay focus to ensure the element is rendered
    requestAnimationFrame(() => {
      elementToFocus?.focus();
    });
  }, [enabled, initialFocus]);

  // Return focus when trap is disabled
  useEffect(() => {
    return () => {
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [returnFocus]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || event.key !== "Tab" || !containerRef.current) return;

      const container = containerRef.current;
      const focusable = getFocusableElements(container);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // Shift+Tab on first element -> focus last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> focus first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [enabled]
  );

  // Attach/detach keyboard listener
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);

  return containerRef;
}
