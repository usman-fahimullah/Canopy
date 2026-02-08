import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUndo } from "../use-undo";

describe("useUndo", () => {
  it("starts with undo hidden", () => {
    const { result } = renderHook(() => useUndo());

    expect(result.current.showUndo).toBe(false);
    expect(result.current.undoMessage).toBe("");
  });

  it("shows undo after triggerUndo is called", () => {
    const { result } = renderHook(() => useUndo());
    const undoFn = vi.fn();

    act(() => {
      result.current.triggerUndo("Moved to Interview", undoFn);
    });

    expect(result.current.showUndo).toBe(true);
    expect(result.current.undoMessage).toBe("Moved to Interview");
  });

  it("executes undo function and resets state on dismissUndo", () => {
    const { result } = renderHook(() => useUndo());
    const undoFn = vi.fn();

    act(() => {
      result.current.triggerUndo("Moved to Interview", undoFn);
    });

    act(() => {
      result.current.dismissUndo();
    });

    expect(undoFn).toHaveBeenCalledTimes(1);
    expect(result.current.showUndo).toBe(false);
    expect(result.current.undoMessage).toBe("");
  });

  it("clears undo without executing undo function on clearUndo", () => {
    const { result } = renderHook(() => useUndo());
    const undoFn = vi.fn();

    act(() => {
      result.current.triggerUndo("Moved to Interview", undoFn);
    });

    act(() => {
      result.current.clearUndo();
    });

    expect(undoFn).not.toHaveBeenCalled();
    expect(result.current.showUndo).toBe(false);
    expect(result.current.undoMessage).toBe("");
  });

  it("replaces previous undo when triggerUndo is called again", () => {
    const { result } = renderHook(() => useUndo());
    const firstUndoFn = vi.fn();
    const secondUndoFn = vi.fn();

    act(() => {
      result.current.triggerUndo("First action", firstUndoFn);
    });

    act(() => {
      result.current.triggerUndo("Second action", secondUndoFn);
    });

    expect(result.current.undoMessage).toBe("Second action");

    act(() => {
      result.current.dismissUndo();
    });

    expect(secondUndoFn).toHaveBeenCalledTimes(1);
    expect(firstUndoFn).not.toHaveBeenCalled();
  });

  it("handles dismissUndo with no undo function", () => {
    const { result } = renderHook(() => useUndo());

    // Should not throw
    act(() => {
      result.current.dismissUndo();
    });

    expect(result.current.showUndo).toBe(false);
  });
});
