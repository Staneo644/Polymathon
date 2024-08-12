import { SupabaseClient } from "@supabase/supabase-js";

export async function getPopularWords(supabase: SupabaseClient) {
  /*
  const { data, error } = await supabase
    .from("word")
    .select(
      `
      id,
      name,
      definition,
      like_count:like!inner (
        id,
        created_at,
        user_id,
        like
      )
    `
    )
    .eq("like.like", true)
    .order("like_count", { ascending: false })
    .limit(10);
*/
  const { data, error } = await supabase
    .from("word")
    .select(
      `
    id,
    name,
    definition,
    like_count:like(id)
  `,
      { count: "exact", head: true }
    )
    .eq("like.like", true)
    .order("like_count", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Top 10 words with most likes:", data);
  }

  if (error) return { error };
  return { data };
}
