import { cookies } from "next/headers";
import Link from "next/link";
import { dictionary, normalizeLang } from "../../lib/i18n";
import HeaderCta from "./HeaderCta";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang];

  const links = [
    { label: t.nav.membership, href: "/membership" },
    { label: t.nav.partners, href: "/partners" },
    { label: t.nav.business, href: "/business" },
    { label: t.nav.contact, href: "/contact" },
    { label: t.nav.myPass, href: "/my-pass" },
  ];

  return (
    <header className="sticky top-0 z-[900] border-b border-white/10 bg-[#070707]/95 text-white shadow-[0_12px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-full transition duration-300 hover:-translate-y-0.5"
          aria-label="TLN Pass home"
        >
          <div className="logo-orbit relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[11px] font-black text-black transition duration-300 group-hover:shadow-[0_0_34px_rgba(255,255,255,0.32)]">
            <span>TLN</span>
            <span className="absolute -bottom-3 h-5 w-12 rounded-full bg-[#b8a46f]/40 blur-md" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-tight transition duration-300 group-hover:text-[#f7e6a6] sm:text-lg">
              TLN Pass
            </p>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500 xs:block sm:block">
              {t.brand.headerTagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-3 text-sm font-bold text-zinc-400 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher currentLang={lang} />
          <HeaderCta label={t.nav.join} />
        </div>

        <MobileMenu
          links={links}
          joinLabel={t.nav.join}
          menuLabel={t.nav.menu}
          closeLabel={t.nav.close}
          brandTagline={t.brand.footerTagline}
          currentLang={lang}
        />
      </div>
    </header>
  );
}
