import LegalLayout from "../components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Terms of Service"
      updated="June 25, 2026"
      intro="These terms explain how TLN Pass membership, partner benefits, QR verification and responsibilities work."
      cards={[
        {
          title: "Membership",
          text: "TLN Pass gives access to selected partner benefits while the pass is active.",
        },
        {
          title: "Payments",
          text: "Payments are processed by Stripe. Subscription periods depend on the selected plan.",
        },
        {
          title: "QR use",
          text: "Members must show the dynamic QR before payment so the partner can verify the pass.",
        },
      ]}
      sections={[
        {
          title: "Membership and cancellation",
          items: [
            "Benefits may vary by partner, category, time and availability.",
            "Subscriptions renew according to the selected plan unless cancelled.",
            "Cancelling a subscription stops future renewals; access remains subject to the paid period and plan rules.",
          ],
        },
        {
          title: "User responsibility",
          items: [
            "Members should not share pass codes, screenshots or device access with other people.",
            "A partner can refuse a benefit if the pass is expired, invalid, already used incorrectly or cannot be verified.",
          ],
        },
        {
          title: "Partner responsibility",
          items: [
            "Partners are responsible for keeping their offer, opening hours, menu and public information accurate.",
            "Partners should apply benefits only after a valid TLN Pass verification.",
          ],
        },
      ]}
    />
  );
}
