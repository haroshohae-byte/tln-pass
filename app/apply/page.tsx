import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase";

async function submitPartnerApplication(formData: FormData) {
  "use server";

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

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Partner application
          </p>

          <h1 className="mt-4 max-w-4xl text-6xl font-black tracking-tight md:text-8xl">
            Apply to join TLN Pass.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            Restaurants, cafes, entertainment venues and local businesses can
            apply to become part of the TLN Pass partner network.
          </p>

          <div className="mt-12 rounded-[3rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-black">How approval works</h2>

            <div className="mt-8 space-y-5">
              {[
                "Business sends application",
                "TLN Pass reviews the place and offer",
                "Admin approves or rejects the application",
                "Approved partner receives a private edit link",
              ].map((item, index) => (
                <div key={item} className="flex gap-4">
                  <p className="font-black text-zinc-600">0{index + 1}</p>
                  <p className="text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-4xl font-black">Business details</h2>
          <p className="mt-4 text-zinc-400">
            Send your business details for review.
          </p>

          <form action={submitPartnerApplication} className="mt-8 space-y-5">
            <input
              name="business_name"
              type="text"
              required
              placeholder="Business name"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="category"
              type="text"
              required
              placeholder="Category: Restaurant, Cafe, Beauty..."
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="address"
              type="text"
              placeholder="Address in Tallinn"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="phone"
              type="text"
              placeholder="Phone"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="website"
              type="text"
              placeholder="Website"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="instagram"
              type="text"
              placeholder="Instagram"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="opening_hours"
              type="text"
              placeholder="Opening hours: Mon-Fri 12:00-22:00"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="offer"
              type="text"
              placeholder="Offer example: -20% on weekdays"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <input
              name="contact_email"
              type="email"
              required
              placeholder="Contact email"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <textarea
              name="description"
              placeholder="Short description of your business"
              rows={6}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              Send application
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
