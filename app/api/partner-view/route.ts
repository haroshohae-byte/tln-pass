import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const runtime = "nodejs";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const partnerId = String(body.partnerId || "");

    if (!isUuid(partnerId)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("partner_page_views").insert({
      partner_id: partnerId,
      event_type: "page_view",
      user_agent: request.headers.get("user-agent") || null,
      referrer: request.headers.get("referer") || null,
    });

    if (error) {
      await supabaseAdmin.from("partner_page_views").insert({
        partner_id: partnerId,
        user_agent: request.headers.get("user-agent") || null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
