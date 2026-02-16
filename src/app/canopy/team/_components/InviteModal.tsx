"use client";

import { useState, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";
import { formatRoleName, ASSIGNABLE_ROLES } from "../_lib/helpers";
import { DepartmentPicker } from "@/components/departments/DepartmentPicker";
import type { OrgMemberRole } from "@prisma/client";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvitesSent: () => void;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function InviteModal({ open, onOpenChange, onInvitesSent }: InviteModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [role, setRole] = useState<OrgMemberRole>("RECRUITER");
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const addEmail = useCallback(
    (raw: string) => {
      const trimmed = raw.trim().toLowerCase();
      if (!trimmed) return;

      if (!isValidEmail(trimmed)) {
        setError(`"${trimmed}" is not a valid email`);
        return;
      }

      if (emails.includes(trimmed)) {
        setError(`"${trimmed}" is already added`);
        return;
      }

      setEmails((prev) => [...prev, trimmed]);
      setEmailInput("");
      setError(null);
    },
    [emails]
  );

  const removeEmail = useCallback((email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addEmail(emailInput);
      }
      if (e.key === "Backspace" && !emailInput && emails.length > 0) {
        setEmails((prev) => prev.slice(0, -1));
      }
    },
    [emailInput, emails, addEmail]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const parts = pasted.split(/[,;\s]+/).filter(Boolean);
      for (const part of parts) {
        addEmail(part);
      }
    },
    [addEmail]
  );

  const handleSend = useCallback(async () => {
    if (emails.length === 0) {
      setError("Add at least one email address");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/canopy/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invites: emails.map((email) => ({ email, role })),
          departmentId: departmentId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send invites");
        return;
      }

      const data = await res.json();
      toast.success(`${data.count} invite${data.count !== 1 ? "s" : ""} sent`);

      // Reset and close
      setEmails([]);
      setEmailInput("");
      setRole("RECRUITER");
      setDepartmentId(null);
      setError(null);
      onOpenChange(false);
      onInvitesSent();
    } catch (err) {
      logger.error("Failed to send invites", { error: formatError(err) });
      setError("Failed to send invites. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [emails, role, departmentId, onOpenChange, onInvitesSent]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="default">
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-brand-subtle)]">
              <UserPlus size={20} weight="bold" className="text-[var(--foreground-brand)]" />
            </div>
            <div>
              <ModalTitle>Invite team members</ModalTitle>
              <ModalDescription>
                Send invitations to join your organization on Canopy
              </ModalDescription>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Email input area */}
            <div>
              <Label className="mb-1.5">Email addresses</Label>
              {/* One-off: Composite multi-email chip input — raw <input> + <button>
                  share a container with Badge chips. Standard <Input>/<Button>
                  components can't express this layout.
                  TODO: Extract to <ChipInput> if pattern recurs */}
              <div className="rounded-[var(--radius-input)] border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 focus-within:border-[var(--input-border-focus)] focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1.5">
                  {emails.map((email) => (
                    <Badge key={email} variant="neutral" size="sm" className="gap-1">
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="ml-0.5 rounded-full hover:bg-[var(--background-emphasized)]"
                        aria-label={`Remove ${email}`}
                      >
                        <X size={12} weight="bold" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onBlur={() => {
                      if (emailInput.trim()) addEmail(emailInput);
                    }}
                    placeholder={emails.length === 0 ? "Enter email addresses..." : "Add more..."}
                    className="min-w-[180px] flex-1 bg-transparent py-1 text-body-sm text-[var(--foreground-default)] outline-none placeholder:text-[var(--input-foreground-placeholder)]"
                  />
                </div>
              </div>
              <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                Press Enter or comma to add. Paste multiple emails at once.
              </p>
            </div>

            {/* Role + Department row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5">Role</Label>
                <Dropdown value={role} onValueChange={(v) => setRole(v as OrgMemberRole)}>
                  <DropdownTrigger className="w-full">
                    <DropdownValue placeholder="Select role" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {ASSIGNABLE_ROLES.map((r) => (
                      <DropdownItem key={r} value={r}>
                        {formatRoleName(r)}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </div>

              <div>
                <Label className="mb-1.5">Department</Label>
                <DepartmentPicker
                  value={departmentId}
                  onChange={setDepartmentId}
                  placeholder="Select department"
                  noneLabel="No department"
                />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="tertiary" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            loading={isSending}
            disabled={emails.length === 0}
          >
            Send Invite{emails.length > 1 ? "s" : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
