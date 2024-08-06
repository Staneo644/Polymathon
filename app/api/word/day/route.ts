import { createClient } from "@/utils/supabase/client";
import { getThemes } from "@/utils/theme/getThemes";
import { enrichWord } from "@/utils/word/enrichWord";
import { getNextWordOfTheDay } from "@/utils/word/getNextWordOfTheDay";
import { getWordOfTheDay } from "@/utils/word/getWordOfTheDay";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function addWordOfTheDay(supabase: SupabaseClient, limit: number) {
  const select = await getNextWordOfTheDay(supabase, limit);

  if (!select.data || select.error) return { error: select.error };
  const ids: any[] = select.data.map((word) => word.id);

  console.log(select.data);
  const today = new Date().toISOString();
  const update = await supabase
    .from("word")
    .update({ last_day_word: today })
    .in("id", ids);

  if (update.error) return { error: update.error };

  const get = await getWordOfTheDay(supabase);
  if (get.error) return { error: get.error };

  return { data: get.data };
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const limit = Number(process.env.WORD_OF_THE_DAY_PER_DAY) || 1;

  const themes = await getThemes(supabase);
  if (themes.error || !themes.data)
    return NextResponse.json({ error: themes.error });

  const { data, error } = await getWordOfTheDay(supabase);
  if (error) return NextResponse.json({ error });

  if (data.length < limit) {
    const add = await addWordOfTheDay(supabase, limit);
    if (add.error) return NextResponse.json({ error: add.error });

    const final = enrichWord(add.data, themes.data);
    return NextResponse.json({ data: final });
  }
  console.log(data);
  const final = enrichWord(data, themes.data);
  console.log(final);
  return NextResponse.json({ data: final });
}
