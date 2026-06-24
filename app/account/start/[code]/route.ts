import { NextRequest, NextResponse } from "next/server";
import { createDeviceToken, hashDeviceToken } from "../../../../lib/device";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function getBaseUrl(request: NextRequest) {
  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    .replace(/\/$/, "");

  const origin = request.nextUrl.origin;

  if (!origin || origin.includes("0.0.0.0")) {
    return envUrl;
  }

  return origin.replace(/\/$/, "");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const baseUrl = getBaseUrl(request);

  const { data: pass, error: passError } = await supabaseAdmin
    .from("member_passes")
    .select("*")
    .eq("pass_code", code)
    .maybeSingle();

  if (passError) {
    throw new Error(passError.message);
  }

  if (!pass) {
    return NextResponse.redirect(`${baseUrl}/join`);
  }

  const existingDeviceToken = request.cookies.get("tln_device")?.value;
  const deviceToken = existingDeviceToken || createDeviceToken();
  const deviceHash = hashDeviceToken(deviceToken);

  if (pass.device_hash && pass.device_hash !== deviceHash) {
    return NextResponse.redirect(`${baseUrl}/account/${code}?locked=1`);
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

  const response = NextResponse.redirect(`${baseUrl}/account/${code}`);

  response.cookies.set("tln_device", deviceToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  response.cookies.set("tln_last_pass_code", code, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
