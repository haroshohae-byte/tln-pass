const memberFaq = [
  {
    q: "How do I use TLN Pass?",
    a: "Open your pass, show the dynamic QR before paying and let the partner verify your active membership.",
  },
  {
    q: "Can I screenshot the QR?",
    a: "The pass is designed to be dynamic and device-linked, so members should open the live pass instead of using a screenshot.",
  },
  {
    q: "What if my pass does not work?",
    a: "Contact support with your email and pass code so the team can check status, validity and device lock.",
  },
];

const partnerFaq = [
  {
    q: "How do businesses join?",
    a: "Submit a partner application. After approval, TLN Pass creates the partner profile and dashboard link.",
  },
  {
    q: "Who edits the menu and offer?",
    a: "Partners can update the public card, menu items, prices, images and active promotions from their private dashboard link.",
  },
  {
    q: "How are QR checks tracked?",
    a: "QR verification logs are saved for admin analytics when the QR system is used by a partner.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
            FAQ
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Questions before using TLN Pass.
          </h1>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <FaqGroup title="Members" items={memberFaq} />
          <FaqGroup title="Partners" items={partnerFaq} />
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
  items: { q: string; a: string }[];
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
