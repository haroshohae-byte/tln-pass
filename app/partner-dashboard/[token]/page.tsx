import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type Partner = {
  id: string;
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
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("partner-images")
      .upload(filePath, image, {
        contentType: image.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseAdmin.storage
      .from("partner-images")
      .getPublicUrl(filePath);

    image_url = data.publicUrl;
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
  revalidatePath(`/partner-dashboard/${token}`);

  redirect(`/partner-dashboard/${token}?saved=1`);
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

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Partner dashboard
          </p>

          <h1 className="mt-4 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
            Manage your card.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            Update your public TLN Pass partner card. Changes appear on the
            partner page after saving.
          </p>

          {saved && (
            <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 font-bold text-emerald-300">
              Changes saved successfully.
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-4xl font-black">Edit details</h2>

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
                placeholder="Category"
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
                placeholder="Offer"
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
                rows={6}
                defaultValue={partner.description || ""}
                placeholder="Description"
                className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-400">
                  Photo
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-black"
                />
                <p className="mt-2 text-xs text-zinc-600">
                  Use JPG, PNG or WebP. Max size: 5 MB.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02]"
              >
                Save partner card
              </button>
            </form>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-4xl font-black">Live preview</h2>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
              {partner.image_url ? (
                <img
                  src={partner.image_url}
                  alt={partner.business_name}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="h-72 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black" />
              )}

              <div className="p-6">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300">
                  {partner.offer || "Member offer"}
                </div>

                <h3 className="text-3xl font-black">
                  {partner.business_name}
                </h3>

                <p className="mt-2 text-zinc-500">{partner.category}</p>

                {partner.address && (
                  <p className="mt-3 text-sm text-zinc-500">
                    {partner.address}
                  </p>
                )}

                <p className="mt-5 leading-7 text-zinc-400">
                  {partner.description ||
                    "Approved TLN Pass partner in Tallinn."}
                </p>

                <div className="mt-6 space-y-2 text-sm text-zinc-500">
                  {partner.opening_hours && (
                    <p>Hours: {partner.opening_hours}</p>
                  )}
                  {partner.rules && <p>Rules: {partner.rules}</p>}
                  {partner.phone && <p>Phone: {partner.phone}</p>}
                </div>
              </div>
            </div>

            <a
              href="/partners"
              className="mt-8 inline-flex rounded-full border border-white/10 px-6 py-3 font-bold text-white hover:bg-white hover:text-black"
            >
              View public partners page
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
