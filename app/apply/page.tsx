import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { launchCopy, normalizeLang } from "../../lib/i18n";
import { getSiteSettings } from "../../lib/siteSettings";
import { supabase } from "../../lib/supabase";

async function submitPartnerApplication(formData: FormData) {
  "use server";

  const settings = await getSiteSettings();

  if (settings.partnerApplicationsEnabled === "false") {
    throw new Error("Partner applications are currently closed");
  }

  const business_name = String(formData.get("business_name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const opening_hours = String(formData.get("opening_hours") || "").trim();
  const offer = String(formData.get("offer") || "").trim();
  const contact_email = String(formData.get("contact_email") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!business_name || !category || !contact_email) {
    throw new Error("Business name, category and contact email are required");
  }

  const { error } = await supabase.from("partner_applications").insert({
    business_name,
    category,
    address,
    phone,
    website,
    instagram,
    opening_hours,
    offer,
    contact_email,
    description,
    status: "pending",
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/apply/success");
}

export default async function ApplyPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = launchCopy[lang].apply;
  const settings = await getSiteSettings();
  const applicationsClosed = settings.partnerApplicationsEnabled === "false";

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            {t.eyebrow}
          </p>

          <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            {t.title}
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            {t.subtitle}
          </p>

          <div className="mt-12 rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-black">{t.howTitle}</h2>

            <div className="mt-8 space-y-5">
              {t.steps.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <p className="font-black text-zinc-600">0{index + 1}</p>
                  <p className="text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-4xl font-black">{t.formTitle}</h2>
          <p className="mt-4 text-zinc-400">
            {t.formText}
          </p>

          {applicationsClosed ? (
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-black p-8 text-zinc-300">
              {t.closed}
            </div>
          ) : (
          <form action={submitPartnerApplication} className="mt-8 space-y-5">
            <input
        suppressHydrationWarning
              name="business_name"
              type="text"
              required
              placeholder={t.placeholders.businessName}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="category"
              type="text"
              required
              placeholder={t.placeholders.category}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="address"
              type="text"
              placeholder={t.placeholders.address}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="phone"
              type="text"
              placeholder={t.placeholders.phone}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="website"
              type="text"
              placeholder={t.placeholders.website}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="instagram"
              type="text"
              placeholder={t.placeholders.instagram}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="opening_hours"
              type="text"
              placeholder={t.placeholders.openingHours}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="offer"
              type="text"
              placeholder={t.placeholders.offer}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
        suppressHydrationWarning
              name="contact_email"
              type="email"
              required
              placeholder={t.placeholders.contactEmail}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <textarea
        suppressHydrationWarning
              name="description"
              placeholder={t.placeholders.description}
              rows={6}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              {t.submit}
            </button>
          </form>
          )}
        </div>
      </section>
    </main>
  );
}
