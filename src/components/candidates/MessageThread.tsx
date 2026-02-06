"use client";

import * as React from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { PaperPlaneTilt, X, ArrowsOut } from "@phosphor-icons/react";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  content: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isSent: boolean;
}

interface MessageThreadProps {
  candidateName: string;
  messages: Message[];
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSend: (content: string) => void;
}

export function MessageThread({
  candidateName,
  messages,
  isLoading = false,
  isOpen,
  onClose,
  onSend,
}: MessageThreadProps) {
  const [draft, setDraft] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="flex h-[600px] max-w-lg flex-col">
        {/* Header */}
        <ModalHeader className="flex items-center justify-between border-b border-[var(--border-muted)]">
          <div className="flex items-center gap-3">
            <PaperPlaneTilt size={18} className="text-[var(--foreground-muted)]" />
            <ModalTitle>{candidateName}</ModalTitle>
            <Badge variant="neutral" size="sm">
              Demo mode
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Expand">
              <ArrowsOut size={16} />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
              <X size={16} />
            </Button>
          </div>
        </ModalHeader>

        {/* Messages */}
        <ModalBody className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-body-sm text-[var(--foreground-muted)]">
                No messages yet. Start the conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  senderName={msg.senderName}
                  senderAvatar={msg.senderAvatar}
                  timestamp={msg.timestamp}
                  isSent={msg.isSent}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ModalBody>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-[var(--border-muted)] p-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message"
            className="flex-1 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] px-4 py-2 text-body-sm text-[var(--input-foreground)] outline-none transition-colors placeholder:text-[var(--input-foreground-placeholder)] focus:border-[var(--input-border-focus)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
          />
          <Button
            variant="primary"
            size="icon"
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <PaperPlaneTilt size={18} weight="fill" />
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
