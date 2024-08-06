import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const res = await supabase.from("theme").select("*");
  if (res.error)
    return NextResponse.json({ error: "db error: " + res.error.message });

  return NextResponse.json({ data: res.data });
}
