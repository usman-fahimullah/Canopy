/**
 * OTP (One-Time Password) utility functions for email verification
 */

/**
 * Validates that a string is a valid 6-digit OTP code
 */
export function isValidOtpFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Extracts digits from a pasted string (handles formats like "123 456" or "123-456")
 */
export function extractOtpFromPaste(pastedText: string): string | null {
  // Remove all non-digit characters
  const digits = pastedText.replace(/\D/g, "");

  // Must be exactly 6 digits
  if (digits.length === 6) {
    return digits;
  }

  return null;
}

/**
 * Calculates remaining cooldown seconds for resend button
 * @param lastResendTime - Timestamp of last resend (ms)
 * @param cooldownSeconds - Total cooldown duration (default 60s)
 * @returns Remaining seconds, or 0 if cooldown expired
 */
export function getResendCooldownRemaining(
  lastResendTime: number | null,
  cooldownSeconds: number = 60
): number {
  if (!lastResendTime) return 0;

  const elapsed = Math.floor((Date.now() - lastResendTime) / 1000);
  const remaining = cooldownSeconds - elapsed;

  return Math.max(0, remaining);
}

/**
 * Checks if resend is currently allowed
 * @param lastResendTime - Timestamp of last resend (ms)
 * @param resendCount - Number of resends attempted
 * @param maxResends - Maximum allowed resends (default 5)
 * @param cooldownSeconds - Cooldown between resends (default 60s)
 */
export function canResendOtp(
  lastResendTime: number | null,
  resendCount: number,
  maxResends: number = 5,
  cooldownSeconds: number = 60
): boolean {
  // Check max resends
  if (resendCount >= maxResends) {
    return false;
  }

  // Check cooldown
  const remaining = getResendCooldownRemaining(lastResendTime, cooldownSeconds);
  return remaining === 0;
}

/**
 * Maps Supabase OTP error codes to user-friendly messages
 */
export function getOtpErrorMessage(errorMessage: string): string {
  const lowerMessage = errorMessage.toLowerCase();

  if (lowerMessage.includes("otp_expired") || lowerMessage.includes("expired")) {
    return "Code expired. Please request a new one.";
  }

  if (lowerMessage.includes("invalid") || lowerMessage.includes("incorrect")) {
    return "Invalid code. Please check and try again.";
  }

  if (lowerMessage.includes("rate") || lowerMessage.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
    return "Connection error. Please check your internet and try again.";
  }

  // Fallback for unknown errors
  return "Verification failed. Please try again.";
}

/**
 * Formats seconds into mm:ss display format
 */
export function formatCooldownTime(seconds: number): string {
  if (seconds <= 0) return "";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return `${secs}s`;
}
