import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeLang } from "../../lib/i18n";

const copy = {
  en: {
    eyebrow: "Member access",
    title: "Your pass is one code away.",
    subtitle:
      "Open a saved pass on this device or enter your pass code manually.",
    saved: "Open saved pass",
    noSaved: "No saved pass on this device",
    join: "Get TLN Pass",
    input: "Enter pass code",
    open: "Open pass",
    help: "The pass is device-linked for better protection.",
  },
  ru: {
    eyebrow: "Доступ участника",
    title: "Твой pass в одном коде.",
    subtitle:
      "Открой сохранённый pass на этом устройстве или введи код вручную.",
    saved: "Открыть сохранённый pass",
    noSaved: "На этом устройстве pass не сохранён",
    join: "Купить TLN Pass",
    input: "Введи pass code",
    open: "Открыть pass",
    help: "Pass привязывается к устройству для защиты.",
  },
  ee: {
    eyebrow: "Liikme ligipääs",
    title: "Sinu pass on ühe koodi kaugusel.",
    subtitle:
      "Ava selles seadmes salvestatud pass või sisesta passikood käsitsi.",
    saved: "Ava salvestatud pass",
    noSaved: "Selles seadmes pole salvestatud passi",
    join: "Hangi TLN Pass",
    input: "Sisesta passikood",
    open: "Ava pass",
    help: "Pass seotakse seadmega parema kaitse jaoks.",
  },
};

async function openPass(formData: FormData) {
  "use server";

  const code = String(formData.get("pass_code") || "")
    .trim()
    .toUpperCase();

  if (!code) {
    redirect("/my-pass");
  }

  redirect(`/account/start/${code}`);
}

export default async function MyPassPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = copy[lang];
  const savedPassCode = cookieStore.get("tln_last_pass_code")?.value;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-14 text-[#1d1d1f]">
      <section className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2.8rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="relative min-h-[360px] bg-black p-8 text-white md:p-12">
            <img
              src="/images/membership/yearly.jpg"
              alt="Tallinn"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />

            <div className="relative max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/50">
                {t.eyebrow}
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-7xl">
                {t.title}
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-white/75">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-3 md:p-7">
            {savedPassCode ? (
              <a
                href={`/account/start/${savedPassCode}`}
                className="rounded-[2rem] bg-[#1d1d1f] p-7 text-white transition hover:-translate-y-1"
              >
                <p className="text-sm font-black uppercase tracking-[0.22em] text-white/35">
                  Saved
                </p>

                <h2 className="mt-12 text-3xl font-black tracking-tight">
                  {t.saved}
                </h2>
              </a>
            ) : (
              <div className="rounded-[2rem] bg-zinc-100 p-7 text-zinc-500">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-400">
                  Saved
                </p>

                <h2 className="mt-12 text-3xl font-black tracking-tight">
                  {t.noSaved}
                </h2>
              </div>
            )}

            <a
              href="/membership"
              className="rounded-[2rem] bg-[#e8f3ff] p-7 text-[#0b3b75] transition hover:-translate-y-1"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] opacity-50">
                New
              </p>

              <h2 className="mt-12 text-3xl font-black tracking-tight">
                {t.join}
              </h2>
            </a>

            <div className="rounded-[2rem] bg-[#fff3df] p-7 text-[#7a3f00]">
              <p className="text-sm font-black uppercase tracking-[0.22em] opacity-50">
                Secure
              </p>

              <h2 className="mt-12 text-3xl font-black tracking-tight">
                Device protected
              </h2>
            </div>
          </div>

          <form
            action={openPass}
            className="grid gap-3 border-t border-black/5 p-5 md:grid-cols-[1fr_auto] md:p-7"
          >
            <input
              name="pass_code"
              type="text"
              required
              placeholder={t.input}
              className="min-h-16 rounded-2xl border border-black/10 bg-zinc-100 px-5 font-black uppercase tracking-wider text-black outline-none placeholder:text-zinc-400 focus:border-black/25"
            />

            <button
              type="submit"
              className="rounded-2xl bg-black px-10 py-5 font-black text-white transition hover:scale-[1.02]"
            >
              {t.open}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm font-bold text-zinc-500">
          {t.help}
        </p>
      </section>
    </main>
  );
}
