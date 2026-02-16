/**
 * Zod schemas for integration API endpoints.
 */

import { z } from "zod";
import { INTEGRATION_PROVIDERS } from "@/lib/integrations/types";

export const CreateConnectSessionSchema = z.object({
  provider: z.enum(INTEGRATION_PROVIDERS),
});

export const NangoWebhookPayloadSchema = z.object({
  type: z.string(),
  connectionId: z.string(),
  providerConfigKey: z.string(),
  authMode: z.string().optional(),
  error: z
    .object({
      type: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

export const SyncConnectionSchema = z.object({
  provider: z.enum(INTEGRATION_PROVIDERS),
});

export const SlackConfigSchema = z.object({
  channelId: z.string().min(1),
});

export const CalendarAvailabilitySchema = z.object({
  memberId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
});
