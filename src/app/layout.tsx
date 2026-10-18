import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { noindex } from "@/lib/seo";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { personLd, websiteLd } from "@/lib/seo";

// Schriften werden beim Build selbst gehostet (kein Request an Google zur Laufzeit → DSGVO-freundlich).
const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Jost({ subsets: ["latin", "latin-ext"], variable: "--font-jost", display: "swap" });
const script = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-script-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Jane Hirsch · Brautstyling-Coaching & Make-up Artist in Weyhe bei Bremen",
    template: "%s | Jane Hirsch",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: site.locale, siteName: site.name, url: site.url },
  twitter: { card: "summary_large_image" },
  robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <head>
        {/* Ohne JavaScript bleiben alle Inhalte sichtbar */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Zum Inhalt springen
        </a>
        <MotionProvider>
          <CartProvider>
            <SiteChrome>
              <Header />
            </SiteChrome>
            <main id="inhalt">{children}</main>
            <SiteChrome>
              <Footer />
            </SiteChrome>
          </CartProvider>
        </MotionProvider>
        <JsonLd data={[websiteLd(), personLd()]} />
      </body>
    </html>
  );
}
