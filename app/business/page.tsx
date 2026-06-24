const benefits = [
  {
    title: "Attract new customers",
    text: "TLN Pass helps restaurants, cafes and local businesses get discovered by members looking for new places in Tallinn.",
  },
  {
    title: "Fill quiet hours",
    text: "Create smart offers for slower days and hours without lowering your brand value.",
  },
  {
    title: "No delivery fees",
    text: "Members visit your location directly, order on-site and pay normally at your business.",
  },
  {
    title: "Premium audience",
    text: "Reach locals, students, young professionals and visitors who want better experiences in Tallinn.",
  },
];

const steps = [
  "Apply as a partner",
  "Choose your member offer",
  "Get listed on TLN Pass",
  "Start receiving members",
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to home
        </a>

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              For Restaurants & Businesses
            </p>

            <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
              Grow your business with TLN Pass.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
              Join Tallinn’s premium membership club and bring more customers to
              your restaurant, cafe, entertainment venue or local business.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full bg-white px-8 py-4 text-center font-bold text-black transition hover:scale-105"
              >
                Become a Partner
              </a>

              <a
                href="/partners"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-bold text-white transition hover:bg-white/10"
              >
                View Partners
              </a>
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="rounded-[2rem] bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 p-8 text-black">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/60">
                Partner Dashboard
              </p>

              <h2 className="mt-8 text-4xl font-black">
                Your offer, visible to TLN Pass members.
              </h2>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl bg-black/10 p-5">
                  <p className="text-sm font-bold text-black/60">Offer</p>
                  <p className="mt-1 text-2xl font-black">−20% on weekdays</p>
                </div>

                <div className="rounded-2xl bg-black/10 p-5">
                  <p className="text-sm font-bold text-black/60">Status</p>
                  <p className="mt-1 text-2xl font-black">Live on TLN Pass</p>
                </div>

                <div className="rounded-2xl bg-black/10 p-5">
                  <p className="text-sm font-bold text-black/60">Goal</p>
                  <p className="mt-1 text-2xl font-black">
                    More local customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Why join
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-6xl">
            Built for local Tallinn businesses.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
              >
                <h3 className="text-2xl font-black">{benefit.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-10 md:p-14">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            How partnership works
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-6xl">
            Simple setup. Clear value.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[2rem] border border-white/10 bg-black/30 p-6"
              >
                <p className="text-4xl font-black text-zinc-700">
                  0{index + 1}
                </p>
                <h3 className="mt-8 text-xl font-black">{step}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-black md:text-6xl">
            Want to become one of the first TLN Pass partners?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            We are looking for restaurants, cafes, entertainment venues, beauty
            salons and local businesses in Tallinn.
          </p>

          <a
            href="/contact"
            className="mt-10 inline-flex rounded-full bg-white px-10 py-5 font-bold text-black transition hover:scale-105"
          >
            Contact TLN Pass
          </a>
        </div>
      </section>
    </main>
  );
}
