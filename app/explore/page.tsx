import Link from "next/link";

const futureBlocks = [
  "Curated city collections",
  "Best new partner drops",
  "Weekend plans",
  "Member-only routes",
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2.6rem] bg-[#1d1d1f] p-8 text-white md:p-14">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
            Explore foundation
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Curated Tallinn collections are coming later.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/65">
            This page is intentionally hidden during beta. The live public guide
            is the partners directory.
          </p>
          <Link
            href="/partners"
            className="mt-9 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:-translate-y-0.5"
          >
            Open partners
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {futureBlocks.map((item) => (
            <div key={item} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-black/5">
              <p className="text-2xl font-black">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
