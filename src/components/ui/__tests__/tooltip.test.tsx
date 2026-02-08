import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  SimpleTooltip,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../tooltip";

describe("SimpleTooltip", () => {
  it("renders trigger content", () => {
    render(
      <SimpleTooltip content="Tooltip text">
        <button>Hover me</button>
      </SimpleTooltip>
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });

  it("trigger is accessible", () => {
    render(
      <SimpleTooltip content="Help text">
        <button>Info</button>
      </SimpleTooltip>
    );
    const trigger = screen.getByRole("button", { name: "Info" });
    expect(trigger).toBeInTheDocument();
  });
});

describe("Tooltip compound components", () => {
  it("renders trigger content with compound API", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Trigger</button>
          </TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
  });
});
