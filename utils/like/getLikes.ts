import { SupabaseClient } from "@supabase/supabase-js";
import { WordRow } from "../word/word";
import { LikeRow } from "./like";

export function getLikeDislikeNumber(
  likes: LikeRow[],
  word_id: number,
  likedOrDislike: boolean
): number {
  const res = likes.filter(
    (like) => like.word === word_id && like.like === likedOrDislike
  );
  return res.length;
}

export async function getLikes(
  supabase: SupabaseClient,
  words: WordRow[]
): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: LikeRow[];
      error?: undefined;
    }
> {
  const words_id = words.filter((word) => word.id).map((word) => word.id);
  console.log(words_id);
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .in("word", words_id);

  console.log(data, error);
  if (error) {
    return { error: "db error getting likes: " + error.message };
  }
  return { data };
}
