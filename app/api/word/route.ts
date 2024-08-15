import { getProfile, getUserId } from "@/utils/profile/getProfile";
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

  const { data, error } = await supabase
    .from("word")
    .insert([
      {
        name,
        definition,
        type,
        etymology,
        example,
        theme,
      },
    ])
    .select("id")
    .single();

  const user_id = await getUserId(supabase);

  if (error || !data || !data.id || !user_id) {
    return NextResponse.json(
      { error: "db error: " + error?.message },
      { status: 500 }
    );
  }

  const { error: errorContribution } = await supabase
    .from("contribution")
    .insert([{ word: data.id, type: "create", user_id: user_id }]);

  if (errorContribution)
    return NextResponse.json(
      {
        error: "error contribution:" + errorContribution.message,
      },
      { status: 500 }
    );
  return NextResponse.json({ data: data.id }, { status: 201 });
}

/**
 * Modifier une proposition de mot
 * @param prends un json contentant {name: string, definition: string, type: string, etymology: string, example: string, theme: number}
 * @returns data ou error en succes ou reussite
 */
export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const { id, name, definition, type, etymology, example, theme } =
    await request.json();

  const profile = await getProfile(supabase);
  if (profile.error || !profile.data)
    return NextResponse.json({ error: profile.error });

  if (profile.data.admin === false)
    return NextResponse.json(
      { error: "You are not an admin" },
      { status: 403 }
    );

  if (
    !id ||
    !name ||
    !definition ||
    !type ||
    !etymology ||
    !example ||
    !theme
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("word")
    .update([
      {
        name,
        definition,
        type,
        etymology,
        example,
        theme,
      },
    ])
    .eq("id", id);

  const user_id = await getUserId(supabase);

  if (error || !data || !user_id) {
    return NextResponse.json(
      { error: "db error: " + error?.message },
      { status: 500 }
    );
  }

  const { error: errorContribution } = await supabase
    .from("contribution")
    .insert([{ word: id, type: "validate", user_id: user_id }]);

  if (errorContribution)
    return NextResponse.json(
      {
        error: "error contribution:" + errorContribution.message,
      },
      { status: 500 }
    );
  return NextResponse.json({ data: "success" }, { status: 201 });
}
