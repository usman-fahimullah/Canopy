// Email sending utility for Candid
// Uses Resend as the email provider

import { Resend } from "resend";

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
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const emailPayload = {
    ...payload,
    from: payload.from || DEFAULT_FROM,
  };

  const client = getResendClient();

  // Dev mode fallback when Resend is not configured
  if (!client) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Email] Resend not configured. Would send:", {
        to: emailPayload.to,
        subject: emailPayload.subject,
        from: emailPayload.from,
      });
    }
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
      console.error("[Email] Failed to send:", error);
      return { success: false, error: error.message };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Email] Sent successfully:", data?.id);
    }
    return { success: true };
  } catch (error) {
    console.error("[Email] Error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// Re-export templates
export * from "./templates";
