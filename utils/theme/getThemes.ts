import { SupabaseClient } from "@supabase/supabase-js";
import { ThemeRow } from "./theme";

export async function getThemes(supabase: SupabaseClient): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: ThemeRow[];
      error?: undefined;
    }
> {
  const { data, error } = await supabase.from("theme").select("*");
  if (error) return { error: error.message };
  return { data };
}
