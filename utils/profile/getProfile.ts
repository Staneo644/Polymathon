import { SupabaseClient } from "@supabase/supabase-js";
import { ProfileRow } from "./profile";

export async function getProfile(supabase: SupabaseClient): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: ProfileRow;
      error?: undefined;
    }
> {
  const { data, error } = await supabase.from("profile").select("*").single();

  if (error) return { error: "db error: " + error.message };
  if (!data) return { error: "No profile found" };

  return { data };
}
