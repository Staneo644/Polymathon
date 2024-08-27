import { createClient } from "@/utils/supabase/server";
import { getWordById } from "@/utils/word/getWordById";
import { NextRequest, NextResponse } from "next/server";

async function parseParamsGET(
  request: NextRequest,
): Promise<{ id?: string; error?: string }> {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) return { error: "Please set an id" };

  return { id: id };
}

/**
 *
 * @param request contient les paramètres de la requête : limit et theme
 * @returns sois data: completeWord[] ou error: string
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { id, error } = await parseParamsGET(request);

  if (error || !id) return NextResponse.json({ error });

  const res = await getWordById(supabase, id);
  if (res.error || !res.data)
    return NextResponse.json({
      error: "db error getting world by id: " + res.error,
    });

  return NextResponse.json({ data: res });
}
