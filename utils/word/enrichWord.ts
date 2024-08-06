import { completeWord } from "@/app/api/word/route";
import { ThemeRow } from "../theme/theme";
import { WordRow } from "./word";
import { getTheme } from "../theme/getThemes";

export async function enrichWord(words: WordRow[], themes: ThemeRow[]) {
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
    };
  });

  return final;
}
