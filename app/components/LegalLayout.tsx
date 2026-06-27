import Link from "next/link";
import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { getSiteSettings } from "../../lib/siteSettings";

type LegalCard = {
  title: string;
  text: string;
};

type LegalSection = {
  title: string;
  items: readonly string[];
};

export default async function LegalLayout({
  label,
  title,
  intro,
  updated,
  cards,
  sections,
}: {
  label: string;
  title: string;
  intro: string;
  updated: string;
  cards: readonly LegalCard[];
  sections: readonly LegalSection[];
}) {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const layoutText = dictionary[lang].legalLayout;
  const settings = await getSiteSettings();
  const supportEmail = settings.supportEmail;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-14 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="fade-up overflow-hidden rounded-[2.4rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
                {label}
              </p>
              <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                {intro}
              </p>
            </div>

            <aside className="rounded-[2rem] bg-[#f5f5f7] p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-500">
                {layoutText.updated}
              </p>
              <p className="mt-3 text-3xl font-black">{updated}</p>
              <p className="mt-5 leading-7 text-zinc-600">
                {layoutText.questionsBefore}{" "}
                {supportEmail ? (
                  <a className="font-black text-black" href={`mailto:${supportEmail}`}>
                    {supportEmail}
                  </a>
                ) : (
                  <Link className="font-black text-black" href="/contact">
                    {layoutText.contactPage}
                  </Link>
                )}
                {layoutText.questionsAfter}
              </p>
            </aside>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`fade-up rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 ${
                index > 2 ? "fade-up-delay-2" : "fade-up-delay-1"
              }`}
            >
              <h2 className="text-2xl font-black">{card.title}</h2>
              <p className="mt-4 leading-7 text-zinc-600">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <section
              key={section.title}
              className="fade-up rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-black/5"
            >
              <h2 className="text-3xl font-black">{section.title}</h2>
              <div className="mt-5 grid gap-3">
                {section.items.map((item) => (
                  <p
                    key={item}
                    className="rounded-2xl bg-zinc-100 p-4 leading-7 text-zinc-700"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
