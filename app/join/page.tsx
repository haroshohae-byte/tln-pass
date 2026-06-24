import { redirect } from "next/navigation";
import { stripe } from "../../lib/stripe";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

async function startCheckout(formData: FormData) {
  "use server";

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const priceId = process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    throw new Error("Missing STRIPE_PRICE_ID");
  }

  if (!fullName || !email) {
    throw new Error("Name and email are required");
  }

  const baseUrl = getBaseUrl();

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
    cancel_url: `${baseUrl}/join?canceled=1`,
    metadata: {
      full_name: fullName,
      email,
    },
    subscription_data: {
      metadata: {
        full_name: fullName,
        email,
      },
    },
  });

  if (!session.url) {
    throw new Error("Stripe Checkout URL was not created");
  }

  redirect(session.url);
}

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-300">
            15€ / month · cancel anytime
          </div>

          <h1 className="mt-8 text-6xl font-black tracking-tight md:text-8xl">
            Join TLN Pass.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            One membership for selected Tallinn restaurants, cafes and local
            experiences. Pay once per month and unlock partner benefits with a
            secure dynamic QR pass.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["Dynamic QR", "Partner offers", "Monthly access"].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="font-black">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-4xl font-black">Start membership</h2>

          <p className="mt-4 text-zinc-400">
            You will be redirected to Stripe Checkout. In test mode, use Stripe
            test card details.
          </p>

          <form action={startCheckout} className="mt-8 space-y-5">
            <input
              name="full_name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02]"
            >
              Join now — 15€/month
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-zinc-600">
            Test mode now. Real payments later after Stripe live activation.
          </p>
        </div>
      </section>
    </main>
  );
}
