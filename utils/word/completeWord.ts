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
  user_like_status: boolean | null;
  views: number;
}
