import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { launchCopy, normalizeLang } from "../../lib/i18n";
import { supabase } from "../../lib/supabase";

async function joinWaitlist(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const interest = String(formData.get("interest") || "").trim();

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const { error } = await supabase.from("waitlist").insert({
    name,
    email,
    interest,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/waitlist/success");
}

export default async function WaitlistPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = launchCopy[lang].waitlist;

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

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {t.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-3xl font-black">{card.title}</p>
                <p className="mt-2 text-sm text-zinc-500">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-4xl font-black">{t.formTitle}</h2>
          <p className="mt-4 text-zinc-400">
            {t.formText}
          </p>

          <form action={joinWaitlist} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                {t.name}
              </label>
              <input
        suppressHydrationWarning
                name="name"
                type="text"
                required
                placeholder={t.namePlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                {t.email}
              </label>
              <input
        suppressHydrationWarning
                name="email"
                type="email"
                required
                placeholder={t.emailPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                {t.interest}
              </label>
              <select
        suppressHydrationWarning
                name="interest"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-white/30"
              >
                {t.interests.map((interest) => (
                  <option key={interest}>{interest}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              {t.submit}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
