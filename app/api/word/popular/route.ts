import { createClient } from "@/utils/supabase/server";
import { getPopularWords } from "@/utils/word/getPopularWord";
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

/**
 *
 * @param request contient les paramètres de la requête : limit et theme
 * @returns sois data: completeWord[] ou error: string
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { limit, error } = await parseParamsGET(request);

  if (error || !limit) return NextResponse.json({ error });

  const fun = await getPopularWords(supabase, limit);
  return NextResponse.json({ data: fun.data });
}
