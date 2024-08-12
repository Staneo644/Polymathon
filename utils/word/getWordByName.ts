import { SupabaseClient } from "@supabase/supabase-js";

export async function getWordByName(supabase: SupabaseClient, name: string) {
  console.log(name);
  const { data, error } = await supabase
    .from("word")
    .select("*")
    .eq("name", name);

  if (error) return { error };
  return { data };
}
