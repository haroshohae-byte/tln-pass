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
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            TLN Pass Membership
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            Choose your Tallinn pass.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            One membership for exclusive discounts, premium experiences and local offers across Tallinn.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2">
          {[
            ["Monthly", "€9.99", "/ month", "Best if you want to try TLN Pass and discover premium places in Tallinn.", false],
            ["Yearly", "€79.99", "/ year", "Best for members who want maximum value and regular savings across Tallinn.", true],
          ].map(([name, price, period, text, featured]) => (
            <div
              key={String(name)}
              className={`relative rounded-[2.5rem] p-8 ${
                featured
                  ? "border border-white/20 bg-white text-black"
                  : "border border-white/10 bg-white/[0.04] text-white"
              }`}
            >
              {featured && (
                <div className="absolute right-6 top-6 rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                  Best value
                </div>
              )}

              <p className={featured ? "text-zinc-600" : "text-zinc-400"}>{name}</p>

              <div className="mt-5 flex items-end gap-2">
                <p className="text-6xl font-black">{price}</p>
                <p className="pb-2 text-zinc-500">{period}</p>
              </div>

              <p className={featured ? "mt-6 text-zinc-600" : "mt-6 text-zinc-400"}>
                {text}
              </p>

              <a
                href="/contact"
                className={`mt-8 flex w-full justify-center rounded-full px-6 py-4 font-black transition ${
                  featured
                    ? "bg-black text-white hover:scale-105"
                    : "border border-white/15 text-white hover:bg-white hover:text-black"
                }`}
              >
                Join waitlist
              </a>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className={`flex gap-3 ${featured ? "text-zinc-700" : "text-zinc-300"}`}
                  >
                    <span className="font-black text-emerald-500">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
