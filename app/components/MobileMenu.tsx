"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Lang } from "../../lib/i18n";

type LinkItem = {
  label: string;
  href: string;
};

export default function MobileMenu({
  links,
  joinLabel,
  menuLabel,
  closeLabel,
  currentLang,
}: {
  links: LinkItem[];
  joinLabel: string;
  menuLabel: string;
  closeLabel: string;
  currentLang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white backdrop-blur-xl"
      >
        {menuLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xl">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[2.5rem] border border-white/10 bg-[#090909] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-black text-white">TLN Pass</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Tallinn membership
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-black"
              >
                {closeLabel}
              </button>
            </div>

            <nav className="mt-8 grid gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-5 text-2xl font-black text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-6 flex items-center justify-between gap-4">
              <LanguageSwitcher currentLang={currentLang} />

              {!isAdmin && (
                <a
                  href="/join"
                  className="rounded-full bg-white px-6 py-3 text-sm font-black text-black"
                >
                  {joinLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
