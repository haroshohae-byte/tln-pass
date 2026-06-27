"use client";

import { usePathname } from "next/navigation";

export default function HeaderCta({ label }: { label: string }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="/membership"
      className="rounded-full bg-white px-6 py-3 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(255,255,255,0.18)]"
    >
      {label}
    </a>
  );
}
