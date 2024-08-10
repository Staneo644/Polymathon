import { SupabaseClient } from "@supabase/supabase-js";
import { WordRow } from "../word/word";
import { LikeRow } from "./like";
import { getUserId } from "../profile/getProfile";

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
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .in("word", words_id);

  if (error) {
    return { error: "db error getting likes: " + error.message };
  }
  return { data };
}

export async function getUserLikeNumber(
  supabase: SupabaseClient,
  state: boolean
): Promise<
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: number | null;
      error?: undefined;
    }
> {
  const { count, error } = await supabase
    .from("like")
    .select("*", { count: "exact", head: true })
    .eq("user_id", await getUserId(supabase))
    .eq("like", state);

  if (error) {
    return { error: "db error getting likes: " + error.message };
  }
  return { data: count };
}
