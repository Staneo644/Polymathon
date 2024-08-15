import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { getThemes } from "@/utils/theme/getThemes";
import { ThemeRow } from "@/utils/theme/theme";
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

  const res = await supabase.rpc("get_word_by_theme", {
    limit_count: limit,
    theme_id: theme,
  });
  if (res.error || !res.data)
    return NextResponse.json({
      error: "db error getting world by theme: " + res.error?.message,
    });

  return NextResponse.json({ data: res.data });
}

/**
 * Proposer un mot
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
 * Valider ou invalider un mot en tant qu'admin
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
