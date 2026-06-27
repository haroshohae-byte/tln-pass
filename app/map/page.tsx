import Link from "next/link";

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.6rem] bg-[#1d1d1f] text-white">
          <div className="grid min-h-[560px] lg:grid-cols-[1fr_420px]">
            <div className="relative grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(135deg,#111827,#050505)] p-8">
              <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-2xl">
                <div className="grid aspect-[4/3] place-items-center rounded-[1.5rem] border border-white/10 bg-black/30">
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-white/40">
                      Map foundation
                    </p>
                    <h1 className="mt-4 text-5xl font-black tracking-tight">
                      Interactive map coming later.
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <aside className="flex flex-col justify-center p-7 md:p-9">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
                Hidden during beta
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Use the partner guide for launch.
              </h2>
              <p className="mt-4 leading-7 text-white/60">
                The map route is kept for future development, but it is not shown
                in public navigation until the full map experience is ready.
              </p>
              <Link
                href="/partners"
                className="mt-8 w-fit rounded-full bg-white px-7 py-4 font-black text-black transition hover:-translate-y-0.5"
              >
                Open partners
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
