import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import CopyButton from "../components/CopyButton";
import { dictionary, normalizeLang, type Lang } from "../../lib/i18n";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "TLN Pass Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type Member = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  pass_code?: string | null;
  status?: string | null;
  subscription_status?: string | null;
  plan?: string | null;
  plan_id?: string | null;
  valid_until?: string | null;
  current_period_end?: string | null;
  created_at?: string | null;
  device_hash?: string | null;
  last_payment_status?: string | null;
  canceled_at?: string | null;
};

type Partner = {
  id: string;
  business_name?: string | null;
  category?: string | null;
  status?: string | null;
  slug?: string | null;
  edit_token?: string | null;
  offer?: string | null;
  address?: string | null;
  opening_hours?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

type PartnerApplication = {
  id: string;
  business_name?: string | null;
  category?: string | null;
  contact_name?: string | null;
  name?: string | null;
  email?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  message?: string | null;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type UsageLog = {
  id: string;
  partner_id?: string | null;
  pass_id?: string | null;
  member_id?: string | null;
  pass_code?: string | null;
  status?: string | null;
  result?: string | null;
  qr_token?: string | null;
  user_agent?: string | null;
  created_at?: string | null;
};

type MenuItem = {
  id: string;
  partner_id?: string | null;
  is_available?: boolean | null;
  is_active?: boolean | null;
};

type PartnerPageView = {
  id: string;
  partner_id?: string | null;
  created_at?: string | null;
};

type PartnerClickEvent = {
  id: string;
  partner_id?: string | null;
  event_type?: string | null;
  created_at?: string | null;
};

type SiteSetting = {
  key: string;
  value: string | null;
};

const adminCopy = {
  en: {
    dashboard: "Dashboard",
    overview: "Dashboard overview",
    analytics: "Analytics",
    revenue: "Revenue",
    members: "Members",
    partners: "Partners",
    addPartner: "Add partner",
    applications: "Applications",
    qrLogs: "QR logs",
    siteSettings: "Site settings",
    save: "Save",
    delete: "Delete",
    approve: "Approve",
    reject: "Reject",
    public: "Public",
    active: "Active",
    pending: "Pending",
    hidden: "Hidden",
    rejected: "Rejected",
    search: "Search",
    status: "Status",
    category: "Category",
    filter: "Filter",
    logout: "Logout",
    copy: "Copy",
    copied: "Copied",
    admin: "Admin",
    secretMissingTitle: "Admin secret missing",
    secretMissingText:
      "Add ADMIN_SECRET to your environment, restart the server, then open /admin again.",
    wrongPassword: "Wrong password.",
    passwordPlaceholder: "Admin secret",
    login: "Login",
    controlCenter: "Control center",
    analyticsEyebrow: "Users, partners, QR, revenue",
    membersEyebrow: "Search, status, pass access",
    partnersEyebrow: "Directory, quality, dashboard links",
    applicationsEyebrow: "Partner requests",
    settingsEyebrow: "Website controls",
    totalMembers: "Total members",
    activeMembers: "Active members",
    trialMembers: "Trial members",
    canceledMembers: "Canceled members",
    totalPartners: "Total partners",
    approvedPartners: "Approved partners",
    pendingPartners: "Pending partners",
    hiddenPartners: "Hidden partners",
    rejectedPartners: "Rejected partners",
    waitingApplications: "Waiting applications",
    partnersMissingInfo: "Partners missing info",
    totalQrScans: "Total QR scans",
    todayQrScans: "Today QR scans",
    partnerClicks: "Partner clicks",
    mrr: "MRR",
    failedPayments: "Failed payments",
    userAnalytics: "User analytics",
    partnerAnalytics: "Partner analytics",
    qrAnalytics: "QR analytics",
    revenueAnalytics: "Revenue analytics",
    newToday: "New today",
    new7Days: "New 7 days",
    newMonth: "New month",
    inactive: "Inactive",
    canceled: "Canceled",
    trial: "Trial",
    pageViews: "Page views",
    buttonClicks: "Button clicks",
    mapsClicks: "Maps clicks",
    getPassClicks: "Get pass clicks",
    mostPopularPartners: "Most popular partners",
    mostClickedPartners: "Most clicked partners",
    noPageViews: "No page views",
    highViewsLowQr: "High views, low QR",
    views: "views",
    noDataYet: "No data yet.",
    today: "Today",
    sevenDays: "7 days",
    thirtyDays: "30 days",
    allTime: "All time",
    partnerName: "Partner name",
    unknownPartner: "Unknown partner",
    notLinked: "not linked",
    pass: "Pass",
    device: "Device",
    notTrackedYet: "not tracked yet",
    noQrLogs: "No QR logs for this period.",
    totalRevenue: "Total revenue",
    todayRevenue: "Today revenue",
    monthRevenue: "Month revenue",
    mrrForecast: "MRR forecast",
    refunds: "Refunds",
    avgRevenueUser: "Avg revenue/user",
    canceledSubs: "Canceled subs",
    revenueWebhook: "Stripe webhook",
    revenueWarning:
      "Accurate revenue analytics needs Stripe webhook events for paid invoices, refunds, cancellations and failed payments.",
    resetDeviceLock: "Reset device lock",
    openPass: "Open pass",
    noMembersFound: "No members found.",
    registered: "Registered",
    validUntil: "Valid until",
    linked: "linked",
    payment: "Payment",
    noEmail: "No email",
    noPlan: "no plan",
    copyPassCode: "Copy pass code",
    menuItems: "Menu items",
    qrUses: "QR uses",
    checklist: {
      photo: "photo",
      address: "address",
      offer: "offer",
      hours: "hours",
      phone: "phone",
      website: "website",
      instagram: "instagram",
      menu: "menu",
    },
    copyDashboardLink: "Copy dashboard link",
    newDashboardLink: "New dashboard link",
    noPartnersFound: "No partners found.",
    businessName: "Business name",
    slugPlaceholder: "slug-example",
    offerPlaceholder: "Offer",
    createPartner: "Create partner",
    application: "Application",
    emailPartner: "Email partner",
    noApplicationsYet: "No applications yet.",
    enabled: "enabled",
    disabled: "disabled",
    allStatuses: "all statuses",
    allCategories: "all categories",
    noCategory: "No category",
    noAddress: "No address",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    address: "Address",
    date: "Date",
    statusLabels: {
      active: "Active",
      trialing: "Trialing",
      inactive: "Inactive",
      canceled: "Canceled",
      past_due: "Past due",
      approved: "Approved",
      pending: "Pending",
      hidden: "Hidden",
      rejected: "Rejected",
      allowed: "Allowed",
      denied: "Denied",
      expired: "Expired",
      "already used": "Already used",
      invalid: "Invalid",
      unknown: "Unknown",
    },
    categoryLabels: {
      restaurants: "Restaurants",
      cafes: "Cafes",
      bars: "Bars",
      fitness: "Fitness",
      beauty: "Beauty",
      entertainment: "Entertainment",
      events: "Events",
    },
  },
  ru: {
    dashboard: "Панель",
    overview: "Обзор",
    analytics: "Аналитика",
    revenue: "Доход",
    members: "Пользователи",
    partners: "Партнёры",
    addPartner: "Добавить партнёра",
    applications: "Заявки",
    qrLogs: "QR проверки",
    siteSettings: "Настройки сайта",
    save: "Сохранить",
    delete: "Удалить",
    approve: "Одобрить",
    reject: "Отклонить",
    public: "Публичная",
    active: "Активные",
    pending: "Ожидают",
    hidden: "Скрытые",
    rejected: "Отклонённые",
    search: "Поиск",
    status: "Статус",
    category: "Категория",
    filter: "Фильтр",
    logout: "Выйти",
    copy: "Копировать",
    copied: "Скопировано",
    admin: "Админ",
    secretMissingTitle: "Admin secret не найден",
    secretMissingText:
      "Добавьте ADMIN_SECRET в окружение, перезапустите сервер и снова откройте /admin.",
    wrongPassword: "Неверный пароль.",
    passwordPlaceholder: "Admin secret",
    login: "Войти",
    controlCenter: "Центр управления",
    analyticsEyebrow: "Пользователи, партнёры, QR, доход",
    membersEyebrow: "Поиск, статус, доступ к pass",
    partnersEyebrow: "Каталог, качество, dashboard-ссылки",
    applicationsEyebrow: "Заявки партнёров",
    settingsEyebrow: "Настройки сайта",
    totalMembers: "Всего участников",
    activeMembers: "Активные участники",
    trialMembers: "Пробные участники",
    canceledMembers: "Отменённые участники",
    totalPartners: "Всего партнёров",
    approvedPartners: "Одобренные партнёры",
    pendingPartners: "Ожидают",
    hiddenPartners: "Скрытые партнёры",
    rejectedPartners: "Отклонённые партнёры",
    waitingApplications: "Заявки в ожидании",
    partnersMissingInfo: "Партнёры без данных",
    totalQrScans: "Всего QR-сканов",
    todayQrScans: "QR-сканы сегодня",
    partnerClicks: "Клики партнёров",
    mrr: "MRR",
    failedPayments: "Неудачные платежи",
    userAnalytics: "Аналитика пользователей",
    partnerAnalytics: "Аналитика партнёров",
    qrAnalytics: "QR аналитика",
    revenueAnalytics: "Аналитика дохода",
    newToday: "Новые сегодня",
    new7Days: "Новые за 7 дней",
    newMonth: "Новые за месяц",
    inactive: "Неактивные",
    canceled: "Отменённые",
    trial: "Пробные",
    pageViews: "Просмотры страниц",
    buttonClicks: "Клики кнопок",
    mapsClicks: "Клики Maps",
    getPassClicks: "Клики Get pass",
    mostPopularPartners: "Самые популярные партнёры",
    mostClickedPartners: "Самые кликаемые партнёры",
    noPageViews: "Нет просмотров",
    highViewsLowQr: "Много просмотров, мало QR",
    views: "просмотров",
    noDataYet: "Данных пока нет.",
    today: "Сегодня",
    sevenDays: "7 дней",
    thirtyDays: "30 дней",
    allTime: "Всё время",
    partnerName: "Название партнёра",
    unknownPartner: "Неизвестный партнёр",
    notLinked: "не связан",
    pass: "Pass",
    device: "Устройство",
    notTrackedYet: "пока не отслежено",
    noQrLogs: "Нет QR-логов за этот период.",
    totalRevenue: "Общий доход",
    todayRevenue: "Доход сегодня",
    monthRevenue: "Доход за месяц",
    mrrForecast: "Прогноз MRR",
    refunds: "Возвраты",
    avgRevenueUser: "Средний доход/пользователь",
    canceledSubs: "Отменённые подписки",
    revenueWebhook: "Stripe webhook",
    revenueWarning:
      "Точная аналитика дохода требует Stripe webhook events для оплаченных invoices, возвратов, отмен и неудачных платежей.",
    resetDeviceLock: "Сбросить привязку устройства",
    openPass: "Открыть pass",
    noMembersFound: "Участники не найдены.",
    registered: "Регистрация",
    validUntil: "Действует до",
    linked: "связано",
    payment: "Платёж",
    noEmail: "Нет email",
    noPlan: "нет тарифа",
    copyPassCode: "Копировать код pass",
    menuItems: "Пункты меню",
    qrUses: "QR-использования",
    checklist: {
      photo: "фото",
      address: "адрес",
      offer: "оффер",
      hours: "часы",
      phone: "телефон",
      website: "сайт",
      instagram: "instagram",
      menu: "меню",
    },
    copyDashboardLink: "Копировать dashboard-ссылку",
    newDashboardLink: "Новая dashboard-ссылка",
    noPartnersFound: "Партнёры не найдены.",
    businessName: "Название бизнеса",
    slugPlaceholder: "slug-example",
    offerPlaceholder: "Оффер",
    createPartner: "Создать партнёра",
    application: "Заявка",
    emailPartner: "Написать партнёру",
    noApplicationsYet: "Заявок пока нет.",
    enabled: "включено",
    disabled: "выключено",
    allStatuses: "все статусы",
    allCategories: "все категории",
    noCategory: "Нет категории",
    noAddress: "Нет адреса",
    contact: "Контакт",
    email: "Email",
    phone: "Телефон",
    address: "Адрес",
    date: "Дата",
    statusLabels: {
      active: "Активный",
      trialing: "Пробный",
      inactive: "Неактивный",
      canceled: "Отменён",
      past_due: "Просрочен",
      approved: "Одобрен",
      pending: "Ожидает",
      hidden: "Скрыт",
      rejected: "Отклонён",
      allowed: "Разрешён",
      denied: "Отклонён",
      expired: "Истёк",
      "already used": "Уже использован",
      invalid: "Недействителен",
      unknown: "Неизвестно",
    },
    categoryLabels: {
      restaurants: "Рестораны",
      cafes: "Кафе",
      bars: "Бары",
      fitness: "Фитнес",
      beauty: "Красота",
      entertainment: "Развлечения",
      events: "События",
    },
  },
  ee: {
    dashboard: "Töölaud",
    overview: "Ülevaade",
    analytics: "Analüütika",
    revenue: "Tulu",
    members: "Liikmed",
    partners: "Partnerid",
    addPartner: "Lisa partner",
    applications: "Taotlused",
    qrLogs: "QR logid",
    siteSettings: "Saidi seaded",
    save: "Salvesta",
    delete: "Kustuta",
    approve: "Kinnita",
    reject: "Lükka tagasi",
    public: "Avalik",
    active: "Aktiivne",
    pending: "Ootel",
    hidden: "Peidetud",
    rejected: "Tagasi lükatud",
    search: "Otsi",
    status: "Staatus",
    category: "Kategooria",
    filter: "Filtreeri",
    logout: "Logi välja",
    copy: "Kopeeri",
    copied: "Kopeeritud",
    admin: "Admin",
    secretMissingTitle: "Admin secret puudub",
    secretMissingText:
      "Lisa ADMIN_SECRET keskkonda, käivita server uuesti ja ava /admin uuesti.",
    wrongPassword: "Vale parool.",
    passwordPlaceholder: "Admin secret",
    login: "Logi sisse",
    controlCenter: "Juhtimiskeskus",
    analyticsEyebrow: "Kasutajad, partnerid, QR, tulu",
    membersEyebrow: "Otsing, staatus, passi ligipääs",
    partnersEyebrow: "Kataloog, kvaliteet, dashboardi lingid",
    applicationsEyebrow: "Partneritaotlused",
    settingsEyebrow: "Saidi seaded",
    totalMembers: "Liikmeid kokku",
    activeMembers: "Aktiivsed liikmed",
    trialMembers: "Prooviliikmed",
    canceledMembers: "Tühistatud liikmed",
    totalPartners: "Partnereid kokku",
    approvedPartners: "Kinnitatud partnerid",
    pendingPartners: "Ootel partnerid",
    hiddenPartners: "Peidetud partnerid",
    rejectedPartners: "Tagasi lükatud partnerid",
    waitingApplications: "Ootel taotlused",
    partnersMissingInfo: "Puuduliku infoga partnerid",
    totalQrScans: "QR-skaneeringuid kokku",
    todayQrScans: "QR-skaneeringud täna",
    partnerClicks: "Partnerite klikid",
    mrr: "MRR",
    failedPayments: "Ebaõnnestunud maksed",
    userAnalytics: "Kasutajate analüütika",
    partnerAnalytics: "Partnerite analüütika",
    qrAnalytics: "QR analüütika",
    revenueAnalytics: "Tulu analüütika",
    newToday: "Uued täna",
    new7Days: "Uued 7 päeva",
    newMonth: "Uued kuus",
    inactive: "Mitteaktiivsed",
    canceled: "Tühistatud",
    trial: "Proov",
    pageViews: "Lehe vaatamised",
    buttonClicks: "Nupuklikid",
    mapsClicks: "Maps klikid",
    getPassClicks: "Get pass klikid",
    mostPopularPartners: "Kõige populaarsemad partnerid",
    mostClickedPartners: "Kõige klikitumad partnerid",
    noPageViews: "Lehevaatamisi pole",
    highViewsLowQr: "Palju vaatamisi, vähe QR-i",
    views: "vaatamist",
    noDataYet: "Andmeid veel pole.",
    today: "Täna",
    sevenDays: "7 päeva",
    thirtyDays: "30 päeva",
    allTime: "Kogu aeg",
    partnerName: "Partneri nimi",
    unknownPartner: "Tundmatu partner",
    notLinked: "pole seotud",
    pass: "Pass",
    device: "Seade",
    notTrackedYet: "pole veel jälgitud",
    noQrLogs: "Selle perioodi QR-logisid pole.",
    totalRevenue: "Kogutulu",
    todayRevenue: "Tänane tulu",
    monthRevenue: "Kuu tulu",
    mrrForecast: "MRR prognoos",
    refunds: "Tagastused",
    avgRevenueUser: "Keskmine tulu/kasutaja",
    canceledSubs: "Tühistatud tellimused",
    revenueWebhook: "Stripe webhook",
    revenueWarning:
      "Täpne tuluanalüütika vajab Stripe webhook sündmusi makstud arvete, tagastuste, tühistamiste ja ebaõnnestunud maksete jaoks.",
    resetDeviceLock: "Lähtesta seadmelukk",
    openPass: "Ava pass",
    noMembersFound: "Liikmeid ei leitud.",
    registered: "Registreeritud",
    validUntil: "Kehtib kuni",
    linked: "seotud",
    payment: "Makse",
    noEmail: "Email puudub",
    noPlan: "paketti pole",
    copyPassCode: "Kopeeri passikood",
    menuItems: "Menüü kirjed",
    qrUses: "QR kasutused",
    checklist: {
      photo: "foto",
      address: "aadress",
      offer: "pakkumine",
      hours: "ajad",
      phone: "telefon",
      website: "veeb",
      instagram: "instagram",
      menu: "menüü",
    },
    copyDashboardLink: "Kopeeri dashboardi link",
    newDashboardLink: "Uus dashboardi link",
    noPartnersFound: "Partnereid ei leitud.",
    businessName: "Äri nimi",
    slugPlaceholder: "slug-example",
    offerPlaceholder: "Pakkumine",
    createPartner: "Loo partner",
    application: "Taotlus",
    emailPartner: "Kirjuta partnerile",
    noApplicationsYet: "Taotlusi veel pole.",
    enabled: "lubatud",
    disabled: "keelatud",
    allStatuses: "kõik staatused",
    allCategories: "kõik kategooriad",
    noCategory: "Kategooriat pole",
    noAddress: "Aadress puudub",
    contact: "Kontakt",
    email: "Email",
    phone: "Telefon",
    address: "Aadress",
    date: "Kuupäev",
    statusLabels: {
      active: "Aktiivne",
      trialing: "Proov",
      inactive: "Mitteaktiivne",
      canceled: "Tühistatud",
      past_due: "Maksetähtaeg möödas",
      approved: "Kinnitatud",
      pending: "Ootel",
      hidden: "Peidetud",
      rejected: "Tagasi lükatud",
      allowed: "Lubatud",
      denied: "Keelatud",
      expired: "Aegunud",
      "already used": "Juba kasutatud",
      invalid: "Kehtetu",
      unknown: "Teadmata",
    },
    categoryLabels: {
      restaurants: "Restoranid",
      cafes: "Kohvikud",
      bars: "Baarid",
      fitness: "Fitness",
      beauty: "Ilu",
      entertainment: "Meelelahutus",
      events: "Üritused",
    },
  },
} as const;

type AdminText = (typeof adminCopy)[Lang];

function adminStatusLabel(t: AdminText, status?: string | null) {
  const value = String(status || "unknown");
  return t.statusLabels[value as keyof typeof t.statusLabels] || value;
}

function adminCategoryLabel(t: AdminText, category: string) {
  return t.categoryLabels[category as keyof typeof t.categoryLabels] || category;
}

const memberStatuses = ["active", "trialing", "inactive", "canceled", "past_due"];
const partnerStatuses = ["approved", "pending", "hidden", "rejected"];
const partnerCategories = [
  "restaurants",
  "cafes",
  "bars",
  "fitness",
  "beauty",
  "entertainment",
  "events",
];
const siteSettingKeys = [
  "instagram_url",
  "tiktok_url",
  "support_email",
  "business_email",
  "contact_phone",
  "main_city",
  "hero_title",
  "hero_subtitle",
  "homepage_hero_image",
  "contact_image",
  "membership_price_texts",
  "partner_applications_enabled",
  "enable_partner_applications",
  "stripe_payments_enabled",
  "maintenance_mode",
  "announcement_banner",
];

function adminSecret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.TLN_ADMIN_SECRET ||
    ""
  );
}

async function isAdmin() {
  const cookieStore = await cookies();
  const saved = cookieStore.get("tln_admin_secret")?.value;
  const secret = adminSecret();

  return Boolean(secret && saved && saved === secret);
}

async function adminLogin(formData: FormData) {
  "use server";

  const password = String(formData.get("password") || "");
  const secret = adminSecret();

  if (!secret || password !== secret) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("tln_admin_secret", secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

async function adminLogout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("tln_admin_secret");

  redirect("/admin");
}

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }
}

function normalizeManagedTable(value: string) {
  return value === "members" ? "members" : "member_passes";
}

async function updateMemberStatus(formData: FormData) {
  "use server";

  await requireAdmin();

  const table = normalizeManagedTable(String(formData.get("member_table") || ""));
  const memberId = String(formData.get("member_id") || "");
  const status = String(formData.get("subscription_status") || "inactive");
  const column = table === "members" ? "subscription_status" : "status";

  if (!memberStatuses.includes(status)) {
    throw new Error("Invalid member status");
  }

  const { error } = await supabaseAdmin
    .from(table)
    .update({ [column]: status, updated_at: new Date().toISOString() })
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

async function resetDeviceLock(formData: FormData) {
  "use server";

  await requireAdmin();

  const table = normalizeManagedTable(String(formData.get("member_table") || ""));
  const memberId = String(formData.get("member_id") || "");

  const { error } = await supabaseAdmin
    .from(table)
    .update({ device_hash: null, updated_at: new Date().toISOString() })
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

async function updatePartnerStatus(formData: FormData) {
  "use server";

  await requireAdmin();

  const partnerId = String(formData.get("partner_id") || "");
  const status = String(formData.get("status") || "approved");

  if (!partnerStatuses.includes(status)) {
    throw new Error("Invalid partner status");
  }

  const { error } = await supabaseAdmin
    .from("partners")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", partnerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/partners");
}

async function regeneratePartnerToken(formData: FormData) {
  "use server";

  await requireAdmin();

  const partnerId = String(formData.get("partner_id") || "");

  const { error } = await supabaseAdmin
    .from("partners")
    .update({ edit_token: crypto.randomUUID(), updated_at: new Date().toISOString() })
    .eq("id", partnerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

async function deletePartner(formData: FormData) {
  "use server";

  await requireAdmin();

  const partnerId = String(formData.get("partner_id") || "");

  await supabaseAdmin
    .from("partner_menu_items")
    .delete()
    .eq("partner_id", partnerId);

  const { error } = await supabaseAdmin
    .from("partners")
    .delete()
    .eq("id", partnerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/partners");
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createPartner(formData: FormData) {
  "use server";

  await requireAdmin();

  const businessName = String(formData.get("business_name") || "").trim();

  if (!businessName) {
    throw new Error("Business name is required");
  }

  const payload = {
    business_name: businessName,
    category: String(formData.get("category") || "restaurants").trim(),
    slug: slugify(String(formData.get("slug") || businessName)) || null,
    address: String(formData.get("address") || "").trim() || null,
    offer: String(formData.get("offer") || "").trim() || null,
    status: String(formData.get("status") || "approved"),
    edit_token: crypto.randomUUID(),
  };

  const { error } = await supabaseAdmin.from("partners").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/partners");
}

async function approveApplication(formData: FormData) {
  "use server";

  await requireAdmin();

  const applicationId = String(formData.get("application_id") || "");

  const { data: application, error: getError } = await supabaseAdmin
    .from("partner_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();

  if (getError) {
    throw new Error(getError.message);
  }

  if (!application) {
    throw new Error("Application not found");
  }

  const businessName = String(application.business_name || "New partner").trim();
  const editToken = crypto.randomUUID();

  const { error: insertError } = await supabaseAdmin.from("partners").insert({
    business_name: businessName,
    category: application.category || "restaurants",
    address: application.address || null,
    phone: application.phone || null,
    website: application.website || null,
    instagram: application.instagram || null,
    opening_hours: application.opening_hours || null,
    offer: application.offer || null,
    description: application.description || application.message || null,
    status: "approved",
    slug: slugify(businessName) || null,
    edit_token: editToken,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  await supabaseAdmin
    .from("partner_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  revalidatePath("/admin");
  revalidatePath("/partners");
}

async function rejectApplication(formData: FormData) {
  "use server";

  await requireAdmin();

  const applicationId = String(formData.get("application_id") || "");

  const { error } = await supabaseAdmin
    .from("partner_applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

async function updateSiteSetting(formData: FormData) {
  "use server";

  await requireAdmin();

  const key = String(formData.get("key") || "");
  const value = String(formData.get("value") || "");

  if (!siteSettingKeys.includes(key)) {
    throw new Error("Invalid site setting");
  }

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/contact");
}

async function safeSelect<T>(
  table: string,
  query: (
    builder: ReturnType<typeof supabaseAdmin.from>
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  fallback: T
): Promise<T> {
  try {
    const result = await query(supabaseAdmin.from(table));

    if (result.error) {
      return fallback;
    }

    return result.data as T;
  } catch {
    return fallback;
  }
}

async function fetchMembers() {
  const passes = await safeSelect<Member[] | null>(
    "member_passes",
    (q) => q.select("*").order("created_at", { ascending: false }).limit(250),
    null
  );

  if (passes) {
    return { table: "member_passes", rows: passes };
  }

  const rows = await safeSelect<Member[]>(
    "members",
    (q) => q.select("*").order("created_at", { ascending: false }).limit(250),
    []
  );

  return { table: "members", rows };
}

function formatDate(value?: string | null) {
  if (!value) {
    return "n/a";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "n/a";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function isWithin(value: string | null | undefined, days: number) {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function isToday(value?: string | null) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function memberStatus(member: Member) {
  return member.status || member.subscription_status || "inactive";
}

function memberPlan(member: Member) {
  const value = `${member.plan_id || member.plan || ""}`.toLowerCase();

  if (value.includes("14") || value.includes("starter")) {
    return "14day";
  }

  if (value.includes("6") || value.includes("half")) {
    return "6months";
  }

  if (value.includes("year")) {
    return "yearly";
  }

  if (value.includes("month")) {
    return "monthly";
  }

  return "monthly";
}

function planPrice(planId: string) {
  if (planId === "14day") {
    return 7.99;
  }

  if (planId === "6months") {
    return 99;
  }

  if (planId === "yearly") {
    return 179;
  }

  return 19.99;
}

function planMonthlyValue(planId: string) {
  if (planId === "6months") {
    return 99 / 6;
  }

  if (planId === "yearly") {
    return 179 / 12;
  }

  if (planId === "14day") {
    return 0;
  }

  return 19.99;
}

function euro(value: number) {
  return `€${value.toFixed(2)}`;
}

function publicPartnerUrl(partner: Partner) {
  return `/partners/${partner.slug || partner.id}`;
}

function partnerDashboardUrl(partner: Partner) {
  return partner.edit_token ? `/partner-dashboard/${partner.edit_token}` : "";
}

function countBy<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);

    if (!key) {
      continue;
    }

    map.set(key, (map.get(key) || 0) + 1);
  }

  return map;
}

function categoryKey(value?: string | null) {
  const category = String(value || "").toLowerCase();

  if (category.includes("restaurant") || category.includes("restoran")) return "restaurants";
  if (category.includes("cafe") || category.includes("coffee") || category.includes("kohvik")) return "cafes";
  if (category.includes("bar") || category.includes("pub")) return "bars";
  if (category.includes("fitness") || category.includes("gym") || category.includes("sport")) return "fitness";
  if (category.includes("beauty") || category.includes("spa") || category.includes("salon")) return "beauty";
  if (category.includes("event") || category.includes("club")) return "events";
  return "entertainment";
}

function qrStatus(log: UsageLog) {
  const value = log.status || log.result || "unknown";

  if (value === "active") return "allowed";
  if (value === "expired_qr" || value === "expired") return "expired";
  if (value === "inactive_pass") return "denied";
  if (value === "already_used") return "already used";

  return value;
}

function baseUrlFromHeaders(host: string | null) {
  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  }

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.startsWith("192.168.") ||
    host.startsWith("10.");

  return `${isLocal ? "http" : "https"}://${host}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    member_search?: string;
    member_status?: string;
    partner_search?: string;
    partner_status?: string;
    partner_category?: string;
    qr_range?: string;
  }>;
}) {
  const params = await searchParams;
  const secret = adminSecret();
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const t = adminCopy[lang as Lang];
  const planText = dictionary[lang].plans.items;

  if (!secret) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
        <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
          <h1 className="text-4xl font-black">{t.secretMissingTitle}</h1>
          <p className="mt-4 leading-7 text-zinc-600">
            {t.secretMissingText}
          </p>
        </section>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f]">
        <section className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-400">
            TLN Pass
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight">
            {t.admin}
          </h1>

          {params.error && (
            <p className="mt-4 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
              {t.wrongPassword}
            </p>
          )}

          <form action={adminLogin} className="mt-6 grid gap-4">
            <input
        suppressHydrationWarning
              name="password"
              type="password"
              placeholder={t.passwordPlaceholder}
              className="rounded-2xl border border-black/10 bg-zinc-100 px-5 py-4 font-bold outline-none focus:bg-white"
              required
            />

            <button className="rounded-full bg-black px-6 py-4 font-black text-white">
              {t.login}
            </button>
          </form>
        </section>
      </main>
    );
  }

  const headersList = await headers();
  const baseUrl = baseUrlFromHeaders(headersList.get("host"));

  const [
    memberResult,
    partners,
    applications,
    usageLogs,
    menuItems,
    pageViews,
    clickEvents,
    settings,
  ] = await Promise.all([
    fetchMembers(),
    safeSelect<Partner[]>(
      "partners",
      (q) => q.select("*").order("created_at", { ascending: false }).limit(250),
      []
    ),
    safeSelect<PartnerApplication[]>(
      "partner_applications",
      (q) => q.select("*").order("created_at", { ascending: false }).limit(100),
      []
    ),
    safeSelect<UsageLog[]>(
      "pass_usage_logs",
      (q) => q.select("*").order("created_at", { ascending: false }).limit(250),
      []
    ),
    safeSelect<MenuItem[]>(
      "partner_menu_items",
      (q) => q.select("*").limit(1000),
      []
    ),
    safeSelect<PartnerPageView[]>(
      "partner_page_views",
      (q) => q.select("*").order("created_at", { ascending: false }).limit(1000),
      []
    ),
    safeSelect<PartnerClickEvent[]>(
      "partner_click_events",
      (q) => q.select("*").order("created_at", { ascending: false }).limit(1000),
      []
    ),
    safeSelect<SiteSetting[]>(
      "site_settings",
      (q) => q.select("key,value").order("key"),
      []
    ),
  ]);

  const members = memberResult.rows;
  const memberTable = memberResult.table;
  const menuCountByPartner = countBy(menuItems, (item) => item.partner_id);
  const qrCountByPartner = countBy(usageLogs, (log) => log.partner_id);
  const viewCountByPartner = countBy(pageViews, (view) => view.partner_id);
  const clickCountByPartner = countBy(clickEvents, (event) => event.partner_id);
  const partnerNameById = new Map(
    partners.map((partner) => [partner.id, partner.business_name || "Partner"])
  );

  const memberSearch = String(params.member_search || "").toLowerCase();
  const memberStatusFilter = String(params.member_status || "all");
  const partnerSearch = String(params.partner_search || "").toLowerCase();
  const partnerStatusFilter = String(params.partner_status || "all");
  const partnerCategoryFilter = String(params.partner_category || "all");
  const qrRange = String(params.qr_range || "7");

  const activeMembers = members.filter((member) =>
    ["active", "trialing"].includes(memberStatus(member))
  );
  const trialMembers = members.filter((member) => memberStatus(member) === "trialing");
  const canceledMembers = members.filter((member) => memberStatus(member) === "canceled");
  const failedPayments = members.filter((member) =>
    ["failed", "past_due", "unpaid"].includes(
      member.last_payment_status || memberStatus(member)
    )
  );
  const approvedPartners = partners.filter((partner) => partner.status === "approved");
  const pendingPartners = partners.filter((partner) => partner.status === "pending");
  const hiddenPartners = partners.filter((partner) => partner.status === "hidden");
  const rejectedPartners = partners.filter((partner) => partner.status === "rejected");
  const waitingApplications = applications.filter(
    (application) => (application.status || "pending") === "pending"
  );
  const partnersMissingImportantInfo = partners.filter(
    (partner) =>
      !partner.image_url ||
      !partner.address ||
      !partner.offer ||
      !partner.opening_hours ||
      (menuCountByPartner.get(partner.id) || 0) === 0
  );
  const todayQrScans = usageLogs.filter((log) => isToday(log.created_at));
  const qrStatusBreakdown = countBy(usageLogs, (log) => qrStatus(log));
  const clickTypeBreakdown = countBy(clickEvents, (event) => event.event_type);
  const activeRevenueMembers = activeMembers.filter(
    (member) => memberStatus(member) !== "trialing"
  );
  const revenueEstimate = activeRevenueMembers.reduce(
    (sum, member) => sum + planPrice(memberPlan(member)),
    0
  );
  const mrrEstimate = activeRevenueMembers.reduce(
    (sum, member) => sum + planMonthlyValue(memberPlan(member)),
    0
  );

  const planCounts = {
    "14day": members.filter((member) => memberPlan(member) === "14day").length,
    monthly: members.filter((member) => memberPlan(member) === "monthly").length,
    "6months": members.filter((member) => memberPlan(member) === "6months").length,
    yearly: members.filter((member) => memberPlan(member) === "yearly").length,
  };

  const filteredMembers = members.filter((member) => {
    const status = memberStatus(member);
    const searchText = [
      member.email,
      member.full_name,
      member.pass_code,
      member.plan,
      member.plan_id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!memberSearch || searchText.includes(memberSearch)) &&
      (memberStatusFilter === "all" || status === memberStatusFilter)
    );
  });

  const filteredPartners = partners.filter((partner) => {
    const searchText = [
      partner.business_name,
      partner.category,
      partner.address,
      partner.offer,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!partnerSearch || searchText.includes(partnerSearch)) &&
      (partnerStatusFilter === "all" || partner.status === partnerStatusFilter) &&
      (partnerCategoryFilter === "all" ||
        categoryKey(partner.category) === partnerCategoryFilter)
    );
  });

  const filteredQrLogs = usageLogs.filter((log) => {
    if (qrRange === "all") {
      return true;
    }

    if (qrRange === "today") {
      return isToday(log.created_at);
    }

    return isWithin(log.created_at, Number(qrRange || 7));
  });

  const popularPartners = [...partners]
    .sort((a, b) => {
      const aScore = (qrCountByPartner.get(a.id) || 0) + (viewCountByPartner.get(a.id) || 0);
      const bScore = (qrCountByPartner.get(b.id) || 0) + (viewCountByPartner.get(b.id) || 0);
      return bScore - aScore;
    })
    .slice(0, 6);

  const partnersWithoutViews = partners.filter(
    (partner) => (viewCountByPartner.get(partner.id) || 0) === 0
  );
  const highViewsLowQr = partners.filter(
    (partner) =>
      (viewCountByPartner.get(partner.id) || 0) >= 5 &&
      (qrCountByPartner.get(partner.id) || 0) <= 1
  );
  const categoryStats = partnerCategories.map((category) => ({
    category,
    count: partners.filter((partner) => categoryKey(partner.category) === category).length,
  }));

  const settingMap = new Map(settings.map((item) => [item.key, item.value || ""]));

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 text-[#1d1d1f]">
      <section className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-400">
              TLN Pass
            </p>

            <h1 className="mt-3 text-6xl font-black tracking-tight md:text-8xl">
              {t.dashboard}
            </h1>
          </div>

          <form action={adminLogout}>
            <button className="rounded-full bg-black px-6 py-4 font-black text-white">
              {t.logout}
            </button>
          </form>
        </div>

        <nav className="mt-8 flex gap-2 overflow-x-auto rounded-full bg-white p-2 shadow-sm ring-1 ring-black/5">
          {[
            [t.overview, "#overview"],
            [t.analytics, "#analytics"],
            [t.members, "#members"],
            [t.partners, "#partners"],
            [t.applications, "#applications"],
            [t.siteSettings, "#settings"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="min-w-max rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-zinc-700 transition hover:bg-black hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <section id="overview" className="mt-8 scroll-mt-28">
          <SectionHeading title={t.overview} eyebrow={t.controlCenter} />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <Stat label={t.totalMembers} value={members.length} />
            <Stat label={t.activeMembers} value={activeMembers.length} />
            <Stat label={t.trialMembers} value={trialMembers.length} />
            <Stat label={t.canceledMembers} value={canceledMembers.length} />
            <Stat label={t.totalPartners} value={partners.length} />
            <Stat label={t.approvedPartners} value={approvedPartners.length} />
            <Stat label={t.pendingPartners} value={pendingPartners.length} />
            <Stat label={t.hiddenPartners} value={hiddenPartners.length} />
            <Stat label={t.rejectedPartners} value={rejectedPartners.length} />
            <Stat label={t.waitingApplications} value={waitingApplications.length} />
            <Stat
              label={t.partnersMissingInfo}
              value={partnersMissingImportantInfo.length}
              tone="danger"
            />
            <Stat label={t.totalQrScans} value={usageLogs.length} />
            <Stat label={t.todayQrScans} value={todayQrScans.length} />
            <Stat label={t.partnerClicks} value={clickEvents.length} />
            <Stat label={t.revenue} value={euro(revenueEstimate)} />
            <Stat label={t.mrr} value={euro(mrrEstimate)} />
            <Stat label={t.failedPayments} value={failedPayments.length} tone="danger" />
          </div>
        </section>

        <section id="analytics" className="mt-10 scroll-mt-28">
          <SectionHeading title={t.analytics} eyebrow={t.analyticsEyebrow} />
          <div className="mt-5 grid gap-6 xl:grid-cols-2">
            <Panel title={t.userAnalytics}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MiniStat label={t.newToday} value={members.filter((m) => isToday(m.created_at)).length} />
                <MiniStat label={t.new7Days} value={members.filter((m) => isWithin(m.created_at, 7)).length} />
                <MiniStat label={t.newMonth} value={members.filter((m) => isWithin(m.created_at, 30)).length} />
                <MiniStat label={t.active} value={activeMembers.length} />
                <MiniStat label={t.inactive} value={members.length - activeMembers.length} />
                <MiniStat label={t.canceled} value={canceledMembers.length} />
                <MiniStat label={t.trial} value={trialMembers.length} />
                <MiniStat label={planText["14day"].duration} value={planCounts["14day"]} />
                <MiniStat label={planText.monthly.name} value={planCounts.monthly} />
                <MiniStat label={planText["6months"].name} value={planCounts["6months"]} />
                <MiniStat label={planText.yearly.name} value={planCounts.yearly} />
              </div>
            </Panel>

            <Panel title={t.partnerAnalytics}>
              <div className="grid gap-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoryStats.map((item) => (
                    <MiniStat
                      key={item.category}
                      label={adminCategoryLabel(t, item.category)}
                      value={item.count}
                    />
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <MiniStat label={t.pageViews} value={pageViews.length} />
                  <MiniStat label={t.buttonClicks} value={clickEvents.length} />
                  <MiniStat label={t.mapsClicks} value={clickTypeBreakdown.get("maps_click") || 0} />
                  <MiniStat label={t.getPassClicks} value={clickTypeBreakdown.get("get_pass_click") || 0} />
                </div>

                <AnalyticsList
                  title={t.mostPopularPartners}
                  emptyText={t.noDataYet}
                  items={popularPartners.map((partner) => ({
                    title: partner.business_name || "Partner",
                    meta: `${viewCountByPartner.get(partner.id) || 0} ${t.views} · ${qrCountByPartner.get(partner.id) || 0} QR`,
                  }))}
                />

                <AnalyticsList
                  title={t.mostClickedPartners}
                  emptyText={t.noDataYet}
                  items={[...partners]
                    .sort(
                      (a, b) =>
                        (clickCountByPartner.get(b.id) || 0) -
                        (clickCountByPartner.get(a.id) || 0)
                    )
                    .slice(0, 6)
                    .map((partner) => ({
                      title: partner.business_name || "Partner",
                      meta: `${clickCountByPartner.get(partner.id) || 0} ${t.buttonClicks.toLowerCase()}`,
                    }))}
                />

                <AnalyticsList
                  title={t.noPageViews}
                  emptyText={t.noDataYet}
                  items={partnersWithoutViews.slice(0, 6).map((partner) => ({
                    title: partner.business_name || "Partner",
                    meta: partner.category || t.noCategory,
                  }))}
                />

                <AnalyticsList
                  title={t.highViewsLowQr}
                  emptyText={t.noDataYet}
                  items={highViewsLowQr.slice(0, 6).map((partner) => ({
                    title: partner.business_name || "Partner",
                    meta: `${viewCountByPartner.get(partner.id) || 0} ${t.views} · ${qrCountByPartner.get(partner.id) || 0} QR`,
                  }))}
                />
              </div>
            </Panel>

            <Panel title={t.qrAnalytics}>
              <form className="mb-5 flex flex-wrap gap-2">
                <select suppressHydrationWarning name="qr_range" defaultValue={qrRange} className="input max-w-xs">
                  <option value="today">{t.today}</option>
                  <option value="7">{t.sevenDays}</option>
                  <option value="30">{t.thirtyDays}</option>
                  <option value="all">{t.allTime}</option>
                </select>
                <button className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                  {t.filter}
                </button>
              </form>

              <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {["allowed", "denied", "expired", "already used", "invalid"].map(
                  (status) => (
                    <MiniStat
                      key={status}
                      label={adminStatusLabel(t, status)}
                      value={qrStatusBreakdown.get(status) || 0}
                    />
                  )
                )}
              </div>

              <div className="grid gap-3">
                {filteredQrLogs.slice(0, 12).map((log) => (
                  <div key={log.id} className="rounded-2xl bg-zinc-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="rounded-full bg-white px-4 py-2 text-sm font-black">
                        {adminStatusLabel(t, qrStatus(log))}
                      </p>
                      <p className="text-sm font-bold text-zinc-500">
                        {formatDateTime(log.created_at)}
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-black text-zinc-800">
                      {t.partnerName}:{" "}
                      {log.partner_id
                        ? partnerNameById.get(log.partner_id) || t.unknownPartner
                        : t.notLinked}
                    </p>
                    <p className="mt-3 text-sm font-bold text-zinc-600">
                      {t.partners}: {log.partner_id || t.notLinked} · {t.pass}:{" "}
                      {log.pass_code || log.pass_id || log.member_id || "n/a"}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs font-bold text-zinc-400">
                      {t.device}: {log.user_agent || t.notTrackedYet}
                    </p>
                  </div>
                ))}
                {filteredQrLogs.length === 0 && (
                  <p className="rounded-2xl bg-zinc-100 p-5 font-bold text-zinc-500">
                    {t.noQrLogs}
                  </p>
                )}
              </div>
            </Panel>

            <Panel title={t.revenueAnalytics}>
              <div className="grid gap-4 sm:grid-cols-2">
                <MiniStat label={t.totalRevenue} value={euro(revenueEstimate)} />
                <MiniStat label={t.todayRevenue} value={t.revenueWebhook} />
                <MiniStat label={t.monthRevenue} value={t.revenueWebhook} />
                <MiniStat label={t.mrrForecast} value={euro(mrrEstimate)} />
                <MiniStat label={t.failedPayments} value={failedPayments.length} />
                <MiniStat label={t.refunds} value={t.revenueWebhook} />
                <MiniStat
                  label={t.avgRevenueUser}
                  value={activeRevenueMembers.length ? euro(revenueEstimate / activeRevenueMembers.length) : euro(0)}
                />
                <MiniStat label={t.canceledSubs} value={canceledMembers.length} />
              </div>
              <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
                {t.revenueWarning}
              </p>
            </Panel>
          </div>
        </section>

        <section id="members" className="mt-10 scroll-mt-28">
          <SectionHeading title={t.members} eyebrow={t.membersEyebrow} />
          <Panel>
            <FilterForm label={t.filter}>
              <input
        suppressHydrationWarning
                name="member_search"
                defaultValue={params.member_search || ""}
                placeholder={`${t.search}: email / pass code`}
                className="input"
              />
              <select suppressHydrationWarning name="member_status" defaultValue={memberStatusFilter} className="input">
                <option value="all">{t.allStatuses}</option>
                {memberStatuses.map((status) => (
                  <option key={status} value={status}>
                    {adminStatusLabel(t, status)}
                  </option>
                ))}
              </select>
            </FilterForm>

            <div className="mt-6 grid gap-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="rounded-[1.6rem] bg-zinc-100 p-5">
                  <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">
                          {member.full_name || member.email || "Member"}
                        </h3>
                        <Badge>{adminStatusLabel(t, memberStatus(member))}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-bold text-zinc-500">
                        {member.email || t.noEmail} · {member.plan_id || member.plan || t.noPlan}
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Info label={t.registered} value={formatDate(member.created_at)} />
                        <Info label={t.validUntil} value={formatDate(member.valid_until || member.current_period_end)} />
                        <Info label={t.device} value={member.device_hash ? t.linked : t.notLinked} />
                        <Info label={t.payment} value={member.last_payment_status || "n/a"} />
                      </div>
                      {member.pass_code && (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <code className="rounded-full bg-white px-4 py-3 text-sm font-black">
                            {member.pass_code}
                          </code>
                          <CopyButton
                            value={member.pass_code}
                            label={t.copyPassCode}
                            copiedLabel={t.copied}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <form action={updateMemberStatus} className="flex gap-2">
                        <input suppressHydrationWarning type="hidden" name="member_id" value={member.id} />
                        <input suppressHydrationWarning type="hidden" name="member_table" value={memberTable} />
                        <select
        suppressHydrationWarning
                          name="subscription_status"
                          defaultValue={memberStatus(member)}
                          className="rounded-full bg-white px-4 py-3 text-sm font-black"
                        >
                          {memberStatuses.map((status) => (
                            <option key={status} value={status}>
                              {adminStatusLabel(t, status)}
                            </option>
                          ))}
                        </select>
                        <button className="rounded-full bg-black px-4 py-3 text-sm font-black text-white">
                          {t.save}
                        </button>
                      </form>

                      <form action={resetDeviceLock}>
                        <input suppressHydrationWarning type="hidden" name="member_id" value={member.id} />
                        <input suppressHydrationWarning type="hidden" name="member_table" value={memberTable} />
                        <button className="rounded-full bg-white px-4 py-3 text-sm font-black">
                          {t.resetDeviceLock}
                        </button>
                      </form>

                      {member.pass_code && (
                        <a
                          href={`/account/start/${member.pass_code}`}
                          target="_blank"
                          className="rounded-full bg-white px-4 py-3 text-sm font-black"
                        >
                          {t.openPass}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredMembers.length === 0 && <EmptyState text={t.noMembersFound} />}
            </div>
          </Panel>
        </section>

        <section id="partners" className="mt-10 scroll-mt-28">
          <SectionHeading title={t.partners} eyebrow={t.partnersEyebrow} />
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <Panel>
              <FilterForm label={t.filter}>
                <input
        suppressHydrationWarning
                  name="partner_search"
                  defaultValue={params.partner_search || ""}
                  placeholder={`${t.search}: partner`}
                  className="input"
                />
                <select suppressHydrationWarning name="partner_status" defaultValue={partnerStatusFilter} className="input">
                  <option value="all">{t.allStatuses}</option>
                  {partnerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {adminStatusLabel(t, status)}
                    </option>
                  ))}
                </select>
                <select suppressHydrationWarning name="partner_category" defaultValue={partnerCategoryFilter} className="input">
                  <option value="all">{t.allCategories}</option>
                  {partnerCategories.map((category) => (
                    <option key={category} value={category}>
                      {adminCategoryLabel(t, category)}
                    </option>
                  ))}
                </select>
              </FilterForm>

              <div className="mt-6 grid gap-4">
                {filteredPartners.map((partner) => {
                  const publicUrl = publicPartnerUrl(partner);
                  const dashboardUrl = partnerDashboardUrl(partner);
                  const absoluteDashboardUrl = dashboardUrl ? `${baseUrl}${dashboardUrl}` : "";
                  const checklist = [
                    ["photo", Boolean(partner.image_url)],
                    ["address", Boolean(partner.address)],
                    ["offer", Boolean(partner.offer)],
                    ["hours", Boolean(partner.opening_hours)],
                    ["phone", Boolean(partner.phone)],
                    ["website", Boolean(partner.website)],
                    ["instagram", Boolean(partner.instagram)],
                    ["menu", (menuCountByPartner.get(partner.id) || 0) > 0],
                  ] as const;

                  return (
                    <div key={partner.id} className="rounded-[1.6rem] bg-zinc-100 p-5">
                      <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-black">
                              {partner.business_name || "Partner"}
                            </h3>
                            <Badge>{adminStatusLabel(t, partner.status)}</Badge>
                          </div>
                          <p className="mt-2 text-sm font-bold text-zinc-500">
                            {partner.category || t.noCategory} · {partner.address || t.noAddress}
                          </p>
                          {partner.offer && (
                            <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-black text-zinc-700">
                              {partner.offer}
                            </p>
                          )}
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <Info label={t.menuItems} value={String(menuCountByPartner.get(partner.id) || 0)} />
                            <Info label={t.qrUses} value={String(qrCountByPartner.get(partner.id) || 0)} />
                            <Info label={t.views} value={String(viewCountByPartner.get(partner.id) || 0)} />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {checklist.map(([label, ok]) => (
                              <span
                                key={String(label)}
                                className={`rounded-full px-3 py-2 text-xs font-black ${
                                  ok ? "bg-emerald-100 text-emerald-800" : "bg-white text-zinc-400"
                                }`}
                              >
                              {ok ? "✓" : "!"} {t.checklist[label as keyof typeof t.checklist]}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          <form action={updatePartnerStatus} className="flex gap-2">
                            <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                            <select
        suppressHydrationWarning
                              name="status"
                              defaultValue={partner.status || "pending"}
                              className="rounded-full bg-white px-4 py-3 text-sm font-black"
                            >
                              {partnerStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {adminStatusLabel(t, status)}
                                </option>
                              ))}
                            </select>
                            <button className="rounded-full bg-black px-4 py-3 text-sm font-black text-white">
                              {t.save}
                            </button>
                          </form>

                          <a
                            href={publicUrl}
                            target="_blank"
                            className="rounded-full bg-white px-4 py-3 text-sm font-black"
                          >
                            {t.public}
                          </a>

                          {dashboardUrl && (
                            <a
                              href={dashboardUrl}
                              target="_blank"
                              className="rounded-full bg-white px-4 py-3 text-sm font-black"
                            >
                              {t.dashboard}
                            </a>
                          )}

                          {absoluteDashboardUrl && (
                            <CopyButton
                              value={absoluteDashboardUrl}
                              label={t.copyDashboardLink}
                              copiedLabel={t.copied}
                              className="rounded-full bg-white px-4 py-3 text-sm font-black text-black"
                            />
                          )}

                          <form action={regeneratePartnerToken}>
                            <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                            <button className="rounded-full bg-white px-4 py-3 text-sm font-black">
                              {t.newDashboardLink}
                            </button>
                          </form>

                          <form action={deletePartner}>
                            <input suppressHydrationWarning type="hidden" name="partner_id" value={partner.id} />
                            <button className="rounded-full bg-red-50 px-4 py-3 text-sm font-black text-red-600">
                              {t.delete}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredPartners.length === 0 && <EmptyState text={t.noPartnersFound} />}
              </div>
            </Panel>

            <Panel title={t.addPartner}>
              <form action={createPartner} className="grid gap-3">
                <input suppressHydrationWarning name="business_name" placeholder={t.businessName} className="input" required />
                <input suppressHydrationWarning name="slug" placeholder={t.slugPlaceholder} className="input" />
                <select suppressHydrationWarning name="category" className="input" defaultValue="restaurants">
                  {partnerCategories.map((category) => (
                    <option key={category} value={category}>
                      {adminCategoryLabel(t, category)}
                    </option>
                  ))}
                </select>
                <input suppressHydrationWarning name="address" placeholder={t.address} className="input" />
                <input suppressHydrationWarning name="offer" placeholder={t.offerPlaceholder} className="input" />
                <select suppressHydrationWarning name="status" className="input" defaultValue="approved">
                  {partnerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {adminStatusLabel(t, status)}
                    </option>
                  ))}
                </select>
                <button className="rounded-full bg-black px-6 py-4 font-black text-white">
                  {t.createPartner}
                </button>
              </form>
            </Panel>
          </div>
        </section>

        <section id="applications" className="mt-10 scroll-mt-28">
          <SectionHeading title={t.applications} eyebrow={t.applicationsEyebrow} />
          <Panel>
            <div className="grid gap-4 lg:grid-cols-2">
              {applications.map((application) => {
                const email = application.email || application.contact_email || "";
                const message = application.message || application.description || "";

                return (
                  <div key={application.id} className="rounded-[1.6rem] bg-zinc-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-black">
                        {application.business_name || t.application}
                      </h3>
                      <Badge>{adminStatusLabel(t, application.status || "pending")}</Badge>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Info label={t.contact} value={application.contact_name || application.name || "n/a"} />
                      <Info label={t.email} value={email || "n/a"} />
                      <Info label={t.phone} value={application.phone || "n/a"} />
                      <Info label={t.category} value={application.category || "n/a"} />
                      <Info label={t.address} value={application.address || "n/a"} />
                      <Info label={t.date} value={formatDate(application.created_at)} />
                    </div>
                    {message && (
                      <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-zinc-600">
                        {message}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <form action={approveApplication}>
                        <input suppressHydrationWarning type="hidden" name="application_id" value={application.id} />
                        <button className="rounded-full bg-black px-4 py-3 text-sm font-black text-white">
                          {t.approve}
                        </button>
                      </form>

                      <form action={rejectApplication}>
                        <input suppressHydrationWarning type="hidden" name="application_id" value={application.id} />
                        <button className="rounded-full bg-white px-4 py-3 text-sm font-black text-black">
                          {t.reject}
                        </button>
                      </form>

                      {email && (
                        <a
                          href={`mailto:${email}`}
                          className="rounded-full bg-white px-4 py-3 text-sm font-black text-black"
                        >
                          {t.emailPartner}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              {applications.length === 0 && <EmptyState text={t.noApplicationsYet} />}
            </div>
          </Panel>
        </section>

        <section id="settings" className="mt-10 scroll-mt-28">
          <SectionHeading title={t.siteSettings} eyebrow={t.settingsEyebrow} />
          <Panel>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {siteSettingKeys.map((key) => {
                const booleanSetting = [
                  "partner_applications_enabled",
                  "enable_partner_applications",
                  "stripe_payments_enabled",
                  "maintenance_mode",
                ].includes(key);

                return (
                  <form key={key} action={updateSiteSetting} className="grid gap-2 rounded-2xl bg-zinc-100 p-4">
                    <input suppressHydrationWarning type="hidden" name="key" value={key} />
                    <label className="text-sm font-black text-zinc-500">{key}</label>
                    {booleanSetting ? (
                      <select suppressHydrationWarning name="value" defaultValue={settingMap.get(key) || "false"} className="input">
                        <option value="true">{t.enabled}</option>
                        <option value="false">{t.disabled}</option>
                      </select>
                    ) : key === "hero_subtitle" || key === "membership_price_texts" || key === "announcement_banner" ? (
                      <textarea
        suppressHydrationWarning
                        name="value"
                        defaultValue={settingMap.get(key) || ""}
                        className="input min-h-28"
                      />
                    ) : (
                      <input suppressHydrationWarning name="value" defaultValue={settingMap.get(key) || ""} className="input" />
                    )}
                    <button className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                      {t.save}
                    </button>
                  </form>
                );
              })}
            </div>
          </Panel>
        </section>
      </section>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: white;
          padding: 0.9rem 1rem;
          font-weight: 800;
          outline: none;
        }

        .input:focus {
          border-color: rgba(0, 0, 0, 0.32);
        }
      `}</style>
    </main>
  );
}

function SectionHeading({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: "neutral" | "danger";
}) {
  return (
    <div
      className={`rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-black/5 ${
        tone === "danger" ? "text-red-600" : ""
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-zinc-100 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
      {title && <h2 className="mb-6 text-3xl font-black tracking-tight">{title}</h2>}
      {children}
    </section>
  );
}

function FilterForm({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <form className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
      {children}
      <button className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">
        {label}
      </button>
    </form>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-700">
      {children}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-black text-zinc-800">{value}</p>
    </div>
  );
}

function AnalyticsList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { title: string; meta: string }[];
  emptyText: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xl font-black">{title}</h3>
      <div className="grid gap-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${title}-${item.title}-${item.meta}-${index}`}
              className="rounded-2xl bg-zinc-100 p-4"
            >
              <p className="font-black">{item.title}</p>
              <p className="mt-1 text-sm font-bold text-zinc-500">{item.meta}</p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-zinc-100 p-4 text-sm font-bold text-zinc-500">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[1.6rem] bg-zinc-100 p-8 text-center font-black text-zinc-500">
      {text}
    </div>
  );
}
