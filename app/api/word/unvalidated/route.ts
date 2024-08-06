import { createClient } from "@/utils/supabase/server";
import { getTheme, getThemes } from "@/utils/theme/getThemes";
import { WordRow } from "@/utils/word/word";
import { NextRequest, NextResponse } from "next/server";

async function parseParamsGET(
  request: NextRequest
): Promise<{ limit?: number; error?: string }> {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  if (!limit) return { error: "Please set a limit" };

  const limitNumber = Number(limit);
  if (Number.isNaN(limitNumber) || limitNumber <= 0)
    return { error: "Limit number should be positive" };

  return { limit: limitNumber };
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

  const { limit, error } = await parseParamsGET(request);

  if (error || !limit) return NextResponse.json({ error });

  const res = await supabase
    .from("word")
    .select("*")
    .eq("validated", false)
    .limit(limit);

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
