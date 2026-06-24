export type Lang = "en" | "ru" | "ee";

export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "ee", label: "EE" },
];

export function normalizeLang(value?: string | null): Lang {
  if (value === "ru" || value === "ee" || value === "en") {
    return value;
  }

  return "en";
}

export const dictionary = {
  en: {
    nav: {
      partners: "Partners",
      membership: "Membership",
      myPass: "My Pass",
      business: "For Business",
      contact: "Contact",
      join: "Join Now",
      menu: "Menu",
      close: "Close",
    },
    footer: {
      tagline:
        "A premium Tallinn membership for restaurants, cafes, bars, experiences and local perks.",
      explore: "Explore",
      company: "Company",
      legal: "Legal",
      terms: "Terms",
      privacy: "Privacy",
      refund: "Refund Policy",
      rights: "All rights reserved.",
    },
    home: {
      badge: "Tallinn membership club",
      title: "Unlock the best of Tallinn.",
      text:
        "TLN Pass gives members access to selected restaurants, cafes, bars, beauty, fitness and local experiences — all through one secure dynamic QR pass.",
      ctaPrimary: "Join Now",
      ctaSecondary: "Explore Partners",
      proof1: "Dynamic QR",
      proof2: "Partner perks",
      proof3: "Mobile-first",
      whatTitle: "One pass. Better city moments.",
      whatText:
        "Instead of hunting for random deals, members open TLN Pass, choose a partner and show their secure QR before payment.",
      membersTitle: "For members",
      membersText:
        "Discover places in Tallinn with curated benefits and simple QR verification.",
      partnersTitle: "For partners",
      partnersText:
        "Bring new customers to your venue and manage your own menu and offers.",
      categoriesTitle: "Choose your vibe",
      categoriesText:
        "Go straight to the category you want. Restaurants, cafes, bars, events and more.",
      finalTitle: "Built for Tallinn. Ready for your phone.",
      finalText:
        "The experience is designed mobile-first, because members will use TLN Pass mostly from their phone.",
      finalCta: "View Membership Plans",
    },
    membership: {
      badge: "Membership plans",
      title: "Choose your TLN Pass.",
      text:
        "Start small or go all in. Every plan gives access to partner benefits through a secure dynamic QR pass.",
      join: "Choose plan",
      bestValue: "Best value",
      popular: "Most popular",
      save: "Save",
      howTitle: "How it works",
      step1Title: "Choose a plan",
      step1Text: "Pick the membership period that fits you best.",
      step2Title: "Open your pass",
      step2Text: "After checkout you receive a personal dynamic QR pass.",
      step3Title: "Use in Tallinn",
      step3Text: "Show your QR before payment at partner locations.",
    },
    join: {
      badge: "Secure checkout",
      title: "Start your TLN Pass.",
      text:
        "Enter your details and continue to Stripe Checkout. After payment your personal pass will be created automatically.",
      selectedPlan: "Selected plan",
      name: "Your name",
      email: "Email",
      button: "Continue to checkout",
      stripe: "Payments are securely processed by Stripe.",
      changePlan: "Change plan",
    },
    myPass: {
      badge: "Member access",
      title: "Open your TLN Pass.",
      text:
        "Already have a pass? Open it from this device or enter your pass code manually.",
      lastPass: "Open saved pass",
      enterCode: "Enter your pass code",
      placeholder: "TLN-XXXXXXXXXXXX",
      open: "Open pass",
      joinTitle: "No pass yet?",
      joinText: "Join TLN Pass and get your secure dynamic QR membership.",
      join: "Join Now",
    },
  },
  ru: {
    nav: {
      partners: "Партнёры",
      membership: "Подписка",
      myPass: "Мой Pass",
      business: "Для бизнеса",
      contact: "Контакты",
      join: "Купить",
      menu: "Меню",
      close: "Закрыть",
    },
    footer: {
      tagline:
        "Премиальная подписка для Таллина: рестораны, кафе, бары, развлечения и локальные привилегии.",
      explore: "Разделы",
      company: "Компания",
      legal: "Документы",
      terms: "Условия",
      privacy: "Приватность",
      refund: "Возвраты",
      rights: "Все права защищены.",
    },
    home: {
      badge: "Клуб подписки в Таллине",
      title: "Открой лучшее в Таллине.",
      text:
        "TLN Pass даёт доступ к выбранным ресторанам, кафе, барам, beauty, fitness и локальным местам через один защищённый динамический QR-pass.",
      ctaPrimary: "Купить сейчас",
      ctaSecondary: "Смотреть партнёров",
      proof1: "Динамический QR",
      proof2: "Перки партнёров",
      proof3: "Удобно с телефона",
      whatTitle: "Один pass. Больше выгоды в городе.",
      whatText:
        "Вместо случайных скидок пользователь открывает TLN Pass, выбирает партнёра и показывает QR перед оплатой.",
      membersTitle: "Для клиентов",
      membersText:
        "Открывай места в Таллине с привилегиями и простой проверкой через QR.",
      partnersTitle: "Для партнёров",
      partnersText:
        "Приводи новых клиентов в своё заведение и управляй меню и офферами.",
      categoriesTitle: "Выбери категорию",
      categoriesText:
        "Переходи сразу туда, что нужно: рестораны, кафе, бары, события и другое.",
      finalTitle: "Сделано для Таллина. Удобно на телефоне.",
      finalText:
        "Главный упор — мобильная версия, потому что участники будут пользоваться TLN Pass с телефона.",
      finalCta: "Смотреть тарифы",
    },
    membership: {
      badge: "Тарифы подписки",
      title: "Выбери свой TLN Pass.",
      text:
        "Можно начать с короткого периода или взять выгодный долгий план. Каждый тариф даёт доступ к партнёрским привилегиям через защищённый QR.",
      join: "Выбрать тариф",
      bestValue: "Самый выгодный",
      popular: "Популярный",
      save: "Экономия",
      howTitle: "Как это работает",
      step1Title: "Выбери тариф",
      step1Text: "Выбери период подписки, который тебе подходит.",
      step2Title: "Открой pass",
      step2Text: "После оплаты создаётся личный динамический QR-pass.",
      step3Title: "Используй в Таллине",
      step3Text: "Показывай QR перед оплатой у партнёров.",
    },
    join: {
      badge: "Безопасная оплата",
      title: "Оформи TLN Pass.",
      text:
        "Введи данные и продолжи оплату через Stripe Checkout. После оплаты твой pass создастся автоматически.",
      selectedPlan: "Выбранный тариф",
      name: "Твоё имя",
      email: "Email",
      button: "Перейти к оплате",
      stripe: "Платежи безопасно обрабатываются через Stripe.",
      changePlan: "Изменить тариф",
    },
    myPass: {
      badge: "Доступ участника",
      title: "Открой свой TLN Pass.",
      text:
        "Уже есть pass? Открой его на этом устройстве или введи код вручную.",
      lastPass: "Открыть сохранённый pass",
      enterCode: "Введи pass code",
      placeholder: "TLN-XXXXXXXXXXXX",
      open: "Открыть pass",
      joinTitle: "Ещё нет pass?",
      joinText:
        "Оформи TLN Pass и получи защищённый динамический QR для партнёров.",
      join: "Купить сейчас",
    },
  },
  ee: {
    nav: {
      partners: "Partnerid",
      membership: "Liikmesus",
      myPass: "Minu Pass",
      business: "Ettevõttele",
      contact: "Kontakt",
      join: "Liitu",
      menu: "Menüü",
      close: "Sulge",
    },
    footer: {
      tagline:
        "Premium liikmesus Tallinnas: restoranid, kohvikud, baarid, elamused ja kohalikud eelised.",
      explore: "Avasta",
      company: "Ettevõte",
      legal: "Õigusinfo",
      terms: "Tingimused",
      privacy: "Privaatsus",
      refund: "Tagastused",
      rights: "Kõik õigused kaitstud.",
    },
    home: {
      badge: "Tallinna liikmesusklubi",
      title: "Ava Tallinna parimad kohad.",
      text:
        "TLN Pass annab liikmetele ligipääsu valitud restoranide, kohvikute, baaride, ilu-, fitnessi- ja kohalike elamuste eelistele ühe turvalise dünaamilise QR-passiga.",
      ctaPrimary: "Liitu",
      ctaSecondary: "Vaata partnereid",
      proof1: "Dünaamiline QR",
      proof2: "Partnerite eelised",
      proof3: "Mobiilisõbralik",
      whatTitle: "Üks pass. Paremad hetked linnas.",
      whatText:
        "Juhuslike pakkumiste otsimise asemel avab liige TLN Passi, valib partneri ja näitab QR-koodi enne maksmist.",
      membersTitle: "Liikmetele",
      membersText:
        "Avasta Tallinna kohti valitud eeliste ja lihtsa QR-kontrolliga.",
      partnersTitle: "Partneritele",
      partnersText:
        "Too oma kohta uusi kliente ning halda ise menüüd ja pakkumisi.",
      categoriesTitle: "Vali kategooria",
      categoriesText:
        "Liigu otse soovitud kategooriasse: restoranid, kohvikud, baarid, üritused ja muu.",
      finalTitle: "Loodud Tallinnale. Mugav telefonis.",
      finalText:
        "Kogemus on mobiilikeskne, sest liikmed kasutavad TLN Passi peamiselt telefonist.",
      finalCta: "Vaata pakette",
    },
    membership: {
      badge: "Liikmesuse paketid",
      title: "Vali oma TLN Pass.",
      text:
        "Alusta lühikese perioodiga või vali pikem ja soodsam pakett. Iga pakett annab ligipääsu partnerite eelistele turvalise QR-passiga.",
      join: "Vali pakett",
      bestValue: "Parim väärtus",
      popular: "Populaarne",
      save: "Sääst",
      howTitle: "Kuidas see töötab",
      step1Title: "Vali pakett",
      step1Text: "Vali liikmesuse periood, mis sobib sulle kõige paremini.",
      step2Title: "Ava oma pass",
      step2Text: "Pärast makset luuakse sinu personaalne dünaamiline QR-pass.",
      step3Title: "Kasuta Tallinnas",
      step3Text: "Näita QR-koodi enne maksmist partneri juures.",
    },
    join: {
      badge: "Turvaline makse",
      title: "Alusta TLN Passiga.",
      text:
        "Sisesta andmed ja jätka Stripe Checkouti kaudu. Pärast makset luuakse sinu personaalne pass automaatselt.",
      selectedPlan: "Valitud pakett",
      name: "Sinu nimi",
      email: "Email",
      button: "Jätka maksele",
      stripe: "Makseid töötleb turvaliselt Stripe.",
      changePlan: "Muuda paketti",
    },
    myPass: {
      badge: "Liikme ligipääs",
      title: "Ava oma TLN Pass.",
      text:
        "Pass on juba olemas? Ava see selles seadmes või sisesta passikood käsitsi.",
      lastPass: "Ava salvestatud pass",
      enterCode: "Sisesta passikood",
      placeholder: "TLN-XXXXXXXXXXXX",
      open: "Ava pass",
      joinTitle: "Passi veel pole?",
      joinText:
        "Liitu TLN Passiga ja saa turvaline dünaamiline QR-liikmesus.",
      join: "Liitu",
    },
  },
} as const;
