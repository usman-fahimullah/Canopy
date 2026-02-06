"use client";

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Briefcase, CalendarBlank } from "@phosphor-icons/react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleTitle: string;
  onConfirm: () => void;
  isProcessing: boolean;
}

/**
 * Mock Stripe checkout modal for one-time job posting purchase.
 * Shows pricing summary and a "Proceed to Checkout" button.
 * In the future, this will redirect to a real Stripe Checkout session.
 */
export function CheckoutModal({
  open,
  onOpenChange,
  roleTitle,
  onConfirm,
  isProcessing,
}: CheckoutModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-[480px]">
        <ModalHeader>
          <ModalTitle>Publish Your Role</ModalTitle>
          <ModalDescription>
            Review the details below and proceed to publish your job listing.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Role summary */}
          <div className="rounded-[var(--radius-card)] border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-brand-subtle)]">
                <Briefcase size={20} weight="duotone" className="text-[var(--foreground-brand)]" />
              </div>
              <div className="min-w-0">
                <p className="text-body-strong text-[var(--foreground-default)]">{roleTitle}</p>
                <div className="mt-1 flex items-center gap-2">
                  <CalendarBlank size={14} className="text-[var(--foreground-subtle)]" />
                  <span className="text-caption text-[var(--foreground-muted)]">
                    30-day job posting
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body text-[var(--foreground-default)]">Single job posting</span>
              <span className="text-body text-[var(--foreground-default)]">$99.00</span>
            </div>
            <div className="border-t border-[var(--border-muted)]" />
            <div className="flex items-center justify-between">
              <span className="text-body-strong text-[var(--foreground-default)]">Total</span>
              <span className="text-body-strong text-[var(--foreground-default)]">$99.00</span>
            </div>
          </div>

          {/* Features included */}
          <div className="space-y-2">
            <p className="text-caption-strong text-[var(--foreground-muted)]">Includes:</p>
            {[
              "Listed on Green Jobs Board for 30 days",
              "Visible to climate-focused job seekers",
              "AI-powered candidate matching",
              "Full ATS pipeline management",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check
                  size={16}
                  weight="bold"
                  className="shrink-0 text-[var(--foreground-success)]"
                />
                <span className="text-caption text-[var(--foreground-muted)]">{feature}</span>
              </div>
            ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            loading={isProcessing}
            disabled={isProcessing}
          >
            <CreditCard size={16} weight="bold" className="mr-1.5" />
            {isProcessing ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
