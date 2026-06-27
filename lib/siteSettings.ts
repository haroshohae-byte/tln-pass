import { supabaseAdmin } from "./supabaseAdmin";

export type SiteSettings = {
  instagramUrl: string;
  tiktokUrl: string;
  supportEmail: string;
  businessEmail: string;
  contactPhone: string;
  mainCity: string;
  heroTitle: string;
  heroSubtitle: string;
  homepageHeroImage: string;
  contactImage: string;
  membershipPriceTexts: string;
  partnerApplicationsEnabled: string;
  stripePaymentsEnabled: string;
  maintenanceMode: string;
  announcementBanner: string;
};

const fallbackSettings: SiteSettings = {
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
  supportEmail:
    process.env.SUPPORT_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
  businessEmail:
    process.env.BUSINESS_EMAIL ||
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL ||
    process.env.SUPPORT_EMAIL ||
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
    "",
  contactPhone: "",
  mainCity: "Tallinn",
  heroTitle: "Tallinn, unlocked.",
  heroSubtitle: "",
  homepageHeroImage: "",
  contactImage: "",
  membershipPriceTexts: "",
  partnerApplicationsEnabled: "true",
  stripePaymentsEnabled: "true",
  maintenanceMode: "false",
  announcementBanner: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("*");

    if (error) {
      return fallbackSettings;
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
      supportEmail:
        map.get("support_email") ||
        process.env.SUPPORT_EMAIL ||
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
        "",
      businessEmail:
        map.get("business_email") ||
        process.env.BUSINESS_EMAIL ||
        process.env.NEXT_PUBLIC_BUSINESS_EMAIL ||
        map.get("support_email") ||
        process.env.SUPPORT_EMAIL ||
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
        "",
      contactPhone: map.get("contact_phone") || "",
      mainCity: map.get("main_city") || "Tallinn",
      heroTitle: map.get("hero_title") || "Tallinn, unlocked.",
      heroSubtitle: map.get("hero_subtitle") || "",
      homepageHeroImage: map.get("homepage_hero_image") || "",
      contactImage: map.get("contact_image") || "",
      membershipPriceTexts: map.get("membership_price_texts") || "",
      partnerApplicationsEnabled:
        map.get("partner_applications_enabled") ||
        map.get("enable_partner_applications") ||
        "true",
      stripePaymentsEnabled: map.get("stripe_payments_enabled") || "true",
      maintenanceMode: map.get("maintenance_mode") || "false",
      announcementBanner: map.get("announcement_banner") || "",
    };
  } catch {
    return fallbackSettings;
  }
}
