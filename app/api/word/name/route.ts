import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { getThemes } from "@/utils/theme/getThemes";
import { getWordByName } from "@/utils/word/getWordByName";
import { NextRequest, NextResponse } from "next/server";

async function parseParamsGET(
  request: NextRequest
): Promise<{ name?: string; error?: string }> {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  if (!name) return { error: "Please set a name" };

  return { name: name };
}

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

  const profile = await getProfile(supabase);
  if (profile.error || !profile.data)
    return NextResponse.json({ error: profile.error });

  const { name, error } = await parseParamsGET(request);

  if (error || !name) return NextResponse.json({ error });

  const res = await getWordByName(supabase, name);
  if (res.error || !res.data)
    return NextResponse.json({
      error: "db error getting world by name: " + res.error,
    });

  return NextResponse.json({ data: res });
}
