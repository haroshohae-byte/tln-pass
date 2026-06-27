"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function PartnerActionLink({
  href,
  partnerId,
  eventType,
  children,
  className,
  external = false,
}: {
  href: string;
  partnerId: string;
  eventType: string;
  children: ReactNode;
  className: string;
  external?: boolean;
}) {
  function trackClick() {
    const body = JSON.stringify({ partnerId, eventType });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/partner-click",
        new Blob([body], { type: "application/json" })
      );
      return;
    }

    fetch("/api/partner-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={trackClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={trackClick} className={className}>
      {children}
    </Link>
  );
}
