import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function loginAdmin(formData: FormData) {
  "use server";

  const password = String(formData.get("password") || "");

  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  if (!adminSecret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }

  if (password !== adminPassword) {
    redirect("/admin-login");
  }

  const cookieStore = await cookies();

  cookieStore.set("tln_admin", adminSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-xl">
        <div className="rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
            Admin access
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            TLN Pass admin.
          </h1>

          <p className="mt-6 leading-8 text-zinc-400">
            Enter the admin password to manage partner applications, waitlist
            members and approved partners.
          </p>

          <form action={loginAdmin} className="mt-10 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-400">
                Password
              </label>

              <input
                name="password"
                type="password"
                required
                placeholder="Admin password"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-white px-8 py-5 font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              Enter admin panel
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
