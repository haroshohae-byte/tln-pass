import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { getPlanById, getStripePriceId } from "../../lib/plans";
import { getSiteSettings } from "../../lib/siteSettings";
import { stripe } from "../../lib/stripe";

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
      /\/$/,
      ""
    );
  }

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    host.startsWith("172.");

  const protocol = isLocal ? "http" : "https";

  return `${protocol}://${host}`;
}

async function startCheckout(formData: FormData) {
  "use server";

  const settings = await getSiteSettings();

  if (settings.stripePaymentsEnabled === "false") {
    throw new Error("Stripe payments are currently disabled");
  }

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const planId = String(formData.get("plan") || "monthly");

  if (!fullName || !email) {
    throw new Error("Name and email are required");
  }

  const plan = getPlanById(planId);
  const priceId = getStripePriceId(plan.id);
  const baseUrl = await getBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/join?plan=${plan.id}&canceled=1`,
    metadata: {
      full_name: fullName,
      email,
      plan_id: plan.id,
      plan_name: plan.name,
    },
    subscription_data: {
      metadata: {
        full_name: fullName,
        email,
        plan_id: plan.id,
        plan_name: plan.name,
      },
    },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    throw new Error("Stripe Checkout URL was not created");
  }

  redirect(session.url);
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].join;
  const settings = await getSiteSettings();
  const paymentsDisabled = settings.stripePaymentsEnabled === "false";

  const { plan: planParam } = await searchParams;
  const plan = getPlanById(planParam);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-16 text-white">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_480px] lg:items-start">
        <div className="rounded-[2.8rem] border border-white/10 bg-white/[0.035] p-7 md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
            {t.badge}
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight md:text-8xl">
            {t.title}
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-8 text-zinc-400">
            {t.text}
          </p>

          <a
            href="/membership"
            className="mt-10 inline-flex rounded-full border border-white/10 px-7 py-4 font-black text-white transition hover:bg-white hover:text-black"
          >
            {t.changePlan}
          </a>
        </div>

        <div className="rounded-[2.8rem] border border-white/10 bg-white p-6 text-black">
          <div className="rounded-[2.2rem] bg-[#080808] p-6 text-white">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
              {t.selectedPlan}
            </p>

            <div className="mt-6 flex items-end justify-between gap-5">
              <div>
                <h2 className="text-4xl font-black">{plan.name}</h2>
                <p className="mt-2 font-bold text-zinc-500">{plan.duration}</p>
              </div>

              <div className="text-right">
                <p className="font-black text-zinc-600 line-through">
                  {plan.oldPrice}
                </p>
                <p className="text-4xl font-black">{plan.price}</p>
              </div>
            </div>

            <p className="mt-6 leading-7 text-zinc-400">{plan.note}</p>
          </div>

          {paymentsDisabled ? (
            <div className="mt-6 rounded-[2rem] bg-zinc-100 p-6 text-center font-black text-zinc-600">
              Stripe payments are currently disabled.
            </div>
          ) : (
          <form action={startCheckout} className="mt-6 space-y-4">
            <input type="hidden" name="plan" value={plan.id} />

            <input
              name="full_name"
              type="text"
              required
              placeholder={t.name}
              className="w-full rounded-2xl border border-black/10 bg-zinc-100 px-5 py-4 font-bold text-black outline-none placeholder:text-zinc-500 focus:border-black/30"
            />

            <input
              name="email"
              type="email"
              required
              placeholder={t.email}
              className="w-full rounded-2xl border border-black/10 bg-zinc-100 px-5 py-4 font-bold text-black outline-none placeholder:text-zinc-500 focus:border-black/30"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-black px-8 py-5 font-black text-white transition hover:scale-[1.02]"
            >
              {t.button}
            </button>
          </form>
          )}

          <p className="mt-5 text-center text-xs font-bold text-zinc-500">
            {t.stripe}
          </p>
        </div>
      </section>
    </main>
  );
}
