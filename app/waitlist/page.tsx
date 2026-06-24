export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Member waitlist
          </p>

          <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            Be first inside TLN Pass.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            Join the early access list and get notified when TLN Pass launches
            with the first partner network in Tallinn.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-3xl font-black">Early</p>
              <p className="mt-2 text-sm text-zinc-500">Access</p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-3xl font-black">QR</p>
              <p className="mt-2 text-sm text-zinc-500">Digital pass</p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-3xl font-black">VIP</p>
              <p className="mt-2 text-sm text-zinc-500">Partner drops</p>
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-4xl font-black">Join waitlist</h2>
          <p className="mt-4 text-zinc-400">
            This form is ready visually. Next step: connect it to Supabase so
            entries are saved into your database.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                What are you interested in?
              </label>
              <select className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30">
                <option>Restaurants</option>
                <option>Cafes</option>
                <option>Entertainment</option>
                <option>Fitness</option>
                <option>Beauty</option>
                <option>Everything</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              Join waitlist
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
