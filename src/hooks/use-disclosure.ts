"use client";

import { useState, useCallback, useMemo } from "react";

interface DisclosureState {
  /** Whether the disclosure is open */
  isOpen: boolean;
  /** Open the disclosure */
  onOpen: () => void;
  /** Close the disclosure */
  onClose: () => void;
  /** Toggle the disclosure */
  onToggle: () => void;
  /** Get props to spread on the trigger element */
  getTriggerProps: () => {
    onClick: () => void;
    "aria-expanded": boolean;
  };
  /** Get props to spread on the content element */
  getContentProps: () => {
    "aria-hidden": boolean;
    hidden: boolean;
  };
}

interface UseDisclosureOptions {
  /** Initial open state */
  defaultIsOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** ID for accessibility */
  id?: string;
}

/**
 * Hook to manage open/close state for disclosure patterns
 *
 * Usage:
 * ```tsx
 * function Accordion() {
 *   const { isOpen, onToggle, getTriggerProps, getContentProps } = useDisclosure();
 *
 *   return (
 *     <div>
 *       <button {...getTriggerProps()}>Toggle</button>
 *       <div {...getContentProps()}>Content</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * Controlled usage:
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const disclosure = useDisclosure({ isOpen, onOpenChange: (open) => !open && onClose() });
 *   // ...
 * }
 * ```
 */
export function useDisclosure(options: UseDisclosureOptions = {}): DisclosureState {
  const { defaultIsOpen = false, isOpen: controlledIsOpen, onOpenChange, id } = options;

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultIsOpen);

  // Determine if component is controlled
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledIsOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const onOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onToggle = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

  const getTriggerProps = useCallback(() => {
    return {
      onClick: onToggle,
      "aria-expanded": isOpen,
      ...(id && { "aria-controls": `${id}-content` }),
    };
  }, [onToggle, isOpen, id]);

  const getContentProps = useCallback(() => {
    return {
      "aria-hidden": !isOpen,
      hidden: !isOpen,
      ...(id && { id: `${id}-content` }),
    };
  }, [isOpen, id]);

  return useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
      onToggle,
      getTriggerProps,
      getContentProps,
    }),
    [isOpen, onOpen, onClose, onToggle, getTriggerProps, getContentProps]
  );
}

/**
 * Hook to manage multiple disclosures (accordion pattern)
 *
 * Usage:
 * ```tsx
 * const { openItems, toggle, isOpen } = useDisclosureGroup({
 *   allowMultiple: false
 * });
 * ```
 */
interface UseDisclosureGroupOptions {
  /** Allow multiple items to be open at once */
  allowMultiple?: boolean;
  /** Default open items */
  defaultOpenItems?: string[];
}

interface DisclosureGroupState {
  openItems: Set<string>;
  toggle: (id: string) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  isOpen: (id: string) => boolean;
  closeAll: () => void;
}

export function useDisclosureGroup(
  options: UseDisclosureGroupOptions = {}
): DisclosureGroupState {
  const { allowMultiple = false, defaultOpenItems = [] } = options;

  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpenItems));

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  const open = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = allowMultiple ? new Set(prev) : new Set<string>();
        next.add(id);
        return next;
      });
    },
    [allowMultiple]
  );

  const close = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isOpen = useCallback((id: string) => openItems.has(id), [openItems]);

  const closeAll = useCallback(() => setOpenItems(new Set()), []);

  return useMemo(
    () => ({
      openItems,
      toggle,
      open,
      close,
      isOpen,
      closeAll,
    }),
    [openItems, toggle, open, close, isOpen, closeAll]
  );
}
