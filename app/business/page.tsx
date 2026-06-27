import { cookies } from "next/headers";
import Link from "next/link";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { getSiteSettings } from "../../lib/siteSettings";

const heroImage =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=90";

export default async function BusinessPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].business;
  const settings = await getSiteSettings();
  const businessEmail = settings.businessEmail || settings.supportEmail || "";

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <section className="relative overflow-hidden bg-black px-5 py-16 text-white">
        <img
          src={heroImage}
          alt="Tallinn restaurant table"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-end gap-10 lg:grid-cols-[1fr_420px]">
          <div className="pb-4">
            <p className="fade-up text-sm font-black uppercase tracking-[0.25em] text-white/55">
              {t.eyebrow}
            </p>
            <h1 className="fade-up fade-up-delay-1 mt-5 max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-8xl">
              {t.title}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-7 max-w-3xl text-xl leading-8 text-white/75">
              {t.subtitle}
            </p>
            <div className="fade-up fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:-translate-y-0.5"
              >
                {t.apply}
              </Link>
              {businessEmail && (
                <a
                  href={`mailto:${businessEmail}`}
                  className="rounded-full bg-white/10 px-8 py-4 text-center font-black text-white ring-1 ring-white/20 backdrop-blur-2xl transition hover:bg-white hover:text-black"
                >
                  {t.email}
                </a>
              )}
            </div>
          </div>

          <div className="mb-4 rounded-[2rem] bg-white/10 p-6 backdrop-blur-2xl ring-1 ring-white/15">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/45">
              {t.stackLabel}
            </p>
            <div className="mt-5 grid gap-3">
              {t.stack.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 px-5 py-4 font-black"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
              {t.whyLabel}
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              {t.whyTitle}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {t.benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="premium-card hover-lift p-7"
              >
                <h3 className="text-2xl font-black">{benefit.title}</h3>
                <p className="mt-4 leading-7 text-zinc-600">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
              {t.processLabel}
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              {t.processTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              {t.processText}
            </p>
          </div>

          <div className="grid gap-4">
            {t.steps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[64px_1fr] items-center gap-5 rounded-[1.6rem] bg-[#f5f5f7] p-5"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-black text-xl font-black text-white">
                  {index + 1}
                </div>
                <p className="text-xl font-black">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] bg-[#1d1d1f] p-8 text-white md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
                {t.finalLabel}
              </p>
              <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                {t.finalTitle}
              </h2>
            </div>
            <Link
              href="/apply"
              className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:-translate-y-0.5"
            >
              {t.apply}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
