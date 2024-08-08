import { SupabaseClient } from "@supabase/supabase-js";
import { ThemeRow } from "../theme/theme";
import { WordRow } from "./word";

function getAllowedThemes(themes: ThemeRow[], theme_id: number) {
  const myTheme = themes.find((theme) => theme.id === theme_id);
  if (myTheme && myTheme.parent !== null) {
    return [theme_id];
  } else {
    return themes
      .filter((theme) => theme.parent === theme_id || theme.id === theme_id)
      .map((theme) => theme.id);
  }
}

export async function getWorldByThemeLimited(
  supabase: SupabaseClient,
  themes: ThemeRow[],
  theme_id: number | undefined,
  limit: number
): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: WordRow[];
      error?: undefined;
    }
> {
  let req = supabase.from("word").select("*");
  if (theme_id) {
    const allowedThemes = getAllowedThemes(themes, theme_id);
    req = req.in("theme", allowedThemes);
  }

  req.order("random()");
  req.limit(limit);
  req.eq("validated", true);
  const res = await req;

  if (res.error) {
    return { error: "db error: " + res.error.message };
  }
  return { data: res.data };
}
