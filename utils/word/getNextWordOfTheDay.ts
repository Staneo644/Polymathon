import { SupabaseClient } from "@supabase/supabase-js";

export async function getNextWordOfTheDay(
  supabase: SupabaseClient,
  limit: number
) {
  const { data, error } = await supabase
    .from("word")
    .select("*")
    .eq("validated", true);
  //.order("last_day_word", { ascending: true })
  //.limit(limit);

  if (error || !data) return { error };

  const sortedData = data.sort(
    (a, b) =>
      new Date(a.last_day_word).getTime() - new Date(b.last_day_word).getTime()
  );
  const limitedData = sortedData.slice(0, limit);

  return { data: limitedData };
}
