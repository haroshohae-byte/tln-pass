import { supabaseAdmin } from "../../lib/supabaseAdmin";

type Partner = {
  id: string;
  business_name: string;
  category: string;
  address: string | null;
  offer: string | null;
  description: string | null;
  image_url: string | null;
  status: string;
};

const categories = [
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
          Selected Tallinn partners.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          Approved restaurants, cafes and local businesses will appear here
          after your confirmation in the admin panel.
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
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {approvedPartners.map((partner) => (
              <div
                key={partner.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div className="h-56 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black" />

                <div className="p-6">
                  <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300">
                    {partner.offer || "Member offer"}
                  </div>

                  <h2 className="text-2xl font-black">
                    {partner.business_name}
                  </h2>

                  <p className="mt-2 text-sm font-bold text-zinc-500">
                    {partner.category}
                  </p>

                  {partner.address && (
                    <p className="mt-2 text-sm text-zinc-600">
                      {partner.address}
                    </p>
                  )}

                  <p className="mt-4 leading-7 text-zinc-400">
                    {partner.description ||
                      "Approved TLN Pass partner in Tallinn."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {categories.map((category, index) => (
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
