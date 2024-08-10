import { SupabaseClient } from "@supabase/supabase-js";

export async function getValidatedWords(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("word")
    .select("*")
    .eq("validated", true);

  if (error) return { error };
  return { data };
}
