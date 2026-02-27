"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Plus, Users } from "@phosphor-icons/react";
import { type Attendee, ROLE_LABELS, ROLE_COLORS } from "@/lib/scheduling";

export interface AddAttendeePopoverProps {
  teamMembers: Attendee[];
  existingAttendeeIds: string[];
  onAdd: (attendee: Attendee) => void;
}

const AddAttendeePopover: React.FC<AddAttendeePopoverProps> = ({
  teamMembers,
  existingAttendeeIds,
  onAdd,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredMembers = teamMembers.filter(
    (member) =>
      !existingAttendeeIds.includes(member.id) &&
      (member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()))
  );

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (member: Attendee) => {
    onAdd(member);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* More prominent Add button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5",
          "text-[13px] font-medium",
          "border border-dashed border-[var(--primitive-neutral-400)]",
          "text-[var(--foreground-muted)]",
          "hover:border-[var(--primitive-green-400)] hover:bg-[var(--primitive-green-50)] hover:text-[var(--primitive-green-700)]",
          "rounded-full transition-all"
        )}
      >
        <Plus size={14} weight="bold" />
        <span>Add interviewer</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1",
            "max-h-80 w-72",
            "border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]",
            "overflow-hidden rounded-lg shadow-lg"
          )}
        >
          <div className="border-b border-[var(--primitive-neutral-200)] p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border-0 bg-[var(--primitive-neutral-100)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)]"
            />
          </div>

          <div className="max-h-56 overflow-auto py-1">
            {filteredMembers.length === 0 ? (
              <div className="py-6 text-center">
                <Users size={24} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
                <p className="text-sm text-[var(--foreground-muted)]">
                  {search ? "No matching team members" : "No more team members to add"}
                </p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleSelect(member)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--background-interactive-hover)]"
                >
                  <Avatar src={member.avatar} name={member.name} size="sm" className="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--foreground-default)]">
                      {member.name}
                    </p>
                    <p className={cn("truncate text-[11px]", ROLE_COLORS[member.role])}>
                      {ROLE_LABELS[member.role]} · {member.email}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

AddAttendeePopover.displayName = "AddAttendeePopover";

export { AddAttendeePopover };
