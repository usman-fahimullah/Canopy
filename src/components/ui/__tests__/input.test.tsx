import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input, InputMessage, InputWithMessage } from "../input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("applies default variant styles", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("input-background");
    expect(input.className).toContain("input-border");
  });

  it("applies error variant when error prop is true", () => {
    render(<Input error data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("input-border-error");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("applies success variant when success prop is true", () => {
    render(<Input success data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("input-border-success");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId("input")).not.toHaveAttribute("aria-invalid");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies type attribute", () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
  });

  it("renders with left addon", () => {
    render(<Input leftAddon={<span data-testid="left-addon">@</span>} />);
    expect(screen.getByTestId("left-addon")).toBeInTheDocument();
  });

  it("renders with right addon", () => {
    render(<Input rightAddon={<span data-testid="right-addon">!</span>} />);
    expect(screen.getByTestId("right-addon")).toBeInTheDocument();
  });

  it("wraps in container when addons are present", () => {
    const { container } = render(<Input leftAddon={<span>@</span>} data-testid="input" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("flex");
    expect(wrapper.className).toContain("items-center");
  });

  it("sets aria-invalid on input within addon wrapper when error", () => {
    render(<Input leftAddon={<span>@</span>} error data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards ref when addons are present", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} leftAddon={<span>@</span>} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" data-testid="input" />);
    expect(screen.getByTestId("input").className).toContain("custom-input");
  });
});

describe("InputMessage", () => {
  it("renders children text", () => {
    render(<InputMessage>This field is required</InputMessage>);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("has role alert for error status", () => {
    render(<InputMessage status="error">Error!</InputMessage>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("has role status for non-error statuses", () => {
    render(<InputMessage status="info">Hint</InputMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has role status for success", () => {
    render(<InputMessage status="success">Valid</InputMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has role status for warning", () => {
    render(<InputMessage status="warning">Careful</InputMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("defaults to info status", () => {
    render(<InputMessage>Helper text</InputMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies error styling class", () => {
    const { container } = render(<InputMessage status="error">Error</InputMessage>);
    const p = container.querySelector("p");
    expect(p?.className).toContain("foreground-error");
  });

  it("applies success styling class", () => {
    const { container } = render(<InputMessage status="success">OK</InputMessage>);
    const p = container.querySelector("p");
    expect(p?.className).toContain("foreground-success");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<InputMessage ref={ref}>Text</InputMessage>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("InputWithMessage", () => {
  it("renders input and message together", () => {
    render(<InputWithMessage placeholder="Email" message="Enter your email address" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("does not render message when not provided", () => {
    render(<InputWithMessage placeholder="No message" />);
    expect(screen.getByPlaceholderText("No message")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("applies error status when error prop is set", () => {
    render(<InputWithMessage error message="This field is required" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies success status when success prop is set", () => {
    render(<InputWithMessage success message="Looks good!" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("forwards ref to the input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<InputWithMessage ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
