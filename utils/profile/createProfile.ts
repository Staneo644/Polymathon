import { SupabaseClient } from "@supabase/supabase-js";

export async function createProfile(supabase: SupabaseClient) {
  const user = await supabase.auth.getUser();
  if (!user.data || user.error) return { error: user.error?.message };
  const dbcall = await supabase
    .from("profile")
    .insert({ id: user.data.user.id });
  if (dbcall.error) {
    return { error: dbcall.error.message };
  }
  return { data: dbcall.data };
}
