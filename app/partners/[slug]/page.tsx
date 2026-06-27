import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dictionary, normalizeLang } from "../../../lib/i18n";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import PartnerActionLink from "../../components/PartnerActionLink";
import PartnerViewTracker from "../../components/PartnerViewTracker";

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
  description: string | null;
  rules: string | null;
  image_url: string | null;
  status: string;
};

type MenuItem = {
  id: string;
  partner_id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | string | null;
  old_price: number | string | null;
  discount_type: string | null;
  discount_value: number | string | null;
  discount_custom: string | null;
  image_url: string | null;
  is_available: boolean | null;
  is_active?: boolean | null;
};

type PartnerPromotion = {
  id: string;
  partner_id: string;
  title: string;
  description: string | null;
  promotion_type: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function formatEuro(value: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "";
  }

  return `${numberValue % 1 === 0 ? numberValue.toFixed(0) : numberValue.toFixed(2)}€`;
}

function formatDiscount(item: MenuItem) {
  const type = item.discount_type || "none";
  const value = item.discount_value;

  if (type === "percent" && value !== null && value !== "") {
    return `-${Number(value)}%`;
  }

  if (type === "euro" && value !== null && value !== "") {
    return `-${Number(value)}€`;
  }

  if (type === "custom" && item.discount_custom) {
    return item.discount_custom;
  }

  return "";
}

function normalizeExternalUrl(value: string | null) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function instagramUrl(value: string | null) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://instagram.com/${value.replace(/^@/, "")}`;
}

function mapUrl(address: string | null) {
  if (!address) {
    return "";
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

async function getPartner(slug: string) {
  const { data: bySlug, error: slugError } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (slugError) {
    throw new Error(slugError.message);
  }

  if (bySlug) {
    return bySlug as Partner;
  }

  if (!isUuid(slug)) {
    return null;
  }

  const { data: byId, error: idError } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("id", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (idError) {
    throw new Error(idError.message);
  }

  return byId as Partner | null;
}

async function safeSelect<T>(
  table: string,
  query: (
    builder: ReturnType<typeof supabaseAdmin.from>
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  fallback: T
): Promise<T> {
  try {
    const result = await query(supabaseAdmin.from(table));

    if (result.error) {
      return fallback;
    }

    return result.data as T;
  } catch {
    return fallback;
  }
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].partnerDetail;

  const { slug } = await params;
  const partner = await getPartner(slug);

  if (!partner) {
    notFound();
  }

  const { data: menuItems, error: menuError } = await supabaseAdmin
    .from("partner_menu_items")
    .select("*")
    .eq("partner_id", partner.id)
    .eq("is_available", true)
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  if (menuError) {
    throw new Error(menuError.message);
  }

  const items = ((menuItems || []) as MenuItem[]).filter(
    (item) => item.is_available !== false && item.is_active !== false
  );
  const promotions = await safeSelect<PartnerPromotion[]>(
    "partner_promotions",
    (q) =>
      q
        .select("*")
        .eq("partner_id", partner.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4),
    []
  );
  const menuGroups = Array.from(
    items.reduce((groups, item) => {
      const category = item.category || t.specials;
      groups.set(category, [...(groups.get(category) || []), item]);
      return groups;
    }, new Map<string, MenuItem[]>())
  );
  const websiteUrl = normalizeExternalUrl(partner.website);
  const partnerInstagramUrl = instagramUrl(partner.instagram);
  const partnerMapUrl = mapUrl(partner.address);

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 text-[#1d1d1f]">
      <PartnerViewTracker partnerId={partner.id} />
      <section className="mx-auto max-w-7xl">
        <Link
          href="/partners"
          className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5"
        >
          {t.back}
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="relative min-h-[320px] bg-black md:min-h-[430px]">
            {partner.image_url ? (
              <img
                src={partner.image_url}
                alt={partner.business_name}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-700" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-8">
              <p className="mb-3 w-fit rounded-full bg-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-2xl">
                {partner.category}
              </p>

              <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-7xl">
                {partner.business_name}
              </h1>

              {partner.offer && (
                <p className="mt-5 w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-black md:text-base">
                  {partner.offer}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {partner.address && (
                  <Info label={t.address} value={partner.address} />
                )}
                {partner.opening_hours && (
                  <Info label={t.hours} value={partner.opening_hours} />
                )}
              </div>

              {partner.description && (
                <p className="text-lg leading-8 text-zinc-600">
                  {partner.description}
                </p>
              )}
            </div>

            <aside className="rounded-[1.6rem] bg-zinc-100 p-5">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
                {t.benefit}
              </p>

              <p className="mt-4 text-2xl font-black leading-tight">
                {partner.offer || t.fallbackBenefit}
              </p>

              <div className="mt-5 grid gap-3">
                <PartnerActionLink
                  href="/membership"
                  partnerId={partner.id}
                  eventType="get_pass_click"
                  className="rounded-full bg-black px-5 py-4 text-center text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  {t.join}
                </PartnerActionLink>

                {partnerMapUrl && (
                  <PartnerActionLink
                    href={partnerMapUrl}
                    external
                    partnerId={partner.id}
                    eventType="maps_click"
                    className="rounded-full bg-white px-5 py-4 text-center text-sm font-black text-black"
                  >
                    {t.maps}
                  </PartnerActionLink>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {partnerInstagramUrl && (
                    <PartnerActionLink
                      href={partnerInstagramUrl}
                      external
                      partnerId={partner.id}
                      eventType="instagram_click"
                      className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black"
                    >
                      {t.instagram}
                    </PartnerActionLink>
                  )}

                  {websiteUrl && (
                    <PartnerActionLink
                      href={websiteUrl}
                      external
                      partnerId={partner.id}
                      eventType="website_click"
                      className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black"
                    >
                      {t.website}
                    </PartnerActionLink>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {promotions.length > 0 && (
          <section className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
              TLN Pass
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">
              {t.promotions}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {promotions.map((promotion) => (
                <article
                  key={promotion.id}
                  className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-black/5"
                >
                  <p className="mb-4 w-fit rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    {promotion.promotion_type.replaceAll("_", " ")}
                  </p>
                  <h3 className="text-3xl font-black">{promotion.title}</h3>
                  {promotion.description && (
                    <p className="mt-3 leading-7 text-zinc-600">
                      {promotion.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                TLN Pass
              </p>

              <h2 className="mt-3 text-5xl font-black tracking-tight">
                {t.menu}
              </h2>
            </div>
          </div>

          {items.length > 0 ? (
            <>
              <div className="sticky top-20 z-20 mt-6 flex gap-2 overflow-x-auto rounded-full bg-white p-2 shadow-sm ring-1 ring-black/5">
                {menuGroups.map(([category]) => (
                  <a
                    key={category}
                    href={`#menu-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="min-w-max rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-zinc-700"
                  >
                    {category}
                  </a>
                ))}
              </div>

              <div className="mt-6 grid gap-8">
                {menuGroups.map(([category, groupItems]) => (
                  <section
                    key={category}
                    id={`menu-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="scroll-mt-36"
                  >
                    <h3 className="mb-4 text-3xl font-black">{category}</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      {groupItems.map((item) => {
                        const discount = formatDiscount(item);

                        return (
                          <div
                            key={item.id}
                            className="grid grid-cols-[112px_1fr] overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-black/5 sm:grid-cols-[150px_1fr]"
                          >
                            <div className="relative min-h-[132px] bg-black">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-700" />
                              )}

                              {discount && (
                                <p className="absolute left-2 top-2 rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                                  {discount}
                                </p>
                              )}
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="text-xl font-black leading-tight">
                                  {item.name}
                                </h4>

                                <div className="shrink-0 text-right">
                                  {item.old_price && (
                                    <p className="text-xs font-black text-zinc-400 line-through">
                                      {formatEuro(item.old_price)}
                                    </p>
                                  )}

                                  {item.price && (
                                    <p className="text-lg font-black">
                                      {formatEuro(item.price)}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {item.description && (
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-[2.4rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
              <h3 className="text-4xl font-black">{t.noMenu}</h3>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-600">
                {t.noMenuText}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
              {t.how}
            </p>
            <div className="mt-4 grid gap-3">
              {[t.step1, t.step2, partner.rules || t.step3].map(
                (step, index) => (
                  <div key={step} className="rounded-2xl bg-zinc-100 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                      {t.stepLabel} {index + 1}
                    </p>
                    <p className="mt-2 font-bold leading-7 text-zinc-700">
                      {step}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
              {t.info}
            </p>
            <div className="mt-4 grid gap-3">
              {partner.phone && <Info label={t.phone} value={partner.phone} />}
              {partner.address && (
                <Info label={t.address} value={partner.address} />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
        {label}
      </p>

      <p className="mt-2 font-bold leading-6 text-zinc-800">{value}</p>
    </div>
  );
}
