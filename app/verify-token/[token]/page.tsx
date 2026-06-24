import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type MemberPass = {
  id: string;
  full_name: string;
  email: string;
  pass_code: string;
  plan: string;
  status: string;
  valid_until: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function VerifyTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: qrToken } = await supabaseAdmin
    .from("qr_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!qrToken) {
    return (
      <main className="min-h-screen bg-red-950 px-6 py-24 text-white">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-red-500 text-6xl font-black">
            ×
          </div>

          <h1 className="mt-10 text-6xl font-black md:text-8xl">
            Invalid QR.
          </h1>

          <p className="mt-6 text-xl text-white/60">
            This QR code does not exist.
          </p>
        </section>
      </main>
    );
  }

  const { data: passData } = await supabaseAdmin
    .from("member_passes")
    .select("*")
    .eq("id", qrToken.pass_id)
    .maybeSingle();

  const pass = passData as MemberPass | null;

  const tokenExpired = new Date(qrToken.expires_at) < new Date();
  const passExpired = pass ? new Date(pass.valid_until) < new Date() : true;

  const active =
    !!pass && pass.status === "active" && !passExpired && !tokenExpired;

  await supabaseAdmin.from("pass_usage_logs").insert({
    pass_id: pass?.id || null,
    qr_token: token,
    result: active ? "active" : tokenExpired ? "expired_qr" : "inactive_pass",
  });

  return (
    <main
      className={`min-h-screen px-6 py-24 text-white ${
        active ? "bg-emerald-950" : "bg-red-950"
      }`}
    >
      <section className="mx-auto max-w-4xl text-center">
        <div
          className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full text-6xl font-black ${
            active ? "bg-emerald-400 text-black" : "bg-red-500 text-white"
          }`}
        >
          {active ? "✓" : "×"}
        </div>

        <p className="mt-10 text-sm font-bold uppercase tracking-[0.3em] text-white/50">
          TLN Pass verification
        </p>

        <h1 className="mt-4 text-6xl font-black md:text-8xl">
          {active ? "Pass active." : "Pass not valid."}
        </h1>

        <div className="mx-auto mt-10 max-w-2xl rounded-[3rem] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
          {pass ? (
            <div className="grid gap-5 text-left sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Member
                </p>
                <p className="mt-2 text-2xl font-black">{pass.full_name}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Plan
                </p>
                <p className="mt-2 text-2xl font-black">{pass.plan}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Membership valid until
                </p>
                <p className="mt-2 text-2xl font-black">
                  {formatDate(pass.valid_until)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  QR expires
                </p>
                <p className="mt-2 text-2xl font-black">
                  {formatDate(qrToken.expires_at)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xl font-black">Pass not found.</p>
          )}

          <p className="mt-8 text-sm font-bold text-white/50">
            Partner instruction: apply the offer only if this page shows “Pass
            active”.
          </p>
        </div>
      </section>
    </main>
  );
}
