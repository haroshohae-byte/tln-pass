const categories = [
  {
    name: "Restaurants",
    icon: "🍽️",
    text: "Member-only offers at selected restaurants and food spots.",
  },
  {
    name: "Cafes",
    icon: "☕",
    text: "Coffee, brunch, desserts and everyday local favourites.",
  },
  {
    name: "Entertainment",
    icon: "🎮",
    text: "Activities, experiences and nights out across Tallinn.",
  },
  {
    name: "Fitness",
    icon: "💪",
    text: "Gyms, recovery, wellness and active lifestyle partners.",
  },
  {
    name: "Beauty",
    icon: "✨",
    text: "Barbers, salons, grooming and beauty services.",
  },
  {
    name: "Events",
    icon: "🎟️",
    text: "Special access, drops and limited-time local offers.",
  },
];

const steps = [
  {
    number: "01",
    title: "Join TLN Pass",
    text: "Become a member and unlock your digital Tallinn pass.",
  },
  {
    number: "02",
    title: "Discover places",
    text: "Browse selected restaurants, cafes, activities and local partners.",
  },
  {
    number: "03",
    title: "Show your QR",
    text: "Open your digital member card and show it before payment.",
  },
  {
    number: "04",
    title: "Save instantly",
    text: "Receive your member offer directly at the location.",
  },
];

const faq = [
  {
    question: "Is TLN Pass already launched?",
    answer:
      "TLN Pass is currently in early launch mode. We are preparing the first partner network in Tallinn.",
  },
  {
    question: "Do I need an app?",
    answer:
      "At first, TLN Pass will work through a mobile-friendly website with a digital member card and QR code.",
  },
  {
    question: "Can restaurants join?",
    answer:
      "Yes. Restaurants, cafes, entertainment venues and local businesses can apply to become partners.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 noise" />
      <div className="pointer-events-none fixed inset-0">
        <div className="glow-pulse absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[150px]" />
        <div className="absolute right-[-120px] top-[360px] h-[460px] w-[460px] rounded-full bg-purple-500/20 blur-[140px]" />
        <div className="absolute bottom-[-120px] left-[-120px] h-[460px] w-[460px] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Early access · Tallinn, Estonia
          </div>

          <h1 className="max-w-5xl text-6xl font-black tracking-tight text-white md:text-8xl">
            Your private key
            <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              to Tallinn.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            TLN Pass is a premium membership for discovering selected
            restaurants, cafes, entertainment and local experiences across
            Tallinn — with exclusive member-only perks.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/membership"
              className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105 hover:bg-zinc-200"
            >
              Join waitlist
            </a>

            <a
              href="/business"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10"
            >
              Become a Partner
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-3xl font-black">30+</p>
              <p className="mt-1 text-sm text-zinc-500">Partner goal</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-3xl font-black">QR</p>
              <p className="mt-1 text-sm text-zinc-500">Member pass</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-3xl font-black">VIP</p>
              <p className="mt-1 text-sm text-zinc-500">Local perks</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-amber-500/20 blur-3xl" />

          <div className="float-slow relative rounded-[3.2rem] border border-white/10 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[2.7rem] border border-white/10 bg-black p-5">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Digital Membership</p>
                  <p className="text-3xl font-black">TLN Pass</p>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                  Active
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 p-6 text-black">
                <div className="flex justify-between">
                  <p className="text-sm font-black uppercase tracking-widest">
                    Premium
                  </p>
                  <p className="text-sm font-black">Tallinn</p>
                </div>

                <div className="mt-16">
                  <p className="text-4xl font-black">Member Card</p>
                  <p className="mt-2 text-sm text-black/60">
                    Valid at selected partners
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-2xl bg-white p-4">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        [0, 1, 2, 5, 10, 12, 14, 18, 20, 21, 22, 24].includes(i)
                          ? "bg-black"
                          : "bg-zinc-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-center text-sm text-zinc-400">
                  Show QR code before payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
                What it is
              </p>
              <h2 className="mt-4 text-4xl font-black">
                Not another discount page.
              </h2>
            </div>

            <div className="md:col-span-2">
              <p className="text-2xl leading-10 text-zinc-300">
                TLN Pass is designed as a curated city membership — clean,
                premium and selective. The value comes from strong local
                partners, simple QR use and a product that feels trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Categories
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">
              Built around how people actually spend time.
            </h2>
          </div>

          <p className="max-w-md text-zinc-400">
            The partner network will grow carefully. Quality first, quantity
            after.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <div className="mb-8 text-4xl">{category.icon}</div>
              <h3 className="text-2xl font-black">{category.name}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{category.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            How it works
          </p>

          <h2 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">
            Four steps. No friction.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <p className="text-sm font-black text-zinc-600">{step.number}</p>
              <h3 className="mt-8 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-10 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              For members
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">
              Discover Tallinn with benefits.
            </h2>
            <p className="mt-6 leading-8 text-zinc-400">
              Members get a digital card, QR access and selected offers from
              approved partners.
            </p>
            <a
              href="/membership"
              className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
            >
              Join waitlist
            </a>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/12 to-white/[0.03] p-10 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              For partners
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">
              Get seen by local customers.
            </h2>
            <p className="mt-6 leading-8 text-zinc-400">
              Restaurants and local businesses can apply to join the first TLN
              Pass partner network.
            </p>
            <a
              href="/business"
              className="mt-10 inline-flex rounded-full border border-white/15 bg-white/5 px-8 py-4 font-black text-white transition hover:bg-white hover:text-black"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[3rem] border border-white/10 bg-white p-10 text-black md:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-black/50">
                Early access
              </p>
              <h2 className="mt-4 text-4xl font-black md:text-6xl">
                Join before the first partner drop.
              </h2>
              <p className="mt-6 text-lg leading-8 text-black/60">
                We are building the first curated partner network in Tallinn.
                Join the waitlist or apply as a business partner.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <a
                href="/membership"
                className="rounded-full bg-black px-8 py-4 text-center font-black text-white transition hover:scale-105"
              >
                Join waitlist
              </a>
              <a
                href="/contact"
                className="rounded-full border border-black/10 px-8 py-4 text-center font-black text-black transition hover:bg-black hover:text-white"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            FAQ
          </p>
          <h2 className="mt-3 text-4xl font-black md:text-6xl">
            Clear answers.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {faq.map((item) => (
            <div
              key={item.question}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7"
            >
              <h3 className="text-xl font-black">{item.question}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
