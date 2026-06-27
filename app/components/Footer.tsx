import { cookies } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { getSiteSettings } from "../../lib/siteSettings";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Footer() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang];
  const settings = await getSiteSettings();
  const instagramUrl = settings.instagramUrl;

  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-black">
              TLN
            </div>

            <div>
              <p className="text-lg font-black">TLN Pass</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                Tallinn membership
              </p>
            </div>
          </Link>

          <p className="mt-6 max-w-sm leading-7 text-zinc-500">
            {t.footer.tagline}
          </p>

          <div className="mt-6">
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>

        <FooterGroup title={t.footer.explore}>
          <FooterLink href="/partners">{t.nav.partners}</FooterLink>
          <FooterLink href="/membership">{t.nav.membership}</FooterLink>
          <FooterLink href="/my-pass">{t.nav.myPass}</FooterLink>
        </FooterGroup>

        <FooterGroup title={t.footer.company}>
          <FooterLink href="/business">{t.nav.business}</FooterLink>
          <FooterLink href="/contact">{t.nav.contact}</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          {instagramUrl && (
            <a href={instagramUrl} className="hover:text-white">
              Instagram
            </a>
          )}
          {settings.supportEmail && (
            <a href={`mailto:${settings.supportEmail}`} className="hover:text-white">
              {settings.supportEmail}
            </a>
          )}
        </FooterGroup>

        <FooterGroup title={t.footer.legal}>
          <FooterLink href="/terms">{t.footer.terms}</FooterLink>
          <FooterLink href="/privacy">{t.footer.privacy}</FooterLink>
          <FooterLink href="/refund-policy">{t.footer.refund}</FooterLink>
        </FooterGroup>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-700">
        &copy; {new Date().getFullYear()} TLN Pass. {t.footer.rights}
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-black">{title}</p>
      <div className="mt-5 grid gap-3 text-sm text-zinc-500">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="hover:text-white">
      {children}
    </Link>
  );
}
