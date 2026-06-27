import { cookies } from "next/headers";
import { dictionary, normalizeLang } from "../../lib/i18n";
import { getSiteSettings } from "../../lib/siteSettings";

export default async function AnnouncementBanner() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const settings = await getSiteSettings();

  if (!settings.announcementBanner && settings.maintenanceMode !== "true") {
    return null;
  }

  return (
    <div className="bg-[#f5f5f7] px-5 py-3 text-center text-sm font-black text-[#1d1d1f] ring-1 ring-black/5">
      {settings.maintenanceMode === "true"
        ? dictionary[lang].banner.maintenance
        : settings.announcementBanner}
    </div>
  );
}
