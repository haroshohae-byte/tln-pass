import { cookies } from "next/headers";
import { hashDeviceToken } from "../../../lib/device";
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
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
            Account not found.
          </h1>

          <a
            href="/join"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-black text-black"
          >
            Join now
          </a>
        </section>
      </main>
    );
  }

  const pass = data as MemberPass;

  const cookieStore = await cookies();
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
            Member account
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            Your TLN Pass.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
            This account is protected by a device lock and a dynamic QR code.
            Show the QR before payment at partner places.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                Member
              </p>
              <p className="mt-3 text-2xl font-black">{pass.full_name}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                Status
              </p>
              <p
                className={`mt-3 text-2xl font-black ${
                  isActive ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {isActive ? "ACTIVE" : "NOT ACTIVE"}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                Plan
              </p>
              <p className="mt-3 text-2xl font-black">{pass.plan}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
                Valid until
              </p>
              <p className="mt-3 text-2xl font-black">
                {formatDate(pass.valid_until)}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/partners"
              className="rounded-full bg-white px-8 py-4 font-black text-black transition hover:scale-105"
            >
              Explore partners
            </a>

            <a
              href={`/account/start/${pass.pass_code}`}
              className="rounded-full border border-white/10 px-8 py-4 font-black text-white hover:bg-white hover:text-black"
            >
              Open on this device
            </a>
          </div>
        </div>

        <div>
          {isLocked ? (
            <div className="rounded-[3rem] border border-amber-400/20 bg-amber-400/10 p-8 text-amber-200">
              <h2 className="text-4xl font-black">Device locked.</h2>

              <p className="mt-5 leading-8">
                This TLN Pass is protected against sharing. Open the pass using
                the original device, or press “Open on this device” if this is
                the first setup.
              </p>

              <a
                href={`/account/start/${pass.pass_code}`}
                className="mt-8 inline-flex rounded-full bg-amber-300 px-8 py-4 font-black text-black"
              >
                Open on this device
              </a>
            </div>
          ) : isActive ? (
            <DynamicQr passCode={pass.pass_code} />
          ) : (
            <div className="rounded-[3rem] border border-red-400/20 bg-red-400/10 p-8 text-red-300">
              <h2 className="text-4xl font-black">Pass not active.</h2>
              <p className="mt-5 leading-8">
                This membership is expired or inactive.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
