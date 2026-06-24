const applications = [
  {
    name: "Nordic Grill",
    category: "Restaurant",
    offer: "−20% on weekdays",
    status: "Pending",
  },
  {
    name: "Old Town Coffee",
    category: "Cafe",
    offer: "−15% on brunch",
    status: "Pending",
  },
  {
    name: "Sky Lounge",
    category: "Entertainment",
    offer: "−25% for members",
    status: "Approved",
  },
];

const stats = [
  ["Partner applications", "12"],
  ["Approved partners", "3"],
  ["Waitlist members", "148"],
  ["Pending review", "9"],
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Admin panel
            </p>

            <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
              TLN Pass control.
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-400">
              This is the future admin dashboard for managing applications,
              partners, offers and waitlist members.
            </p>
          </div>

          <a
            href="/apply"
            className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105"
          >
            View application form
          </a>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-4xl font-black">{value}</p>
              <p className="mt-2 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[3rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-black">Partner applications</h2>
              <p className="mt-2 text-zinc-500">
                Later this list will come from Supabase.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-black px-5 py-3 text-sm text-zinc-400">
              Prototype mode
            </div>
          </div>

          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.name}
                className="grid gap-4 rounded-[2rem] border border-white/10 bg-black/50 p-5 md:grid-cols-5 md:items-center"
              >
                <div className="md:col-span-2">
                  <p className="text-xl font-black">{application.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {application.category}
                  </p>
                </div>

                <div className="text-zinc-300">{application.offer}</div>

                <div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      application.status === "Approved"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="flex gap-2 md:justify-end">
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                    Approve
                  </button>
                  <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
