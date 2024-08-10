import { SupabaseClient } from "@supabase/supabase-js";
import { getUserId } from "../profile/getProfile";

export async function getUserViewNumber(supabase: SupabaseClient): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: number | null;
      error?: undefined;
    }
> {
  const { error, count } = await supabase
    .from("views")
    .select("*", { count: "exact", head: true })
    .eq("user_id", await getUserId(supabase));

  if (error) {
    return { error: "db error getting views: " + error.message };
  }
  return { data: count };
}
