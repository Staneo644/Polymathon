import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const res = await getProfile(supabase);
  if (res.error || !res.data) return NextResponse.json({ error: res.error });
  return NextResponse.json({ admin: res.data });
}
