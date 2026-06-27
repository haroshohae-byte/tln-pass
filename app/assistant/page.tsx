import Link from "next/link";

const suggestions = [
  "Dinner with a member offer",
  "Coffee near the old town",
  "Beauty and wellness day",
  "Weekend drinks",
];

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2.6rem] bg-black p-8 text-white md:p-14">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
            TLN Assistant
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            A smarter way to choose where to use your pass.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/65">
            This route is ready for the future AI recommendation layer. For now,
            members can jump back into the partner guide.
          </p>
          <Link
            href="/partners"
            className="mt-9 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:-translate-y-0.5"
          >
            Explore partners
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {suggestions.map((item) => (
            <div key={item} className="premium-card hover-lift p-7">
              <p className="text-2xl font-black">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
