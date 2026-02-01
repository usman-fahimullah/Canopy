"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChatCircle } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import type { MessageItem } from "@/hooks/use-messages";
import { MessageBubbles } from "./message-bubbles";
import { MessageComposer } from "./message-composer";

export interface ChatPanelProps {
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
  messages: MessageItem[];
  messagesLoading: boolean;
  sending: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onSendMessage: (content: string) => void;
  onLoadMore: () => void;
  onBack: () => void;
  currentAccountId: string | null;
}

export function ChatPanel({
  otherUser,
  messages,
  messagesLoading,
  sending,
  hasMore,
  loadingMore,
  onSendMessage,
  onLoadMore,
  onBack,
  currentAccountId,
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!newMessage.trim() || sending) return;
    const content = newMessage;
    setNewMessage("");
    onSendMessage(content);
  }, [newMessage, sending, onSendMessage]);

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="border-b border-[var(--primitive-neutral-200)] bg-white px-6 py-[30px]">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          <button
            type="button"
            onClick={onBack}
            className="lg:hidden shrink-0 p-1 -ml-1"
            aria-label="Back to conversations"
          >
            <ArrowLeft
              size={24}
              className="text-[var(--primitive-green-800)]"
            />
          </button>
          <h2 className="text-4xl font-medium leading-[48px] text-[var(--primitive-green-800)]">
            {otherUser.name}
          </h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative flex-1 overflow-y-auto bg-[var(--primitive-neutral-100)]">
        <div className="px-6 py-4 space-y-0">
          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pb-4">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="text-sm text-[var(--primitive-blue-500)] hover:underline disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load earlier messages"}
              </button>
            </div>
          )}

          {messagesLoading ? (
            <div className="flex items-center justify-center h-full py-20">
              <Spinner size="lg" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-20">
              <p className="text-lg text-[var(--primitive-neutral-500)]">
                No messages yet. Say hello!
              </p>
            </div>
          ) : (
            <MessageBubbles
              messages={messages}
              currentAccountId={currentAccountId}
              otherUser={otherUser}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Composer */}
      <div className="border-t border-[var(--primitive-neutral-200)] bg-white px-12 py-6">
        <MessageComposer
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSend}
          sending={sending}
        />
      </div>
    </div>
  );
}
