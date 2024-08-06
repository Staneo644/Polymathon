import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { getTheme, getThemes } from "@/utils/theme/getThemes";
import { ThemeRow } from "@/utils/theme/theme";
import { enrichWord } from "@/utils/word/enrichWord";
import { WordRow } from "@/utils/word/word";
import { NextRequest, NextResponse } from "next/server";

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

  const final = enrichWord(res.data, themes.data);
  return NextResponse.json({ data: final });
}

/**
 *
 * @param prends un json contentant {name: string, definition: string, type: string, etymology: string, example: string, theme: number}
 * @returns data ou error en succes ou reussite
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { name, definition, type, etymology, example, theme } =
    await request.json();

  if (!name || !definition || !type || !etymology || !example || !theme) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("word").insert([
    {
      name,
      definition,
      type,
      etymology,
      example,
      theme,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return NextResponse.json(
      { error: "db error: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}

/**
 *
 * @param Prends un json contentant {id: number, validated: boolean}
 * @returns data ou error en succes ou reussite
 */
export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const { id, validated } = await request.json();

  if (!id || validated === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const profile = await getProfile(supabase);

  if (!profile.data || !profile.data.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Mettez à jour le mot dans la base de données
  const { data, error } = await supabase
    .from("word")
    .update({ validated })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "db error: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}
