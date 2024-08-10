import { getLikes } from "@/utils/like/getLikes";
import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { getTheme, getThemes } from "@/utils/theme/getThemes";
import { getViews } from "@/utils/view/getViews";
import { enrichWord } from "@/utils/word/enrichWord";
import { getWorldByThemeLimited } from "@/utils/word/getWorldByTheme";
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

  const res = await getWorldByThemeLimited(supabase, [], undefined, limit);

  if (res.error || !res.data)
    return NextResponse.json({ error: "db error: " + res.error });

  const likes = await getLikes(supabase, res.data);
  if (likes.error || !likes.data)
    return NextResponse.json({ error: likes.error });

  const views = await getViews(supabase, res.data);
  if (views.error || !views.data)
    return NextResponse.json({ error: views.error });

  const profile = await getProfile(supabase);
  if (profile.error || !profile.data)
    return NextResponse.json({ error: profile.error });

  const final = enrichWord(
    res.data,
    themes.data,
    likes.data,
    profile.data,
    views.data
  );
  return NextResponse.json({ data: final });
}
