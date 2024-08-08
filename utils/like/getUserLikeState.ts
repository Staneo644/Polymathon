import { LikeRow } from "./like";

export function getUserLikeState(
  likes: LikeRow[],
  word_id: number,
  user: string
): boolean | null {
  const res = likes.find(
    (like) => like.word === word_id && like.user_id === user
  );
  console.log(res);
  return res ? res.like : null;
}
