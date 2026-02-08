import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Avatar, AvatarGroup, getColorFromString } from "../avatar";

describe("Avatar", () => {
  // Note: Radix Avatar uses delayMs for fallback rendering.
  // In jsdom, the fallback may not render synchronously.
  // We test what IS rendered: aria-labels, structure, size classes, etc.

  it("has correct aria-label with name", () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByLabelText(/JD - John Doe/)).toBeInTheDocument();
  });

  it("has correct aria-label with single initial for small size", () => {
    render(<Avatar name="John Doe" size="sm" />);
    expect(screen.getByLabelText(/J - John Doe/)).toBeInTheDocument();
  });

  it("has default aria-label when no name", () => {
    render(<Avatar />);
    expect(screen.getByLabelText("Avatar")).toBeInTheDocument();
  });

  it("applies default size class (h-12 w-12)", () => {
    const { container } = render(<Avatar name="A B" />);
    const root = container.querySelector("[class*='h-12']");
    expect(root).toBeInTheDocument();
  });

  it("applies small size class (h-8 w-8)", () => {
    const { container } = render(<Avatar name="A B" size="sm" />);
    const root = container.querySelector("[class*='h-8']");
    expect(root).toBeInTheDocument();
  });

  it("applies large size class (h-16 w-16)", () => {
    const { container } = render(<Avatar name="A B" size="lg" />);
    const root = container.querySelector("[class*='h-16']");
    expect(root).toBeInTheDocument();
  });

  it("applies circle shape by default", () => {
    const { container } = render(<Avatar name="A B" />);
    const root = container.querySelector("[class*='rounded-full']");
    expect(root).toBeInTheDocument();
  });

  it("applies square shape", () => {
    const { container } = render(<Avatar name="A B" shape="square" />);
    const root = container.querySelector("[class*='rounded-xl']");
    expect(root).toBeInTheDocument();
  });

  it("renders status indicator for online", () => {
    render(<Avatar name="John" status="online" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Online");
  });

  it("renders status indicator for busy", () => {
    render(<Avatar name="John" status="busy" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Busy");
  });

  it("renders badge indicator", () => {
    render(<Avatar name="John" badge="success" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Success");
  });

  it("shows loading skeleton when loading", () => {
    const { container } = render(<Avatar loading />);
    const skeleton = container.querySelector("[aria-busy='true']");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-label", "Loading avatar");
  });

  it("renders as button when onClick is provided", () => {
    const onClick = vi.fn();
    render(<Avatar name="John" onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not render button when not interactive", () => {
    const { container } = render(<Avatar name="John" />);
    expect(container.querySelector("button")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Avatar ref={ref} name="Test" />);
    expect(ref.current).toBeTruthy();
  });

  it("renders fallback initials after delay", async () => {
    render(<Avatar name="John Doe" />);
    await waitFor(() => {
      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });
});

describe("getColorFromString", () => {
  it("returns a valid color", () => {
    const validColors = ["green", "blue", "purple", "red", "orange", "yellow"];
    const color = getColorFromString("John Doe");
    expect(validColors).toContain(color);
  });

  it("returns consistent color for same string", () => {
    const color1 = getColorFromString("test@example.com");
    const color2 = getColorFromString("test@example.com");
    expect(color1).toBe(color2);
  });

  it("can produce different colors for different strings", () => {
    const colors = new Set(
      ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"].map(getColorFromString)
    );
    expect(colors.size).toBeGreaterThan(1);
  });
});

describe("AvatarGroup", () => {
  it("renders with group role", () => {
    render(<AvatarGroup avatars={[{ name: "Alice" }, { name: "Bob" }]} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("shows overflow count when exceeding max", () => {
    render(
      <AvatarGroup
        max={2}
        avatars={[{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }, { name: "Diana" }]}
      />
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders correct number of avatar items", () => {
    render(<AvatarGroup max={4} avatars={[{ name: "Alice" }, { name: "Bob" }]} />);
    // Check via aria-labels instead of text content (Radix delay)
    expect(screen.getByLabelText(/Alice/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bob/)).toBeInTheDocument();
  });

  it("renders children mode", () => {
    render(
      <AvatarGroup>
        <Avatar name="Child 1" />
        <Avatar name="Child 2" />
      </AvatarGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("has proper group label with count", () => {
    render(<AvatarGroup avatars={[{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]} />);
    expect(screen.getByLabelText("Group of 3 avatars")).toBeInTheDocument();
  });
});
