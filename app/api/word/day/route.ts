import { getLikes } from "@/utils/like/getLikes";
import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { getThemes } from "@/utils/theme/getThemes";
import { getViews } from "@/utils/view/getViews";
import { enrichWord } from "@/utils/word/enrichWord";
import { getNextWordOfTheDay } from "@/utils/word/getNextWordOfTheDay";
import { getWordOfTheDay } from "@/utils/word/getWordOfTheDay";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function addWordOfTheDay(supabase: SupabaseClient, limit: number) {
  const select = await getNextWordOfTheDay(supabase, limit);

  if (!select.data || select.error) return { error: select.error };
  const ids: any[] = select.data.map((word) => word.id);

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

  const profile = await getProfile(supabase);
  if (profile.error || !profile.data)
    return NextResponse.json({ error: profile.error });

  const { data, error } = await getWordOfTheDay(supabase);
  if (error) return NextResponse.json({ error });

  const likes = await getLikes(supabase, data);
  if (likes.error || !likes.data)
    return NextResponse.json({ error: likes.error });

  const views = await getViews(supabase, data);
  if (views.error || !views.data)
    return NextResponse.json({ error: views.error });

  if (data.length < limit) {
    const add = await addWordOfTheDay(supabase, limit);
    if (add.error) return NextResponse.json({ error: add.error });

    const final = enrichWord(
      add.data,
      themes.data,
      likes.data,
      profile.data,
      views.data
    );
    return NextResponse.json({ data: final });
  }

  const final = enrichWord(
    data,
    themes.data,
    likes.data,
    profile.data,
    views.data
  );
  return NextResponse.json({ data: final });
}
