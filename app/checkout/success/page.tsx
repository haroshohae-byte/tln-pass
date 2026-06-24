import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type MemberPass = {
  id: string;
  pass_code: string;
};

function createPassCode() {
  return `TLN-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 16)
    .toUpperCase()}`;
}

async function getSafeBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    .replace(/\/$/, "");

  if (!host || host.startsWith("0.0.0.0")) {
    return envUrl;
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

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const baseUrl = await getSafeBaseUrl();

  if (!session_id) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-6xl font-black md:text-8xl">
            Missing session.
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-400">
            We could not find your Stripe Checkout session.
          </p>

          <a
            href="/join"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
          >
            Back to join
          </a>
        </section>
      </main>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-red-500 text-5xl font-black text-white">
            ×
          </div>

          <h1 className="mt-8 text-6xl font-black md:text-8xl">
            Payment not completed.
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-400">
            Stripe did not confirm this payment as paid.
          </p>

          <a
            href="/join"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
          >
            Try again
          </a>
        </section>
      </main>
    );
  }

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  const customerId =
    typeof session.customer === "string" ? session.customer : null;

  const fullName =
    session.metadata?.full_name ||
    session.customer_details?.name ||
    "TLN Member";

  const email =
    session.metadata?.email ||
    session.customer_details?.email ||
    session.customer_email ||
    "";

  let validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionPeriod = subscription as unknown as {
      current_period_end?: number;
    };

    if (subscriptionPeriod.current_period_end) {
      validUntil = new Date(subscriptionPeriod.current_period_end * 1000);
    }
  }

  let passCode = "";

  if (subscriptionId) {
    const { data: existingPass } = await supabaseAdmin
      .from("member_passes")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();

    if (existingPass) {
      passCode = (existingPass as MemberPass).pass_code;
    }
  }

  if (!passCode) {
    const newPassCode = createPassCode();

    const { data: createdPass, error } = await supabaseAdmin
      .from("member_passes")
      .insert({
        full_name: fullName,
        email,
        pass_code: newPassCode,
        plan: "TLN Pass Monthly",
        status: "active",
        valid_until: validUntil.toISOString(),
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    passCode = (createdPass as MemberPass).pass_code;
  }

  const accountStartUrl = `${baseUrl}/account/start/${passCode}`;

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-4xl text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-emerald-400 text-5xl font-black text-black">
          ✓
        </div>

        <p className="mt-10 text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Membership active
        </p>

        <h1 className="mt-4 text-6xl font-black md:text-8xl">
          Welcome to TLN Pass.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          Your account is ready. Open your secure member account on this
          device. The dynamic QR will be locked to the first device that opens
          it.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 text-left">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
            Next step
          </p>

          <h2 className="mt-4 text-3xl font-black">Activate your device</h2>

          <p className="mt-4 leading-7 text-zinc-400">
            For screenshot protection, your TLN Pass will be connected to this
            device. After that, your dynamic QR will refresh automatically and
            old QR screenshots will expire.
          </p>
        </div>

        <a
          href={accountStartUrl}
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
        >
          Open my TLN Pass
        </a>
      </section>
    </main>
  );
}
