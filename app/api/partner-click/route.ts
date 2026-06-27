import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "maps_click",
  "instagram_click",
  "website_click",
  "get_pass_click",
]);

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const partnerId = String(body.partnerId || "");
    const eventType = String(body.eventType || "");

    if (!isUuid(partnerId) || !allowedEvents.has(eventType)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await supabaseAdmin.from("partner_click_events").insert({
      partner_id: partnerId,
      event_type: eventType,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
