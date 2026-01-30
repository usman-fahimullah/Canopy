// Email sending utility for Candid
// Configure your email provider here (Resend, SendGrid, etc.)

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

/**
 * Send an email using the configured provider
 * Currently a stub - connect to Resend, SendGrid, or another provider
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const emailPayload = {
    ...payload,
    from: payload.from || DEFAULT_FROM,
  };

  // Check if email sending is configured
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] Not configured. Would send:", {
      to: emailPayload.to,
      subject: emailPayload.subject,
      from: emailPayload.from,
    });
    return { success: true }; // Return success in dev mode
  }

  try {
    // Resend integration (uncomment when ready)
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // const { data, error } = await resend.emails.send({
    //   from: emailPayload.from,
    //   to: emailPayload.to,
    //   subject: emailPayload.subject,
    //   html: emailPayload.html,
    //   text: emailPayload.text,
    //   reply_to: emailPayload.replyTo,
    // });
    //
    // if (error) {
    //   console.error("[Email] Failed to send:", error);
    //   return { success: false, error: error.message };
    // }
    //
    // console.log("[Email] Sent successfully:", data?.id);
    // return { success: true };

    // Stub for now
    console.log("[Email] Would send to:", emailPayload.to, "Subject:", emailPayload.subject);
    return { success: true };
  } catch (error) {
    console.error("[Email] Error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// Re-export templates
export * from "./templates";
