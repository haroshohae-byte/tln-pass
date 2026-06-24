import { cookies } from "next/headers";
import { normalizeLang } from "../../lib/i18n";

const copy = {
  en: {
    eyebrow: "Contact",
    title: "Talk to TLN Pass.",
    subtitle:
      "Questions about membership, billing or partnership? Choose the right direction below.",
    support: "Member support",
    billing: "Billing",
    partners: "Partnerships",
    general: "General",
    email: "Email us",
  },
  ru: {
    eyebrow: "Контакты",
    title: "Связаться с TLN Pass.",
    subtitle:
      "Вопросы по подписке, оплате или партнёрству? Выбери нужный раздел.",
    support: "Поддержка участников",
    billing: "Оплата",
    partners: "Партнёрство",
    general: "Общее",
    email: "Написать",
  },
  ee: {
    eyebrow: "Kontakt",
    title: "Võta TLN Passiga ühendust.",
    subtitle:
      "Küsimused liikmesuse, maksete või partnerluse kohta? Vali sobiv teema.",
    support: "Liikme tugi",
    billing: "Maksed",
    partners: "Partnerlus",
    general: "Üldine",
    email: "Kirjuta",
  },
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = copy[lang];

  const cards = [
    [t.support, "Help with pass access, QR or account."],
    [t.billing, "Questions about Stripe checkout or subscription."],
    [t.partners, "Restaurants, cafes and venues that want to join."],
    [t.general, "General questions about TLN Pass."],
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-14 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
            {t.eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            {t.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-600">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cards.map(([title, text]) => (
            <div
              key={title}
              className="rounded-[2.2rem] bg-white p-7 shadow-sm ring-1 ring-black/5"
            >
              <h2 className="text-3xl font-black">{title}</h2>
              <p className="mt-4 leading-7 text-zinc-600">{text}</p>
              <a
                href="mailto:support@tlnpass.com"
                className="mt-7 inline-flex rounded-full bg-black px-6 py-3 font-black text-white"
              >
                {t.email}
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
