import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Footer() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang];

  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-black">
              TLN
            </div>

            <div>
              <p className="text-lg font-black">TLN Pass</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                Tallinn membership
              </p>
            </div>
          </a>

          <p className="mt-6 max-w-sm leading-7 text-zinc-500">
            {t.footer.tagline}
          </p>

          <div className="mt-6">
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>

        <div>
          <p className="font-black">{t.footer.explore}</p>

          <div className="mt-5 grid gap-3 text-sm text-zinc-500">
            <a href="/partners" className="hover:text-white">
              {t.nav.partners}
            </a>
            <a href="/membership" className="hover:text-white">
              {t.nav.membership}
            </a>
            <a href="/my-pass" className="hover:text-white">
              {t.nav.myPass}
            </a>
          </div>
        </div>

        <div>
          <p className="font-black">{t.footer.company}</p>

          <div className="mt-5 grid gap-3 text-sm text-zinc-500">
            <a href="/business" className="hover:text-white">
              {t.nav.business}
            </a>
            <a href="/contact" className="hover:text-white">
              {t.nav.contact}
            </a>
            <a href="https://instagram.com" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <p className="font-black">{t.footer.legal}</p>

          <div className="mt-5 grid gap-3 text-sm text-zinc-500">
            <a href="/terms" className="hover:text-white">
              {t.footer.terms}
            </a>
            <a href="/privacy" className="hover:text-white">
              {t.footer.privacy}
            </a>
            <a href="/refund-policy" className="hover:text-white">
              {t.footer.refund}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-700">
        © {new Date().getFullYear()} TLN Pass. {t.footer.rights}
      </div>
    </footer>
  );
}
