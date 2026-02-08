import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";

function renderDialog(props?: { hideCloseButton?: boolean }) {
  return render(
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent hideCloseButton={props?.hideCloseButton}>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>Are you sure you want to proceed?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="tertiary">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("renders when defaultOpen is true", () => {
    renderDialog();
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
  });

  it("renders title", () => {
    renderDialog();
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderDialog();
    expect(screen.getByText("Are you sure you want to proceed?")).toBeInTheDocument();
  });

  it("renders footer actions", () => {
    renderDialog();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("has proper dialog role", () => {
    renderDialog();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows close button by default", () => {
    renderDialog();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("hides close button when hideCloseButton is true", () => {
    renderDialog({ hideCloseButton: true });
    expect(screen.queryByText("Close")).not.toBeInTheDocument();
  });

  it("closes when close button is clicked", () => {
    renderDialog();
    // Find the close button (sr-only text "Close")
    const closeContainer = screen.getByText("Close").closest("button");
    expect(closeContainer).toBeInTheDocument();
    fireEvent.click(closeContainer!);
    expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
  });

  it("opens when trigger is clicked", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dynamic</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    expect(screen.queryByText("Dynamic")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Dynamic")).toBeInTheDocument();
  });
});
