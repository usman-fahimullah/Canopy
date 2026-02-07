import { useState, useCallback } from "react";

/**
 * useUndo Hook
 *
 * Manages undo state for pipeline operations (drag-and-drop candidate moves).
 *
 * Returns:
 * - showUndo: boolean - whether to show the undo toast
 * - undoMessage: string - message to display in the toast
 * - triggerUndo(message, undoFn): void - trigger an undo action
 * - dismissUndo: void - dismiss the undo toast
 *
 * Example:
 *   const { showUndo, undoMessage, triggerUndo, dismissUndo } = useUndo();
 *
 *   const handleDragEnd = async (candidate, newStage) => {
 *     const oldStage = candidate.stage;
 *
 *     // Optimistically update UI
 *     setCandidate({ ...candidate, stage: newStage });
 *
 *     try {
 *       // Make API call
 *       await updateCandidateStage(candidate.id, newStage);
 *       triggerUndo(`Moved to ${newStage}`, async () => {
 *         setCandidate({ ...candidate, stage: oldStage });
 *         await updateCandidateStage(candidate.id, oldStage);
 *       });
 *     } catch (error) {
 *       // Revert on error
 *       setCandidate({ ...candidate, stage: oldStage });
 *     }
 *   };
 *
 *   return (
 *     <Fragment>
 *       {showUndo && (
 *         <UndoToast message={undoMessage} onUndo={dismissUndo} />
 *       )}
 *     </Fragment>
 *   );
 */

interface UndoState {
  showUndo: boolean;
  undoMessage: string;
  undoFn: (() => void) | null;
}

export function useUndo() {
  const [state, setState] = useState<UndoState>({
    showUndo: false,
    undoMessage: "",
    undoFn: null,
  });

  const triggerUndo = useCallback((message: string, undoFn: () => void) => {
    setState({
      showUndo: true,
      undoMessage: message,
      undoFn,
    });
  }, []);

  const dismissUndo = useCallback(() => {
    setState((prev) => {
      if (prev.undoFn) {
        prev.undoFn();
      }
      return {
        showUndo: false,
        undoMessage: "",
        undoFn: null,
      };
    });
  }, []);

  const clearUndo = useCallback(() => {
    setState({
      showUndo: false,
      undoMessage: "",
      undoFn: null,
    });
  }, []);

  return {
    showUndo: state.showUndo,
    undoMessage: state.undoMessage,
    triggerUndo,
    dismissUndo,
    clearUndo,
  };
}
