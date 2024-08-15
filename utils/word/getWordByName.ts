import { SupabaseClient } from "@supabase/supabase-js";

export async function getWordById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from("word").select().eq("id", id);

  if (error) return { error };
  return { data };
}
