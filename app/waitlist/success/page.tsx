import { cookies } from "next/headers";
import Link from "next/link";
import { launchCopy, normalizeLang } from "../../../lib/i18n";

export default async function WaitlistSuccessPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = launchCopy[lang].waitlistSuccess;

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 text-4xl text-emerald-300">
          ✓
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
          {t.title}
        </h1>

        <p className="mt-8 text-xl leading-8 text-zinc-400">
          {t.text}
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
        >
          {t.home}
        </Link>
      </section>
    </main>
  );
}
