import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("button-primary-background");
  });

  it("applies the specified variant class", () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("button-destructive-background");
  });

  it("applies size classes", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("text-lg");
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading is true", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("shows spinner when loading", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });

  it("does not show spinner when not loading", () => {
    render(<Button>Normal</Button>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Button leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Button>);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Button rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Button>);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("hides icons with aria-hidden", () => {
    render(
      <Button leftIcon={<span>I</span>} rightIcon={<span>R</span>}>
        Text
      </Button>
    );
    const hiddenSpans = document.querySelectorAll("[aria-hidden='true']");
    expect(hiddenSpans.length).toBe(2);
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("forwards ref to the button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes additional HTML attributes", () => {
    render(
      <Button data-testid="custom-btn" type="submit">
        Submit
      </Button>
    );
    const btn = screen.getByTestId("custom-btn");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("applies custom className", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
