import { supabaseAdmin } from "./supabaseAdmin";

export type SiteSettings = {
  instagramUrl: string;
  tiktokUrl: string;
  supportEmail: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("*");

    if (error) {
      return {
        instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
        tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
        supportEmail: "support@tlnpass.com",
      };
    }

    const map = new Map<string, string>();

    for (const item of data || []) {
      map.set(item.key, item.value || "");
    }

    return {
      instagramUrl:
        map.get("instagram_url") ||
        process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
        "",
      tiktokUrl:
        map.get("tiktok_url") || process.env.NEXT_PUBLIC_TIKTOK_URL || "",
      supportEmail: map.get("support_email") || "support@tlnpass.com",
    };
  } catch {
    return {
      instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
      tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
      supportEmail: "support@tlnpass.com",
    };
  }
}
