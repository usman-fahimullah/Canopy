import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/auth/redirect";
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Handle password recovery redirect
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // Build the redirect URL, forwarding the intent (type) if present.
      // For OAuth signups with ?intent=employer, the signup page passes
      // type=employer through the callback URL. We forward it to /auth/redirect
      // so the account creation logic can pick it up.
      let redirectUrl = redirect;
      if (type && type !== "recovery") {
        const separator = redirect.includes("?") ? "&" : "?";
        redirectUrl = `${redirect}${separator}intent=${encodeURIComponent(type)}`;
      }

      // Regular OAuth login - redirect to dashboard or specified page
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const host = isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin;

      return NextResponse.redirect(`${host}${redirectUrl}`);
    }
  }

  // Return to login page with error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
