import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function parseParamsGET(
  request: NextRequest,
): Promise<{ limit?: number; error?: string }> {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  if (!limit) return { error: "Please set a limit" };

  const limitNumber = Number(limit);
  if (Number.isNaN(limitNumber) || limitNumber <= 0)
    return { error: "Limit number should be positive" };

  return { limit: limitNumber };
}

/**
 *
 * @param request contient les paramètres de la requête : limit et theme
 * @returns sois data: completeWord[] ou error: string
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const profile = await getProfile(supabase);
  if (profile.error || !profile.data)
    return NextResponse.json({ error: profile.error });

  if (profile.data.admin === false)
    return NextResponse.json(
      { error: "You are not an admin" },
      { status: 403 },
    );

  const { limit, error } = await parseParamsGET(request);

  if (error || !limit) return NextResponse.json({ error });

  const res = await supabase.rpc("get_unvalidated_word", {
    limit_count: limit,
  });
  console.log(res);
  return NextResponse.json({ data: res.data });
}
