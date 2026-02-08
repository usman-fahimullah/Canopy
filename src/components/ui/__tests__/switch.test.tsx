import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch, SwitchWithLabel, SwitchGroup } from "../switch";

describe("Switch", () => {
  it("renders a switch", () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onCheckedChange when toggled", () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} aria-label="Toggle" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Switch disabled aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("is disabled when loading", () => {
    render(<Switch loading aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("applies error class when error is true", () => {
    render(<Switch error aria-label="Toggle" />);
    expect(screen.getByRole("switch").className).toContain("red");
  });

  it("applies default size class", () => {
    render(<Switch aria-label="Toggle" />);
    const sw = screen.getByRole("switch");
    expect(sw.className).toContain("h-6");
    expect(sw.className).toContain("w-12");
  });

  it("applies small size", () => {
    render(<Switch size="sm" aria-label="Toggle" />);
    const sw = screen.getByRole("switch");
    expect(sw.className).toContain("w-9");
  });

  it("applies custom className", () => {
    render(<Switch className="custom-switch" aria-label="Toggle" />);
    expect(screen.getByRole("switch").className).toContain("custom-switch");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Switch ref={ref} aria-label="Toggle" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("SwitchWithLabel", () => {
  it("renders switch with label", () => {
    render(<SwitchWithLabel label="Email notifications" />);
    expect(screen.getByText("Email notifications")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("clicking label toggles switch", () => {
    const onCheckedChange = vi.fn();
    render(<SwitchWithLabel label="Toggle me" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText("Toggle me"));
    expect(onCheckedChange).toHaveBeenCalledOnce();
  });

  it("renders helper text", () => {
    render(<SwitchWithLabel label="Notifications" helperText="Receive email updates" />);
    expect(screen.getByText("Receive email updates")).toBeInTheDocument();
  });

  it("renders error message when error is set", () => {
    render(<SwitchWithLabel label="Required" error errorMessage="Must enable" />);
    expect(screen.getByText("Must enable")).toBeInTheDocument();
  });

  it("hides helper text when error message is displayed", () => {
    render(<SwitchWithLabel label="Toggle" helperText="Info" error errorMessage="Error text" />);
    expect(screen.queryByText("Info")).not.toBeInTheDocument();
    expect(screen.getByText("Error text")).toBeInTheDocument();
  });

  it("shows required indicator", () => {
    render(<SwitchWithLabel label="Required" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<SwitchWithLabel label="Disabled" disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });
});

describe("SwitchGroup", () => {
  it("renders with group role", () => {
    render(
      <SwitchGroup label="Settings">
        <SwitchWithLabel label="A" />
        <SwitchWithLabel label="B" />
      </SwitchGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders group label", () => {
    render(
      <SwitchGroup label="Notifications">
        <SwitchWithLabel label="Email" />
      </SwitchGroup>
    );
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(
      <SwitchGroup label="Settings" helperText="Manage your preferences">
        <SwitchWithLabel label="A" />
      </SwitchGroup>
    );
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
  });

  it("renders all children", () => {
    render(
      <SwitchGroup>
        <SwitchWithLabel label="A" />
        <SwitchWithLabel label="B" />
        <SwitchWithLabel label="C" />
      </SwitchGroup>
    );
    expect(screen.getAllByRole("switch")).toHaveLength(3);
  });
});
