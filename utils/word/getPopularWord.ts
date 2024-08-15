import { SupabaseClient } from "@supabase/supabase-js";

export async function getPopularWords(supabase: SupabaseClient, limit: number) {
  const select = await supabase.rpc("get_popular_words", {
    limit_count: limit,
  });
  console.log(select);
  if (select.error) return { error: select.error.message };
  return { data: select.data };
}
