import { SupabaseClient } from "@supabase/supabase-js";

export async function getWordOfTheDay(supabase: SupabaseClient) {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from("word")
    .select("*")
    .eq("last_day_word", today)
    .eq("validated", true);

  if (error) return { error };
  return { data };
}
