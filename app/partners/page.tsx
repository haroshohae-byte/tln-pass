import { supabaseAdmin } from "../../lib/supabaseAdmin";

type Partner = {
  id: string;
  slug: string | null;
  business_name: string;
  category: string;
  address: string | null;
  opening_hours: string | null;
  offer: string | null;
  description: string | null;
  image_url: string | null;
  status: string;
};

const emptyCategories = [
  "Restaurants",
  "Cafes",
  "Entertainment",
  "Fitness",
  "Beauty",
  "Events",
];

export default async function PartnersPage() {
  const { data: partners, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const approvedPartners = (partners || []) as Partner[];

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Partner network
        </p>

        <h1 className="mt-4 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
          Discover Tallinn.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          Open a partner card, explore the offer, check the menu and use your
          TLN Pass benefit on the spot.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="/waitlist"
            className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105"
          >
            Join waitlist
          </a>

          <a
            href="/apply"
            className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10"
          >
            Apply as partner
          </a>
        </div>

        {approvedPartners.length > 0 ? (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approvedPartners.map((partner) => {
              const partnerUrl = `/partners/${partner.slug || partner.id}`;

              return (
                <a
                  key={partner.id}
                  href={partnerUrl}
                  className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <div className="relative h-64 overflow-hidden bg-zinc-900">
                    {partner.image_url ? (
                      <img
                        src={partner.image_url}
                        alt={partner.business_name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-500 via-zinc-900 to-black" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                      {partner.category}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
                        {partner.offer || "TLN Pass offer"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-3xl font-black tracking-tight">
                      {partner.business_name}
                    </h2>

                    {partner.address && (
                      <p className="mt-3 text-sm text-zinc-500">
                        {partner.address}
                      </p>
                    )}

                    <p className="mt-5 line-clamp-3 leading-7 text-zinc-400">
                      {partner.description ||
                        "Approved TLN Pass partner in Tallinn."}
                    </p>

                    <div className="mt-7 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-white">
                          View partner
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          Offer, menu, details
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition group-hover:scale-105">
                        Open
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {emptyCategories.map((category, index) => (
                <div
                  key={category}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7"
                >
                  <p className="text-sm font-black text-zinc-600">
                    0{index + 1}
                  </p>
                  <h2 className="mt-10 text-3xl font-black">{category}</h2>
                  <p className="mt-4 leading-7 text-zinc-400">
                    Partner cards will appear here after approval.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-20 rounded-[3rem] border border-white/10 bg-white p-10 text-black md:p-14">
              <h2 className="text-4xl font-black md:text-6xl">
                Want your business here?
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
                Restaurants, cafes and local businesses can apply to join TLN
                Pass. Approved partners will appear on this page.
              </p>

              <a
                href="/apply"
                className="mt-10 inline-flex rounded-full bg-black px-8 py-4 font-black text-white transition hover:scale-105"
              >
                Become a Partner
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
