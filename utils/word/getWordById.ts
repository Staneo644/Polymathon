import { SupabaseClient } from "@supabase/supabase-js";

export async function getWordById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.rpc("get_word_by_id", {
    id_searched: id,
  });

  if (error) return { error };
  return { data };
}
