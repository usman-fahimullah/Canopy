import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "../modal";
import { Button } from "../button";

function renderModal(props?: {
  hideCloseButton?: boolean;
  headerVariant?: "default" | "feature";
  headerHideClose?: boolean;
}) {
  return render(
    <Modal defaultOpen>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent hideCloseButton={props?.hideCloseButton}>
        <ModalHeader variant={props?.headerVariant} hideCloseButton={props?.headerHideClose}>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>Modal description text</ModalDescription>
        </ModalHeader>
        <ModalBody>Body content here</ModalBody>
        <ModalFooter>
          <Button>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

describe("Modal", () => {
  it("renders when defaultOpen is true", () => {
    renderModal();
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
  });

  it("renders title text", () => {
    renderModal();
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderModal();
    expect(screen.getByText("Modal description text")).toBeInTheDocument();
  });

  it("renders body content", () => {
    renderModal();
    expect(screen.getByText("Body content here")).toBeInTheDocument();
  });

  it("renders footer with action button", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders close button by default", () => {
    renderModal();
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it("closes when close button is clicked", () => {
    renderModal();
    const closeButton = screen.getAllByRole("button", { name: /close/i })[0];
    fireEvent.click(closeButton);
    expect(screen.queryByText("Modal Title")).not.toBeInTheDocument();
  });

  it("opens when trigger is clicked", () => {
    render(
      <Modal>
        <ModalTrigger asChild>
          <Button>Open</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Test</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("has proper dialog role", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
