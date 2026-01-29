"use client";

import { useEffect, useRef, RefObject } from "react";

/**
 * Hook to detect clicks outside of a referenced element
 *
 * Usage:
 * ```tsx
 * function Dropdown({ isOpen, onClose }) {
 *   const ref = useClickOutside<HTMLDivElement>(onClose, isOpen);
 *   return isOpen ? <div ref={ref}>Dropdown content</div> : null;
 * }
 * ```
 *
 * @param handler - Callback to run when click outside is detected
 * @param enabled - Whether the listener is active (default: true)
 * @param events - Events to listen for (default: ['mousedown', 'touchstart'])
 * @returns React ref to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  enabled: boolean = true,
  events: Array<"mousedown" | "touchstart" | "click"> = ["mousedown", "touchstart"]
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler();
    };

    events.forEach((event) => {
      document.addEventListener(event, listener);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [handler, enabled, events]);

  return ref;
}

/**
 * Hook to use click outside with an existing ref
 *
 * Usage:
 * ```tsx
 * function Dropdown({ isOpen, onClose }) {
 *   const ref = useRef<HTMLDivElement>(null);
 *   useClickOutsideRef(ref, onClose, isOpen);
 *   return isOpen ? <div ref={ref}>Dropdown content</div> : null;
 * }
 * ```
 */
export function useClickOutsideRef<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
