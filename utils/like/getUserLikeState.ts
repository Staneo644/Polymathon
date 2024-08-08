import { LikeRow } from "./getLikes";

export function getUserLikeState(
  likes: LikeRow[],
  word_id: number,
  user: string
): boolean | null {
  const res = likes.find((like) => like.word === word_id && like.user === user);
  return res ? res.like : null;
}
