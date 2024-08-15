import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_liked_words", {
    state: false,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
