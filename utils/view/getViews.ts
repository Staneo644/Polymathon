import { SupabaseClient } from "@supabase/supabase-js";
import { WordRow } from "../word/word";
import { ViewRow } from "./view";

export function getViewNumber(views: ViewRow[], word_id: number): number {
  const res = views.filter((view) => view.word === word_id);
  return res.length;
}

export async function getViews(
  supabase: SupabaseClient,
  words: WordRow[]
): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: ViewRow[];
      error?: undefined;
    }
> {
  const { data, error } = await supabase.from("views").select("*");
  if (error) {
    return { error: "db error getting views: " + error.message };
  }
  return { data };
}
