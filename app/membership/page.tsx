import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { plans } from "../../lib/plans";

const planVisuals = {
  "14day": {
    img: "/images/membership/starter.jpg",
    tone: "from-sky-500/40",
  },
  monthly: {
    img: "/images/membership/monthly.jpg",
    tone: "from-amber-500/40",
  },
  "6months": {
    img: "/images/membership/halfyear.jpg",
    tone: "from-violet-500/40",
  },
  yearly: {
    img: "/images/membership/yearly.jpg",
    tone: "from-emerald-500/40",
  },
};

export default async function MembershipPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang];
  const page = t.membership;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-14 text-[#1d1d1f]">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
            {page.eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            {page.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-600">
            {page.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const planText = t.plans.items[plan.id];
            const visual =
              planVisuals[plan.id as keyof typeof planVisuals] ||
              planVisuals.monthly;

            const badge =
              plan.badge === "popular"
                ? t.plans.popularShort
                : plan.badge === "best"
                  ? t.plans.bestValue
                  : plan.id === "14day"
                    ? t.plans.trial
                    : null;

            return (
              <a
                key={plan.id}
                href={`/join?plan=${plan.id}`}
                className="group relative min-h-[520px] overflow-hidden rounded-[2.6rem] bg-black text-white shadow-sm"
              >
                <img
                  src={visual.img}
                  alt={planText.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t ${visual.tone} via-black/45 to-black/10`}
                />

                <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-9">
                  <div className="flex items-start justify-between gap-5">
                    <div className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-2xl">
                      <p className="text-sm font-black">{planText.duration}</p>
                    </div>

                    {badge && (
                      <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                        {badge}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-4 w-fit rounded-full bg-black/35 px-4 py-2 text-sm font-black text-white/80 backdrop-blur-2xl">
                      {planText.visualLabel}
                    </p>

                    <h2 className="max-w-md text-5xl font-black leading-tight tracking-tight md:text-6xl">
                      {planText.name}
                    </h2>

                    <p className="mt-5 max-w-md text-lg font-medium leading-8 text-white/75">
                      {planText.note}
                    </p>

                    <div className="mt-8 flex items-end justify-between gap-5">
                      <div>
                        <p className="text-xl font-black text-white/45 line-through">
                          {plan.oldPrice}
                        </p>

                        <p className="text-6xl font-black tracking-tight">
                          {plan.price}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-6 py-4 font-black text-black transition group-hover:scale-105">
                        {t.plans.chooseShort}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-8 rounded-[2.4rem] bg-white p-7 text-center shadow-sm ring-1 ring-black/5 md:p-10">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            {page.afterTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            {page.afterText}
          </p>
        </div>
      </section>
    </main>
  );
}
