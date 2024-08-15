import { getProfile } from "@/utils/profile/getProfile";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const res = await getProfile(supabase);
  if (res.error || !res.data) return NextResponse.json({ error: res.error });
  return NextResponse.json({ data: res.data });
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  let preferences;
  try {
    preferences = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!preferences.hide_definition || !preferences.hide_likes)
    return NextResponse.json(
      { error: "Missing required fields either hide_definition or hide_likes" },
      { status: 400 }
    );

  const updateReq = await supabase.from("profiles").update(preferences);
  if (updateReq.error)
    return NextResponse.json(
      { error: "db error: " + updateReq.error.message },
      { status: 500 }
    );
  return NextResponse.json({ data: "profile updated successfully" });
}
