import { SupabaseClient } from "@supabase/supabase-js";
import { error } from "console";

export async function createProfile(supabase: SupabaseClient) {
  console.log("Creating profile...");
  const user = await supabase.auth.getUser();
  console.log("get user: ", user);
  if (!user.data || user.error) return { error: user.error?.message };
  const dbcall = await supabase
    .from("profile")
    .insert({ id: user.data.user.id });
  console.log("dbcall: ", dbcall);
  if (dbcall.error) {
    return { error: dbcall.error.message };
  }
  return { data: dbcall.data };
}
