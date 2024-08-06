import { SupabaseClient } from "@supabase/supabase-js";
import { ThemeRow } from "./theme";

export function getTheme(
  theme: number | null,
  themes: ThemeRow[]
): string | null {
  if (!theme) return null;
  const data = themes.filter((t) => t.id === theme);
  if (data.length === 0) return null;
  return data[0].name;
}

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
