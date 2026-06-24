export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-4xl rounded-[2.4rem] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
          Legal
        </p>

        <h1 className="mt-5 text-5xl font-black">Privacy Policy</h1>

        <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-600">
          <p>
            TLN Pass collects only the information needed to provide membership
            access, manage subscriptions and verify QR passes.
          </p>
          <p>
            Payment details are processed by Stripe. TLN Pass does not store
            full card numbers.
          </p>
          <p>
            We may store member name, email, subscription status, pass code, QR
            verification logs and partner application details.
          </p>
        </div>
      </section>
    </main>
  );
}
