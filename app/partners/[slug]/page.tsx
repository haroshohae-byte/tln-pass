import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { normalizeLang, type Lang } from "../../../lib/i18n";
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
};

const text = {
  en: {
    back: "Back to partners",
    benefit: "Member benefit",
    how: "How to use your pass",
    defaultHow:
      "Show your dynamic TLN Pass QR before paying. The partner will verify your active membership and apply the available member benefit.",
    info: "Info",
    address: "Address",
    hours: "Hours",
    phone: "Phone",
    website: "Website",
    instagram: "Instagram",
    menu: "Member menu",
    noMenu: "Menu is not available yet.",
    join: "Join TLN Pass",
  },
  ru: {
    back: "Назад к партнёрам",
    benefit: "Привилегия участника",
    how: "Как использовать pass",
    defaultHow:
      "Покажи динамический QR TLN Pass перед оплатой. Партнёр проверит активную подписку и применит доступную привилегию.",
    info: "Информация",
    address: "Адрес",
    hours: "Часы",
    phone: "Телефон",
    website: "Сайт",
    instagram: "Instagram",
    menu: "Меню для участников",
    noMenu: "Меню пока недоступно.",
    join: "Купить TLN Pass",
  },
  ee: {
    back: "Tagasi partnerite juurde",
    benefit: "Liikme eelis",
    how: "Kuidas passi kasutada",
    defaultHow:
      "Näita dünaamilist TLN Pass QR-koodi enne maksmist. Partner kontrollib aktiivset liikmesust ja rakendab liikme eelise.",
    info: "Info",
    address: "Aadress",
    hours: "Lahtiolekuajad",
    phone: "Telefon",
    website: "Veebileht",
    instagram: "Instagram",
    menu: "Liikme menüü",
    noMenu: "Menüü ei ole veel saadaval.",
    join: "Liitu TLN Passiga",
  },
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

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = text[lang as Lang];

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

  const items = (menuItems || []) as MenuItem[];

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-10 text-[#1d1d1f]">
      <section className="mx-auto max-w-7xl">
        <a
          href="/partners"
          className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-sm ring-1 ring-black/5"
        >
          ← {t.back}
        </a>

        <div className="mt-6 overflow-hidden rounded-[2.8rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="relative min-h-[520px] bg-black">
            {partner.image_url ? (
              <img
                src={partner.image_url}
                alt={partner.business_name}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-700" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">
              <p className="mb-4 w-fit rounded-full bg-white/15 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] backdrop-blur-2xl">
                {partner.category}
              </p>

              <h1 className="max-w-5xl text-6xl font-black leading-tight tracking-tight md:text-8xl">
                {partner.business_name}
              </h1>

              {partner.offer && (
                <p className="mt-6 w-fit rounded-full bg-white px-6 py-4 font-black text-black">
                  {partner.offer}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_380px]">
            <div>
              {partner.description && (
                <p className="text-xl leading-9 text-zinc-600">
                  {partner.description}
                </p>
              )}

              <div className="mt-6 rounded-[2rem] bg-zinc-100 p-6">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
                  {t.how}
                </p>

                <p className="mt-4 text-lg leading-8 text-zinc-700">
                  {partner.rules || t.defaultHow}
                </p>
              </div>
            </div>

            <aside className="rounded-[2rem] bg-zinc-100 p-6">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
                {t.info}
              </p>

              <div className="mt-5 grid gap-3">
                {partner.address && <Info label={t.address} value={partner.address} />}
                {partner.opening_hours && <Info label={t.hours} value={partner.opening_hours} />}
                {partner.phone && <Info label={t.phone} value={partner.phone} />}

                <div className="flex flex-wrap gap-3 pt-2">
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      className="rounded-full bg-black px-5 py-3 text-sm font-black text-white"
                    >
                      {t.website}
                    </a>
                  )}

                  {partner.instagram && (
                    <a
                      href={partner.instagram}
                      target="_blank"
                      className="rounded-full bg-black px-5 py-3 text-sm font-black text-white"
                    >
                      {t.instagram}
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

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

            <a
              href="/membership"
              className="rounded-full bg-black px-7 py-4 text-center font-black text-white transition hover:scale-105"
            >
              {t.join}
            </a>
          </div>

          {items.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const discount = formatDiscount(item);

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[2.2rem] bg-white shadow-sm ring-1 ring-black/5"
                  >
                    <div className="relative h-56 bg-black">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-zinc-900 to-zinc-700" />
                      )}

                      {discount && (
                        <p className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                          {discount}
                        </p>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-black">{item.name}</h3>

                        <div className="text-right">
                          {item.old_price && (
                            <p className="text-sm font-black text-zinc-400 line-through">
                              {formatEuro(item.old_price)}
                            </p>
                          )}

                          {item.price && (
                            <p className="text-xl font-black">
                              {formatEuro(item.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-4 leading-7 text-zinc-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[2.4rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
              <h3 className="text-4xl font-black">{t.noMenu}</h3>
            </div>
          )}
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
