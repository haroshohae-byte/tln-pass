import { NextRequest, NextResponse } from "next/server";
import { createDeviceToken, hashDeviceToken } from "../../../../lib/device";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const { data: pass } = await supabaseAdmin
    .from("member_passes")
    .select("*")
    .eq("pass_code", code)
    .maybeSingle();

  if (!pass) {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  const existingDeviceToken = request.cookies.get("tln_device")?.value;
  const deviceToken = existingDeviceToken || createDeviceToken();
  const deviceHash = hashDeviceToken(deviceToken);

  if (pass.device_hash && pass.device_hash !== deviceHash) {
    return NextResponse.redirect(
      new URL(`/account/${code}?locked=1`, request.url)
    );
  }

  if (!pass.device_hash) {
    const { error } = await supabaseAdmin
      .from("member_passes")
      .update({
        device_hash: deviceHash,
        updated_at: new Date().toISOString(),
      })
      .eq("pass_code", code);

    if (error) {
      throw new Error(error.message);
    }
  }

  const response = NextResponse.redirect(
    new URL(`/account/${code}`, request.url)
  );

  response.cookies.set("tln_device", deviceToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
