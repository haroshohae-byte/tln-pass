import { getSiteSettings } from "../../lib/siteSettings";

export default async function AnnouncementBanner() {
  const settings = await getSiteSettings();

  if (!settings.announcementBanner && settings.maintenanceMode !== "true") {
    return null;
  }

  return (
    <div className="bg-[#f5f5f7] px-5 py-3 text-center text-sm font-black text-[#1d1d1f] ring-1 ring-black/5">
      {settings.maintenanceMode === "true"
        ? "TLN Pass is currently in maintenance mode."
        : settings.announcementBanner}
    </div>
  );
}
