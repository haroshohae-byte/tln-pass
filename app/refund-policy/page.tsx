import LegalLayout from "../components/LegalLayout";

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Refund Policy"
      updated="June 25, 2026"
      intro="TLN Pass is a digital membership product. Refunds and cancellations are handled clearly and reviewed case by case."
      cards={[
        {
          title: "Refunds",
          text: "Refund requests are reviewed individually depending on payment status, usage and legal requirements.",
        },
        {
          title: "Cancellation",
          text: "Cancellation stops future renewals. It does not automatically refund previous periods.",
        },
        {
          title: "Billing support",
          text: "For payment questions, contact support with the email used at checkout.",
        },
      ]}
      sections={[
        {
          title: "Refund review",
          items: [
            "We may review whether the pass was activated, used or affected by a technical issue.",
            "Approved refunds are returned through the original payment provider where possible.",
            "Stripe processing time can vary after TLN Pass approves a refund.",
          ],
        },
        {
          title: "Membership access",
          items: [
            "Access may stop after a refund is approved.",
            "If a subscription is cancelled, future renewals stop while the current membership period may remain active according to the plan.",
          ],
        },
      ]}
    />
  );
}
