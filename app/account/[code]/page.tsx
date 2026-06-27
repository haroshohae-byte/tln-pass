import { cookies } from "next/headers";
import Link from "next/link";
import { hashDeviceToken } from "../../../lib/device";
import { dictionary, launchCopy, normalizeLang, type Lang } from "../../../lib/i18n";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import DynamicQr from "./DynamicQr";

type MemberPass = {
  id: string;
  full_name: string;
  email: string;
  pass_code: string;
  plan: string;
  status: string;
  valid_until: string;
  device_hash: string | null;
};

type PlanCopyItems = Record<
  "14day" | "monthly" | "6months" | "yearly",
  { name: string }
>;

function formatDate(date: string, lang: Lang) {
  const locale = lang === "ru" ? "ru-RU" : lang === "ee" ? "et-EE" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatPlanName(
  plan: string,
  plansCopy: PlanCopyItems
) {
  const value = plan.toLowerCase();

  if (value.includes("14") || value.includes("starter")) {
    return plansCopy["14day"].name;
  }

  if (value.includes("6") || value.includes("half")) {
    return plansCopy["6months"].name;
  }

  if (value.includes("year") || value.includes("golden")) {
    return plansCopy.yearly.name;
  }

  if (value.includes("month") || value.includes("monthly")) {
    return plansCopy.monthly.name;
  }

  return plan;
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ locked?: string }>;
}) {
  const { code } = await params;
  const { locked } = await searchParams;
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = launchCopy[lang].account;
  const planCopy = dictionary[lang].plans.items;

  const { data } = await supabaseAdmin
    .from("member_passes")
    .select("*")
    .eq("pass_code", code)
    .maybeSingle();

  if (!data) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-6xl font-black md:text-8xl">
            {t.notFoundTitle}
          </h1>

          <Link
            href="/join"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black"
          >
            {t.joinNow}
          </Link>
        </section>
      </main>
    );
  }

  const pass = data as MemberPass;

  const deviceToken = cookieStore.get("tln_device")?.value;
  const currentDeviceHash = deviceToken ? hashDeviceToken(deviceToken) : null;

  const isExpired = new Date(pass.valid_until) < new Date();
  const isActive = pass.status === "active" && !isExpired;

  const isLocked =
    locked === "1" ||
    !deviceToken ||
    !pass.device_hash ||
    pass.device_hash !== currentDeviceHash;

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            {t.eyebrow}
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            {t.title}
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            {t.text}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                {t.member}
              </p>
              <p className="mt-3 text-2xl font-black">{pass.full_name}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                {t.status}
              </p>
              <p
                className={`mt-3 text-2xl font-black ${
                  isActive ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {isActive ? t.active : t.inactive}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                {t.plan}
              </p>
              <p className="mt-3 text-2xl font-black">
                {formatPlanName(pass.plan, planCopy)}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                {t.validUntil}
              </p>
              <p className="mt-3 text-2xl font-black">
                {formatDate(pass.valid_until, lang)}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/partners"
              className="rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
            >
              {t.explore}
            </Link>

            <Link
              href={`/account/start/${pass.pass_code}`}
              className="rounded-full border border-white/10 px-8 py-4 font-black text-white hover:bg-white hover:text-black"
            >
              {t.openDevice}
            </Link>
          </div>
        </div>

        <div>
          {isLocked ? (
            <div className="rounded-[3rem] border border-amber-400/20 bg-amber-400/10 p-8 text-amber-200">
              <h2 className="text-4xl font-black">{t.lockedTitle}</h2>

              <p className="mt-5 leading-8">
                {t.lockedText}
              </p>

              <Link
                href={`/account/start/${pass.pass_code}`}
                className="mt-8 inline-flex rounded-full bg-amber-300 px-8 py-4 font-black text-black"
              >
                {t.openDevice}
              </Link>
            </div>
          ) : isActive ? (
            <DynamicQr passCode={pass.pass_code} copy={t.qr} />
          ) : (
            <div className="rounded-[3rem] border border-red-400/20 bg-red-400/10 p-8 text-red-300">
              <h2 className="text-4xl font-black">{t.inactiveTitle}</h2>
              <p className="mt-5 leading-8">
                {t.inactiveText}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
