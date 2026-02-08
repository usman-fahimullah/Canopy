import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  EmptyState,
  EmptyStateNoCandidates,
  EmptyStateNoJobs,
  EmptyStateNoResults,
  EmptyStateNoActivity,
  EmptyStateError,
} from "../empty-state";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<EmptyState title="Empty" description="Nothing to show here" />);
    expect(screen.getByText("Nothing to show here")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<EmptyState title="Empty" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("renders primary action button", () => {
    const onClick = vi.fn();
    render(<EmptyState title="No items" action={{ label: "Create Item", onClick }} />);
    const button = screen.getByRole("button", { name: /Create Item/ });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders secondary action button", () => {
    const onClick = vi.fn();
    render(<EmptyState title="No items" secondaryAction={{ label: "Learn More", onClick }} />);
    const button = screen.getByRole("button", { name: "Learn More" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders custom icon", () => {
    render(<EmptyState title="Custom" icon={<span data-testid="custom-icon">Icon</span>} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders children in action area", () => {
    render(
      <EmptyState title="With Children">
        <button>Custom Action</button>
      </EmptyState>
    );
    expect(screen.getByRole("button", { name: "Custom Action" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<EmptyState ref={ref} title="Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyState title="Custom" className="extra" />);
    expect((container.firstChild as HTMLElement).className).toContain("extra");
  });
});

describe("Preset EmptyStates", () => {
  it("EmptyStateNoCandidates renders correct title", () => {
    render(<EmptyStateNoCandidates />);
    expect(screen.getByText("No candidates yet")).toBeInTheDocument();
  });

  it("EmptyStateNoJobs renders correct title and action", () => {
    render(<EmptyStateNoJobs />);
    expect(screen.getByText("No jobs posted")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Job/ })).toBeInTheDocument();
  });

  it("EmptyStateNoResults renders correct title", () => {
    render(<EmptyStateNoResults />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("EmptyStateNoActivity renders correct title", () => {
    render(<EmptyStateNoActivity />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });

  it("EmptyStateError renders correct title", () => {
    render(<EmptyStateError />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("presets accept overrides", () => {
    render(<EmptyStateNoResults title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });
});
