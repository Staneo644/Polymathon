import { ThemeRow } from "../theme/theme";
import { WordRow } from "./word";
import { getTheme } from "../theme/getThemes";
import { getLikeDislikeNumber, LikeRow } from "../like/getLikes";
import { getUserLikeState } from "../like/getUserLikeState";
import { ProfileRow } from "../profile/profile";

export interface completeWord {
  id: number;
  name: string;
  definition: string;
  type: string;
  etymology: string;
  example: string | null;
  theme: string | null;
  last_day_word: string;
  likes: number;
  dislikes: number;
  user_like: boolean | null;
}

export function enrichWord(
  words: WordRow[],
  themes: ThemeRow[],
  likes: LikeRow[],
  profile: ProfileRow
): completeWord[] {
  const final: completeWord[] = words.map((word) => {
    return {
      id: word.id,
      name: word.name,
      definition: word.definition,
      type: word.type,
      etymology: word.etymology,
      example: word.example,
      theme: getTheme(word.theme, themes),
      last_day_word: word.last_day_word,
      likes: getLikeDislikeNumber(likes, word.id, true),
      dislikes: getLikeDislikeNumber(likes, word.id, false),
      user_like: getUserLikeState(likes, word.id, profile.id),
    };
  });

  return final;
}
