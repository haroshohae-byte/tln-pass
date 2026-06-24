import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang];

  const links = [
    { label: t.nav.partners, href: "/partners" },
    { label: t.nav.membership, href: "/membership" },
    { label: t.nav.myPass, href: "/my-pass" },
    { label: t.nav.business, href: "/business" },
    { label: t.nav.contact, href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/80 text-white backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-black text-black">
            <span>TLN</span>
            <span className="absolute -bottom-3 h-5 w-12 rounded-full bg-[#b8a46f]/40 blur-md" />
          </div>

          <div>
            <p className="text-lg font-black tracking-tight">TLN Pass</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
              Tallinn city access
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-3 text-sm font-bold text-zinc-400 transition hover:bg-white hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher currentLang={lang} />

          <a
            href="/membership"
            className="rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:scale-105"
          >
            {t.nav.join}
          </a>
        </div>

        <MobileMenu
          links={links}
          joinLabel={t.nav.join}
          menuLabel={t.nav.menu}
          closeLabel={t.nav.close}
          currentLang={lang}
        />
      </div>
    </header>
  );
}
