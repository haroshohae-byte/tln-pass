export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Partner application
          </p>

          <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            Apply to join TLN Pass.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            Restaurants, cafes, entertainment venues and local businesses can
            apply to become part of the TLN Pass partner network.
          </p>

          <div className="mt-12 rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-black">How approval will work</h2>

            <div className="mt-8 space-y-5">
              {[
                "Business sends application",
                "TLN Pass reviews the place and offer",
                "Admin approves or rejects the application",
                "Approved partner gets access to manage their card",
              ].map((item, index) => (
                <div key={item} className="flex gap-4">
                  <p className="font-black text-zinc-600">0{index + 1}</p>
                  <p className="text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-4xl font-black">Business details</h2>
          <p className="mt-4 text-zinc-400">
            This form will later send data to your admin panel.
          </p>

          <form className="mt-8 space-y-5">
            <input
              type="text"
              placeholder="Business name"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              type="text"
              placeholder="Category: Restaurant, Cafe, Beauty..."
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              type="text"
              placeholder="Address in Tallinn"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              type="text"
              placeholder="Offer example: -20% on weekdays"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              type="email"
              placeholder="Contact email"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <textarea
              placeholder="Short description of your business"
              rows={6}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <button
              type="button"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              Send application
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
