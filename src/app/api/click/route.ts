import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { linkId } = await req.json();
    if (!linkId) {
      return NextResponse.json({ error: "linkId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    await supabase.rpc("increment_link_clicks", { link_id: linkId });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
