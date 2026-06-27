import { cookies } from "next/headers";
import Link from "next/link";
import { dictionary, normalizeLang } from "../../lib/i18n";

export default async function AssistantPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].assistant;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2.6rem] bg-black p-8 text-white md:p-14">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
            {t.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/65">
            {t.text}
          </p>
          <Link
            href="/partners"
            className="mt-9 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:-translate-y-0.5"
          >
            {t.cta}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {t.suggestions.map((item) => (
            <div key={item} className="premium-card hover-lift p-7">
              <p className="text-2xl font-black">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
