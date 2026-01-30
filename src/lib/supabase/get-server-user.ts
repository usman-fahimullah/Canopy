import { createClient } from "./server";

/**
 * Get user data on the server side.
 * Use this in Server Components only.
 */
export async function getServerUser() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
