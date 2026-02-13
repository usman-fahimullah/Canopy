"use client";

import * as React from "react";

/**
 * Pipeline toast state for undo-able drag-and-drop operations.
 *
 * Manages a queue of toast notifications with optional undo actions
 * that auto-dismiss after a configurable duration.
 */

export interface PipelineToast {
  id: string;
  message: string;
  variant: "success" | "info" | "warning" | "critical";
  /** Called when user clicks "Undo" */
  onUndo?: () => void;
  /** Auto-dismiss duration in ms (default: 5000) */
  duration?: number;
}

export function usePipelineToast() {
  const [toast, setToast] = React.useState<PipelineToast | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = React.useCallback((newToast: Omit<PipelineToast, "id">) => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const id = `toast-${Date.now()}`;
    const toastWithId = { ...newToast, id };
    setToast(toastWithId);

    // Auto-dismiss
    const duration = newToast.duration ?? 5000;
    timerRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, duration);

    return id;
  }, []);

  const dismissToast = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  }, []);

  const handleUndo = React.useCallback(() => {
    if (toast?.onUndo) {
      toast.onUndo();
    }
    dismissToast();
  }, [toast, dismissToast]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    toast,
    showToast,
    dismissToast,
    handleUndo,
  };
}
