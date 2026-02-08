import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox, CheckboxWithLabel, CheckboxGroup } from "../checkbox";

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Checkbox aria-label="Test" />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("can be checked via prop", () => {
    render(<Checkbox checked aria-label="Test" />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onCheckedChange when clicked", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} aria-label="Test" />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Checkbox disabled aria-label="Test" />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("applies error styling class", () => {
    render(<Checkbox error aria-label="Test" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.className).toContain("checkbox-border-error");
  });

  it("applies default size class", () => {
    render(<Checkbox aria-label="Test" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.className).toContain("h-5");
    expect(checkbox.className).toContain("w-5");
  });

  it("applies small size", () => {
    render(<Checkbox size="sm" aria-label="Test" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.className).toContain("h-4");
    expect(checkbox.className).toContain("w-4");
  });

  it("applies large size", () => {
    render(<Checkbox size="lg" aria-label="Test" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.className).toContain("h-6");
    expect(checkbox.className).toContain("w-6");
  });

  it("applies custom className", () => {
    render(<Checkbox className="custom-check" aria-label="Test" />);
    expect(screen.getByRole("checkbox").className).toContain("custom-check");
  });
});

describe("CheckboxWithLabel", () => {
  it("renders checkbox with label text", () => {
    render(<CheckboxWithLabel label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("clicking label toggles checkbox", () => {
    const onCheckedChange = vi.fn();
    render(<CheckboxWithLabel label="Click me" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText("Click me"));
    expect(onCheckedChange).toHaveBeenCalledOnce();
  });

  it("renders helper text", () => {
    render(<CheckboxWithLabel label="Option" helperText="Extra info" />);
    expect(screen.getByText("Extra info")).toBeInTheDocument();
  });

  it("renders error message when error is true", () => {
    render(<CheckboxWithLabel label="Option" error errorMessage="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("hides helper text when error message is shown", () => {
    render(<CheckboxWithLabel label="Option" helperText="Helper" error errorMessage="Error" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("shows required indicator", () => {
    render(<CheckboxWithLabel label="Name" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<CheckboxWithLabel label="Disabled" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});

describe("CheckboxGroup", () => {
  it("renders with group role", () => {
    render(
      <CheckboxGroup label="Preferences">
        <CheckboxWithLabel label="Option A" />
        <CheckboxWithLabel label="Option B" />
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders group label", () => {
    render(
      <CheckboxGroup label="Preferences">
        <CheckboxWithLabel label="Option A" />
      </CheckboxGroup>
    );
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(
      <CheckboxGroup label="Prefs" helperText="Select all that apply">
        <CheckboxWithLabel label="A" />
      </CheckboxGroup>
    );
    expect(screen.getByText("Select all that apply")).toBeInTheDocument();
  });

  it("renders error message when error is true", () => {
    render(
      <CheckboxGroup label="Prefs" error errorMessage="Select at least one">
        <CheckboxWithLabel label="A" />
      </CheckboxGroup>
    );
    expect(screen.getByText("Select at least one")).toBeInTheDocument();
  });

  it("shows required indicator on group label", () => {
    render(
      <CheckboxGroup label="Required Group" required>
        <CheckboxWithLabel label="A" />
      </CheckboxGroup>
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders all children", () => {
    render(
      <CheckboxGroup>
        <CheckboxWithLabel label="A" />
        <CheckboxWithLabel label="B" />
        <CheckboxWithLabel label="C" />
      </CheckboxGroup>
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
