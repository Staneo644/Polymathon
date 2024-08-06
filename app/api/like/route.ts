import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function isAlreadyLiked(
  supabase: SupabaseClient,
  user_id: number,
  word_id: number,
  like: boolean
) {
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .eq("user", user_id)
    .eq("word", word_id)
    .eq("like", like)
    .single();
  if (error || !data) return false;
  if (data.length === 0) return false;
  return true;
}

function parseParamsPOST(request: NextRequest): {
  id?: number;
  like?: boolean;
  error?: string;
} {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const like = searchParams.get("like");

  if (!id) return { error: "Please set an id and like" };

  const idNumber = Number(id);
  if (Number.isNaN(idNumber) || idNumber <= 0)
    return { error: "id number should be positive" };

  if (like !== "true" && like !== "false")
    return { error: "like should be a boolean" };
  const likeBool = Boolean(like);
  return { id: idNumber, like: likeBool };
}

// TODO dont add the like if it exists

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { id, like, error } = parseParamsPOST(request);
  if (error || !id || !like) return NextResponse.json({ error });

  const user_id = await getProfile(supabase);
  if (user_id.error) return NextResponse.json({ error: user_id.error });

  if (await isAlreadyLiked(supabase, user_id.data.id, id, like))
    return NextResponse.json({ error: "Already liked" });

  const insert = await supabase.from("like").insert({
    user: user_id.data.id,
    word: id,
    like: like,
  });

  if (insert.error) return NextResponse.json({ error: insert.error });

  return NextResponse.json({ data: "Mot liké" });
}
