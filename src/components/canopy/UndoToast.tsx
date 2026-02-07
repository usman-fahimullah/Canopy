"use client";

import * as React from "react";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Undo Toast Component
 *
 * A dismissible toast notification with an "Undo" action button.
 * Appears at the bottom-center of the screen with auto-dismiss timer.
 *
 * Props:
 * - message: Toast message (e.g., "Moved to Interview")
 * - onUndo: Callback when Undo is clicked
 * - duration: Auto-dismiss timeout in ms (default: 8000)
 *
 * Example:
 *   <UndoToast
 *     message="Moved to Interview"
 *     onUndo={handleUndo}
 *   />
 */

export interface UndoToastProps {
  message: string;
  onUndo: () => void;
  duration?: number;
}

export function UndoToast({ message, onUndo, duration = 8000 }: UndoToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleUndo = React.useCallback(() => {
    setIsVisible(false);
    onUndo();
  }, [onUndo]);

  React.useEffect(() => {
    // Set up auto-dismiss timer
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Update countdown timer every 100ms for smooth visual feedback
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newValue = prev - 100;
        return newValue <= 0 ? 0 : newValue;
      });
    }, 100);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  if (!isVisible) return null;

  const progressPercent = (timeLeft / duration) * 100;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-toast -translate-x-1/2 transform transition-all duration-200",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <Toast
        variant="info"
        dismissible={true}
        onDismiss={() => setIsVisible(false)}
        actionLabel="Undo"
        onAction={handleUndo}
        hideIcon={false}
      >
        <div className="flex-1">
          <p className="text-body-sm">{message}</p>
          {/* Progress bar */}
          <div className="bg-foreground-muted/20 mt-2 h-1 w-full overflow-hidden rounded-full">
            <div
              className="h-full bg-foreground-muted transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Toast>
    </div>
  );
}
