import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function destroyLike(supabase: SupabaseClient, word_id: number) {
  const { data, error } = await supabase
    .from("like")
    .delete()
    .eq("word", word_id);
  if (error) return error;
  return data;
}

async function hasToChange(
  supabase: SupabaseClient,
  word_id: number,
  like: boolean | null
) {
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .eq("word", word_id)
    .single();
  console.log("in has to change: ", data, error, like);
  if (error || !data) return false;
  if (data.like === like) return false;
  return true;
}

function parseParamsPOST(request: NextRequest): {
  id?: number;
  like: boolean | null;
  error?: string;
} {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const like = searchParams.get("like");

  if (!id) return { like: null, error: "Please set an id" };

  const idNumber = Number(id);
  if (Number.isNaN(idNumber) || idNumber <= 0)
    return { like: null, error: "id number should be positive" };

  if (like !== "null" && like !== "true" && like !== "false")
    return { like: null, error: "like should be a boolean or null" };
  const likeBool = like === "null" ? null : like === "true" ? true : false;
  return { id: idNumber, like: likeBool };
}

// TODO dont add the like if it exists

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { id, like, error } = parseParamsPOST(request);
  console.log(id, like, error);
  if (error || !id || like === undefined) return NextResponse.json({ error });

  const user_id = await getProfile(supabase);
  if (user_id.error || !user_id.data)
    return NextResponse.json({ error: user_id.error });

  console.log("avant has to change");
  if (!(await hasToChange(supabase, id, like)))
    return NextResponse.json({ error: "Already in this state" });

  console.log("avant destroy like");
  if (await destroyLike(supabase, id))
    return NextResponse.json({ error: "Error when deleting previous like" });

  console.log("avant insert");
  const insert = await supabase.from("like").insert({
    user_id: user_id.data.id,
    word: id,
    like: like,
  });

  console.log(insert);
  if (insert.error) return NextResponse.json({ error: insert.error });

  return NextResponse.json({ data: "Etat like du mot mis a: " + like });
}
