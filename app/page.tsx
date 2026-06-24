const categories = [
  {
    name: "Restaurants",
    icon: "🍽️",
    text: "Premium dining, burgers, sushi, steaks and local gems.",
  },
  {
    name: "Cafes",
    icon: "☕",
    text: "Coffee spots, bakeries, brunch places and dessert bars.",
  },
  {
    name: "Entertainment",
    icon: "🎮",
    text: "Activities, cinemas, karting, escape rooms and more.",
  },
  {
    name: "Fitness",
    icon: "💪",
    text: "Gyms, studios, recovery and wellness experiences.",
  },
  {
    name: "Beauty",
    icon: "✨",
    text: "Barbers, salons, nails, skincare and beauty services.",
  },
  {
    name: "Events",
    icon: "🎟️",
    text: "Special offers for concerts, parties and local events.",
  },
];

const partners = [
  { name: "Nordic Grill", type: "Restaurant", discount: "−25%" },
  { name: "Old Town Coffee", type: "Cafe", discount: "−20%" },
  { name: "Sky Lounge", type: "Entertainment", discount: "−30%" },
];

const steps = [
  {
    number: "01",
    title: "Get membership",
    text: "Choose a monthly or yearly TLN Pass membership.",
  },
  {
    number: "02",
    title: "Find a place",
    text: "Browse restaurants, cafes and entertainment partners.",
  },
  {
    number: "03",
    title: "Show QR code",
    text: "Open your digital pass and show it before payment.",
  },
  {
    number: "04",
    title: "Save instantly",
    text: "Receive your discount directly at the partner location.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute right-0 top-80 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[130px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
  <a href="/" className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-black">
      T
    </div>

    <div>
      <p className="text-lg font-bold tracking-tight">TLN Pass</p>
      <p className="text-xs text-zinc-500">Tallinn Membership Club</p>
    </div>
  </a>

  <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
    <a href="/partners" className="transition hover:text-white">
      Partners
    </a>

    <a href="#how" className="transition hover:text-white">
      How it works
    </a>

    <a href="/membership" className="transition hover:text-white">
      Membership
    </a>

    <a href="/business" className="transition hover:text-white">
      For business
    </a>

    <a href="/contact" className="transition hover:text-white">
      Contact
    </a>
  </nav>

  <a
    href="/membership"
    className="hidden rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-105 md:block"
  >
    Join now
  </a>

  <details className="relative md:hidden">
    <summary className="cursor-pointer list-none rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white">
      Menu
    </summary>

    <div className="absolute right-0 top-14 z-50 w-64 rounded-3xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-2">
        <a
          href="/partners"
          className="rounded-2xl px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          Partners
        </a>

        <a
          href="#how"
          className="rounded-2xl px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          How it works
        </a>

        <a
          href="/membership"
          className="rounded-2xl px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          Membership
        </a>

        <a
          href="/business"
          className="rounded-2xl px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          For business
        </a>

        <a
          href="/contact"
          className="rounded-2xl px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          Contact
        </a>

        <a
          href="/membership"
          className="mt-2 rounded-2xl bg-white px-4 py-3 text-center font-bold text-black"
        >
          Join now
        </a>
      </div>
    </div>
  </details>
</header>


      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Launching in Tallinn, Estonia
          </div>

          <h1 className="max-w-5xl text-6xl font-black tracking-tight text-white md:text-8xl">
            One pass.
            <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              The best of Tallinn.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            TLN Pass gives members exclusive discounts and premium perks in
            restaurants, cafes, entertainment venues and local businesses across
            Tallinn.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/membership"
              className="rounded-full bg-white px-8 py-4 text-center font-bold text-black transition hover:scale-105 hover:bg-zinc-200"
            >
              Get Membership
            </a>

            <a
              href="/business"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-bold text-white backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10"
            >
              Become a Partner
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-black">50+</p>
              <p className="mt-1 text-sm text-zinc-500">Partners</p>
            </div>

            <div>
              <p className="text-3xl font-black">5K+</p>
              <p className="mt-1 text-sm text-zinc-500">Members goal</p>
            </div>

            <div>
              <p className="text-3xl font-black">30%</p>
              <p className="mt-1 text-sm text-zinc-500">Max discount</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-amber-500/20 blur-3xl" />

          <div className="relative rounded-[3rem] border border-white/10 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[2.5rem] border border-white/10 bg-black p-5">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Digital Membership</p>
                  <p className="text-2xl font-black">TLN Pass</p>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black">
                  Active
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 p-6 text-black">
                <div className="flex justify-between">
                  <p className="text-sm font-bold uppercase tracking-widest">
                    Premium
                  </p>
                  <p className="text-sm font-bold">Tallinn</p>
                </div>

                <div className="mt-16">
                  <p className="text-3xl font-black">Member Card</p>
                  <p className="mt-2 text-sm text-black/60">
                    Valid across selected partners
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-2xl bg-white p-4">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        [0, 1, 2, 5, 10, 12, 14, 18, 20, 21, 22, 24].includes(
                          i
                        )
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
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Categories
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-6xl">
              Everything worth doing in Tallinn.
            </h2>
          </div>

          <p className="max-w-md text-zinc-400">
            From restaurants to entertainment — one membership gives access to
            premium local offers.
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
              <p className="mt-3 text-zinc-400">{category.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="partners" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Featured partners
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-6xl">
              Premium places. Real savings.
            </h2>
          </div>

          <a
            href="/partners"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
          >
            View all partners
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950"
            >
              <div className="h-56 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black" />

              <div className="p-6">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                  {partner.discount}
                </div>

                <h3 className="text-2xl font-black">{partner.name}</h3>
                <p className="mt-2 text-zinc-500">{partner.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            How it works
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-6xl">
            Simple. Fast. Premium.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
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

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Membership
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-6xl">
            Choose your pass.
          </h2>

          <p className="mt-5 text-zinc-400">
            Start saving around Tallinn with one digital membership.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <p className="text-zinc-400">Monthly</p>

            <div className="mt-4 flex items-end gap-2">
              <p className="text-6xl font-black">€9.99</p>
              <p className="pb-2 text-zinc-500">/ month</p>
            </div>

            <p className="mt-6 text-zinc-400">
              Perfect for trying TLN Pass and discovering new places.
            </p>

            <a
              href="/membership"
              className="mt-8 flex w-full justify-center rounded-full border border-white/15 px-6 py-4 font-bold transition hover:bg-white hover:text-black"
            >
              Start monthly
            </a>
          </div>

          <div className="relative rounded-[2rem] border border-white/20 bg-white p-8 text-black">
            <div className="absolute right-6 top-6 rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
              Best value
            </div>

            <p className="text-zinc-600">Yearly</p>

            <div className="mt-4 flex items-end gap-2">
              <p className="text-6xl font-black">€79.99</p>
              <p className="pb-2 text-zinc-500">/ year</p>
            </div>

            <p className="mt-6 text-zinc-600">
              Best for members who want maximum value across Tallinn.
            </p>

            <a
              href="/membership"
              className="mt-8 flex w-full justify-center rounded-full bg-black px-6 py-4 font-bold text-white transition hover:scale-105"
            >
              Get yearly pass
            </a>
          </div>
        </div>
      </section>

      <section id="business" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-10 backdrop-blur-2xl md:p-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              For partners
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-6xl">
              Grow your business with TLN Pass.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Restaurants, cafes and entertainment venues can join TLN Pass to
              attract new customers and fill quiet hours with members.
            </p>

            <a
              href="/business"
              className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-6 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-black">TLN Pass</p>
            <p className="mt-2 text-sm text-zinc-500">Tallinn, Estonia</p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <a href="/partners" className="hover:text-white">
              Partners
            </a>

            <a href="/membership" className="hover:text-white">
              Membership
            </a>

            <a href="/business" className="hover:text-white">
              For business
            </a>

            <a href="/contact" className="hover:text-white">
              Contact
            </a>

            <a href="mailto:hello@tlnpass.ee" className="hover:text-white">
              hello@tlnpass.ee
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

