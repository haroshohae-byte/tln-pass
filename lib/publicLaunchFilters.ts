type PublicPartnerCandidate = {
  business_name?: string | null;
  slug?: string | null;
};

const blockedPartnerTokens = new Set(["test", "fake", "demo", "sample"]);
const blockedPartnerPhrases = ["test cafe", "fake partner", "demo partner"];

export function isPublicLaunchPartner(partner: PublicPartnerCandidate) {
  const value = [partner.business_name, partner.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!value) {
    return true;
  }

  if (blockedPartnerPhrases.some((phrase) => value.includes(phrase))) {
    return false;
  }

  const tokens = value.split(/[^a-z0-9]+/).filter(Boolean);

  return !tokens.some((token) => blockedPartnerTokens.has(token));
}
