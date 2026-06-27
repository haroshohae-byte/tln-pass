import { cookies } from "next/headers";
import Link from "next/link";
import { dictionary, normalizeLang } from "../lib/i18n";
import { getSiteSettings } from "../lib/siteSettings";

const images = {
  tallinn:
    "https://images.unsplash.com/photo-1573156667504-2699f9d6f75b?auto=format&fit=crop&w=2000&q=90",
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90",
  cafe:
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=90",
  bar:
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1400&q=90",
  event:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=90",
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=90",
  beauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=90",
  dinner:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=90",
};

const heroBackground = [
  "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.20), transparent 24%)",
  "radial-gradient(circle at 78% 12%, rgba(120,170,255,0.22), transparent 26%)",
  "linear-gradient(135deg, rgba(5,5,5,0.42), rgba(5,5,5,0.85))",
];

const categories = [
  {
    key: "restaurants",
    href: "/partners?category=restaurants",
    img: images.restaurant,
  },
  {
    key: "cafes",
    href: "/partners?category=cafes",
    img: images.cafe,
  },
  {
    key: "bars",
    href: "/partners?category=bars",
    img: images.bar,
  },
  {
    key: "entertainment",
    href: "/partners?category=entertainment",
    img: images.event,
  },
  {
    key: "fitness",
    href: "/partners?category=fitness",
    img: images.fitness,
  },
  {
    key: "beauty",
    href: "/partners?category=beauty",
    img: images.beauty,
  },
] as const;

const stepImages = [images.cafe, images.dinner, images.restaurant];

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].home;
  const settings = await getSiteSettings();
  const heroImageLayers = [
    ...heroBackground,
    settings.homepageHeroImage ? `url('${settings.homepageHeroImage}')` : "",
    "url('/images/home/hero.jpg')",
    `url('${images.tallinn}')`,
    "linear-gradient(135deg, #111827, #050505 62%, #1d1d1f)",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <section
        className="relative min-h-[92vh] overflow-hidden bg-[#111827] bg-cover bg-center text-white"
        style={{ backgroundImage: heroImageLayers }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.10),transparent_24%),linear-gradient(to_bottom,rgba(0,0,0,0.32),rgba(0,0,0,0.30),rgba(0,0,0,0.88))]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center">
          <p className="fade-up rounded-full bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-2xl">
            {t.badge}
          </p>

          <h1 className="fade-up fade-up-delay-1 mt-8 max-w-5xl text-6xl font-black leading-[0.98] tracking-tight md:text-8xl lg:text-9xl">
            {lang === "en" && settings.heroTitle ? settings.heroTitle : t.title}
          </h1>

          <p className="fade-up fade-up-delay-2 mt-8 max-w-3xl text-xl font-medium leading-8 text-white/80 md:text-2xl">
            {lang === "en" && settings.heroSubtitle ? settings.heroSubtitle : t.text}
          </p>

          <div className="fade-up fade-up-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/membership"
              className="premium-button bg-white px-8 py-4 text-base font-bold text-black hover:shadow-[0_18px_45px_rgba(255,255,255,0.18)]"
            >
              {t.ctaPrimary}
            </Link>

            <Link
              href="/partners"
              className="premium-button bg-white/12 px-8 py-4 text-base font-bold text-white ring-1 ring-white/20 backdrop-blur-2xl hover:bg-white hover:text-black"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
              {t.simpleLabel}
            </p>

            <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              {t.simpleTitle}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-600">
              {t.simpleText}
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {t.steps.map((step, index) => (
              <article
                key={step.title}
                className="fade-up premium-card hover-lift overflow-hidden"
              >
                <img
                  src={stepImages[index]}
                  alt={step.title}
                  className="h-72 w-full object-cover"
                />

                <div className="p-7">
                  <h3 className="text-3xl font-black tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-lg leading-7 text-zinc-600">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                {t.categoriesLabel}
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
                {t.categoriesTitle}
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-zinc-600">
              {t.categoriesText}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="fade-up hover-lift group relative h-[360px] overflow-hidden rounded-[2.2rem] bg-black"
              >
                <img
                  src={category.img}
                  alt={dictionary[lang].categories[category.key]}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
                  <h3 className="text-4xl font-black tracking-tight">
                    {dictionary[lang].categories[category.key]}
                  </h3>

                  <span className="rounded-full bg-white px-5 py-3 text-sm font-black text-black">
                    {dictionary[lang].common.open}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.6rem] bg-[#1d1d1f] text-white">
          <div className="grid min-h-[560px] lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">
                {t.mobileLabel}
              </p>

              <h2 className="mt-5 max-w-xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                {t.mobileTitle}
              </h2>

              <p className="mt-6 max-w-xl text-xl leading-8 text-white/65">
                {t.mobileText}
              </p>

              <Link
                href="/membership"
                className="mt-9 w-fit rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
              >
                {t.mobileCta}
              </Link>
            </div>

            <div className="relative min-h-[420px]">
              <img
                src={images.bar}
                alt={t.nightOutAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
