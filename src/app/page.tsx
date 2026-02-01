import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Root landing page.
 * - Authenticated users → /auth/redirect (routes to dashboard or incomplete onboarding step)
 * - Unauthenticated users → /onboarding (intent selection page)
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/auth/redirect");
  }

  redirect("/onboarding");
}
