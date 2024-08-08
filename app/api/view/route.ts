import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function parseParamsPOST(request: NextRequest): {
  id?: number;
  error?: string;
} {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) return { error: "Please set an id" };

  const idNumber = Number(id);
  if (Number.isNaN(idNumber) || idNumber <= 0)
    return { error: "id number should be positive" };

  return { id: idNumber };
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { id, error } = parseParamsPOST(request);
  if (error) return NextResponse.json({ error });

  const user_id = await getProfile(supabase);
  if (user_id.error || !user_id.data)
    return NextResponse.json({ error: user_id.error });

  const insert = await supabase.from("views").insert({
    user: user_id.data.id,
    word: id,
  });

  if (insert.error) return NextResponse.json({ error: insert.error });

  return NextResponse.json({ data: "Mot vu" });
}
