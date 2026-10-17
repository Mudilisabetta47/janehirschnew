import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Faq, Service } from "@/content/services";

export const noindex = process.env.SITE_NOINDEX === "true";

type PageMeta = { title: string; description: string; path: string; type?: "website" | "article" };

/** Einheitliche Metadaten pro Seite: Title, Description, Canonical, Open Graph, Twitter. */
export function pageMetadata({ title, description, path, type = "website" }: PageMeta): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, locale: site.locale, url, siteName: site.name, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

const abs = (path: string) => `${site.url}${path}`;

export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": abs("/#jane-hirsch"),
    name: site.name,
    jobTitle: site.jobTitle,
    url: abs("/"),
    telephone: site.phone.tel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    sameAs: site.social.map((s) => s.href),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: abs("/"),
    name: site.name,
    inLanguage: "de-DE",
    publisher: { "@id": abs("/#jane-hirsch") },
  };
}

/** Angebot als Service. Preise nur, wenn im Bestand genannt (netto, siehe description). */
export function serviceLd(s: Service) {
  const priceMatch = s.price?.match(/[\d.]+/);
  const price = priceMatch ? priceMatch[0].replace(".", "") : null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.metaDescription,
    url: abs(`/coaching/${s.slug}`),
    serviceType: "Coaching Brautstyling",
    provider: { "@id": abs("/#jane-hirsch") },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "EUR",
            priceSpecification: { "@type": "PriceSpecification", price, priceCurrency: "EUR", valueAddedTaxIncluded: false },
            url: abs(`/coaching/${s.slug}`),
          },
        }
      : {}),
  };
}

export function faqLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** JSON für <script type="application/ld+json"> – "<" maskieren, damit nichts ausbrechen kann. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
