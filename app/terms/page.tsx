export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
      <section className="mx-auto max-w-4xl rounded-[2.4rem] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
          Legal
        </p>

        <h1 className="mt-5 text-5xl font-black">Terms of Service</h1>

        <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-600">
          <p>
            TLN Pass is a membership service that provides access to selected
            partner benefits in Tallinn.
          </p>
          <p>
            Benefits may vary by partner and may change over time. Members must
            show an active dynamic QR before payment.
          </p>
          <p>
            Subscriptions renew according to the selected plan unless cancelled.
            Payments are processed by Stripe.
          </p>
        </div>
      </section>
    </main>
  );
}
