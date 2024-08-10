import { getUserLikeNumber } from "@/utils/like/getLikes";
import { createClient } from "@/utils/supabase/server";
import { getUserViewNumber } from "@/utils/view/getViewUserNumber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const likes = await getUserLikeNumber(supabase, true);
  if (likes.error) return NextResponse.json({ error: likes.error });
  const dislikes = await getUserLikeNumber(supabase, false);
  if (dislikes.error) return NextResponse.json({ error: dislikes.error });
  const views = await getUserViewNumber(supabase);
  if (views.error) return NextResponse.json({ error: views.error });

  return NextResponse.json({
    likes: likes.data,
    views: views.data,
    dislikes: dislikes.data,
  });
}
