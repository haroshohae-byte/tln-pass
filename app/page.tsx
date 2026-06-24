import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../lib/i18n";

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

const categories = [
  {
    label: "Restaurants",
    href: "/partners?category=restaurants",
    img: images.restaurant,
  },
  {
    label: "Cafes",
    href: "/partners?category=cafes",
    img: images.cafe,
  },
  {
    label: "Bars",
    href: "/partners?category=bars",
    img: images.bar,
  },
  {
    label: "Entertainment",
    href: "/partners?category=entertainment",
    img: images.event,
  },
  {
    label: "Fitness",
    href: "/partners?category=fitness",
    img: images.fitness,
  },
  {
    label: "Beauty",
    href: "/partners?category=beauty",
    img: images.beauty,
  },
];

const steps = [
  {
    title: "Choose the place.",
    text: "Open restaurants, cafes, bars and experiences curated for TLN Pass members.",
    img: images.cafe,
  },
  {
    title: "Show your pass.",
    text: "The dynamic QR is made for the moment before you pay.",
    img: images.dinner,
  },
  {
    title: "Unlock the benefit.",
    text: "The partner verifies your active membership and applies the available perk.",
    img: images.restaurant,
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].home;

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <section className="relative min-h-[92vh] overflow-hidden bg-black text-white">
        <img
          src={images.tallinn}
          alt="Tallinn"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-black/85" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center">
          <p className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-2xl">
            {t.badge}
          </p>

          <h1 className="mt-8 max-w-5xl text-6xl font-black leading-[0.98] tracking-tight md:text-8xl lg:text-9xl">
            Tallinn, unlocked.
          </h1>

          <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-white/80 md:text-2xl">
            {t.text}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/membership"
              className="rounded-full bg-white px-8 py-4 text-base font-bold text-black transition hover:scale-105"
            >
              {t.ctaPrimary}
            </a>

            <a
              href="/partners"
              className="rounded-full bg-white/12 px-8 py-4 text-base font-bold text-white ring-1 ring-white/20 backdrop-blur-2xl transition hover:bg-white hover:text-black"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
              Simple by design
            </p>

            <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              A city guide that works like a pass.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-600">
              No messy coupons. No plastic card. Open your phone, choose a place,
              show the QR and enjoy the member benefit.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.title}
                className="overflow-hidden rounded-[2.2rem] bg-white shadow-sm ring-1 ring-black/5"
              >
                <img
                  src={step.img}
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
                Choose your vibe
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
                Pick your mood.
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-zinc-600">
              Jump straight into what you want today: food, coffee, cocktails,
              events, fitness or beauty.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <a
                key={category.href}
                href={category.href}
                className="group relative h-[360px] overflow-hidden rounded-[2.2rem] bg-black"
              >
                <img
                  src={category.img}
                  alt={category.label}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
                  <h3 className="text-4xl font-black tracking-tight">
                    {category.label}
                  </h3>

                  <span className="rounded-full bg-white px-5 py-3 text-sm font-black text-black">
                    Open
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.6rem] bg-[#1d1d1f] text-white">
          <div className="grid min-h-[560px] lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">
                Mobile-first
              </p>

              <h2 className="mt-5 max-w-xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                Built for the moment before you pay.
              </h2>

              <p className="mt-6 max-w-xl text-xl leading-8 text-white/65">
                TLN Pass is made to be used on the phone, at the venue, when it
                actually matters.
              </p>

              <a
                href="/membership"
                className="mt-9 w-fit rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
              >
                View membership
              </a>
            </div>

            <div className="relative min-h-[420px]">
              <img
                src={images.bar}
                alt="Tallinn night out"
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
