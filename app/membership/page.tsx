const benefits = [
  "Exclusive discounts across Tallinn",
  "Digital TLN Pass member card",
  "QR code for partner locations",
  "Restaurants, cafes and entertainment",
  "Special member-only offers",
  "Cancel anytime",
];

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to home
        </a>

        <div className="mt-16 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            TLN Pass Membership
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            Choose your Tallinn pass.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            One membership for exclusive discounts, premium experiences and
            local offers across Tallinn.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <p className="text-zinc-400">Monthly</p>

            <div className="mt-5 flex items-end gap-2">
              <p className="text-6xl font-black">€9.99</p>
              <p className="pb-2 text-zinc-500">/ month</p>
            </div>

            <p className="mt-6 text-zinc-400">
              Best if you want to try TLN Pass and discover premium places in Tallinn.
            </p>

            <button className="mt-8 w-full rounded-full border border-white/15 px-6 py-4 font-bold transition hover:bg-white hover:text-black">
              Start monthly
            </button>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 text-zinc-300">
                  <span className="text-emerald-400">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white p-8 text-black">
            <div className="absolute right-6 top-6 rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
              Best value
            </div>

            <p className="text-zinc-600">Yearly</p>

            <div className="mt-5 flex items-end gap-2">
              <p className="text-6xl font-black">€79.99</p>
              <p className="pb-2 text-zinc-500">/ year</p>
            </div>

            <p className="mt-6 text-zinc-600">
              Best for members who want maximum value and regular savings across Tallinn.
            </p>

            <button className="mt-8 w-full rounded-full bg-black px-6 py-4 font-bold text-white transition hover:scale-105">
              Get yearly pass
            </button>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 text-zinc-700">
                  <span className="font-black text-emerald-600">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
          <h2 className="text-3xl font-black">How membership works</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-4xl font-black text-zinc-600">01</p>
              <h3 className="mt-4 font-bold">Choose plan</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Select monthly or yearly membership.
              </p>
            </div>

            <div>
              <p className="text-4xl font-black text-zinc-600">02</p>
              <h3 className="mt-4 font-bold">Get digital pass</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Receive your TLN Pass member card.
              </p>
            </div>

            <div>
              <p className="text-4xl font-black text-zinc-600">03</p>
              <h3 className="mt-4 font-bold">Show QR code</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Use it at partner locations before payment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
