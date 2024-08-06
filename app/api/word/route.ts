import { createClient } from "@/utils/supabase/server";
import { getThemes } from "@/utils/theme/getThemes";
import { ThemeRow } from "@/utils/theme/theme";
import { WordRow } from "@/utils/word/word";
import { NextRequest, NextResponse } from "next/server";

function getTheme(theme: number | null, themes: ThemeRow[]): string | null {
  if (!theme) return null;
  const data = themes.filter((t) => t.id === theme);
  if (data.length === 0) return null;
  return data[0].name;
}

async function parseParamsGET(
  themes: ThemeRow[],
  request: NextRequest
): Promise<{ limit?: number; theme?: number; error?: string }> {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const theme = searchParams.get("theme");
  if (!limit) return { error: "Please set a limit" };

  const limitNumber = Number(limit);
  if (Number.isNaN(limitNumber) || limitNumber <= 0)
    return { error: "Limit number should be positive" };

  if (!theme) return { limit: limitNumber };

  const data = themes.filter((t) => t.name === theme);
  if (data.length === 0) return { error: `Theme : '${theme}' not found` };

  return { theme: data[0].id, limit: limitNumber };
}

export interface completeWord {
  id: number;
  name: string;
  definition: string;
  type: string;
  etymology: string;
  example: string | null;
  theme: string | null;
  last_day_word: string;
}

//TODO prendre en compte les vues
/**
 *
 * @param request contient les paramètres de la requête : limit et theme
 * @returns sois data: completeWord[] ou error: string
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const themes = await getThemes(supabase);
  if (themes.error || !themes.data)
    return NextResponse.json({ error: themes.error });

  const { limit, theme, error } = await parseParamsGET(themes.data, request);

  if (error || !limit) return NextResponse.json({ error });

  let req = supabase.from("word").select("*");
  if (theme) req = req.eq("theme", theme);
  req = req.limit(limit);
  const res = await req;

  if (res.error)
    return NextResponse.json({ error: "db error: " + res.error.message });

  const data: WordRow[] = res.data;

  const final: completeWord[] = data.map((word) => {
    return {
      id: word.id,
      name: word.name,
      definition: word.definition,
      type: word.type,
      etymology: word.etymology,
      example: word.example,
      theme: getTheme(word.theme, themes.data),
      last_day_word: word.last_day_word,
    };
  });

  return NextResponse.json({ data: final });
}
