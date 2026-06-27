"use server";

import { cookies } from "next/headers";
import { type Lang, normalizeLang } from "../../lib/i18n";

export async function setLanguage(lang: Lang) {
  const cookieStore = await cookies();

  cookieStore.set("tln_lang", normalizeLang(lang), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
