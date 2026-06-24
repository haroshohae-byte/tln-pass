export default function PartnerDashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Partner dashboard
        </p>

        <h1 className="mt-4 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
          Manage your TLN Pass card.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          Approved partners will later be able to update their business card,
          offer, description and opening details here.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-4xl font-black">Edit card</h2>

            <form className="mt-8 space-y-5">
              <input
                type="text"
                defaultValue="Nordic Grill"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
              />

              <input
                type="text"
                defaultValue="Restaurant"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
              />

              <input
                type="text"
                defaultValue="−20% on weekdays"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
              />

              <textarea
                rows={6}
                defaultValue="Premium restaurant in Tallinn with selected member offers for TLN Pass users."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
              />

              <button
                type="button"
                className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02]"
              >
                Save changes
              </button>
            </form>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-4xl font-black">Preview</h2>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
              <div className="h-64 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black" />

              <div className="p-6">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300">
                  −20%
                </div>

                <h3 className="text-3xl font-black">Nordic Grill</h3>
                <p className="mt-2 text-zinc-500">Restaurant</p>
                <p className="mt-5 leading-7 text-zinc-400">
                  Premium restaurant in Tallinn with selected member offers for
                  TLN Pass users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
