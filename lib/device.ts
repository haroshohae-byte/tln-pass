import crypto from "crypto";

export function createDeviceToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

export function hashDeviceToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
