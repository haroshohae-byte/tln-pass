import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { hashDeviceToken } from "../../../lib/device";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function getBaseUrl(request: NextRequest) {
  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    .replace(/\/$/, "");

  const origin = request.nextUrl.origin;

  if (!origin || origin.includes("0.0.0.0")) {
    return envUrl;
  }

  return origin.replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const passCode = String(body.pass_code || "");

    if (!passCode) {
      return NextResponse.json(
        { error: "Missing pass code" },
        { status: 400 }
      );
    }

    const deviceToken = request.cookies.get("tln_device")?.value;

    if (!deviceToken) {
      return NextResponse.json(
        { error: "Device is not registered. Reopen your pass from success page." },
        { status: 403 }
      );
    }

    const deviceHash = hashDeviceToken(deviceToken);

    const { data: pass, error: passError } = await supabaseAdmin
      .from("member_passes")
      .select("*")
      .eq("pass_code", passCode)
      .maybeSingle();

    if (passError) {
      return NextResponse.json({ error: passError.message }, { status: 500 });
    }

    if (!pass) {
      return NextResponse.json({ error: "Pass not found" }, { status: 404 });
    }

    const isExpired = new Date(pass.valid_until) < new Date();
    const isActive = pass.status === "active" && !isExpired;

    if (!isActive) {
      return NextResponse.json(
        { error: "Pass is not active or expired" },
        { status: 403 }
      );
    }

    if (!pass.device_hash) {
      return NextResponse.json(
        { error: "Pass is not connected to this device yet" },
        { status: 403 }
      );
    }

    if (pass.device_hash !== deviceHash) {
      return NextResponse.json(
        { error: "This pass is locked to another device" },
        { status: 403 }
      );
    }

    const token = `qr_${crypto.randomUUID().replaceAll("-", "")}`;
    const expiresAt = new Date(Date.now() + 35 * 1000);

    const { error: insertError } = await supabaseAdmin.from("qr_tokens").insert({
      pass_id: pass.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown QR generation error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
