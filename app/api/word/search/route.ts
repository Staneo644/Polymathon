import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function parseParamsGET(
  request: NextRequest
): Promise<{ text?: string; error?: string }> {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get("text");
  if (!text) return { error: "Please set a text" };

  return { text: text };
}

/**
 *
 * @param request contient les paramètres de la requête : limit et theme
 * @returns sois data: completeWord[] ou error: string
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { text, error } = await parseParamsGET(request);

  if (error || !text) return NextResponse.json({ error });

  const res = await supabase.rpc("get_word_name_search", { searchtext: text });
  if (res.error || !res.data)
    return NextResponse.json({
      error: "db error getting world by id: " + res.error,
    });

  return NextResponse.json({ data: res.data });
}
