import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";

export default async function FaqPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].faq;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
            {t.eyebrow}
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            {t.title}
          </h1>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <FaqGroup title={t.members} items={t.memberItems} />
          <FaqGroup title={t.partners} items={t.partnerItems} />
        </div>
      </section>
    </main>
  );
}

function FaqGroup({
  title,
  items,
}: {
  title: string;
  items: readonly { q: string; a: string }[];
}) {
  return (
    <section className="premium-card p-7">
      <h2 className="text-3xl font-black">{title}</h2>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <details key={item.q} className="rounded-2xl bg-zinc-100 p-5">
            <summary className="cursor-pointer text-lg font-black">
              {item.q}
            </summary>
            <p className="mt-3 leading-7 text-zinc-600">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
