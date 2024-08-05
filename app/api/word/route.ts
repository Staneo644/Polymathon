import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function parseParamsGET(
  supabase: SupabaseClient,
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

  const { data, error } = await supabase
    .from("theme")
    .select("*")
    .eq("name", theme);

  if (error) return { error: "db error: " + error.message };
  if (data.length === 0) return { error: `Theme : '${theme}' not found` };

  return { theme: data[0].id, limit: limitNumber };
}

//TODO prendre en compte les vues
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { limit, theme, error } = await parseParamsGET(supabase, request);

  if (error || !limit) return NextResponse.json({ error });

  let req = supabase.from("word").select("*");
  if (theme) req = req.eq("theme", theme);
  req = req.limit(limit);
  const res = await req;

  if (res.error)
    return NextResponse.json({ error: "db error: " + res.error.message });

  return NextResponse.json({ data: res.data });
}
