import { createClient } from "@/utils/supabase/server";
import { WordRow } from "@/utils/word/word";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function addWordOfTheDay(supabase: SupabaseClient, limit: number) {
  const select = await supabase.rpc("get_next_word_of_the_day", {
    limit_count: limit,
  });

  if (!select.data || select.error) return { error: select.error };
  const ids: number[] = select.data.map((word: WordRow) => word.id);

  const today = new Date().toISOString();
  const update = await supabase
    .from("word")
    .update({ last_day_word: today })
    .in("id", ids);

  if (update.error) return { error: update.error };

  const get = await supabase.rpc("get_word_of_the_day");
  if (get.error) return { error: get.error };

  return { data: get.data };
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const limit = Number(process.env.WORD_OF_THE_DAY_PER_DAY) || 1;

  const { data, error } = await supabase.rpc("get_word_of_the_day");
  if (error) return NextResponse.json({ error: error }, { status: 500 });

  if (data.length < limit) {
    const add = await addWordOfTheDay(supabase, limit);
    if (add.error)
      return NextResponse.json({ error: add.error }, { status: 500 });

    const { data, error } = await supabase.rpc("get_word_of_the_day");
    if (error) return NextResponse.json({ error: error }, { status: 500 });
    return NextResponse.json({ data: data });
  }

  return NextResponse.json({ data: data });
}
