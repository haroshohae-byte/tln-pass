"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { languages, type Lang } from "../../lib/i18n";
import { setLanguage } from "./languageActions";

export default function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeLanguage(lang: Lang) {
    startTransition(async () => {
      await setLanguage(lang);
      router.refresh();
    });
  }

  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          disabled={pending}
          onClick={() => changeLanguage(language.code)}
          className={`rounded-full px-3 py-2 text-xs font-black transition ${
            currentLang === language.code
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
