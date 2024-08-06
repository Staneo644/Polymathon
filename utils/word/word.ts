export interface WordRow {
  id: number;
  created_at: string;
  name: string;
  definition: string;
  type: string;
  etymology: string;
  example: string | null;
  theme: number | null;
  last_day_word: string | null;
}
