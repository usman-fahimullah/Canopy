import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths that require authentication
const PROTECTED_PREFIXES = [
  "/jobs",
  "/candid/coach",
  "/canopy",
  "/onboarding/coach",
  "/onboarding/canopy",
  "/onboarding/jobs",
  "/onboarding/complete",
  "/candid/dashboard",
  "/candid/sessions",
  "/candid/messages",
  "/candid/profile",
  "/candid/settings",
  "/candid/coach-dashboard",
];

// Auth pages — redirect away if already logged in
const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

// Paths that skip onboarding checks (let users through even if onboarding incomplete)
const ONBOARDING_EXEMPT_PREFIXES = ["/onboarding", "/api/", "/design-system", "/demo", "/_next"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT remove auth.getUser()
  // It validates and refreshes the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── 1. Protected route check ──────────────────────────────────
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ── 2. Auth pages for authenticated users ─────────────────────
  // We no longer redirect authenticated users away from /login and /signup in
  // middleware. Reason: after OTP verification or OAuth callback, the user has a
  // Supabase session but hasn't been routed to onboarding yet. Middleware redirect
  // would intercept SegmentedController navigation between /signup ↔ /login and
  // cause the tab toggle to break.
  //
  // Instead, the auth pages' form-submit handlers route to /auth/redirect on
  // success, which decides the correct destination (onboarding or dashboard).
  // Users who are fully onboarded and visit /login directly are harmless —
  // the login form will just log them in again or they can navigate away.

  // ── 3. Shell role authorization ───────────────────────────────
  // Cross-shell authorization (talent/coach/employer) is enforced
  // server-side in each shell's layout.tsx via authorizeShell().
  // This avoids a database call on every middleware invocation.

  return supabaseResponse;
}
