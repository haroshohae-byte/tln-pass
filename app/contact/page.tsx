const contactOptions = [
  {
    title: "For members",
    text: "Questions about TLN Pass membership, discounts or how the QR pass works.",
    email: "members@tlnpass.ee",
  },
  {
    title: "For partners",
    text: "Restaurants, cafes, entertainment venues and local businesses that want to join.",
    email: "partners@tlnpass.ee",
  },
  {
    title: "General contact",
    text: "For media, collaboration, feedback or other questions about TLN Pass.",
    email: "hello@tlnpass.ee",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Contact TLN Pass
            </p>

            <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
              Let’s build the future of Tallinn experiences.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
              Contact us if you want to become a partner, join the membership waitlist or learn more about TLN Pass.
            </p>

            <div className="mt-10 space-y-5">
              {contactOptions.map((option) => (
                <div
                  key={option.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
                >
                  <h2 className="text-2xl font-black">{option.title}</h2>
                  <p className="mt-3 text-zinc-400">{option.text}</p>
                  <a
                    href={`mailto:${option.email}`}
                    className="mt-4 inline-flex text-sm font-black text-white hover:text-zinc-300"
                  >
                    {option.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="text-4xl font-black">Send a request</h2>
              <p className="mt-4 text-zinc-400">
                This form is a visual prototype. Later we will connect it to email, database or CRM.
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-400">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-400">
                  I am interested in
                </label>
                <select className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition focus:border-white/30">
                  <option>Membership</option>
                  <option>Becoming a partner</option>
                  <option>Collaboration</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-400">
                  Message
                </label>
                <textarea
                  placeholder="Tell us what you need..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
              >
                Send request
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
