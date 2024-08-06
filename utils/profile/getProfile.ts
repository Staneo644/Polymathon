import { SupabaseClient } from "@supabase/supabase-js";

export async function getProfile(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("profile").select("*").single();

  if (error) return { error: "db error: " + error.message };
  if (!data) return { error: "No profile found" };

  return { data };
}
