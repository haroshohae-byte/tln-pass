const categories = [
  "Restaurants",
  "Cafes",
  "Entertainment",
  "Fitness",
  "Beauty",
  "Events",
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Partner network
        </p>

        <h1 className="mt-4 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
          Selected Tallinn partners are coming soon.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          We are building the first TLN Pass partner network. Real partner cards
          will be added after restaurants and local businesses are approved.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="/membership"
            className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105"
          >
            Join waitlist
          </a>

          <a
            href="/business"
            className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10"
          >
            Apply as partner
          </a>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7"
            >
              <p className="text-sm font-black text-zinc-600">
                0{index + 1}
              </p>
              <h2 className="mt-10 text-3xl font-black">{category}</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Partner cards will appear here after approval.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[3rem] border border-white/10 bg-white p-10 text-black md:p-14">
          <h2 className="text-4xl font-black md:text-6xl">
            Want your business here?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
            Restaurants, cafes and local businesses can apply to join TLN Pass.
            Approved partners will later be able to manage their own card.
          </p>

          <a
            href="/business"
            className="mt-10 inline-flex rounded-full bg-black px-8 py-4 font-black text-white transition hover:scale-105"
          >
            Become a Partner
          </a>
        </div>
      </section>
    </main>
  );
}
