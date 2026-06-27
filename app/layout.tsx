import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AnnouncementBanner from "./components/AnnouncementBanner";
import PublicTranslationLayer from "./components/PublicTranslationLayer";

export const metadata: Metadata = {
  title: "TLN Pass — Premium Tallinn Membership",
  description:
    "Exclusive membership club for restaurants, cafes, entertainment and local businesses in Tallinn.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PublicTranslationLayer />
        <Header />
        <AnnouncementBanner />
        {children}
        <Footer />
      </body>
    </html>
  );
}
