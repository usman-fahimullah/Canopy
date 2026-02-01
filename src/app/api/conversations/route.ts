import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { readLimiter, standardLimiter } from "@/lib/rate-limit";

// GET — list conversations for current user with last message, unread count, other participant
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await readLimiter.check(30, `conversations-get:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

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

    // Find all conversations this user participates in
    const participantRecords = await prisma.conversationParticipant.findMany({
      where: { accountId: account.id },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                account: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    coachProfile: {
                      select: {
                        headline: true,
                      },
                    },
                    seekerProfile: {
                      select: {
                        headline: true,
                      },
                    },
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                id: true,
                content: true,
                senderId: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        conversation: { lastMessageAt: "desc" },
      },
    });

    // Build response with unread counts and other user info
    const conversations = participantRecords.map((pr) => {
      const conv = pr.conversation;
      const otherParticipant = conv.participants.find(
        (p) => p.accountId !== account.id
      );
      const otherAccount = otherParticipant?.account;
      const lastMessage = conv.messages[0] || null;

      // Count unread: messages after this user's lastReadAt
      // We'll compute this with a separate count for efficiency
      // For now, we'll use lastReadAt comparison with lastMessageAt
      const hasUnread =
        lastMessage &&
        pr.lastReadAt &&
        new Date(lastMessage.createdAt) > new Date(pr.lastReadAt);
      const isUnreadNoRead = lastMessage && !pr.lastReadAt;

      return {
        id: conv.id,
        lastMessageAt: conv.lastMessageAt,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              createdAt: lastMessage.createdAt,
            }
          : null,
        unreadCount: hasUnread || isUnreadNoRead ? 1 : 0, // simplified; real count below
        otherUser: otherAccount
          ? {
              id: otherAccount.id,
              name: otherAccount.name || "Unknown",
              avatar: otherAccount.avatar,
              role: otherAccount.coachProfile ? "COACH" : "SEEKER",
              headline: otherAccount.coachProfile?.headline || otherAccount.seekerProfile?.headline || null,
            }
          : null,
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST — create or get existing conversation
// Body: { recipientAccountId: string, initialMessage?: string }
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await standardLimiter.check(10, `conversations-post:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

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

    const body = await request.json();
    const { recipientAccountId, initialMessage } = body;

    if (!recipientAccountId) {
      return NextResponse.json(
        { error: "recipientAccountId is required" },
        { status: 400 }
      );
    }

    if (recipientAccountId === account.id) {
      return NextResponse.json(
        { error: "Cannot create conversation with yourself" },
        { status: 400 }
      );
    }

    // Check recipient exists
    const recipient = await prisma.account.findUnique({
      where: { id: recipientAccountId },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Check if conversation already exists between these two users
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { accountId: account.id } } },
          { participants: { some: { accountId: recipientAccountId } } },
        ],
      },
    });

    if (existing) {
      // If initial message provided, add it to existing conversation
      if (initialMessage?.trim()) {
        const message = await prisma.message.create({
          data: {
            conversationId: existing.id,
            senderId: account.id,
            content: initialMessage.trim(),
          },
        });

        await prisma.conversation.update({
          where: { id: existing.id },
          data: { lastMessageAt: message.createdAt },
        });
      }

      return NextResponse.json({ conversation: existing, created: false });
    }

    // Create new conversation with participants
    const conversation = await prisma.conversation.create({
      data: {
        lastMessageAt: initialMessage?.trim() ? new Date() : null,
        participants: {
          create: [
            { accountId: account.id },
            { accountId: recipientAccountId },
          ],
        },
        ...(initialMessage?.trim()
          ? {
              messages: {
                create: {
                  senderId: account.id,
                  content: initialMessage.trim(),
                },
              },
            }
          : {}),
      },
      include: {
        participants: {
          include: {
            account: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ conversation, created: true }, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
