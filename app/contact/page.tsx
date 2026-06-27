import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { getSiteSettings } from "../../lib/siteSettings";

const defaultContactImage =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=90";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].contact;
  const settings = await getSiteSettings();
  const supportEmail = settings.supportEmail || "";
  const businessEmail = settings.businessEmail || supportEmail || "";
  const contactImage = settings.contactImage || defaultContactImage;

  const cards = [
    {
      title: t.support,
      text: t.cards.support,
      email: supportEmail,
    },
    {
      title: t.business,
      text: t.cards.business,
      email: businessEmail,
    },
    {
      title: t.billing,
      text: t.cards.billing,
      email: supportEmail,
    },
    {
      title: t.general,
      text: t.cards.general,
      email: supportEmail,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-14 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="fade-up text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
            {t.eyebrow}
          </p>

          <h1 className="fade-up fade-up-delay-1 mt-5 text-5xl font-black tracking-tight md:text-7xl">
            {t.title}
          </h1>

          <p className="fade-up fade-up-delay-2 mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-600">
            {t.subtitle}
          </p>
        </div>

        <div className="fade-up fade-up-delay-3 mt-12 overflow-hidden rounded-[2.4rem] bg-[#1d1d1f] text-white shadow-sm ring-1 ring-black/5">
          <div className="grid min-h-[360px] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[280px]">
              <img
                src={contactImage}
                alt="Restaurant table"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
                {t.conciergeLabel}
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                {t.conciergeTitle}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
                {t.conciergeText}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={`fade-up rounded-[2.2rem] bg-white p-7 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                index > 1 ? "fade-up-delay-2" : "fade-up-delay-1"
              }`}
            >
              <h2 className="text-3xl font-black">{card.title}</h2>
              <p className="mt-4 leading-7 text-zinc-600">{card.text}</p>
              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="mt-7 inline-flex rounded-full bg-black px-6 py-3 font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
                >
                  {t.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
