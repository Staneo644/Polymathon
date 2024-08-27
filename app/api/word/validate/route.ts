import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Valider ou invalider un mot en tant qu'admin
 * @param Prends un json contentant {id: number, validated: boolean}
 * @returns data ou error en succes ou reussite
 */
export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const { id, validated } = await request.json();

  if (!id || validated === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const profile = await getProfile(supabase);
  if (!profile.data || !profile.data.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Mettez à jour le mot dans la base de données
  const { data, error } = await supabase
    .from("word")
    .update({ validated })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "db error: " + error.message },
      { status: 500 },
    );
  }

  // Supprimer les mots avec le meme nom au cas ou ca remplace
  const select = await supabase.from("word").select().eq("id", id).single();
  if (select.error) {
    return NextResponse.json(
      { error: "db error selecting word by id: " + select.error.message },
      { status: 500 },
    );
  }
  const deletereq = await supabase
    .from("word")
    .delete()
    .eq("name", select.data.name)
    .neq("id", id);
  if (deletereq.error) {
    return NextResponse.json(
      { error: "db error deleting word by name: " + deletereq.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}
