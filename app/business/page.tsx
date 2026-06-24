const benefits = [
  {
    title: "New local customers",
    text: "Get discovered by people actively looking for places to visit in Tallinn.",
  },
  {
    title: "No delivery model",
    text: "Members visit your location directly, order on-site and pay normally.",
  },
  {
    title: "Controlled offers",
    text: "You decide what offer to provide, when it works and how members use it.",
  },
  {
    title: "Premium positioning",
    text: "TLN Pass is built to feel clean, selective and trustworthy — not cheap.",
  },
];

const process = [
  "Submit partner request",
  "We review your business",
  "You choose your offer",
  "Your card goes live",
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              For businesses
            </p>

            <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
              Bring TLN Pass members to your place.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
              TLN Pass helps restaurants, cafes, entertainment venues and local
              businesses become part of a premium Tallinn membership network.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105"
              >
                Apply as Partner
              </a>

              <a
                href="/partners"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10"
              >
                View Partner Page
              </a>
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="rounded-[2rem] bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 p-8 text-black">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/60">
                Partner card preview
              </p>

              <h2 className="mt-8 text-4xl font-black">
                Your business, offer and rules.
              </h2>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl bg-black/10 p-5">
                  <p className="text-sm font-bold text-black/60">Offer</p>
                  <p className="mt-1 text-2xl font-black">−20% for members</p>
                </div>

                <div className="rounded-2xl bg-black/10 p-5">
                  <p className="text-sm font-bold text-black/60">Category</p>
                  <p className="mt-1 text-2xl font-black">Restaurant</p>
                </div>

                <div className="rounded-2xl bg-black/10 p-5">
                  <p className="text-sm font-bold text-black/60">Status</p>
                  <p className="mt-1 text-2xl font-black">Pending approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <h3 className="text-2xl font-black">{benefit.title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-10 md:p-14">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Partnership process
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-6xl">
            Simple now. More powerful later.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {process.map((item, index) => (
              <div
                key={item}
                className="rounded-[2rem] border border-white/10 bg-black/30 p-6"
              >
                <p className="text-4xl font-black text-zinc-700">
                  0{index + 1}
                </p>
                <h3 className="mt-8 text-xl font-black">{item}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-black md:text-6xl">
            Apply to become one of the first TLN Pass partners.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Later, approved partners will get access to manage their restaurant
            card through the admin system.
          </p>

          <a
            href="/contact"
            className="mt-10 inline-flex rounded-full bg-white px-10 py-5 font-black text-black transition hover:scale-105"
          >
            Send Partner Request
          </a>
        </div>
      </section>
    </main>
  );
}
