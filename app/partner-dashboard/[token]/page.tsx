import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  edit_token: string;
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

async function uploadImage(file: File, folder: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${folder}/${Date.now()}.${extension}`;

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

async function updatePartnerCard(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const token = String(formData.get("token") || "");

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

  const { data: partner, error: partnerError } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("id", id)
    .eq("edit_token", token)
    .single();

  if (partnerError || !partner) {
    throw new Error("Partner not found");
  }

  let image_url = partner.image_url as string | null;
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
      phone,
      website,
      instagram,
      opening_hours,
      offer,
      rules,
      description,
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

async function addMenuItem(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "Food").trim();
  const description = String(formData.get("description") || "").trim();
  const price = String(formData.get("price") || "").trim();
  const discount_label = String(formData.get("discount_label") || "").trim();

  if (!name) {
    throw new Error("Product name is required");
  }

  const { data: partner, error: partnerError } = await supabaseAdmin
    .from("partners")
    .select("id, slug")
    .eq("id", partner_id)
    .eq("edit_token", token)
    .single();

  if (partnerError || !partner) {
    throw new Error("Partner not found");
  }

  let image_url: string | null = null;
  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    image_url = await uploadImage(image, `menu/${partner_id}`);
  }

  const { error } = await supabaseAdmin.from("partner_menu_items").insert({
    partner_id,
    name,
    category,
    description,
    price,
    discount_label,
    image_url,
    is_active: true,
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

async function deleteMenuItem(formData: FormData) {
  "use server";

  const partner_id = String(formData.get("partner_id") || "");
  const token = String(formData.get("token") || "");
  const item_id = String(formData.get("item_id") || "");

  const { data: partner, error: partnerError } = await supabaseAdmin
    .from("partners")
    .select("id, slug")
    .eq("id", partner_id)
    .eq("edit_token", token)
    .single();

  if (partnerError || !partner) {
    throw new Error("Partner not found");
  }

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

export default async function PartnerDashboardTokenPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { token } = await params;
  const { saved } = await searchParams;

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
            Partner dashboard
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            Link not found.
          </h1>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            This partner edit link is invalid or no longer available.
          </p>

          <a
            href="/apply"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
          >
            Apply as partner
          </a>
        </section>
      </main>
    );
  }

  const partner = data as Partner;

  const { data: menuItems } = await supabaseAdmin
    .from("partner_menu_items")
    .select("*")
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false });

  const items = (menuItems || []) as MenuItem[];
  const publicUrl = `/partners/${partner.slug || partner.id}`;

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Partner dashboard
            </p>

            <h1 className="mt-4 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
              Manage your place.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
              Edit your public restaurant card and add products to your TLN
              Pass menu.
            </p>

            {saved && (
              <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 font-bold text-emerald-300">
                Changes saved successfully.
              </div>
            )}
          </div>

          <a
            href={publicUrl}
            className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105"
          >
            View public page
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
              <h2 className="text-4xl font-black">Restaurant card</h2>

              <form action={updatePartnerCard} className="mt-8 space-y-5">
                <input type="hidden" name="id" value={partner.id} />
                <input type="hidden" name="token" value={partner.edit_token} />

                <input
                  name="business_name"
                  type="text"
                  defaultValue={partner.business_name}
                  placeholder="Business name"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="category"
                  type="text"
                  defaultValue={partner.category}
                  placeholder="Category: Restaurant, Cafe..."
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="address"
                  type="text"
                  defaultValue={partner.address || ""}
                  placeholder="Address"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="phone"
                  type="text"
                  defaultValue={partner.phone || ""}
                  placeholder="Phone"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="website"
                  type="text"
                  defaultValue={partner.website || ""}
                  placeholder="Website"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="instagram"
                  type="text"
                  defaultValue={partner.instagram || ""}
                  placeholder="Instagram"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="opening_hours"
                  type="text"
                  defaultValue={partner.opening_hours || ""}
                  placeholder="Opening hours"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <input
                  name="offer"
                  type="text"
                  defaultValue={partner.offer || ""}
                  placeholder="Main offer: -20% for TLN Pass members"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <textarea
                  name="rules"
                  rows={3}
                  defaultValue={partner.rules || ""}
                  placeholder="Rules: Show QR code before payment"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <textarea
                  name="description"
                  rows={5}
                  defaultValue={partner.description || ""}
                  placeholder="Short restaurant description"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-400">
                    Cover photo
                  </label>

                  <input
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02]"
                >
                  Save restaurant card
                </button>
              </form>
            </div>

            <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
              <h2 className="text-4xl font-black">Add product</h2>

              <p className="mt-3 text-zinc-500">
                Add food, drinks, desserts or special TLN Pass items.
              </p>

              <form action={addMenuItem} className="mt-8 space-y-5">
                <input type="hidden" name="partner_id" value={partner.id} />
                <input type="hidden" name="token" value={partner.edit_token} />

                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Product name"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <select
                  name="category"
                  defaultValue="Food"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
                >
                  <option>Food</option>
                  <option>Drinks</option>
                  <option>Desserts</option>
                  <option>Lunch</option>
                  <option>Breakfast</option>
                  <option>Special offers</option>
                  <option>Other</option>
                </select>

                <input
                  name="price"
                  type="text"
                  placeholder="Price: 9.90€"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <input
                  name="discount_label"
                  type="text"
                  placeholder="TLN discount: -20% with pass"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <textarea
                  name="description"
                  rows={4}
                  placeholder="Short product description"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-400">
                    Product photo
                  </label>

                  <input
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-emerald-400 px-8 py-5 font-black text-black transition hover:scale-[1.02]"
                >
                  Add product
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.04]">
              {partner.image_url ? (
                <img
                  src={partner.image_url}
                  alt={partner.business_name}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="h-72 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black" />
              )}

              <div className="p-8">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
                  {partner.offer || "TLN Pass offer"}
                </div>

                <h2 className="text-4xl font-black">
                  {partner.business_name}
                </h2>

                <p className="mt-2 text-zinc-500">{partner.category}</p>

                {partner.description && (
                  <p className="mt-5 leading-7 text-zinc-400">
                    {partner.description}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black">My menu</h2>
                  <p className="mt-3 text-zinc-500">
                    Products shown on your public partner page.
                  </p>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                  {items.length}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr_100px] gap-4 rounded-[1.6rem] border border-white/10 bg-black/40 p-4"
                    >
                      <div>
                        <div className="mb-2 inline-flex rounded-full bg-white/[0.08] px-3 py-1 text-xs font-black text-zinc-300">
                          {item.category}
                        </div>

                        <h3 className="text-xl font-black">{item.name}</h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.price && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                              {item.price}
                            </span>
                          )}

                          {item.discount_label && (
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                              {item.discount_label}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                            {item.description}
                          </p>
                        )}

                        <form action={deleteMenuItem} className="mt-4">
                          <input
                            type="hidden"
                            name="partner_id"
                            value={partner.id}
                          />
                          <input
                            type="hidden"
                            name="token"
                            value={partner.edit_token}
                          />
                          <input
                            type="hidden"
                            name="item_id"
                            value={item.id}
                          />

                          <button className="rounded-full border border-red-400/20 px-4 py-2 text-xs font-black text-red-300 hover:bg-red-400 hover:text-black">
                            Delete
                          </button>
                        </form>
                      </div>

                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-28 w-full rounded-[1.2rem] object-cover"
                        />
                      ) : (
                        <div className="h-28 rounded-[1.2rem] bg-gradient-to-br from-zinc-700 via-zinc-900 to-black" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 text-center text-zinc-500">
                    No products yet. Add your first product on the left.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
