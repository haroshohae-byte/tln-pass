export default function ApplySuccessPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 text-4xl text-emerald-300">
          ✓
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Application sent
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
          We received your request.
        </h1>

        <p className="mt-8 text-xl leading-8 text-zinc-400">
          Your partner application was saved. TLN Pass will review the business
          details before approval.
        </p>

        <a
          href="/"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
        >
          Back to home
        </a>
      </section>
    </main>
  );
}
