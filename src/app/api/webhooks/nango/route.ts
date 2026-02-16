import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { parseNangoConnectionId } from "@/lib/integrations/types";

/**
 * POST /api/webhooks/nango
 *
 * Receives webhook events from Nango when connections change.
 * Updates our local IntegrationConnection records to keep status in sync.
 *
 * Events handled:
 * - auth.new / auth.refresh_error — connection created or token error
 * - connection.created — new connection established
 * - connection.deleted — connection removed
 */
export async function POST(request: Request) {
  try {
    // Parse body first — both paths need it
    let body: NangoWebhookEvent;
    try {
      body = await request.json();
    } catch {
      logger.warn("Nango webhook: invalid JSON body");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Verify webhook secret via constant-time comparison
    const webhookSecret = process.env.NANGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const incomingSecret =
        request.headers.get("x-webhook-secret") || request.headers.get("x-nango-signature");

      if (!incomingSecret) {
        logger.warn("Nango webhook rejected: missing signature header");
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }

      // Constant-time comparison to prevent timing attacks
      const encoder = new TextEncoder();
      const a = encoder.encode(incomingSecret);
      const b = encoder.encode(webhookSecret);

      let diff = a.byteLength ^ b.byteLength;
      for (let i = 0; i < Math.max(a.byteLength, b.byteLength); i++) {
        diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
      }

      if (diff !== 0) {
        logger.warn("Nango webhook signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    await handleWebhookEvent(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Nango webhook processing error", {
      error: formatError(error),
      endpoint: "POST /api/webhooks/nango",
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

interface NangoWebhookEvent {
  type?: string;
  from?: { connectionId?: string; providerConfigKey?: string };
  connectionId?: string;
  providerConfigKey?: string;
  provider?: string;
  authMode?: string;
  operation?: string;
  success?: boolean;
  error?: { type?: string; message?: string };
}

async function handleWebhookEvent(event: NangoWebhookEvent) {
  const connectionId = event.connectionId || event.from?.connectionId;
  const providerConfigKey =
    event.providerConfigKey || event.from?.providerConfigKey || event.provider;
  const eventType = event.type || event.operation;

  if (!connectionId || !providerConfigKey) {
    logger.error("Nango webhook DROPPED: missing connectionId or providerConfigKey", {
      event: JSON.stringify(event).slice(0, 500),
      connectionId: connectionId ?? "MISSING",
      providerConfigKey: providerConfigKey ?? "MISSING",
    });
    return;
  }

  logger.info("Processing Nango webhook", {
    type: eventType,
    connectionId,
    providerConfigKey,
  });

  // Parse the connection ID to find the organization
  const parsed = parseNangoConnectionId(connectionId);
  if (!parsed) {
    logger.error("Nango webhook DROPPED: unrecognized connectionId format", {
      connectionId,
      providerConfigKey,
      eventType,
    });
    return;
  }

  // Resolve the organization ID
  let organizationId: string | null = null;

  if (parsed.scope === "organization") {
    organizationId = parsed.entityId;
  } else if (parsed.scope === "member") {
    // For member-scoped connections, look up the org from the member
    const member = await prisma.organizationMember.findUnique({
      where: { id: parsed.entityId },
      select: { organizationId: true },
    });
    organizationId = member?.organizationId ?? null;

    if (!member) {
      logger.error("Nango webhook DROPPED: member not found in database", {
        connectionId,
        memberId: parsed.entityId,
        providerConfigKey,
        eventType,
      });
    }
  }

  if (!organizationId) {
    logger.error("Nango webhook DROPPED: could not resolve organizationId", {
      connectionId,
      scope: parsed.scope,
      entityId: parsed.entityId,
      providerConfigKey,
      eventType,
    });
    return;
  }

  // Handle event types
  if (
    eventType === "auth.new" ||
    eventType === "connection.created" ||
    (event.success === true && eventType === "auth")
  ) {
    await prisma.integrationConnection.upsert({
      where: {
        organizationId_provider_nangoConnectionId: {
          organizationId,
          provider: providerConfigKey,
          nangoConnectionId: connectionId,
        },
      },
      update: {
        status: "active",
        errorMessage: null,
        updatedAt: new Date(),
      },
      create: {
        organizationId,
        provider: providerConfigKey,
        nangoConnectionId: connectionId,
        scope: parsed.scope,
        status: "active",
        connectedByMemberId: parsed.scope === "member" ? parsed.entityId : null,
      },
    });

    logger.info("Integration connection activated", {
      organizationId,
      provider: providerConfigKey,
      connectionId,
    });
  } else if (eventType === "connection.deleted") {
    await prisma.integrationConnection.updateMany({
      where: {
        organizationId,
        provider: providerConfigKey,
        nangoConnectionId: connectionId,
      },
      data: { status: "disconnected" },
    });

    logger.info("Integration connection disconnected via webhook", {
      organizationId,
      provider: providerConfigKey,
    });
  } else if (eventType === "auth.refresh_error" || (event.success === false && event.error)) {
    await prisma.integrationConnection.updateMany({
      where: {
        organizationId,
        provider: providerConfigKey,
        nangoConnectionId: connectionId,
      },
      data: {
        status: "error",
        errorMessage: event.error?.message || "Token refresh failed",
      },
    });

    logger.warn("Integration connection error", {
      organizationId,
      provider: providerConfigKey,
      error: event.error?.message,
    });
  }
}
