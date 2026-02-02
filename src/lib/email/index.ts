// Email sending utility for Candid
// Uses Resend as the email provider

import { Resend } from "resend";
import { logger, formatError } from "@/lib/logger";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}

// Default from address - update with your verified domain
const DEFAULT_FROM = process.env.EMAIL_FROM || "Candid <hello@candid.careers>";

// Lazy-init Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(
  payload: EmailPayload
): Promise<{ success: boolean; error?: string }> {
  const emailPayload = {
    ...payload,
    from: payload.from || DEFAULT_FROM,
  };

  const client = getResendClient();

  // Dev mode fallback when Resend is not configured
  if (!client) {
    logger.warn("Resend not configured, email not sent", {
      endpoint: "lib/email",
    });
    return { success: true };
  }

  try {
    const { data, error } = await client.emails.send({
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      html: emailPayload.html,
      text: emailPayload.text,
      replyTo: emailPayload.replyTo,
    });

    if (error) {
      logger.error("Email failed to send", { error: formatError(error), endpoint: "lib/email" });
      return { success: false, error: error.message };
    }

    // Email sent successfully
    return { success: true };
  } catch (error) {
    logger.error("Email error", { error: formatError(error), endpoint: "lib/email" });
    return { success: false, error: "Failed to send email" };
  }
}

// Re-export templates
export * from "./templates";
