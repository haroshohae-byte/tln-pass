import LegalLayout from "../components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Privacy Policy"
      updated="June 25, 2026"
      intro="This policy explains what TLN Pass stores to operate membership, payments, partner applications and QR verification."
      cards={[
        {
          title: "Privacy",
          text: "We collect only the data needed to run the membership and partner experience.",
        },
        {
          title: "Payments",
          text: "Card details are handled by Stripe. TLN Pass does not store full card numbers.",
        },
        {
          title: "QR logs",
          text: "Verification logs may be stored to protect members, partners and pass validity.",
        },
      ]}
      sections={[
        {
          title: "Data we may store",
          items: [
            "Member name, email, pass code, plan, subscription status and validity period.",
            "Device lock hash used to reduce pass sharing and screenshot misuse.",
            "Partner application details, public partner content and menu information.",
          ],
        },
        {
          title: "How data is used",
          items: [
            "To create and verify TLN Pass membership access.",
            "To manage partner applications, dashboard access and public partner pages.",
            "To support billing, refunds, cancellation questions and account support.",
          ],
        },
      ]}
    />
  );
}
