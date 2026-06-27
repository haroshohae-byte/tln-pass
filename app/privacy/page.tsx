import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import LegalLayout from "../components/LegalLayout";

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = dictionary[lang].legal.privacy;

  return <LegalLayout {...t} />;
}
