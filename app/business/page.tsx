import { cookies } from "next/headers";
import { normalizeLang } from "../../lib/i18n";

const copy = {
  en: {
    eyebrow: "For Business",
    title: "Bring TLN Pass members to your venue.",
    subtitle:
      "Restaurants, cafes, bars and local businesses can use TLN Pass to attract members with simple QR-based benefits.",
    apply: "Apply as partner",
  },
  ru: {
    eyebrow: "Для бизнеса",
    title: "Приводи участников TLN Pass в своё место.",
    subtitle:
      "Рестораны, кафе, бары и локальный бизнес могут привлекать участников через простые QR-привилегии.",
    apply: "Стать партнёром",
  },
  ee: {
    eyebrow: "Ettevõttele",
    title: "Too TLN Pass liikmed oma kohta.",
    subtitle:
      "Restoranid, kohvikud, baarid ja kohalikud ettevõtted saavad pakkuda QR-põhiseid liikme eeliseid.",
    apply: "Hakka partneriks",
  },
};

export default async function BusinessPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = copy[lang];

  const ideas = [
    "20% off selected menu",
    "Free dessert for members",
    "2-for-1 cocktails",
    "Member-only combo",
    "Priority booking",
    "Special event access",
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <section className="relative min-h-[640px] overflow-hidden bg-black px-5 py-16 text-white">
        <img
          src="/images/membership/monthly.jpg"
          alt="Restaurant"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-end">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/50">
            {t.eyebrow}
          </p>

          <h1 className="mt-5 max-w-5xl text-6xl font-black leading-tight tracking-tight md:text-8xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/75">
            {t.subtitle}
          </p>

          <a
            href="/apply"
            className="mt-9 w-fit rounded-full bg-white px-8 py-4 font-black text-black"
          >
            {t.apply}
          </a>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-black tracking-tight">
            Offer ideas that work.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {ideas.map((idea) => (
              <div
                key={idea}
                className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-black/5"
              >
                <p className="text-2xl font-black">{idea}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
