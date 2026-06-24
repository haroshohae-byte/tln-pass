export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to home
        </a>

        <div className="mt-16">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            TLN Pass Partners
          </p>

          <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            Restaurants, cafes and experiences in Tallinn.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            Discover premium places where TLN Pass members receive exclusive
            discounts and special offers.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ["Nordic Grill", "Restaurant", "−25%"],
            ["Old Town Coffee", "Cafe", "−20%"],
            ["Sky Lounge", "Entertainment", "−30%"],
            ["Burger District", "Restaurant", "−15%"],
            ["Elite Barber", "Beauty", "−20%"],
            ["Active Studio", "Fitness", "−25%"],
          ].map(([name, type, discount]) => (
            <div
              key={name}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="mb-6 h-48 rounded-[1.5rem] bg-gradient-to-br from-zinc-700 via-zinc-900 to-black" />

              <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                {discount}
              </div>

              <h2 className="text-2xl font-black">{name}</h2>
              <p className="mt-2 text-zinc-500">{type}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
