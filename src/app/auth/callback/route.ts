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

      // Regular OAuth login - redirect to dashboard or specified page
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirect}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirect}`);
      } else {
        return NextResponse.redirect(`${origin}${redirect}`);
      }
    }
  }

  // Return to login page with error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
