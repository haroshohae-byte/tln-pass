import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { hashDeviceToken } from "../../../lib/device";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function getBaseUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`
  ).replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const passCode = String(body.pass_code || "");

  const deviceToken = request.cookies.get("tln_device")?.value;

  if (!deviceToken) {
    return NextResponse.json(
      { error: "Device is not registered" },
      { status: 403 }
    );
  }

  const deviceHash = hashDeviceToken(deviceToken);

  const { data: pass } = await supabaseAdmin
    .from("member_passes")
    .select("*")
    .eq("pass_code", passCode)
    .maybeSingle();

  if (!pass) {
    return NextResponse.json({ error: "Pass not found" }, { status: 404 });
  }

  const isExpired = new Date(pass.valid_until) < new Date();
  const isActive = pass.status === "active" && !isExpired;

  if (!isActive) {
    return NextResponse.json({ error: "Pass is not active" }, { status: 403 });
  }

  if (!pass.device_hash || pass.device_hash !== deviceHash) {
    return NextResponse.json(
      { error: "This pass is locked to another device" },
      { status: 403 }
    );
  }

  const token = `qr_${crypto.randomUUID().replaceAll("-", "")}`;
  const expiresAt = new Date(Date.now() + 35 * 1000);

  const { error } = await supabaseAdmin.from("qr_tokens").insert({
    pass_id: pass.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const verifyUrl = `${getBaseUrl(request)}/verify-token/${token}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 2,
    width: 360,
  });

  return NextResponse.json({
    qrDataUrl,
    verifyUrl,
    expiresAt: expiresAt.toISOString(),
  });
}
