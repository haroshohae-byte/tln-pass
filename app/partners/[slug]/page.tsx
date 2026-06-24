import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type Partner = {
  id: string;
  slug: string | null;
  business_name: string;
  category: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  opening_hours: string | null;
  offer: string | null;
  rules: string | null;
  description: string | null;
  image_url: string | null;
  status: string;
};

type MenuItem = {
  id: string;
  partner_id: string;
  name: string;
  category: string;
  description: string | null;
  price: string | null;
  discount_label: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let { data: partner } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (!partner) {
    const fallback = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("id", slug)
      .eq("status", "approved")
      .maybeSingle();

    partner = fallback.data;
  }

  if (!partner) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Partner
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            Not found.
          </h1>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            This partner page is not available.
          </p>

          <a
            href="/partners"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
          >
            Back to partners
          </a>
        </section>
      </main>
    );
  }

  const currentPartner = partner as Partner;

  const { data: menuItems } = await supabaseAdmin
    .from("partner_menu_items")
    .select("*")
    .eq("partner_id", currentPartner.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const items = (menuItems || []) as MenuItem[];

  const groupedMenu = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const group = item.category || "Menu";
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});

  const menuCategories = Object.keys(groupedMenu);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 pb-12 pt-24">
        {currentPartner.image_url && (
          <div className="absolute inset-0 opacity-30">
            <img
              src={currentPartner.image_url}
              alt={currentPartner.business_name}
              className="h-full w-full object-cover blur-sm"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/85 to-black" />

        <div className="relative mx-auto max-w-7xl">
          <a
            href="/partners"
            className="inline-flex rounded-full border border-white/10 bg-black/50 px-5 py-3 text-sm font-bold text-zinc-300 backdrop-blur-xl hover:bg-white hover:text-black"
          >
            ← Back to partners
          </a>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
                {currentPartner.category}
              </p>

              <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
                {currentPartner.business_name}
              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-300">
                {currentPartner.description ||
                  "Approved TLN Pass partner in Tallinn."}
              </p>

              <div className="mt-8 inline-flex rounded-full bg-emerald-400 px-5 py-3 text-lg font-black text-black">
                {currentPartner.offer || "Special offer for TLN Pass members"}
              </div>
            </div>

            <div className="overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              {currentPartner.image_url ? (
                <img
                  src={currentPartner.image_url}
                  alt={currentPartner.business_name}
                  className="h-80 w-full rounded-[2.2rem] object-cover"
                />
              ) : (
                <div className="h-80 rounded-[2.2rem] bg-gradient-to-br from-zinc-600 via-zinc-900 to-black" />
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {currentPartner.address && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="font-black text-white">Address</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {currentPartner.address}
                </p>
              </div>
            )}

            {currentPartner.opening_hours && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="font-black text-white">Hours</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {currentPartner.opening_hours}
                </p>
              </div>
            )}

            {currentPartner.phone && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="font-black text-white">Phone</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {currentPartner.phone}
                </p>
              </div>
            )}

            {currentPartner.rules && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="font-black text-white">Rules</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {currentPartner.rules}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {currentPartner.website && (
              <a
                href={currentPartner.website}
                target="_blank"
                className="rounded-full bg-white px-6 py-3 text-sm font-black text-black"
              >
                Website
              </a>
            )}

            {currentPartner.instagram && (
              <a
                href={currentPartner.instagram}
                target="_blank"
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white hover:text-black"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
                Menu
              </p>

              <h2 className="mt-4 text-5xl font-black md:text-7xl">
                Member menu.
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-zinc-400">
              Show QR before payment
            </div>
          </div>

          {menuCategories.length > 0 ? (
            <>
              <div className="sticky top-20 z-20 mb-10 flex gap-3 overflow-x-auto rounded-full border border-white/10 bg-black/75 p-3 backdrop-blur-xl">
                {menuCategories.map((category) => (
                  <a
                    key={category}
                    href={`#${categoryId(category)}`}
                    className="whitespace-nowrap rounded-full bg-white/[0.06] px-5 py-3 text-sm font-black text-white hover:bg-white hover:text-black"
                  >
                    {category}
                  </a>
                ))}
              </div>

              <div className="space-y-14">
                {menuCategories.map((category) => (
                  <div key={category} id={categoryId(category)}>
                    <h3 className="mb-6 text-4xl font-black">{category}</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      {groupedMenu[category].map((item) => (
                        <div
                          key={item.id}
                          className="group grid grid-cols-[1fr_120px] gap-4 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08] sm:grid-cols-[1fr_150px]"
                        >
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-xl font-black">
                                {item.name}
                              </h4>

                              {item.price && (
                                <p className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-black text-black">
                                  {item.price}
                                </p>
                              )}
                            </div>

                            {item.discount_label && (
                              <div className="mt-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300">
                                {item.discount_label}
                              </div>
                            )}

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                              {item.description ||
                                "Available for TLN Pass members."}
                            </p>
                          </div>

                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-32 w-full rounded-[1.3rem] object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="h-32 rounded-[1.3rem] bg-gradient-to-br from-zinc-700 via-zinc-900 to-black" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-10 text-center">
              <h3 className="text-4xl font-black">Menu coming soon.</h3>
              <p className="mt-4 text-zinc-400">
                This partner has not added menu items yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
