export default function PartnerDashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Partner dashboard
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
          Private link required.
        </h1>

        <p className="mt-8 text-xl leading-8 text-zinc-400">
          Approved partners receive a private edit link from TLN Pass after
          their application is accepted.
        </p>

        <a
          href="/apply"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
        >
          Apply as partner
        </a>
      </section>
    </main>
  );
}

