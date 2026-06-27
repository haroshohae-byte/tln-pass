"use client";

import { useMemo, useState } from "react";
import type { Lang } from "../../lib/i18n";
import type { PartnerCard } from "./page";

const heroImage =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90";

const text = {
  en: {
    badge: "TLN Pass partners",
    title: "A city guide for member benefits.",
    subtitle:
      "Search selected restaurants, cafes, bars and experiences in Tallinn.",
    search: "Search by name, offer, address...",
    all: "All",
    restaurants: "Restaurants",
    cafes: "Cafes",
    bars: "Bars",
    entertainment: "Entertainment",
    fitness: "Fitness",
    beauty: "Beauty",
    events: "Events",
    found: "partners found",
    open: "Open",
    noResults: "No partners found.",
    emptyText: "Try another search or category. New Tallinn partners are added regularly.",
    join: "Join Now",
  },
  ru: {
    badge: "Партнёры TLN Pass",
    title: "City guide для привилегий.",
    subtitle:
      "Ищи рестораны, кафе, бары и места в Таллине с benefits для участников.",
    search: "Поиск по названию, офферу, адресу...",
    all: "Все",
    restaurants: "Рестораны",
    cafes: "Кафе",
    bars: "Бары",
    entertainment: "Развлечения",
    fitness: "Фитнес",
    beauty: "Beauty",
    events: "События",
    found: "партнёров найдено",
    open: "Открыть",
    noResults: "Партнёры не найдены.",
    emptyText: "Попробуй другой поиск или категорию. Новые партнёры Tallinn добавляются регулярно.",
    join: "Купить",
  },
  ee: {
    badge: "TLN Pass partnerid",
    title: "City guide liikme eeliste jaoks.",
    subtitle:
      "Otsi valitud restorane, kohvikuid, baare ja elamusi Tallinnas.",
    search: "Otsi nime, pakkumise või aadressi järgi...",
    all: "Kõik",
    restaurants: "Restoranid",
    cafes: "Kohvikud",
    bars: "Baarid",
    entertainment: "Meelelahutus",
    fitness: "Fitness",
    beauty: "Ilu",
    events: "Üritused",
    found: "partnerit leitud",
    open: "Ava",
    noResults: "Partnereid ei leitud.",
    emptyText: "Proovi teist otsingut või kategooriat. Uusi Tallinna partnereid lisandub regulaarselt.",
    join: "Liitu",
  },
};

const categoryList = [
  { id: "all", key: "all" },
  { id: "restaurants", key: "restaurants" },
  { id: "cafes", key: "cafes" },
  { id: "bars", key: "bars" },
  { id: "entertainment", key: "entertainment" },
  { id: "fitness", key: "fitness" },
  { id: "beauty", key: "beauty" },
  { id: "events", key: "events" },
] as const;

function normalize(value: string | null | undefined) {
  return String(value || "").toLowerCase().trim();
}

function categoryMatches(partnerCategory: string, filter: string) {
  if (filter === "all") {
    return true;
  }

  const category = normalize(partnerCategory);

  if (filter === "restaurants") {
    return category.includes("restaurant") || category.includes("restoran");
  }

  if (filter === "cafes") {
    return category.includes("cafe") || category.includes("coffee") || category.includes("kohvik");
  }

  if (filter === "bars") {
    return category.includes("bar") || category.includes("pub") || category.includes("cocktail");
  }

  if (filter === "entertainment") {
    return category.includes("entertainment") || category.includes("experience") || category.includes("activity");
  }

  if (filter === "fitness") {
    return category.includes("fitness") || category.includes("gym") || category.includes("sport");
  }

  if (filter === "beauty") {
    return category.includes("beauty") || category.includes("spa") || category.includes("salon");
  }

  if (filter === "events") {
    return category.includes("event") || category.includes("club");
  }

  return category.includes(filter);
}

export default function PartnersClient({
  partners,
  currentLang,
  initialCategory,
  initialSearch,
}: {
  partners: PartnerCard[];
  currentLang: Lang;
  initialCategory: string;
  initialSearch: string;
}) {
  const t = text[currentLang];
  const safeInitialCategory = categoryList.some(
    (category) => category.id === initialCategory
  )
    ? initialCategory
    : "all";

  const [activeCategory, setActiveCategory] = useState(safeInitialCategory);
  const [query, setQuery] = useState(initialSearch);

  const filteredPartners = useMemo(() => {
    const search = normalize(query);

    return partners.filter((partner) => {
      const matchesCategory = categoryMatches(partner.category, activeCategory);

      const searchText = normalize(
        [
          partner.business_name,
          partner.category,
          partner.address,
          partner.offer,
          partner.description,
        ]
          .filter(Boolean)
          .join(" ")
      );

      const matchesSearch = !search || searchText.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [partners, activeCategory, query]);

  function selectCategory(category: string) {
    setActiveCategory(category);

    const params = new URLSearchParams(window.location.search);

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    window.history.replaceState(
      null,
      "",
      params.toString() ? `/partners?${params.toString()}` : "/partners"
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-14 text-[#1d1d1f]">
      <section className="mx-auto max-w-7xl">
        <div className="fade-up overflow-hidden rounded-[2.4rem] bg-[#1d1d1f] text-white shadow-sm ring-1 ring-black/5">
          <div className="grid min-h-[360px] lg:grid-cols-[1fr_0.85fr]">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">
                {t.badge}
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                {t.title}
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-white/68">
                {t.subtitle}
              </p>
            </div>

            <div className="relative min-h-[240px]">
              <img
                src={heroImage}
                alt="Tallinn restaurant"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-30 mt-8 rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            className="mb-3 w-full rounded-[1.4rem] border border-black/10 bg-zinc-100 px-5 py-4 font-bold text-black outline-none placeholder:text-zinc-400 focus:border-black/25"
          />

          <div className="flex gap-2 overflow-x-auto">
            {categoryList.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                className={`min-w-max rounded-full px-5 py-3 text-sm font-black transition ${
                  activeCategory === category.id
                    ? "bg-black text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t[category.key]}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
          {filteredPartners.length} {t.found}
        </p>

        {filteredPartners.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => {
              const href = `/partners/${partner.slug || partner.id}`;

              return (
                <a
                  key={partner.id}
                  href={href}
                  className="group overflow-hidden rounded-[1.8rem] bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 bg-black sm:h-64">
                    {partner.image_url ? (
                      <img
                        src={partner.image_url}
                        alt={partner.business_name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-900 to-zinc-700" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <p className="mb-3 w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-xl">
                        {partner.category}
                      </p>

                      <h2 className="text-3xl font-black tracking-tight">
                        {partner.business_name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5">
                    {partner.offer && (
                      <p className="rounded-2xl bg-zinc-100 p-4 text-sm font-black text-zinc-700">
                        {partner.offer}
                      </p>
                    )}

                    {partner.address && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {partner.address}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <span className="rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                        TLN Pass
                      </span>
                      <span className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                        {t.open}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-[2.4rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-4xl font-black">{t.noResults}</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-600">
              {t.emptyText}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
