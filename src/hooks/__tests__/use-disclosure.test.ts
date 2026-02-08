import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDisclosure, useDisclosureGroup } from "../use-disclosure";

describe("useDisclosure", () => {
  it("starts closed by default", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("starts open when defaultIsOpen is true", () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it("opens with onOpen", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.onOpen();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("closes with onClose", () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));

    act(() => {
      result.current.onClose();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("toggles with onToggle", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("calls onOpenChange callback", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useDisclosure({ onOpenChange }));

    act(() => {
      result.current.onOpen();
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("supports controlled mode", () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ isOpen }) => useDisclosure({ isOpen, onOpenChange }),
      { initialProps: { isOpen: false } }
    );

    expect(result.current.isOpen).toBe(false);

    // In controlled mode, onToggle calls onOpenChange but doesn't change internal state
    act(() => {
      result.current.onToggle();
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Parent controls the actual state
    rerender({ isOpen: true });
    expect(result.current.isOpen).toBe(true);
  });

  it("getTriggerProps returns correct props", () => {
    const { result } = renderHook(() => useDisclosure());
    const triggerProps = result.current.getTriggerProps();

    expect(triggerProps["aria-expanded"]).toBe(false);
    expect(typeof triggerProps.onClick).toBe("function");
  });

  it("getTriggerProps includes aria-controls when id is provided", () => {
    const { result } = renderHook(() => useDisclosure({ id: "test" }));
    const triggerProps = result.current.getTriggerProps() as Record<string, unknown>;

    expect(triggerProps["aria-controls"]).toBe("test-content");
  });

  it("getContentProps returns correct props", () => {
    const { result } = renderHook(() => useDisclosure());
    const contentProps = result.current.getContentProps();

    expect(contentProps["aria-hidden"]).toBe(true);
    expect(contentProps.hidden).toBe(true);
  });

  it("getContentProps includes id when provided", () => {
    const { result } = renderHook(() => useDisclosure({ id: "test" }));
    const contentProps = result.current.getContentProps() as Record<string, unknown>;

    expect(contentProps.id).toBe("test-content");
  });
});

describe("useDisclosureGroup", () => {
  it("starts with no items open", () => {
    const { result } = renderHook(() => useDisclosureGroup());
    expect(result.current.openItems.size).toBe(0);
  });

  it("starts with default open items", () => {
    const { result } = renderHook(() => useDisclosureGroup({ defaultOpenItems: ["a", "b"] }));
    expect(result.current.isOpen("a")).toBe(true);
    expect(result.current.isOpen("b")).toBe(true);
  });

  it("toggles items open and closed", () => {
    const { result } = renderHook(() => useDisclosureGroup());

    act(() => {
      result.current.toggle("item-1");
    });
    expect(result.current.isOpen("item-1")).toBe(true);

    act(() => {
      result.current.toggle("item-1");
    });
    expect(result.current.isOpen("item-1")).toBe(false);
  });

  it("only allows one item open at a time when allowMultiple is false", () => {
    const { result } = renderHook(() => useDisclosureGroup({ allowMultiple: false }));

    act(() => {
      result.current.toggle("a");
    });
    expect(result.current.isOpen("a")).toBe(true);

    act(() => {
      result.current.toggle("b");
    });
    expect(result.current.isOpen("a")).toBe(false);
    expect(result.current.isOpen("b")).toBe(true);
  });

  it("allows multiple items open when allowMultiple is true", () => {
    const { result } = renderHook(() => useDisclosureGroup({ allowMultiple: true }));

    act(() => {
      result.current.toggle("a");
    });
    act(() => {
      result.current.toggle("b");
    });

    expect(result.current.isOpen("a")).toBe(true);
    expect(result.current.isOpen("b")).toBe(true);
  });

  it("opens a specific item", () => {
    const { result } = renderHook(() => useDisclosureGroup());

    act(() => {
      result.current.open("item-1");
    });
    expect(result.current.isOpen("item-1")).toBe(true);
  });

  it("closes a specific item", () => {
    const { result } = renderHook(() => useDisclosureGroup({ defaultOpenItems: ["item-1"] }));

    act(() => {
      result.current.close("item-1");
    });
    expect(result.current.isOpen("item-1")).toBe(false);
  });

  it("closes all items", () => {
    const { result } = renderHook(() =>
      useDisclosureGroup({ allowMultiple: true, defaultOpenItems: ["a", "b", "c"] })
    );

    act(() => {
      result.current.closeAll();
    });
    expect(result.current.openItems.size).toBe(0);
  });

  it("open() clears others when allowMultiple is false", () => {
    const { result } = renderHook(() =>
      useDisclosureGroup({ allowMultiple: false, defaultOpenItems: ["a"] })
    );

    act(() => {
      result.current.open("b");
    });
    expect(result.current.isOpen("a")).toBe(false);
    expect(result.current.isOpen("b")).toBe(true);
  });
});
