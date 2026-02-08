import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText("Status").tagName).toBe("SPAN");
  });

  it("applies default variant by default", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default").className).toContain("badge-primary-background");
  });

  it("applies critical variant", () => {
    render(<Badge variant="critical">Error</Badge>);
    expect(screen.getByText("Error").className).toContain("badge-error-background");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Done</Badge>);
    expect(screen.getByText("Done").className).toContain("badge-success-background");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">Warn</Badge>);
    expect(screen.getByText("Warn").className).toContain("badge-warning-background");
  });

  it("applies neutral variant", () => {
    render(<Badge variant="neutral">Draft</Badge>);
    expect(screen.getByText("Draft").className).toContain("badge-neutral-background");
  });

  it("applies feature variant", () => {
    render(<Badge variant="feature">New</Badge>);
    expect(screen.getByText("New").className).toContain("badge-info-background");
  });

  it("applies small size", () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small").className).toContain("text-caption-sm");
  });

  it("applies large size", () => {
    render(<Badge size="lg">Large</Badge>);
    expect(screen.getByText("Large").className).toContain("text-body-sm");
  });

  it("renders icon when provided", () => {
    render(<Badge icon={<span data-testid="badge-icon">!</span>}>With Icon</Badge>);
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    // Icon container should be aria-hidden
    const container = screen.getByTestId("badge-icon").closest("[aria-hidden]");
    expect(container).toHaveAttribute("aria-hidden", "true");
  });

  it("renders dot indicator when dot is true", () => {
    const { container } = render(<Badge dot>Status</Badge>);
    const dot = container.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain("rounded-full");
  });

  it("does not render dot when icon is provided", () => {
    const { container } = render(
      <Badge dot icon={<span>I</span>}>
        Status
      </Badge>
    );
    // Should render icon, not dot
    const dots = container.querySelectorAll(".rounded-full.h-1\\.5");
    expect(dots.length).toBe(0);
  });

  it("applies custom dot color", () => {
    const { container } = render(
      <Badge dot dotColor="#ff0000">
        Custom Dot
      </Badge>
    );
    const dot = container.querySelector("[aria-hidden='true']");
    expect((dot as HTMLElement).style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("applies custom className", () => {
    render(<Badge className="extra-class">Custom</Badge>);
    expect(screen.getByText("Custom").className).toContain("extra-class");
  });

  it("passes additional HTML attributes", () => {
    render(<Badge data-testid="my-badge">Test</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });

  it("applies outline variant with border", () => {
    render(<Badge variant="outline">Outlined</Badge>);
    expect(screen.getByText("Outlined").className).toContain("border");
  });
});
