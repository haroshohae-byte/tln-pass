"use client";

import { useEffect } from "react";
import { normalizeLang, type Lang } from "../../lib/i18n";

type TranslationEntry = {
  en: string;
  ru: string;
  ee: string;
};

const entries: TranslationEntry[] = [
  // Navigation / footer
  { en: "Partners", ru: "Партнёры", ee: "Partnerid" },
  { en: "Membership", ru: "Подписка", ee: "Liikmesus" },
  { en: "My Pass", ru: "Мой Pass", ee: "Minu Pass" },
  { en: "For Business", ru: "Для бизнеса", ee: "Ettevõttele" },
  { en: "For business", ru: "Для бизнеса", ee: "Ettevõttele" },
  { en: "Contact", ru: "Контакты", ee: "Kontakt" },
  { en: "Join Now", ru: "Купить", ee: "Liitu" },
  { en: "Join now", ru: "Купить", ee: "Liitu" },
  { en: "Menu", ru: "Меню", ee: "Menüü" },
  { en: "Close", ru: "Закрыть", ee: "Sulge" },
  { en: "Explore", ru: "Разделы", ee: "Avasta" },
  { en: "Company", ru: "Компания", ee: "Ettevõte" },
  { en: "Legal", ru: "Документы", ee: "Õigusinfo" },
  { en: "Terms", ru: "Условия", ee: "Tingimused" },
  { en: "Privacy", ru: "Приватность", ee: "Privaatsus" },
  { en: "Refund Policy", ru: "Возвраты", ee: "Tagastused" },
  { en: "All rights reserved.", ru: "Все права защищены.", ee: "Kõik õigused kaitstud." },
  { en: "Tallinn membership", ru: "Подписка в Таллине", ee: "Tallinna liikmesus" },
  { en: "Tallinn city access", ru: "Доступ к Таллину", ee: "Tallinna ligipääs" },

  // Homepage
  { en: "Tallinn membership club", ru: "Клуб подписки в Таллине", ee: "Tallinna liikmesusklubi" },
  { en: "Unlock the best of Tallinn.", ru: "Открой лучшее в Таллине.", ee: "Ava Tallinna parimad kohad." },
  { en: "Simple by design", ru: "Просто по дизайну", ee: "Lihtne olemuselt" },
  { en: "A city guide that works like a pass.", ru: "Городской гид, который работает как pass.", ee: "Linnajuht, mis töötab nagu pass." },
  { en: "No messy coupons. No plastic card. Open your phone, choose a place, show the QR and enjoy the member benefit.", ru: "Никаких неудобных купонов и пластиковых карт. Открой телефон, выбери место, покажи QR и получи привилегию участника.", ee: "Ei segaseid kuponge ega plastkaarti. Ava telefon, vali koht, näita QR-koodi ja kasuta liikme eelist." },
  { en: "Choose the place.", ru: "Выбери место.", ee: "Vali koht." },
  { en: "Open restaurants, cafes, bars and experiences curated for TLN Pass members.", ru: "Открывай рестораны, кафе, бары и места, подобранные для участников TLN Pass.", ee: "Ava restoranid, kohvikud, baarid ja elamused, mis on valitud TLN Pass liikmetele." },
  { en: "Show your pass.", ru: "Покажи pass.", ee: "Näita oma passi." },
  { en: "The dynamic QR is made for the moment before you pay.", ru: "Динамический QR создан именно для момента перед оплатой.", ee: "Dünaamiline QR on loodud hetkeks enne maksmist." },
  { en: "Unlock the benefit.", ru: "Получи привилегию.", ee: "Ava eelis." },
  { en: "The partner verifies your active membership and applies the available perk.", ru: "Партнёр проверяет активную подписку и применяет доступную привилегию.", ee: "Partner kontrollib aktiivset liikmesust ja rakendab saadaoleva eelise." },
  { en: "Choose your vibe", ru: "Выбери настроение", ee: "Vali meeleolu" },
  { en: "Pick your mood.", ru: "Выбери, что хочется сегодня.", ee: "Vali oma tänane meeleolu." },
  { en: "Jump straight into what you want today: food, coffee, cocktails, events, fitness or beauty.", ru: "Переходи сразу к тому, что нужно сегодня: еда, кофе, коктейли, события, фитнес или beauty.", ee: "Liigu otse selleni, mida täna soovid: toit, kohv, kokteilid, üritused, fitness või ilu." },
  { en: "Restaurants", ru: "Рестораны", ee: "Restoranid" },
  { en: "Cafes", ru: "Кафе", ee: "Kohvikud" },
  { en: "Bars", ru: "Бары", ee: "Baarid" },
  { en: "Entertainment", ru: "Развлечения", ee: "Meelelahutus" },
  { en: "Fitness", ru: "Фитнес", ee: "Fitness" },
  { en: "Beauty", ru: "Beauty", ee: "Ilu" },
  { en: "Open", ru: "Открыть", ee: "Ava" },
  { en: "Mobile-first", ru: "Сначала мобильная версия", ee: "Mobiil ennekõike" },
  { en: "Built for the moment before you pay.", ru: "Создано для момента перед оплатой.", ee: "Loodud hetkeks enne maksmist." },
  { en: "TLN Pass is made to be used on the phone, at the venue, when it actually matters.", ru: "TLN Pass создан для телефона — прямо в заведении, когда это действительно нужно.", ee: "TLN Pass on loodud kasutamiseks telefonis, kohapeal ja just siis, kui see loeb." },
  { en: "View membership", ru: "Смотреть подписку", ee: "Vaata liikmesust" },

  // Membership / checkout / My Pass
  { en: "Pick the plan that fits your Tallinn.", ru: "Выбери тариф под свой Таллин.", ee: "Vali pakett oma Tallinna jaoks." },
  { en: "Every plan gives access to the same dynamic QR membership. Choose the period that makes sense for you.", ru: "Каждый тариф даёт доступ к динамическому QR-pass. Выбери период, который тебе подходит.", ee: "Iga pakett annab ligipääsu dünaamilisele QR-passile. Vali endale sobiv periood." },
  { en: "Choose", ru: "Выбрать", ee: "Vali" },
  { en: "Popular", ru: "Популярный", ee: "Populaarne" },
  { en: "Best value", ru: "Самый выгодный", ee: "Parim väärtus" },
  { en: "Trial", ru: "Пробный", ee: "Proov" },
  { en: "Your pass is created automatically after checkout.", ru: "После оплаты pass создаётся автоматически.", ee: "Pärast makset luuakse sinu pass automaatselt." },
  { en: "Open it on your phone, show the dynamic QR at partner locations and unlock the available member benefit.", ru: "Открой его на телефоне, покажи динамический QR у партнёра и получи доступную привилегию.", ee: "Ava see telefonis, näita partneri juures dünaamilist QR-koodi ja kasuta liikme eelist." },
  { en: "Try it with coffee", ru: "Попробуй с кофе", ee: "Proovi kohviga" },
  { en: "Dinner after work", ru: "Ужин после работы", ee: "Õhtusöök pärast tööd" },
  { en: "Half-year city nights", ru: "Полгода городских вечеров", ee: "Pool aastat linnaõhtuid" },
  { en: "A full Tallinn year", ru: "Целый год в Таллине", ee: "Terve Tallinna aasta" },
  { en: "Secure checkout", ru: "Безопасная оплата", ee: "Turvaline makse" },
  { en: "Start your TLN Pass.", ru: "Оформи TLN Pass.", ee: "Alusta TLN Passiga." },
  { en: "Continue to checkout", ru: "Перейти к оплате", ee: "Jätka maksele" },
  { en: "Selected plan", ru: "Выбранный тариф", ee: "Valitud pakett" },
  { en: "Change plan", ru: "Изменить тариф", ee: "Muuda paketti" },
  { en: "Payments are securely processed by Stripe.", ru: "Платежи безопасно обрабатываются через Stripe.", ee: "Makseid töötleb turvaliselt Stripe." },
  { en: "Stripe payments are currently disabled.", ru: "Оплата Stripe сейчас отключена.", ee: "Stripe maksed on praegu välja lülitatud." },
  { en: "Member access", ru: "Доступ участника", ee: "Liikme ligipääs" },
  { en: "Your pass is one code away.", ru: "Твой pass в одном коде.", ee: "Sinu pass on ühe koodi kaugusel." },
  { en: "No saved pass on this device", ru: "На этом устройстве pass не сохранён", ee: "Selles seadmes pole salvestatud passi" },
  { en: "Open saved pass", ru: "Открыть сохранённый pass", ee: "Ava salvestatud pass" },
  { en: "Get TLN Pass", ru: "Купить TLN Pass", ee: "Hangi TLN Pass" },
  { en: "Enter pass code", ru: "Введи pass code", ee: "Sisesta passikood" },
  { en: "Open pass", ru: "Открыть pass", ee: "Ava pass" },
  { en: "Saved", ru: "Сохранено", ee: "Salvestatud" },
  { en: "New", ru: "Новый", ee: "Uus" },
  { en: "Secure", ru: "Защита", ee: "Turvaline" },
  { en: "Device protected", ru: "Защищено устройством", ee: "Seadmega kaitstud" },

  // Partners
  { en: "TLN Pass partners", ru: "Партнёры TLN Pass", ee: "TLN Pass partnerid" },
  { en: "A city guide for member benefits.", ru: "Городской гид для привилегий участников.", ee: "Linnajuht liikme eeliste jaoks." },
  { en: "Search selected restaurants, cafes, bars and experiences in Tallinn.", ru: "Ищи выбранные рестораны, кафе, бары и места в Таллине.", ee: "Otsi valitud restorane, kohvikuid, baare ja elamusi Tallinnas." },
  { en: "Search by name, offer, address...", ru: "Поиск по названию, офферу, адресу...", ee: "Otsi nime, pakkumise või aadressi järgi..." },
  { en: "All", ru: "Все", ee: "Kõik" },
  { en: "Events", ru: "События", ee: "Üritused" },
  { en: "partners found", ru: "партнёров найдено", ee: "partnerit leitud" },
  { en: "No partners found.", ru: "Партнёры не найдены.", ee: "Partnereid ei leitud." },
  { en: "Try another search or category. New Tallinn partners are added regularly.", ru: "Попробуй другой поиск или категорию. Новые партнёры в Таллине добавляются регулярно.", ee: "Proovi teist otsingut või kategooriat. Uusi Tallinna partnereid lisandub regulaarselt." },
  { en: "Back to partners", ru: "Назад к партнёрам", ee: "Tagasi partnerite juurde" },
  { en: "Member benefit", ru: "Привилегия участника", ee: "Liikme eelis" },
  { en: "How to use your pass", ru: "Как использовать pass", ee: "Kuidas passi kasutada" },
  { en: "Info", ru: "Информация", ee: "Info" },
  { en: "Address", ru: "Адрес", ee: "Aadress" },
  { en: "Hours", ru: "Часы работы", ee: "Lahtiolekuajad" },
  { en: "Phone", ru: "Телефон", ee: "Telefon" },
  { en: "Website", ru: "Сайт", ee: "Veebileht" },
  { en: "Open in Maps", ru: "Открыть карту", ee: "Ava kaardil" },
  { en: "Member menu", ru: "Меню для участников", ee: "Liikme menüü" },
  { en: "Menu coming soon.", ru: "Меню скоро появится.", ee: "Menüü tuleb peagi." },
  { en: "The partner is preparing their TLN Pass menu.", ru: "Партнёр готовит меню для TLN Pass.", ee: "Partner valmistab TLN Pass menüüd ette." },
  { en: "Current member offers", ru: "Актуальные предложения для участников", ee: "Praegused liikme pakkumised" },
  { en: "Show your dynamic QR before paying.", ru: "Покажи динамический QR перед оплатой.", ee: "Näita dünaamilist QR-koodi enne maksmist." },
  { en: "The partner verifies active membership.", ru: "Партнёр проверяет активную подписку.", ee: "Partner kontrollib aktiivset liikmesust." },
  { en: "Your TLN Pass benefit is applied.", ru: "Твоя привилегия TLN Pass применяется.", ee: "Sinu TLN Pass eelis rakendatakse." },
  { en: "Step 1", ru: "Шаг 1", ee: "Samm 1" },
  { en: "Step 2", ru: "Шаг 2", ee: "Samm 2" },
  { en: "Step 3", ru: "Шаг 3", ee: "Samm 3" },

  // Business / contact
  { en: "Turn TLN Pass members into real venue visits.", ru: "Превращайте участников TLN Pass в реальные визиты.", ee: "Too TLN Pass liikmed päris külastusteks." },
  { en: "Apply as partner", ru: "Стать партнёром", ee: "Hakka partneriks" },
  { en: "Email partnerships", ru: "Написать о партнёрстве", ee: "Kirjuta partnerlusest" },
  { en: "Partner stack", ru: "Набор партнёра", ee: "Partneri tööriistad" },
  { en: "Public page", ru: "Публичная страница", ee: "Avalik leht" },
  { en: "Partner dashboard", ru: "Dashboard партнёра", ee: "Partneri dashboard" },
  { en: "QR checks", ru: "QR-проверки", ee: "QR-kontrollid" },
  { en: "Menu offers", ru: "Меню и офферы", ee: "Menüü pakkumised" },
  { en: "Why partner", ru: "Почему стать партнёром", ee: "Miks partneriks hakata" },
  { en: "Built for local operators.", ru: "Создано для локального бизнеса.", ee: "Loodud kohalikele tegijatele." },
  { en: "Process", ru: "Процесс", ee: "Protsess" },
  { en: "From application to live page.", ru: "От заявки до живой страницы.", ee: "Taotlusest avaliku leheni." },
  { en: "Founding partners", ru: "Первые партнёры", ee: "Esimesed partnerid" },
  { en: "Contact", ru: "Контакты", ee: "Kontakt" },
  { en: "Talk to TLN Pass.", ru: "Связаться с TLN Pass.", ee: "Võta TLN Passiga ühendust." },
  { en: "Email us", ru: "Написать", ee: "Kirjuta" },
  { en: "Member support", ru: "Поддержка участников", ee: "Liikme tugi" },
  { en: "Billing", ru: "Оплата", ee: "Maksed" },
  { en: "Business", ru: "Бизнес", ee: "Äri" },
  { en: "Partnerships", ru: "Партнёрство", ee: "Partnerlus" },
  { en: "General", ru: "Общее", ee: "Üldine" },
  { en: "TLN Pass concierge", ru: "TLN Pass concierge", ee: "TLN Pass concierge" },
  { en: "Fast help for members and partners.", ru: "Быстрая помощь для участников и партнёров.", ee: "Kiire abi liikmetele ja partneritele." },


  { en: "New member demand", ru: "Новый спрос от участников", ee: "Uus liikmete nõudlus" },
  { en: "Appear in a curated Tallinn guide where members are already looking for places to use their pass.", ru: "Появляйтесь в подборке мест Таллинна, где участники уже ищут, где использовать pass.", ee: "Ole nähtav Tallinna valitud juhis, kus liikmed juba otsivad kohti passi kasutamiseks." },
  { en: "No complex setup", ru: "Без сложной настройки", ee: "Lihtne seadistus" },
  { en: "Your team gets a private dashboard link to update the page, menu, photos and active offers.", ru: "Ваша команда получает приватную ссылку на dashboard, чтобы обновлять страницу, меню, фото и активные офферы.", ee: "Teie tiim saab privaatse dashboardi lingi lehe, menüü, fotode ja pakkumiste uuendamiseks." },
  { en: "QR verification", ru: "QR-проверка", ee: "QR-kontroll" },
  { en: "Staff can verify active membership before applying the benefit, reducing manual coupon checks.", ru: "Персонал может проверить активную подписку перед применением привилегии, без ручной проверки купонов.", ee: "Töötajad saavad enne eelise rakendamist kontrollida aktiivset liikmesust." },
  { en: "Menu and offers", ru: "Меню и офферы", ee: "Menüü ja pakkumised" },
  { en: "Add member-only products, prices, discount badges and promotions without asking a developer.", ru: "Добавляйте продукты для участников, цены, бейджи скидок и акции без разработчика.", ee: "Lisa liikmetele mõeldud tooteid, hindu, soodusmärke ja kampaaniaid ilma arendajata." },
  { en: "Analytics foundation", ru: "Основа аналитики", ee: "Analüütika alus" },
  { en: "Track views, button clicks and QR uses so you can see whether attention turns into visits.", ru: "Отслеживайте просмотры, клики и QR-использования, чтобы видеть, превращается ли интерес в визиты.", ee: "Jälgi vaatamisi, klikke ja QR-kasutusi, et näha, kas huvi muutub külastusteks." },
  { en: "Local positioning", ru: "Локальное позиционирование", ee: "Kohalik positsioon" },
  { en: "TLN Pass is built around Tallinn lifestyle, not generic ads or one-time discount traffic.", ru: "TLN Pass строится вокруг lifestyle Таллинна, а не вокруг случайной рекламы и одноразовых скидок.", ee: "TLN Pass on loodud Tallinna elustiili ümber, mitte üldiste reklaamide ja ühekordsete allahindluste jaoks." },
  { en: "Send a partner application.", ru: "Отправьте заявку партнёра.", ee: "Saada partneritaotlus." },
  { en: "TLN Pass reviews and approves the venue.", ru: "TLN Pass проверяет и одобряет место.", ee: "TLN Pass vaatab koha üle ja kinnitab selle." },
  { en: "You receive a private dashboard link.", ru: "Вы получаете приватную ссылку на dashboard.", ee: "Saad privaatse dashboardi lingi." },
  { en: "Your public guide page goes live.", ru: "Ваша публичная страница становится доступной.", ee: "Sinu avalik leht läheb live'i." },
  { en: "The first version is intentionally simple: get approved, fill your profile, add menu items and let members discover you.", ru: "Первая версия специально простая: получите одобрение, заполните профиль, добавьте меню — и участники смогут вас найти.", ee: "Esimene versioon on teadlikult lihtne: saa kinnitatud, täida profiil, lisa menüü ja lase liikmetel sind avastada." },
  { en: "Join early while TLN Pass is building the first Tallinn partner network.", ru: "Присоединяйтесь раньше, пока TLN Pass собирает первую сеть партнёров в Таллине.", ee: "Liitu varakult, kuni TLN Pass loob esimest Tallinna partnerivõrgustikku." },
  { en: "Pass access, QR issues, device lock or account questions.", ru: "Доступ к pass, проблемы с QR, привязка устройства или вопросы аккаунта.", ee: "Passi ligipääs, QR-probleemid, seadmelukk või konto küsimused." },
  { en: "Restaurants, cafes, bars and venues that want to work with TLN Pass.", ru: "Рестораны, кафе, бары и места, которые хотят работать с TLN Pass.", ee: "Restoranid, kohvikud, baarid ja kohad, mis soovivad TLN Passiga koostööd teha." },
  { en: "Stripe checkout, subscription status, receipts or payment questions.", ru: "Stripe Checkout, статус подписки, чеки или вопросы оплаты.", ee: "Stripe Checkout, liikmesuse staatus, kviitungid või makseküsimused." },
  { en: "General questions about TLN Pass, media or city partnerships.", ru: "Общие вопросы о TLN Pass, медиа или городских партнёрствах.", ee: "Üldised küsimused TLN Passi, meedia või linnapartnerluste kohta." },
  { en: "Choose the right mailbox below so the message lands with the right person from the start.", ru: "Выберите правильный адрес ниже, чтобы сообщение сразу попало к нужному человеку.", ee: "Vali allpool õige postkast, et sõnum jõuaks kohe õige inimeseni." },

  // Legal / FAQ / foundation pages
  { en: "Terms of Service", ru: "Условия использования", ee: "Kasutustingimused" },
  { en: "Privacy Policy", ru: "Политика конфиденциальности", ee: "Privaatsuspoliitika" },
  { en: "Updated", ru: "Обновлено", ee: "Uuendatud" },
  { en: "Questions before using TLN Pass.", ru: "Вопросы перед использованием TLN Pass.", ee: "Küsimused enne TLN Passi kasutamist." },
  { en: "Members", ru: "Участникам", ee: "Liikmetele" },
  { en: "Partners", ru: "Партнёрам", ee: "Partneritele" },
  { en: "Collections coming soon.", ru: "Подборки скоро появятся.", ee: "Kogumikud tulevad peagi." },
  { en: "Approved partners will appear here after they are added in admin.", ru: "Одобренные партнёры появятся здесь после добавления в админке.", ee: "Kinnitatud partnerid ilmuvad siia pärast adminis lisamist." },
  { en: "Tallinn map", ru: "Карта Таллинна", ee: "Tallinna kaart" },
  { en: "Interactive map coming soon.", ru: "Интерактивная карта скоро появится.", ee: "Interaktiivne kaart tuleb peagi." },
  { en: "Nearby guide", ru: "Гид поблизости", ee: "Lähedal olev giid" },
  { en: "Open partners in maps.", ru: "Открывай партнёров на карте.", ee: "Ava partnerid kaardil." },
  { en: "Open page", ru: "Открыть страницу", ee: "Ava leht" },
  { en: "Maps", ru: "Карты", ee: "Kaardid" },
  { en: "Map places coming soon.", ru: "Места на карте скоро появятся.", ee: "Kaardikohad tulevad peagi." },
  { en: "Add approved partners in admin and they will appear here.", ru: "Добавь одобренных партнёров в админке, и они появятся здесь.", ee: "Lisa kinnitatud partnerid adminis ja nad ilmuvad siia." },
  { en: "TLN Assistant", ru: "TLN Ассистент", ee: "TLN Assistent" },
  { en: "A smarter way to choose where to use your pass.", ru: "Более умный способ выбрать, где использовать pass.", ee: "Nutikam viis valida, kus oma passi kasutada." },
  { en: "Explore partners", ru: "Смотреть партнёров", ee: "Vaata partnereid" },
];

const translationsBySource = new Map<string, TranslationEntry>();

for (const entry of entries) {
  translationsBySource.set(entry.en, entry);
  translationsBySource.set(entry.ru, entry);
  translationsBySource.set(entry.ee, entry);
}

function getCookie(name: string) {
  if (typeof document === "undefined") return "";

  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];
}

function shouldSkipElement(element: Element | null) {
  if (!element) return true;

  const tag = element.tagName.toLowerCase();

  return ["script", "style", "textarea", "code", "pre"].includes(tag);
}

function translateText(value: string, lang: Lang) {
  const trimmed = value.trim();

  if (!trimmed) return value;

  const entry = translationsBySource.get(trimmed);

  if (!entry) return value;

  return value.replace(trimmed, entry[lang]);
}

function translateAttributes(root: ParentNode, lang: Lang) {
  const elements = root.querySelectorAll("input[placeholder], textarea[placeholder], img[alt], [aria-label], [title]");

  elements.forEach((element) => {
    ["placeholder", "alt", "aria-label", "title"].forEach((attr) => {
      const current = element.getAttribute(attr);

      if (!current) return;

      const entry = translationsBySource.get(current.trim());

      if (entry) {
        element.setAttribute(attr, entry[lang]);
      }
    });
  });
}

function translateNode(root: ParentNode, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;

    if (shouldSkipElement(node.parentElement)) continue;

    textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const translated = translateText(node.nodeValue || "", lang);

    if (translated !== node.nodeValue) {
      node.nodeValue = translated;
    }
  });

  translateAttributes(root, lang);
}

export default function PublicTranslationLayer() {
  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith("/admin") || path.startsWith("/partner-dashboard")) {
      return;
    }

    const lang = normalizeLang(decodeURIComponent(getCookie("tln_lang") || "en"));

    if (lang === "en") {
      return;
    }

    translateNode(document.body, lang);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            textNode.nodeValue = translateText(textNode.nodeValue || "", lang);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            translateNode(node as Element, lang);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
