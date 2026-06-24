import { cookies } from "next/headers";
import { normalizeLang, type Lang } from "../../lib/i18n";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import PartnersClient from "./PartnersClient";

export type PartnerCard = {
  id: string;
  slug: string | null;
  business_name: string;
  category: string;
  address: string | null;
  opening_hours: string | null;
  offer: string | null;
  description: string | null;
  image_url: string | null;
  status: string;
};

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const params = await searchParams;

  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <PartnersClient
      partners={(data || []) as PartnerCard[]}
      currentLang={lang as Lang}
      initialCategory={params.category || "all"}
      initialSearch={params.search || ""}
    />
  );
}
