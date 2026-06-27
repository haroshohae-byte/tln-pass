"use client";

import { useEffect } from "react";

export default function PartnerViewTracker({ partnerId }: { partnerId: string }) {
  useEffect(() => {
    const body = JSON.stringify({ partnerId });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/partner-view",
        new Blob([body], { type: "application/json" })
      );
      return;
    }

    fetch("/api/partner-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [partnerId]);

  return null;
}
