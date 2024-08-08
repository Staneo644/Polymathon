import { SupabaseClient } from "@supabase/supabase-js";
import { ProfileRow } from "./profile";

export async function getUserId(
  supabase: SupabaseClient
): Promise<string | undefined> {
  const user = await supabase.auth.getUser();
  console.log("getUser(): ", user);
  console.log(user.data.user);
  return user.data.user?.id;
}

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
  const user_id = await getUserId(supabase);
  const { data, error } = await supabase.from("profile").select("*").single();

  if (error) return { error: "getProfile db error: " + error.message };
  if (!data) return { error: "No profile found" };

  return { data };
}
