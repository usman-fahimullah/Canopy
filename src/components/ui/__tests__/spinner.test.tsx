import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner, LoadingOverlay, LoadingInline } from "../spinner";

describe("Spinner", () => {
  it("renders with role status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has default aria-label of Loading", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts custom label", () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Saving changes");
    expect(screen.getByText("Saving changes")).toBeInTheDocument();
  });

  it("renders sr-only text for screen readers", () => {
    render(<Spinner />);
    const srText = screen.getByText("Loading");
    expect(srText.className).toContain("sr-only");
  });

  it("applies default medium size", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("h-6");
    expect(spinner.className).toContain("w-6");
  });

  it("applies xs size", () => {
    render(<Spinner size="xs" />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("h-3");
    expect(spinner.className).toContain("w-3");
  });

  it("applies xl size", () => {
    render(<Spinner size="xl" />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("h-12");
    expect(spinner.className).toContain("w-12");
  });

  it("applies default variant class", () => {
    render(<Spinner />);
    expect(screen.getByRole("status").className).toContain("text-foreground-brand");
  });

  it("applies muted variant", () => {
    render(<Spinner variant="muted" />);
    expect(screen.getByRole("status").className).toContain("text-foreground-muted");
  });

  it("applies current variant", () => {
    render(<Spinner variant="current" />);
    expect(screen.getByRole("status").className).toContain("text-current");
  });

  it("applies inverse variant", () => {
    render(<Spinner variant="inverse" />);
    expect(screen.getByRole("status").className).toContain("text-foreground-inverse");
  });

  it("has animate-spin class", () => {
    render(<Spinner />);
    expect(screen.getByRole("status").className).toContain("animate-spin");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(<Spinner className="my-spinner" />);
    expect(screen.getByRole("status").className).toContain("my-spinner");
  });
});

describe("LoadingOverlay", () => {
  it("renders with spinner and label", () => {
    render(<LoadingOverlay />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(<LoadingOverlay label="Processing..." />);
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("applies fixed positioning for overlay", () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay.className).toContain("fixed");
    expect(overlay.className).toContain("inset-0");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LoadingOverlay ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("LoadingInline", () => {
  it("renders with spinner", () => {
    render(<LoadingInline />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders optional label", () => {
    render(<LoadingInline label="Loading items..." />);
    expect(screen.getByText("Loading items...")).toBeInTheDocument();
  });

  it("does not render label text when no label provided", () => {
    const { container } = render(<LoadingInline />);
    // Should only have the spinner, no extra span for label
    const spans = container.querySelectorAll("span:not(.sr-only)");
    expect(spans.length).toBe(0);
  });

  it("uses inline-flex layout", () => {
    const { container } = render(<LoadingInline />);
    expect((container.firstChild as HTMLElement).className).toContain("inline-flex");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LoadingInline ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
