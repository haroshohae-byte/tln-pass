import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AnnouncementBanner from "./components/AnnouncementBanner";
import PublicTranslationLayer from "./components/PublicTranslationLayer";
import { normalizeLang } from "../lib/i18n";

export const metadata: Metadata = {
  title: "TLN Pass — Premium Tallinn Membership",
  description:
    "Exclusive membership club for restaurants, cafes, entertainment and local businesses in Tallinn.",
};

const browserInjectedAttributeCleaner = `
(function () {
  var injectedAttributes = ["__gcruniqueid"];
  function cleanNode(node) {
    if (!node || node.nodeType !== 1) return;
    for (var i = 0; i < injectedAttributes.length; i += 1) {
      if (node.hasAttribute && node.hasAttribute(injectedAttributes[i])) {
        node.removeAttribute(injectedAttributes[i]);
      }
    }
    if (node.querySelectorAll) {
      for (var j = 0; j < injectedAttributes.length; j += 1) {
        var matches = node.querySelectorAll("[" + injectedAttributes[j] + "]");
        for (var k = 0; k < matches.length; k += 1) {
          matches[k].removeAttribute(injectedAttributes[j]);
        }
      }
    }
  }
  function cleanDocument() {
    cleanNode(document.documentElement);
  }
  cleanDocument();
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i += 1) {
      var mutation = mutations[i];
      if (mutation.type === "attributes") {
        cleanNode(mutation.target);
      }
      if (mutation.addedNodes) {
        for (var j = 0; j < mutation.addedNodes.length; j += 1) {
          cleanNode(mutation.addedNodes[j]);
        }
      }
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: injectedAttributes
  });
  window.setTimeout(function () {
    cleanDocument();
    observer.disconnect();
  }, 10000);
})();
`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get("tln_lang")?.value);
  const htmlLang = lang === "ee" ? "et" : lang;

  return (
    <html lang={htmlLang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script
          id="browser-injected-attribute-cleaner"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: browserInjectedAttributeCleaner }}
        />
        <PublicTranslationLayer />
        <Header />
        <AnnouncementBanner />
        {children}
        <Footer />
      </body>
    </html>
  );
}
