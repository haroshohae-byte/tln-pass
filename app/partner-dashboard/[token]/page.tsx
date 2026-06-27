import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import CopyButton from "../../components/CopyButton";
import ImagePreviewInput from "../../components/ImagePreviewInput";
import { dictionary, launchCopy, normalizeLang, type Lang } from "../../../lib/i18n";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import DiscountFields from "./DiscountFields";

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
  edit_token: string;
};

type MenuItem = {
  id: string;
  partner_id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number | string | null;
  old_price: number | string | null;
  discount_type: string | null;
  discount_value: number | string | null;
  discount_custom: string | null;
  image_url: string | null;
  is_available: boolean | null;
  is_active?: boolean | null;
  sort_order?: number | null;
};

type PartnerPageView = {
  id: string;
  partner_id: string | null;
  created_at: string | null;
};

type PartnerClickEvent = {
  id: string;
  partner_id: string | null;
  event_type: string | null;
  created_at: string | null;
};

type UsageLog = {
  id: string;
  partner_id: string | null;
  status?: string | null;
  result?: string | null;
  user_agent?: string | null;
  created_at?: string | null;
};

type PartnerPromotion = {
  id: string;
  partner_id: string;
  title: string;
  description: string | null;
  promotion_type: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean | null;
  created_at?: string | null;
};

type PartnerDashboardCopy = (typeof launchCopy)[Lang]["partnerDashboard"];
type ImageInputCopy = (typeof launchCopy)[Lang]["imageInput"];

function copyValue<T extends Record<string, string>>(copy: T, key?: string | null) {
  if (!key) {
    return "";
  }

  return copy[key as keyof T] || key;
}

const partnerCategories = [
  "restaurants",
  "cafes",
  "bars",
  "fitness",
  "beauty",
  "entertainment",
  "events",
];
const menuCategories = ["breakfast", "main", "drinks", "desserts", "specials"];
const discountTypes = ["none", "percent", "euro", "custom"];
const promotionTypes = ["discount", "free_item", "member_price", "event", "custom"];
const maxImageSize = 4 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

function normalizeUrl(value: string) {
  if (!value) {
    return "";
  }

  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`;
  }

  return value;
}

function normalizeInstagram(value: string) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://instagram.com/${value.replace(/^@/, "")}`;
}

function isValidUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(normalizeUrl(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseMoney(value: string, field: string) {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    throw new Error(`${field} is required`);
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${field} must contain only numbers, for example 12 or 12.50`);
  }

  return Number(normalized);
}

function optionalMoney(value: string, field: string) {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${field} must contain only numbers`);
  }

  return Number(normalized);
}

function validateImage(file: File) {
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error("Images must be JPG, PNG or WebP");
  }

  if (file.size > maxImageSize) {
    throw new Error("Image must be under 4 MB");
  }
}

async function uploadImage(file: File, folder: string) {
  validateImage(file);

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("partner-images")
    .upload(filePath, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabaseAdmin.storage
    .from("partner-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function validateDiscount(formData: FormData) {
  const discountType = String(formData.get("discount_type") || "none");
  const rawValue = String(formData.get("discount_value") || "").trim();
  const custom = String(formData.get("discount_custom") || "").trim();

  if (!discountTypes.includes(discountType)) {
    throw new Error("Invalid discount type");
  }

  if (discountType === "none") {
    return {
      discount_type: "none",
      discount_value: null,
      discount_custom: null,
    };
  }

  if (discountType === "percent") {
    const value = parseMoney(rawValue, "Discount percent");

    if (value < 1 || value > 100) {
      throw new Error("Percent discount must be between 1 and 100");
    }

    return {
      discount_type: "percent",
      discount_value: value,
      discount_custom: null,
    };
  }

  if (discountType === "euro") {
    return {
      discount_type: "euro",
      discount_value: parseMoney(rawValue, "Euro discount"),
      discount_custom: null,
    };
  }

  if (!custom) {
    throw new Error("Custom discount text is required");
  }

  return {
    discount_type: "custom",
    discount_value: null,
    discount_custom: custom.slice(0, 80),
  };
}

async function getPartnerByToken(id: string, token: string) {
  const { data: partner, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("id", id)
    .eq("edit_token", token)
    .single();

  if (error || !partner) {
    throw new Error("Partner not found");
  }

  return partner as Partner;
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

async function updatePartnerCard(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const token = String(formData.get("token") || "");

  const partner = await getPartnerByToken(id, token);
  const business_name = String(formData.get("business_name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const opening_hours = String(formData.get("opening_hours") || "").trim();
  const offer = String(formData.get("offer") || "").trim();
  const rules = String(formData.get("rules") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!business_name) {
    throw new Error("Business name is required");
  }

  if (!partnerCategories.includes(category)) {
    throw new Error("Category must be selected from the list");
  }

  if (!address) {
    throw new Error("Address is required");
  }

  if (!offer) {
    throw new Error("Offer is required");
  }

  if (!isValidUrl(website)) {
    throw new Error("Website must be a valid link");
  }

  if (description.length > 420) {
    throw new Error("Description must be 420 characters or less");
  }

  let image_url = partner.image_url;
  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    image_url = await uploadImage(image, `partners/${id}`);
  }

  const { error } = await supabaseAdmin
    .from("partners")
    .update({
      business_name,
      category,
      address,
      phone: phone || null,
      website: website ? normalizeUrl(website) : null,
      instagram: instagram ? normalizeInstagram(instagram) : null,
      opening_hours: opening_hours || null,
      offer,
      rules: rules || null,
      description: description || null,
      image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("edit_token", token);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/partners");
  revalidatePath(`/partners/${partner.slug || id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=card`);
}

function menuPayload(formData: FormData, image_url: string | null) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "main").trim();
  const description = String(formData.get("description") || "").trim();
  const price = parseMoney(String(formData.get("price") || ""), "Price");
  const oldPrice = optionalMoney(String(formData.get("old_price") || ""), "Old price");
  const discount = validateDiscount(formData);

  if (!name) {
    throw new Error("Product name is required");
  }

  if (!menuCategories.includes(category)) {
    throw new Error("Menu category must be selected from the list");
  }

  if (oldPrice !== null && oldPrice <= price) {
    throw new Error("Old price must be higher than price");
  }

  if (description.length > 220) {
    throw new Error("Product description must be 220 characters or less");
  }

  return {
    name,
    category,
    description: description || null,
    price,
    old_price: oldPrice,
    ...discount,
    image_url,
  };
}

async function addMenuItem(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const partner = await getPartnerByToken(partner_id, token);

  let image_url: string | null = null;
  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    image_url = await uploadImage(image, `menu/${partner_id}`);
  }

  const { error } = await supabaseAdmin.from("partner_menu_items").insert({
    partner_id,
    ...menuPayload(formData, image_url),
    is_available: true,
    sort_order: 100,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/partners");
  revalidatePath(`/partners/${partner.slug || partner_id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=menu`);
}

async function updateMenuItem(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const item_id = String(formData.get("item_id") || "");
  const partner = await getPartnerByToken(partner_id, token);

  const { data: item, error: itemError } = await supabaseAdmin
    .from("partner_menu_items")
    .select("*")
    .eq("id", item_id)
    .eq("partner_id", partner_id)
    .single();

  if (itemError || !item) {
    throw new Error("Menu item not found");
  }

  let image_url = (item as MenuItem).image_url || null;
  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    image_url = await uploadImage(image, `menu/${partner_id}`);
  }

  const { error } = await supabaseAdmin
    .from("partner_menu_items")
    .update({
      ...menuPayload(formData, image_url),
      updated_at: new Date().toISOString(),
    })
    .eq("id", item_id)
    .eq("partner_id", partner_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/partners");
  revalidatePath(`/partners/${partner.slug || partner_id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=menu`);
}

async function toggleMenuItem(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const item_id = String(formData.get("item_id") || "");
  const visible = String(formData.get("visible") || "true") === "true";
  const partner = await getPartnerByToken(partner_id, token);

  const { error } = await supabaseAdmin
    .from("partner_menu_items")
    .update({ is_available: visible, updated_at: new Date().toISOString() })
    .eq("id", item_id)
    .eq("partner_id", partner_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/partners/${partner.slug || partner_id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=visibility`);
}

async function deleteMenuItem(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const item_id = String(formData.get("item_id") || "");
  const partner = await getPartnerByToken(partner_id, token);

  const { error } = await supabaseAdmin
    .from("partner_menu_items")
    .delete()
    .eq("id", item_id)
    .eq("partner_id", partner_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/partners");
  revalidatePath(`/partners/${partner.slug || partner_id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=deleted`);
}

async function addPromotion(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const partner = await getPartnerByToken(partner_id, token);
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const promotion_type = String(formData.get("promotion_type") || "discount");
  const starts_at = String(formData.get("starts_at") || "").trim();
  const ends_at = String(formData.get("ends_at") || "").trim();
  const is_active = String(formData.get("is_active") || "true") === "true";

  if (!title) {
    throw new Error("Promotion title is required");
  }

  if (!promotionTypes.includes(promotion_type)) {
    throw new Error("Promotion type must be selected from the list");
  }

  const { error } = await supabaseAdmin.from("partner_promotions").insert({
    partner_id,
    title: title.slice(0, 90),
    description: description ? description.slice(0, 280) : null,
    promotion_type,
    starts_at: starts_at || null,
    ends_at: ends_at || null,
    is_active,
  });

  if (error) {
    throw new Error(
      "Could not save promotion. Run supabase/SQL_PARTNER_PROMOTIONS.sql in Supabase first."
    );
  }

  revalidatePath(`/partners/${partner.slug || partner_id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=promotion`);
}

async function togglePromotion(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const promotion_id = String(formData.get("promotion_id") || "");
  const is_active = String(formData.get("is_active") || "true") === "true";
  const partner = await getPartnerByToken(partner_id, token);

  const { error } = await supabaseAdmin
    .from("partner_promotions")
    .update({ is_active })
    .eq("id", promotion_id)
    .eq("partner_id", partner_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/partners/${partner.slug || partner_id}`);
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=promotion`);
}

function formatEuro(value: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "";
  }

  return `€${numberValue % 1 === 0 ? numberValue.toFixed(0) : numberValue.toFixed(2)}`;
}

function discountLabel(item: MenuItem) {
  if (item.discount_type === "percent" && item.discount_value) {
    return `-${item.discount_value}%`;
  }

  if (item.discount_type === "euro" && item.discount_value) {
    return `-${formatEuro(item.discount_value)}`;
  }

  if (item.discount_type === "custom") {
    return item.discount_custom || "";
  }

  return "";
}

function isWithin(value: string | null | undefined, days: number) {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function isToday(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return new Date(value).toDateString() === new Date().toDateString();
}

function completionPercent(checks: { ok: boolean }[]) {
  return Math.round(
    (checks.filter((check) => check.ok).length / checks.length) * 100
  );
}

export default async function PartnerDashboardTokenPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { token } = await params;
  const { saved } = await searchParams;
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = launchCopy[lang].partnerDashboard;
  const imageCopy = launchCopy[lang].imageInput;
  const categoryCopy = dictionary[lang].categories;

  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("edit_token", token)
    .single();

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            {t.notFoundEyebrow}
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            {t.notFoundTitle}
          </h1>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            {t.notFoundText}
          </p>

          <Link
            href="/apply"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:-translate-y-0.5"
          >
            {t.applyCta}
          </Link>
        </section>
      </main>
    );
  }

  const partner = data as Partner;

  const { data: menuItems } = await supabaseAdmin
    .from("partner_menu_items")
    .select("*")
    .eq("partner_id", partner.id)
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  const items = (menuItems || []) as MenuItem[];
  const [pageViews, clickEvents, usageLogs, promotions] = await Promise.all([
    safeSelect<PartnerPageView[]>(
      "partner_page_views",
      (q) =>
        q
          .select("*")
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false })
          .limit(500),
      []
    ),
    safeSelect<PartnerClickEvent[]>(
      "partner_click_events",
      (q) =>
        q
          .select("*")
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false })
          .limit(500),
      []
    ),
    safeSelect<UsageLog[]>(
      "pass_usage_logs",
      (q) =>
        q
          .select("*")
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false })
          .limit(250),
      []
    ),
    safeSelect<PartnerPromotion[]>(
      "partner_promotions",
      (q) =>
        q
          .select("*")
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false })
          .limit(20),
      []
    ),
  ]);

  const publicUrl = `/partners/${partner.slug || partner.id}`;
  const visibleItems = items.filter(
    (item) => item.is_available !== false && item.is_active !== false
  );
  const menuItemsWithImages = items.filter((item) => Boolean(item.image_url));
  const clickCount = (eventType: string) =>
    clickEvents.filter((event) => event.event_type === eventType).length;
  const profileChecks = [
    { label: t.checks.businessName, ok: Boolean(partner.business_name) },
    { label: t.checks.category, ok: Boolean(partner.category) },
    { label: t.checks.address, ok: Boolean(partner.address) },
    { label: t.checks.offer, ok: Boolean(partner.offer) },
    { label: t.checks.openingHours, ok: Boolean(partner.opening_hours) },
    { label: t.checks.coverPhoto, ok: Boolean(partner.image_url) },
    { label: t.checks.description, ok: Boolean(partner.description) },
    { label: t.checks.websiteOrInstagram, ok: Boolean(partner.website || partner.instagram) },
    { label: t.checks.howToUse, ok: Boolean(partner.rules) },
    { label: t.checks.menuItem, ok: items.length > 0 },
  ];
  const profileCompletion = completionPercent(profileChecks);
  const qrConversion =
    pageViews.length > 0 ? Math.round((usageLogs.length / pageViews.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              {t.eyebrow}
            </p>

            <h1 className="mt-4 max-w-5xl text-5xl font-black tracking-tight md:text-8xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              {t.subtitle}
            </p>

            {saved && (
              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 font-bold text-emerald-300">
                {t.saved}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={publicUrl}
              className="rounded-full bg-white px-7 py-4 text-center font-black text-black transition hover:-translate-y-0.5"
            >
              {t.viewPublic}
            </Link>
            <CopyButton
              value={publicUrl}
              label={t.copyPublic}
              copiedLabel={t.copied}
              className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-center font-black text-white"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <Panel title={t.panels.card}>
              <form action={updatePartnerCard} className="space-y-5">
                <input suppressHydrationWarning type="hidden" name="id" value={partner.id} />
                <input suppressHydrationWarning type="hidden" name="token" value={partner.edit_token} />

                <Field label={t.fields.businessName}>
                  <input
        suppressHydrationWarning
                    name="business_name"
                    type="text"
                    required
                    defaultValue={partner.business_name}
                    className="field"
                  />
                </Field>

                <Field label={t.fields.category}>
                  <select
        suppressHydrationWarning
                    name="category"
                    defaultValue={partner.category || "restaurants"}
                    required
                    className="field"
                  >
                    {partnerCategories.map((category) => (
                      <option key={category} value={category}>
                        {copyValue(categoryCopy, category)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t.fields.address}>
                  <input
        suppressHydrationWarning
                    name="address"
                    type="text"
                    required
                    defaultValue={partner.address || ""}
                    className="field"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.fields.phone}>
                    <input
        suppressHydrationWarning
                      name="phone"
                      type="tel"
                      defaultValue={partner.phone || ""}
                      className="field"
                    />
                  </Field>

                  <Field label={t.fields.openingHours}>
                    <input
        suppressHydrationWarning
                      name="opening_hours"
                      type="text"
                      defaultValue={partner.opening_hours || ""}
                      className="field"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.fields.website}>
                    <input
        suppressHydrationWarning
                      name="website"
                      type="url"
                      defaultValue={partner.website || ""}
                      placeholder={t.placeholders.website}
                      className="field"
                    />
                  </Field>

                  <Field label={t.fields.instagram}>
                    <input
        suppressHydrationWarning
                      name="instagram"
                      type="text"
                      defaultValue={partner.instagram || ""}
                      placeholder={t.placeholders.instagram}
                      className="field"
                    />
                  </Field>
                </div>

                <Field label={t.fields.offer}>
                  <input
        suppressHydrationWarning
                    name="offer"
                    type="text"
                    required
                    defaultValue={partner.offer || ""}
                    placeholder={t.placeholders.offer}
                    className="field"
                  />
                </Field>

                <Field label={t.fields.rules}>
                  <textarea
        suppressHydrationWarning
                    name="rules"
                    rows={3}
                    defaultValue={partner.rules || ""}
                    className="field resize-none"
                  />
                </Field>

                <Field label={t.fields.description}>
                  <textarea
        suppressHydrationWarning
                    name="description"
                    rows={5}
                    maxLength={420}
                    defaultValue={partner.description || ""}
                    className="field resize-none"
                  />
                </Field>

                <ImagePreviewInput
                  name="image"
                  label={t.fields.coverPhoto}
                  currentUrl={partner.image_url}
                  copy={imageCopy}
                />

                <button
                  type="submit"
                  className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:-translate-y-0.5"
                >
                  {t.buttons.saveCard}
                </button>
              </form>
            </Panel>

            <Panel title={t.panels.addItem}>
              <MenuItemForm
                action={addMenuItem}
                partner={partner}
                buttonLabel={t.buttons.addItem}
                copy={t}
                imageCopy={imageCopy}
              />
            </Panel>
          </div>

          <div className="space-y-8">
            <Panel title={t.panels.analytics}>
              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetric label={t.metrics.pageViews} value={pageViews.length} />
                <DashboardMetric label={t.metrics.viewsToday} value={pageViews.filter((view) => isToday(view.created_at)).length} />
                <DashboardMetric label={t.metrics.views7Days} value={pageViews.filter((view) => isWithin(view.created_at, 7)).length} />
                <DashboardMetric label={t.metrics.qrUses} value={usageLogs.length} />
                <DashboardMetric label={t.metrics.qrConversion} value={`${qrConversion}%`} />
                <DashboardMetric label={t.metrics.getPassClicks} value={clickCount("get_pass_click")} />
                <DashboardMetric label={t.metrics.mapsClicks} value={clickCount("maps_click")} />
                <DashboardMetric label={t.metrics.instagramClicks} value={clickCount("instagram_click")} />
                <DashboardMetric label={t.metrics.websiteClicks} value={clickCount("website_click")} />
              </div>
            </Panel>

            <Panel title={t.panels.completeness}>
              <div className="mb-5 rounded-[1.4rem] bg-white/[0.06] p-5">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-500">
                  {t.completion}
                </p>
                <p className="mt-2 text-5xl font-black">{profileCompletion}%</p>
              </div>
              <div className="grid gap-2">
                {profileChecks.map((check) => (
                  <div
                    key={check.label}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-black/40 p-4"
                  >
                    <span className="font-bold text-zinc-300">{check.label}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        check.ok
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-white/10 text-zinc-500"
                      }`}
                    >
                      {check.ok ? t.ready : t.missing}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title={t.panels.menuQuality}>
              <div className="grid gap-3 sm:grid-cols-3">
                <DashboardMetric label={t.metrics.totalItems} value={items.length} />
                <DashboardMetric label={t.metrics.visibleItems} value={visibleItems.length} />
                <DashboardMetric label={t.metrics.withImages} value={menuItemsWithImages.length} />
              </div>
              <p className="mt-5 rounded-2xl bg-black/40 p-4 text-sm font-bold leading-6 text-zinc-400">
                {t.menuQualityText}
              </p>
            </Panel>

            <Panel title={t.panels.promotions}>
              <form action={addPromotion} className="grid gap-4">
                <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                <input suppressHydrationWarning type="hidden" name="token" value={partner.edit_token} />
                <Field label={t.fields.promotionTitle}>
                  <input
        suppressHydrationWarning
                    name="title"
                    type="text"
                    required
                    placeholder={t.placeholders.promotionTitle}
                    className="field"
                  />
                </Field>
                <Field label={t.fields.type}>
                  <select suppressHydrationWarning name="promotion_type" defaultValue="discount" className="field">
                    {promotionTypes.map((type) => (
                      <option key={type} value={type}>
                        {copyValue(t.promotionTypes, type)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t.fields.description}>
                  <textarea
        suppressHydrationWarning
                    name="description"
                    rows={3}
                    maxLength={280}
                    className="field resize-none"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t.fields.startsAt}>
                    <input suppressHydrationWarning name="starts_at" type="datetime-local" className="field" />
                  </Field>
                  <Field label={t.fields.endsAt}>
                    <input suppressHydrationWarning name="ends_at" type="datetime-local" className="field" />
                  </Field>
                </div>
                <Field label={t.fields.status}>
                  <select suppressHydrationWarning name="is_active" defaultValue="true" className="field">
                    <option value="true">{t.statusOptions.active}</option>
                    <option value="false">{t.statusOptions.hidden}</option>
                  </select>
                </Field>
                <button className="rounded-full bg-emerald-400 px-8 py-5 font-black text-black transition hover:-translate-y-0.5">
                  {t.buttons.savePromotion}
                </button>
              </form>

              <div className="mt-6 grid gap-3">
                {promotions.length > 0 ? (
                  promotions.map((promotion) => (
                    <div
                      key={promotion.id}
                      className="rounded-[1.4rem] border border-white/10 bg-black/40 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                            {promotion.promotion_type
                              ? copyValue(t.promotionTypes, promotion.promotion_type)
                              : t.panels.promotions}
                          </p>
                          <h3 className="mt-2 text-xl font-black">
                            {promotion.title}
                          </h3>
                          {promotion.description && (
                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                              {promotion.description}
                            </p>
                          )}
                        </div>
                        <form action={togglePromotion}>
                          <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                          <input suppressHydrationWarning type="hidden" name="token" value={partner.edit_token} />
                          <input suppressHydrationWarning type="hidden" name="promotion_id" value={promotion.id} />
                          <input
        suppressHydrationWarning
                            type="hidden"
                            name="is_active"
                            value={promotion.is_active === false ? "true" : "false"}
                          />
                          <button className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
                            {promotion.is_active === false ? t.buttons.show : t.buttons.hide}
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-black/40 p-5 text-sm font-bold text-zinc-500">
                    {t.noPromotions}
                  </p>
                )}
              </div>
            </Panel>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
              {partner.image_url ? (
                <img
                  src={partner.image_url}
                  alt={partner.business_name}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="grid h-72 place-items-center bg-gradient-to-br from-zinc-700 via-zinc-900 to-black text-sm font-black uppercase tracking-[0.24em] text-zinc-500">
                  {t.coverImage}
                </div>
              )}

              <div className="p-7">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
                  {partner.offer || t.fallbackOffer}
                </div>

                <h2 className="text-4xl font-black">{partner.business_name}</h2>
                <p className="mt-2 text-zinc-500">
                  {copyValue(categoryCopy, partner.category)}
                </p>

                {partner.description && (
                  <p className="mt-5 leading-7 text-zinc-400">
                    {partner.description}
                  </p>
                )}
              </div>
            </div>

            <Panel title={`${t.panels.menu} (${items.length})`}>
              <div className="space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.6rem] border border-white/10 bg-black/40 p-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-black text-zinc-300">
                              {copyValue(t.menuCategories, item.category || "main")}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${
                                item.is_available === false || item.is_active === false
                                  ? "bg-zinc-700 text-zinc-300"
                                  : "bg-emerald-400/10 text-emerald-300"
                              }`}
                            >
                              {item.is_available === false || item.is_active === false
                                ? t.hidden
                                : t.visible}
                            </span>
                          </div>

                          <h3 className="text-xl font-black">{item.name}</h3>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.price && (
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                                {formatEuro(item.price)}
                              </span>
                            )}
                            {item.old_price && (
                              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-zinc-400 line-through">
                                {formatEuro(item.old_price)}
                              </span>
                            )}
                            {discountLabel(item) && (
                              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                                {discountLabel(item)}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-28 w-full rounded-[1.2rem] object-cover"
                          />
                        ) : (
                          <div className="grid h-28 place-items-center rounded-[1.2rem] bg-gradient-to-br from-zinc-700 via-zinc-900 to-black text-xs font-black uppercase tracking-[0.18em] text-zinc-600">
                            {t.image}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <form action={toggleMenuItem}>
                          <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                          <input suppressHydrationWarning type="hidden" name="token" value={partner.edit_token} />
                          <input suppressHydrationWarning type="hidden" name="item_id" value={item.id} />
                          <input
        suppressHydrationWarning
                            type="hidden"
                            name="visible"
                            value={item.is_available === false || item.is_active === false ? "true" : "false"}
                          />
                          <button className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
                            {item.is_available === false || item.is_active === false
                              ? t.buttons.showItem
                              : t.buttons.hideItem}
                          </button>
                        </form>

                        <form action={deleteMenuItem}>
                          <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                          <input suppressHydrationWarning type="hidden" name="token" value={partner.edit_token} />
                          <input suppressHydrationWarning type="hidden" name="item_id" value={item.id} />
                          <button className="rounded-full border border-red-400/20 px-4 py-2 text-xs font-black text-red-300 hover:bg-red-400 hover:text-black">
                            {t.buttons.deleteItem}
                          </button>
                        </form>
                      </div>

                      <details className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/40 p-4">
                        <summary className="cursor-pointer text-sm font-black text-zinc-300">
                          {t.buttons.editItem}
                        </summary>

                        <div className="mt-5">
                          <MenuItemForm
                            action={updateMenuItem}
                            partner={partner}
                            item={item}
                            buttonLabel={t.buttons.saveItem}
                            copy={t}
                            imageCopy={imageCopy}
                          />
                        </div>
                      </details>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 text-center text-zinc-500">
                    {t.noProducts}
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <style>{`
        .field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #000;
          padding: 0.95rem 1rem;
          color: #fff;
          outline: none;
        }

        .field:focus {
          border-color: rgba(255, 255, 255, 0.35);
        }
      `}</style>
    </main>
  );
}

function MenuItemForm({
  action,
  partner,
  item,
  buttonLabel,
  copy,
  imageCopy,
}: {
  action: (formData: FormData) => Promise<void>;
  partner: Partner;
  item?: MenuItem;
  buttonLabel: string;
  copy: PartnerDashboardCopy;
  imageCopy: ImageInputCopy;
}) {
  const defaultDiscountType = item?.discount_type || "none";

  return (
    <form action={action} className="space-y-5">
      <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
      <input suppressHydrationWarning type="hidden" name="token" value={partner.edit_token} />
      {item && <input suppressHydrationWarning type="hidden" name="item_id" value={item.id} />}

      <Field label={copy.fields.itemName}>
        <input
        suppressHydrationWarning
          name="name"
          type="text"
          required
          defaultValue={item?.name || ""}
          className="field"
        />
      </Field>

      <Field label={copy.fields.menuCategory}>
        <select
        suppressHydrationWarning
          name="category"
          defaultValue={item?.category || "main"}
          required
          className="field"
        >
          {menuCategories.map((category) => (
            <option key={category} value={category}>
              {copyValue(copy.menuCategories, category)}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.fields.price}>
          <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-black focus-within:border-white/35">
            <input
        suppressHydrationWarning
              name="price"
              type="text"
              inputMode="decimal"
              pattern="^\d+([\.,]\d{1,2})?$"
              required
              defaultValue={item?.price || ""}
              placeholder="12.50"
              className="w-full bg-transparent px-5 py-4 text-white outline-none"
            />
            <span className="grid place-items-center px-5 font-black text-zinc-500">
              €
            </span>
          </div>
        </Field>

        <Field label={copy.fields.oldPrice}>
          <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-black focus-within:border-white/35">
            <input
        suppressHydrationWarning
              name="old_price"
              type="text"
              inputMode="decimal"
              pattern="^\d+([\.,]\d{1,2})?$"
              defaultValue={item?.old_price || ""}
              placeholder="15.00"
              className="w-full bg-transparent px-5 py-4 text-white outline-none"
            />
            <span className="grid place-items-center px-5 font-black text-zinc-500">
              €
            </span>
          </div>
        </Field>
      </div>

      <DiscountFields
        defaultType={defaultDiscountType}
        defaultValue={item?.discount_value}
        defaultCustom={item?.discount_custom}
        copy={copy.discount}
      />

      <Field label={copy.fields.description}>
        <textarea
        suppressHydrationWarning
          name="description"
          rows={4}
          maxLength={220}
          defaultValue={item?.description || ""}
          className="field resize-none"
        />
      </Field>

      <ImagePreviewInput
        name="image"
        label={copy.fields.itemImage}
        currentUrl={item?.image_url}
        copy={imageCopy}
      />

      <button
        type="submit"
        className="w-full rounded-full bg-emerald-400 px-8 py-5 font-black text-black transition hover:-translate-y-0.5"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
      <h2 className="mb-6 text-3xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function DashboardMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[1.3rem] bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
