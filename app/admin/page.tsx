import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type PartnerApplication = {
  id: string;
  business_name: string;
  category: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  opening_hours: string | null;
  offer: string | null;
  contact_email: string;
  description: string | null;
  status: string;
  created_at: string;
};

type WaitlistMember = {
  id: string;
  name: string;
  email: string;
  interest: string | null;
  created_at: string;
};

type Partner = {
  id: string;
  application_id: string | null;
  business_name: string;
  category: string;
  status: string;
  edit_token: string | null;
};

function createToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

function createSlug(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "partner";

  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

async function requireAdmin() {
  const adminSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminSecret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }

  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("tln_admin")?.value;

  if (adminCookie !== adminSecret) {
    redirect("/admin-login");
  }
}

async function logoutAdmin() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("tln_admin");

  redirect("/admin-login");
}

async function approveApplication(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  const { data: application, error: fetchError } = await supabaseAdmin
    .from("partner_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !application) {
    throw new Error(fetchError?.message || "Application not found");
  }

  const app = application as PartnerApplication;

  const { data: existingPartner } = await supabaseAdmin
    .from("partners")
    .select("id")
    .eq("application_id", id)
    .maybeSingle();

  if (!existingPartner) {
    const { error: insertError } = await supabaseAdmin.from("partners").insert({
      application_id: app.id,
      business_name: app.business_name,
      category: app.category,
      address: app.address,
      phone: app.phone,
      website: app.website,
      instagram: app.instagram,
      opening_hours: app.opening_hours,
      offer: app.offer,
      description: app.description,
      status: "approved",
      slug: createSlug(app.business_name),
      edit_token: createToken(),
      rules: "Show your TLN Pass QR code before payment.",
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from("partner_applications")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/partners");
}

async function rejectApplication(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  const { error } = await supabaseAdmin
    .from("partner_applications")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export default async function AdminPage() {
  await requireAdmin();

  const { data: applications, error: applicationsError } = await supabaseAdmin
    .from("partner_applications")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: waitlist } = await supabaseAdmin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: partners } = await supabaseAdmin.from("partners").select("*");

  if (applicationsError) {
    throw new Error(applicationsError.message);
  }

  const applicationList = (applications || []) as PartnerApplication[];
  const waitlistMembers = (waitlist || []) as WaitlistMember[];
  const partnerList = (partners || []) as Partner[];

  const partnerByApplicationId = new Map(
    partnerList
      .filter((partner) => partner.application_id)
      .map((partner) => [partner.application_id, partner])
  );

  const pendingCount = applicationList.filter(
    (application) => application.status === "pending"
  ).length;

  const approvedCount = partnerList.filter(
    (partner) => partner.status === "approved"
  ).length;

  const stats = [
    ["Partner applications", String(applicationList.length)],
    ["Approved partners", String(approvedCount)],
    ["Waitlist members", String(waitlistMembers.length)],
    ["Pending review", String(pendingCount)],
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Admin panel
            </p>

            <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
              TLN Pass control.
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-400">
              Manage applications, approvals, partner cards and private edit
              links.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/apply"
              className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-105"
            >
              Open application form
            </a>

            <form action={logoutAdmin}>
              <button className="w-full rounded-full border border-white/10 px-8 py-4 text-center font-black text-white transition hover:bg-white hover:text-black">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-4xl font-black">{value}</p>
              <p className="mt-2 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[3rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black">Partner applications</h2>
            <p className="mt-2 text-zinc-500">
              Approve a partner, then send them their private edit link.
            </p>
          </div>

          <div className="space-y-4">
            {applicationList.length > 0 ? (
              applicationList.map((application) => {
                const partner = partnerByApplicationId.get(application.id);
                const editLink = partner?.edit_token
                  ? `/partner-dashboard/${partner.edit_token}`
                  : null;

                return (
                  <div
                    key={application.id}
                    className="rounded-[2rem] border border-white/10 bg-black/50 p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-6 md:items-center">
                      <div className="md:col-span-2">
                        <p className="text-xl font-black">
                          {application.business_name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {application.category}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          {application.contact_email}
                        </p>
                      </div>

                      <div className="text-zinc-300">
                        {application.offer || "No offer yet"}
                      </div>

                      <div className="text-sm text-zinc-500">
                        {application.address || "No address"}
                      </div>

                      <div>
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-black ${
                            application.status === "approved"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : application.status === "rejected"
                                ? "bg-red-400/10 text-red-300"
                                : "bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="flex gap-2 md:justify-end">
                        <form action={approveApplication}>
                          <input
                            type="hidden"
                            name="id"
                            value={application.id}
                          />
                          <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                            Approve
                          </button>
                        </form>

                        <form action={rejectApplication}>
                          <input
                            type="hidden"
                            name="id"
                            value={application.id}
                          />
                          <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white">
                            Reject
                          </button>
                        </form>
                      </div>
                    </div>

                    {editLink && (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-black text-zinc-400">
                          Private partner edit link
                        </p>
                        <a
                          href={editLink}
                          className="mt-2 inline-flex break-all text-sm font-bold text-white hover:text-zinc-300"
                        >
                          {editLink}
                        </a>
                        <p className="mt-2 text-xs text-zinc-600">
                          Send this link only to the approved business.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8 text-center text-zinc-500">
                No partner applications yet.
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 rounded-[3rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-3xl font-black">Waitlist members</h2>
          <p className="mt-2 text-zinc-500">
            Latest people who joined the TLN Pass waitlist.
          </p>

          <div className="mt-8 space-y-3">
            {waitlistMembers.length > 0 ? (
              waitlistMembers.slice(0, 10).map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-black/40 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-black">{member.name}</p>
                    <p className="text-sm text-zinc-500">{member.email}</p>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {member.interest || "Everything"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8 text-center text-zinc-500">
                No waitlist members yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
