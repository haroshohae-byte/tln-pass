"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Lang } from "../../lib/i18n";

type LinkItem = {
  label: string;
  href: string;
};

const fallbackLinks: Record<Lang, LinkItem[]> = {
  en: [
    { label: "Membership", href: "/membership" },
    { label: "Partners", href: "/partners" },
    { label: "For Business", href: "/business" },
    { label: "Contact", href: "/contact" },
    { label: "My Pass", href: "/my-pass" },
  ],
  ru: [
    { label: "Подписка", href: "/membership" },
    { label: "Партнёры", href: "/partners" },
    { label: "Для бизнеса", href: "/business" },
    { label: "Контакты", href: "/contact" },
    { label: "Мой Pass", href: "/my-pass" },
  ],
  ee: [
    { label: "Liikmesus", href: "/membership" },
    { label: "Partnerid", href: "/partners" },
    { label: "Ettevõttele", href: "/business" },
    { label: "Kontakt", href: "/contact" },
    { label: "Minu Pass", href: "/my-pass" },
  ],
};

export default function MobileMenu({
  links,
  joinLabel,
  menuLabel,
  closeLabel,
  brandTagline,
  currentLang,
}: {
  links: LinkItem[];
  joinLabel: string;
  menuLabel: string;
  closeLabel: string;
  brandTagline: string;
  currentLang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const navLinks = useMemo(() => {
    return links.length > 0 ? links : fallbackLinks[currentLang];
  }, [links, currentLang]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="flex items-center lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-black text-black shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition active:scale-95"
      >
        {open ? closeLabel : menuLabel}
      </button>

      {open && (
        <div
          id="mobile-navigation-menu"
          className="fixed inset-x-3 top-[5.25rem] z-[99999] max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-[2rem] border border-white/10 bg-[#080808] p-4 text-white shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
          role="dialog"
          aria-modal="false"
          aria-label="Mobile navigation"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="min-w-0">
              <p className="text-xl font-black text-white">TLN Pass</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                {brandTagline}
              </p>
            </div>

            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-black text-black transition active:scale-95"
            >
              {closeLabel}
            </button>
          </div>

          <nav className="mt-4 grid gap-3" aria-label="Mobile navigation links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-4 text-xl font-black leading-tight text-white transition active:scale-[0.99]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!isAdmin && (
            <Link
              href="/membership"
              onClick={closeMenu}
              className="mt-4 block rounded-full bg-white px-6 py-4 text-center text-base font-black text-black transition active:scale-[0.99]"
            >
              {joinLabel}
            </Link>
          )}

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
              Language
            </p>
            <div className="flex justify-center">
              <LanguageSwitcher currentLang={currentLang} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
