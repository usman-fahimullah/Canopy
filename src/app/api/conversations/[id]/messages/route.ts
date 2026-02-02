import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { createNewMessageNotification } from "@/lib/notifications";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { SendMessageSchema } from "@/lib/validators/api";

// GET — paginated messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_accountId: {
          conversationId,
          accountId: account.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit + 1, // fetch one extra to check if there are more
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1, // skip the cursor itself
          }
        : {}),
      select: {
        id: true,
        content: true,
        senderId: true,
        attachmentUrls: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    // Update lastReadAt for this participant
    await prisma.conversationParticipant.update({
      where: {
        conversationId_accountId: {
          conversationId,
          accountId: account.id,
        },
      },
      data: { lastReadAt: new Date() },
    });

    return NextResponse.json({
      messages: items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    logger.error("Fetch messages error", { error: formatError(error), endpoint: "/api/conversations/[id]/messages" });
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST — send a message
// Body: { content: string, attachmentUrls?: string[] }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 30 messages per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(30, `messages:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: conversationId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_accountId: {
          conversationId,
          accountId: account.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    const body = await request.json();
    const result = SendMessageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { content, attachmentUrls } = result.data;


    // Create message, update conversation, and update sender's lastReadAt in a transaction
    const message = await prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId: account.id,
          content: content?.trim() || "",
          attachmentUrls: attachmentUrls || [],
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          attachmentUrls: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      // Update conversation lastMessageAt
      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: message.createdAt },
      });

      // Update sender's lastReadAt (they've read their own message)
      await tx.conversationParticipant.update({
        where: {
          conversationId_accountId: {
            conversationId,
            accountId: account.id,
          },
        },
        data: { lastReadAt: message.createdAt },
      });

      return message;
    });

    // Notify other participants (kept outside transaction - external side effect)
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId,
        accountId: { not: account.id },
      },
      select: { accountId: true },
    });

    for (const other of otherParticipants) {
      await createNewMessageNotification({
        recipientAccountId: other.accountId,
        senderName: account.name || "Someone",
        messagePreview: content?.trim() || "[Attachment]",
        conversationId,
      }).catch((err) => {
        logger.error("Failed to create message notification", { error: formatError(err), endpoint: "/api/conversations/[id]/messages" });
      });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    logger.error("Send message error", { error: formatError(error), endpoint: "/api/conversations/[id]/messages" });
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
