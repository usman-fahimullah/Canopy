import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "../dropdown";

describe("Dropdown", () => {
  it("renders trigger with placeholder", () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <DropdownValue placeholder="Select option" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">Option A</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  it("applies error styling to trigger", () => {
    render(
      <Dropdown>
        <DropdownTrigger error>
          <DropdownValue placeholder="Select" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">A</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("select-border-error");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid without error", () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <DropdownValue placeholder="Select" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">A</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-invalid");
  });

  it("applies success styling to trigger", () => {
    render(
      <Dropdown>
        <DropdownTrigger success>
          <DropdownValue placeholder="Select" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">A</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("select-border-success");
  });

  it("is disabled when disabled prop is set", () => {
    render(
      <Dropdown>
        <DropdownTrigger disabled>
          <DropdownValue placeholder="Select" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">A</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("applies custom className to trigger", () => {
    render(
      <Dropdown>
        <DropdownTrigger className="my-trigger">
          <DropdownValue placeholder="Select" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">A</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    expect(screen.getByRole("combobox").className).toContain("my-trigger");
  });

  it("displays selected value", () => {
    render(
      <Dropdown defaultValue="a">
        <DropdownTrigger>
          <DropdownValue placeholder="Select" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">Option Alpha</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
    expect(screen.getByText("Option Alpha")).toBeInTheDocument();
  });
});
