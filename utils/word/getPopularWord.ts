import { SupabaseClient } from "@supabase/supabase-js";

export async function getPopularWords(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("WordRow")
    .select(
      `
      id,
      name,
      definition,
      like_count:LikeRow!inner (
        id,
        created_at,
        user_id,
        like
      )
    `
    )
    .eq("LikeRow.like", true)
    .order("like_count", { ascending: false })
    .limit(10);

  if (error) return { error };
  return { data };
}
