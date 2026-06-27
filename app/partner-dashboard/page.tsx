import { cookies } from "next/headers";
import { launchCopy, normalizeLang } from "../../lib/i18n";

export default async function PartnerDashboardPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = launchCopy[lang].partnerDashboard;

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
          {t.privateTitle}
        </h1>

        <p className="mt-8 text-xl leading-8 text-zinc-400">
          {t.privateText}
        </p>

        <a
          href="/apply"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
        >
          {t.applyCta}
        </a>
      </section>
    </main>
  );
}

